package utils

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"time"
)

// EmailSender defines the contract for sending transactional emails in SIMANTIK.
type EmailSender interface {
	SendRegistrationOTP(ctx context.Context, toEmail, otpCode string) error
	SendPasswordResetOTP(ctx context.Context, toEmail, otpCode string) error
	SendPasswordResetConfirmation(ctx context.Context, toEmail string) error
	SendTryoutResult(ctx context.Context, toEmail, studentName, tryoutTitle string, score, accuracy float64) error
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
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
	<div style="text-align: center; margin-bottom: 24px;">
		<h1 style="color: #0284c7; margin: 0; font-size: 26px; font-weight: 700;">SIMANTIK</h1>
		<p style="color: #64748b; font-size: 14px; margin-top: 4px;">Platform Pembelajaran &amp; Assessment</p>
	</div>
	<div style="padding: 20px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
		<h2 style="color: #1e293b; margin-top: 0; font-size: 18px;">Selamat, %s!</h2>
		<p style="color: #475569; font-size: 14px; line-height: 1.6;">Anda telah menyelesaikan <strong>%s</strong>. Berikut ringkasan performa Anda:</p>
		<div style="text-align: center; margin: 20px 0;">
			<div style="display: inline-block; background-color: #0284c7; color: #ffffff; padding: 12px 24px; border-radius: 8px;">
				<div style="font-size: 32px; font-weight: 800;">%.1f</div>
				<div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Skor Akhir</div>
			</div>
			<div style="display: inline-block; background-color: #0f766e; color: #ffffff; padding: 12px 24px; border-radius: 8px; margin-left: 12px;">
				<div style="font-size: 32px; font-weight: 800;">%.1f%%</div>
				<div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Akurasi</div>
			</div>
		</div>
		<p style="color: #64748b; font-size: 13px; margin-bottom: 0;">Silakan masuk ke akun SIMANTIK Anda untuk melihat evaluasi kompetensi lengkap, pembahasan soal, dan rekomendasi materi pembelajaran.</p>
	</div>
</div>`, studentName, tryoutTitle, score, accuracy)

	return r.send(ctx, toEmail, subject, html)
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
