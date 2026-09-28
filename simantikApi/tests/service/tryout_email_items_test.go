package service_test

import (
	"testing"

	"github.com/google/uuid"

	"simantikApi/internal/models"
	"simantikApi/internal/service"
)

func TestParseEmailWacana(t *testing.T) {
	title, stimulus, body := service.ParseEmailWacana("[WACANA: Stimulus Wacana]\nMencoba Menggunakan&nbsp;<h3>Stimulus</h3>\n\nASDASD")
	if title != "Stimulus Wacana" {
		t.Errorf("title = %q", title)
	}
	if stimulus == "" || body != "ASDASD" {
		t.Errorf("stimulus = %q, body = %q", stimulus, body)
	}

	title, stimulus, body = service.ParseEmailWacana("soal polos")
	if title != "" || stimulus != "" || body != "soal polos" {
		t.Errorf("plain = %q %q %q", title, stimulus, body)
	}
}

func TestDetectEmailVariant(t *testing.T) {
	single := []models.QuestionOption{{IsCorrect: true}, {IsCorrect: false}}
	if got := service.DetectEmailVariant(single); got != service.EmailVariantSingle {
		t.Errorf("single = %s", got)
	}
	mcma := []models.QuestionOption{{IsCorrect: true}, {IsCorrect: true}, {IsCorrect: false}}
	if got := service.DetectEmailVariant(mcma); got != service.EmailVariantMCMA {
		t.Errorf("mcma = %s", got)
	}
	matrix := []models.QuestionOption{
		{OptionText: "adsasd [KUNCI: SETUJU]", IsCorrect: true},
		{OptionText: "asdasd [KUNCI: TIDAK SETUJU]", IsCorrect: true},
	}
	if got := service.DetectEmailVariant(matrix); got != service.EmailVariantMatrix {
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

	item, answered := service.BuildEmailQuestionItem(1, 3, q, ans)
	if !answered {
		t.Fatalf("matrix answered should be true")
	}
	if item.QuestionType != service.EmailVariantMatrix {
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
	if _, answered := service.BuildEmailQuestionItem(1, 1, q, nil); answered {
		t.Errorf("nil answer should be skipped")
	}
	empty := &models.StudentAnswer{AnswerData: ""}
	if _, answered := service.BuildEmailQuestionItem(1, 1, q, empty); answered {
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

	item, answered := service.BuildEmailQuestionItem(2, 2, q, ans)
	if !answered || item.QuestionType != service.EmailVariantMCMA {
		t.Fatalf("answered=%v type=%s", answered, item.QuestionType)
	}
	if len(item.CorrectAnswers) != 2 {
		t.Errorf("correct answers = %v", item.CorrectAnswers)
	}
	if item.StudentAnswer != "A, B" {
		t.Errorf("student answer = %q", item.StudentAnswer)
	}
}

func TestNormalizeAnswerKey(t *testing.T) {
	cases := map[string]string{
		"SETUJU":       "SETUJU",
		"TIDAK SETUJU": "TIDAK_SETUJU",
		"TIDAK_SETUJU": "TIDAK_SETUJU",
		"tidak tepat":  "TIDAK_TEPAT",
		" Benar ":      "BENAR",
	}
	for in, want := range cases {
		if got := service.NormalizeAnswerKey(in); got != want {
			t.Errorf("NormalizeAnswerKey(%q) = %q, want %q", in, got, want)
		}
	}
}

func TestKunciMarkerRegex(t *testing.T) {
	cases := map[string]string{
		"adsasd [KUNCI: SETUJU]":       "SETUJU",
		"asdasd [KUNCI: TIDAK SETUJU]": "TIDAK SETUJU",
		"x [kunci: benar]":             "benar",
		"plain option":                 "",
	}
	for in, want := range cases {
		m := service.KunciMarkerRegex.FindStringSubmatch(in)
		got := ""
		if len(m) >= 2 {
			got = m[1]
		}
		if got != want {
			t.Errorf("KunciMarkerRegex(%q) = %q, want %q", in, got, want)
		}
	}
}
