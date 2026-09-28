package utils

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"html"
	"io"
	"log"
	"net/http"
	"regexp"
	"strings"
	"time"
)

// TryoutMatrixRowEmailItem stores one matrix statement review row.
type TryoutMatrixRowEmailItem struct {
	Statement  string
	UserChoice string
	CorrectKey string
	IsCorrect  bool
}

// TryoutQuestionEmailItem stores question performance and explanation for email reports.
type TryoutQuestionEmailItem struct {
	QuestionNumber int
	QuestionText   string
	Difficulty     int
	StudentAnswer  string
	CorrectAnswer  string
	IsCorrect      bool
	Explanation    string
	AnsweringTips  string
	// Varian soal: "single", "mcma", atau "matrix".
	QuestionType string
	// Stimulus wacana (sudah HTML) + tubuh soal (sudah HTML bila dari editor).
	StimulusTitle string
	StimulusHTML  string
	BodyHTML      string
	// Semua kunci jawaban (untuk MCMA lebih dari satu).
	CorrectAnswers []string
	// Baris matriks (untuk varian matrix).
	MatrixRows []TryoutMatrixRowEmailItem
}

// TryoutMaterialEmailItem stores one recommended material (A..N) for the email.
type TryoutMaterialEmailItem struct {
	Title  string
	Reason string
}

// TryoutResultEmailData carries all data needed to render the detailed Tryout outcome email.
type TryoutResultEmailData struct {
	StudentEmail    string
	StudentName     string
	TryoutTitle     string
	Score           float64
	Accuracy        float64
	TotalQuestions  int
	AnsweredCount   int
	CorrectCount    int
	TimeTakenMin    int
	DurationMin     int
	StatusText      string
	Questions       []TryoutQuestionEmailItem
	Materials       []TryoutMaterialEmailItem
	Practices       []string
	FeedbackSummary string
}

// EmailSender defines the contract for sending transactional emails in SIMANTIK.
type EmailSender interface {
	SendRegistrationOTP(ctx context.Context, toEmail, otpCode string) error
	SendPasswordResetOTP(ctx context.Context, toEmail, otpCode string) error
	SendPasswordResetConfirmation(ctx context.Context, toEmail string) error
	SendTryoutResult(ctx context.Context, toEmail, studentName, tryoutTitle string, score, accuracy float64) error
	SendTryoutDetailedResult(ctx context.Context, data TryoutResultEmailData) error
}

// ResendConfig holds settings required for Resend REST API integration.
type ResendConfig struct {
	APIKey string
	From   string
}

type resendEmailSender struct {
	apiKey     string
	from       string
	httpClient *http.Client
}

// NewEmailSender constructs an EmailSender using Resend's REST API.
// If APIKey is empty (e.g. local dev without key), it falls back to a development logger.
func NewEmailSender(cfg ResendConfig) EmailSender {
	apiKey := strings.TrimSpace(cfg.APIKey)
	if apiKey == "" {
		return &logEmailSender{}
	}

	from := strings.TrimSpace(cfg.From)
	if from == "" {
		// Default Resend testing sender if custom domain not verified yet
		from = "SIMANTIK <onboarding@resend.dev>"
	}

	return &resendEmailSender{
		apiKey: apiKey,
		from:   from,
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

type resendSendEmailRequest struct {
	From    string   `json:"from"`
	To      []string `json:"to"`
	Subject string   `json:"subject"`
	HTML    string   `json:"html"`
}

type resendSendEmailResponse struct {
	ID      string `json:"id"`
	Message string `json:"message"`
	Name    string `json:"name"`
}

func (r *resendEmailSender) send(ctx context.Context, toEmail, subject, htmlBody string) error {
	payload := resendSendEmailRequest{
		From:    r.from,
		To:      []string{toEmail},
		Subject: subject,
		HTML:    htmlBody,
	}

	jsonBytes, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal email payload: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, "https://api.resend.com/emails", bytes.NewReader(jsonBytes))
	if err != nil {
		return fmt.Errorf("failed to create Resend request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+r.apiKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := r.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send email via Resend: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		respBody, _ := io.ReadAll(resp.Body)
		var resendErr resendSendEmailResponse
		_ = json.Unmarshal(respBody, &resendErr)
		errMsg := resendErr.Message
		if errMsg == "" {
			errMsg = string(respBody)
		}
		return fmt.Errorf("resend API error (%d): %s", resp.StatusCode, errMsg)
	}

	return nil
}

func (r *resendEmailSender) SendRegistrationOTP(ctx context.Context, toEmail, otpCode string) error {
	subject := "SIMANTIK - Kode OTP Verifikasi Pendaftaran"
	html := fmt.Sprintf(`
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
	<div style="text-align: center; margin-bottom: 24px;">
		<h1 style="color: #2563eb; margin: 0; font-size: 26px; font-weight: 700;">SIMANTIK</h1>
		<p style="color: #64748b; margin: 4px 0 0 0; font-size: 14px;">Platform Belajar & Tryout Literasi</p>
	</div>
	<div style="padding: 20px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #edf2f7;">
		<h2 style="color: #1e293b; margin-top: 0; font-size: 18px;">Verifikasi Pendaftaran Akun</h2>
		<p style="color: #475569; font-size: 14px; line-height: 1.6;">Halo,</p>
		<p style="color: #475569; font-size: 14px; line-height: 1.6;">Terima kasih telah mendaftar di SIMANTIK. Masukkan 6-digit kode verifikasi berikut untuk mengaktifkan akun Anda:</p>
		<div style="text-align: center; margin: 28px 0;">
			<span style="display: inline-block; background-color: #2563eb; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: 8px; padding: 12px 28px; border-radius: 8px;">%s</span>
		</div>
		<p style="color: #64748b; font-size: 13px; margin-bottom: 0;">Kode verifikasi ini berlaku selama <strong>10 menit</strong>. Demi keamanan, jangan berikan kode ini kepada siapapun.</p>
	</div>
	<div style="margin-top: 24px; text-align: center; color: #94a3b8; font-size: 12px;">
		<p style="margin: 0;">&copy; 2026 SIMANTIK. Seluruh hak cipta dilindungi.</p>
	</div>
</div>
`, otpCode)

	return r.send(ctx, toEmail, subject, html)
}

func (r *resendEmailSender) SendPasswordResetOTP(ctx context.Context, toEmail, otpCode string) error {
	subject := "SIMANTIK - Kode OTP Reset Kata Sandi"
	html := fmt.Sprintf(`
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
	<div style="text-align: center; margin-bottom: 24px;">
		<h1 style="color: #dc2626; margin: 0; font-size: 26px; font-weight: 700;">SIMANTIK</h1>
		<p style="color: #64748b; margin: 4px 0 0 0; font-size: 14px;">Reset Kata Sandi</p>
	</div>
	<div style="padding: 20px; background-color: #fef2f2; border-radius: 8px; border: 1px solid #fee2e2;">
		<h2 style="color: #991b1b; margin-top: 0; font-size: 18px;">Permintaan Reset Kata Sandi</h2>
		<p style="color: #475569; font-size: 14px; line-height: 1.6;">Halo,</p>
		<p style="color: #475569; font-size: 14px; line-height: 1.6;">Kami menerima permintaan untuk mereset kata sandi akun SIMANTIK Anda. Gunakan kode OTP berikut:</p>
		<div style="text-align: center; margin: 28px 0;">
			<span style="display: inline-block; background-color: #dc2626; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: 8px; padding: 12px 28px; border-radius: 8px;">%s</span>
		</div>
		<p style="color: #64748b; font-size: 13px; margin-bottom: 0;">Kode ini berlaku selama <strong>10 menit</strong>. Jika Anda tidak meminta reset kata sandi, abaikan email ini.</p>
	</div>
	<div style="margin-top: 24px; text-align: center; color: #94a3b8; font-size: 12px;">
		<p style="margin: 0;">&copy; 2026 SIMANTIK. Seluruh hak cipta dilindungi.</p>
	</div>
</div>
`, otpCode)

	return r.send(ctx, toEmail, subject, html)
}

func (r *resendEmailSender) SendPasswordResetConfirmation(ctx context.Context, toEmail string) error {
	subject := "SIMANTIK - Kata Sandi Berhasil Diperbarui"
	html := `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
	<div style="text-align: center; margin-bottom: 24px;">
		<h1 style="color: #16a34a; margin: 0; font-size: 26px; font-weight: 700;">SIMANTIK</h1>
	</div>
	<div style="padding: 20px; background-color: #f0fdf4; border-radius: 8px; border: 1px solid #dcfce7;">
		<h2 style="color: #166534; margin-top: 0; font-size: 18px;">Kata Sandi Berhasil Diubah</h2>
		<p style="color: #475569; font-size: 14px; line-height: 1.6;">Kata sandi akun SIMANTIK Anda telah berhasil diperbarui. Seluruh sesi login sebelumnya telah dinonaktifkan untuk keamanan.</p>
		<p style="color: #475569; font-size: 14px; line-height: 1.6;">Silakan masuk kembali menggunakan kata sandi baru Anda.</p>
	</div>
</div>`

	return r.send(ctx, toEmail, subject, html)
}

func (r *resendEmailSender) SendTryoutResult(ctx context.Context, toEmail, studentName, tryoutTitle string, score, accuracy float64) error {
	subject := fmt.Sprintf("SIMANTIK - Hasil Tryout: %s", tryoutTitle)
	html := fmt.Sprintf(`
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px 16px; background-color: #f1f5f9;">
	<!-- Header Banner -->
	<table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background-color: #134653; border-radius: 16px 16px 0 0; border-bottom: 2px solid #F5B731;">
		<tr>
			<td style="padding: 24px 28px;">
				<table role="presentation" width="100%%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="vertical-align: middle;">
							<div style="font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: 0.5px;">SIMAN<span style="color: #F5B731;">TIK</span></div>
							<div style="font-size: 11px; color: #A0C4CE; margin-top: 4px; font-weight: 500;">Platform Persiapan Mandiri TKA Bahasa Indonesia</div>
						</td>
						<td style="text-align: right; vertical-align: middle;">
							<span style="display: inline-block; background-color: rgba(45, 212, 191, 0.15); border: 1px solid #2DD4BF; color: #2DD4BF; font-size: 11px; font-weight: 800; padding: 5px 14px; border-radius: 9999px; letter-spacing: 1px; text-transform: uppercase;">
								HASIL TRYOUT
							</span>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>

	<!-- White Body Card -->
	<div style="background-color: #ffffff; padding: 28px 24px; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">
		<div style="display: inline-block; background-color: #EAF6F8; border: 1px solid #BCE3EB; color: #0F766E; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 9999px; margin-bottom: 12px;">
			&#10004; Asesmen Mandiri Telah Dinilai
		</div>
		<h1 style="color: #0F172A; font-size: 24px; font-weight: 900; margin: 0 0 6px 0; letter-spacing: -0.5px;">
			Hasil Tryout Kamu Sudah Tersedia
		</h1>
		<p style="color: #334155; font-size: 14px; font-weight: 700; margin: 0 0 4px 0;">Halo, %s!</p>
		<p style="color: #64748B; font-size: 13px; line-height: 1.6; margin: 0 0 20px 0;">
			Kamu telah menyelesaikan <strong>%s</strong>. Berikut ringkasan pencapaian akhir kamu untuk bahan evaluasi belajar.
		</p>

		<!-- Big Score Card -->
		<div style="background-color: #E6F5F8; border: 1px solid #BCE3EB; border-radius: 20px; padding: 28px 16px; text-align: center; margin: 16px 0 20px 0;">
			<div style="display: inline-block; background-color: #6B5610; color: #FEF08A; font-size: 10px; font-weight: 800; letter-spacing: 1px; padding: 4px 14px; border-radius: 9999px; text-transform: uppercase; margin-bottom: 12px;">
				&#9733; HASIL AKHIR TRYOUT
			</div>
			<div style="margin: 4px 0 2px 0;">
				<span style="font-size: 64px; font-weight: 900; color: #115E59; line-height: 1; letter-spacing: -2px;">%.0f</span>
				<span style="font-size: 26px; font-weight: 700; color: #64748B;">/100</span>
			</div>
			<p style="color: #475569; font-size: 12px; max-width: 440px; margin: 6px auto 16px auto; line-height: 1.5;">
				Akurasi pengerjaan Anda mencapai <strong>%.1f%%</strong>. Silakan masuk ke dashboard SIMANTIK untuk melihat evaluasi kompetensi lengkap dan rekomendasi materi pembelajaran.
			</p>
		</div>
	</div>

	<!-- Footer -->
	<div style="background-color: #E6F5F8; border-radius: 0 0 16px 16px; padding: 24px 20px; text-align: center; border: 1px solid #E2E8F0; border-top: 0;">
		<div style="font-size: 13px; font-weight: 900; color: #134653;">
			SIMANTIK <span style="font-weight: 500; color: #64748B;">&bull; Platform Persiapan Mandiri TKA Bahasa Indonesia</span>
		</div>
		<p style="color: #64748B; font-size: 11px; line-height: 1.5; margin: 8px auto; max-width: 480px;">
			Email ini dikirimkan secara otomatis setelah kamu menyelesaikan tryout mandiri di SIMANTIK. Mohon tidak membalas email ini secara langsung karena dikirim melalui kotak surat otomatis.
		</p>
		<div style="color: #94A3B8; font-size: 11px; font-weight: 600; margin-top: 12px;">
			&copy; 2026 Platform EdTech SMA / SMK Terpadu
		</div>
	</div>
</div>`, html.EscapeString(studentName), html.EscapeString(tryoutTitle), score, accuracy)

	return r.send(ctx, toEmail, subject, html)
}

var emailHTMLTagRegex = regexp.MustCompile(`(?i)</?[a-z][\s\S]*>`)

func emailHTMLOrEscaped(s string) string {
	if emailHTMLTagRegex.MatchString(s) {
		return s
	}
	return html.EscapeString(s)
}

func emailQuestionTypeLabel(t string) string {
	switch t {
	case "mcma":
		return "Pilihan Ganda Kompleks"
	case "matrix":
		return "Matriks"
	default:
		return "Pilihan Ganda"
	}
}

// renderEmailQuestionCard me-render satu kartu soal sesuai varian.
func renderEmailQuestionCard(q TryoutQuestionEmailItem) string {
	statusBadge := `<span style="display:inline-block; background-color:#FEE2E2; border:1px solid #FECDD3; color:#BE123C; font-size:11px; font-weight:800; padding:3px 12px; border-radius:9999px;">&#10008; Salah</span>`
	if q.IsCorrect {
		statusBadge = `<span style="display:inline-block; background-color:#E6F5F8; border:1px solid #99F6E4; color:#0F766E; font-size:11px; font-weight:800; padding:3px 12px; border-radius:9999px;">&#10004; Benar</span>`
	}

	stimulusHTML := ""
	if strings.TrimSpace(q.StimulusHTML) != "" {
		stimulusTitle := q.StimulusTitle
		if stimulusTitle == "" {
			stimulusTitle = "Wacana"
		}
		stimulusHTML = fmt.Sprintf(`
		<div style="background-color: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 10px; padding: 12px 14px; margin-bottom: 12px;">
			<div style="font-size: 11px; font-weight: 800; color: #0369A1; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">&#128214; %s</div>
			<div style="font-size: 12px; color: #334155; line-height: 1.6;">%s</div>
		</div>`, html.EscapeString(stimulusTitle), emailHTMLOrEscaped(q.StimulusHTML))
	}

	body := emailHTMLOrEscaped(q.BodyHTML)
	if body == "" {
		body = html.EscapeString(q.QuestionText)
	}

	answerBox := ""
	switch q.QuestionType {
	case "matrix":
		var rows strings.Builder
		for _, row := range q.MatrixRows {
			mark := `<span style="color:#BE123C; font-weight:800;">&#10008;</span>`
			if row.IsCorrect {
				mark = `<span style="color:#0F766E; font-weight:800;">&#10004;</span>`
			}
			rows.WriteString(fmt.Sprintf(`
			<tr>
				<td style="padding: 8px 10px; border-bottom: 1px solid #E2E8F0; font-size: 12px; color: #1E293B;">%s</td>
				<td style="padding: 8px 10px; border-bottom: 1px solid #E2E8F0; font-size: 12px; text-align: center; color: #0F766E; font-weight: 700;">%s</td>
				<td style="padding: 8px 10px; border-bottom: 1px solid #E2E8F0; font-size: 12px; text-align: center; color: #334155; font-weight: 700;">%s</td>
				<td style="padding: 8px 10px; border-bottom: 1px solid #E2E8F0; font-size: 12px; text-align: center;">%s</td>
			</tr>`,
				emailHTMLOrEscaped(row.Statement),
				html.EscapeString(row.UserChoice),
				html.EscapeString(row.CorrectKey),
				mark,
			))
		}
		answerBox = fmt.Sprintf(`
		<table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="border: 1px solid #E2E8F0; border-radius: 10px; overflow: hidden; margin-top: 4px;">
			<tr style="background-color: #F8FAFC;">
				<td style="padding: 8px 10px; font-size: 11px; font-weight: 800; color: #64748B;">Pernyataan</td>
				<td style="padding: 8px 10px; font-size: 11px; font-weight: 800; color: #64748B; text-align: center;">Pilihanmu</td>
				<td style="padding: 8px 10px; font-size: 11px; font-weight: 800; color: #64748B; text-align: center;">Kunci</td>
				<td style="padding: 8px 10px; font-size: 11px; font-weight: 800; color: #64748B; text-align: center;">Hasil</td>
			</tr>
			%s
		</table>`, rows.String())
	default:
		studentAnsText := strings.TrimSpace(q.StudentAnswer)
		if studentAnsText == "" {
			studentAnsText = "-"
		}
		if q.IsCorrect {
			answerBox = fmt.Sprintf(`
			<div style="background-color: #E6F5F8; border: 1px solid #99F6E4; border-radius: 10px; padding: 10px 14px; font-size: 12px; color: #0F766E;">
				<strong>&#10004; Jawaban Kamu:</strong> %s &bull; <span style="font-weight: 700;">Kunci Jawaban</span>
			</div>`, html.EscapeString(studentAnsText))
		} else {
			keys := q.CorrectAnswer
			if len(q.CorrectAnswers) > 1 {
				keys = strings.Join(q.CorrectAnswers, "; ")
			}
			answerBox = fmt.Sprintf(`
			<div style="background-color: #FEF2F2; border: 1px solid #FECDD3; border-radius: 10px; padding: 10px 14px; font-size: 12px; color: #991B1B; margin-bottom: 6px;">
				<strong>&#10008; Pilihanmu:</strong> %s <span style="font-size: 11px; color: #BE123C;">(Kurang Tepat - Bukan Kunci)</span>
			</div>
			<div style="background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 10px; padding: 10px 14px; font-size: 12px; color: #166534;">
				<strong>&#10004; Kunci Jawaban:</strong> %s
			</div>`, html.EscapeString(studentAnsText), html.EscapeString(keys))
		}
	}

	return fmt.Sprintf(`
	<div style="margin-bottom: 16px; padding: 18px; background-color: #ffffff; border: 1px solid #E2E8F0; border-radius: 16px;">
		<table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
			<tr>
				<td>
					<span style="font-size: 16px; font-weight: 900; color: #0F172A;">%02d</span>
					<span style="color: #CBD5E1; margin: 0 4px;">&bull;</span>
					<span style="background-color: #F1F5F9; color: #475569; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px;">Tingkat %d</span>
					<span style="color: #CBD5E1; margin: 0 4px;">&bull;</span>
					<span style="background-color: #EFF6FF; color: #1D4ED8; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px;">%s</span>
				</td>
				<td style="text-align: right;">
					%s
				</td>
			</tr>
		</table>
		%s
		<div style="font-size: 13px; font-weight: 700; color: #1E293B; line-height: 1.6; margin-bottom: 14px;">
			%s
		</div>
		%s
		%s
	</div>`,
		q.QuestionNumber,
		q.Difficulty,
		emailQuestionTypeLabel(q.QuestionType),
		statusBadge,
		stimulusHTML,
		body,
		answerBox,
		renderEmailExplanationInline(q),
	)
}

// renderEmailExplanationInline me-render pembahasan + tips di dalam kartu soal.
func renderEmailExplanationInline(q TryoutQuestionEmailItem) string {
	if q.Explanation == "" && q.AnsweringTips == "" {
		return ""
	}
	tipsContent := ""
	if q.AnsweringTips != "" {
		tipsContent = fmt.Sprintf(`
		<div style="margin-top: 8px; padding: 8px 12px; background-color: #FEFCE8; border-left: 3px solid #EAB308; border-radius: 6px; font-size: 11px; color: #854D0E;">
			<strong>Tips &amp; Trik:</strong> %s
		</div>`, html.EscapeString(q.AnsweringTips))
	}

	explanation := ""
	if q.Explanation != "" {
		explanation = fmt.Sprintf(`
		<div style="font-size: 12px; color: #334155; line-height: 1.6; margin-bottom: 4px;">
			<strong>Pembahasan:</strong> %s
		</div>`, emailHTMLOrEscaped(q.Explanation))
	}

	return fmt.Sprintf(`
	<div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px 16px; margin-top: 12px;">
		%s
		%s
	</div>`,
		explanation,
		tipsContent,
	)
}

// renderEmailFeedback me-render seksi umpan balik engine:
// materi A..N yang harus dipelajari + latihan yang harus dikerjakan.
func renderEmailFeedback(materials []TryoutMaterialEmailItem, practices []string, summary string) string {
	if len(materials) == 0 && len(practices) == 0 {
		return ""
	}
	var items strings.Builder
	for i, m := range materials {
		reason := ""
		if strings.TrimSpace(m.Reason) != "" {
			reason = fmt.Sprintf(`<div style="font-size: 11px; color: #64748B; margin-top: 4px; line-height: 1.5;">%s</div>`, html.EscapeString(m.Reason))
		}
		items.WriteString(fmt.Sprintf(`
		<div style="background-color: #ffffff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px 16px; margin-bottom: 10px;">
			<div style="font-size: 13px; font-weight: 800; color: #0F172A;">
				<span style="display: inline-block; min-width: 22px; height: 22px; background-color: #FEF3C7; color: #92400E; border-radius: 50%%; text-align: center; line-height: 22px; font-size: 11px; margin-right: 6px; padding: 0 4px;">%d</span>
				%s
			</div>
			%s
		</div>`,
			i+1,
			html.EscapeString(m.Title),
			reason,
		))
	}

	practiceHTML := ""
	if len(practices) > 0 {
		var rows strings.Builder
		for _, name := range practices {
			rows.WriteString(fmt.Sprintf(`
			<div style="background-color: #ffffff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 12px 16px; margin-bottom: 8px; font-size: 13px; font-weight: 700; color: #0F766E;">
				&#10004; Kerjakan latihan: %s
			</div>`, html.EscapeString(name)))
		}
		practiceHTML = fmt.Sprintf(`
		<div style="font-size: 13px; font-weight: 800; color: #0F172A; margin: 18px 0 10px 0;">Latihan yang perlu dikerjakan</div>
		%s`, rows.String())
	}

	summaryHTML := ""
	if strings.TrimSpace(summary) != "" {
		summaryHTML = fmt.Sprintf(`<p style="color: #334155; font-size: 13px; line-height: 1.6; margin: 0 0 14px 0;">%s</p>`, html.EscapeString(summary))
	}

	return fmt.Sprintf(`
	<div style="margin-top: 36px; padding-top: 24px; border-top: 1px dashed #CBD5E1;">
		<div style="font-size: 11px; font-weight: 900; color: #0F766E; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
			&#128218; UMPAN BALIK BELAJAR
		</div>
		<h2 style="color: #0F172A; font-size: 18px; font-weight: 900; margin: 0 0 4px 0;">Materi & Latihan Untukmu</h2>
		<p style="color: #64748B; font-size: 12px; margin: 0 0 14px 0;">Berdasarkan analisis jawabanmu, pelajari kembali materi berikut lalu kerjakan latihannya.</p>
		%s
		%s
		%s
	</div>`,
		summaryHTML,
		items.String(),
		practiceHTML,
	)
}

func (r *resendEmailSender) SendTryoutDetailedResult(ctx context.Context, data TryoutResultEmailData) error {
	subject := fmt.Sprintf("SIMANTIK - Hasil & Pembahasan Tryout: %s", data.TryoutTitle)

	totalQuestions := data.TotalQuestions
	if totalQuestions <= 0 && len(data.Questions) > 0 {
		totalQuestions = len(data.Questions)
	}
	answeredCount := data.AnsweredCount
	if answeredCount <= 0 {
		answeredCount = len(data.Questions)
	}
	correctCount := 0
	for _, q := range data.Questions {
		if q.IsCorrect {
			correctCount++
		}
	}
	incorrectCount := answeredCount - correctCount
	if incorrectCount < 0 {
		incorrectCount = 0
	}
	unansweredCount := totalQuestions - answeredCount
	if unansweredCount < 0 {
		unansweredCount = 0
	}

	timeTaken := data.TimeTakenMin
	if timeTaken < 0 {
		timeTaken = 0
	}
	durationMin := data.DurationMin
	statusText := data.StatusText
	if statusText == "" {
		statusText = "Selesai"
	}

	var questionsHTML strings.Builder

	for _, q := range data.Questions {
		questionsHTML.WriteString(renderEmailQuestionCard(q))
	}

	feedbackHTML := renderEmailFeedback(data.Materials, data.Practices, data.FeedbackSummary)

	htmlBody := fmt.Sprintf(`
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px 16px; background-color: #f1f5f9;">
	<!-- Header Banner -->
	<table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background-color: #134653; border-radius: 16px 16px 0 0; border-bottom: 2px solid #F5B731;">
		<tr>
			<td style="padding: 24px 28px;">
				<table role="presentation" width="100%%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="vertical-align: middle;">
							<div style="font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: 0.5px;">SIMAN<span style="color: #F5B731;">TIK</span></div>
							<div style="font-size: 11px; color: #A0C4CE; margin-top: 4px; font-weight: 500;">Platform Persiapan Mandiri TKA Bahasa Indonesia</div>
						</td>
						<td style="text-align: right; vertical-align: middle;">
							<span style="display: inline-block; background-color: rgba(45, 212, 191, 0.15); border: 1px solid #2DD4BF; color: #2DD4BF; font-size: 11px; font-weight: 800; padding: 5px 14px; border-radius: 9999px; letter-spacing: 1px; text-transform: uppercase;">
								HASIL TRYOUT
							</span>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>

	<!-- White Body Card -->
	<div style="background-color: #ffffff; padding: 28px 24px; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">
		<table role="presentation" width="100%%" cellpadding="0" cellspacing="0">
			<tr>
				<td style="vertical-align: top;">
					<div style="display: inline-block; background-color: #EAF6F8; border: 1px solid #BCE3EB; color: #0F766E; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 9999px; margin-bottom: 12px;">
						&#10004; Asesmen Mandiri Telah Dinilai
					</div>
					<h1 style="color: #0F172A; font-size: 24px; font-weight: 900; margin: 0 0 6px 0; letter-spacing: -0.5px;">
						Hasil Tryout Kamu Sudah Tersedia
					</h1>
					<p style="color: #334155; font-size: 14px; font-weight: 700; margin: 0 0 4px 0;">Halo, %s!</p>
					<p style="color: #64748B; font-size: 13px; line-height: 1.6; margin: 0; max-width: 440px;">
						Kamu telah menyelesaikan <strong>%s</strong>. Berikut ringkasan pencapaian dan rekapitulasi audit setiap butir soal untuk bahan evaluasi belajarmu.
					</p>
				</td>
				<td style="width: 100px; text-align: center; vertical-align: middle;">
					<div style="background-color: #EBF7FA; border: 1px solid #CFFAFE; border-radius: 16px; padding: 14px 8px; display: inline-block; width: 88px;">
						<div style="font-size: 28px; line-height: 1;">👤</div>
						<div style="font-size: 9px; font-weight: 900; color: #0F766E; text-transform: uppercase; margin-top: 6px; letter-spacing: 0.5px;">
							PESERTA
						</div>
					</div>
				</td>
			</tr>
		</table>

		<!-- 3 Metrics Cards -->
		<table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
			<tr>
				<td style="width: 32%%; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px 12px;">
					<div style="font-size: 10px; color: #64748B; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Jumlah Soal</div>
					<div style="font-size: 14px; font-weight: 900; color: #0F172A; margin-top: 3px;">%d Soal Lengkap</div>
				</td>
				<td style="width: 2%%;"></td>
				<td style="width: 32%%; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px 12px;">
					<div style="font-size: 10px; color: #64748B; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Waktu Pengerjaan</div>
					<div style="font-size: 14px; font-weight: 900; color: #0F172A; margin-top: 3px;">%d / %d Menit</div>
				</td>
				<td style="width: 2%%;"></td>
				<td style="width: 32%%; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px 12px;">
					<div style="font-size: 10px; color: #64748B; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Status Sesi</div>
					<div style="font-size: 14px; font-weight: 900; color: #0F766E; margin-top: 3px;">%s</div>
				</td>
			</tr>
		</table>

		<!-- Big Score Card -->
		<div style="background-color: #E6F5F8; border: 1px solid #BCE3EB; border-radius: 20px; padding: 28px 16px; text-align: center; margin: 24px 0;">
			<div style="display: inline-block; background-color: #6B5610; color: #FEF08A; font-size: 10px; font-weight: 800; letter-spacing: 1px; padding: 4px 14px; border-radius: 9999px; text-transform: uppercase; margin-bottom: 12px;">
				&#9733; HASIL AKHIR TRYOUT
			</div>
			<div style="margin: 4px 0 2px 0;">
				<span style="font-size: 64px; font-weight: 900; color: #115E59; line-height: 1; letter-spacing: -2px;">%.0f</span>
				<span style="font-size: 26px; font-weight: 700; color: #64748B;">/100</span>
			</div>
			<p style="color: #475569; font-size: 12px; max-width: 440px; margin: 6px auto 18px auto; line-height: 1.5;">
				Skor akhir dihitung berdasarkan bobot standar asesmen literasi Bahasa Indonesia TKA.
			</p>
			<table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
				<tr>
					<td style="background-color: #ffffff; border-radius: 9999px; padding: 7px 16px; font-size: 12px; font-weight: 800; color: #0F766E; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
						<span style="color: #0F766E; margin-right: 4px;">&#9679;</span> Benar: %d Soal
					</td>
					<td style="width: 8px;"></td>
					<td style="background-color: #ffffff; border-radius: 9999px; padding: 7px 16px; font-size: 12px; font-weight: 800; color: #BE123C; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
						<span style="color: #BE123C; margin-right: 4px;">&#9679;</span> Salah: %d Soal
					</td>
					<td style="width: 8px;"></td>
					<td style="background-color: #ffffff; border-radius: 9999px; padding: 7px 16px; font-size: 12px; font-weight: 800; color: #64748B; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
						<span style="color: #64748B; margin-right: 4px;">&#9679;</span> Tidak Dijawab: %d Soal
					</td>
				</tr>
			</table>
		</div>

		<!-- Detail Jawaban + Pembahasan Section -->
		<div style="margin-top: 28px;">
			<h2 style="color: #0F172A; font-size: 18px; font-weight: 900; margin: 0 0 4px 0;">Detail Jawaban & Pembahasan</h2>
			<p style="color: #64748B; font-size: 12px; margin: 0 0 18px 0;">%d dari %d soal terjawab (benar maupun salah). Setiap soal dilengkapi pembahasan dan tips menjawab.</p>
			%s
		</div>

		%s
	</div>

	<!-- Footer -->
	<div style="background-color: #E6F5F8; border-radius: 0 0 16px 16px; padding: 24px 20px; text-align: center; border: 1px solid #E2E8F0; border-top: 0;">
		<div style="font-size: 13px; font-weight: 900; color: #134653;">
			SIMANTIK <span style="font-weight: 500; color: #64748B;">&bull; Platform Persiapan Mandiri TKA Bahasa Indonesia</span>
		</div>
		<p style="color: #64748B; font-size: 11px; line-height: 1.5; margin: 8px auto; max-width: 480px;">
			Email ini dikirimkan secara otomatis setelah kamu menyelesaikan tryout mandiri di SIMANTIK. Mohon tidak membalas email ini secara langsung karena dikirim melalui kotak surat otomatis.
		</p>
		<div style="color: #94A3B8; font-size: 11px; font-weight: 600; margin-top: 12px;">
			&copy; 2026 Platform EdTech SMA / SMK Terpadu
		</div>
	</div>
</div>`,
		html.EscapeString(data.StudentName),
		html.EscapeString(data.TryoutTitle),
		totalQuestions,
		timeTaken,
		durationMin,
		statusText,
		data.Score,
		data.CorrectCount,
		incorrectCount,
		unansweredCount,
		answeredCount,
		totalQuestions,
		questionsHTML.String(),
		feedbackHTML,
	)

	return r.send(ctx, data.StudentEmail, subject, htmlBody)
}

// logEmailSender is a development & test fallback when no Resend API key is configured.
type logEmailSender struct{}

func (l *logEmailSender) SendRegistrationOTP(ctx context.Context, toEmail, otpCode string) error {
	log.Printf("[EMAIL-RESEND-DEV] Sending Registration OTP to %s: code=%s", toEmail, otpCode)
	return nil
}

func (l *logEmailSender) SendPasswordResetOTP(ctx context.Context, toEmail, otpCode string) error {
	log.Printf("[EMAIL-RESEND-DEV] Sending Password Reset OTP to %s: code=%s", toEmail, otpCode)
	return nil
}

func (l *logEmailSender) SendPasswordResetConfirmation(ctx context.Context, toEmail string) error {
	log.Printf("[EMAIL-RESEND-DEV] Sending Password Reset Confirmation to %s", toEmail)
	return nil
}

func (l *logEmailSender) SendTryoutResult(ctx context.Context, toEmail, studentName, tryoutTitle string, score, accuracy float64) error {
	log.Printf("[EMAIL-RESEND-DEV] Sending Tryout Result to %s (%s) for '%s': score=%.1f, accuracy=%.1f%%", toEmail, studentName, tryoutTitle, score, accuracy)
	return nil
}

func (l *logEmailSender) SendTryoutDetailedResult(ctx context.Context, data TryoutResultEmailData) error {
	log.Printf("[EMAIL-RESEND-DEV] Sending Detailed Tryout Result to %s (%s) for '%s': score=%.1f, accuracy=%.1f%%, questions=%d",
		data.StudentEmail, data.StudentName, data.TryoutTitle, data.Score, data.Accuracy, len(data.Questions))
	return nil
}
