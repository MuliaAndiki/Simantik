package service

import (
	"testing"

	"github.com/google/uuid"

	"simantikApi/internal/models"
)

func TestParseEmailWacana(t *testing.T) {
	title, stimulus, body := parseEmailWacana("[WACANA: Stimulus Wacana]\nMencoba Menggunakan&nbsp;<h3>Stimulus</h3>\n\nASDASD")
	if title != "Stimulus Wacana" {
		t.Errorf("title = %q", title)
	}
	if stimulus == "" || body != "ASDASD" {
		t.Errorf("stimulus = %q, body = %q", stimulus, body)
	}

	title, stimulus, body = parseEmailWacana("soal polos")
	if title != "" || stimulus != "" || body != "soal polos" {
		t.Errorf("plain = %q %q %q", title, stimulus, body)
	}
}

func TestDetectEmailVariant(t *testing.T) {
	single := []models.QuestionOption{{IsCorrect: true}, {IsCorrect: false}}
	if got := detectEmailVariant(single); got != emailVariantSingle {
		t.Errorf("single = %s", got)
	}
	mcma := []models.QuestionOption{{IsCorrect: true}, {IsCorrect: true}, {IsCorrect: false}}
	if got := detectEmailVariant(mcma); got != emailVariantMCMA {
		t.Errorf("mcma = %s", got)
	}
	matrix := []models.QuestionOption{
		{OptionText: "adsasd [KUNCI: SETUJU]", IsCorrect: true},
		{OptionText: "asdasd [KUNCI: TIDAK SETUJU]", IsCorrect: true},
	}
	if got := detectEmailVariant(matrix); got != emailVariantMatrix {
		t.Errorf("matrix = %s", got)
	}
}

func TestBuildEmailQuestionItem_Matrix(t *testing.T) {
	optA := models.QuestionOption{ID: uuid.New(), OptionLabel: "A", OptionText: "adsasd [KUNCI: SETUJU]", IsCorrect: true}
	optB := models.QuestionOption{ID: uuid.New(), OptionLabel: "B", OptionText: "asdasd [KUNCI: TIDAK SETUJU]", IsCorrect: true}
	q := &models.Question{
		QuestionText: "asdasd",
		Options:      []models.QuestionOption{optA, optB},
	}
	ans := &models.StudentAnswer{
		AnswerData: `{"` + optA.ID.String() + `":"SETUJU","` + optB.ID.String() + `":"TIDAK SETUJU"}`,
	}
	isCorrect := true
	ans.IsCorrect = &isCorrect

	item, answered := buildEmailQuestionItem(1, 3, q, ans)
	if !answered {
		t.Fatalf("matrix answered should be true")
	}
	if item.QuestionType != emailVariantMatrix {
		t.Errorf("type = %s", item.QuestionType)
	}
	if len(item.MatrixRows) != 2 {
		t.Fatalf("rows = %d", len(item.MatrixRows))
	}
	if item.MatrixRows[0].Statement != "adsasd" || item.MatrixRows[0].UserChoice != "Setuju" || item.MatrixRows[0].CorrectKey != "Setuju" || !item.MatrixRows[0].IsCorrect {
		t.Errorf("row0 = %+v", item.MatrixRows[0])
	}
	if item.MatrixRows[1].CorrectKey != "Tidak Setuju" {
		t.Errorf("row1 key = %s", item.MatrixRows[1].CorrectKey)
	}
}

func TestBuildEmailQuestionItem_SkipsUnanswered(t *testing.T) {
	q := &models.Question{QuestionText: "x"}
	if _, answered := buildEmailQuestionItem(1, 1, q, nil); answered {
		t.Errorf("nil answer should be skipped")
	}
	empty := &models.StudentAnswer{AnswerData: ""}
	if _, answered := buildEmailQuestionItem(1, 1, q, empty); answered {
		t.Errorf("empty answer should be skipped")
	}
}

func TestBuildEmailQuestionItem_MCMAKeys(t *testing.T) {
	optA := models.QuestionOption{ID: uuid.New(), OptionLabel: "A", OptionText: "satu", IsCorrect: true}
	optB := models.QuestionOption{ID: uuid.New(), OptionLabel: "B", OptionText: "dua", IsCorrect: true}
	optC := models.QuestionOption{ID: uuid.New(), OptionLabel: "C", OptionText: "tiga"}
	q := &models.Question{QuestionText: "pilih", Options: []models.QuestionOption{optA, optB, optC}}
	ans := &models.StudentAnswer{
		AnswerData: `["` + optA.ID.String() + `","` + optB.ID.String() + `"]`,
	}
	isCorrect := true
	ans.IsCorrect = &isCorrect

	item, answered := buildEmailQuestionItem(2, 2, q, ans)
	if !answered || item.QuestionType != emailVariantMCMA {
		t.Fatalf("answered=%v type=%s", answered, item.QuestionType)
	}
	if len(item.CorrectAnswers) != 2 {
		t.Errorf("correct answers = %v", item.CorrectAnswers)
	}
	if item.StudentAnswer != "A, B" {
		t.Errorf("student answer = %q", item.StudentAnswer)
	}
}
