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

// ─── Mock: RecommendationRepository ──────────────────────────────────────────

type mockRecommendationRepo struct {
	repository.RecommendationRepository
	recs map[uuid.UUID]*models.Recommendation
}

func newMockRecommendationRepo() *mockRecommendationRepo {
	return &mockRecommendationRepo{
		recs: make(map[uuid.UUID]*models.Recommendation),
	}
}

func (m *mockRecommendationRepo) Create(_ context.Context, rec *models.Recommendation) error {
	if rec.ID == uuid.Nil {
		rec.ID = uuid.New()
	}
	m.recs[rec.ID] = rec
	return nil
}

func (m *mockRecommendationRepo) BulkCreate(_ context.Context, recs []models.Recommendation) error {
	for i := range recs {
		if recs[i].ID == uuid.Nil {
			recs[i].ID = uuid.New()
		}
		m.recs[recs[i].ID] = &recs[i]
	}
	return nil
}

func (m *mockRecommendationRepo) FindByID(_ context.Context, id uuid.UUID) (*models.Recommendation, error) {
	r, ok := m.recs[id]
	if !ok {
		return nil, gorm.ErrRecordNotFound
	}
	return r, nil
}

func (m *mockRecommendationRepo) ListByUserID(_ context.Context, userID uuid.UUID, _ dto.ListRecommendationFilter) ([]models.Recommendation, int64, error) {
	var result []models.Recommendation
	for _, r := range m.recs {
		if r.UserID == userID {
			result = append(result, *r)
		}
	}
	return result, int64(len(result)), nil
}

func (m *mockRecommendationRepo) DeleteByID(_ context.Context, id uuid.UUID) error {
	delete(m.recs, id)
	return nil
}

func (m *mockRecommendationRepo) DeleteByEvaluationID(_ context.Context, evalID uuid.UUID) error {
	for id, r := range m.recs {
		if r.EvaluationID != nil && *r.EvaluationID == evalID {
			delete(m.recs, id)
		}
	}
	return nil
}

// ─── Mock: MaterialRepository (for recommendations) ───────────────────────────

type mockMaterialRepoForRec struct {
	repository.MaterialRepository
	materials map[uuid.UUID]*models.Material
}

func newMockMaterialRepoForRec() *mockMaterialRepoForRec {
	return &mockMaterialRepoForRec{
		materials: make(map[uuid.UUID]*models.Material),
	}
}

func (m *mockMaterialRepoForRec) FindByCompetencyID(_ context.Context, compID uuid.UUID) ([]models.Material, error) {
	var result []models.Material
	for _, mat := range m.materials {
		if mat.CompetencyID != nil && *mat.CompetencyID == compID && mat.Status == models.ContentStatusPublished {
			result = append(result, *mat)
		}
	}
	return result, nil
}

// ─── Tests ────────────────────────────────────────────────────────────────────

func TestRecommendationService_GenerateForEvaluation(t *testing.T) {
	recRepo := newMockRecommendationRepo()
	evalRepo := newMockEvaluationRepo()
	matRepo := newMockMaterialRepoForRec()

	svc := service.NewRecommendationService(recRepo, evalRepo, matRepo)
	ctx := context.Background()

	userID := uuid.New()
	evalID := uuid.New()
	compWeakID := uuid.New()
	compStrongID := uuid.New()

	// Seed published material linked to weak competency
	matID := uuid.New()
	matRepo.materials[matID] = &models.Material{
		ID:           matID,
		CompetencyID: &compWeakID,
		Title:        "Pengenalan Pemahaman Inferensial",
		Status:       models.ContentStatusPublished,
	}

	// Seed evaluation with 1 weak competency and 1 strong competency
	eval := &models.Evaluation{
		ID:         evalID,
		UserID:     userID,
		SourceType: models.EvaluationSourceTryout,
		SourceID:   uuid.New(),
		Score:      60.0,
		Accuracy:   60.0,
		CompetencyEvaluations: []models.CompetencyEvaluation{
			{
				ID:             uuid.New(),
				EvaluationID:   evalID,
				UserID:         userID,
				CompetencyID:   compWeakID,
				TotalQuestions: 10,
				CorrectAnswers: 3,
				Score:          30.0,
				Accuracy:       30.0,
				Level:          models.PerformanceLevelLow, // Weak -> High priority
				Competency: &models.Competency{
					ID:   compWeakID,
					Code: "INFERENSIAL",
					Name: "Pemahaman Inferensial",
				},
			},
			{
				ID:             uuid.New(),
				EvaluationID:   evalID,
				UserID:         userID,
				CompetencyID:   compStrongID,
				TotalQuestions: 10,
				CorrectAnswers: 9,
				Score:          90.0,
				Accuracy:       90.0,
				Level:          models.PerformanceLevelHigh, // Strong -> No recommendation
				Competency: &models.Competency{
					ID:   compStrongID,
					Code: "TEKSTUAL",
					Name: "Pemahaman Tekstual",
				},
			},
		},
	}
	evalRepo.evals[evalID] = eval

	// Generate recommendations
	recs, err := svc.GenerateRecommendationsForEvaluation(ctx, evalID, userID)
	if err != nil {
		t.Fatalf("GenerateRecommendationsForEvaluation failed: %v", err)
	}

	if len(recs) != 1 {
		t.Fatalf("expected 1 recommendation for weak competency, got %d", len(recs))
	}

	r := recs[0]
	if r.CompetencyID != compWeakID {
		t.Errorf("expected recommendation for weak competency, got %s", r.CompetencyID)
	}
	if r.Priority != "high" {
		t.Errorf("expected high priority, got %s", r.Priority)
	}
	if r.MaterialID == nil || *r.MaterialID != matID {
		t.Errorf("expected material %s to be recommended", matID)
	}

	// Idempotency: generating again replaces old recommendations without duplicate entries
	recsAgain, err := svc.GenerateRecommendationsForEvaluation(ctx, evalID, userID)
	if err != nil {
		t.Fatalf("second generation failed: %v", err)
	}
	if len(recsAgain) != 1 {
		t.Fatalf("expected 1 recommendation after second run, got %d", len(recsAgain))
	}

	listRes, err := svc.GetStudentRecommendations(ctx, userID, dto.ListRecommendationFilter{})
	if err != nil {
		t.Fatalf("GetStudentRecommendations failed: %v", err)
	}
	if listRes.Total != 1 {
		t.Errorf("expected total 1 recommendation in store, got %d", listRes.Total)
	}
}

func TestRecommendationService_DismissRecommendation(t *testing.T) {
	recRepo := newMockRecommendationRepo()
	evalRepo := newMockEvaluationRepo()
	matRepo := newMockMaterialRepoForRec()

	svc := service.NewRecommendationService(recRepo, evalRepo, matRepo)
	ctx := context.Background()

	userID := uuid.New()
	otherUserID := uuid.New()
	recID := uuid.New()

	recRepo.recs[recID] = &models.Recommendation{
		ID:                 recID,
		UserID:             userID,
		CompetencyID:       uuid.New(),
		RecommendationText: "Test recommendation",
		Priority:           models.RecommendationPriorityHigh,
		CreatedAt:          time.Now(),
	}

	// Other user cannot dismiss
	err := svc.DismissRecommendation(ctx, recID, otherUserID)
	if err == nil {
		t.Fatal("expected ErrAttemptNotOwner, got nil")
	}
	if err != service.ErrAttemptNotOwner {
		t.Errorf("expected ErrAttemptNotOwner, got %v", err)
	}

	// Owner can dismiss
	err = svc.DismissRecommendation(ctx, recID, userID)
	if err != nil {
		t.Fatalf("DismissRecommendation failed: %v", err)
	}

	// Deleted
	_, err = recRepo.FindByID(ctx, recID)
	if err == nil {
		t.Fatal("expected record to be deleted")
	}
}
