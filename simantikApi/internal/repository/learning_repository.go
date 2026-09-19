package repository

import (
	"context"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
)

// ─── Module Repository ───────────────────────────────────────────────────────

type LearningModuleRepository interface {
	Create(ctx context.Context, module *models.LearningModule) error
	FindByID(ctx context.Context, id uuid.UUID) (*models.LearningModule, error)
	FindByIDWithMaterials(ctx context.Context, id uuid.UUID) (*models.LearningModule, error)
	Update(ctx context.Context, module *models.LearningModule) error
	Delete(ctx context.Context, id uuid.UUID) error
	List(ctx context.Context, filter dto.ListModuleFilter) ([]models.LearningModule, int64, error)
	ListPublished(ctx context.Context, filter dto.ListModuleFilter) ([]models.LearningModule, int64, error)
	GetDistinctLabels(ctx context.Context) ([]string, error)
}

type learningModuleRepository struct {
	db *gorm.DB
}

func NewLearningModuleRepository(db *gorm.DB) LearningModuleRepository {
	return &learningModuleRepository{db: db}
}

func (r *learningModuleRepository) Create(ctx context.Context, module *models.LearningModule) error {
	return r.db.WithContext(ctx).Create(module).Error
}

func (r *learningModuleRepository) FindByID(ctx context.Context, id uuid.UUID) (*models.LearningModule, error) {
	var module models.LearningModule
	err := r.db.WithContext(ctx).First(&module, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &module, nil
}

func (r *learningModuleRepository) FindByIDWithMaterials(ctx context.Context, id uuid.UUID) (*models.LearningModule, error) {
	var module models.LearningModule
	err := r.db.WithContext(ctx).
		Preload("Materials", func(db *gorm.DB) *gorm.DB {
			return db.Order("display_order ASC, created_at ASC")
		}).
		First(&module, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &module, nil
}

func (r *learningModuleRepository) Update(ctx context.Context, module *models.LearningModule) error {
	return r.db.WithContext(ctx).Save(module).Error
}

func (r *learningModuleRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&models.LearningModule{}, "id = ?", id).Error
}

func (r *learningModuleRepository) List(ctx context.Context, filter dto.ListModuleFilter) ([]models.LearningModule, int64, error) {
	var modules []models.LearningModule
	var total int64

	query := r.db.WithContext(ctx).Model(&models.LearningModule{})

	if filter.Search != "" {
		query = query.Where("title ILIKE ? OR description ILIKE ?", "%"+filter.Search+"%", "%"+filter.Search+"%")
	}
	if filter.Label != "" {
		query = query.Where("label = ?", filter.Label)
	}
	if filter.Status != "" {
		query = query.Where("status = ?", filter.Status)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if filter.Limit > 0 {
		query = query.Limit(filter.Limit)
	}
	if filter.Offset > 0 {
		query = query.Offset(filter.Offset)
	}

	err := query.
		Order("display_order ASC, created_at DESC").
		Find(&modules).Error

	return modules, total, err
}

func (r *learningModuleRepository) ListPublished(ctx context.Context, filter dto.ListModuleFilter) ([]models.LearningModule, int64, error) {
	filter.Status = string(models.ContentStatusPublished)
	return r.List(ctx, filter)
}

func (r *learningModuleRepository) GetDistinctLabels(ctx context.Context) ([]string, error) {
	var labels []string
	err := r.db.WithContext(ctx).
		Model(&models.LearningModule{}).
		Where("label IS NOT NULL AND label != '' AND deleted_at IS NULL").
		Distinct("label").
		Order("label ASC").
		Pluck("label", &labels).Error
	if err != nil {
		return nil, err
	}
	return labels, nil
}

// ─── Material Repository ─────────────────────────────────────────────────────

type MaterialRepository interface {
	Create(ctx context.Context, material *models.Material) error
	FindByID(ctx context.Context, id uuid.UUID) (*models.Material, error)
	FindByCompetencyID(ctx context.Context, compID uuid.UUID) ([]models.Material, error)
	Update(ctx context.Context, material *models.Material) error
	Delete(ctx context.Context, id uuid.UUID) error
	List(ctx context.Context, filter dto.ListMaterialFilter) ([]models.Material, int64, error)
	ListPublished(ctx context.Context, filter dto.ListMaterialFilter) ([]models.Material, int64, error)
	PublishMaterialsByModuleID(ctx context.Context, moduleID uuid.UUID, updatedByID uuid.UUID) error
}

type materialRepository struct {
	db *gorm.DB
}

func NewMaterialRepository(db *gorm.DB) MaterialRepository {
	return &materialRepository{db: db}
}

func (r *materialRepository) Create(ctx context.Context, material *models.Material) error {
	return r.db.WithContext(ctx).Create(material).Error
}

func (r *materialRepository) FindByID(ctx context.Context, id uuid.UUID) (*models.Material, error) {
	var material models.Material
	err := r.db.WithContext(ctx).
		Preload("Competency").
		First(&material, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &material, nil
}

func (r *materialRepository) FindByCompetencyID(ctx context.Context, compID uuid.UUID) ([]models.Material, error) {
	var materials []models.Material
	err := r.db.WithContext(ctx).
		Preload("Competency").
		Where("competency_id = ? AND status = ?", compID, models.ContentStatusPublished).
		Order("display_order ASC").
		Find(&materials).Error
	return materials, err
}

func (r *materialRepository) Update(ctx context.Context, material *models.Material) error {
	return r.db.WithContext(ctx).Save(material).Error
}

func (r *materialRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&models.Material{}, "id = ?", id).Error
}

func (r *materialRepository) List(ctx context.Context, filter dto.ListMaterialFilter) ([]models.Material, int64, error) {
	var materials []models.Material
	var total int64

	query := r.db.WithContext(ctx).Model(&models.Material{})

	if filter.ModuleID != nil {
		query = query.Where("module_id = ?", filter.ModuleID)
	}
	if filter.CompetencyID != nil {
		query = query.Where("competency_id = ?", filter.CompetencyID)
	}
	if filter.Status != "" {
		query = query.Where("status = ?", filter.Status)
	}
	if filter.Search != "" {
		query = query.Where("title ILIKE ?", "%"+filter.Search+"%")
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if filter.Limit > 0 {
		query = query.Limit(filter.Limit)
	}
	if filter.Offset > 0 {
		query = query.Offset(filter.Offset)
	}

	err := query.
		Preload("Competency").
		Order("display_order ASC, created_at DESC").
		Find(&materials).Error

	return materials, total, err
}

func (r *materialRepository) ListPublished(ctx context.Context, filter dto.ListMaterialFilter) ([]models.Material, int64, error) {
	filter.Status = string(models.ContentStatusPublished)
	return r.List(ctx, filter)
}

func (r *materialRepository) PublishMaterialsByModuleID(ctx context.Context, moduleID uuid.UUID, updatedByID uuid.UUID) error {
	return r.db.WithContext(ctx).
		Model(&models.Material{}).
		Where("module_id = ?", moduleID).
		Updates(map[string]interface{}{
			"status":     models.ContentStatusPublished,
			"updated_by": updatedByID,
			"updated_at": time.Now(),
		}).Error
}

// ─── Progress Repository ─────────────────────────────────────────────────────

type LearningProgressRepository interface {
	UpsertProgress(ctx context.Context, progress *models.LearningProgress) error
	FindByUserAndMaterial(ctx context.Context, userID, materialID uuid.UUID) (*models.LearningProgress, error)
	ListUserProgress(ctx context.Context, userID uuid.UUID) ([]models.LearningProgress, error)
	CountCompletedByModule(ctx context.Context, userID, moduleID uuid.UUID) (int64, error)
	CountMaterialsByModule(ctx context.Context, moduleID uuid.UUID) (int64, error)
}

type learningProgressRepository struct {
	db *gorm.DB
}

func NewLearningProgressRepository(db *gorm.DB) LearningProgressRepository {
	return &learningProgressRepository{db: db}
}

func (r *learningProgressRepository) UpsertProgress(ctx context.Context, progress *models.LearningProgress) error {
	if progress.ID == uuid.Nil {
		progress.ID = uuid.New()
	}
	return r.db.WithContext(ctx).Clauses(clause.OnConflict{
		Columns: []clause.Column{{Name: "user_id"}, {Name: "material_id"}},
		DoUpdates: clause.AssignmentColumns([]string{
			"is_completed",
			"completed_at",
			"updated_at",
		}),
	}).Create(progress).Error
}

func (r *learningProgressRepository) FindByUserAndMaterial(ctx context.Context, userID, materialID uuid.UUID) (*models.LearningProgress, error) {
	var progress models.LearningProgress
	err := r.db.WithContext(ctx).
		Where("user_id = ? AND material_id = ?", userID, materialID).
		First(&progress).Error
	if err != nil {
		return nil, err
	}
	return &progress, nil
}

func (r *learningProgressRepository) ListUserProgress(ctx context.Context, userID uuid.UUID) ([]models.LearningProgress, error) {
	var items []models.LearningProgress
	err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		Find(&items).Error
	return items, err
}

func (r *learningProgressRepository) CountCompletedByModule(ctx context.Context, userID, moduleID uuid.UUID) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).
		Model(&models.LearningProgress{}).
		Joins("JOIN materials ON materials.id = learning_progress.material_id").
		Where("learning_progress.user_id = ? AND materials.module_id = ? AND learning_progress.is_completed = true", userID, moduleID).
		Count(&count).Error
	return count, err
}

func (r *learningProgressRepository) CountMaterialsByModule(ctx context.Context, moduleID uuid.UUID) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).
		Model(&models.Material{}).
		Where("module_id = ? AND status = ?", moduleID, models.ContentStatusPublished).
		Count(&count).Error
	return count, err
}
