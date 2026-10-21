package service

import (
	"context"
	"crypto/sha256"
	"errors"
	"fmt"
	"regexp"
	"sort"
	"strings"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
	"simantikApi/internal/repository"
)

// wacanaMarker mirrors web/src/utils/wacana.ts:
// `[WACANA: <title>]\n<stimulus HTML>\n\n<question HTML>`.
var wacanaMarker = regexp.MustCompile(`(?s)^\[WACANA:\s*(.*?)\]\n([\s\S]*?)\n\n([\s\S]*)$`)

type StimulusService interface {
	CreateStimulus(ctx context.Context, req dto.CreateStimulusRequest, authorID uuid.UUID) (*dto.StimulusResponse, error)
	ListStimuli(ctx context.Context, filter dto.ListStimulusFilter) (*dto.PaginatedStimuliResponse, error)
	GetStimulus(ctx context.Context, id uuid.UUID) (*dto.StimulusResponse, error)
	UpdateStimulus(ctx context.Context, id uuid.UUID, req dto.UpdateStimulusRequest) (*dto.StimulusResponse, error)
	DeleteStimulus(ctx context.Context, id uuid.UUID) error
	// LinkQuestionToStimulus enforces the max-3 cap (hard) and returns a
	// level-spread warning (soft) for tryout pools.
	LinkQuestionToStimulus(ctx context.Context, stimulusID, questionID uuid.UUID) (*dto.LinkStimulusQuestionResponse, error)
	UnlinkQuestionFromStimulus(ctx context.Context, questionID uuid.UUID) error
	// BackfillStimuliFromMarkers extracts legacy embedded markers into shared
	// stimuli (dedupe by normalized content hash) and links questions.
	BackfillStimuliFromMarkers(ctx context.Context, authorID uuid.UUID) (created int, linked int, err error)
}

type stimulusService struct {
	stimulusRepo repository.StimulusRepository
	questionRepo repository.QuestionRepository
}

func NewStimulusService(
	stimulusRepo repository.StimulusRepository,
	questionRepo repository.QuestionRepository,
) StimulusService {
	return &stimulusService{stimulusRepo: stimulusRepo, questionRepo: questionRepo}
}

func (s *stimulusService) CreateStimulus(ctx context.Context, req dto.CreateStimulusRequest, authorID uuid.UUID) (*dto.StimulusResponse, error) {
	stimulus := &models.Stimulus{
		Title:       strings.TrimSpace(req.Title),
		Content:     req.Content,
		PackageID:   req.PackageID,
		PackageKind: req.PackageKind,
		CreatedBy:   authorID,
	}
	if err := s.stimulusRepo.Create(ctx, stimulus); err != nil {
		return nil, err
	}
	return s.GetStimulus(ctx, stimulus.ID)
}

func (s *stimulusService) ListStimuli(ctx context.Context, filter dto.ListStimulusFilter) (*dto.PaginatedStimuliResponse, error) {
	items, total, err := s.stimulusRepo.List(ctx, filter)
	if err != nil {
		return nil, err
	}

	res := make([]dto.StimulusResponse, 0, len(items))
	for i := range items {
		linked, _ := s.stimulusRepo.FindLinkedQuestions(ctx, items[i].ID)
		res = append(res, mapStimulusToResponse(&items[i], linked))
	}

	limit := filter.Limit
	if limit <= 0 {
		limit = 20
	}
	return &dto.PaginatedStimuliResponse{Stimuli: res, Total: total, Limit: limit, Offset: filter.Offset}, nil
}

func (s *stimulusService) GetStimulus(ctx context.Context, id uuid.UUID) (*dto.StimulusResponse, error) {
	stimulus, err := s.stimulusRepo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrStimulusNotFound
		}
		return nil, err
	}
	linked, _ := s.stimulusRepo.FindLinkedQuestions(ctx, id)
	res := mapStimulusToResponse(stimulus, linked)
	return &res, nil
}

func (s *stimulusService) UpdateStimulus(ctx context.Context, id uuid.UUID, req dto.UpdateStimulusRequest) (*dto.StimulusResponse, error) {
	stimulus, err := s.stimulusRepo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrStimulusNotFound
		}
		return nil, err
	}
	if req.Title != nil {
		stimulus.Title = strings.TrimSpace(*req.Title)
	}
	if req.Content != nil {
		stimulus.Content = *req.Content
	}
	if err := s.stimulusRepo.Update(ctx, stimulus); err != nil {
		return nil, err
	}
	return s.GetStimulus(ctx, id)
}

func (s *stimulusService) DeleteStimulus(ctx context.Context, id uuid.UUID) error {
	if _, err := s.stimulusRepo.FindByID(ctx, id); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrStimulusNotFound
		}
		return err
	 }
	// questions.stimulus_id has ON DELETE SET NULL: links dissolve, questions stay.
	return s.stimulusRepo.Delete(ctx, id)
}

// EnsureStimulusPackageScope rejects attaching a stimulus-bound question to
// a package when the stimulus is already used elsewhere.
func EnsureStimulusPackageScope(ctx context.Context, stimulusRepo repository.StimulusRepository, stimulusID uuid.UUID, kind string, packageID uuid.UUID) error {
	if stimulusRepo == nil {
		return nil
	}
	st, err := stimulusRepo.FindByID(ctx, stimulusID)
	if err == nil && st != nil && st.PackageID != nil && st.PackageKind != "" {
		if *st.PackageID != packageID || st.PackageKind != kind {
			return ErrStimulusUsedElsewhere
		}
	}
	refs, err := stimulusRepo.FindPackagesUsingStimulus(ctx, stimulusID)
	if err != nil {
		return err
	}
	for _, ref := range refs {
		if ref.PackageID == packageID && ref.Kind == kind {
			continue
		}
		return ErrStimulusUsedElsewhere
	}
	return nil
}

// EnsureQuestionsPackageScope verifies every stimulus-bound question in the
// batch may live in the given package. Questions without stimulus, or whose
// stimulus is unused / already used in THIS package, pass. Nil repos skip
// (isolated unit tests).
func EnsureQuestionsPackageScope(ctx context.Context, questionRepo repository.QuestionRepository, stimulusRepo repository.StimulusRepository, kind string, packageID uuid.UUID, questionIDs []uuid.UUID) error {
	if questionRepo == nil || stimulusRepo == nil {
		return nil
	}
	checked := map[uuid.UUID]bool{}
	for _, qid := range questionIDs {
		q, err := questionRepo.FindByID(ctx, qid)
		if err != nil || q == nil || q.StimulusID == nil {
			continue
		}
		if checked[*q.StimulusID] {
			continue
		}
		checked[*q.StimulusID] = true
		if err := EnsureStimulusPackageScope(ctx, stimulusRepo, *q.StimulusID, kind, packageID); err != nil {
			return err
		}
	}
	return nil
}

// ensureStimulusCapacity validates stimulus existence for question creation.
func ensureStimulusCapacity(ctx context.Context, repo repository.StimulusRepository, stimulusID uuid.UUID) error {
	if repo == nil {
		return nil
	}
	if _, err := repo.FindByID(ctx, stimulusID); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrStimulusNotFound
		}
		return err
	}
	return nil
}

func (s *stimulusService) LinkQuestionToStimulus(ctx context.Context, stimulusID, questionID uuid.UUID) (*dto.LinkStimulusQuestionResponse, error) {
	if _, err := s.stimulusRepo.FindByID(ctx, stimulusID); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrStimulusNotFound
		}
		return nil, err
	}

	linked, err := s.stimulusRepo.FindLinkedQuestions(ctx, stimulusID)
	if err != nil {
		return nil, err
	}
	for _, q := range linked {
		if q.ID == questionID {
			// Idempotent: already linked.
			return &dto.LinkStimulusQuestionResponse{StimulusID: stimulusID, QuestionID: questionID}, nil
		}
	}

	if err := s.questionRepo.SetStimulusID(ctx, questionID, &stimulusID); err != nil {
		return nil, err
	}

	// Warning menilai grup HASIL (termasuk soal yang baru ditautkan).
	resulting := append(append([]models.Question{}, linked...), models.Question{ID: questionID})
	if q, err := s.questionRepo.FindByID(ctx, questionID); err == nil && q != nil {
		resulting[len(resulting)-1].DifficultyLevel = q.DifficultyLevel
	}

	return &dto.LinkStimulusQuestionResponse{
		StimulusID: stimulusID,
		QuestionID: questionID,
		Warning:    levelSpreadWarning(resulting),
	}, nil
}

func (s *stimulusService) UnlinkQuestionFromStimulus(ctx context.Context, questionID uuid.UUID) error {
	return s.questionRepo.SetStimulusID(ctx, questionID, nil)
}

// levelSpreadWarning is a SOFT hint for tryout pools: same-level questions
// on one stimulus weaken adaptivity. Never blocks. Needs 2+ questions.
func levelSpreadWarning(linked []models.Question) string {
	if len(linked) < 2 {
		return ""
	}
	levels := map[int]bool{}
	for _, q := range linked {
		levels[q.DifficultyLevel] = true
	}
	if len(levels) <= 1 {
		return "semua soal pada stimulus ini berlevel sama — disarankan sebar level 1-5 untuk pool tryout adaptif"
	}
	return ""
}

func mapStimulusToResponse(s *models.Stimulus, linked []models.Question) dto.StimulusResponse {
	items := make([]dto.StimulusQuestionItem, 0, len(linked))
	levels := map[int]bool{}
	for _, q := range linked {
		items = append(items, dto.StimulusQuestionItem{ID: q.ID, DifficultyLevel: q.DifficultyLevel})
		levels[q.DifficultyLevel] = true
	}
	covered := make([]int, 0, len(levels))
	for level := range levels {
		covered = append(covered, level)
	}
	sort.Ints(covered)
	return dto.StimulusResponse{
		ID:            s.ID,
		Title:         s.Title,
		Content:       s.Content,
		PackageID:     s.PackageID,
		PackageKind:   s.PackageKind,
		QuestionCount: len(linked),
		LevelsCovered: covered,
		Questions:     items,
		CreatedBy:     s.CreatedBy,
		CreatedAt:     s.CreatedAt,
		UpdatedAt:     s.UpdatedAt,
	}
}

// parseWacanaMarker splits legacy "[WACANA: title]\nstimulus\n\nquestion".
func parseWacanaMarker(questionText string) (title, stimulus, body string, ok bool) {
	match := wacanaMarker.FindStringSubmatch(questionText)
	if match == nil {
		return "", "", "", false
	}
	return strings.TrimSpace(match[1]), strings.TrimSpace(match[2]), strings.TrimSpace(match[3]), true
}

// stimulusDedupeKey normalizes title+content for cross-question dedupe.
func stimulusDedupeKey(title, content string) string {
	normalize := func(s string) string {
		return strings.Join(strings.Fields(s), " ")
	}
	sum := sha256.Sum256([]byte(normalize(title) + "\n" + normalize(content)))
	return fmt.Sprintf("%x", sum)
}

func (s *stimulusService) BackfillStimuliFromMarkers(ctx context.Context, authorID uuid.UUID) (created int, linked int, err error) {
	const batchSize = 100
	byKey := make(map[string]*models.Stimulus)

	for offset := 0; ; offset += batchSize {
		questions, err := s.questionRepo.ListEmbeddedStimulusQuestions(ctx, batchSize, offset)
		if err != nil {
			return created, linked, err
		}
		if len(questions) == 0 {
			break
		}

		for i := range questions {
			q := &questions[i]
			title, content, body, ok := parseWacanaMarker(q.QuestionText)
			if !ok || content == "" {
				continue
			}
			if title == "" {
				title = "Stimulus Tanpa Judul"
			}

			key := stimulusDedupeKey(title, content)
			stimulus, exists := byKey[key]
			if !exists {
				stimulus = &models.Stimulus{Title: title, Content: content, CreatedBy: authorID}
				if err := s.stimulusRepo.Create(ctx, stimulus); err != nil {
					return created, linked, err
				}
				byKey[key] = stimulus
				created++
			}

			if err := s.questionRepo.SetStimulusID(ctx, q.ID, &stimulus.ID); err != nil {
				return created, linked, err
			}
			// Kupas marker: teks soal menjadi bodi polos (relasi yang tampil).
			if body != "" {
				if err := s.questionRepo.StripWacanaMarker(ctx, q.ID, body); err != nil {
					return created, linked, err
				}
			}
			linked++
		}

		if len(questions) < batchSize {
			break
		}
	}

	return created, linked, nil
}
