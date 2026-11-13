package service

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
	"simantikApi/internal/repository"
)

// LearningService defines business logic for modules, materials, and learning progression.
type LearningService interface {
	// Modules
	CreateModule(ctx context.Context, req dto.CreateLearningModuleRequest, createdByID uuid.UUID) (*dto.LearningModuleResponse, error)
	GetModule(ctx context.Context, id, userID uuid.UUID, isAdmin bool) (*dto.LearningModuleDetailResponse, error)
	UpdateModule(ctx context.Context, id uuid.UUID, req dto.UpdateLearningModuleRequest, updatedByID uuid.UUID) (*dto.LearningModuleResponse, error)
	UpdateModuleStatus(ctx context.Context, id uuid.UUID, status string, updatedByID uuid.UUID) (*dto.LearningModuleResponse, error)
	DeleteModule(ctx context.Context, id uuid.UUID) error
	ListModules(ctx context.Context, filter dto.ListModuleFilter, userID uuid.UUID, isAdmin bool) (*dto.PaginatedModulesResponse, error)
	ListModuleLabels(ctx context.Context) ([]string, error)

	// Materials
	CreateMaterial(ctx context.Context, req dto.CreateMaterialRequest, createdByID uuid.UUID) (*dto.MaterialResponse, error)
	GetMaterial(ctx context.Context, id, userID uuid.UUID, isAdmin bool) (*dto.MaterialResponse, error)
	UpdateMaterial(ctx context.Context, id uuid.UUID, req dto.UpdateMaterialRequest, updatedByID uuid.UUID) (*dto.MaterialResponse, error)
	UpdateMaterialStatus(ctx context.Context, id uuid.UUID, status string, updatedByID uuid.UUID) (*dto.MaterialResponse, error)
	DeleteMaterial(ctx context.Context, id uuid.UUID) error
	ListMaterials(ctx context.Context, filter dto.ListMaterialFilter, userID uuid.UUID, isAdmin bool) (*dto.PaginatedMaterialsResponse, error)
	GetMaterialStudentActivities(ctx context.Context, materialID uuid.UUID, filter dto.ListMaterialActivityFilter) (*dto.MaterialStudentActivitiesResponse, error)

	// Progress
	MarkMaterialCompleted(ctx context.Context, materialID, userID uuid.UUID, isCompleted bool) (*dto.LearningProgressResponse, error)
	GetModuleProgress(ctx context.Context, moduleID, userID uuid.UUID) (*dto.ModuleProgressSummaryResponse, error)
	ListMyProgress(ctx context.Context, userID uuid.UUID) ([]dto.LearningProgressResponse, error)
}

type learningService struct {
	moduleRepo   repository.LearningModuleRepository
	materialRepo repository.MaterialRepository
	progressRepo repository.LearningProgressRepository
	resolver     *JenjangResolver
}

func NewLearningService(
	moduleRepo repository.LearningModuleRepository,
	materialRepo repository.MaterialRepository,
	progressRepo repository.LearningProgressRepository,
	resolver ...*JenjangResolver,
) LearningService {
	var r *JenjangResolver
	if len(resolver) > 0 {
		r = resolver[0]
	}
	return &learningService{
		moduleRepo:   moduleRepo,
		materialRepo: materialRepo,
		progressRepo: progressRepo,
		resolver:     r,
	}
}

// ─── Module Operations ───────────────────────────────────────────────────────

func (s *learningService) CreateModule(ctx context.Context, req dto.CreateLearningModuleRequest, createdByID uuid.UUID) (*dto.LearningModuleResponse, error) {
	mod := models.LearningModule{
		ID:           uuid.New(),
		Title:        req.Title,
		Description:  req.Description,
		Label:        req.Label,
		Jenjang:      models.SchoolLevel(req.Jenjang),
		DisplayOrder: req.DisplayOrder,
		Status:       models.ContentStatusDraft,
		CreatedBy:    createdByID,
		UpdatedBy:    &createdByID,
	}

	if err := s.moduleRepo.Create(ctx, &mod); err != nil {
		return nil, err
	}

	return s.mapToModuleResponse(&mod, 0, 0), nil
}

func (s *learningService) GetModule(ctx context.Context, id, userID uuid.UUID, isAdmin bool) (*dto.LearningModuleDetailResponse, error) {
	mod, err := s.moduleRepo.FindByIDWithMaterials(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrModuleNotFound
		}
		return nil, err
	}

	if !isAdmin && mod.Status != models.ContentStatusPublished {
		return nil, ErrModuleNotFound
	}

	// Pisahkan konten berdasarkan jenjang: siswa hanya boleh akses modul jenjangnya.
	if !isAdmin && s.resolver != nil {
		if jenjang, err := s.resolver.Resolve(ctx, userID); err == nil && jenjang != "" && mod.Jenjang != models.SchoolLevel(jenjang) {
			return nil, ErrModuleNotFound
		}
	}

	// Fetch user progress for materials in this module
	userProgresses, _ := s.progressRepo.ListUserProgress(ctx, userID)
	completedMap := make(map[uuid.UUID]bool, len(userProgresses))
	for _, p := range userProgresses {
		if p.IsCompleted {
			completedMap[p.MaterialID] = true
		}
	}

	var materialSummaries []dto.MaterialSummaryResponse
	completedCount := 0

	for _, m := range mod.Materials {
		if !isAdmin && m.Status != models.ContentStatusPublished {
			continue
		}
		isDone := completedMap[m.ID]
		if isDone {
			completedCount++
		}
		materialSummaries = append(materialSummaries, dto.MaterialSummaryResponse{
			ID:           m.ID,
			Title:        m.Title,
			Type:         string(m.Type),
			DisplayOrder: m.DisplayOrder,
			CompetencyID: m.CompetencyID,
			Status:       string(m.Status),
			IsCompleted:  isDone,
		})
	}

	totalMat := len(materialSummaries)
	progressPct := 0.0
	if totalMat > 0 {
		progressPct = (float64(completedCount) / float64(totalMat)) * 100
	}

	baseResp := s.mapToModuleResponse(mod, totalMat, completedCount)
	baseResp.ProgressPercentage = progressPct

	return &dto.LearningModuleDetailResponse{
		LearningModuleResponse: *baseResp,
		Materials:              materialSummaries,
	}, nil
}

func (s *learningService) UpdateModule(ctx context.Context, id uuid.UUID, req dto.UpdateLearningModuleRequest, updatedByID uuid.UUID) (*dto.LearningModuleResponse, error) {
	mod, err := s.moduleRepo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrModuleNotFound
		}
		return nil, err
	}

	if req.Title != "" {
		mod.Title = req.Title
	}
	if req.Description != "" {
		mod.Description = req.Description
	}
	if req.Label != "" {
		mod.Label = req.Label
	}
	if req.Jenjang != "" {
		mod.Jenjang = models.SchoolLevel(req.Jenjang)
	}
	if req.DisplayOrder > 0 {
		mod.DisplayOrder = req.DisplayOrder
	}
	if req.Status != "" {
		mod.Status = models.ContentStatus(req.Status)
	}
	mod.UpdatedBy = &updatedByID

	if err := s.moduleRepo.Update(ctx, mod); err != nil {
		return nil, err
	}

	// Cascading status: sinkronisasi status semua materi dalam modul
	if req.Status != "" {
		_ = s.materialRepo.UpdateStatusByModuleID(ctx, id, mod.Status, updatedByID)
	}

	totalMat, _ := s.progressRepo.CountMaterialsByModule(ctx, id)
	return s.mapToModuleResponse(mod, int(totalMat), 0), nil
}

func (s *learningService) UpdateModuleStatus(ctx context.Context, id uuid.UUID, status string, updatedByID uuid.UUID) (*dto.LearningModuleResponse, error) {
	mod, err := s.moduleRepo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrModuleNotFound
		}
		return nil, err
	}

	mod.Status = models.ContentStatus(status)
	mod.UpdatedBy = &updatedByID

	if err := s.moduleRepo.Update(ctx, mod); err != nil {
		return nil, err
	}

	// Cascading status: sinkronisasi status semua materi dalam modul (published, draft, archived)
	_ = s.materialRepo.UpdateStatusByModuleID(ctx, id, mod.Status, updatedByID)

	totalMat, _ := s.progressRepo.CountMaterialsByModule(ctx, id)
	return s.mapToModuleResponse(mod, int(totalMat), 0), nil
}

func (s *learningService) DeleteModule(ctx context.Context, id uuid.UUID) error {
	_, err := s.moduleRepo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrModuleNotFound
		}
		return err
	}

	return s.moduleRepo.Delete(ctx, id)
}

func (s *learningService) ListModules(ctx context.Context, filter dto.ListModuleFilter, userID uuid.UUID, isAdmin bool) (*dto.PaginatedModulesResponse, error) {
	var modules []models.LearningModule
	var total int64
	var err error

	if !isAdmin && filter.Jenjang == "" && s.resolver != nil {
		if jenjang, rerr := s.resolver.Resolve(ctx, userID); rerr == nil && jenjang != "" {
			filter.Jenjang = jenjang
		}
	}

	if isAdmin {
		modules, total, err = s.moduleRepo.List(ctx, filter)
	} else {
		modules, total, err = s.moduleRepo.ListPublished(ctx, filter)
	}
	if err != nil {
		return nil, err
	}

	items := make([]dto.LearningModuleResponse, len(modules))
	for i := range modules {
		modID := modules[i].ID
		totalMat, _ := s.progressRepo.CountMaterialsByModule(ctx, modID)
		completedMat, _ := s.progressRepo.CountCompletedByModule(ctx, userID, modID)

		resp := s.mapToModuleResponse(&modules[i], int(totalMat), int(completedMat))
		items[i] = *resp
	}

	return &dto.PaginatedModulesResponse{
		Modules: items,
		Total:   total,
		Limit:   filter.Limit,
		Offset:  filter.Offset,
	}, nil
}

func (s *learningService) ListModuleLabels(ctx context.Context) ([]string, error) {
	return s.moduleRepo.GetDistinctLabels(ctx)
}

// ─── Material Operations ─────────────────────────────────────────────────────

func (s *learningService) CreateMaterial(ctx context.Context, req dto.CreateMaterialRequest, createdByID uuid.UUID) (*dto.MaterialResponse, error) {
	_, err := s.moduleRepo.FindByID(ctx, req.ModuleID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrModuleNotFound
		}
		return nil, err
	}

	mat := models.Material{
		ID:                 uuid.New(),
		ModuleID:           req.ModuleID,
		CompetencyID:       req.CompetencyID,
		Title:              req.Title,
		Description:        req.Description,
		Content:            req.Content,
		LearningObjectives: req.LearningObjectives,
		StructureItems:     req.StructureItems,
		Type:               models.MaterialType(req.Type),
		DisplayOrder:       req.DisplayOrder,
		Status:             models.ContentStatusDraft,
		CreatedBy:          createdByID,
		UpdatedBy:          &createdByID,
	}

	if err := s.materialRepo.Create(ctx, &mat); err != nil {
		return nil, err
	}

	return s.mapToMaterialResponse(&mat, false), nil
}

func (s *learningService) GetMaterial(ctx context.Context, id, userID uuid.UUID, isAdmin bool) (*dto.MaterialResponse, error) {
	mat, err := s.materialRepo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrMaterialNotFound
		}
		return nil, err
	}

	if !isAdmin && mat.Status != models.ContentStatusPublished {
		return nil, ErrMaterialNotFound
	}

	// Akses materi mengikuti jenjang modul induknya
	if !isAdmin && s.resolver != nil {
		if mod, err := s.moduleRepo.FindByID(ctx, mat.ModuleID); err == nil && mod != nil {
			if jenjang, rerr := s.resolver.Resolve(ctx, userID); rerr == nil && jenjang != "" && mod.Jenjang != models.SchoolLevel(jenjang) {
				return nil, ErrMaterialNotFound
			}
		}
	}

	isDone := false
	prog, _ := s.progressRepo.FindByUserAndMaterial(ctx, userID, id)
	if prog != nil && prog.IsCompleted {
		isDone = true
	}

	return s.mapToMaterialResponse(mat, isDone), nil
}

func (s *learningService) UpdateMaterial(ctx context.Context, id uuid.UUID, req dto.UpdateMaterialRequest, updatedByID uuid.UUID) (*dto.MaterialResponse, error) {
	mat, err := s.materialRepo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrMaterialNotFound
		}
		return nil, err
	}

	if req.ClearCompetency {
		mat.CompetencyID = nil
		mat.Competency = nil
	} else if req.CompetencyID != nil {
		if mat.CompetencyID == nil || *mat.CompetencyID != *req.CompetencyID {
			mat.Competency = nil
		}
		mat.CompetencyID = req.CompetencyID
	}
	if req.Title != "" {
		mat.Title = req.Title
	}
	if req.Description != "" {
		mat.Description = req.Description
	}
	if req.Content != "" {
		mat.Content = req.Content
	}
	if req.LearningObjectives != nil {
		mat.LearningObjectives = *req.LearningObjectives
	}
	if req.StructureItems != nil {
		mat.StructureItems = *req.StructureItems
	}
	if req.Type != "" {
		mat.Type = models.MaterialType(req.Type)
	}
	if req.DisplayOrder > 0 {
		mat.DisplayOrder = req.DisplayOrder
	}
	if req.Status != "" {
		mat.Status = models.ContentStatus(req.Status)
	}
	mat.UpdatedBy = &updatedByID

	if err := s.materialRepo.Update(ctx, mat); err != nil {
		return nil, err
	}

	if !req.ClearCompetency && req.CompetencyID != nil {
		if refreshed, rErr := s.materialRepo.FindByID(ctx, id); rErr == nil && refreshed != nil {
			mat = refreshed
		}
	}

	return s.mapToMaterialResponse(mat, false), nil
}

func (s *learningService) UpdateMaterialStatus(ctx context.Context, id uuid.UUID, status string, updatedByID uuid.UUID) (*dto.MaterialResponse, error) {
	mat, err := s.materialRepo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrMaterialNotFound
		}
		return nil, err
	}

	mat.Status = models.ContentStatus(status)
	mat.UpdatedBy = &updatedByID

	if err := s.materialRepo.Update(ctx, mat); err != nil {
		return nil, err
	}

	return s.mapToMaterialResponse(mat, false), nil
}

func (s *learningService) DeleteMaterial(ctx context.Context, id uuid.UUID) error {
	_, err := s.materialRepo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrMaterialNotFound
		}
		return err
	}

	return s.materialRepo.Delete(ctx, id)
}

func (s *learningService) ListMaterials(ctx context.Context, filter dto.ListMaterialFilter, userID uuid.UUID, isAdmin bool) (*dto.PaginatedMaterialsResponse, error) {
	var materials []models.Material
	var total int64
	var err error

	if isAdmin {
		materials, total, err = s.materialRepo.List(ctx, filter)
	} else {
		materials, total, err = s.materialRepo.ListPublished(ctx, filter)
	}
	if err != nil {
		return nil, err
	}

	userProgresses, _ := s.progressRepo.ListUserProgress(ctx, userID)
	completedMap := make(map[uuid.UUID]bool, len(userProgresses))
	for _, p := range userProgresses {
		if p.IsCompleted {
			completedMap[p.MaterialID] = true
		}
	}

	items := make([]dto.MaterialResponse, len(materials))
	for i := range materials {
		items[i] = *s.mapToMaterialResponse(&materials[i], completedMap[materials[i].ID])
	}

	return &dto.PaginatedMaterialsResponse{
		Materials: items,
		Total:     total,
		Limit:     filter.Limit,
		Offset:    filter.Offset,
	}, nil
}

func (s *learningService) GetMaterialStudentActivities(ctx context.Context, materialID uuid.UUID, filter dto.ListMaterialActivityFilter) (*dto.MaterialStudentActivitiesResponse, error) {
	_, err := s.materialRepo.FindByID(ctx, materialID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrMaterialNotFound
		}
		return nil, err
	}

	return s.materialRepo.GetMaterialStudentActivities(ctx, materialID, filter)
}

// ─── Progress Tracking ───────────────────────────────────────────────────────

func (s *learningService) MarkMaterialCompleted(ctx context.Context, materialID, userID uuid.UUID, isCompleted bool) (*dto.LearningProgressResponse, error) {
	_, err := s.materialRepo.FindByID(ctx, materialID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrMaterialNotFound
		}
		return nil, err
	}

	var completedAt *time.Time
	if isCompleted {
		now := time.Now()
		completedAt = &now
	}

	progress := models.LearningProgress{
		UserID:      userID,
		MaterialID:  materialID,
		IsCompleted: isCompleted,
		CompletedAt: completedAt,
	}

	if err := s.progressRepo.UpsertProgress(ctx, &progress); err != nil {
		return nil, err
	}

	return &dto.LearningProgressResponse{
		MaterialID:  materialID,
		IsCompleted: isCompleted,
		CompletedAt: completedAt,
	}, nil
}

func (s *learningService) GetModuleProgress(ctx context.Context, moduleID, userID uuid.UUID) (*dto.ModuleProgressSummaryResponse, error) {
	mod, err := s.moduleRepo.FindByID(ctx, moduleID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrModuleNotFound
		}
		return nil, err
	}

	totalMat, _ := s.progressRepo.CountMaterialsByModule(ctx, moduleID)
	completedMat, _ := s.progressRepo.CountCompletedByModule(ctx, userID, moduleID)

	pct := 0.0
	if totalMat > 0 {
		pct = (float64(completedMat) / float64(totalMat)) * 100
	}

	return &dto.ModuleProgressSummaryResponse{
		ModuleID:           mod.ID,
		ModuleTitle:        mod.Title,
		TotalMaterials:     int(totalMat),
		CompletedMaterials: int(completedMat),
		ProgressPercentage: pct,
	}, nil
}

func (s *learningService) ListMyProgress(ctx context.Context, userID uuid.UUID) ([]dto.LearningProgressResponse, error) {
	items, err := s.progressRepo.ListUserProgress(ctx, userID)
	if err != nil {
		return nil, err
	}

	res := make([]dto.LearningProgressResponse, len(items))
	for i, p := range items {
		res[i] = dto.LearningProgressResponse{
			MaterialID:  p.MaterialID,
			IsCompleted: p.IsCompleted,
			CompletedAt: p.CompletedAt,
		}
	}
	return res, nil
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

func (s *learningService) mapToModuleResponse(m *models.LearningModule, totalCount, completedCount int) *dto.LearningModuleResponse {
	pct := 0.0
	if totalCount > 0 {
		pct = (float64(completedCount) / float64(totalCount)) * 100
	}

	return &dto.LearningModuleResponse{
		ID:                 m.ID,
		Title:              m.Title,
		Description:        m.Description,
		Label:              m.Label,
		Jenjang:            string(m.Jenjang),
		DisplayOrder:       m.DisplayOrder,
		Status:             string(m.Status),
		MaterialsCount:     totalCount,
		CompletedCount:     completedCount,
		ProgressPercentage: pct,
		CreatedAt:          m.CreatedAt,
		UpdatedAt:          m.UpdatedAt,
	}
}

func (s *learningService) mapToMaterialResponse(m *models.Material, isCompleted bool) *dto.MaterialResponse {
	compName := ""
	if m.Competency != nil {
		compName = m.Competency.Name
	}

	return &dto.MaterialResponse{
		ID:                 m.ID,
		ModuleID:           m.ModuleID,
		CompetencyID:       m.CompetencyID,
		CompetencyName:     compName,
		Title:              m.Title,
		Description:        m.Description,
		Content:            m.Content,
		LearningObjectives: m.LearningObjectives,
		StructureItems:     m.StructureItems,
		Type:               string(m.Type),
		DisplayOrder:       m.DisplayOrder,
		Status:             string(m.Status),
		IsCompleted:        isCompleted,
		CreatedAt:          m.CreatedAt,
		UpdatedAt:          m.UpdatedAt,
	}
}
