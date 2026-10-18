package service

import (
	"context"
	"fmt"
	"sort"
	"strings"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"simantikApi/internal/models"
)

// AnswerEvidence adalah satu butir jawaban yang sudah dinilai, lepas dari
// sumbernya (tryout StudentAnswer maupun practice PracticeAnswer).
// Engine ini murni (tanpa DB) agar mudah diuji dan dipakai ulang oleh
// complete attempt, pengirim email, maupun rekomendasi.
type AnswerEvidence struct {
	QuestionID         uuid.UUID
	CompetencyIDs      []uuid.UUID
	Difficulty         int // 1 (termudah) - 5 (tersulit)
	ResponseTimeSec    int // 0 bila tidak diketahui (practice)
	Answered           bool
	IsCorrect          bool
	SelectedWrongText  string // teks opsi salah yang dipilih (single-choice saja)
}

// CompetencyGap adalah celah penguasaan satu kompetensi hasil analisis data.
type CompetencyGap struct {
	CompetencyID           uuid.UUID
	CompetencyName         string
	Total                  int
	Correct                int
	Accuracy               float64 // 0-100
	GapScore               float64 // 0-100, porsi salah berbobot kesulitan
	AvgDifficultyWrong     float64
	AvgResponseTimeWrong   float64 // -1 bila tidak ada data waktu
	TopDistractor          string
	TopDistractorCount     int
	Trend                  string // improving|stable|declining|insufficient
	Level                  string // low|medium|high (ambang sama dengan evaluasi)
}

// MaterialSuggestion adalah materi A..N yang disarankan untuk satu celah.
type MaterialSuggestion struct {
	MaterialID   uuid.UUID
	Title        string
	CompetencyID uuid.UUID
	Reason       string
}

// AttemptFeedback adalah keluaran engine untuk satu attempt yang selesai.
type AttemptFeedback struct {
	Gaps                  []CompetencyGap // urut GapScore terbesar
	Materials             []MaterialSuggestion
	PracticeCompetencyIDs []uuid.UUID
	Summary               string
}

// competencyLevel menyamakan ambang dengan evaluasi (low<40, medium<70, high>=70).
func competencyLevel(score float64) string {
	if score >= 70 {
		return "high"
	} else if score >= 40 {
		return "medium"
	}
	return "low"
}

// BuildAttemptFeedback membangun feedback data-driven dari bukti jawaban.
//
//   - compNames: nama kompetensi per ID (untuk label).
//   - history: akurasi attempt-attempt sebelumnya per kompetensi (tanpa attempt ini).
//   - materials: daftar materi published per kompetensi (maks 2 dipakai per celah).
//   - maxMaterials: batas total materi A..N (0 = semua).
func BuildAttemptFeedback(
	evidences []AnswerEvidence,
	compNames map[uuid.UUID]string,
	history map[uuid.UUID][]float64,
	materials map[uuid.UUID][]MaterialSuggestion,
	maxMaterials int,
) AttemptFeedback {
	type accum struct {
		total, correct int
		diffSumAll    int
		diffSumWrong  int
		wrongCount    int
		timeSumWrong  int64
		timeKnown     int
		distractors   map[string]int
	}
	byComp := make(map[uuid.UUID]*accum)
	get := func(id uuid.UUID) *accum {
		a, ok := byComp[id]
		if !ok {
			a = &accum{distractors: make(map[string]int)}
			byComp[id] = a
		}
		return a
	}

	for _, ev := range evidences {
		if !ev.Answered || len(ev.CompetencyIDs) == 0 {
			continue
		}
		diff := ev.Difficulty
		if diff < 1 {
			diff = 1
		} else if diff > 5 {
			diff = 5
		}
		for _, cid := range ev.CompetencyIDs {
			a := get(cid)
			a.total++
			a.diffSumAll += diff
			if ev.IsCorrect {
				a.correct++
			} else {
				a.wrongCount++
				a.diffSumWrong += diff
				if ev.ResponseTimeSec > 0 {
					a.timeSumWrong += int64(ev.ResponseTimeSec)
					a.timeKnown++
				}
				if ev.SelectedWrongText != "" {
					a.distractors[ev.SelectedWrongText]++
				}
			}
		}
	}

	fb := AttemptFeedback{}
	for cid, a := range byComp {
		if a.total == 0 {
			continue
		}
		gap := CompetencyGap{
			CompetencyID:   cid,
			CompetencyName: compNames[cid],
			Total:          a.total,
			Correct:        a.correct,
		}
		if gap.CompetencyName == "" {
			gap.CompetencyName = "Kompetensi"
		}
		gap.Accuracy = float64(a.correct) / float64(a.total) * 100
		gap.Level = competencyLevel(gap.Accuracy)
		if a.diffSumAll > 0 {
			gap.GapScore = float64(a.diffSumWrong) / float64(a.diffSumAll) * 100
		}
		if a.wrongCount > 0 {
			gap.AvgDifficultyWrong = float64(a.diffSumWrong) / float64(a.wrongCount)
		}
		gap.AvgResponseTimeWrong = -1
		if a.timeKnown > 0 {
			gap.AvgResponseTimeWrong = float64(a.timeSumWrong) / float64(a.timeKnown)
		}
		for text, n := range a.distractors {
			if n > gap.TopDistractorCount {
				gap.TopDistractor = text
				gap.TopDistractorCount = n
			}
		}

		// Tren vs rata-rata histori (tanpa attempt ini).
		gap.Trend = "insufficient"
		if hist := history[cid]; len(hist) > 0 {
			sum := 0.0
			for _, v := range hist {
				sum += v
			}
			mean := sum / float64(len(hist))
			switch diff := gap.Accuracy - mean; {
			case diff > 10:
				gap.Trend = "improving"
			case diff < -10:
				gap.Trend = "declining"
			default:
				gap.Trend = "stable"
			}
		}

		fb.Gaps = append(fb.Gaps, gap)
	}

	sort.Slice(fb.Gaps, func(i, j int) bool {
		if fb.Gaps[i].GapScore == fb.Gaps[j].GapScore {
			return fb.Gaps[i].Accuracy < fb.Gaps[j].Accuracy
		}
		return fb.Gaps[i].GapScore > fb.Gaps[j].GapScore
	})

	// Susun materi A..N dari celah terbesar (low/medium dulu, lalu sisanya).
	ordered := append([]CompetencyGap{}, fb.Gaps...)
	sort.SliceStable(ordered, func(i, j int) bool {
		rank := func(level string) int {
			switch level {
			case "low":
				return 0
			case "medium":
				return 1
			default:
				return 2
			}
		}
		if rank(ordered[i].Level) == rank(ordered[j].Level) {
			return ordered[i].GapScore > ordered[j].GapScore
		}
		return rank(ordered[i].Level) < rank(ordered[j].Level)
	})

	seenCompetency := make(map[uuid.UUID]bool)
	for _, gap := range ordered {
		if maxMaterials > 0 && len(fb.Materials) >= maxMaterials {
			break
		}
		mats := materials[gap.CompetencyID]
		if len(mats) == 0 {
			continue
		}
		limit := 2
		if len(mats) < limit {
			limit = len(mats)
		}
		for i := 0; i < limit; i++ {
			if maxMaterials > 0 && len(fb.Materials) >= maxMaterials {
				break
			}
			m := mats[i]
			m.CompetencyID = gap.CompetencyID
			m.Reason = gapReason(gap)
			fb.Materials = append(fb.Materials, m)
		}
		if !seenCompetency[gap.CompetencyID] {
			seenCompetency[gap.CompetencyID] = true
			fb.PracticeCompetencyIDs = append(fb.PracticeCompetencyIDs, gap.CompetencyID)
		}
	}

	fb.Summary = feedbackSummary(fb.Gaps)
	return fb
}

// gapReason merangkai alasan berbasis data untuk satu celah.
func gapReason(gap CompetencyGap) string {
	var parts []string
	parts = append(parts, fmt.Sprintf("%d dari %d soal salah (akurasi %.0f%%)",
		gap.Total-gap.Correct, gap.Total, gap.Accuracy))
	if gap.AvgDifficultyWrong > 0 {
		parts = append(parts, fmt.Sprintf("rata-rata salah di tingkat %.1f", gap.AvgDifficultyWrong))
	}
	if gap.AvgResponseTimeWrong >= 0 {
		parts = append(parts, fmt.Sprintf("rata-rata %.0f detik per soal yang salah", gap.AvgResponseTimeWrong))
	}
	if gap.TopDistractor != "" {
		short := gap.TopDistractor
		if len([]rune(short)) > 60 {
			short = string([]rune(short)[:60]) + "..."
		}
		parts = append(parts, fmt.Sprintf("jebakan tersering: \"%s\" (%dx dipilih)", short, gap.TopDistractorCount))
	}
	switch gap.Trend {
	case "declining":
		parts = append(parts, "tren menurun dibanding attempt sebelumnya")
	case "improving":
		parts = append(parts, "tren membaik, pertahankan")
	}
	return strings.Join(parts, "; ")
}

func feedbackSummary(gaps []CompetencyGap) string {
	if len(gaps) == 0 {
		return "Belum ada data jawaban untuk dianalisis."
	}
	worst := gaps[0]
	if worst.Accuracy >= 100 {
		return "Semua soal terjawab benar. Pertahankan dengan latihan rutin."
	}
	return fmt.Sprintf("Fokus utama: %s (akurasi %.0f%% dari %d soal).",
		worst.CompetencyName, worst.Accuracy, worst.Total)
}

// StudentAnswerEvidences membangun evidences dari jawaban tryout.
func StudentAnswerEvidences(answers []models.StudentAnswer, qMap map[uuid.UUID]*models.Question) ([]AnswerEvidence, map[uuid.UUID]string) {
	evidences := make([]AnswerEvidence, 0, len(answers))
	compNames := make(map[uuid.UUID]string)
	for _, a := range answers {
		q, ok := qMap[a.QuestionID]
		if !ok || q == nil {
			continue
		}
		ev := AnswerEvidence{
			QuestionID:      a.QuestionID,
			Difficulty:      q.DifficultyLevel,
			ResponseTimeSec: a.ResponseTimeSeconds,
			Answered:        true,
		}
		if a.IsCorrect != nil && *a.IsCorrect {
			ev.IsCorrect = true
		}
		for _, c := range q.Competencies {
			ev.CompetencyIDs = append(ev.CompetencyIDs, c.ID)
			compNames[c.ID] = c.Name
		}
		if !ev.IsCorrect && a.SelectedOptionID != nil {
			for _, opt := range q.Options {
				if opt.ID == *a.SelectedOptionID {
					ev.SelectedWrongText = opt.OptionText
					break
				}
			}
		}
		evidences = append(evidences, ev)
	}
	return evidences, compNames
}

// PracticeAnswerEvidences membangun evidences dari jawaban practice
// (tanpa response time karena tidak disimpan).
func PracticeAnswerEvidences(answers []models.PracticeAnswer, qMap map[uuid.UUID]*models.Question) ([]AnswerEvidence, map[uuid.UUID]string) {
	evidences := make([]AnswerEvidence, 0, len(answers))
	compNames := make(map[uuid.UUID]string)
	for _, a := range answers {
		q, ok := qMap[a.QuestionID]
		if !ok || q == nil {
			continue
		}
		ev := AnswerEvidence{
			QuestionID: a.QuestionID,
			Difficulty: q.DifficultyLevel,
			Answered:   true,
		}
		if a.IsCorrect != nil && *a.IsCorrect {
			ev.IsCorrect = true
		}
		for _, c := range q.Competencies {
			ev.CompetencyIDs = append(ev.CompetencyIDs, c.ID)
			compNames[c.ID] = c.Name
		}
		if !ev.IsCorrect && a.SelectedOptionID != nil {
			for _, opt := range q.Options {
				if opt.ID == *a.SelectedOptionID {
					ev.SelectedWrongText = opt.OptionText
					break
				}
			}
		}
		evidences = append(evidences, ev)
	}
	return evidences, compNames
}

// FeedbackHistory mengambil akurasi attempt-attempt sebelumnya per kompetensi
// (maks 3 terakhir, tanpa evaluasi kini) untuk tren.
func FeedbackHistory(ctx context.Context, db *gorm.DB, userID, excludeEvalID uuid.UUID) map[uuid.UUID][]float64 {
	out := make(map[uuid.UUID][]float64)
	if db == nil {
		return out
	}
	var ces []models.CompetencyEvaluation
	_ = db.WithContext(ctx).
		Where("user_id = ? AND evaluation_id <> ?", userID, excludeEvalID).
		Order("created_at DESC").Limit(60).Find(&ces).Error
	tmp := make(map[uuid.UUID][]float64)
	for _, ce := range ces {
		tmp[ce.CompetencyID] = append(tmp[ce.CompetencyID], ce.Accuracy)
	}
	for cid, arr := range tmp {
		for i, j := 0, len(arr)-1; i < j; i, j = i+1, j-1 {
			arr[i], arr[j] = arr[j], arr[i]
		}
		if len(arr) > 3 {
			arr = arr[len(arr)-3:]
		}
		out[cid] = arr
	}
	return out
}

// BuildAndSaveFeedback menjalankan engine end-to-end (best-effort):
// histori -> materi -> BuildAttemptFeedback -> simpan rekomendasi.
func BuildAndSaveFeedback(
	ctx context.Context,
	db *gorm.DB,
	rec RecommendationService,
	userID, evalID uuid.UUID,
	evidences []AnswerEvidence,
	compNames map[uuid.UUID]string,
) AttemptFeedback {
	var fb AttemptFeedback
	if rec == nil || len(evidences) == 0 {
		return fb
	}
	compSet := make(map[uuid.UUID]bool)
	for _, ev := range evidences {
		for _, cid := range ev.CompetencyIDs {
			compSet[cid] = true
		}
	}
	compIDs := make([]uuid.UUID, 0, len(compSet))
	for cid := range compSet {
		compIDs = append(compIDs, cid)
	}
	history := FeedbackHistory(ctx, db, userID, evalID)
	mats, _ := rec.FeedbackMaterials(ctx, compIDs, 2)
	fb = BuildAttemptFeedback(evidences, compNames, history, mats, 6)
	_ = rec.SaveFeedbackRecommendations(ctx, userID, evalID, fb)
	return fb
}
