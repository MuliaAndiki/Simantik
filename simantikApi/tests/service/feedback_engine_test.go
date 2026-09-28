package service_test

import (
	"testing"

	"github.com/google/uuid"

	"simantikApi/internal/service"
)

func testFeedbackCompIDs(n int) []uuid.UUID {
	ids := make([]uuid.UUID, n)
	for i := range ids {
		ids[i] = uuid.New()
	}
	return ids
}

func TestBuildAttemptFeedback_GapOrdering(t *testing.T) {
	ids := testFeedbackCompIDs(2)
	compA, compB := ids[0], ids[1]

	evidences := []service.AnswerEvidence{
		// Kompetensi A: 1 benar dari 4, salah di tingkat sulit
		{QuestionID: uuid.New(), CompetencyIDs: []uuid.UUID{compA}, Difficulty: 2, Answered: true, IsCorrect: true},
		{QuestionID: uuid.New(), CompetencyIDs: []uuid.UUID{compA}, Difficulty: 4, Answered: true, ResponseTimeSec: 90, SelectedWrongText: "generalisasi berlebihan"},
		{QuestionID: uuid.New(), CompetencyIDs: []uuid.UUID{compA}, Difficulty: 5, Answered: true, ResponseTimeSec: 120, SelectedWrongText: "generalisasi berlebihan"},
		{QuestionID: uuid.New(), CompetencyIDs: []uuid.UUID{compA}, Difficulty: 4, Answered: true, ResponseTimeSec: 60},
		// Kompetensi B: semua benar
		{QuestionID: uuid.New(), CompetencyIDs: []uuid.UUID{compB}, Difficulty: 3, Answered: true, IsCorrect: true},
		{QuestionID: uuid.New(), CompetencyIDs: []uuid.UUID{compB}, Difficulty: 3, Answered: true, IsCorrect: true},
	}

	fb := service.BuildAttemptFeedback(evidences,
		map[uuid.UUID]string{compA: "Inferensial", compB: "Tekstual"},
		nil,
		map[uuid.UUID][]service.MaterialSuggestion{
			compA: {{MaterialID: uuid.New(), Title: "Materi A"}},
		},
		6,
	)

	if len(fb.Gaps) != 2 {
		t.Fatalf("want 2 gaps, got %d", len(fb.Gaps))
	}
	if fb.Gaps[0].CompetencyID != compA {
		t.Errorf("worst gap should be compA")
	}
	if fb.Gaps[0].Accuracy != 25 {
		t.Errorf("compA accuracy = %.1f, want 25", fb.Gaps[0].Accuracy)
	}
	if fb.Gaps[0].Level != "low" {
		t.Errorf("compA level = %s, want low", fb.Gaps[0].Level)
	}
	if fb.Gaps[0].TopDistractor != "generalisasi berlebihan" || fb.Gaps[0].TopDistractorCount != 2 {
		t.Errorf("top distractor = %q x%d", fb.Gaps[0].TopDistractor, fb.Gaps[0].TopDistractorCount)
	}
	if fb.Gaps[0].AvgResponseTimeWrong != 90 {
		t.Errorf("avg response time wrong = %.1f, want 90", fb.Gaps[0].AvgResponseTimeWrong)
	}
	if fb.Gaps[0].Trend != "insufficient" {
		t.Errorf("trend = %s, want insufficient", fb.Gaps[0].Trend)
	}
	if len(fb.Materials) != 1 || fb.Materials[0].Title != "Materi A" {
		t.Fatalf("materials = %+v, want 1 Materi A", fb.Materials)
	}
	if fb.Materials[0].Reason == "" {
		t.Errorf("material reason should not be empty")
	}
	if len(fb.PracticeCompetencyIDs) != 1 || fb.PracticeCompetencyIDs[0] != compA {
		t.Errorf("practice competency ids = %v", fb.PracticeCompetencyIDs)
	}
}

func TestBuildAttemptFeedback_Trend(t *testing.T) {
	comp := uuid.New()
	ev := []service.AnswerEvidence{
		{QuestionID: uuid.New(), CompetencyIDs: []uuid.UUID{comp}, Difficulty: 3, Answered: true, IsCorrect: true},
		{QuestionID: uuid.New(), CompetencyIDs: []uuid.UUID{comp}, Difficulty: 3, Answered: true, IsCorrect: true},
		{QuestionID: uuid.New(), CompetencyIDs: []uuid.UUID{comp}, Difficulty: 3, Answered: true},
		{QuestionID: uuid.New(), CompetencyIDs: []uuid.UUID{comp}, Difficulty: 3, Answered: true},
	}
	// akurasi kini 50 vs histori mean 90 -> declining
	fb := service.BuildAttemptFeedback(ev, map[uuid.UUID]string{comp: "C"}, map[uuid.UUID][]float64{comp: {90, 90}}, nil, 0)
	if fb.Gaps[0].Trend != "declining" {
		t.Errorf("trend = %s, want declining", fb.Gaps[0].Trend)
	}
	// akurasi kini 50 vs histori mean 45 -> stable
	fb = service.BuildAttemptFeedback(ev, map[uuid.UUID]string{comp: "C"}, map[uuid.UUID][]float64{comp: {45, 45}}, nil, 0)
	if fb.Gaps[0].Trend != "stable" {
		t.Errorf("trend = %s, want stable", fb.Gaps[0].Trend)
	}
}

func TestBuildAttemptFeedback_SkipsUnanswered(t *testing.T) {
	comp := uuid.New()
	ev := []service.AnswerEvidence{
		{QuestionID: uuid.New(), CompetencyIDs: []uuid.UUID{comp}, Difficulty: 3, Answered: false},
		{QuestionID: uuid.New(), CompetencyIDs: []uuid.UUID{comp}, Difficulty: 3, Answered: true, IsCorrect: true},
	}
	fb := service.BuildAttemptFeedback(ev, nil, nil, nil, 0)
	if len(fb.Gaps) != 1 || fb.Gaps[0].Total != 1 {
		t.Errorf("gaps = %+v, want 1 gap with total 1", fb.Gaps)
	}
}
