package service

import (
	"context"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"simantikApi/internal/dto"
	"simantikApi/internal/models"
	"simantikApi/internal/repository"
)

type QuestionService interface {
	CreateCompetency(ctx context.Context, req dto.CreateCompetencyRequest, createdByID uuid.UUID) (*dto.CompetencyResponse, error)
	GetCompetency(ctx context.Context, id uuid.UUID) (*dto.CompetencyResponse, error)
	UpdateCompetency(ctx context.Context, id uuid.UUID, req dto.UpdateCompetencyRequest) (*dto.CompetencyResponse, error)
	DeleteCompetency(ctx context.Context, id uuid.UUID) error
	ListCompetencies(ctx context.Context, filter dto.ListCompetencyFilter) (*dto.PaginatedCompetenciesResponse, error)

	ListQuestionTypes(ctx context.Context) ([]dto.QuestionTypeResponse, error)

	CreateQuestion(ctx context.Context, req dto.CreateQuestionRequest, createdByID uuid.UUID) (*dto.QuestionAdminResponse, error)
	CreateQuestionsBulk(ctx context.Context, req dto.CreateQuestionsBulkRequest, createdByID uuid.UUID) ([]dto.QuestionAdminResponse, error)
	GetQuestionAdmin(ctx context.Context, id uuid.UUID) (*dto.QuestionAdminResponse, error)
	GetQuestionStudent(ctx context.Context, id uuid.UUID) (*dto.QuestionStudentResponse, error)
	UpdateQuestion(ctx context.Context, id uuid.UUID, req dto.UpdateQuestionRequest, updatedByID uuid.UUID) (*dto.QuestionAdminResponse, error)
	UpdateQuestionStatus(ctx context.Context, id uuid.UUID, status string, updatedByID uuid.UUID) (*dto.QuestionAdminResponse, error)
	DeleteQuestion(ctx context.Context, id uuid.UUID) error
	ListQuestionsAdmin(ctx context.Context, filter dto.ListQuestionFilter) (*dto.PaginatedQuestionsAdminResponse, error)
}

type questionService struct {
	compRepo repository.CompetencyRepository
	qRepo    repository.QuestionRepository
	db       *gorm.DB
}

func NewQuestionService(compRepo repository.CompetencyRepository, qRepo repository.QuestionRepository, db *gorm.DB) QuestionService {
	return &questionService{
		compRepo: compRepo,
		qRepo:    qRepo,
		db:       db,
	}
}

// Competency
func (s *questionService) CreateCompetency(ctx context.Context, req dto.CreateCompetencyRequest, createdByID uuid.UUID) (*dto.CompetencyResponse, error) {
	existing, err := s.compRepo.FindByCode(ctx, req.Code)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, ErrCompetencyCodeExists
	}

	comp := &models.Competency{
		Code:        req.Code,
		Name:        req.Name,
		Description: req.Description,
		Status:      "active",
	}

	if err := s.compRepo.Create(ctx, comp); err != nil {
		return nil, err
	}

	return s.mapCompetencyResponse(comp), nil
}

func (s *questionService) GetCompetency(ctx context.Context, id uuid.UUID) (*dto.CompetencyResponse, error) {
	comp, err := s.compRepo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if comp == nil {
		return nil, ErrCompetencyNotFound
	}
	return s.mapCompetencyResponse(comp), nil
}

func (s *questionService) UpdateCompetency(ctx context.Context, id uuid.UUID, req dto.UpdateCompetencyRequest) (*dto.CompetencyResponse, error) {
	comp, err := s.compRepo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if comp == nil {
		return nil, ErrCompetencyNotFound
	}

	comp.Name = req.Name
	comp.Description = req.Description
	comp.Status = models.CompetencyStatus(req.Status)

	if err := s.compRepo.Update(ctx, comp); err != nil {
		return nil, err
	}

	return s.mapCompetencyResponse(comp), nil
}

func (s *questionService) DeleteCompetency(ctx context.Context, id uuid.UUID) error {
	comp, err := s.compRepo.FindByID(ctx, id)
	if err != nil {
		return err
	}
	if comp == nil {
		return ErrCompetencyNotFound
	}
	return s.compRepo.Delete(ctx, id)
}

func (s *questionService) ListCompetencies(ctx context.Context, filter dto.ListCompetencyFilter) (*dto.PaginatedCompetenciesResponse, error) {
	competencies, total, err := s.compRepo.List(ctx, filter)
	if err != nil {
		return nil, err
	}

	res := make([]dto.CompetencyResponse, len(competencies))
	for i, c := range competencies {
		res[i] = *s.mapCompetencyResponse(&c)
	}

	return &dto.PaginatedCompetenciesResponse{
		Competencies: res,
		Total:        int(total),
		Limit:        filter.Limit,
		Offset:       filter.Offset,
	}, nil
}

func (s *questionService) mapCompetencyResponse(c *models.Competency) *dto.CompetencyResponse {
	return &dto.CompetencyResponse{
		ID:          c.ID.String(),
		Code:        c.Code,
		Name:        c.Name,
		Description: c.Description,
		Status:      string(c.Status),
		CreatedAt:   c.CreatedAt,
		UpdatedAt:   c.UpdatedAt,
	}
}

// Question Types
func (s *questionService) ListQuestionTypes(ctx context.Context) ([]dto.QuestionTypeResponse, error) {
	if s.db == nil {
		return nil, nil // tests
	}
	var types []models.QuestionType
	if err := s.db.WithContext(ctx).Find(&types).Error; err != nil {
		return nil, err
	}

	res := make([]dto.QuestionTypeResponse, len(types))
	for i, t := range types {
		res[i] = dto.QuestionTypeResponse{
			ID:          t.ID.String(),
			Code:        string(t.Code),
			Name:        t.Name,
			Description: t.Description,
			CreatedAt:   t.CreatedAt,
		}
	}
	return res, nil
}

// Questions
func (s *questionService) CreateQuestion(ctx context.Context, req dto.CreateQuestionRequest, createdByID uuid.UUID) (*dto.QuestionAdminResponse, error) {
	q := &models.Question{
		QuestionTypeID:  req.QuestionTypeID,
		QuestionText:    req.QuestionText,
		DifficultyLevel: req.DifficultyLevel,
		Status:          "draft",
		CreatedBy:       createdByID,
	}

	if s.db != nil {
		err := s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
			if err := tx.Create(q).Error; err != nil {
				return err
			}

			for _, optReq := range req.Options {
				opt := models.QuestionOption{
					QuestionID:   q.ID,
					OptionLabel:  optReq.OptionLabel,
					OptionText:   optReq.OptionText,
					IsCorrect:    optReq.IsCorrect,
					DisplayOrder: optReq.DisplayOrder,
				}
				if err := tx.Create(&opt).Error; err != nil {
					return err
				}
			}

			if err := s.qRepo.ReplaceCompetencies(ctx, tx, q.ID, req.CompetencyIDs); err != nil {
				return err
			}

			if req.Explanation != nil {
				expl := models.QuestionExplanation{
					QuestionID:    q.ID,
					Explanation:   req.Explanation.Explanation,
					AnsweringTips: req.Explanation.AnsweringTips,
				}
				if err := tx.Create(&expl).Error; err != nil {
					return err
				}
			}

			return nil
		})
		if err != nil {
			return nil, err
		}
	} else {
		// Mock test path
		if err := s.qRepo.Create(ctx, q); err != nil {
			return nil, err
		}
		if err := s.qRepo.ReplaceCompetencies(ctx, nil, q.ID, req.CompetencyIDs); err != nil {
			return nil, err
		}
	}

	return s.GetQuestionAdmin(ctx, q.ID)
}

func (s *questionService) CreateQuestionsBulk(ctx context.Context, req dto.CreateQuestionsBulkRequest, createdByID uuid.UUID) ([]dto.QuestionAdminResponse, error) {
	var responses []dto.QuestionAdminResponse
	for _, qReq := range req.Questions {
		res, err := s.CreateQuestion(ctx, qReq, createdByID)
		if err != nil {
			return nil, err
		}
		if res != nil {
			responses = append(responses, *res)
		}
	}
	return responses, nil
}

func (s *questionService) GetQuestionAdmin(ctx context.Context, id uuid.UUID) (*dto.QuestionAdminResponse, error) {
	q, err := s.qRepo.FindByIDWithAnswers(ctx, id)
	if err != nil {
		return nil, err
	}
	if q == nil {
		return nil, ErrQuestionNotFound
	}
	return s.mapQuestionAdminResponse(q), nil
}

func (s *questionService) GetQuestionStudent(ctx context.Context, id uuid.UUID) (*dto.QuestionStudentResponse, error) {
	q, err := s.qRepo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if q == nil {
		return nil, ErrQuestionNotFound
	}
	return s.mapQuestionStudentResponse(q), nil
}

func (s *questionService) UpdateQuestion(ctx context.Context, id uuid.UUID, req dto.UpdateQuestionRequest, updatedByID uuid.UUID) (*dto.QuestionAdminResponse, error) {
	q, err := s.qRepo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if q == nil {
		return nil, ErrQuestionNotFound
	}

	q.QuestionText = req.QuestionText
	q.DifficultyLevel = req.DifficultyLevel
	q.Status = models.ContentStatus(req.Status)
	q.UpdatedBy = &updatedByID

	if s.db != nil {
		err = s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
			if err := tx.Save(q).Error; err != nil {
				return err
			}
			return s.qRepo.ReplaceCompetencies(ctx, tx, q.ID, req.CompetencyIDs)
		})
		if err != nil {
			return nil, err
		}
	} else {
		if err := s.qRepo.Update(ctx, q); err != nil {
			return nil, err
		}
		if err := s.qRepo.ReplaceCompetencies(ctx, nil, q.ID, req.CompetencyIDs); err != nil {
			return nil, err
		}
	}

	return s.GetQuestionAdmin(ctx, q.ID)
}

func (s *questionService) UpdateQuestionStatus(ctx context.Context, id uuid.UUID, status string, updatedByID uuid.UUID) (*dto.QuestionAdminResponse, error) {
	q, err := s.qRepo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if q == nil {
		return nil, ErrQuestionNotFound
	}

	q.Status = models.ContentStatus(status)
	q.UpdatedBy = &updatedByID

	if err := s.qRepo.Update(ctx, q); err != nil {
		return nil, err
	}

	return s.GetQuestionAdmin(ctx, id)
}

func (s *questionService) DeleteQuestion(ctx context.Context, id uuid.UUID) error {
	q, err := s.qRepo.FindByID(ctx, id)
	if err != nil {
		return err
	}
	if q == nil {
		return ErrQuestionNotFound
	}
	return s.qRepo.Delete(ctx, id)
}

func (s *questionService) ListQuestionsAdmin(ctx context.Context, filter dto.ListQuestionFilter) (*dto.PaginatedQuestionsAdminResponse, error) {
	questions, total, err := s.qRepo.List(ctx, filter)
	if err != nil {
		return nil, err
	}

	res := make([]dto.QuestionAdminResponse, len(questions))
	for i, q := range questions {
		res[i] = *s.mapQuestionAdminResponse(&q)
	}

	return &dto.PaginatedQuestionsAdminResponse{
		Questions: res,
		Total:     int(total),
		Limit:     filter.Limit,
		Offset:    filter.Offset,
	}, nil
}

func (s *questionService) mapQuestionAdminResponse(q *models.Question) *dto.QuestionAdminResponse {
	opts := make([]dto.QuestionOptionAdminResponse, len(q.Options))
	for i, o := range q.Options {
		opts[i] = dto.QuestionOptionAdminResponse{
			ID:           o.ID.String(),
			QuestionID:   o.QuestionID.String(),
			OptionLabel:  o.OptionLabel,
			OptionText:   o.OptionText,
			IsCorrect:    o.IsCorrect,
			DisplayOrder: o.DisplayOrder,
		}
	}

	comps := make([]dto.CompetencyResponse, len(q.Competencies))
	for i, c := range q.Competencies {
		comps[i] = *s.mapCompetencyResponse(&c)
	}

	var expl *dto.QuestionExplanationResponse
	if q.Explanation != nil {
		expl = &dto.QuestionExplanationResponse{
			ID:            q.Explanation.ID.String(),
			QuestionID:    q.Explanation.QuestionID.String(),
			Explanation:   q.Explanation.Explanation,
			AnsweringTips: q.Explanation.AnsweringTips,
		}
	}

	return &dto.QuestionAdminResponse{
		ID:              q.ID.String(),
		QuestionTypeID:  q.QuestionTypeID.String(),
		QuestionText:    q.QuestionText,
		DifficultyLevel: q.DifficultyLevel,
		Status:          string(q.Status),
		Options:         opts,
		Competencies:    comps,
		Explanation:     expl,
		CreatedAt:       q.CreatedAt,
		UpdatedAt:       q.UpdatedAt,
	}
}

func (s *questionService) mapQuestionStudentResponse(q *models.Question) *dto.QuestionStudentResponse {
	opts := make([]dto.QuestionOptionStudentResponse, len(q.Options))
	for i, o := range q.Options {
		opts[i] = dto.QuestionOptionStudentResponse{
			ID:           o.ID.String(),
			OptionLabel:  o.OptionLabel,
			OptionText:   o.OptionText,
			DisplayOrder: o.DisplayOrder,
		}
	}

	comps := make([]dto.CompetencyResponse, len(q.Competencies))
	for i, c := range q.Competencies {
		comps[i] = *s.mapCompetencyResponse(&c)
	}

	return &dto.QuestionStudentResponse{
		ID:              q.ID.String(),
		QuestionTypeID:  q.QuestionTypeID.String(),
		QuestionText:    q.QuestionText,
		DifficultyLevel: q.DifficultyLevel,
		Options:         opts,
		Competencies:    comps,
	}
}
