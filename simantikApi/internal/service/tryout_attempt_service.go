package service

import (
	"context"
	"errors"
	"fmt"
	"math/rand"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"simantikApi/internal/domain/adaptive"
	"simantikApi/internal/dto"
	"simantikApi/internal/models"
	"simantikApi/internal/repository"
	"simantikApi/pkg/utils"
)

// TryoutAttemptService defines business operations for the Attempt Engine.
type TryoutAttemptService interface {
	AutoMatchTryout(ctx context.Context, userID uuid.UUID) (*models.Tryout, error)
	StartAttempt(ctx context.Context, tryoutID, userID uuid.UUID) (*dto.StartAttemptResponse, error)
	GetAttemptStatus(ctx context.Context, attemptID, userID uuid.UUID) (*dto.AttemptStatusResponse, error)
	GetAttemptQuestion(ctx context.Context, attemptID uuid.UUID, questionNumber int, userID uuid.UUID) (*dto.AttemptQuestionResponse, error)
	SubmitAnswer(ctx context.Context, attemptID, userID uuid.UUID, req dto.SubmitAnswerRequest) (*dto.SubmitAnswerResponse, error)
	CompleteAttempt(ctx context.Context, attemptID, userID uuid.UUID, autoSubmitReq ...dto.AutoSubmitAttemptRequest) (*dto.CompleteAttemptResponse, error)
	ListMyAttempts(ctx context.Context, userID uuid.UUID, filter dto.MyAttemptsFilter) (*dto.PaginatedAttemptsResponse, error)
}

type tryoutAttemptService struct {
	db             *gorm.DB
	attemptRepo    repository.TryoutAttemptRepository
	tryoutRepo     repository.TryoutRepository
	adaptiveEngine adaptive.Engine
	emailSender    utils.EmailSender
	resolver       *JenjangResolver
}

// NewTryoutAttemptService constructs a TryoutAttemptService.
func NewTryoutAttemptService(
	db *gorm.DB,
	attemptRepo repository.TryoutAttemptRepository,
	tryoutRepo repository.TryoutRepository,
	emailSender utils.EmailSender,
	resolver *JenjangResolver,
) TryoutAttemptService {
	eng := adaptive.NewEngine(adaptive.DefaultConfig())

	return &tryoutAttemptService{
		db:             db,
		attemptRepo:    attemptRepo,
		tryoutRepo:     tryoutRepo,
		adaptiveEngine: eng,
		emailSender:    emailSender,
		resolver:       resolver,
	}
}

// totalQuestions returns the number of questions currently assigned to the
// tryout pool (tryout_questions). It replaces the previous manually-stored
// TotalQuestions column.
func (s *tryoutAttemptService) totalQuestions(ctx context.Context, tryoutID uuid.UUID) int {
	n, err := s.tryoutRepo.CountPoolQuestions(ctx, tryoutID)
	if err != nil {
		return 0
	}
	count := int(n)
	if count >= 5 {
		count = count / 5
	}
	return count
}


func (s *tryoutAttemptService) AutoMatchTryout(ctx context.Context, userID uuid.UUID) (*models.Tryout, error) {
	filter := dto.ListTryoutFilter{Limit: 50}
	if s.resolver != nil {
		if jenjang, err := s.resolver.Resolve(ctx, userID); err == nil && jenjang != "" {
			filter.Jenjang = jenjang
		}
	}

	publishedTryouts, total, err := s.tryoutRepo.ListPublished(ctx, filter)
	if err != nil || total == 0 || len(publishedTryouts) == 0 {
		return nil, ErrTryoutNotAvailable
	}

	// 1. If student already has an active attempt, return that tryout
	activeAttempts, _, _ := s.attemptRepo.ListByUserID(ctx, userID, dto.MyAttemptsFilter{Status: string(models.AttemptStatusInProgress)})
	for _, a := range activeAttempts {
		if t, err := s.tryoutRepo.FindByID(ctx, a.TryoutID); err == nil && t.Status == models.ContentStatusPublished {
			return t, nil
		}
	}

	// 2. Identify completed tryouts
	completedAttempts, _, _ := s.attemptRepo.ListByUserID(ctx, userID, dto.MyAttemptsFilter{Status: string(models.AttemptStatusCompleted)})
	completedMap := make(map[uuid.UUID]bool, len(completedAttempts))
	for _, a := range completedAttempts {
		completedMap[a.TryoutID] = true
	}

	// 3. Identify weak competencies from evaluations
	weakCompetencies := make(map[uuid.UUID]bool)
	if s.db != nil {
		var compEvals []models.CompetencyEvaluation
		_ = s.db.WithContext(ctx).Where("user_id = ? AND (score < 60 OR accuracy < 60)", userID).Find(&compEvals).Error
		for _, ce := range compEvals {
			weakCompetencies[ce.CompetencyID] = true
		}
	}

	// 4. Score candidate tryouts
	type scoredTryout struct {
		tryout *models.Tryout
		score  int
	}
	var scored []scoredTryout
	rng := rand.New(rand.NewSource(time.Now().UnixNano()))

	weakKeys := make([]uuid.UUID, 0, len(weakCompetencies))
	for k := range weakCompetencies {
		weakKeys = append(weakKeys, k)
	}

	for i := range publishedTryouts {
		t := &publishedTryouts[i]
		pts := 0

		// Strongly prioritize tryouts not yet completed
		if !completedMap[t.ID] {
			pts += 100
		}

		// Bonus for matching weak competencies
		if s.db != nil && len(weakKeys) > 0 {
			var matchCount int64
			_ = s.db.WithContext(ctx).Table("tryout_questions").
				Joins("JOIN question_competencies ON question_competencies.question_id = tryout_questions.question_id").
				Where("tryout_questions.tryout_id = ? AND question_competencies.competency_id IN ?", t.ID, weakKeys).
				Count(&matchCount).Error
			pts += int(matchCount) * 10
		}

		pts += rng.Intn(10) // random tie-breaker noise
		scored = append(scored, scoredTryout{tryout: t, score: pts})
	}

	best := scored[0].tryout
	bestScore := scored[0].score
	for _, st := range scored {
		if st.score > bestScore {
			bestScore = st.score
			best = st.tryout
		}
	}

	return best, nil
}

func (s *tryoutAttemptService) StartAttempt(ctx context.Context, tryoutID, userID uuid.UUID) (*dto.StartAttemptResponse, error) {
	if tryoutID == uuid.Nil {
		matched, err := s.AutoMatchTryout(ctx, userID)
		if err != nil {
			return nil, err
		}
		tryoutID = matched.ID
	}

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

	// Siswa hanya boleh mengerjakan tryout dengan jenjang yang sesuai.
	if s.resolver != nil {
		if jenjang, rerr := s.resolver.Resolve(ctx, userID); rerr == nil && jenjang != "" && tryout.Jenjang != models.SchoolLevel(jenjang) {
			return nil, ErrTryoutNotAvailable
		}
	}

	now := time.Now()
	if tryout.StartAt != nil && now.Before(*tryout.StartAt) {
		return nil, ErrTryoutNotAvailable
	}
	if tryout.EndAt != nil && now.After(*tryout.EndAt) {
		return nil, ErrTryoutNotAvailable
	}

	// Resume if there's already an active attempt
	existing, err := s.attemptRepo.FindActiveAttempt(ctx, userID, tryoutID)
	if err == nil && existing != nil {
		return &dto.StartAttemptResponse{
			AttemptID:             existing.ID,
			TryoutID:              tryoutID,
			TotalQuestions:        s.totalQuestions(ctx, tryoutID),
			DurationSeconds:       tryout.DurationSeconds,
			StartedAt:             existing.StartedAt,
			Status:                string(existing.Status),
			CurrentQuestionNumber: existing.CurrentQuestionNumber,
		}, nil
	} else if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	poolQuestions, err := s.tryoutRepo.GetPoolQuestionIDs(ctx, tryoutID)
	if err != nil {
		return nil, err
	}
	if len(poolQuestions) == 0 {
		return nil, ErrInsufficientPool
	}

	// 1. Initial random difficulty between 1 and 5
	initialDifficulty := s.adaptiveEngine.RandomInitialDifficulty()
	initialTargetStreak := s.adaptiveEngine.RandomStreakWindow()

	attempt := models.TryoutAttempt{
		UserID:                 userID,
		TryoutID:               tryoutID,
		Status:                 models.AttemptStatusInProgress,
		CurrentQuestionNumber:  1,
		CurrentDifficultyLevel: initialDifficulty,
		TargetStreak:           initialTargetStreak,
		WindowCorrect:          0,
		WindowIncorrect:        0,
		IsTieBreaker:           false,
		CorrectStreak:          0,
		StartedAt:              now,
	}

	// Build pool candidates with difficulty levels
	var candidates []adaptive.QuestionCandidate
	if s.db != nil {
		var poolQModels []models.Question
		_ = s.db.WithContext(ctx).Where("id IN ?", poolQuestions).Find(&poolQModels).Error
		candidates = make([]adaptive.QuestionCandidate, len(poolQModels))
		for i, q := range poolQModels {
			candidates[i] = adaptive.QuestionCandidate{
				ID:              q.ID,
				DifficultyLevel: q.DifficultyLevel,
			}
		}
	} else {
		candidates = make([]adaptive.QuestionCandidate, len(poolQuestions))
		for i, id := range poolQuestions {
			candidates[i] = adaptive.QuestionCandidate{
				ID:              id,
				DifficultyLevel: (i % 5) + 1,
			}
		}
	}

	// Select Question 1 matching initialDifficulty
	firstQ := s.adaptiveEngine.SelectNextQuestion(candidates, nil, initialDifficulty)
	firstQID := poolQuestions[0]
	firstQDiff := initialDifficulty
	if firstQ != nil {
		firstQID = firstQ.ID
		firstQDiff = firstQ.DifficultyLevel
	}

	usedMap := map[uuid.UUID]bool{firstQID: true}
	aqs := make([]models.AttemptQuestion, len(poolQuestions))
	aqs[0] = models.AttemptQuestion{
		QuestionID:      firstQID,
		QuestionNumber:  1,
		DifficultyLevel: firstQDiff,
		PresentedAt:     now,
	}

	// Pre-populate remaining slots from pool
	slot := 1
	for _, qid := range poolQuestions {
		if slot >= len(poolQuestions) {
			break
		}
		if !usedMap[qid] {
			usedMap[qid] = true
			diff := initialDifficulty
			for _, c := range candidates {
				if c.ID == qid {
					diff = c.DifficultyLevel
					break
				}
			}
			aqs[slot] = models.AttemptQuestion{
				QuestionID:      qid,
				QuestionNumber:  slot + 1,
				DifficultyLevel: diff,
				PresentedAt:     now,
			}
			slot++
		}
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

	effectiveTotal := len(poolQuestions)
	if effectiveTotal >= 5 {
		effectiveTotal = effectiveTotal / 5
	}

	return &dto.StartAttemptResponse{
		AttemptID:             attempt.ID,
		TryoutID:              tryout.ID,
		TotalQuestions:        effectiveTotal,
		DurationSeconds:       tryout.DurationSeconds,
		StartedAt:             attempt.StartedAt,
		Status:                string(attempt.Status),
		CurrentQuestionNumber: attempt.CurrentQuestionNumber,
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
		TotalQuestions:        s.totalQuestions(ctx, attempt.TryoutID),
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
		TotalQuestions: s.totalQuestions(ctx, attempt.TryoutID),
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

	// Update adaptive progression state using dynamic window streak & tie breaker
	windowState := adaptive.WindowState{
		CurrentDifficulty: attempt.CurrentDifficultyLevel,
		TargetStreak:      attempt.TargetStreak,
		WindowCorrect:     attempt.WindowCorrect,
		WindowIncorrect:   attempt.WindowIncorrect,
		IsTieBreaker:      attempt.IsTieBreaker,
	}
	stepResult := s.adaptiveEngine.CalculateAdaptiveWindowStep(windowState, isCorrect)
	attempt.CurrentDifficultyLevel = stepResult.NextDifficulty
	attempt.TargetStreak = stepResult.NextTargetStreak
	attempt.WindowCorrect = stepResult.NextWindowCorrect
	attempt.WindowIncorrect = stepResult.NextWindowIncorrect
	attempt.IsTieBreaker = stepResult.IsTieBreaker

	if isCorrect {
		attempt.CorrectStreak++
	} else {
		attempt.CorrectStreak = 0
	}

	// Adapt next question difficulty (questionNumber + 1)
	nextQNum := aq.QuestionNumber + 1
	if nextQNum <= s.totalQuestions(ctx, attempt.TryoutID) {
		nextAQ, err := s.attemptRepo.FindAttemptQuestionByNumber(ctx, attemptID, nextQNum)
		if err == nil && nextAQ != nil {
			existingAns, _ := s.attemptRepo.FindAnswer(ctx, attemptID, nextAQ.QuestionID)
			if existingAns == nil {
				poolQIDs, err := s.tryoutRepo.GetPoolQuestionIDs(ctx, attempt.TryoutID)
				if err == nil && len(poolQIDs) > 0 {
					allAQs, _ := s.attemptRepo.FindAttemptQuestions(ctx, attemptID)
					exposedIDs := make([]uuid.UUID, 0, len(allAQs))
					for _, item := range allAQs {
						if item.QuestionNumber <= aq.QuestionNumber {
							exposedIDs = append(exposedIDs, item.QuestionID)
						}
					}

					var candidates []adaptive.QuestionCandidate
					if s.db != nil {
						var poolQModels []models.Question
						_ = s.db.WithContext(ctx).Where("id IN ?", poolQIDs).Find(&poolQModels).Error
						candidates = make([]adaptive.QuestionCandidate, len(poolQModels))
						for i, q := range poolQModels {
							candidates[i] = adaptive.QuestionCandidate{
								ID:              q.ID,
								DifficultyLevel: q.DifficultyLevel,
							}
						}
					} else {
						candidates = make([]adaptive.QuestionCandidate, len(poolQIDs))
						for i, id := range poolQIDs {
							candidates[i] = adaptive.QuestionCandidate{
								ID:              id,
								DifficultyLevel: (i % 5) + 1,
							}
						}
					}

					chosen := s.adaptiveEngine.SelectNextQuestion(candidates, exposedIDs, attempt.CurrentDifficultyLevel)
					if chosen != nil && chosen.ID != nextAQ.QuestionID {
						nextAQ.QuestionID = chosen.ID
						nextAQ.DifficultyLevel = chosen.DifficultyLevel
						if s.db != nil {
							_ = s.db.WithContext(ctx).Save(nextAQ).Error
						}
					}
				}
			}
		}
		attempt.CurrentQuestionNumber = nextQNum
	}

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

func (s *tryoutAttemptService) CompleteAttempt(ctx context.Context, attemptID, userID uuid.UUID, autoSubmitReq ...dto.AutoSubmitAttemptRequest) (*dto.CompleteAttemptResponse, error) {
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

	isAutoSubmit := false
	autoSubmitReason := ""
	if len(autoSubmitReq) > 0 {
		isAutoSubmit = true
		autoSubmitReason = autoSubmitReq[0].Reason
		if autoSubmitReason == "" {
			autoSubmitReason = "VIOLATION_THRESHOLD_EXCEEDED"
		}

		// Flush any pending answers sent along with auto-submit payload
		for _, ansReq := range autoSubmitReq[0].Answers {
			if ansReq.QuestionID != uuid.Nil {
				_ , _ = s.SubmitAnswer(ctx, attemptID, userID, ansReq)
			}
		}
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

	totalQ := s.totalQuestions(ctx, attempt.TryoutID)
	score := 0.0
	if totalQ > 0 {
		score = (float64(correctCount) / float64(totalQ)) * 100
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
		TotalQuestions:   totalQ,
		CorrectAnswers:   correctCount,
		IncorrectAnswers: len(answers) - correctCount,
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
	attempt.IsAutoSubmitted = isAutoSubmit
	attempt.AutoSubmitReason = autoSubmitReason

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

	timeTakenSec := int(now.Sub(attempt.StartedAt).Seconds())

	// Dispatch detailed result email in background (non-blocking)
	if s.emailSender != nil {
		go s.sendTryoutResultEmailAsync(attempt.ID, userID, tryout.Title, score, accuracy, timeTakenSec)
	}

	return &dto.CompleteAttemptResponse{
		AttemptID:        attempt.ID,
		Status:           string(attempt.Status),
		Score:            score,
		TotalQuestions:   totalQ,
		CorrectAnswers:   correctCount,
		Accuracy:         accuracy,
		TimeTakenSeconds: timeTakenSec,
		EvaluationID:     evalID,
		IsAutoSubmitted:  isAutoSubmit,
		AutoSubmitReason: autoSubmitReason,
	}, nil
}

// sendTryoutResultEmailAsync fetches the 30 delivered questions, their correctness, options, and explanations in bulk,
// then delivers a rich HTML report email to the student asynchronously.
func (s *tryoutAttemptService) sendTryoutResultEmailAsync(attemptID, userID uuid.UUID, tryoutTitle string, score, accuracy float64, timeTakenSec int) {
	if s.emailSender == nil || s.db == nil {
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// 1. Fetch student user record
	var user models.User
	if err := s.db.WithContext(ctx).First(&user, "id = ?", userID).Error; err != nil || user.Email == "" {
		return
	}

	// 2. Fetch all 30 AttemptQuestion records for this attempt in bulk with preloads
	var aqs []models.AttemptQuestion
	err := s.db.WithContext(ctx).
		Preload("Question").
		Preload("Question.Options", func(db *gorm.DB) *gorm.DB {
			return db.Order("display_order ASC")
		}).
		Preload("Question.Explanation").
		Where("attempt_id = ?", attemptID).
		Order("question_number ASC").
		Find(&aqs).Error
	if err != nil || len(aqs) == 0 {
		return
	}

	// 3. Fetch all student answers for this attempt in bulk
	var answers []models.StudentAnswer
	_ = s.db.WithContext(ctx).Where("attempt_id = ?", attemptID).Find(&answers).Error

	ansMap := make(map[uuid.UUID]models.StudentAnswer, len(answers))
	for _, a := range answers {
		ansMap[a.QuestionID] = a
	}

	// 4. Build email question items
	items := make([]utils.TryoutQuestionEmailItem, len(aqs))
	correctCount := 0

	for i, aq := range aqs {
		q := aq.Question
		ans, hasAns := ansMap[aq.QuestionID]

		isCorrect := false
		studentAnsText := "(Tidak dijawab)"
		correctAnsText := ""

		if hasAns && ans.IsCorrect != nil {
			isCorrect = *ans.IsCorrect
			if isCorrect {
				correctCount++
			}
		}

		if q != nil {
			for _, opt := range q.Options {
				if opt.IsCorrect {
					correctAnsText = fmt.Sprintf("%s. %s", opt.OptionLabel, opt.OptionText)
				}
				if hasAns && ans.SelectedOptionID != nil && *ans.SelectedOptionID == opt.ID {
					studentAnsText = fmt.Sprintf("%s. %s", opt.OptionLabel, opt.OptionText)
				}
			}
			if studentAnsText == "(Tidak dijawab)" && hasAns && ans.AnswerData != "" {
				studentAnsText = ans.AnswerData
			}
		}

		explanation := ""
		tips := ""
		if q != nil && q.Explanation != nil {
			explanation = q.Explanation.Explanation
			tips = q.Explanation.AnsweringTips
		}

		qText := ""
		if q != nil {
			qText = q.QuestionText
		}

		items[i] = utils.TryoutQuestionEmailItem{
			QuestionNumber: aq.QuestionNumber,
			QuestionText:   qText,
			Difficulty:     aq.DifficultyLevel,
			StudentAnswer:  studentAnsText,
			CorrectAnswer:  correctAnsText,
			IsCorrect:      isCorrect,
			Explanation:    explanation,
			AnsweringTips:  tips,
		}
	}

	timeTakenMin := int(timeTakenSec / 60)
	if timeTakenMin < 1 && timeTakenSec > 0 {
		timeTakenMin = 1
	}

	emailData := utils.TryoutResultEmailData{
		StudentEmail:   user.Email,
		StudentName:    user.FullName,
		TryoutTitle:    tryoutTitle,
		Score:          score,
		Accuracy:       accuracy,
		TotalQuestions: len(aqs),
		CorrectCount:   correctCount,
		TimeTakenMin:   timeTakenMin,
		Questions:      items,
	}

	_ = s.emailSender.SendTryoutDetailedResult(ctx, emailData)
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
			tq = s.totalQuestions(ctx, a.TryoutID)
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
