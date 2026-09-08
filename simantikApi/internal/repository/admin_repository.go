package repository

import (
	"context"
	"database/sql"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
)

type AdminRepository interface {
	GetDashboardStats(ctx context.Context) (*dto.AdminDashboardStatsResponse, error)
	ListUsers(ctx context.Context, filter dto.ListAdminUserFilter) ([]dto.AdminUserListItem, int64, error)
	GetUserDetail(ctx context.Context, userID uuid.UUID) (*dto.AdminUserDetailResponse, error)
	UpdateUserStatus(ctx context.Context, userID uuid.UUID, status string) error
	UpdateUserRole(ctx context.Context, userID uuid.UUID, role string) error
}

type adminRepository struct {
	db *gorm.DB
}

func NewAdminRepository(db *gorm.DB) AdminRepository {
	return &adminRepository{db: db}
}

func (r *adminRepository) GetDashboardStats(ctx context.Context) (*dto.AdminDashboardStatsResponse, error) {
	stats := &dto.AdminDashboardStatsResponse{
		RecentActivities: make([]dto.RecentAttemptItem, 0),
	}

	if r.db == nil {
		return stats, nil
	}

	// 1. Total students
	if err := r.db.WithContext(ctx).Model(&models.User{}).Where("role = ? AND deleted_at IS NULL", models.UserRoleStudent).Count(&stats.TotalStudents).Error; err != nil {
		return nil, err
	}

	// 2. Total questions
	if err := r.db.WithContext(ctx).Model(&models.Question{}).Where("deleted_at IS NULL").Count(&stats.TotalQuestions).Error; err != nil {
		return nil, err
	}

	// 3. Total tryouts
	if err := r.db.WithContext(ctx).Model(&models.Tryout{}).Where("deleted_at IS NULL").Count(&stats.TotalTryouts).Error; err != nil {
		return nil, err
	}

	// 4. Total modules
	if err := r.db.WithContext(ctx).Model(&models.LearningModule{}).Where("deleted_at IS NULL").Count(&stats.TotalModules).Error; err != nil {
		return nil, err
	}

	// 5. Total materials
	if err := r.db.WithContext(ctx).Model(&models.Material{}).Where("deleted_at IS NULL").Count(&stats.TotalMaterials).Error; err != nil {
		return nil, err
	}

	// 6. Total attempts & completed
	if err := r.db.WithContext(ctx).Model(&models.TryoutAttempt{}).Count(&stats.TotalAttempts).Error; err != nil {
		return nil, err
	}
	if err := r.db.WithContext(ctx).Model(&models.TryoutAttempt{}).Where("status = ?", models.AttemptStatusCompleted).Count(&stats.CompletedAttempts).Error; err != nil {
		return nil, err
	}

	// 7. Average tryout score
	var avgScore sql.NullFloat64
	_ = r.db.WithContext(ctx).Model(&models.TryoutAttempt{}).Where("status = ?", models.AttemptStatusCompleted).Select("COALESCE(AVG(score), 0)").Scan(&avgScore)
	if avgScore.Valid {
		stats.AverageTryoutScore = avgScore.Float64
	}

	// 8. Recent activities
	type recentRow struct {
		AttemptID    uuid.UUID
		UserID       uuid.UUID
		StudentName  string
		StudentEmail string
		TryoutTitle  string
		Score        *float64
		Status       string
		SubmittedAt  *time.Time
	}
	var rows []recentRow
	err := r.db.WithContext(ctx).Table("tryout_attempts").
		Select("tryout_attempts.id AS attempt_id, tryout_attempts.user_id, users.full_name AS student_name, users.email AS student_email, tryouts.title AS tryout_title, tryout_attempts.score, tryout_attempts.status, tryout_attempts.submitted_at").
		Joins("LEFT JOIN users ON users.id = tryout_attempts.user_id").
		Joins("LEFT JOIN tryouts ON tryouts.id = tryout_attempts.tryout_id").
		Order("tryout_attempts.created_at DESC").
		Limit(10).
		Scan(&rows).Error
	if err == nil {
		for _, row := range rows {
			stats.RecentActivities = append(stats.RecentActivities, dto.RecentAttemptItem{
				AttemptID:    row.AttemptID,
				UserID:       row.UserID,
				StudentName:  row.StudentName,
				StudentEmail: row.StudentEmail,
				TryoutTitle:  row.TryoutTitle,
				Score:        row.Score,
				Status:       row.Status,
				SubmittedAt:  row.SubmittedAt,
			})
		}
	}

	return stats, nil
}

func (r *adminRepository) ListUsers(ctx context.Context, filter dto.ListAdminUserFilter) ([]dto.AdminUserListItem, int64, error) {
	if r.db == nil {
		return []dto.AdminUserListItem{}, 0, nil
	}

	limit := filter.Limit
	if limit <= 0 {
		limit = 20
	}
	offset := filter.Offset
	if offset < 0 {
		offset = 0
	}

	baseQuery := r.db.WithContext(ctx).Table("users").Where("users.deleted_at IS NULL")
	if filter.Search != "" {
		like := "%" + filter.Search + "%"
		baseQuery = baseQuery.Where("users.full_name ILIKE ? OR users.email ILIKE ?", like, like)
	}
	if filter.Role != "" {
		baseQuery = baseQuery.Where("users.role = ?", filter.Role)
	}
	if filter.Status != "" {
		baseQuery = baseQuery.Where("users.status = ?", filter.Status)
	}

	var total int64
	if err := baseQuery.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	type userRow struct {
		ID            uuid.UUID
		Email         string
		FullName      string
		Role          string
		Status        string
		LastLoginAt   *time.Time
		CreatedAt     time.Time
		TotalAttempts int64
	}

	var rows []userRow
	err := baseQuery.
		Select("users.id, users.email, users.full_name, users.role, users.status, users.last_login_at, users.created_at, (SELECT COUNT(*) FROM tryout_attempts WHERE tryout_attempts.user_id = users.id) AS total_attempts").
		Order("users.created_at DESC").
		Limit(limit).
		Offset(offset).
		Scan(&rows).Error
	if err != nil {
		return nil, 0, err
	}

	items := make([]dto.AdminUserListItem, len(rows))
	for i, row := range rows {
		items[i] = dto.AdminUserListItem{
			ID:              row.ID,
			Email:           row.Email,
			FullName:        row.FullName,
			Role:            row.Role,
			Status:          row.Status,
			IsEmailVerified: row.Status != string(models.UserStatusPending),
			TotalAttempts:   row.TotalAttempts,
			CreatedAt:       row.CreatedAt,
			LastLoginAt:     row.LastLoginAt,
		}
	}

	return items, total, nil
}

func (r *adminRepository) GetUserDetail(ctx context.Context, userID uuid.UUID) (*dto.AdminUserDetailResponse, error) {
	if r.db == nil {
		return nil, gorm.ErrRecordNotFound
	}

	var user models.User
	if err := r.db.WithContext(ctx).Where("id = ? AND deleted_at IS NULL", userID).First(&user).Error; err != nil {
		return nil, err
	}

	res := &dto.AdminUserDetailResponse{
		ID:              user.ID,
		Email:           user.Email,
		FullName:        user.FullName,
		Role:            string(user.Role),
		Status:          string(user.Status),
		IsEmailVerified: user.Status != models.UserStatusPending,
		CreatedAt:       user.CreatedAt,
		LastLoginAt:     user.LastLoginAt,
	}

	// Fetch student profile if exists
	var profile models.StudentProfile
	if err := r.db.WithContext(ctx).Where("user_id = ?", userID).First(&profile).Error; err == nil {
		res.Profile = &dto.StudentProfileResponse{
			School:           profile.School,
			Grade:            profile.Grade,
			Major:            profile.Major,
			TargetUniversity: profile.TargetUniversity,
			TargetMajor:      profile.TargetMajor,
			Bio:              profile.Bio,
		}
	}

	// Attempt count
	_ = r.db.WithContext(ctx).Model(&models.TryoutAttempt{}).Where("user_id = ?", userID).Count(&res.AttemptCount)

	// Average score
	var avgScore sql.NullFloat64
	_ = r.db.WithContext(ctx).Model(&models.TryoutAttempt{}).Where("user_id = ? AND status = ?", userID, models.AttemptStatusCompleted).Select("COALESCE(AVG(score), 0)").Scan(&avgScore)
	if avgScore.Valid {
		res.AverageScore = avgScore.Float64
	}

	// Completed materials count
	_ = r.db.WithContext(ctx).Model(&models.LearningProgress{}).Where("user_id = ? AND is_completed = ?", userID, true).Count(&res.CompletedMaterialsCount)

	return res, nil
}

func (r *adminRepository) UpdateUserStatus(ctx context.Context, userID uuid.UUID, status string) error {
	if r.db == nil {
		return nil
	}
	return r.db.WithContext(ctx).Model(&models.User{}).Where("id = ? AND deleted_at IS NULL", userID).Update("status", status).Error
}

func (r *adminRepository) UpdateUserRole(ctx context.Context, userID uuid.UUID, role string) error {
	if r.db == nil {
		return nil
	}
	return r.db.WithContext(ctx).Model(&models.User{}).Where("id = ? AND deleted_at IS NULL", userID).Update("role", role).Error
}
