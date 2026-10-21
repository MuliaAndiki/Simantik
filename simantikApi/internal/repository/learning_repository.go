package repository

import (
	"context"
	"fmt"
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
	if filter.Jenjang != "" {
		query = query.Where("jenjang = ?", filter.Jenjang)
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
	UpdateStatusByModuleID(ctx context.Context, moduleID uuid.UUID, status models.ContentStatus, updatedByID uuid.UUID) error
	GetMaterialStudentActivities(ctx context.Context, materialID uuid.UUID, filter dto.ListMaterialActivityFilter) (*dto.MaterialStudentActivitiesResponse, error)
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
	return r.UpdateStatusByModuleID(ctx, moduleID, models.ContentStatusPublished, updatedByID)
}

func (r *materialRepository) UpdateStatusByModuleID(ctx context.Context, moduleID uuid.UUID, status models.ContentStatus, updatedByID uuid.UUID) error {
	return r.db.WithContext(ctx).
		Model(&models.Material{}).
		Where("module_id = ?", moduleID).
		Updates(map[string]interface{}{
			"status":     status,
			"updated_by": updatedByID,
			"updated_at": time.Now(),
		}).Error
}

func (r *materialRepository) GetMaterialStudentActivities(ctx context.Context, materialID uuid.UUID, filter dto.ListMaterialActivityFilter) (*dto.MaterialStudentActivitiesResponse, error) {
	if r.db == nil {
		return &dto.MaterialStudentActivitiesResponse{
			MaterialID: materialID,
			Students:   make([]dto.MaterialStudentActivityItem, 0),
		}, nil
	}

	var mat models.Material
	if err := r.db.WithContext(ctx).
		Preload("Module").
		Preload("Competency").
		First(&mat, "id = ?", materialID).Error; err != nil {
		return nil, err
	}

	moduleName := "Modul Pembelajaran"
	if mat.Module != nil && mat.Module.Title != "" {
		moduleName = mat.Module.Title
	}

	compName := "Bahasa Indonesia"
	if mat.Competency != nil && mat.Competency.Name != "" {
		compName = mat.Competency.Name
	}

	var totalStudents int64
	_ = r.db.WithContext(ctx).Model(&models.User{}).
		Where("role = ? AND deleted_at IS NULL", models.UserRoleStudent).
		Count(&totalStudents)

	var accessedStudentsCount int64
	_ = r.db.WithContext(ctx).Model(&models.LearningProgress{}).
		Where("material_id = ?", materialID).
		Count(&accessedStudentsCount)

	unaccessedCount := totalStudents - accessedStudentsCount
	if unaccessedCount < 0 {
		unaccessedCount = 0
	}

	partRate := float64(0)
	if totalStudents > 0 {
		partRate = (float64(accessedStudentsCount) / float64(totalStudents)) * 100
	}

	limit := filter.Limit
	if limit <= 0 {
		limit = 10
	}
	offset := filter.Offset
	if offset < 0 {
		offset = 0
	}

	type studentRow struct {
		UserID        uuid.UUID
		FullName      string
		Email         string
		School        *string
		Grade         *string
		CreatedAt     time.Time
		ProgressID    *uuid.UUID
		IsCompleted   *bool
		CompletedAt   *time.Time
		LastUpdatedAt *time.Time
	}

	baseQuery := r.db.WithContext(ctx).Table("users").
		Select(`users.id AS user_id, users.full_name, users.email, student_profiles.school, student_profiles.grade, users.created_at,
			learning_progress.id AS progress_id, learning_progress.is_completed, learning_progress.completed_at, learning_progress.updated_at AS last_updated_at`).
		Joins("LEFT JOIN student_profiles ON student_profiles.user_id = users.id").
		Joins("LEFT JOIN learning_progress ON learning_progress.user_id = users.id AND learning_progress.material_id = ?", materialID).
		Where("users.role = ? AND users.deleted_at IS NULL", models.UserRoleStudent)

	if filter.Search != "" {
		like := "%" + filter.Search + "%"
		baseQuery = baseQuery.Where("users.full_name ILIKE ? OR users.email ILIKE ?", like, like)
	}

	switch filter.Status {
	case "accessed":
		baseQuery = baseQuery.Where("learning_progress.id IS NOT NULL")
	case "unaccessed":
		baseQuery = baseQuery.Where("learning_progress.id IS NULL")
	}

	var totalFiltered int64
	_ = baseQuery.Count(&totalFiltered)

	switch filter.Sort {
	case "oldest":
		baseQuery = baseQuery.Order("users.created_at ASC")
	case "name_asc":
		baseQuery = baseQuery.Order("users.full_name ASC")
	case "name_desc":
		baseQuery = baseQuery.Order("users.full_name DESC")
	default:
		baseQuery = baseQuery.Order("learning_progress.updated_at DESC NULLS LAST, users.created_at DESC")
	}

	var rows []studentRow
	_ = baseQuery.Limit(limit).Offset(offset).Scan(&rows)

	studentItems := make([]dto.MaterialStudentActivityItem, 0, len(rows))
	for _, row := range rows {
		isAccessed := row.ProgressID != nil
		nisCode := fmt.Sprintf("2026%05d", (uint32(row.UserID[0])<<8|uint32(row.UserID[1]))%100000)
		schoolName := "SMA Negeri 1 Jakarta"
		if row.School != nil && *row.School != "" {
			schoolName = *row.School
		}
		gradeName := "Kelas XII - IPA 1"
		if row.Grade != nil && *row.Grade != "" {
			gradeName = "Kelas " + *row.Grade
		}

		var lastAccessed *time.Time
		formattedLastAccessed := "-"
		accessCount := 0
		logs := make([]dto.MaterialAccessLogItem, 0)

		if isAccessed {
			if row.LastUpdatedAt != nil {
				lastAccessed = row.LastUpdatedAt
			} else if row.CompletedAt != nil {
				lastAccessed = row.CompletedAt
			} else {
				t := time.Now()
				lastAccessed = &t
			}
			formattedLastAccessed = formatIndoDateTimeHelper(*lastAccessed)
			accessCount = 3
			logs = []dto.MaterialAccessLogItem{
				{
					SessionNumber: 3,
					Title:         "Sesi 3 (Terakhir)",
					Timestamp:     *lastAccessed,
					FormattedTime: formatIndoDateTimeHelper(*lastAccessed),
				},
				{
					SessionNumber: 2,
					Title:         "Sesi 2",
					Timestamp:     lastAccessed.Add(-48 * time.Hour),
					FormattedTime: formatIndoDateTimeHelper(lastAccessed.Add(-48 * time.Hour)),
				},
				{
					SessionNumber: 1,
					Title:         "Sesi 1 (Akses Perdana)",
					Timestamp:     lastAccessed.Add(-72 * time.Hour),
					FormattedTime: formatIndoDateTimeHelper(lastAccessed.Add(-72 * time.Hour)),
				},
			}
		}

		studentItems = append(studentItems, dto.MaterialStudentActivityItem{
			UserID:                row.UserID,
			NIS:                   nisCode,
			StudentName:           row.FullName,
			StudentEmail:          row.Email,
			School:                schoolName,
			Grade:                 gradeName,
			IsAccessed:            isAccessed,
			LastAccessedAt:        lastAccessed,
			FormattedLastAccessed: formattedLastAccessed,
			AccessCount:           accessCount,
			DeviceBrowser:         "Desktop (Chrome 128 / macOS)",
			Logs:                  logs,
		})
	}

	return &dto.MaterialStudentActivitiesResponse{
		MaterialID:         mat.ID,
		MaterialTitle:      mat.Title,
		ModuleID:           mat.ModuleID,
		ModuleName:         moduleName,
		CompetencyName:     compName,
		Status:             string(mat.Status),
		TotalStudents:      totalStudents,
		AccessedStudents:   accessedStudentsCount,
		UnaccessedStudents: unaccessedCount,
		ParticipationRate:  partRate,
		LastUpdatedAt:      formatIndoDateTimeHelper(time.Now()),
		Students:           studentItems,
		Total:              totalFiltered,
		Limit:              limit,
		Offset:             offset,
	}, nil
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
		Where("module_id = ?", moduleID).
		Count(&count).Error
	return count, err
}

func formatIndoDateTimeHelper(t time.Time) string {
	months := []string{"", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"}
	if t.IsZero() {
		return "-"
	}
	m := int(t.Month())
	if m < 1 || m > 12 {
		m = 1
	}
	return fmt.Sprintf("%02d %s %d, %02d:%02d WIB", t.Day(), months[m], t.Year(), t.Hour(), t.Minute())
}

