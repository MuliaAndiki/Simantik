package service

import (
	"context"
	"errors"
	"math/rand"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"simantikApi/internal/domain/adaptive"
	"simantikApi/internal/dto"
	"simantikApi/internal/models"
	"simantikApi/internal/repository"
)

// TryoutAttemptService defines business operations for the Attempt Engine.
type TryoutAttemptService interface {
	StartAttempt(ctx context.Context, tryoutID, userID uuid.UUID) (*dto.StartAttemptResponse, error)
	GetAttemptStatus(ctx context.Context, attemptID, userID uuid.UUID) (*dto.AttemptStatusResponse, error)
	GetAttemptQuestion(ctx context.Context, attemptID uuid.UUID, questionNumber int, userID uuid.UUID) (*dto.AttemptQuestionResponse, error)
	SubmitAnswer(ctx context.Context, attemptID, userID uuid.UUID, req dto.SubmitAnswerRequest) (*dto.SubmitAnswerResponse, error)
	CompleteAttempt(ctx context.Context, attemptID, userID uuid.UUID) (*dto.CompleteAttemptResponse, error)
	ListMyAttempts(ctx context.Context, userID uuid.UUID, filter dto.MyAttemptsFilter) (*dto.PaginatedAttemptsResponse, error)
}

type tryoutAttemptService struct {
	db             *gorm.DB
	attemptRepo    repository.TryoutAttemptRepository
	tryoutRepo     repository.TryoutRepository
	adaptiveEngine adaptive.Engine
}

// NewTryoutAttemptService constructs a TryoutAttemptService.
func NewTryoutAttemptService(db *gorm.DB, attemptRepo repository.TryoutAttemptRepository, tryoutRepo repository.TryoutRepository, adaptiveEng ...adaptive.Engine) TryoutAttemptService {
	var eng adaptive.Engine
	if len(adaptiveEng) > 0 && adaptiveEng[0] != nil {
		eng = adaptiveEng[0]
	} else {
		eng = adaptive.NewEngine(adaptive.DefaultConfig())
	}

	return &tryoutAttemptService{
		db:             db,
		attemptRepo:    attemptRepo,
		tryoutRepo:     tryoutRepo,
		adaptiveEngine: eng,
	}
}

func (s *tryoutAttemptService) StartAttempt(ctx context.Context, tryoutID, userID uuid.UUID) (*dto.StartAttemptResponse, error) {
	tryout, err := s.tryoutRepo.FindByID(ctx, tryoutID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrTryoutNotFound
		}
		return nil, err
	}

	if tryout.Status != models.ContentStatusPublished {
		return nil, ErrTryoutNotAvailable
	}

	now := time.Now()
	if tryout.StartAt != nil && now.Before(*tryout.StartAt) {
		return nil, ErrTryoutNotAvailable
	}
	if tryout.EndAt != nil && now.After(*tryout.EndAt) {
		return nil, ErrTryoutNotAvailable
	}

	// Reject if there's already an active attempt
	existing, err := s.attemptRepo.FindActiveAttempt(ctx, userID, tryoutID)
	if err == nil && existing != nil {
		return nil, ErrAttemptAlreadyActive
	} else if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	poolQuestions, err := s.tryoutRepo.GetPoolQuestionIDs(ctx, tryoutID)
	if err != nil {
		return nil, err
	}
	if len(poolQuestions) < tryout.TotalQuestions {
		return nil, ErrInsufficientPool
	}

	// Shuffle and select
	rng := rand.New(rand.NewSource(now.UnixNano()))
	rng.Shuffle(len(poolQuestions), func(i, j int) {
		poolQuestions[i], poolQuestions[j] = poolQuestions[j], poolQuestions[i]
	})
	selectedQuestions := poolQuestions[:tryout.TotalQuestions]

	attempt := models.TryoutAttempt{
		UserID:    userID,
		TryoutID:  tryoutID,
		Status:    models.AttemptStatusInProgress,
		StartedAt: now,
	}

	aqs := make([]models.AttemptQuestion, len(selectedQuestions))
	for i, qid := range selectedQuestions {
		aqs[i] = models.AttemptQuestion{
			QuestionID:      qid,
			QuestionNumber:  i + 1,
			DifficultyLevel: 1, // default; adaptive updates in future
			PresentedAt:     now,
		}
		// AttemptID will be set after attempt is created
	}

	if s.db != nil {
		err = s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
			if err := tx.Create(&attempt).Error; err != nil {
				return err
			}
			// Set AttemptID on each question
			for i := range aqs {
				aqs[i].AttemptID = attempt.ID
			}
			if err := tx.CreateInBatches(aqs, 100).Error; err != nil {
				return err
			}
			return nil
		})
		if err != nil {
			return nil, err
		}
	} else {
		// Test path (mock repos)
		if err := s.attemptRepo.CreateAttempt(ctx, &attempt); err != nil {
			return nil, err
		}
		for i := range aqs {
			aqs[i].AttemptID = attempt.ID
		}
		if err := s.attemptRepo.BulkCreateAttemptQuestions(ctx, aqs); err != nil {
			return nil, err
		}
	}

	return &dto.StartAttemptResponse{
		AttemptID:       attempt.ID,
		TryoutID:        tryout.ID,
		TotalQuestions:  tryout.TotalQuestions,
		DurationSeconds: tryout.DurationSeconds,
		StartedAt:       attempt.StartedAt,
		Status:          string(attempt.Status),
	}, nil
}

func (s *tryoutAttemptService) GetAttemptStatus(ctx context.Context, attemptID, userID uuid.UUID) (*dto.AttemptStatusResponse, error) {
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

	tryout, err := s.tryoutRepo.FindByID(ctx, attempt.TryoutID)
	if err != nil {
		return nil, err
	}

	elapsed := int(time.Since(attempt.StartedAt).Seconds())
	remaining := tryout.DurationSeconds - elapsed
	if remaining < 0 {
		remaining = 0
	}

	answeredCount, _ := s.attemptRepo.CountAnswers(ctx, attemptID)

	return &dto.AttemptStatusResponse{
		AttemptID:             attempt.ID,
		Status:                string(attempt.Status),
		CurrentQuestionNumber: attempt.CurrentQuestionNumber,
		TotalQuestions:        tryout.TotalQuestions,
		DurationSeconds:       tryout.DurationSeconds,
		StartedAt:             attempt.StartedAt,
		RemainingSeconds:      remaining,
		AnsweredCount:         int(answeredCount),
	}, nil
}

func (s *tryoutAttemptService) GetAttemptQuestion(ctx context.Context, attemptID uuid.UUID, questionNumber int, userID uuid.UUID) (*dto.AttemptQuestionResponse, error) {
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
	if attempt.Status != models.AttemptStatusInProgress {
		return nil, ErrAttemptNotActive
	}

	tryout, err := s.tryoutRepo.FindByID(ctx, attempt.TryoutID)
	if err != nil {
		return nil, err
	}

	// Timer enforcement with 30s grace
	deadline := attempt.StartedAt.Add(time.Duration(tryout.DurationSeconds+30) * time.Second)
	if time.Now().After(deadline) {
		attempt.Status = models.AttemptStatusExpired
		_ = s.attemptRepo.UpdateAttempt(ctx, attempt)
		return nil, ErrAttemptExpired
	}

	aq, err := s.attemptRepo.FindAttemptQuestionByNumber(ctx, attemptID, questionNumber)
	if err != nil {
		return nil, err
	}

	// Build student-safe options (no IsCorrect)
	opts := make([]dto.OptionResponse, len(aq.Question.Options))
	for i, o := range aq.Question.Options {
		opts[i] = dto.OptionResponse{
			ID:           o.ID,
			OptionLabel:  o.OptionLabel,
			OptionText:   o.OptionText,
			DisplayOrder: o.DisplayOrder,
		}
	}

	// Build student-safe question response
	q := aq.Question
	studentQ := dto.QuestionStudentResponse{
		ID:              q.ID.String(),
		QuestionText:    q.QuestionText,
		DifficultyLevel: q.DifficultyLevel,
		Options:         make([]dto.QuestionOptionStudentResponse, len(opts)),
	}
	for i, o := range opts {
		studentQ.Options[i] = dto.QuestionOptionStudentResponse{
			ID:           o.ID.String(),
			OptionLabel:  o.OptionLabel,
			OptionText:   o.OptionText,
			DisplayOrder: o.DisplayOrder,
		}
	}
	if q.Type != nil {
		studentQ.QuestionTypeID = q.Type.ID.String()
	}

	return &dto.AttemptQuestionResponse{
		QuestionNumber: aq.QuestionNumber,
		TotalQuestions: tryout.TotalQuestions,
		Question:       studentQ,
	}, nil
}

func (s *tryoutAttemptService) SubmitAnswer(ctx context.Context, attemptID, userID uuid.UUID, req dto.SubmitAnswerRequest) (*dto.SubmitAnswerResponse, error) {
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
	if attempt.Status != models.AttemptStatusInProgress {
		return nil, ErrAttemptNotActive
	}

	tryout, err := s.tryoutRepo.FindByID(ctx, attempt.TryoutID)
	if err != nil {
		return nil, err
	}

	elapsed := int(time.Since(attempt.StartedAt).Seconds())
	if elapsed > tryout.DurationSeconds+30 {
		attempt.Status = models.AttemptStatusExpired
		_ = s.attemptRepo.UpdateAttempt(ctx, attempt)
		return nil, ErrAttemptExpired
	}

	// Find the AttemptQuestion for this question
	aqs, err := s.attemptRepo.FindAttemptQuestions(ctx, attemptID)
	if err != nil {
		return nil, err
	}
	var aq *models.AttemptQuestion
	for i := range aqs {
		if aqs[i].QuestionID == req.QuestionID {
			aq = &aqs[i]
			break
		}
	}
	if aq == nil {
		return nil, errors.New("question not found in this attempt")
	}

	// Determine correctness by querying the option
	isCorrect := false
	if req.SelectedOptionID != nil && s.db != nil {
		var opt models.QuestionOption
		if err := s.db.WithContext(ctx).First(&opt, "id = ?", req.SelectedOptionID).Error; err == nil {
			isCorrect = opt.IsCorrect
		}
	}

	scoreVal := 0.0
	if isCorrect {
		scoreVal = 1.0
	}

	isCorrectPtr := &isCorrect
	scorePtr := &scoreVal
	now := time.Now()

	ans := models.StudentAnswer{
		AttemptID:           attemptID,
		QuestionID:          req.QuestionID,
		AttemptQuestionID:   &aq.ID,
		SelectedOptionID:    req.SelectedOptionID,
		AnswerData:          req.AnswerData,
		IsCorrect:           isCorrectPtr,
		Score:               scorePtr,
		ResponseTimeSeconds: req.ResponseTimeSeconds,
		AnsweredAt:          now,
	}

	if err := s.attemptRepo.UpsertAnswer(ctx, &ans); err != nil {
		return nil, err
	}

	// Update adaptive progression state (difficulty & correct streak)
	nextDiff, newStreak, _ := s.adaptiveEngine.CalculateNextState(attempt.CurrentDifficultyLevel, attempt.CorrectStreak, isCorrect)
	attempt.CurrentDifficultyLevel = nextDiff
	attempt.CorrectStreak = newStreak
	_ = s.attemptRepo.UpdateAttempt(ctx, attempt)

	remaining := tryout.DurationSeconds - elapsed
	if remaining < 0 {
		remaining = 0
	}

	return &dto.SubmitAnswerResponse{
		QuestionID:       req.QuestionID,
		Submitted:        true,
		RemainingSeconds: remaining,
	}, nil
}

func (s *tryoutAttemptService) CompleteAttempt(ctx context.Context, attemptID, userID uuid.UUID) (*dto.CompleteAttemptResponse, error) {
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
	if attempt.Status != models.AttemptStatusInProgress {
		return nil, ErrAttemptNotActive
	}

	tryout, err := s.tryoutRepo.FindByID(ctx, attempt.TryoutID)
	if err != nil {
		return nil, err
	}

	answers, err := s.attemptRepo.FindAllAnswers(ctx, attemptID)
	if err != nil {
		return nil, err
	}

	correctCount := 0
	for _, a := range answers {
		if a.IsCorrect != nil && *a.IsCorrect {
			correctCount++
		}
	}

	score := 0.0
	if tryout.TotalQuestions > 0 {
		score = (float64(correctCount) / float64(tryout.TotalQuestions)) * 100
	}
	accuracy := 0.0
	if len(answers) > 0 {
		accuracy = (float64(correctCount) / float64(len(answers))) * 100
	}

	evalID := uuid.New()
	evaluation := models.Evaluation{
		ID:               evalID,
		UserID:           userID,
		SourceType:       models.EvaluationSourceTryout,
		SourceID:         attempt.ID,
		TotalQuestions:   tryout.TotalQuestions,
		CorrectAnswers:   correctCount,
		IncorrectAnswers: tryout.TotalQuestions - correctCount,
		Score:            score,
		Accuracy:         accuracy,
	}

	// Build per-competency stats
	var questionIDs []uuid.UUID
	for _, a := range answers {
		questionIDs = append(questionIDs, a.QuestionID)
	}

	var questions []models.Question
	if s.db != nil && len(questionIDs) > 0 {
		_ = s.db.WithContext(ctx).Preload("Competencies").Where("id IN ?", questionIDs).Find(&questions).Error
	}

	// Map questionID -> question for fast lookup
	qMap := make(map[uuid.UUID]*models.Question, len(questions))
	for i := range questions {
		qMap[questions[i].ID] = &questions[i]
	}

	type compStats struct {
		Correct int
		Total   int
	}
	compMap := make(map[uuid.UUID]*compStats)

	for _, a := range answers {
		q, ok := qMap[a.QuestionID]
		if !ok {
			continue
		}
		for _, comp := range q.Competencies {
			stats, exists := compMap[comp.ID]
			if !exists {
				stats = &compStats{}
				compMap[comp.ID] = stats
			}
			stats.Total++
			if a.IsCorrect != nil && *a.IsCorrect {
				stats.Correct++
			}
		}
	}

	compEvals := make([]models.CompetencyEvaluation, 0, len(compMap))
	for compID, stats := range compMap {
		compScore := 0.0
		compAccuracy := 0.0
		if stats.Total > 0 {
			compScore = (float64(stats.Correct) / float64(stats.Total)) * 100
			compAccuracy = compScore
		}
		level := models.PerformanceLevelLow
		if compScore >= 70 {
			level = models.PerformanceLevelHigh
		} else if compScore >= 40 {
			level = models.PerformanceLevelMedium
		}
		compEvals = append(compEvals, models.CompetencyEvaluation{
			EvaluationID:   evalID,
			UserID:         userID,
			CompetencyID:   compID,
			TotalQuestions: stats.Total,
			CorrectAnswers: stats.Correct,
			Score:          compScore,
			Accuracy:       compAccuracy,
			Level:          level,
		})
	}

	now := time.Now()
	attempt.Status = models.AttemptStatusCompleted
	attempt.Score = &score
	attempt.SubmittedAt = &now

	if s.db != nil {
		err = s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
			if err := tx.Save(attempt).Error; err != nil {
				return err
			}
			if err := tx.Create(&evaluation).Error; err != nil {
				return err
			}
			if len(compEvals) > 0 {
				if err := tx.Create(&compEvals).Error; err != nil {
					return err
				}
			}
			return nil
		})
		if err != nil {
			return nil, err
		}
	} else {
		// Test path — just update attempt
		_ = s.attemptRepo.UpdateAttempt(ctx, attempt)
	}

	return &dto.CompleteAttemptResponse{
		AttemptID:        attempt.ID,
		Status:           string(attempt.Status),
		Score:            score,
		TotalQuestions:   tryout.TotalQuestions,
		CorrectAnswers:   correctCount,
		Accuracy:         accuracy,
		TimeTakenSeconds: int(now.Sub(attempt.StartedAt).Seconds()),
		EvaluationID:     evalID,
	}, nil
}

func (s *tryoutAttemptService) ListMyAttempts(ctx context.Context, userID uuid.UUID, filter dto.MyAttemptsFilter) (*dto.PaginatedAttemptsResponse, error) {
	attempts, total, err := s.attemptRepo.ListByUserID(ctx, userID, filter)
	if err != nil {
		return nil, err
	}

	items := make([]dto.AttemptStatusResponse, len(attempts))
	for i, a := range attempts {
		var tq, ds int
		tryout, err := s.tryoutRepo.FindByID(ctx, a.TryoutID)
		if err == nil && tryout != nil {
			tq = tryout.TotalQuestions
			ds = tryout.DurationSeconds
		}

		elapsed := int(time.Since(a.StartedAt).Seconds())
		remaining := ds - elapsed
		if remaining < 0 {
			remaining = 0
		}

		answeredCount, _ := s.attemptRepo.CountAnswers(ctx, a.ID)

		items[i] = dto.AttemptStatusResponse{
			AttemptID:             a.ID,
			Status:                string(a.Status),
			CurrentQuestionNumber: a.CurrentQuestionNumber,
			TotalQuestions:        tq,
			DurationSeconds:       ds,
			StartedAt:             a.StartedAt,
			RemainingSeconds:      remaining,
			AnsweredCount:         int(answeredCount),
		}
	}

	return &dto.PaginatedAttemptsResponse{
		Attempts: items,
		Total:    total,
		Limit:    filter.Limit,
		Offset:   filter.Offset,
	}, nil
}
