package service_test

import (
	"context"
	"testing"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
	"simantikApi/internal/repository"
	"simantikApi/internal/service"
)

// ─── Mock: EvaluationRepository ──────────────────────────────────────────────

type mockEvaluationRepo struct {
	repository.EvaluationRepository
	evals map[uuid.UUID]*models.Evaluation
}

func newMockEvaluationRepo() *mockEvaluationRepo {
	return &mockEvaluationRepo{
		evals: make(map[uuid.UUID]*models.Evaluation),
	}
}

func (m *mockEvaluationRepo) Create(_ context.Context, eval *models.Evaluation) error {
	if eval.ID == uuid.Nil {
		eval.ID = uuid.New()
	}
	m.evals[eval.ID] = eval
	return nil
}

func (m *mockEvaluationRepo) FindByID(_ context.Context, id uuid.UUID) (*models.Evaluation, error) {
	eval, ok := m.evals[id]
	if !ok {
		return nil, gorm.ErrRecordNotFound
	}
	return eval, nil
}

func (m *mockEvaluationRepo) FindBySource(_ context.Context, sourceType models.EvaluationSourceType, sourceID uuid.UUID) (*models.Evaluation, error) {
	for _, e := range m.evals {
		if e.SourceType == sourceType && e.SourceID == sourceID {
			return e, nil
		}
	}
	return nil, gorm.ErrRecordNotFound
}

func (m *mockEvaluationRepo) ListByUserID(_ context.Context, userID uuid.UUID, _ dto.ListEvaluationFilter) ([]models.Evaluation, int64, error) {
	var result []models.Evaluation
	for _, e := range m.evals {
		if e.UserID == userID {
			result = append(result, *e)
		}
	}
	return result, int64(len(result)), nil
}

func (m *mockEvaluationRepo) GetCompetencyEvaluationsByUserID(_ context.Context, userID uuid.UUID) ([]models.CompetencyEvaluation, error) {
	var result []models.CompetencyEvaluation
	for _, e := range m.evals {
		if e.UserID == userID {
			result = append(result, e.CompetencyEvaluations...)
		}
	}
	return result, nil
}

// ─── Tests ────────────────────────────────────────────────────────────────────

func TestEvaluationService_GetEvaluation(t *testing.T) {
	evalRepo := newMockEvaluationRepo()
	attemptRepo := newMockAttemptRepo()
	tryoutRepo := newMockTryoutRepoForAttempt()

	svc := service.NewEvaluationService(evalRepo, attemptRepo, tryoutRepo, nil)
	ctx := context.Background()

	userID := uuid.New()
	otherUserID := uuid.New()
	evalID := uuid.New()
	attemptID := uuid.New()
	compID := uuid.New()

	eval := &models.Evaluation{
		ID:               evalID,
		UserID:           userID,
		SourceType:       models.EvaluationSourceTryout,
		SourceID:         attemptID,
		TotalQuestions:   10,
		CorrectAnswers:   8,
		IncorrectAnswers: 2,
		Score:            80.0,
		Accuracy:         80.0,
		CreatedAt:        time.Now(),
		CompetencyEvaluations: []models.CompetencyEvaluation{
			{
				ID:             uuid.New(),
				EvaluationID:   evalID,
				UserID:         userID,
				CompetencyID:   compID,
				TotalQuestions: 10,
				CorrectAnswers: 8,
				Score:          80.0,
				Accuracy:       80.0,
				Level:          models.PerformanceLevelHigh,
				Competency: &models.Competency{
					ID:   compID,
					Code: "TEKSTUAL",
					Name: "Pemahaman Tekstual",
				},
			},
		},
	}
	evalRepo.evals[evalID] = eval

	// 1. Success fetching own evaluation
	res, err := svc.GetEvaluationByID(ctx, evalID, userID)
	if err != nil {
		t.Fatalf("GetEvaluationByID failed: %v", err)
	}
	if res.Score != 80.0 {
		t.Errorf("expected score 80.0, got %f", res.Score)
	}
	if len(res.CompetencyEvaluations) != 1 {
		t.Fatalf("expected 1 competency evaluation, got %d", len(res.CompetencyEvaluations))
	}
	if res.CompetencyEvaluations[0].CompetencyCode != "TEKSTUAL" {
		t.Errorf("expected competency code TEKSTUAL, got %s", res.CompetencyEvaluations[0].CompetencyCode)
	}

	// 2. Forbidden fetching someone else's evaluation
	_, err = svc.GetEvaluationByID(ctx, evalID, otherUserID)
	if err == nil {
		t.Fatal("expected error for unauthorized access, got nil")
	}
	if err != service.ErrAttemptNotOwner {
		t.Errorf("expected ErrAttemptNotOwner, got %v", err)
	}
}

func TestEvaluationService_AttemptReviewSecurity(t *testing.T) {
	evalRepo := newMockEvaluationRepo()
	attemptRepo := newMockAttemptRepo()
	tryoutRepo := newMockTryoutRepoForAttempt()

	svc := service.NewEvaluationService(evalRepo, attemptRepo, tryoutRepo, nil)
	ctx := context.Background()

	userID := uuid.New()
	tryoutID := uuid.New()
	attemptID := uuid.New()

	// Attempt in progress
	attempt := &models.TryoutAttempt{
		ID:        attemptID,
		UserID:    userID,
		TryoutID:  tryoutID,
		Status:    models.AttemptStatusInProgress,
		StartedAt: time.Now(),
	}
	attemptRepo.attempts[attemptID] = attempt

	// 1. Cannot review while attempt is still in progress (prevents cheating)
	_, err := svc.GetAttemptReview(ctx, attemptID, userID)
	if err == nil {
		t.Fatal("expected ErrAttemptNotCompleted, got nil")
	}
	if err != service.ErrAttemptNotCompleted {
		t.Errorf("expected ErrAttemptNotCompleted, got %v", err)
	}

	// 2. Mark completed and review
	attempt.Status = models.AttemptStatusCompleted
	now := time.Now()
	attempt.SubmittedAt = &now
	score := 100.0
	attempt.Score = &score

	review, err := svc.GetAttemptReview(ctx, attemptID, userID)
	if err != nil {
		t.Fatalf("GetAttemptReview failed after completion: %v", err)
	}
	if review.Score != 100.0 {
		t.Errorf("expected review score 100.0, got %f", review.Score)
	}
}

func TestEvaluationService_CompetencyProfile(t *testing.T) {
	evalRepo := newMockEvaluationRepo()
	attemptRepo := newMockAttemptRepo()
	tryoutRepo := newMockTryoutRepoForAttempt()

	svc := service.NewEvaluationService(evalRepo, attemptRepo, tryoutRepo, nil)
	ctx := context.Background()

	userID := uuid.New()
	compStrong := uuid.New()
	compWeak := uuid.New()

	eval := &models.Evaluation{
		ID:         uuid.New(),
		UserID:     userID,
		SourceType: models.EvaluationSourceTryout,
		SourceID:   uuid.New(),
		Score:      60.0,
		Accuracy:   60.0,
		CompetencyEvaluations: []models.CompetencyEvaluation{
			{
				ID:             uuid.New(),
				UserID:         userID,
				CompetencyID:   compStrong,
				TotalQuestions: 10,
				CorrectAnswers: 9,
				Score:          90.0, // High -> Strength
				Accuracy:       90.0,
				Level:          models.PerformanceLevelHigh,
				Competency: &models.Competency{
					ID:   compStrong,
					Code: "INFERENSIAL",
					Name: "Pemahaman Inferensial",
				},
			},
			{
				ID:             uuid.New(),
				UserID:         userID,
				CompetencyID:   compWeak,
				TotalQuestions: 10,
				CorrectAnswers: 3,
				Score:          30.0, // Low -> Weakness
				Accuracy:       30.0,
				Level:          models.PerformanceLevelLow,
				Competency: &models.Competency{
					ID:   compWeak,
					Code: "APRESIASI",
					Name: "Evaluasi dan Apresiasi",
				},
			},
		},
	}
	evalRepo.evals[eval.ID] = eval

	profile, err := svc.GetStudentCompetencyProfile(ctx, userID)
	if err != nil {
		t.Fatalf("GetStudentCompetencyProfile failed: %v", err)
	}

	if len(profile.Strengths) != 1 || profile.Strengths[0] != "Pemahaman Inferensial" {
		t.Errorf("expected strength 'Pemahaman Inferensial', got %v", profile.Strengths)
	}

	if len(profile.Weaknesses) != 1 || profile.Weaknesses[0] != "Evaluasi dan Apresiasi" {
		t.Errorf("expected weakness 'Evaluasi dan Apresiasi', got %v", profile.Weaknesses)
	}
}
