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

// EvaluationService defines the contract for student assessment evaluations, review, and competency analytics.
type EvaluationService interface {
	GetEvaluationByID(ctx context.Context, id, userID uuid.UUID) (*dto.EvaluationResponse, error)
	GetAttemptEvaluation(ctx context.Context, attemptID, userID uuid.UUID) (*dto.EvaluationResponse, error)
	GetAttemptReview(ctx context.Context, attemptID, userID uuid.UUID) (*dto.AttemptReviewResponse, error)
	ListMyEvaluations(ctx context.Context, userID uuid.UUID, filter dto.ListEvaluationFilter) (*dto.PaginatedEvaluationsResponse, error)
	GetStudentCompetencyProfile(ctx context.Context, userID uuid.UUID) (*dto.StudentCompetencyProfileResponse, error)
}

type evaluationService struct {
	evalRepo    repository.EvaluationRepository
	attemptRepo repository.TryoutAttemptRepository
	tryoutRepo  repository.TryoutRepository
	db          *gorm.DB
}

// NewEvaluationService constructs a new EvaluationService.
func NewEvaluationService(
	evalRepo repository.EvaluationRepository,
	attemptRepo repository.TryoutAttemptRepository,
	tryoutRepo repository.TryoutRepository,
	db *gorm.DB,
) EvaluationService {
	return &evaluationService{
		evalRepo:    evalRepo,
		attemptRepo: attemptRepo,
		tryoutRepo:  tryoutRepo,
		db:          db,
	}
}

func (s *evaluationService) GetEvaluationByID(ctx context.Context, id, userID uuid.UUID) (*dto.EvaluationResponse, error) {
	eval, err := s.evalRepo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrEvaluationNotFound
		}
		return nil, err
	}

	if eval.UserID != userID {
		return nil, ErrAttemptNotOwner
	}

	return s.mapToEvaluationResponse(eval), nil
}

func (s *evaluationService) GetAttemptEvaluation(ctx context.Context, attemptID, userID uuid.UUID) (*dto.EvaluationResponse, error) {
	attempt, err := s.attemptRepo.FindAttemptByID(ctx, attemptID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrAttemptNotFound
		}
		return nil, err
	}

	if attempt.UserID != userID {
		return nil, ErrAttemptNotOwner
	}

	if attempt.Status != models.AttemptStatusCompleted {
		return nil, ErrAttemptNotCompleted
	}

	eval, err := s.evalRepo.FindBySource(ctx, models.EvaluationSourceTryout, attemptID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrEvaluationNotFound
		}
		return nil, err
	}

	return s.mapToEvaluationResponse(eval), nil
}

func (s *evaluationService) GetAttemptReview(ctx context.Context, attemptID, userID uuid.UUID) (*dto.AttemptReviewResponse, error) {
	attempt, err := s.attemptRepo.FindAttemptByID(ctx, attemptID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrAttemptNotFound
		}
		return nil, err
	}

	if attempt.UserID != userID {
		return nil, ErrAttemptNotOwner
	}

	// Strict pedagogical security constraint: answers and explanations are ONLY revealed after completion
	if attempt.Status != models.AttemptStatusCompleted {
		return nil, ErrAttemptNotCompleted
	}

	tryout, _ := s.tryoutRepo.FindByID(ctx, attempt.TryoutID)
	tryoutTitle := ""
	if tryout != nil {
		tryoutTitle = tryout.Title
	}

	// Fetch student answers
	answers, err := s.attemptRepo.FindAllAnswers(ctx, attemptID)
	if err != nil {
		return nil, err
	}

	answerMap := make(map[uuid.UUID]models.StudentAnswer, len(answers))
	for _, a := range answers {
		answerMap[a.QuestionID] = a
	}

	// Fetch attempt questions with preloaded question data
	var aqs []models.AttemptQuestion
	if s.db != nil {
		err = s.db.WithContext(ctx).
			Preload("Question").
			Preload("Question.Options", func(db *gorm.DB) *gorm.DB {
				return db.Order("display_order ASC")
			}).
			Preload("Question.Competencies").
			Preload("Question.Explanation").
			Where("attempt_id = ?", attemptID).
			Order("question_number ASC").
			Find(&aqs).Error
		if err != nil {
			return nil, err
		}
	} else {
		// Test/mock fallback
		aqs, _ = s.attemptRepo.FindAttemptQuestions(ctx, attemptID)
	}

	correctCount := 0
	questionReviews := make([]dto.QuestionReviewResponse, len(aqs))

	for i, aq := range aqs {
		q := aq.Question
		ans, hasAnswer := answerMap[aq.QuestionID]

		isCorrect := false
		score := 0.0
		var selectedOptID *uuid.UUID
		answerData := ""
		respTime := 0

		if hasAnswer {
			if ans.IsCorrect != nil && *ans.IsCorrect {
				isCorrect = true
				correctCount++
			}
			if ans.Score != nil {
				score = *ans.Score
			}
			selectedOptID = ans.SelectedOptionID
			answerData = ans.AnswerData
			respTime = ans.ResponseTimeSeconds
		}

		// Options
		var optionReviews []dto.OptionReviewResponse
		if q != nil {
			optionReviews = make([]dto.OptionReviewResponse, len(q.Options))
			for j, o := range q.Options {
				isSelected := false
				if selectedOptID != nil && o.ID == *selectedOptID {
					isSelected = true
				}
				optionReviews[j] = dto.OptionReviewResponse{
					ID:           o.ID,
					OptionLabel:  o.OptionLabel,
					OptionText:   o.OptionText,
					IsCorrect:    o.IsCorrect,
					IsSelected:   isSelected,
					DisplayOrder: o.DisplayOrder,
				}
			}
		}

		// Competencies
		var compResponses []dto.CompetencyResponse
		if q != nil && len(q.Competencies) > 0 {
			compResponses = make([]dto.CompetencyResponse, len(q.Competencies))
			for k, c := range q.Competencies {
				compResponses[k] = dto.CompetencyResponse{
					ID:          c.ID.String(),
					Code:        c.Code,
					Name:        c.Name,
					Description: c.Description,
					Status:      string(c.Status),
				}
			}
		}

		// Explanations
		explText := ""
		answeringTips := ""
		if q != nil && q.Explanation != nil {
			explText = q.Explanation.Explanation
			answeringTips = q.Explanation.AnsweringTips
		}

		qText := ""
		qDiff := aq.DifficultyLevel
		if q != nil {
			qText = q.QuestionText
			if q.DifficultyLevel > 0 {
				qDiff = q.DifficultyLevel
			}
		}

		questionReviews[i] = dto.QuestionReviewResponse{
			QuestionNumber:      aq.QuestionNumber,
			QuestionID:          aq.QuestionID,
			QuestionText:        qText,
			DifficultyLevel:     qDiff,
			Competencies:        compResponses,
			Options:             optionReviews,
			SelectedOptionID:    selectedOptID,
			AnswerData:          answerData,
			IsCorrect:           isCorrect,
			Score:               score,
			ResponseTimeSeconds: respTime,
			Explanation:         explText,
			AnsweringTips:       answeringTips,
		}
	}

	// Fetch evaluation & competency breakdowns
	eval, _ := s.evalRepo.FindBySource(ctx, models.EvaluationSourceTryout, attemptID)
	var compBreakdown []dto.CompetencyEvaluationResponse
	var evalIDPtr *uuid.UUID

	if eval != nil {
		evalIDPtr = &eval.ID
		compBreakdown = make([]dto.CompetencyEvaluationResponse, len(eval.CompetencyEvaluations))
		for idx, ce := range eval.CompetencyEvaluations {
			compName := ""
			compCode := ""
			if ce.Competency != nil {
				compName = ce.Competency.Name
				compCode = ce.Competency.Code
			}
			compBreakdown[idx] = dto.CompetencyEvaluationResponse{
				ID:             ce.ID,
				CompetencyID:   ce.CompetencyID,
				CompetencyName: compName,
				CompetencyCode: compCode,
				TotalQuestions: ce.TotalQuestions,
				CorrectAnswers: ce.CorrectAnswers,
				Score:          ce.Score,
				Accuracy:       ce.Accuracy,
				Level:          string(ce.Level),
			}
		}
	}

	totalQuestions := len(aqs)

	scoreVal := 0.0
	if attempt.Score != nil {
		scoreVal = *attempt.Score
	} else if totalQuestions > 0 {
		scoreVal = (float64(correctCount) / float64(totalQuestions)) * 100
	}

	accuracyVal := 0.0
	if len(answers) > 0 {
		accuracyVal = (float64(correctCount) / float64(len(answers))) * 100
	}

	timeTaken := 0
	if attempt.SubmittedAt != nil {
		timeTaken = int(attempt.SubmittedAt.Sub(attempt.StartedAt).Seconds())
	}

	return &dto.AttemptReviewResponse{
		AttemptID:           attempt.ID,
		TryoutID:            attempt.TryoutID,
		TryoutTitle:         tryoutTitle,
		Score:               scoreVal,
		Accuracy:            accuracyVal,
		TotalQuestions:      totalQuestions,
		CorrectAnswers:      correctCount,
		IncorrectAnswers:    len(answers) - correctCount,
		Unanswered:          totalQuestions - len(answers),
		TimeTakenSeconds:    timeTaken,
		StartedAt:           attempt.StartedAt,
		SubmittedAt:         attempt.SubmittedAt,
		EvaluationID:        evalIDPtr,
		CompetencyBreakdown: compBreakdown,
		Questions:           questionReviews,
	}, nil
}

func (s *evaluationService) ListMyEvaluations(ctx context.Context, userID uuid.UUID, filter dto.ListEvaluationFilter) (*dto.PaginatedEvaluationsResponse, error) {
	evals, total, err := s.evalRepo.ListByUserID(ctx, userID, filter)
	if err != nil {
		return nil, err
	}

	items := make([]dto.EvaluationResponse, len(evals))
	for i := range evals {
		items[i] = *s.mapToEvaluationResponse(&evals[i])
	}

	return &dto.PaginatedEvaluationsResponse{
		Evaluations: items,
		Total:       total,
		Limit:       filter.Limit,
		Offset:      filter.Offset,
	}, nil
}

func (s *evaluationService) GetStudentCompetencyProfile(ctx context.Context, userID uuid.UUID) (*dto.StudentCompetencyProfileResponse, error) {
	items, err := s.evalRepo.GetCompetencyEvaluationsByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}

	type compAgg struct {
		id        uuid.UUID
		code      string
		name      string
		totalQ    int
		correct   int
		scoreSum  float64
		evalCount int
	}

	compMap := make(map[uuid.UUID]*compAgg)
	for _, item := range items {
		agg, exists := compMap[item.CompetencyID]
		if !exists {
			name := ""
			code := ""
			if item.Competency != nil {
				name = item.Competency.Name
				code = item.Competency.Code
			}
			agg = &compAgg{
				id:   item.CompetencyID,
				name: name,
				code: code,
			}
			compMap[item.CompetencyID] = agg
		}
		agg.totalQ += item.TotalQuestions
		agg.correct += item.CorrectAnswers
		agg.scoreSum += item.Score
		agg.evalCount++
	}

	masteryItems := make([]dto.CompetencyMasteryItem, 0, len(compMap))
	var strengths []string
	var weaknesses []string

	totalQuestionsAll := 0
	totalCorrectAll := 0

	for _, agg := range compMap {
		totalQuestionsAll += agg.totalQ
		totalCorrectAll += agg.correct

		avgScore := 0.0
		accuracy := 0.0
		if agg.evalCount > 0 {
			avgScore = agg.scoreSum / float64(agg.evalCount)
		}
		if agg.totalQ > 0 {
			accuracy = (float64(agg.correct) / float64(agg.totalQ)) * 100
		}

		level := string(models.PerformanceLevelMedium)
		classification := "developing"

		if avgScore >= 70.0 {
			level = string(models.PerformanceLevelHigh)
			classification = "strength"
			if agg.name != "" {
				strengths = append(strengths, agg.name)
			}
		} else if avgScore < 40.0 {
			level = string(models.PerformanceLevelLow)
			classification = "weakness"
			if agg.name != "" {
				weaknesses = append(weaknesses, agg.name)
			}
		}

		masteryItems = append(masteryItems, dto.CompetencyMasteryItem{
			CompetencyID:   agg.id,
			Code:           agg.code,
			Name:           agg.name,
			TotalQuestions: agg.totalQ,
			TotalCorrect:   agg.correct,
			AverageScore:   avgScore,
			Accuracy:       accuracy,
			Level:          level,
			Classification: classification,
		})
	}

	evalFilter := dto.ListEvaluationFilter{Limit: 1000}
	allEvals, totalEvals, _ := s.evalRepo.ListByUserID(ctx, userID, evalFilter)

	overallAvgScore := 0.0
	if len(allEvals) > 0 {
		sum := 0.0
		for _, e := range allEvals {
			sum += e.Score
		}
		overallAvgScore = sum / float64(len(allEvals))
	}

	overallAccuracy := 0.0
	if totalQuestionsAll > 0 {
		overallAccuracy = (float64(totalCorrectAll) / float64(totalQuestionsAll)) * 100
	}

	if strengths == nil {
		strengths = []string{}
	}
	if weaknesses == nil {
		weaknesses = []string{}
	}

	return &dto.StudentCompetencyProfileResponse{
		UserID:              userID,
		TotalEvaluations:    int(totalEvals),
		OverallAverageScore: overallAvgScore,
		OverallAccuracy:     overallAccuracy,
		Competencies:        masteryItems,
		Strengths:           strengths,
		Weaknesses:          weaknesses,
	}, nil
}

func (s *evaluationService) mapToEvaluationResponse(e *models.Evaluation) *dto.EvaluationResponse {
	compEvals := make([]dto.CompetencyEvaluationResponse, len(e.CompetencyEvaluations))
	for i, ce := range e.CompetencyEvaluations {
		name := ""
		code := ""
		if ce.Competency != nil {
			name = ce.Competency.Name
			code = ce.Competency.Code
		}
		compEvals[i] = dto.CompetencyEvaluationResponse{
			ID:             ce.ID,
			CompetencyID:   ce.CompetencyID,
			CompetencyName: name,
			CompetencyCode: code,
			TotalQuestions: ce.TotalQuestions,
			CorrectAnswers: ce.CorrectAnswers,
			Score:          ce.Score,
			Accuracy:       ce.Accuracy,
			Level:          string(ce.Level),
		}
	}

	unanswered := e.TotalQuestions - (e.CorrectAnswers + e.IncorrectAnswers)
	if unanswered < 0 {
		unanswered = 0
	}

	return &dto.EvaluationResponse{
		ID:                    e.ID,
		UserID:                e.UserID,
		SourceType:            string(e.SourceType),
		SourceID:              e.SourceID,
		TotalQuestions:        e.TotalQuestions,
		CorrectAnswers:        e.CorrectAnswers,
		IncorrectAnswers:      e.IncorrectAnswers,
		Unanswered:            unanswered,
		Score:                 e.Score,
		Accuracy:              e.Accuracy,
		CreatedAt:             e.CreatedAt,
		CompetencyEvaluations: compEvals,
	}
}
