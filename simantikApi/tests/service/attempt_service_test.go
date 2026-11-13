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

// ─── Mock: TryoutAttemptRepository ───────────────────────────────────────────

type mockTryoutAttemptRepo struct {
	repository.TryoutAttemptRepository
	attempts map[uuid.UUID]*models.TryoutAttempt
	answers  map[string]*models.StudentAnswer // key = "attemptID:questionID"
	aqs      map[uuid.UUID][]models.AttemptQuestion
}

func newMockAttemptRepo() *mockTryoutAttemptRepo {
	return &mockTryoutAttemptRepo{
		attempts: make(map[uuid.UUID]*models.TryoutAttempt),
		answers:  make(map[string]*models.StudentAnswer),
		aqs:      make(map[uuid.UUID][]models.AttemptQuestion),
	}
}

func (m *mockTryoutAttemptRepo) CreateAttempt(_ context.Context, a *models.TryoutAttempt) error {
	if a.ID == uuid.Nil {
		a.ID = uuid.New()
	}
	m.attempts[a.ID] = a
	return nil
}

func (m *mockTryoutAttemptRepo) FindAttemptByID(_ context.Context, id uuid.UUID) (*models.TryoutAttempt, error) {
	a, ok := m.attempts[id]
	if !ok {
		return nil, gorm.ErrRecordNotFound
	}
	return a, nil
}

func (m *mockTryoutAttemptRepo) UpdateAttempt(_ context.Context, a *models.TryoutAttempt) error {
	m.attempts[a.ID] = a
	return nil
}

func (m *mockTryoutAttemptRepo) BulkCreateAttemptQuestions(_ context.Context, aqs []models.AttemptQuestion) error {
	for _, aq := range aqs {
		if aq.ID == uuid.Nil {
			aq.ID = uuid.New()
		}
		m.aqs[aq.AttemptID] = append(m.aqs[aq.AttemptID], aq)
	}
	return nil
}

func (m *mockTryoutAttemptRepo) FindAttemptQuestions(_ context.Context, attemptID uuid.UUID) ([]models.AttemptQuestion, error) {
	return m.aqs[attemptID], nil
}

func (m *mockTryoutAttemptRepo) FindAttemptQuestionByNumber(_ context.Context, attemptID uuid.UUID, number int) (*models.AttemptQuestion, error) {
	for i, aq := range m.aqs[attemptID] {
		if aq.QuestionNumber == number {
			return &m.aqs[attemptID][i], nil
		}
	}
	return nil, gorm.ErrRecordNotFound
}

func (m *mockTryoutAttemptRepo) FindAttemptQuestionByQuestionID(_ context.Context, attemptID, questionID uuid.UUID) (*models.AttemptQuestion, error) {
	for i, aq := range m.aqs[attemptID] {
		if aq.QuestionID == questionID {
			return &m.aqs[attemptID][i], nil
		}
	}
	return nil, gorm.ErrRecordNotFound
}

func (m *mockTryoutAttemptRepo) FindAttemptQuestionsByQuestionIDs(_ context.Context, attemptID uuid.UUID, questionIDs []uuid.UUID) ([]models.AttemptQuestion, error) {
	set := make(map[uuid.UUID]bool, len(questionIDs))
	for _, id := range questionIDs {
		set[id] = true
	}
	var out []models.AttemptQuestion
	for _, aq := range m.aqs[attemptID] {
		if set[aq.QuestionID] {
			out = append(out, aq)
		}
	}
	return out, nil
}

func (m *mockTryoutAttemptRepo) UpdateAttemptQuestion(_ context.Context, aq *models.AttemptQuestion) error {
	for i, cur := range m.aqs[aq.AttemptID] {
		if cur.ID == aq.ID {
			m.aqs[aq.AttemptID][i] = *aq
			return nil
		}
	}
	return gorm.ErrRecordNotFound
}

func (m *mockTryoutAttemptRepo) CountAnswersBatch(_ context.Context, attemptIDs []uuid.UUID) (map[uuid.UUID]int64, error) {
	out := make(map[uuid.UUID]int64, len(attemptIDs))
	for _, id := range attemptIDs {
		var c int64
		for _, ans := range m.answers {
			if ans.AttemptID == id {
				c++
			}
		}
		out[id] = c
	}
	return out, nil
}

func (m *mockTryoutAttemptRepo) GetOptionCorrectness(_ context.Context, _ uuid.UUID) (bool, error) {
	return false, nil
}

func (m *mockTryoutAttemptRepo) FindQuestionDifficulties(_ context.Context, ids []uuid.UUID) (map[uuid.UUID]int, error) {
	out := make(map[uuid.UUID]int, len(ids))
	for i, id := range ids {
		out[id] = (i % 5) + 1
	}
	return out, nil
}

func (m *mockTryoutAttemptRepo) UpsertAnswer(_ context.Context, ans *models.StudentAnswer) error {
	key := ans.AttemptID.String() + ":" + ans.QuestionID.String()
	m.answers[key] = ans
	return nil
}

func (m *mockTryoutAttemptRepo) FindAnswer(_ context.Context, attemptID, questionID uuid.UUID) (*models.StudentAnswer, error) {
	key := attemptID.String() + ":" + questionID.String()
	ans, ok := m.answers[key]
	if !ok {
		return nil, gorm.ErrRecordNotFound
	}
	return ans, nil
}

func (m *mockTryoutAttemptRepo) FindAllAnswers(_ context.Context, attemptID uuid.UUID) ([]models.StudentAnswer, error) {
	var result []models.StudentAnswer
	for _, ans := range m.answers {
		if ans.AttemptID == attemptID {
			result = append(result, *ans)
		}
	}
	return result, nil
}

func (m *mockTryoutAttemptRepo) CountAnswers(_ context.Context, attemptID uuid.UUID) (int64, error) {
	var count int64
	for _, ans := range m.answers {
		if ans.AttemptID == attemptID {
			count++
		}
	}
	return count, nil
}

func (m *mockTryoutAttemptRepo) FindActiveAttempt(_ context.Context, userID, tryoutID uuid.UUID) (*models.TryoutAttempt, error) {
	for _, a := range m.attempts {
		if a.UserID == userID && a.TryoutID == tryoutID && a.Status == models.AttemptStatusInProgress {
			return a, nil
		}
	}
	return nil, gorm.ErrRecordNotFound
}

func (m *mockTryoutAttemptRepo) ListByUserID(_ context.Context, userID uuid.UUID, _ dto.MyAttemptsFilter) ([]models.TryoutAttempt, int64, error) {
	var result []models.TryoutAttempt
	for _, a := range m.attempts {
		if a.UserID == userID {
			result = append(result, *a)
		}
	}
	return result, int64(len(result)), nil
}

func (m *mockTryoutAttemptRepo) CountCompletedByUser(_ context.Context, userID uuid.UUID) (int64, error) {
	var count int64
	for _, a := range m.attempts {
		if a.UserID == userID && a.Status == models.AttemptStatusCompleted {
			count++
		}
	}
	return count, nil
}

// ─── Mock: TryoutRepository (shared with attempt tests) ──────────────────────

type mockTryoutRepoForAttempt struct {
	repository.TryoutRepository
	tryouts map[uuid.UUID]*models.Tryout
	poolIDs map[uuid.UUID][]uuid.UUID
}

func newMockTryoutRepoForAttempt() *mockTryoutRepoForAttempt {
	return &mockTryoutRepoForAttempt{
		tryouts: make(map[uuid.UUID]*models.Tryout),
		poolIDs: make(map[uuid.UUID][]uuid.UUID),
	}
}

func (m *mockTryoutRepoForAttempt) Create(_ context.Context, t *models.Tryout) error {
	if t.ID == uuid.Nil {
		t.ID = uuid.New()
	}
	m.tryouts[t.ID] = t
	return nil
}

func (m *mockTryoutRepoForAttempt) FindByID(_ context.Context, id uuid.UUID) (*models.Tryout, error) {
	t, ok := m.tryouts[id]
	if !ok {
		return nil, gorm.ErrRecordNotFound
	}
	return t, nil
}

func (m *mockTryoutRepoForAttempt) GetPoolQuestionIDs(_ context.Context, tryoutID uuid.UUID) ([]uuid.UUID, error) {
	return m.poolIDs[tryoutID], nil
}

func (m *mockTryoutRepoForAttempt) CountPoolQuestions(_ context.Context, tryoutID uuid.UUID) (int64, error) {
	return int64(len(m.poolIDs[tryoutID])), nil
}

// ─── Tests ────────────────────────────────────────────────────────────────────

func TestAttemptService_StartAndComplete(t *testing.T) {
	attemptRepo := newMockAttemptRepo()
	tryoutRepo := newMockTryoutRepoForAttempt()

	// Seed a published tryout with 3 questions in pool
	tryoutID := uuid.New()
	q1, q2, q3 := uuid.New(), uuid.New(), uuid.New()
	tryout := &models.Tryout{
		ID:              tryoutID,
		Title:           "Test Tryout",
		DurationSeconds: 300,
		Status:          models.ContentStatusPublished,
	}
	tryoutRepo.tryouts[tryoutID] = tryout
	tryoutRepo.poolIDs[tryoutID] = []uuid.UUID{q1, q2, q3}

	svc := service.NewTryoutAttemptService(nil, attemptRepo, tryoutRepo, nil, nil, nil)
	userID := uuid.New()
	ctx := context.Background()

	// Start attempt
	res, err := svc.StartAttempt(ctx, tryoutID, userID)
	if err != nil {
		t.Fatalf("StartAttempt failed: %v", err)
	}
	if res.TotalQuestions != 3 {
		t.Errorf("expected 3 questions, got %d", res.TotalQuestions)
	}
	if res.Status != string(models.AttemptStatusInProgress) {
		t.Errorf("expected in_progress status, got %s", res.Status)
	}

	attemptID := res.AttemptID

	// Verify attempt questions were created
	aqs, _ := attemptRepo.FindAttemptQuestions(ctx, attemptID)
	if len(aqs) != 3 {
		t.Errorf("expected 3 attempt questions, got %d", len(aqs))
	}

	// Submit answers (set 2 as correct)
	isCorrect := true
	isWrong := false
	score1 := 1.0
	score0 := 0.0

	attemptRepo.answers[attemptID.String()+":"+q1.String()] = &models.StudentAnswer{
		AttemptID:  attemptID,
		QuestionID: q1,
		IsCorrect:  &isCorrect,
		Score:      &score1,
	}
	attemptRepo.answers[attemptID.String()+":"+q2.String()] = &models.StudentAnswer{
		AttemptID:  attemptID,
		QuestionID: q2,
		IsCorrect:  &isCorrect,
		Score:      &score1,
	}
	attemptRepo.answers[attemptID.String()+":"+q3.String()] = &models.StudentAnswer{
		AttemptID:  attemptID,
		QuestionID: q3,
		IsCorrect:  &isWrong,
		Score:      &score0,
	}

	// Complete
	completeRes, err := svc.CompleteAttempt(ctx, attemptID, userID)
	if err != nil {
		t.Fatalf("CompleteAttempt failed: %v", err)
	}
	if completeRes.CorrectAnswers != 2 {
		t.Errorf("expected 2 correct, got %d", completeRes.CorrectAnswers)
	}
	// score = (2/3) * 100 ≈ 66.67
	if completeRes.Score < 66 || completeRes.Score > 67 {
		t.Errorf("unexpected score: %f", completeRes.Score)
	}
}

func TestAttemptService_DuplicateAttempt(t *testing.T) {
	attemptRepo := newMockAttemptRepo()
	tryoutRepo := newMockTryoutRepoForAttempt()

	tryoutID := uuid.New()
	tryout := &models.Tryout{
		ID:              tryoutID,
		DurationSeconds: 120,
		Status:          models.ContentStatusPublished,
	}
	tryoutRepo.tryouts[tryoutID] = tryout
	tryoutRepo.poolIDs[tryoutID] = []uuid.UUID{uuid.New(), uuid.New()}

	svc := service.NewTryoutAttemptService(nil, attemptRepo, tryoutRepo, nil, nil, nil)
	userID := uuid.New()
	ctx := context.Background()

	res1, err := svc.StartAttempt(ctx, tryoutID, userID)
	if err != nil {
		t.Fatalf("first StartAttempt failed: %v", err)
	}

	// Second attempt must resume without error
	res2, err := svc.StartAttempt(ctx, tryoutID, userID)
	if err != nil {
		t.Fatalf("expected success on duplicate resume attempt, got %v", err)
	}
	if res1.AttemptID != res2.AttemptID {
		t.Errorf("expected resumed AttemptID %v, got %v", res1.AttemptID, res2.AttemptID)
	}
}

func TestAttemptService_AnswerIdempotency(t *testing.T) {
	attemptRepo := newMockAttemptRepo()
	tryoutRepo := newMockTryoutRepoForAttempt()

	tryoutID := uuid.New()
	tryout := &models.Tryout{
		ID:              tryoutID,
		DurationSeconds: 300,
		Status:          models.ContentStatusPublished,
	}
	tryoutRepo.tryouts[tryoutID] = tryout
	qID := uuid.New()
	tryoutRepo.poolIDs[tryoutID] = []uuid.UUID{qID}

	svc := service.NewTryoutAttemptService(nil, attemptRepo, tryoutRepo, nil, nil, nil)
	userID := uuid.New()
	ctx := context.Background()

	res, err := svc.StartAttempt(ctx, tryoutID, userID)
	if err != nil {
		t.Fatalf("StartAttempt failed: %v", err)
	}
	attemptID := res.AttemptID

	// Upsert same answer twice
	isCorrect := false
	score0 := 0.0
	optID := uuid.New()
	ans := &models.StudentAnswer{
		AttemptID:        attemptID,
		QuestionID:       qID,
		SelectedOptionID: &optID,
		IsCorrect:        &isCorrect,
		Score:            &score0,
	}
	_ = attemptRepo.UpsertAnswer(ctx, ans)
	_ = attemptRepo.UpsertAnswer(ctx, ans) // second upsert

	count, _ := attemptRepo.CountAnswers(ctx, attemptID)
	if count != 1 {
		t.Errorf("expected 1 answer after idempotent upsert, got %d", count)
	}
}
