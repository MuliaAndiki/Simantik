package service

import (
	"encoding/json"
	"regexp"
	"strings"

	"github.com/google/uuid"

	"simantikApi/internal/models"
	"simantikApi/pkg/utils"
)

// Varian soal untuk render email & review.
const (
	EmailVariantSingle = "single"
	EmailVariantMCMA   = "mcma"
	EmailVariantMatrix = "matrix"
)

var wacanaPrefixRegex = regexp.MustCompile(`(?s)^\[WACANA:\s*(.*?)\]\n(.*)$`)

// ParseEmailWacana memecah "[WACANA: judul]\n<stimulus>\n\n<soal>".
// Mereturn judul, stimulus, dan tubuh soal (tanpa prefix).
func ParseEmailWacana(raw string) (title, stimulus, body string) {
	m := wacanaPrefixRegex.FindStringSubmatch(raw)
	if len(m) < 3 {
		return "", "", strings.TrimSpace(raw)
	}
	title = strings.TrimSpace(m[1])
	rest := m[2]
	if idx := strings.Index(rest, "\n\n"); idx >= 0 {
		stimulus = strings.TrimSpace(rest[:idx])
		body = strings.TrimSpace(rest[idx+2:])
	} else {
		stimulus = strings.TrimSpace(rest)
	}
	return title, stimulus, body
}

// DetectEmailVariant menentukan varian dari opsi soal.
func DetectEmailVariant(options []models.QuestionOption) string {
	hasMarker := false
	correctCount := 0
	for _, opt := range options {
		if KunciMarkerRegex.MatchString(opt.OptionText) {
			hasMarker = true
		}
		if opt.IsCorrect {
			correctCount++
		}
	}
	if hasMarker {
		return EmailVariantMatrix
	}
	if correctCount > 1 {
		return EmailVariantMCMA
	}
	return EmailVariantSingle
}

// humanizeEmailKey mengubah "TIDAK_SETUJU" menjadi "Tidak Setuju".
func humanizeEmailKey(key string) string {
	parts := strings.Split(NormalizeAnswerKey(key), "_")
	for i, w := range parts {
		if len(w) > 0 {
			parts[i] = strings.ToUpper(w[:1]) + strings.ToLower(w[1:])
		}
	}
	out := strings.Join(parts, " ")
	if out == "" {
		return "-"
	}
	return out
}

// stripKunciMarker membuang "[KUNCI: ...]" dari teks opsi.
func stripKunciMarker(text string) string {
	m := KunciMarkerRegex.FindStringSubmatch(text)
	if len(m) >= 2 {
		// potong marker di akhir
		if idx := strings.LastIndex(text, "[KUNCI:"); idx >= 0 {
			return strings.TrimSpace(text[:idx])
		}
	}
	return strings.TrimSpace(text)
}

// matrixKeyOf mengambil kunci ternormalisasi dari teks opsi.
func matrixKeyOf(text string) string {
	m := KunciMarkerRegex.FindStringSubmatch(text)
	if len(m) < 2 {
		return ""
	}
	return NormalizeAnswerKey(m[1])
}

// matrixAnswerMap mem-parse answer_data JSON {"optionID": "SETUJU"}.
func matrixAnswerMap(raw string) map[string]string {
	out := make(map[string]string)
	trimmed := strings.TrimSpace(raw)
	if trimmed == "" {
		return out
	}
	var parsed map[string]string
	if err := json.Unmarshal([]byte(trimmed), &parsed); err != nil {
		return out
	}
	for k, v := range parsed {
		out[strings.ToLower(k)] = v
	}
	return out
}

// BuildEmailQuestionItem membangun satu item email dari soal + jawaban.
// Mengembalikan (item, answered): answered=false untuk soal tak terjawab (dibuang).
func BuildEmailQuestionItem(
	questionNumber int,
	difficulty int,
	q *models.Question,
	ans *models.StudentAnswer,
) (utils.TryoutQuestionEmailItem, bool) {
	var item utils.TryoutQuestionEmailItem
	item.QuestionNumber = questionNumber
	item.Difficulty = difficulty
	if q == nil {
		return item, false
	}

	// Relasi stimulus diutamakan (soal tertaut menyimpan teks polos);
	// fallback ke marker embedded lama.
	if q.Stimulus != nil {
		item.StimulusTitle = q.Stimulus.Title
		item.StimulusHTML = q.Stimulus.Content
		item.BodyHTML = strings.TrimSpace(q.QuestionText)
		item.QuestionText = item.BodyHTML
	} else {
		title, stimulus, body := ParseEmailWacana(q.QuestionText)
		item.StimulusTitle = title
		item.StimulusHTML = stimulus
		item.BodyHTML = body
		item.QuestionText = body
	}

	variant := DetectEmailVariant(q.Options)
	item.QuestionType = variant

	hasAns := ans != nil
	answered := false
	if hasAns {
		if ans.SelectedOptionID != nil {
			answered = true
		} else if strings.TrimSpace(ans.AnswerData) != "" {
			// JSON map/array jawaban matriks/MCMA dihitung sebagai terjawab
			answered = true
		}
		if ans.IsCorrect != nil && *ans.IsCorrect {
			item.IsCorrect = true
		}
	}
	if !answered {
		return item, false
	}

	// Kunci jawaban
	var correctTexts []string
	for _, opt := range q.Options {
		if opt.IsCorrect {
			correctTexts = append(correctTexts, opt.OptionLabel+". "+opt.OptionText)
		}
	}
	item.CorrectAnswers = correctTexts
	if len(correctTexts) > 0 {
		item.CorrectAnswer = correctTexts[0]
	}

	switch variant {
	case EmailVariantMatrix:
		answerMap := map[string]string{}
		if hasAns {
			answerMap = matrixAnswerMap(ans.AnswerData)
		}
		for _, opt := range q.Options {
			key := matrixKeyOf(opt.OptionText)
			rawChoice, ok := answerMap[strings.ToLower(opt.ID.String())]
			userChoice := "-"
			rowCorrect := false
			if ok && strings.TrimSpace(rawChoice) != "" {
				userChoice = humanizeEmailKey(rawChoice)
				rowCorrect = NormalizeAnswerKey(rawChoice) == key
			}
			item.MatrixRows = append(item.MatrixRows, utils.TryoutMatrixRowEmailItem{
				Statement:  stripKunciMarker(opt.OptionText),
				UserChoice: userChoice,
				CorrectKey: humanizeEmailKey(key),
				IsCorrect:  rowCorrect,
			})
		}
		item.StudentAnswer = ""
		item.CorrectAnswer = ""
	default:
		// single & MCMA: jawaban siswa dari opsi terpilih
		if hasAns && ans.SelectedOptionID != nil {
			for _, opt := range q.Options {
				if opt.ID == *ans.SelectedOptionID {
					item.StudentAnswer = opt.OptionLabel + ". " + opt.OptionText
					break
				}
			}
		}
		if item.StudentAnswer == "" && hasAns && strings.TrimSpace(ans.AnswerData) != "" {
			// MCMA via answer_data array of IDs
			var ids []string
			if err := json.Unmarshal([]byte(strings.TrimSpace(ans.AnswerData)), &ids); err == nil {
				var picks []string
				for _, id := range ids {
					if pid, err := uuid.Parse(strings.Trim(id, "\"")); err == nil {
						for _, opt := range q.Options {
							if opt.ID == pid {
								picks = append(picks, opt.OptionLabel)
								break
							}
						}
					}
				}
				if len(picks) > 0 {
					item.StudentAnswer = strings.Join(picks, ", ")
				}
			} else {
				item.StudentAnswer = strings.TrimSpace(ans.AnswerData)
			}
		}
		if variant == EmailVariantMCMA && len(correctTexts) > 1 {
			item.CorrectAnswer = strings.Join(correctTexts, "; ")
		}
	}

	if q.Explanation != nil {
		item.Explanation = q.Explanation.Explanation
		item.AnsweringTips = q.Explanation.AnsweringTips
	}
	return item, true
}
