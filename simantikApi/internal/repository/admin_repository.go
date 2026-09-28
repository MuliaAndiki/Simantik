package repository

import (
	"context"
	"database/sql"
	"fmt"
	"sort"
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
	GetUserActivities(ctx context.Context, userID uuid.UUID) ([]dto.StudentActivityLogItem, error)
	GetUserProgress(ctx context.Context, userID uuid.UUID, timeframe string) (*dto.StudentProgressResponse, error)
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
		RecentActivities:   make([]dto.RecentAttemptItem, 0),
		StudentGrowthChart: make([]dto.StudentGrowthPoint, 0),
		RecentStudents:     make([]dto.RecentStudentItem, 0),
		RecentAuditLogs:    make([]dto.AdminAuditLogItem, 0),
	}

	if r.db == nil {
		return stats, nil
	}

	// 1. Total students & active students
	if err := r.db.WithContext(ctx).Model(&models.User{}).Where("role = ? AND deleted_at IS NULL", models.UserRoleStudent).Count(&stats.TotalStudents).Error; err != nil {
		return nil, err
	}
	if err := r.db.WithContext(ctx).Model(&models.User{}).Where("role = ? AND status = ? AND deleted_at IS NULL", models.UserRoleStudent, models.UserStatusActive).Count(&stats.ActiveStudents).Error; err != nil {
		return nil, err
	}
	if stats.TotalStudents > 0 {
		stats.ActiveStudentsPercent = float64(stats.ActiveStudents) / float64(stats.TotalStudents) * 100
	}

	// 2. Total questions
	if err := r.db.WithContext(ctx).Model(&models.Question{}).Where("deleted_at IS NULL").Count(&stats.TotalQuestions).Error; err != nil {
		return nil, err
	}

	// 3. Total tryouts & breakdown
	if err := r.db.WithContext(ctx).Model(&models.Tryout{}).Where("deleted_at IS NULL").Count(&stats.TotalTryouts).Error; err != nil {
		return nil, err
	}
	stats.TryoutStatus.Total = stats.TotalTryouts
	_ = r.db.WithContext(ctx).Model(&models.Tryout{}).Where("status = ? AND deleted_at IS NULL", models.ContentStatusPublished).Count(&stats.TryoutStatus.Published)
	_ = r.db.WithContext(ctx).Model(&models.Tryout{}).Where("status = ? AND deleted_at IS NULL", models.ContentStatusReview).Count(&stats.TryoutStatus.Review)
	_ = r.db.WithContext(ctx).Model(&models.Tryout{}).Where("status = ? AND deleted_at IS NULL", models.ContentStatusDraft).Count(&stats.TryoutStatus.Draft)
	
	// Live / Completed Tryouts
	now := time.Now()
	_ = r.db.WithContext(ctx).Model(&models.Tryout{}).Where("deleted_at IS NULL AND start_at IS NOT NULL AND end_at IS NOT NULL AND start_at <= ? AND end_at >= ?", now, now).Count(&stats.LiveTryouts)
	_ = r.db.WithContext(ctx).Model(&models.Tryout{}).Where("deleted_at IS NULL AND end_at IS NOT NULL AND end_at < ?", now).Count(&stats.CompletedTryouts)

	// 4. Total modules
	if err := r.db.WithContext(ctx).Model(&models.LearningModule{}).Where("deleted_at IS NULL").Count(&stats.TotalModules).Error; err != nil {
		return nil, err
	}

	// 5. Total materials & breakdown
	if err := r.db.WithContext(ctx).Model(&models.Material{}).Where("deleted_at IS NULL").Count(&stats.TotalMaterials).Error; err != nil {
		return nil, err
	}
	stats.MaterialStatus.Total = stats.TotalMaterials
	_ = r.db.WithContext(ctx).Model(&models.Material{}).Where("status = ? AND deleted_at IS NULL", models.ContentStatusPublished).Count(&stats.MaterialStatus.Published)
	_ = r.db.WithContext(ctx).Model(&models.Material{}).Where("status = ? AND deleted_at IS NULL", models.ContentStatusReview).Count(&stats.MaterialStatus.Review)
	_ = r.db.WithContext(ctx).Model(&models.Material{}).Where("status = ? AND deleted_at IS NULL", models.ContentStatusDraft).Count(&stats.MaterialStatus.Draft)

	// 6. Practice packages & breakdown
	if err := r.db.WithContext(ctx).Model(&models.PracticePackage{}).Where("deleted_at IS NULL").Count(&stats.TotalPracticePackages).Error; err != nil {
		return nil, err
	}
	stats.PracticeStatus.Total = stats.TotalPracticePackages
	_ = r.db.WithContext(ctx).Model(&models.PracticePackage{}).Where("status = ? AND deleted_at IS NULL", models.ContentStatusPublished).Count(&stats.PracticeStatus.Published)
	_ = r.db.WithContext(ctx).Model(&models.PracticePackage{}).Where("status = ? AND deleted_at IS NULL", models.ContentStatusReview).Count(&stats.PracticeStatus.Review)
	_ = r.db.WithContext(ctx).Model(&models.PracticePackage{}).Where("status = ? AND deleted_at IS NULL", models.ContentStatusDraft).Count(&stats.PracticeStatus.Draft)

	// 7. Total attempts & completed
	if err := r.db.WithContext(ctx).Model(&models.TryoutAttempt{}).Count(&stats.TotalAttempts).Error; err != nil {
		return nil, err
	}
	if err := r.db.WithContext(ctx).Model(&models.TryoutAttempt{}).Where("status = ?", models.AttemptStatusCompleted).Count(&stats.CompletedAttempts).Error; err != nil {
		return nil, err
	}

	// 8. Average tryout score
	var avgScore sql.NullFloat64
	_ = r.db.WithContext(ctx).Model(&models.TryoutAttempt{}).Where("status = ?", models.AttemptStatusCompleted).Select("COALESCE(AVG(score), 0)").Scan(&avgScore)
	if avgScore.Valid {
		stats.AverageTryoutScore = avgScore.Float64
	}

	// 9. Recent activities (attempts)
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

	// 10. Recent registered students
	type recentStudentRow struct {
		ID        uuid.UUID
		FullName  string
		Email     string
		School    *string
		Status    string
		CreatedAt time.Time
	}
	var studentRows []recentStudentRow
	_ = r.db.WithContext(ctx).Table("users").
		Select("users.id, users.full_name, users.email, student_profiles.school, users.status, users.created_at").
		Joins("LEFT JOIN student_profiles ON student_profiles.user_id = users.id").
		Where("users.role = ? AND users.deleted_at IS NULL", models.UserRoleStudent).
		Order("users.created_at DESC").
		Limit(5).
		Scan(&studentRows)

	for _, s := range studentRows {
		schoolName := "-"
		if s.School != nil && *s.School != "" {
			schoolName = *s.School
		}
		stats.RecentStudents = append(stats.RecentStudents, dto.RecentStudentItem{
			ID:            s.ID,
			FullName:      s.FullName,
			Email:         s.Email,
			School:        schoolName,
			RegisteredAt:  s.CreatedAt,
			FormattedDate: formatIndoDayMonthYear(s.CreatedAt),
			Status:        s.Status,
		})
	}

	// 11. Student growth monthly chart data (past 6 months, real counts)
	stats.StudentGrowthChart = r.studentGrowthLast6Months(ctx, now)

	// 11b. Growth rate vs previous month & average per month (real counts)
	stats.StudentGrowthRate, stats.AverageMonthlyGrowth = r.studentGrowthRates(ctx, now, stats.TotalStudents)

	// 12. Recent audit logs (real rows; empty when nothing is logged yet)
	stats.RecentAuditLogs = r.recentAuditLogs(ctx)
	return stats, nil
}

// studentGrowthLast6Months menghitung pendaftar per bulan 6 bulan terakhir.
func (r *adminRepository) studentGrowthLast6Months(ctx context.Context, now time.Time) []dto.StudentGrowthPoint {
	monthsID := []string{"Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"}
	type monthRow struct {
		Month time.Time
		Count int64
	}
	var rows []monthRow
	start := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location()).AddDate(0, -5, 0)
	err := r.db.WithContext(ctx).Table("users").
		Select("date_trunc('month', created_at) AS month, COUNT(*) AS count").
		Where("role = ? AND deleted_at IS NULL AND created_at >= ?", models.UserRoleStudent, start).
		Group("1").Scan(&rows).Error
	if err != nil {
		return []dto.StudentGrowthPoint{}
	}
	byMonth := make(map[string]int64, len(rows))
	for _, row := range rows {
		byMonth[row.Month.Format("2006-01")] = row.Count
	}
	points := make([]dto.StudentGrowthPoint, 0, 6)
	for i := 5; i >= 0; i-- {
		m := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location()).AddDate(0, -i, 0)
		count := byMonth[m.Format("2006-01")]
		label := monthsID[int(m.Month())-1]
		points = append(points, dto.StudentGrowthPoint{
			Period:   label,
			Students: count,
			Label:    fmt.Sprintf("%s — %d siswa terdaftar", label, count),
		})
	}
	return points
}

// studentGrowthRates menghitung laju vs bulan lalu dan rata-rata per bulan.
// String kosong bila belum ada data.
func (r *adminRepository) studentGrowthRates(ctx context.Context, now time.Time, total int64) (rate, avg string) {
	if total == 0 {
		return "", ""
	}
	startOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	var prevTotal int64
	_ = r.db.WithContext(ctx).Model(&models.User{}).
		Where("role = ? AND deleted_at IS NULL AND created_at < ?", models.UserRoleStudent, startOfMonth).
		Count(&prevTotal).Error
	if prevTotal > 0 {
		rate = fmt.Sprintf("%+.1f%%", float64(total-prevTotal)/float64(prevTotal)*100)
	}
	var earliest time.Time
	_ = r.db.WithContext(ctx).Model(&models.User{}).
		Where("role = ? AND deleted_at IS NULL", models.UserRoleStudent).
		Select("COALESCE(MIN(created_at), NOW())").Scan(&earliest).Error
	months := 1
	if !earliest.IsZero() {
		months = (now.Year()-earliest.Year())*12 + int(now.Month()-earliest.Month()) + 1
		if months < 1 {
			months = 1
		}
	}
	avg = fmt.Sprintf("+%d Siswa/Bulan", int64(float64(total)/float64(months)+0.5))
	return rate, avg
}

// recentAuditLogs membaca audit_logs asli (kosong bila belum ada yang tercatat).
func (r *adminRepository) recentAuditLogs(ctx context.Context) []dto.AdminAuditLogItem {
	type auditRow struct {
		ID        uuid.UUID
		UserID    *uuid.UUID
		UserName  string
		UserRole  string
		Action    string
		CreatedAt time.Time
	}
	var rows []auditRow
	err := r.db.WithContext(ctx).Table("audit_logs").
		Select("audit_logs.id, audit_logs.user_id, COALESCE(users.full_name, '') AS user_name, COALESCE(users.role, '') AS user_role, audit_logs.action, audit_logs.created_at").
		Joins("LEFT JOIN users ON users.id = audit_logs.user_id").
		Order("audit_logs.created_at DESC").
		Limit(5).
		Scan(&rows).Error
	if err != nil {
		return []dto.AdminAuditLogItem{}
	}
	items := make([]dto.AdminAuditLogItem, 0, len(rows))
	for _, row := range rows {
		name := row.UserName
		if name == "" {
			name = "Sistem"
		}
		items = append(items, dto.AdminAuditLogItem{
			ID:            row.ID.String(),
			UserName:      name,
			UserRole:      row.UserRole,
			Action:        row.Action,
			TargetTitle:   "",
			FormattedTime: formatRelativeID(row.CreatedAt),
			RelativeTime:  formatRelativeID(row.CreatedAt),
			Timestamp:     row.CreatedAt,
		})
	}
	return items
}

// formatRelativeID memformat selisih waktu ("10 mnt lalu", "3 jam lalu", ...).
func formatRelativeID(t time.Time) string {
	d := time.Since(t)
	if d < 0 {
		d = 0
	}
	switch {
	case d < time.Hour:
		m := int(d.Minutes())
		if m < 1 {
			m = 1
		}
		return fmt.Sprintf("%d mnt lalu", m)
	case d < 24*time.Hour:
		return fmt.Sprintf("%d jam lalu", int(d.Hours()))
	default:
		return fmt.Sprintf("%d hari lalu", int(d.Hours()/24))
	}
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

func (r *adminRepository) GetUserActivities(ctx context.Context, userID uuid.UUID) ([]dto.StudentActivityLogItem, error) {
	if r.db == nil {
		return make([]dto.StudentActivityLogItem, 0), nil
	}

	var activities []dto.StudentActivityLogItem

	// 1. Tryout attempts
	var tryoutAttempts []models.TryoutAttempt
		if err := r.db.WithContext(ctx).
		Preload("Tryout").
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(10).
		Find(&tryoutAttempts).Error; err == nil {
		for _, ta := range tryoutAttempts {
			title := "Mengikuti Simulasi Tryout"
			if ta.Tryout != nil && ta.Tryout.Title != "" {
				title = fmt.Sprintf("Mengikuti Tryout %s", ta.Tryout.Title)
			}
			desc := "Sesi pengerjaan tryout tercatat."
			if ta.Status == models.AttemptStatusInProgress {
				desc = "Sesi pengerjaan tryout sedang berlangsung."
			} else if ta.Score != nil {
				desc = fmt.Sprintf("Sesi selesai dengan skor %.0f.", *ta.Score)
			}
			activities = append(activities, dto.StudentActivityLogItem{
				ID:            ta.ID.String(),
				Type:          "tryout",
				Title:         title,
				Description:   desc,
				Timestamp:     ta.CreatedAt,
				FormattedTime: formatIndoDateTime(ta.CreatedAt),
				Score:         ta.Score,
			})
		}
	}

	// 2. Practice attempts
	var practices []models.Practice
	if err := r.db.WithContext(ctx).
		Preload("Package").
		Preload("Competency").
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(10).
		Find(&practices).Error; err == nil {
		for _, p := range practices {
			title := "Mengerjakan Latihan Mandiri"
			if p.Package != nil && p.Package.Title != "" {
				title = fmt.Sprintf("Mengerjakan Latihan: %s", p.Package.Title)
			} else if p.Competency != nil && p.Competency.Name != "" {
				title = fmt.Sprintf("Mengerjakan Latihan: %s", p.Competency.Name)
			}
			desc := "Latihan tercatat."
			if p.Score != nil {
				desc = fmt.Sprintf("Latihan selesai dengan skor %.0f.", *p.Score)
			}
			activities = append(activities, dto.StudentActivityLogItem{
				ID:            p.ID.String(),
				Type:          "practice",
				Title:         title,
				Description:   desc,
				Timestamp:     p.CreatedAt,
				FormattedTime: formatIndoDateTime(p.CreatedAt),
				Score:         p.Score,
			})
		}
	}

	// 3. Learning progresses
	var progresses []models.LearningProgress
	if err := r.db.WithContext(ctx).
		Preload("Material").
		Where("user_id = ?", userID).
		Order("updated_at DESC").
		Limit(10).
		Find(&progresses).Error; err == nil {
		for _, lp := range progresses {
			title := "Mempelajari Materi"
			if lp.Material != nil && lp.Material.Title != "" {
				title = fmt.Sprintf("Mempelajari Materi: %s", lp.Material.Title)
			}
			desc := "Materi mulai dipelajari."
			if lp.IsCompleted {
				desc = "Materi selesai dipelajari."
			}
			activities = append(activities, dto.StudentActivityLogItem{
				ID:            lp.ID.String(),
				Type:          "learning",
				Title:         title,
				Description:   desc,
				Timestamp:     lp.UpdatedAt,
				FormattedTime: formatIndoDateTime(lp.UpdatedAt),
			})
		}
	}

	// 4. Registration event
	var user models.User
	if err := r.db.WithContext(ctx).Where("id = ?", userID).First(&user).Error; err == nil {
		activities = append(activities, dto.StudentActivityLogItem{
			ID:            "reg-" + user.ID.String(),
			Type:          "auth",
			Title:         "Pendaftaran Akun SIMANTIK Berhasil",
			Description:   fmt.Sprintf("Akun terdaftar pada %s.", formatIndoDate(user.CreatedAt)),
			Timestamp:     user.CreatedAt,
			FormattedTime: formatIndoDateTime(user.CreatedAt),
		})
	}

	// Sort activities descending by timestamp
	sort.Slice(activities, func(i, j int) bool {
		return activities[i].Timestamp.After(activities[j].Timestamp)
	})

	if len(activities) > 15 {
		activities = activities[:15]
	}

	return activities, nil
}

func (r *adminRepository) GetUserProgress(ctx context.Context, userID uuid.UUID, timeframe string) (*dto.StudentProgressResponse, error) {
	resp := &dto.StudentProgressResponse{
		ChartData: make([]dto.StudentProgressChartPoint, 0),
	}

	if r.db == nil {
		return resp, nil
	}

	// Calculate since threshold
	now := time.Now()
	var since time.Time
	switch timeframe {
	case "7d":
		since = now.AddDate(0, 0, -7)
	case "30d":
		since = now.AddDate(0, 0, -30)
	case "6m":
		since = now.AddDate(0, -6, 0)
	default: // 3m
		since = now.AddDate(0, -3, 0)
	}

	// Fetch practice sessions and tryout attempts with score
	type scoredSession struct {
		Date      time.Time
		Score     float64
		Title     string
		Domain    string
	}

	var sessions []scoredSession

	var practices []models.Practice
	if err := r.db.WithContext(ctx).
		Preload("Package").
		Preload("Competency").
		Where("user_id = ? AND score IS NOT NULL AND created_at >= ?", userID, since).
		Order("created_at ASC").
		Find(&practices).Error; err == nil {
		for _, p := range practices {
			if p.Score != nil {
				title := "Latihan Mandiri"
				domain := ""
				if p.Package != nil && p.Package.Title != "" {
					title = p.Package.Title
				} else if p.Competency != nil && p.Competency.Name != "" {
					title = p.Competency.Name
					domain = p.Competency.Name
				}
				sessions = append(sessions, scoredSession{
					Date:   p.CreatedAt,
					Score:  *p.Score,
					Title:  title,
					Domain: domain,
				})
			}
		}
	}

	var tryouts []models.TryoutAttempt
	if err := r.db.WithContext(ctx).
		Preload("Tryout").
		Where("user_id = ? AND score IS NOT NULL AND created_at >= ?", userID, since).
		Order("created_at ASC").
		Find(&tryouts).Error; err == nil {
		for _, t := range tryouts {
			if t.Score != nil {
				title := "Simulasi Tryout"
				domain := ""
				if t.Tryout != nil && t.Tryout.Title != "" {
					title = t.Tryout.Title
				}
				sessions = append(sessions, scoredSession{
					Date:   t.CreatedAt,
					Score:  *t.Score,
					Title:  title,
					Domain: domain,
				})
			}
		}
	}

	// Sort sessions chronologically
	sort.Slice(sessions, func(i, j int) bool {
		return sessions[i].Date.Before(sessions[j].Date)
	})

	// Construct chart data points
	if len(sessions) > 0 {
		for _, s := range sessions {
			resp.ChartData = append(resp.ChartData, dto.StudentProgressChartPoint{
				Date:  formatIndoDayMonth(s.Date),
				Score: s.Score,
				Label: s.Title,
			})
		}

		lastIdx := len(sessions) - 1
		resp.LatestScore = sessions[lastIdx].Score
		resp.LatestPracticeTitle = sessions[lastIdx].Title
		resp.LatestPracticeDate = formatIndoDate(sessions[lastIdx].Date)

		if len(sessions) > 1 {
			resp.PreviousScore = sessions[lastIdx-1].Score
			resp.ScoreDiff = resp.LatestScore - resp.PreviousScore
		} else {
			resp.PreviousScore = resp.LatestScore
			resp.ScoreDiff = 0
		}

		if resp.ScoreDiff > 0 {
			resp.TrendText = fmt.Sprintf("Tren: Nilai latihan meningkat (+%.0f poin)", resp.ScoreDiff)
		} else if resp.ScoreDiff < 0 {
			resp.TrendText = fmt.Sprintf("Tren: Nilai latihan menurun (%.0f poin)", resp.ScoreDiff)
		} else {
			resp.TrendText = "Tren: Nilai latihan stabil"
		}

		// Evaluation summary from latest session
		resultStatus := "Hasil: Baik"
		if resp.LatestScore < 60 {
			resultStatus = "Perlu Perbaikan"
		} else if resp.LatestScore < 75 {
			resultStatus = "Hasil: Cukup"
		}

		testDomain := "Bahasa Indonesia"
		if sessions[lastIdx].Domain != "" {
			testDomain = fmt.Sprintf("Bahasa Indonesia: %s", sessions[lastIdx].Domain)
		}

		resp.Evaluation = &dto.StudentAuditEvaluation{
			EvaluationTitle: sessions[lastIdx].Title,
			EvaluationDate:  formatIndoDate(sessions[lastIdx].Date),
			ResultStatus:    resultStatus,
			TestDomain:      testDomain,
			TestMode:        "",
			Score:           &resp.LatestScore,
		}
	}
	// Tanpa sesi: ChartData kosong, skor nol, Evaluation nil (jujur kosong).

	return resp, nil
}

func formatIndoDateTime(t time.Time) string {
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

func formatIndoDate(t time.Time) string {
	months := []string{"", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"}
	if t.IsZero() {
		return "-"
	}
	m := int(t.Month())
	if m < 1 || m > 12 {
		m = 1
	}
	return fmt.Sprintf("%02d %s %d", t.Day(), months[m], t.Year())
}

func formatIndoDayMonth(t time.Time) string {
	months := []string{"", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"}
	if t.IsZero() {
		return "-"
	}
	m := int(t.Month())
	if m < 1 || m > 12 {
		m = 1
	}
	return fmt.Sprintf("%02d %s", t.Day(), months[m])
}

func formatIndoDayMonthYear(t time.Time) string {
	months := []string{"", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"}
	if t.IsZero() {
		return "-"
	}
	m := int(t.Month())
	if m < 1 || m > 12 {
		m = 1
	}
	return fmt.Sprintf("%02d %s %d", t.Day(), months[m], t.Year())
}


