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

// ─── Mock: PracticeRepository ────────────────────────────────────────────────

type mockPracticeRepo struct {
	repository.PracticeRepository
	packages     map[uuid.UUID]*models.PracticePackage
	packageQIDs  map[uuid.UUID][]uuid.UUID
	attempts     map[uuid.UUID]*models.Practice
	answers      map[uuid.UUID]map[uuid.UUID]*models.PracticeAnswer // practiceID -> questionID -> answer
}

func newMockPracticeRepo() *mockPracticeRepo {
	return &mockPracticeRepo{
		packages:    make(map[uuid.UUID]*models.PracticePackage),
		packageQIDs: make(map[uuid.UUID][]uuid.UUID),
		attempts:    make(map[uuid.UUID]*models.Practice),
		answers:     make(map[uuid.UUID]map[uuid.UUID]*models.PracticeAnswer),
	}
}

func (m *mockPracticeRepo) CreatePackage(_ context.Context, pkg *models.PracticePackage) error {
	if pkg.ID == uuid.Nil {
		pkg.ID = uuid.New()
	}
	m.packages[pkg.ID] = pkg
	return nil
}

func (m *mockPracticeRepo) FindPackageByID(_ context.Context, id uuid.UUID) (*models.PracticePackage, error) {
	pkg, ok := m.packages[id]
	if !ok {
		return nil, gorm.ErrRecordNotFound
	}
	return pkg, nil
}

func (m *mockPracticeRepo) FindPackageByIDWithQuestions(_ context.Context, id uuid.UUID) (*models.PracticePackage, error) {
	pkg, ok := m.packages[id]
	if !ok {
		return nil, gorm.ErrRecordNotFound
	}
	return pkg, nil
}

func (m *mockPracticeRepo) UpdatePackage(_ context.Context, pkg *models.PracticePackage) error {
	m.packages[pkg.ID] = pkg
	return nil
}

func (m *mockPracticeRepo) DeletePackage(_ context.Context, id uuid.UUID) error {
	delete(m.packages, id)
	return nil
}

func (m *mockPracticeRepo) ListPackages(_ context.Context, filter dto.ListPracticePackageFilter) ([]models.PracticePackage, int64, error) {
	var list []models.PracticePackage
	for _, p := range m.packages {
		if filter.Status != "" && string(p.Status) != filter.Status {
			continue
		}
		list = append(list, *p)
	}
	return list, int64(len(list)), nil
}

func (m *mockPracticeRepo) AddQuestionsToPackage(_ context.Context, packageID uuid.UUID, questionIDs []uuid.UUID) error {
	m.packageQIDs[packageID] = append(m.packageQIDs[packageID], questionIDs...)
	return nil
}

func (m *mockPracticeRepo) RemoveQuestionFromPackage(_ context.Context, packageID, questionID uuid.UUID) error {
	cur := m.packageQIDs[packageID]
	var next []uuid.UUID
	for _, id := range cur {
		if id != questionID {
			next = append(next, id)
		}
	}
	m.packageQIDs[packageID] = next
	return nil
}

func (m *mockPracticeRepo) CountPackageQuestions(_ context.Context, packageID uuid.UUID) (int64, error) {
	return int64(len(m.packageQIDs[packageID])), nil
}

func (m *mockPracticeRepo) GetPackageQuestionIDs(_ context.Context, packageID uuid.UUID) ([]uuid.UUID, error) {
	return m.packageQIDs[packageID], nil
}

func (m *mockPracticeRepo) CreateAttempt(_ context.Context, attempt *models.Practice) error {
	if attempt.ID == uuid.Nil {
		attempt.ID = uuid.New()
	}
	m.attempts[attempt.ID] = attempt
	return nil
}

func (m *mockPracticeRepo) FindAttemptByID(_ context.Context, id uuid.UUID) (*models.Practice, error) {
	a, ok := m.attempts[id]
	if !ok {
		return nil, gorm.ErrRecordNotFound
	}
	return a, nil
}

func (m *mockPracticeRepo) FindAttemptByIDWithDetails(_ context.Context, id uuid.UUID) (*models.Practice, error) {
	a, ok := m.attempts[id]
	if !ok {
		return nil, gorm.ErrRecordNotFound
	}
	return a, nil
}

func (m *mockPracticeRepo) FindActiveAttempt(_ context.Context, userID, packageID uuid.UUID) (*models.Practice, error) {
	for _, a := range m.attempts {
		if a.UserID == userID && a.PackageID != nil && *a.PackageID == packageID && a.Status == models.AttemptStatusInProgress {
			return a, nil
		}
	}
	return nil, gorm.ErrRecordNotFound
}

func (m *mockPracticeRepo) UpdateAttempt(_ context.Context, attempt *models.Practice) error {
	m.attempts[attempt.ID] = attempt
	return nil
}

func (m *mockPracticeRepo) ListAttemptsByUserID(_ context.Context, userID uuid.UUID, _ dto.MyPracticesFilter) ([]models.Practice, int64, error) {
	var list []models.Practice
	for _, a := range m.attempts {
		if a.UserID == userID {
			list = append(list, *a)
		}
	}
	return list, int64(len(list)), nil
}

func (m *mockPracticeRepo) FindLatestCompletedAttempt(_ context.Context, userID, packageID uuid.UUID) (*models.Practice, error) {
	for _, a := range m.attempts {
		if a.UserID == userID && a.PackageID != nil && *a.PackageID == packageID && a.Status == models.AttemptStatusCompleted {
			return a, nil
		}
	}
	return nil, gorm.ErrRecordNotFound
}

func (m *mockPracticeRepo) UpsertAnswer(_ context.Context, ans *models.PracticeAnswer) error {
	if ans.ID == uuid.Nil {
		ans.ID = uuid.New()
	}
	if m.answers[ans.PracticeID] == nil {
		m.answers[ans.PracticeID] = make(map[uuid.UUID]*models.PracticeAnswer)
	}
	m.answers[ans.PracticeID][ans.QuestionID] = ans
	return nil
}

func (m *mockPracticeRepo) FindAnswer(_ context.Context, practiceID, questionID uuid.UUID) (*models.PracticeAnswer, error) {
	if m.answers[practiceID] == nil {
		return nil, gorm.ErrRecordNotFound
	}
	ans, ok := m.answers[practiceID][questionID]
	if !ok {
		return nil, gorm.ErrRecordNotFound
	}
	return ans, nil
}

func (m *mockPracticeRepo) FindAllAnswers(_ context.Context, practiceID uuid.UUID) ([]models.PracticeAnswer, error) {
	var list []models.PracticeAnswer
	for _, a := range m.answers[practiceID] {
		list = append(list, *a)
	}
	return list, nil
}

func (m *mockPracticeRepo) CountAnswers(_ context.Context, practiceID uuid.UUID) (int64, error) {
	return int64(len(m.answers[practiceID])), nil
}

func (m *mockPracticeRepo) GetPracticePackageResults(_ context.Context, packageID uuid.UUID, _ dto.ListPracticeResultFilter) (*dto.PracticePackageResultsResponse, error) {
	pkg, ok := m.packages[packageID]
	if !ok {
		return nil, gorm.ErrRecordNotFound
	}
	return &dto.PracticePackageResultsResponse{
		PackageID:              pkg.ID,
		PackageTitle:           pkg.Title,
		Status:                 string(pkg.Status),
		TotalStudentsCompleted: 1,
		AverageScore:           85.0,
		HighestScore:           85.0,
		LowestScore:            85.0,
	}, nil
}

// ─── Tests ───────────────────────────────────────────────────────────────────

func TestPracticeService_CreatePackage_Success(t *testing.T) {
	repo := newMockPracticeRepo()
	svc := service.NewPracticeService(nil, repo, nil, nil, nil, nil)
	ctx := context.Background()

	adminID := uuid.New()
	res, err := svc.CreatePackage(ctx, dto.CreatePracticePackageRequest{
		Title:       "Paket Latihan 01",
		Description: "Latihan teks deskriptif",
	}, adminID)

	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if res.Title != "Paket Latihan 01" {
		t.Errorf("expected title 'Paket Latihan 01', got '%s'", res.Title)
	}
	if res.Status != string(models.ContentStatusDraft) {
		t.Errorf("expected draft status, got '%s'", res.Status)
	}
}

func TestPracticeService_PublishEmptyPackage_Error(t *testing.T) {
	repo := newMockPracticeRepo()
	svc := service.NewPracticeService(nil, repo, nil, nil, nil, nil)
	ctx := context.Background()

	adminID := uuid.New()
	pkg, _ := svc.CreatePackage(ctx, dto.CreatePracticePackageRequest{
		Title: "Paket Kosong",
	}, adminID)

	_, err := svc.UpdatePackageStatus(ctx, pkg.ID, string(models.ContentStatusPublished), adminID)
	if err == nil {
		t.Fatal("expected error publishing empty package, got nil")
	}
}

func TestPracticeService_StartAndCompletePractice_Scoring(t *testing.T) {
	repo := newMockPracticeRepo()
	svc := service.NewPracticeService(nil, repo, nil, nil, nil, nil)
	ctx := context.Background()

	adminID := uuid.New()
	studentID := uuid.New()

	// 1. Create Package
	pkg, err := svc.CreatePackage(ctx, dto.CreatePracticePackageRequest{
		Title: "Paket Pemahaman Tekstual",
	}, adminID)
	if err != nil {
		t.Fatalf("create package failed: %v", err)
	}

	// 2. Add 2 Questions
	q1 := uuid.New()
	q2 := uuid.New()
	_, err = svc.AddQuestionsToPackage(ctx, pkg.ID, dto.AddPracticeQuestionsRequest{
		QuestionIDs: []uuid.UUID{q1, q2},
	})
	if err != nil {
		t.Fatalf("add questions failed: %v", err)
	}

	// 3. Publish Package
	_, err = svc.UpdatePackageStatus(ctx, pkg.ID, string(models.ContentStatusPublished), adminID)
	if err != nil {
		t.Fatalf("publish package failed: %v", err)
	}

	// 4. Start Practice
	startRes, err := svc.StartPracticeAttempt(ctx, pkg.ID, studentID)
	if err != nil {
		t.Fatalf("start practice failed: %v", err)
	}
	if startRes.TotalQuestions != 2 {
		t.Errorf("expected 2 questions, got %d", startRes.TotalQuestions)
	}

	// 5. Submit Answers (1 Correct, 1 Incorrect)
	isCorrect1 := true
	isCorrect2 := false
	score1 := 1.0
	score2 := 0.0

	_ = repo.UpsertAnswer(ctx, &models.PracticeAnswer{
		PracticeID: startRes.AttemptID,
		QuestionID: q1,
		IsCorrect:  &isCorrect1,
		Score:      &score1,
		AnsweredAt: time.Now(),
	})
	_ = repo.UpsertAnswer(ctx, &models.PracticeAnswer{
		PracticeID: startRes.AttemptID,
		QuestionID: q2,
		IsCorrect:  &isCorrect2,
		Score:      &score2,
		AnsweredAt: time.Now(),
	})

	// 6. Complete Attempt
	compRes, err := svc.CompletePracticeAttempt(ctx, startRes.AttemptID, studentID)
	if err != nil {
		t.Fatalf("complete attempt failed: %v", err)
	}

	// 1 correct out of 2 = 50%
	if compRes.Score != 50.0 {
		t.Errorf("expected score 50.0, got %f", compRes.Score)
	}
	if compRes.CorrectAnswers != 1 {
		t.Errorf("expected 1 correct answer, got %d", compRes.CorrectAnswers)
	}
	if compRes.TotalQuestions != 2 {
		t.Errorf("expected 2 total questions, got %d", compRes.TotalQuestions)
	}
	if compRes.Status != string(models.AttemptStatusCompleted) {
		t.Errorf("expected completed status, got %s", compRes.Status)
	}
}

func TestPracticeService_AutoSubmitPractice_Violations(t *testing.T) {
	repo := newMockPracticeRepo()
	svc := service.NewPracticeService(nil, repo, nil, nil, nil, nil)
	ctx := context.Background()

	adminID := uuid.New()
	studentID := uuid.New()

	pkg, _ := svc.CreatePackage(ctx, dto.CreatePracticePackageRequest{
		Title: "Paket Auto Submit",
	}, adminID)
	q1 := uuid.New()
	_, _ = svc.AddQuestionsToPackage(ctx, pkg.ID, dto.AddPracticeQuestionsRequest{QuestionIDs: []uuid.UUID{q1}})
	_, _ = svc.UpdatePackageStatus(ctx, pkg.ID, string(models.ContentStatusPublished), adminID)

	startRes, err := svc.StartPracticeAttempt(ctx, pkg.ID, studentID)
	if err != nil {
		t.Fatalf("start practice failed: %v", err)
	}

	// Auto-submit with violation reason
	res, err := svc.CompletePracticeAttempt(ctx, startRes.AttemptID, studentID, dto.AutoSubmitPracticeRequest{
		Reason:         "VIOLATION_THRESHOLD_EXCEEDED",
		ViolationCount: 4,
	})
	if err != nil {
		t.Fatalf("auto submit failed: %v", err)
	}

	if !res.IsAutoSubmitted {
		t.Error("expected IsAutoSubmitted to be true")
	}
	if res.AutoSubmitReason != "VIOLATION_THRESHOLD_EXCEEDED" {
		t.Errorf("expected reason 'VIOLATION_THRESHOLD_EXCEEDED', got '%s'", res.AutoSubmitReason)
	}
	if res.Status != string(models.AttemptStatusCompleted) {
		t.Errorf("expected completed status, got %s", res.Status)
	}

	// Verify that GetPracticeResult reflects IsAutoSubmitted and AutoSubmitReason
	getResult, err := svc.GetPracticeResult(ctx, startRes.AttemptID, studentID)
	if err != nil {
		t.Fatalf("get practice result failed: %v", err)
	}
	if !getResult.IsAutoSubmitted {
		t.Error("expected getResult.IsAutoSubmitted to be true")
	}
	if getResult.AutoSubmitReason != "VIOLATION_THRESHOLD_EXCEEDED" {
		t.Errorf("expected getResult.AutoSubmitReason 'VIOLATION_THRESHOLD_EXCEEDED', got '%s'", getResult.AutoSubmitReason)
	}
}

func TestPracticeService_BulkSubmit_Idempotency(t *testing.T) {
	repo := newMockPracticeRepo()
	svc := service.NewPracticeService(nil, repo, nil, nil, nil, nil)
	ctx := context.Background()

	adminID := uuid.New()
	studentID := uuid.New()

	pkg, _ := svc.CreatePackage(ctx, dto.CreatePracticePackageRequest{
		Title: "Paket Latihan Bulk Submit",
	}, adminID)

	q1 := uuid.New()
	q2 := uuid.New()
	q3 := uuid.New()
	_, _ = svc.AddQuestionsToPackage(ctx, pkg.ID, dto.AddPracticeQuestionsRequest{QuestionIDs: []uuid.UUID{q1, q2, q3}})
	_, _ = svc.UpdatePackageStatus(ctx, pkg.ID, string(models.ContentStatusPublished), adminID)

	startRes, err := svc.StartPracticeAttempt(ctx, pkg.ID, studentID)
	if err != nil {
		t.Fatalf("start practice failed: %v", err)
	}

	// Bulk submit with 2 answered questions (q1, q2) and duplicate q1 to verify deduplication
	opt1 := uuid.New()
	opt2 := uuid.New()
	res, err := svc.CompletePracticeAttempt(ctx, startRes.AttemptID, studentID, dto.SubmitPracticeRequest{
		Answers: []dto.SubmitPracticeAnswerRequest{
			{QuestionID: q1, AnswerData: opt1.String()},
			{QuestionID: q1, AnswerData: opt1.String()}, // duplicate should be deduplicated
			{QuestionID: q2, AnswerData: opt2.String()},
		},
	})
	if err != nil {
		t.Fatalf("bulk submit practice failed: %v", err)
	}

	if res.Status != string(models.AttemptStatusCompleted) {
		t.Errorf("expected completed status, got %s", res.Status)
	}
	if res.TotalQuestions != 3 {
		t.Errorf("expected 3 total questions, got %d", res.TotalQuestions)
	}
	if res.Unanswered != 1 {
		t.Errorf("expected 1 unanswered question, got %d", res.Unanswered)
	}

	// Idempotency check: repeated submit should return existing completed result gracefully
	secondRes, err := svc.CompletePracticeAttempt(ctx, startRes.AttemptID, studentID, dto.SubmitPracticeRequest{
		Answers: []dto.SubmitPracticeAnswerRequest{
			{QuestionID: q1, AnswerData: opt1.String()},
		},
	})
	if err != nil {
		t.Fatalf("subsequent submit failed: %v", err)
	}
	if secondRes.Status != string(models.AttemptStatusCompleted) {
		t.Errorf("expected idempotent status completed, got %s", secondRes.Status)
	}
}

func TestPracticeService_ZeroAnswerCorrection(t *testing.T) {
	repo := newMockPracticeRepo()
	svc := service.NewPracticeService(nil, repo, nil, nil, nil, nil)
	ctx := context.Background()

	adminID := uuid.New()
	studentID := uuid.New()

	pkg, _ := svc.CreatePackage(ctx, dto.CreatePracticePackageRequest{
		Title: "Paket Latihan Zero Answer Recovery",
	}, adminID)

	q1 := uuid.New()
	q2 := uuid.New()
	_, _ = svc.AddQuestionsToPackage(ctx, pkg.ID, dto.AddPracticeQuestionsRequest{QuestionIDs: []uuid.UUID{q1, q2}})
	_, _ = svc.UpdatePackageStatus(ctx, pkg.ID, string(models.ContentStatusPublished), adminID)

	startRes, err := svc.StartPracticeAttempt(ctx, pkg.ID, studentID)
	if err != nil {
		t.Fatalf("start practice failed: %v", err)
	}

	// 1. Submit with 0 answers (mimicking earlier parser failure)
	res1, err := svc.CompletePracticeAttempt(ctx, startRes.AttemptID, studentID, dto.SubmitPracticeRequest{})
	if err != nil {
		t.Fatalf("empty submit failed: %v", err)
	}
	if res1.Unanswered != 2 {
		t.Errorf("expected 2 unanswered, got %d", res1.Unanswered)
	}

	// 2. Client re-submits with answers (array format / recovery)
	opt1 := uuid.New()
	res2, err := svc.CompletePracticeAttempt(ctx, startRes.AttemptID, studentID, dto.SubmitPracticeRequest{
		Answers: []dto.SubmitPracticeAnswerRequest{
			{QuestionID: q1, AnswerData: opt1.String()},
		},
	})
	if err != nil {
		t.Fatalf("recovery submit failed: %v", err)
	}
	if res2.Unanswered != 1 {
		t.Errorf("expected 1 unanswered after recovery, got %d", res2.Unanswered)
	}
}

func TestPracticeService_GetPracticePackageResults(t *testing.T) {
	repo := newMockPracticeRepo()
	svc := service.NewPracticeService(nil, repo, nil, nil, nil, nil)
	ctx := context.Background()

	adminID := uuid.New()
	pkg, _ := svc.CreatePackage(ctx, dto.CreatePracticePackageRequest{
		Title: "Paket Latihan Evaluasi",
	}, adminID)

	res, err := svc.GetPracticePackageResults(ctx, pkg.ID, dto.ListPracticeResultFilter{})
	if err != nil {
		t.Fatalf("unexpected error getting practice results: %v", err)
	}
	if res.PackageID != pkg.ID {
		t.Errorf("expected package id %v, got %v", pkg.ID, res.PackageID)
	}
	if res.AverageScore != 85.0 {
		t.Errorf("expected average score 85.0, got %f", res.AverageScore)
	}
}
