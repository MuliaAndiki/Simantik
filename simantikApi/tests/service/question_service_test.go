package service_test

import (
	"context"
	"testing"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"simantikApi/internal/dto"
	"simantikApi/internal/models"
	"simantikApi/internal/service"
)

// Mock Competency Repo
type mockCompetencyRepo struct {
	competencies map[uuid.UUID]*models.Competency
}

func newMockCompetencyRepo() *mockCompetencyRepo {
	return &mockCompetencyRepo{
		competencies: make(map[uuid.UUID]*models.Competency),
	}
}

func (m *mockCompetencyRepo) Create(ctx context.Context, c *models.Competency) error {
	c.ID = uuid.New()
	c.CreatedAt = time.Now()
	c.UpdatedAt = time.Now()
	m.competencies[c.ID] = c
	return nil
}

func (m *mockCompetencyRepo) FindByID(ctx context.Context, id uuid.UUID) (*models.Competency, error) {
	c, ok := m.competencies[id]
	if !ok {
		return nil, nil
	}
	return c, nil
}

func (m *mockCompetencyRepo) FindByCode(ctx context.Context, code string) (*models.Competency, error) {
	for _, c := range m.competencies {
		if c.Code == code {
			return c, nil
		}
	}
	return nil, nil
}

func (m *mockCompetencyRepo) Update(ctx context.Context, c *models.Competency) error {
	c.UpdatedAt = time.Now()
	m.competencies[c.ID] = c
	return nil
}

func (m *mockCompetencyRepo) Delete(ctx context.Context, id uuid.UUID) error {
	delete(m.competencies, id)
	return nil
}

func (m *mockCompetencyRepo) List(ctx context.Context, filter dto.ListCompetencyFilter) ([]models.Competency, int64, error) {
	var list []models.Competency
	for _, c := range m.competencies {
		list = append(list, *c)
	}
	return list, int64(len(list)), nil
}

// Mock Question Repo
type mockQuestionRepo struct {
	questions map[uuid.UUID]*models.Question
}

func newMockQuestionRepo() *mockQuestionRepo {
	return &mockQuestionRepo{
		questions: make(map[uuid.UUID]*models.Question),
	}
}

func (m *mockQuestionRepo) Create(ctx context.Context, q *models.Question) error {
	q.ID = uuid.New()
	q.CreatedAt = time.Now()
	q.UpdatedAt = time.Now()
	m.questions[q.ID] = q
	return nil
}

func (m *mockQuestionRepo) FindByID(ctx context.Context, id uuid.UUID) (*models.Question, error) {
	q, ok := m.questions[id]
	if !ok {
		return nil, nil
	}
	return q, nil
}

func (m *mockQuestionRepo) FindByIDWithAnswers(ctx context.Context, id uuid.UUID) (*models.Question, error) {
	return m.FindByID(ctx, id)
}

func (m *mockQuestionRepo) Update(ctx context.Context, q *models.Question) error {
	q.UpdatedAt = time.Now()
	m.questions[q.ID] = q
	return nil
}

func (m *mockQuestionRepo) Delete(ctx context.Context, id uuid.UUID) error {
	delete(m.questions, id)
	return nil
}

func (m *mockQuestionRepo) List(ctx context.Context, filter dto.ListQuestionFilter) ([]models.Question, int64, error) {
	var list []models.Question
	for _, q := range m.questions {
		list = append(list, *q)
	}
	return list, int64(len(list)), nil
}

func (m *mockQuestionRepo) CountByFilter(ctx context.Context, filter dto.ListQuestionFilter) (int64, error) {
	return int64(len(m.questions)), nil
}

func (m *mockQuestionRepo) ReplaceCompetencies(ctx context.Context, tx *gorm.DB, questionID uuid.UUID, competencyIDs []uuid.UUID) error {
	q, ok := m.questions[questionID]
	if !ok {
		return nil
	}
	var comps []models.Competency
	for _, cid := range competencyIDs {
		comps = append(comps, models.Competency{ID: cid})
	}
	q.Competencies = comps
	return nil
}

// Tests

func TestQuestionService_CompetencyCRUD(t *testing.T) {
	compRepo := newMockCompetencyRepo()
	qRepo := newMockQuestionRepo()
	srv := service.NewQuestionService(compRepo, qRepo, nil)

	ctx := context.Background()
	adminID := uuid.New()

	// 1. Create
	req := dto.CreateCompetencyRequest{
		Code:        "COMP01",
		Name:        "Math",
		Description: "Basic Math",
	}
	res, err := srv.CreateCompetency(ctx, req, adminID)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if res.Code != "COMP01" {
		t.Errorf("expected COMP01, got %s", res.Code)
	}

	compID := uuid.MustParse(res.ID)

	// 2. Get
	resGet, err := srv.GetCompetency(ctx, compID)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resGet.Name != "Math" {
		t.Errorf("expected Math, got %s", resGet.Name)
	}

	// 3. Update
	reqUpdate := dto.UpdateCompetencyRequest{
		Name:        "Advanced Math",
		Description: "Hard Math",
		Status:      "active",
	}
	resUpdate, err := srv.UpdateCompetency(ctx, compID, reqUpdate)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resUpdate.Name != "Advanced Math" {
		t.Errorf("expected Advanced Math, got %s", resUpdate.Name)
	}

	// 4. List
	resList, err := srv.ListCompetencies(ctx, dto.ListCompetencyFilter{})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resList.Total != 1 {
		t.Errorf("expected 1 competency, got %d", resList.Total)
	}

	// 5. Delete
	err = srv.DeleteCompetency(ctx, compID)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	resGetAfterDelete, err := srv.GetCompetency(ctx, compID)
	if err == nil {
		t.Errorf("expected error, got nil")
	}
	if resGetAfterDelete != nil {
		t.Errorf("expected nil result")
	}
}

func TestQuestionService_CreateAndGetQuestion(t *testing.T) {
	compRepo := newMockCompetencyRepo()
	qRepo := newMockQuestionRepo()
	srv := service.NewQuestionService(compRepo, qRepo, nil)

	ctx := context.Background()
	adminID := uuid.New()
	qTypeID := uuid.New()
	compID := uuid.New()

	req := dto.CreateQuestionRequest{
		QuestionTypeID:  qTypeID,
		QuestionText:    "What is 1+1?",
		DifficultyLevel: 1,
		Options: []dto.CreateQuestionOptionRequest{
			{OptionLabel: "A", OptionText: "1", IsCorrect: false, DisplayOrder: 1},
			{OptionLabel: "B", OptionText: "2", IsCorrect: true, DisplayOrder: 2},
		},
		CompetencyIDs: []uuid.UUID{compID},
	}

	res, err := srv.CreateQuestion(ctx, req, adminID)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	qID := uuid.MustParse(res.ID)

	// Since mock repo doesn't actually handle the options creation the same way (transaction),
	// we just test that the basic creation logic runs without panics in test path.
	// We manually inject the options into the mock repo so we can test the mapping.
	qRepo.questions[qID].Options = []models.QuestionOption{
		{ID: uuid.New(), QuestionID: qID, OptionLabel: "A", OptionText: "1", IsCorrect: false, DisplayOrder: 1},
		{ID: uuid.New(), QuestionID: qID, OptionLabel: "B", OptionText: "2", IsCorrect: true, DisplayOrder: 2},
	}

	adminRes, err := srv.GetQuestionAdmin(ctx, qID)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(adminRes.Options) != 2 {
		t.Errorf("expected 2 options, got %d", len(adminRes.Options))
	}
	if adminRes.Options[1].IsCorrect != true {
		t.Errorf("expected true, got false")
	}

	studentRes, err := srv.GetQuestionStudent(ctx, qID)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(studentRes.Options) != 2 {
		t.Errorf("expected 2 options, got %d", len(studentRes.Options))
	}
	// student option doesn't even have IsCorrect field
}

func TestQuestionService_StatusTransition(t *testing.T) {
	compRepo := newMockCompetencyRepo()
	qRepo := newMockQuestionRepo()
	srv := service.NewQuestionService(compRepo, qRepo, nil)

	ctx := context.Background()
	adminID := uuid.New()

	q := &models.Question{
		ID:     uuid.New(),
		Status: "draft",
	}
	qRepo.questions[q.ID] = q

	res, err := srv.UpdateQuestionStatus(ctx, q.ID, "published", adminID)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if res.Status != "published" {
		t.Errorf("expected published, got %s", res.Status)
	}
}
