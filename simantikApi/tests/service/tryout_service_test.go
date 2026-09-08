package service_test

import (
	"context"
	"testing"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
	"simantikApi/internal/repository"
	"simantikApi/internal/service"
)

// ─── Mock: TryoutRepository ───────────────────────────────────────────────────

type mockTryoutRepo struct {
	repository.TryoutRepository
	tryouts    map[uuid.UUID]*models.Tryout
	poolCounts map[uuid.UUID]int64
	poolIDs    map[uuid.UUID][]uuid.UUID
}

func newMockTryoutRepo() *mockTryoutRepo {
	return &mockTryoutRepo{
		tryouts:    make(map[uuid.UUID]*models.Tryout),
		poolCounts: make(map[uuid.UUID]int64),
		poolIDs:    make(map[uuid.UUID][]uuid.UUID),
	}
}

func (m *mockTryoutRepo) Create(_ context.Context, t *models.Tryout) error {
	if t.ID == uuid.Nil {
		t.ID = uuid.New()
	}
	m.tryouts[t.ID] = t
	return nil
}

func (m *mockTryoutRepo) FindByID(_ context.Context, id uuid.UUID) (*models.Tryout, error) {
	t, ok := m.tryouts[id]
	if !ok {
		return nil, gorm.ErrRecordNotFound
	}
	return t, nil
}

func (m *mockTryoutRepo) FindByIDWithQuestions(_ context.Context, id uuid.UUID) (*models.Tryout, error) {
	t, ok := m.tryouts[id]
	if !ok {
		return nil, gorm.ErrRecordNotFound
	}
	return t, nil
}

func (m *mockTryoutRepo) Update(_ context.Context, t *models.Tryout) error {
	m.tryouts[t.ID] = t
	return nil
}

func (m *mockTryoutRepo) Delete(_ context.Context, id uuid.UUID) error {
	delete(m.tryouts, id)
	return nil
}

func (m *mockTryoutRepo) List(_ context.Context, _ dto.ListTryoutFilter) ([]models.Tryout, int64, error) {
	var result []models.Tryout
	for _, t := range m.tryouts {
		result = append(result, *t)
	}
	return result, int64(len(result)), nil
}

func (m *mockTryoutRepo) ListPublished(_ context.Context, _ dto.ListTryoutFilter) ([]models.Tryout, int64, error) {
	var result []models.Tryout
	for _, t := range m.tryouts {
		if t.Status == models.ContentStatusPublished {
			result = append(result, *t)
		}
	}
	return result, int64(len(result)), nil
}

func (m *mockTryoutRepo) AddQuestions(_ context.Context, tryoutID uuid.UUID, questionIDs []uuid.UUID) error {
	m.poolIDs[tryoutID] = append(m.poolIDs[tryoutID], questionIDs...)
	m.poolCounts[tryoutID] = int64(len(m.poolIDs[tryoutID]))
	return nil
}

func (m *mockTryoutRepo) RemoveQuestion(_ context.Context, tryoutID, questionID uuid.UUID) error {
	ids := m.poolIDs[tryoutID]
	var updated []uuid.UUID
	for _, id := range ids {
		if id != questionID {
			updated = append(updated, id)
		}
	}
	m.poolIDs[tryoutID] = updated
	m.poolCounts[tryoutID] = int64(len(updated))
	return nil
}

func (m *mockTryoutRepo) CountPoolQuestions(_ context.Context, tryoutID uuid.UUID) (int64, error) {
	return m.poolCounts[tryoutID], nil
}

func (m *mockTryoutRepo) GetPoolQuestionIDs(_ context.Context, tryoutID uuid.UUID) ([]uuid.UUID, error) {
	return m.poolIDs[tryoutID], nil
}

// ─── Tests ────────────────────────────────────────────────────────────────────

func TestTryoutService_CRUD(t *testing.T) {
	repo := newMockTryoutRepo()
	svc := service.NewTryoutService(repo)
	ctx := context.Background()
	adminID := uuid.New()

	// Create
	req := dto.CreateTryoutRequest{
		Title:           "Math Tryout",
		Description:     "A test tryout",
		DurationSeconds: 3600,
		TotalQuestions:  10,
	}
	created, err := svc.CreateTryout(ctx, req, adminID)
	if err != nil {
		t.Fatalf("CreateTryout failed: %v", err)
	}
	if created.Title != "Math Tryout" {
		t.Errorf("expected title 'Math Tryout', got %s", created.Title)
	}
	if created.Status != "draft" {
		t.Errorf("expected status 'draft', got %s", created.Status)
	}

	tryoutID := created.ID

	// Get
	detail, err := svc.GetTryout(ctx, tryoutID, true)
	if err != nil {
		t.Fatalf("GetTryout failed: %v", err)
	}
	if detail.ID != tryoutID {
		t.Errorf("expected ID %s, got %s", tryoutID, detail.ID)
	}

	// Update
	updated, err := svc.UpdateTryout(ctx, tryoutID, dto.UpdateTryoutRequest{Title: "Updated Tryout"}, adminID)
	if err != nil {
		t.Fatalf("UpdateTryout failed: %v", err)
	}
	if updated.Title != "Updated Tryout" {
		t.Errorf("expected 'Updated Tryout', got %s", updated.Title)
	}

	// Delete
	if err := svc.DeleteTryout(ctx, tryoutID); err != nil {
		t.Fatalf("DeleteTryout failed: %v", err)
	}
	_, err = svc.GetTryout(ctx, tryoutID, true)
	if err == nil {
		t.Fatal("expected error after delete, got nil")
	}
}

func TestTryoutService_QuestionPool(t *testing.T) {
	repo := newMockTryoutRepo()
	svc := service.NewTryoutService(repo)
	ctx := context.Background()
	adminID := uuid.New()

	// Create draft tryout
	created, err := svc.CreateTryout(ctx, dto.CreateTryoutRequest{
		Title: "Pool Test", DurationSeconds: 1800, TotalQuestions: 3,
	}, adminID)
	if err != nil {
		t.Fatalf("CreateTryout failed: %v", err)
	}
	tryoutID := created.ID

	// Add questions
	q1, q2 := uuid.New(), uuid.New()
	_, err = svc.AddQuestionsToPool(ctx, tryoutID, dto.AddTryoutQuestionsRequest{
		QuestionIDs: []uuid.UUID{q1, q2},
	})
	if err != nil {
		t.Fatalf("AddQuestionsToPool failed: %v", err)
	}

	// Verify pool count
	detail, err := svc.GetTryout(ctx, tryoutID, true)
	if err != nil {
		t.Fatalf("GetTryout failed: %v", err)
	}
	if detail.PoolCount != 2 {
		t.Errorf("expected pool count 2, got %d", detail.PoolCount)
	}

	// Try to publish with insufficient pool (need 3, have 2)
	_, err = svc.UpdateTryoutStatus(ctx, tryoutID, "published", adminID)
	if err == nil {
		t.Fatal("expected ErrInsufficientPool, got nil")
	}
	if err != service.ErrInsufficientPool {
		t.Errorf("expected ErrInsufficientPool, got %v", err)
	}

	// Add one more and publish
	q3 := uuid.New()
	_, _ = svc.AddQuestionsToPool(ctx, tryoutID, dto.AddTryoutQuestionsRequest{
		QuestionIDs: []uuid.UUID{q3},
	})

	published, err := svc.UpdateTryoutStatus(ctx, tryoutID, "published", adminID)
	if err != nil {
		t.Fatalf("publish failed: %v", err)
	}
	if published.Status != "published" {
		t.Errorf("expected 'published', got %s", published.Status)
	}

	// Cannot delete a published tryout
	if err := svc.DeleteTryout(ctx, tryoutID); err == nil {
		t.Fatal("expected ErrCannotDeletePublishedTryout, got nil")
	}
}
