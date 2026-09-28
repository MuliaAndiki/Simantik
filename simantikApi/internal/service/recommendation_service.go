package service

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
	"simantikApi/internal/repository"
)

// RecommendationService generates and manages personalized pedagogical recommendations.
type RecommendationService interface {
	GenerateRecommendationsForEvaluation(ctx context.Context, evalID, userID uuid.UUID) ([]dto.RecommendationResponse, error)
	GenerateRecommendationsFromProfile(ctx context.Context, userID uuid.UUID) ([]dto.RecommendationResponse, error)
	GetStudentRecommendations(ctx context.Context, userID uuid.UUID, filter dto.ListRecommendationFilter) (*dto.PaginatedRecommendationsResponse, error)
	DismissRecommendation(ctx context.Context, id, userID uuid.UUID) error
	// FeedbackMaterials mengambil materi published per kompetensi (untuk engine).
	FeedbackMaterials(ctx context.Context, compIDs []uuid.UUID, limitPer int) (map[uuid.UUID][]MaterialSuggestion, error)
	// SaveFeedbackRecommendations menyimpan materi A..N hasil engine (idempoten per evaluasi).
	SaveFeedbackRecommendations(ctx context.Context, userID, evalID uuid.UUID, fb AttemptFeedback) error
}

type recommendationService struct {
	recRepo      repository.RecommendationRepository
	evalRepo     repository.EvaluationRepository
	materialRepo repository.MaterialRepository
}

// NewRecommendationService creates a new instance of RecommendationService.
func NewRecommendationService(
	recRepo repository.RecommendationRepository,
	evalRepo repository.EvaluationRepository,
	materialRepo repository.MaterialRepository,
) RecommendationService {
	return &recommendationService{
		recRepo:      recRepo,
		evalRepo:     evalRepo,
		materialRepo: materialRepo,
	}
}

func (s *recommendationService) GenerateRecommendationsForEvaluation(ctx context.Context, evalID, userID uuid.UUID) ([]dto.RecommendationResponse, error) {
	eval, err := s.evalRepo.FindByID(ctx, evalID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrEvaluationNotFound
		}
		return nil, err
	}

	if eval.UserID != userID {
		return nil, ErrAttemptNotOwner
	}

	// Remove old recommendations for this evaluation to ensure idempotency
	_ = s.recRepo.DeleteByEvaluationID(ctx, evalID)

	var newRecs []models.Recommendation

	for _, ce := range eval.CompetencyEvaluations {
		// Identify weak or developing areas
		var priority models.RecommendationPriority
		switch ce.Level {
		case models.PerformanceLevelLow:
			priority = models.RecommendationPriorityHigh
		case models.PerformanceLevelMedium:
			priority = models.RecommendationPriorityMedium
		default:
			// High performance indicates mastery, no remediation needed
			continue
		}

		compName := "Kompetensi"
		compCode := ""
		if ce.Competency != nil {
			compName = ce.Competency.Name
			compCode = ce.Competency.Code
		}

		// Find relevant published learning materials for this competency
		materials, _ := s.materialRepo.FindByCompetencyID(ctx, ce.CompetencyID)

		if len(materials) > 0 {
			// Limit to up to 2 targeted materials per weak competency to avoid overwhelm
			limit := 2
			if len(materials) < limit {
				limit = len(materials)
			}

			for i := 0; i < limit; i++ {
				mat := materials[i]
				matID := mat.ID
				recText := fmt.Sprintf("Pelajari materi '%s' untuk memperkuat penguasaan kompetensi %s", mat.Title, compName)

				newRecs = append(newRecs, models.Recommendation{
					ID:                 uuid.New(),
					UserID:             userID,
					CompetencyID:       ce.CompetencyID,
					EvaluationID:       &evalID,
					MaterialID:         &matID,
					RecommendationText: recText,
					Priority:           priority,
				})
			}
		} else {
			// Fallback: general competency reinforcement action
			recText := fmt.Sprintf("Perkuat pemahaman pada kompetensi %s (%s) melalui latihan soal tambahan", compName, compCode)
			newRecs = append(newRecs, models.Recommendation{
				ID:                 uuid.New(),
				UserID:             userID,
				CompetencyID:       ce.CompetencyID,
				EvaluationID:       &evalID,
				MaterialID:         nil,
				RecommendationText: recText,
				Priority:           priority,
			})
		}
	}

	if len(newRecs) > 0 {
		if err := s.recRepo.BulkCreate(ctx, newRecs); err != nil {
			return nil, err
		}
	}

	return s.mapToRecommendationResponses(newRecs), nil
}

func (s *recommendationService) GenerateRecommendationsFromProfile(ctx context.Context, userID uuid.UUID) ([]dto.RecommendationResponse, error) {
	evals, err := s.evalRepo.GetCompetencyEvaluationsByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}

	// Aggregate competency scores
	type compStat struct {
		id       uuid.UUID
		comp     *models.Competency
		scoreSum float64
		count    int
	}

	stats := make(map[uuid.UUID]*compStat)
	for i := range evals {
		ce := evals[i]
		st, ok := stats[ce.CompetencyID]
		if !ok {
			st = &compStat{id: ce.CompetencyID, comp: ce.Competency}
			stats[ce.CompetencyID] = st
		}
		st.scoreSum += ce.Score
		st.count++
	}

	var newRecs []models.Recommendation

	for _, st := range stats {
		if st.count == 0 {
			continue
		}
		avgScore := st.scoreSum / float64(st.count)

		var priority models.RecommendationPriority
		if avgScore < 40.0 {
			priority = models.RecommendationPriorityHigh
		} else if avgScore < 70.0 {
			priority = models.RecommendationPriorityMedium
		} else {
			continue
		}

		compName := "Kompetensi"
		if st.comp != nil {
			compName = st.comp.Name
		}

		materials, _ := s.materialRepo.FindByCompetencyID(ctx, st.id)
		if len(materials) > 0 {
			mat := materials[0]
			matID := mat.ID
			recText := fmt.Sprintf("Direkomendasikan mempelajari '%s' untuk meningkatkan nilai kompetensi %s", mat.Title, compName)
			newRecs = append(newRecs, models.Recommendation{
				ID:                 uuid.New(),
				UserID:             userID,
				CompetencyID:       st.id,
				MaterialID:         &matID,
				RecommendationText: recText,
				Priority:           priority,
			})
		} else {
			recText := fmt.Sprintf("Fokuskan pembelajaran pada kompetensi %s untuk meningkatkan rata-rata skor", compName)
			newRecs = append(newRecs, models.Recommendation{
				ID:                 uuid.New(),
				UserID:             userID,
				CompetencyID:       st.id,
				MaterialID:         nil,
				RecommendationText: recText,
				Priority:           priority,
			})
		}
	}

	if len(newRecs) > 0 {
		if err := s.recRepo.BulkCreate(ctx, newRecs); err != nil {
			return nil, err
		}
	}

	return s.mapToRecommendationResponses(newRecs), nil
}

// FeedbackMaterials mengambil materi published per kompetensi untuk engine feedback.
func (s *recommendationService) FeedbackMaterials(ctx context.Context, compIDs []uuid.UUID, limitPer int) (map[uuid.UUID][]MaterialSuggestion, error) {
	out := make(map[uuid.UUID][]MaterialSuggestion, len(compIDs))
	if s.materialRepo == nil {
		return out, nil
	}
	if limitPer <= 0 {
		limitPer = 2
	}
	for _, cid := range compIDs {
		materials, err := s.materialRepo.FindByCompetencyID(ctx, cid)
		if err != nil || len(materials) == 0 {
			continue
		}
		limit := limitPer
		if len(materials) < limit {
			limit = len(materials)
		}
		sugs := make([]MaterialSuggestion, 0, limit)
		for i := 0; i < limit; i++ {
			sugs = append(sugs, MaterialSuggestion{
				MaterialID: materials[i].ID,
				Title:      materials[i].Title,
			})
		}
		out[cid] = sugs
	}
	return out, nil
}

// SaveFeedbackRecommendations menyimpan materi A..N hasil engine sebagai
// rekomendasi (idempoten per evaluasi via DeleteByEvaluationID).
func (s *recommendationService) SaveFeedbackRecommendations(ctx context.Context, userID, evalID uuid.UUID, fb AttemptFeedback) error {
	if s.recRepo == nil || len(fb.Materials) == 0 {
		return nil
	}
	_ = s.recRepo.DeleteByEvaluationID(ctx, evalID)

	priorityByGap := make(map[uuid.UUID]models.RecommendationPriority, len(fb.Gaps))
	for _, gap := range fb.Gaps {
		priority := models.RecommendationPriorityMedium
		if gap.Level == "low" {
			priority = models.RecommendationPriorityHigh
		}
		priorityByGap[gap.CompetencyID] = priority
	}

	recs := make([]models.Recommendation, 0, len(fb.Materials))
	for _, m := range fb.Materials {
		priority := priorityByGap[m.CompetencyID]
		if priority == "" {
			priority = models.RecommendationPriorityMedium
		}
		text := fmt.Sprintf("Pelajari materi '%s' untuk memperkuat penguasaan kompetensimu", m.Title)
		if m.Reason != "" {
			text = fmt.Sprintf("%s (%s)", text, m.Reason)
		}
		recs = append(recs, models.Recommendation{
			ID:                 uuid.New(),
			UserID:             userID,
			CompetencyID:       m.CompetencyID,
			EvaluationID:       &evalID,
			MaterialID:         &m.MaterialID,
			RecommendationText: text,
			Priority:           priority,
		})
	}
	return s.recRepo.BulkCreate(ctx, recs)
}

func (s *recommendationService) GetStudentRecommendations(ctx context.Context, userID uuid.UUID, filter dto.ListRecommendationFilter) (*dto.PaginatedRecommendationsResponse, error) {
	recs, total, err := s.recRepo.ListByUserID(ctx, userID, filter)
	if err != nil {
		return nil, err
	}

	items := s.mapToRecommendationResponses(recs)

	return &dto.PaginatedRecommendationsResponse{
		Recommendations: items,
		Total:           total,
		Limit:           filter.Limit,
		Offset:          filter.Offset,
	}, nil
}

func (s *recommendationService) DismissRecommendation(ctx context.Context, id, userID uuid.UUID) error {
	rec, err := s.recRepo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrRecommendationNotFound
		}
		return err
	}

	if rec.UserID != userID {
		return ErrAttemptNotOwner
	}

	return s.recRepo.DeleteByID(ctx, id)
}

func (s *recommendationService) mapToRecommendationResponses(recs []models.Recommendation) []dto.RecommendationResponse {
	res := make([]dto.RecommendationResponse, len(recs))
	for i, r := range recs {
		compName := ""
		compCode := ""
		if r.Competency != nil {
			compName = r.Competency.Name
			compCode = r.Competency.Code
		}

		matTitle := ""
		if r.Material != nil {
			matTitle = r.Material.Title
		}

		res[i] = dto.RecommendationResponse{
			ID:                 r.ID,
			CompetencyID:       r.CompetencyID,
			CompetencyName:     compName,
			CompetencyCode:     compCode,
			EvaluationID:       r.EvaluationID,
			MaterialID:         r.MaterialID,
			MaterialTitle:      matTitle,
			RecommendationText: r.RecommendationText,
			Priority:           string(r.Priority),
			CreatedAt:          r.CreatedAt,
		}
	}
	return res
}
