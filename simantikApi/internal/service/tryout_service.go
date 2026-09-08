package service

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
	"simantikApi/internal/repository"
)

// TryoutService defines business operations for the Tryout domain.
type TryoutService interface {
	CreateTryout(ctx context.Context, req dto.CreateTryoutRequest, createdByID uuid.UUID) (*dto.TryoutResponse, error)
	GetTryout(ctx context.Context, id uuid.UUID, isAdmin bool) (*dto.TryoutDetailResponse, error)
	UpdateTryout(ctx context.Context, id uuid.UUID, req dto.UpdateTryoutRequest, updatedByID uuid.UUID) (*dto.TryoutResponse, error)
	UpdateTryoutStatus(ctx context.Context, id uuid.UUID, status string, updatedByID uuid.UUID) (*dto.TryoutResponse, error)
	DeleteTryout(ctx context.Context, id uuid.UUID) error
	ListTryouts(ctx context.Context, filter dto.ListTryoutFilter, isAdmin bool) (*dto.PaginatedTryoutsResponse, error)
	AddQuestionsToPool(ctx context.Context, tryoutID uuid.UUID, req dto.AddTryoutQuestionsRequest) (*dto.TryoutDetailResponse, error)
	RemoveQuestionFromPool(ctx context.Context, tryoutID, questionID uuid.UUID) error
}

type tryoutService struct {
	repo repository.TryoutRepository
}

// NewTryoutService constructs a TryoutService backed by the provided repository.
func NewTryoutService(repo repository.TryoutRepository) TryoutService {
	return &tryoutService{repo: repo}
}

func (s *tryoutService) CreateTryout(ctx context.Context, req dto.CreateTryoutRequest, createdByID uuid.UUID) (*dto.TryoutResponse, error) {
	tryout := models.Tryout{
		Title:           req.Title,
		Description:     req.Description,
		DurationSeconds: req.DurationSeconds,
		TotalQuestions:  req.TotalQuestions,
		Status:          models.ContentStatusDraft,
		CreatedBy:       createdByID,
		UpdatedBy:       &createdByID,
	}

	if err := s.repo.Create(ctx, &tryout); err != nil {
		return nil, err
	}

	return s.mapToTryoutResponse(&tryout, 0), nil
}

func (s *tryoutService) GetTryout(ctx context.Context, id uuid.UUID, isAdmin bool) (*dto.TryoutDetailResponse, error) {
	tryout, err := s.repo.FindByIDWithQuestions(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrTryoutNotFound
		}
		return nil, err
	}

	if !isAdmin && tryout.Status != models.ContentStatusPublished {
		return nil, ErrTryoutNotFound
	}

	poolCount, err := s.repo.CountPoolQuestions(ctx, id)
	if err != nil {
		return nil, err
	}

	// tryout.Questions is []models.Question via many2many:tryout_questions
	// Build the TryoutQuestionResponse list from the pool question IDs
	poolIDs, err := s.repo.GetPoolQuestionIDs(ctx, id)
	if err != nil {
		return nil, err
	}

	qResponses := make([]dto.TryoutQuestionResponse, len(poolIDs))
	for i, qid := range poolIDs {
		qResponses[i] = dto.TryoutQuestionResponse{
			QuestionID:   qid,
			DisplayOrder: i + 1,
			ScoreWeight:  1.0,
		}
	}

	res := dto.TryoutDetailResponse{
		TryoutResponse: *s.mapToTryoutResponse(tryout, int(poolCount)),
		Questions:      qResponses,
	}

	return &res, nil
}

func (s *tryoutService) UpdateTryout(ctx context.Context, id uuid.UUID, req dto.UpdateTryoutRequest, updatedByID uuid.UUID) (*dto.TryoutResponse, error) {
	tryout, err := s.repo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrTryoutNotFound
		}
		return nil, err
	}

	if req.Title != "" {
		tryout.Title = req.Title
	}
	if req.Description != "" {
		tryout.Description = req.Description
	}
	if req.DurationSeconds > 0 {
		tryout.DurationSeconds = req.DurationSeconds
	}
	if req.TotalQuestions > 0 {
		tryout.TotalQuestions = req.TotalQuestions
	}
	tryout.UpdatedBy = &updatedByID

	if err := s.repo.Update(ctx, tryout); err != nil {
		return nil, err
	}

	poolCount, err := s.repo.CountPoolQuestions(ctx, id)
	if err != nil {
		return nil, err
	}

	return s.mapToTryoutResponse(tryout, int(poolCount)), nil
}

func (s *tryoutService) UpdateTryoutStatus(ctx context.Context, id uuid.UUID, status string, updatedByID uuid.UUID) (*dto.TryoutResponse, error) {
	tryout, err := s.repo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrTryoutNotFound
		}
		return nil, err
	}

	if status == string(models.ContentStatusPublished) {
		poolCount, err := s.repo.CountPoolQuestions(ctx, id)
		if err != nil {
			return nil, err
		}
		if poolCount < int64(tryout.TotalQuestions) {
			return nil, ErrInsufficientPool
		}
	}

	tryout.Status = models.ContentStatus(status)
	tryout.UpdatedBy = &updatedByID

	if err := s.repo.Update(ctx, tryout); err != nil {
		return nil, err
	}

	poolCount, err := s.repo.CountPoolQuestions(ctx, id)
	if err != nil {
		return nil, err
	}

	return s.mapToTryoutResponse(tryout, int(poolCount)), nil
}

func (s *tryoutService) DeleteTryout(ctx context.Context, id uuid.UUID) error {
	tryout, err := s.repo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrTryoutNotFound
		}
		return err
	}

	if tryout.Status != models.ContentStatusDraft {
		return ErrCannotDeletePublishedTryout
	}

	return s.repo.Delete(ctx, id)
}

func (s *tryoutService) ListTryouts(ctx context.Context, filter dto.ListTryoutFilter, isAdmin bool) (*dto.PaginatedTryoutsResponse, error) {
	var tryouts []models.Tryout
	var total int64
	var err error

	if isAdmin {
		tryouts, total, err = s.repo.List(ctx, filter)
	} else {
		tryouts, total, err = s.repo.ListPublished(ctx, filter)
	}

	if err != nil {
		return nil, err
	}

	items := make([]dto.TryoutResponse, len(tryouts))
	for i := range tryouts {
		poolCount, _ := s.repo.CountPoolQuestions(ctx, tryouts[i].ID)
		items[i] = *s.mapToTryoutResponse(&tryouts[i], int(poolCount))
	}

	return &dto.PaginatedTryoutsResponse{
		Tryouts: items,
		Total:   total,
		Limit:   filter.Limit,
		Offset:  filter.Offset,
	}, nil
}

func (s *tryoutService) AddQuestionsToPool(ctx context.Context, tryoutID uuid.UUID, req dto.AddTryoutQuestionsRequest) (*dto.TryoutDetailResponse, error) {
	_, err := s.repo.FindByID(ctx, tryoutID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrTryoutNotFound
		}
		return nil, err
	}

	if err := s.repo.AddQuestions(ctx, tryoutID, req.QuestionIDs); err != nil {
		return nil, err
	}

	return s.GetTryout(ctx, tryoutID, true)
}

func (s *tryoutService) RemoveQuestionFromPool(ctx context.Context, tryoutID, questionID uuid.UUID) error {
	_, err := s.repo.FindByID(ctx, tryoutID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrTryoutNotFound
		}
		return err
	}

	return s.repo.RemoveQuestion(ctx, tryoutID, questionID)
}

func (s *tryoutService) mapToTryoutResponse(t *models.Tryout, poolCount int) *dto.TryoutResponse {
	return &dto.TryoutResponse{
		ID:              t.ID,
		Title:           t.Title,
		Description:     t.Description,
		DurationSeconds: t.DurationSeconds,
		TotalQuestions:  t.TotalQuestions,
		Status:          string(t.Status),
		StartAt:         t.StartAt,
		EndAt:           t.EndAt,
		CreatedBy:       t.CreatedBy,
		CreatedAt:       t.CreatedAt,
		UpdatedAt:       t.UpdatedAt,
		PoolCount:       poolCount,
	}
}
