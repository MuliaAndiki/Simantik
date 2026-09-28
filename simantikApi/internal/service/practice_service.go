package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"regexp"
	"strings"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
	"simantikApi/internal/repository"
)

// PracticeService defines the contract for practice package management and student practice execution.
type PracticeService interface {
	// Management (Admin & Content Manager)
	CreatePackage(ctx context.Context, req dto.CreatePracticePackageRequest, createdByID uuid.UUID) (*dto.PracticePackageResponse, error)
	GetPackage(ctx context.Context, id uuid.UUID, isAdmin bool) (*dto.PracticePackageDetailResponse, error)
	UpdatePackage(ctx context.Context, id uuid.UUID, req dto.UpdatePracticePackageRequest, updatedByID uuid.UUID) (*dto.PracticePackageResponse, error)
	UpdatePackageStatus(ctx context.Context, id uuid.UUID, status string, updatedByID uuid.UUID) (*dto.PracticePackageResponse, error)
	DeletePackage(ctx context.Context, id uuid.UUID) error
	ListPackages(ctx context.Context, filter dto.ListPracticePackageFilter, isAdmin bool) (*dto.PaginatedPracticePackagesResponse, error)
	AddQuestionsToPackage(ctx context.Context, packageID uuid.UUID, req dto.AddPracticeQuestionsRequest) (*dto.PracticePackageDetailResponse, error)
	RemoveQuestionFromPackage(ctx context.Context, packageID, questionID uuid.UUID) error

	// Student Practice Execution
	ListPublishedPackages(ctx context.Context, filter dto.ListPracticePackageFilter, userID uuid.UUID) (*dto.PaginatedPracticePackagesResponse, error)
	GetPackageForStudent(ctx context.Context, id, userID uuid.UUID) (*dto.PracticePackageDetailResponse, error)
	StartPracticeAttempt(ctx context.Context, packageID, userID uuid.UUID) (*dto.StartPracticeResponse, error)
	GetAttemptState(ctx context.Context, attemptID, userID uuid.UUID) (*dto.PracticeAttemptDetailResponse, error)
	SubmitAnswer(ctx context.Context, attemptID, userID uuid.UUID, req dto.SubmitPracticeAnswerRequest) (*dto.SubmitPracticeAnswerResponse, error)
	CompletePracticeAttempt(ctx context.Context, attemptID, userID uuid.UUID, autoSubmitReq ...dto.AutoSubmitPracticeRequest) (*dto.CompletePracticeResponse, error)
	GetPracticeResult(ctx context.Context, attemptID, userID uuid.UUID) (*dto.PracticeResultResponse, error)
	ListMyPractices(ctx context.Context, userID uuid.UUID, filter dto.MyPracticesFilter) (*dto.PaginatedPracticesResponse, error)
}

type practiceService struct {
	db             *gorm.DB
	practiceRepo   repository.PracticeRepository
	questionRepo   repository.QuestionRepository
	evaluationRepo repository.EvaluationRepository
	resolver       *JenjangResolver
	recService     RecommendationService
}

// NewPracticeService constructs a PracticeService with required dependencies.
func NewPracticeService(
	db *gorm.DB,
	practiceRepo repository.PracticeRepository,
	questionRepo repository.QuestionRepository,
	evaluationRepo repository.EvaluationRepository,
	resolver *JenjangResolver,
	recService RecommendationService,
) PracticeService {
	return &practiceService{
		db:             db,
		practiceRepo:   practiceRepo,
		questionRepo:   questionRepo,
		evaluationRepo: evaluationRepo,
		resolver:       resolver,
		recService:     recService,
	}
}

// ─── Package Management ──────────────────────────────────────────────────────

func (s *practiceService) CreatePackage(ctx context.Context, req dto.CreatePracticePackageRequest, createdByID uuid.UUID) (*dto.PracticePackageResponse, error) {
	pkg := models.PracticePackage{
		Title:          req.Title,
		Description:    req.Description,
		CompetencyID:   req.CompetencyID,
		Jenjang:        models.SchoolLevel(req.Jenjang),
		TotalQuestions: 0,
		Status:         models.ContentStatusDraft,
		CreatedBy:      createdByID,
		UpdatedBy:      &createdByID,
	}

	if err := s.practiceRepo.CreatePackage(ctx, &pkg); err != nil {
		return nil, err
	}

	return s.mapToPackageResponse(&pkg), nil
}

func (s *practiceService) GetPackage(ctx context.Context, id uuid.UUID, isAdmin bool) (*dto.PracticePackageDetailResponse, error) {
	pkg, err := s.practiceRepo.FindPackageByIDWithQuestions(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrPracticePackageNotFound
		}
		return nil, err
	}

	if !isAdmin && pkg.Status != models.ContentStatusPublished {
		return nil, ErrPracticePackageNotFound
	}

	return s.mapToPackageDetailResponse(pkg), nil
}

func (s *practiceService) UpdatePackage(ctx context.Context, id uuid.UUID, req dto.UpdatePracticePackageRequest, updatedByID uuid.UUID) (*dto.PracticePackageResponse, error) {
	pkg, err := s.practiceRepo.FindPackageByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrPracticePackageNotFound
		}
		return nil, err
	}

	if req.Title != "" {
		pkg.Title = req.Title
	}
	if req.Description != "" {
		pkg.Description = req.Description
	}
	if req.CompetencyID != nil {
		pkg.CompetencyID = req.CompetencyID
	}
	if req.Jenjang != "" {
		pkg.Jenjang = models.SchoolLevel(req.Jenjang)
	}
	if req.Status != "" {
		pkg.Status = models.ContentStatus(req.Status)
	}
	pkg.UpdatedBy = &updatedByID

	if err := s.practiceRepo.UpdatePackage(ctx, pkg); err != nil {
		return nil, err
	}

	// Cascading status: sinkronisasi status semua soal dalam paket latihan
	if req.Status != "" && s.questionRepo != nil {
		if qIDs, err := s.practiceRepo.GetPackageQuestionIDs(ctx, pkg.ID); err == nil && len(qIDs) > 0 {
			_ = s.questionRepo.UpdateStatusByIDs(ctx, qIDs, pkg.Status, updatedByID)
		}
	}

	return s.mapToPackageResponse(pkg), nil
}

func (s *practiceService) UpdatePackageStatus(ctx context.Context, id uuid.UUID, status string, updatedByID uuid.UUID) (*dto.PracticePackageResponse, error) {
	pkg, err := s.practiceRepo.FindPackageByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrPracticePackageNotFound
		}
		return nil, err
	}

	if status == string(models.ContentStatusPublished) {
		count, err := s.practiceRepo.CountPackageQuestions(ctx, id)
		if err != nil {
			return nil, err
		}
		if count == 0 {
			return nil, ErrPracticeEmptyPackage
		}
	}

	pkg.Status = models.ContentStatus(status)
	pkg.UpdatedBy = &updatedByID

	if err := s.practiceRepo.UpdatePackage(ctx, pkg); err != nil {
		return nil, err
	}

	// Cascading status: sinkronisasi status semua soal dalam paket latihan (published, draft, archived)
	if s.questionRepo != nil {
		if qIDs, err := s.practiceRepo.GetPackageQuestionIDs(ctx, id); err == nil && len(qIDs) > 0 {
			_ = s.questionRepo.UpdateStatusByIDs(ctx, qIDs, pkg.Status, updatedByID)
		}
	}

	return s.mapToPackageResponse(pkg), nil
}

func (s *practiceService) DeletePackage(ctx context.Context, id uuid.UUID) error {
	pkg, err := s.practiceRepo.FindPackageByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrPracticePackageNotFound
		}
		return err
	}

	if pkg.Status == models.ContentStatusPublished {
		return ErrCannotDeletePublishedPractice
	}

	return s.practiceRepo.DeletePackage(ctx, id)
}

func (s *practiceService) ListPackages(ctx context.Context, filter dto.ListPracticePackageFilter, isAdmin bool) (*dto.PaginatedPracticePackagesResponse, error) {
	if !isAdmin {
		filter.Status = string(models.ContentStatusPublished)
	}

	pkgs, total, err := s.practiceRepo.ListPackages(ctx, filter)
	if err != nil {
		return nil, err
	}

	responses := make([]dto.PracticePackageResponse, len(pkgs))
	for i := range pkgs {
		count, _ := s.practiceRepo.CountPackageQuestions(ctx, pkgs[i].ID)
		pkgs[i].TotalQuestions = int(count)
		responses[i] = *s.mapToPackageResponse(&pkgs[i])
	}

	return &dto.PaginatedPracticePackagesResponse{
		Packages: responses,
		Total:    total,
		Limit:    filter.Limit,
		Offset:   filter.Offset,
	}, nil
}

func (s *practiceService) AddQuestionsToPackage(ctx context.Context, packageID uuid.UUID, req dto.AddPracticeQuestionsRequest) (*dto.PracticePackageDetailResponse, error) {
	pkg, err := s.practiceRepo.FindPackageByID(ctx, packageID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrPracticePackageNotFound
		}
		return nil, err
	}

	if err := s.practiceRepo.AddQuestionsToPackage(ctx, packageID, req.QuestionIDs); err != nil {
		return nil, err
	}

	// Update cached total questions
	count, _ := s.practiceRepo.CountPackageQuestions(ctx, packageID)
	pkg.TotalQuestions = int(count)
	_ = s.practiceRepo.UpdatePackage(ctx, pkg)

	return s.GetPackage(ctx, packageID, true)
}

func (s *practiceService) RemoveQuestionFromPackage(ctx context.Context, packageID, questionID uuid.UUID) error {
	pkg, err := s.practiceRepo.FindPackageByID(ctx, packageID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrPracticePackageNotFound
		}
		return err
	}

	if err := s.practiceRepo.RemoveQuestionFromPackage(ctx, packageID, questionID); err != nil {
		return err
	}

	// Update cached count
	count, _ := s.practiceRepo.CountPackageQuestions(ctx, packageID)
	pkg.TotalQuestions = int(count)
	_ = s.practiceRepo.UpdatePackage(ctx, pkg)

	return nil
}

// ─── Student Practice Execution ──────────────────────────────────────────────

func (s *practiceService) ListPublishedPackages(ctx context.Context, filter dto.ListPracticePackageFilter, userID uuid.UUID) (*dto.PaginatedPracticePackagesResponse, error) {
	filter.Status = string(models.ContentStatusPublished)

	// Pisahkan berdasarkan jenjang siswa.
	if filter.Jenjang == "" && s.resolver != nil {
		if jenjang, err := s.resolver.Resolve(ctx, userID); err == nil && jenjang != "" {
			filter.Jenjang = jenjang
		}
	}

	res, err := s.ListPackages(ctx, filter, false)
	if err != nil {
		return nil, err
	}

	// Enrich with student completion & score
	for i := range res.Packages {
		pkgID := res.Packages[i].ID
		latest, err := s.practiceRepo.FindLatestCompletedAttempt(ctx, userID, pkgID)
		if err == nil && latest != nil {
			isCompleted := true
			res.Packages[i].IsCompleted = &isCompleted
			res.Packages[i].LatestScore = latest.Score
			res.Packages[i].LatestAttemptID = &latest.ID
		} else {
			isCompleted := false
			res.Packages[i].IsCompleted = &isCompleted
		}
	}

	return res, nil
}

func (s *practiceService) GetPackageForStudent(ctx context.Context, id, userID uuid.UUID) (*dto.PracticePackageDetailResponse, error) {
	pkg, err := s.GetPackage(ctx, id, false)
	if err != nil {
		return nil, err
	}

	// Siswa hanya boleh mengakses paket dengan jenjang yang sesuai.
	if s.resolver != nil {
		if jenjang, rerr := s.resolver.Resolve(ctx, userID); rerr == nil && jenjang != "" && pkg.Jenjang != jenjang {
			return nil, ErrPracticePackageNotFound
		}
	}

	return pkg, nil
}

func (s *practiceService) StartPracticeAttempt(ctx context.Context, packageID, userID uuid.UUID) (*dto.StartPracticeResponse, error) {
	pkg, err := s.practiceRepo.FindPackageByID(ctx, packageID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrPracticePackageNotFound
		}
		return nil, err
	}

	if pkg.Status != models.ContentStatusPublished {
		return nil, ErrPracticeNotAvailable
	}

	// Siswa hanya boleh mengerjakan paket dengan jenjang yang sesuai.
	if s.resolver != nil {
		if jenjang, rerr := s.resolver.Resolve(ctx, userID); rerr == nil && jenjang != "" && pkg.Jenjang != models.SchoolLevel(jenjang) {
			return nil, ErrPracticeNotAvailable
		}
	}

	// Resume active attempt if one already exists
	active, err := s.practiceRepo.FindActiveAttempt(ctx, userID, packageID)
	if err == nil && active != nil {
		count, _ := s.practiceRepo.CountPackageQuestions(ctx, packageID)
		return &dto.StartPracticeResponse{
			AttemptID:      active.ID,
			PackageID:      packageID,
			PackageTitle:   pkg.Title,
			TotalQuestions: int(count),
			StartedAt:      active.StartedAt,
			Status:         string(active.Status),
		}, nil
	}

	qIDs, err := s.practiceRepo.GetPackageQuestionIDs(ctx, packageID)
	if err != nil {
		return nil, err
	}
	if len(qIDs) == 0 {
		return nil, ErrPracticeEmptyPackage
	}

	now := time.Now()
	attempt := models.Practice{
		UserID:         userID,
		PackageID:      &packageID,
		CompetencyID:   pkg.CompetencyID,
		Status:         models.AttemptStatusInProgress,
		TotalQuestions: len(qIDs),
		StartedAt:      now,
	}

	if err := s.practiceRepo.CreateAttempt(ctx, &attempt); err != nil {
		return nil, err
	}

	return &dto.StartPracticeResponse{
		AttemptID:      attempt.ID,
		PackageID:      packageID,
		PackageTitle:   pkg.Title,
		TotalQuestions: len(qIDs),
		StartedAt:      now,
		Status:         string(models.AttemptStatusInProgress),
	}, nil
}

func (s *practiceService) GetAttemptState(ctx context.Context, attemptID, userID uuid.UUID) (*dto.PracticeAttemptDetailResponse, error) {
	attempt, err := s.practiceRepo.FindAttemptByIDWithDetails(ctx, attemptID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrPracticeNotFound
		}
		return nil, err
	}

	if attempt.UserID != userID {
		return nil, ErrPracticeNotOwner
	}

	pkgTitle := ""
	if attempt.Package != nil {
		pkgTitle = attempt.Package.Title
	}

	var questions []dto.QuestionStudentResponse
	if attempt.Package != nil {
		questions = make([]dto.QuestionStudentResponse, len(attempt.Package.Questions))
		for i, q := range attempt.Package.Questions {
			questions[i] = s.mapQuestionStudentResponse(&q)
		}
	}

	answers := make([]dto.PracticeAnswerItem, len(attempt.Answers))
	for i, a := range attempt.Answers {
		answers[i] = dto.PracticeAnswerItem{
			QuestionID:       a.QuestionID,
			SelectedOptionID: a.SelectedOptionID,
			AnswerData:       a.AnswerData,
			AnsweredAt:       a.AnsweredAt,
		}
	}

	return &dto.PracticeAttemptDetailResponse{
		AttemptID:      attempt.ID,
		PackageID:      *attempt.PackageID,
		PackageTitle:   pkgTitle,
		Status:         string(attempt.Status),
		TotalQuestions: len(questions),
		AnsweredCount:  len(answers),
		StartedAt:      attempt.StartedAt,
		Questions:      questions,
		Answers:        answers,
	}, nil
}

var KunciMarkerRegex = regexp.MustCompile(`(?i)\[KUNCI:\s*([^\]]+)\]`)

// NormalizeAnswerKey menyamakan format kunci ("TIDAK SETUJU" vs "TIDAK_SETUJU", case).
func NormalizeAnswerKey(s string) string {
	return strings.ToUpper(strings.ReplaceAll(strings.TrimSpace(s), " ", "_"))
}

// gradeStructuredAnswer menilai jawaban terstruktur tanpa SelectedOptionID:
// - objek JSON {"optionID": "SETUJU"} = matriks/true-false, dinilai per pernyataan
// lawan marker [KUNCI: ...] di option_text
// - array JSON ["id1", "id2"] = pilihan ganda kompleks, dinilai kesamaan himpunan
// dengan opsi bertanda IsCorrect
func (s *practiceService) gradeStructuredAnswer(ctx context.Context, questionID uuid.UUID, answerData string) bool {
	if s.db == nil || strings.TrimSpace(answerData) == "" {
		return false
	}
	var opts []models.QuestionOption
	if err := s.db.WithContext(ctx).Where("question_id = ?", questionID).Find(&opts).Error; err != nil || len(opts) == 0 {
		return false
	}

	trimmed := strings.TrimSpace(answerData)

	// 1. Matrix / true-false: JSON object
	var matrixAns map[string]string
	if err := json.Unmarshal([]byte(trimmed), &matrixAns); err == nil && len(matrixAns) > 0 {
		lowered := make(map[string]string, len(matrixAns))
		for k, v := range matrixAns {
			lowered[strings.ToLower(k)] = v
		}
		graded := 0
		for _, opt := range opts {
			m := KunciMarkerRegex.FindStringSubmatch(opt.OptionText)
			if len(m) < 2 {
				continue
			}
			graded++
			ans, ok := lowered[strings.ToLower(opt.ID.String())]
			if !ok || NormalizeAnswerKey(ans) != NormalizeAnswerKey(m[1]) {
				return false
			}
		}
		return graded > 0
	}

	// 2. MCMA: JSON array of option IDs
	var mcmaAns []string
	if err := json.Unmarshal([]byte(trimmed), &mcmaAns); err == nil {
		correct := make(map[string]bool)
		for _, opt := range opts {
			if opt.IsCorrect {
				correct[opt.ID.String()] = true
			}
		}
		if len(mcmaAns) != len(correct) {
			return false
		}
		for _, id := range mcmaAns {
			parsed, err := uuid.Parse(strings.Trim(strings.TrimSpace(id), "\""))
			if err != nil || !correct[parsed.String()] {
				return false
			}
		}
		return len(correct) > 0
	}

	return false
}

func (s *practiceService) SubmitAnswer(ctx context.Context, attemptID, userID uuid.UUID, req dto.SubmitPracticeAnswerRequest) (*dto.SubmitPracticeAnswerResponse, error) {
	attempt, err := s.practiceRepo.FindAttemptByID(ctx, attemptID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrPracticeNotFound
		}
		return nil, err
	}

	if attempt.UserID != userID {
		return nil, ErrPracticeNotOwner
	}
	if attempt.Status != models.AttemptStatusInProgress && attempt.Status != models.AttemptStatusCompleted {
		return nil, ErrPracticeNotActive
	}

	// Verify question belongs to this practice package if package has pre-bound questions
	if attempt.PackageID != nil {
		pkgQIDs, err := s.practiceRepo.GetPackageQuestionIDs(ctx, *attempt.PackageID)
		if err == nil && len(pkgQIDs) > 0 {
			found := false
			for _, id := range pkgQIDs {
				if id == req.QuestionID {
					found = true
					break
				}
			}
			if !found {
				return nil, ErrPracticeQuestionNotFound
			}
		}
	}

	// Fallback to parse AnswerData as option UUID if SelectedOptionID was omitted
	if req.SelectedOptionID == nil && req.AnswerData != "" {
		clean := strings.Trim(strings.TrimSpace(req.AnswerData), "\"")
		if parsedOptID, err := uuid.Parse(clean); err == nil {
			req.SelectedOptionID = &parsedOptID
		}
	}

	// Evaluate correctness server-side based on option
	isCorrect := false
	if req.SelectedOptionID != nil && s.db != nil {
		var opt models.QuestionOption
		if err := s.db.WithContext(ctx).First(&opt, "id = ?", req.SelectedOptionID).Error; err == nil {
			isCorrect = opt.IsCorrect
		}
	} else if req.AnswerData != "" {
		// Matrix / MCMA answers carry no SelectedOptionID (JSON in AnswerData)
		isCorrect = s.gradeStructuredAnswer(ctx, req.QuestionID, req.AnswerData)
	}

	scoreVal := 0.0
	if isCorrect {
		scoreVal = 1.0
	}

	isCorrectPtr := &isCorrect
	scorePtr := &scoreVal

	ans := models.PracticeAnswer{
		PracticeID:       attemptID,
		QuestionID:       req.QuestionID,
		SelectedOptionID: req.SelectedOptionID,
		AnswerData:       req.AnswerData,
		IsCorrect:        isCorrectPtr,
		Score:            scorePtr,
		AnsweredAt:       time.Now(),
	}

	if err := s.practiceRepo.UpsertAnswer(ctx, &ans); err != nil {
		return nil, err
	}

	// Fetch explanation for immediate feedback
	var q models.Question
	var explanationStr *string
	var tipsStr *string
	if s.db != nil {
		if err := s.db.WithContext(ctx).Preload("Explanation").First(&q, "id = ?", req.QuestionID).Error; err == nil {
			if q.Explanation != nil {
				explanationStr = &q.Explanation.Explanation
				if q.Explanation.AnsweringTips != "" {
					tipsStr = &q.Explanation.AnsweringTips
				}
			}
		}
	}

	return &dto.SubmitPracticeAnswerResponse{
		QuestionID:    req.QuestionID,
		Saved:         true,
		IsCorrect:     isCorrectPtr,
		Explanation:   explanationStr,
		AnsweringTips: tipsStr,
	}, nil
}

func (s *practiceService) CompletePracticeAttempt(ctx context.Context, attemptID, userID uuid.UUID, autoSubmitReq ...dto.AutoSubmitPracticeRequest) (*dto.CompletePracticeResponse, error) {
	attempt, err := s.practiceRepo.FindAttemptByID(ctx, attemptID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrPracticeNotFound
		}
		return nil, err
	}

	if attempt.UserID != userID {
		return nil, ErrPracticeNotOwner
	}
	if attempt.Status == models.AttemptStatusCompleted {
		hasNewAnswers := len(autoSubmitReq) > 0 && len(autoSubmitReq[0].Answers) > 0

		// If no new answers are provided, return current completed result idempotently
		if !hasNewAnswers {
			ansCount, _ := s.practiceRepo.CountAnswers(ctx, attemptID)
			score := 0.0
			if attempt.Score != nil {
				score = *attempt.Score
			}
			completedAt := time.Now()
			if attempt.CompletedAt != nil {
				completedAt = *attempt.CompletedAt
			}
			unanswered := attempt.TotalQuestions - attempt.CorrectAnswers
			if attempt.TotalQuestions > 0 {
				unanswered = attempt.TotalQuestions - int(ansCount)
				if unanswered < 0 {
					unanswered = 0
				}
			}
			incorrect := attempt.TotalQuestions - attempt.CorrectAnswers - unanswered
			if incorrect < 0 {
				incorrect = 0
			}
			return &dto.CompletePracticeResponse{
				AttemptID:        attempt.ID,
				Status:           string(attempt.Status),
				Score:            score,
				TotalQuestions:   attempt.TotalQuestions,
				CorrectAnswers:   attempt.CorrectAnswers,
				IncorrectAnswers: incorrect,
				Unanswered:       unanswered,
				CompletedAt:      completedAt,
				IsAutoSubmitted:  attempt.IsAutoSubmitted,
				AutoSubmitReason: attempt.AutoSubmitReason,
			}, nil
		}
	} else if attempt.Status != models.AttemptStatusInProgress {
		return nil, ErrPracticeNotActive
	}

	isAutoSubmit := false
	autoSubmitReason := ""
	if len(autoSubmitReq) > 0 {
		req := autoSubmitReq[0]
		if req.Reason != "" {
			isAutoSubmit = true
			autoSubmitReason = req.Reason
		}

		// Deduplicate answers by question ID (preserve last answer) and persist
		uniqueAnswers := make(map[uuid.UUID]dto.SubmitPracticeAnswerRequest)
		for _, ansReq := range req.Answers {
			if ansReq.QuestionID != uuid.Nil {
				uniqueAnswers[ansReq.QuestionID] = ansReq
			}
		}

		for _, ansReq := range uniqueAnswers {
			if _, err := s.SubmitAnswer(ctx, attemptID, userID, ansReq); err != nil {
				return nil, fmt.Errorf("failed to submit answer for question %s: %w", ansReq.QuestionID, err)
			}
		}
	}

	answers, err := s.practiceRepo.FindAllAnswers(ctx, attemptID)
	if err != nil {
		return nil, err
	}

	var qIDs []uuid.UUID
	if attempt.PackageID != nil {
		qIDs, _ = s.practiceRepo.GetPackageQuestionIDs(ctx, *attempt.PackageID)
	}

	totalQuestions := len(qIDs)
	if totalQuestions == 0 {
		totalQuestions = attempt.TotalQuestions
	}
	if totalQuestions == 0 {
		totalQuestions = len(answers)
	}
	correctCount := 0
	for _, a := range answers {
		if a.IsCorrect != nil && *a.IsCorrect {
			correctCount++
		}
	}

	score := 0.0
	if totalQuestions > 0 {
		score = (float64(correctCount) / float64(totalQuestions)) * 100
	}
	accuracy := 0.0
	if len(answers) > 0 {
		accuracy = (float64(correctCount) / float64(len(answers))) * 100
	}

	now := time.Now()
	attempt.Status = models.AttemptStatusCompleted
	attempt.Score = &score
	attempt.TotalQuestions = totalQuestions
	attempt.CorrectAnswers = correctCount
	attempt.IsAutoSubmitted = isAutoSubmit
	attempt.AutoSubmitReason = autoSubmitReason
	attempt.CompletedAt = &now

	if err := s.practiceRepo.UpdateAttempt(ctx, attempt); err != nil {
		return nil, err
	}

	// Create persistent Evaluation record for progress tracking
	var evalIDPtr *uuid.UUID
	if s.evaluationRepo != nil && s.db != nil {
		evalID := uuid.New()
		eval := models.Evaluation{
			ID:               evalID,
			UserID:           userID,
			SourceType:       models.EvaluationSourcePractice,
			SourceID:         attempt.ID,
			TotalQuestions:   totalQuestions,
			CorrectAnswers:   correctCount,
			IncorrectAnswers: len(answers) - correctCount,
			Score:            score,
			Accuracy:         accuracy,
			CreatedAt:        now,
		}

		if err := s.evaluationRepo.Create(ctx, &eval); err == nil {
			evalIDPtr = &evalID

			// Populate Competency Evaluations
			var questions []models.Question
			if len(qIDs) > 0 {
				_ = s.db.WithContext(ctx).Preload("Competencies").Preload("Options").Where("id IN ?", qIDs).Find(&questions).Error
			}

			qMap := make(map[uuid.UUID]*models.Question, len(questions))
			for i := range questions {
				qMap[questions[i].ID] = &questions[i]
			}

			type compStats struct {
				Total   int
				Correct int
			}
			compMap := make(map[uuid.UUID]*compStats)

			for _, a := range answers {
				q, ok := qMap[a.QuestionID]
				if !ok {
					continue
				}
				for _, c := range q.Competencies {
					st, exists := compMap[c.ID]
					if !exists {
						st = &compStats{}
						compMap[c.ID] = st
					}
					st.Total++
					if a.IsCorrect != nil && *a.IsCorrect {
						st.Correct++
					}
				}
			}

			compEvals := make([]models.CompetencyEvaluation, 0, len(compMap))
			for cID, st := range compMap {
				cScore := 0.0
				cAccuracy := 0.0
				if st.Total > 0 {
					cScore = (float64(st.Correct) / float64(st.Total)) * 100
					cAccuracy = cScore
				}
				level := models.PerformanceLevelLow
				if cScore >= 70 {
					level = models.PerformanceLevelHigh
				} else if cScore >= 40 {
					level = models.PerformanceLevelMedium
				}

				compEvals = append(compEvals, models.CompetencyEvaluation{
					EvaluationID:   evalID,
					UserID:         userID,
					CompetencyID:   cID,
					TotalQuestions: st.Total,
					CorrectAnswers: st.Correct,
					Score:          cScore,
					Accuracy:       cAccuracy,
					Level:          level,
				})
			}

			if len(compEvals) > 0 && s.db != nil {
				_ = s.db.WithContext(ctx).Create(&compEvals).Error
			}

			// Auto-generate rekomendasi materi dari feedback engine (best-effort).
			if evidences, compNames := PracticeAnswerEvidences(answers, qMap); len(evidences) > 0 {
				BuildAndSaveFeedback(ctx, s.db, s.recService, userID, evalID, evidences, compNames)
			}
		}
	}

	return &dto.CompletePracticeResponse{
		AttemptID:        attempt.ID,
		Status:           string(models.AttemptStatusCompleted),
		Score:            score,
		TotalQuestions:   totalQuestions,
		CorrectAnswers:   correctCount,
		IncorrectAnswers: len(answers) - correctCount,
		Unanswered:       totalQuestions - len(answers),
		CompletedAt:      now,
		EvaluationID:     evalIDPtr,
		IsAutoSubmitted:  isAutoSubmit,
		AutoSubmitReason: autoSubmitReason,
	}, nil
}

func (s *practiceService) GetPracticeResult(ctx context.Context, attemptID, userID uuid.UUID) (*dto.PracticeResultResponse, error) {
	attempt, err := s.practiceRepo.FindAttemptByIDWithDetails(ctx, attemptID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrPracticeNotFound
		}
		return nil, err
	}

	if attempt.UserID != userID {
		return nil, ErrPracticeNotOwner
	}
	if attempt.Status != models.AttemptStatusCompleted {
		return nil, ErrAttemptNotCompleted
	}

	answers, err := s.practiceRepo.FindAllAnswers(ctx, attemptID)
	if err != nil {
		return nil, err
	}

	ansMap := make(map[uuid.UUID]models.PracticeAnswer, len(answers))
	for _, a := range answers {
		ansMap[a.QuestionID] = a
	}

	var reviews []dto.PracticeAnswerReviewItem
	pkgTitle := ""
	if attempt.Package != nil {
		pkgTitle = attempt.Package.Title
	}

	if attempt.Package != nil && len(attempt.Package.Questions) > 0 {
		reviews = make([]dto.PracticeAnswerReviewItem, len(attempt.Package.Questions))
		for i, q := range attempt.Package.Questions {
			ans, hasAns := ansMap[q.ID]

			isCorrect := false
			score := 0.0
			var selectedOptID *uuid.UUID
			answerData := ""

			if hasAns {
				if ans.IsCorrect != nil {
					isCorrect = *ans.IsCorrect
				}
				if ans.Score != nil {
					score = *ans.Score
				}
				selectedOptID = ans.SelectedOptionID
				answerData = ans.AnswerData
			}

			opts := make([]dto.OptionReviewResponse, len(q.Options))
			for j, opt := range q.Options {
				isSelected := selectedOptID != nil && *selectedOptID == opt.ID
				opts[j] = dto.OptionReviewResponse{
					ID:           opt.ID,
					OptionLabel:  opt.OptionLabel,
					OptionText:   opt.OptionText,
					IsCorrect:    opt.IsCorrect,
					IsSelected:   isSelected,
					DisplayOrder: opt.DisplayOrder,
				}
			}

			comps := make([]dto.CompetencyResponse, len(q.Competencies))
			for k, c := range q.Competencies {
				comps[k] = dto.CompetencyResponse{
					ID:          c.ID.String(),
					Code:        c.Code,
					Name:        c.Name,
					Description: c.Description,
					Status:      string(c.Status),
				}
			}

			explanation := ""
			answeringTips := ""
			if q.Explanation != nil {
				explanation = q.Explanation.Explanation
				answeringTips = q.Explanation.AnsweringTips
			}

			reviews[i] = dto.PracticeAnswerReviewItem{
				QuestionNumber:   i + 1,
				QuestionID:       q.ID,
				QuestionText:     q.QuestionText,
				Competencies:     comps,
				Options:          opts,
				SelectedOptionID: selectedOptID,
				AnswerData:       answerData,
				IsCorrect:        isCorrect,
				Score:            score,
				Explanation:      explanation,
				AnsweringTips:    answeringTips,
			}
		}
	} else if len(answers) > 0 {
		reviews = make([]dto.PracticeAnswerReviewItem, len(answers))
		for i, ans := range answers {
			isCorrect := false
			score := 0.0
			if ans.IsCorrect != nil {
				isCorrect = *ans.IsCorrect
			}
			if ans.Score != nil {
				score = *ans.Score
			}

			qText := ""
			opts := []dto.OptionReviewResponse{}
			comps := []dto.CompetencyResponse{}
			explanation := ""
			answeringTips := ""

			if ans.Question != nil {
				qText = ans.Question.QuestionText
				opts = make([]dto.OptionReviewResponse, len(ans.Question.Options))
				for j, opt := range ans.Question.Options {
					isSelected := ans.SelectedOptionID != nil && *ans.SelectedOptionID == opt.ID
					opts[j] = dto.OptionReviewResponse{
						ID:           opt.ID,
						OptionLabel:  opt.OptionLabel,
						OptionText:   opt.OptionText,
						IsCorrect:    opt.IsCorrect,
						IsSelected:   isSelected,
						DisplayOrder: opt.DisplayOrder,
					}
				}
				if ans.Question.Explanation != nil {
					explanation = ans.Question.Explanation.Explanation
					answeringTips = ans.Question.Explanation.AnsweringTips
				}
			}

			reviews[i] = dto.PracticeAnswerReviewItem{
				QuestionNumber:   i + 1,
				QuestionID:       ans.QuestionID,
				QuestionText:     qText,
				Competencies:     comps,
				Options:          opts,
				SelectedOptionID: ans.SelectedOptionID,
				AnswerData:       ans.AnswerData,
				IsCorrect:        isCorrect,
				Score:            score,
				Explanation:      explanation,
				AnsweringTips:    answeringTips,
			}
		}
	}

	scoreVal := 0.0
	if attempt.Score != nil {
		scoreVal = *attempt.Score
	}

	// Lookup evaluation ID if exists
	var evalIDPtr *uuid.UUID
	if s.evaluationRepo != nil {
		if eval, err := s.evaluationRepo.FindBySource(ctx, models.EvaluationSourcePractice, attempt.ID); err == nil && eval != nil {
			evalIDPtr = &eval.ID
		}
	}

	var pkgID uuid.UUID
	if attempt.PackageID != nil {
		pkgID = *attempt.PackageID
	}

	incorrectCount := len(answers) - attempt.CorrectAnswers
	if incorrectCount < 0 {
		incorrectCount = 0
	}
	unansweredCount := attempt.TotalQuestions - len(answers)
	if unansweredCount < 0 {
		unansweredCount = 0
	}

	return &dto.PracticeResultResponse{
		AttemptID:        attempt.ID,
		PackageID:        pkgID,
		PackageTitle:     pkgTitle,
		Status:           string(attempt.Status),
		Score:            scoreVal,
		TotalQuestions:   attempt.TotalQuestions,
		CorrectAnswers:   attempt.CorrectAnswers,
		IncorrectAnswers: incorrectCount,
		Unanswered:       unansweredCount,
		StartedAt:        attempt.StartedAt,
		CompletedAt:      attempt.CompletedAt,
		EvaluationID:     evalIDPtr,
		IsAutoSubmitted:  attempt.IsAutoSubmitted,
		AutoSubmitReason: attempt.AutoSubmitReason,
		Reviews:          reviews,
	}, nil
}

func (s *practiceService) ListMyPractices(ctx context.Context, userID uuid.UUID, filter dto.MyPracticesFilter) (*dto.PaginatedPracticesResponse, error) {
	attempts, total, err := s.practiceRepo.ListAttemptsByUserID(ctx, userID, filter)
	if err != nil {
		return nil, err
	}

	items := make([]dto.PracticeAttemptSummaryResponse, len(attempts))
	for i, a := range attempts {
		pkgTitle := ""
		if a.Package != nil {
			pkgTitle = a.Package.Title
		}
		items[i] = dto.PracticeAttemptSummaryResponse{
			AttemptID:      a.ID,
			PackageID:      *a.PackageID,
			PackageTitle:   pkgTitle,
			Status:         string(a.Status),
			Score:          a.Score,
			TotalQuestions: a.TotalQuestions,
			CorrectAnswers: a.CorrectAnswers,
			StartedAt:      a.StartedAt,
			CompletedAt:    a.CompletedAt,
		}
	}

	return &dto.PaginatedPracticesResponse{
		Practices: items,
		Total:     total,
		Limit:     filter.Limit,
		Offset:    filter.Offset,
	}, nil
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

func (s *practiceService) mapToPackageResponse(p *models.PracticePackage) *dto.PracticePackageResponse {
	var compName, compCode string
	if p.Competency != nil {
		compName = p.Competency.Name
		compCode = p.Competency.Code
	}

	return &dto.PracticePackageResponse{
		ID:             p.ID,
		Title:          p.Title,
		Description:    p.Description,
		CompetencyID:   p.CompetencyID,
		CompetencyName: compName,
		CompetencyCode: compCode,
		Jenjang:        string(p.Jenjang),
		TotalQuestions: p.TotalQuestions,
		Status:         string(p.Status),
		CreatedBy:      p.CreatedBy,
		CreatedAt:      p.CreatedAt,
		UpdatedAt:      p.UpdatedAt,
	}
}

func (s *practiceService) mapToPackageDetailResponse(p *models.PracticePackage) *dto.PracticePackageDetailResponse {
	summary := s.mapToPackageResponse(p)

	questions := make([]dto.QuestionStudentResponse, len(p.Questions))
	for i, q := range p.Questions {
		questions[i] = s.mapQuestionStudentResponse(&q)
	}

	return &dto.PracticePackageDetailResponse{
		PracticePackageResponse: *summary,
		Questions:               questions,
	}
}

func (s *practiceService) mapQuestionStudentResponse(q *models.Question) dto.QuestionStudentResponse {
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
		comps[i] = dto.CompetencyResponse{
			ID:          c.ID.String(),
			Code:        c.Code,
			Name:        c.Name,
			Description: c.Description,
			Status:      string(c.Status),
		}
	}

	return dto.QuestionStudentResponse{
		ID:              q.ID.String(),
		QuestionTypeID:  q.QuestionTypeID.String(),
		QuestionText:    q.QuestionText,
		DifficultyLevel: q.DifficultyLevel,
		Options:         opts,
		Competencies:    comps,
	}
}
