package service_test

import (
	"context"
	"testing"
	"time"

	"github.com/google/uuid"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
	"simantikApi/internal/service"
)

type mockAdminRepo struct {
	stats       *dto.AdminDashboardStatsResponse
	users       map[uuid.UUID]*models.User
	profiles    map[uuid.UUID]*models.StudentProfile
	userStatus  map[uuid.UUID]string
	userRoles   map[uuid.UUID]string
	attemptNums map[uuid.UUID]int64
	avgScores   map[uuid.UUID]float64
}

func newMockAdminRepo() *mockAdminRepo {
	return &mockAdminRepo{
		stats: &dto.AdminDashboardStatsResponse{
			TotalStudents:      50,
			TotalQuestions:     120,
			TotalTryouts:       5,
			TotalModules:       8,
			TotalMaterials:     24,
			TotalAttempts:      150,
			CompletedAttempts:  130,
			AverageTryoutScore: 78.5,
			RecentActivities:   make([]dto.RecentAttemptItem, 0),
		},
		users:       make(map[uuid.UUID]*models.User),
		profiles:    make(map[uuid.UUID]*models.StudentProfile),
		userStatus:  make(map[uuid.UUID]string),
		userRoles:   make(map[uuid.UUID]string),
		attemptNums: make(map[uuid.UUID]int64),
		avgScores:   make(map[uuid.UUID]float64),
	}
}

func (m *mockAdminRepo) GetDashboardStats(ctx context.Context) (*dto.AdminDashboardStatsResponse, error) {
	return m.stats, nil
}

func (m *mockAdminRepo) ListUsers(ctx context.Context, filter dto.ListAdminUserFilter) ([]dto.AdminUserListItem, int64, error) {
	items := make([]dto.AdminUserListItem, 0, len(m.users))
	for _, u := range m.users {
		if filter.Role != "" && string(u.Role) != filter.Role {
			continue
		}
		if filter.Status != "" && string(u.Status) != filter.Status {
			continue
		}
		items = append(items, dto.AdminUserListItem{
			ID:              u.ID,
			Email:           u.Email,
			FullName:        u.FullName,
			Role:            string(u.Role),
			Status:          string(u.Status),
			IsEmailVerified: u.Status != models.UserStatusPending,
			TotalAttempts:   m.attemptNums[u.ID],
			CreatedAt:       u.CreatedAt,
			LastLoginAt:     u.LastLoginAt,
		})
	}
	return items, int64(len(items)), nil
}

func (m *mockAdminRepo) GetUserDetail(ctx context.Context, userID uuid.UUID) (*dto.AdminUserDetailResponse, error) {
	u, ok := m.users[userID]
	if !ok {
		return nil, service.ErrUserNotFound
	}

	detail := &dto.AdminUserDetailResponse{
		ID:              u.ID,
		Email:           u.Email,
		FullName:        u.FullName,
		Role:            string(u.Role),
		Status:          string(u.Status),
		IsEmailVerified: u.Status != models.UserStatusPending,
		CreatedAt:       u.CreatedAt,
		LastLoginAt:     u.LastLoginAt,
		AttemptCount:    m.attemptNums[userID],
		AverageScore:    m.avgScores[userID],
	}

	if p, hasProf := m.profiles[userID]; hasProf {
		detail.Profile = &dto.StudentProfileResponse{
			School:           p.School,
			Grade:            p.Grade,
			Major:            p.Major,
			TargetUniversity: p.TargetUniversity,
			TargetMajor:      p.TargetMajor,
			Bio:              p.Bio,
		}
	}

	return detail, nil
}

func (m *mockAdminRepo) UpdateUserStatus(ctx context.Context, userID uuid.UUID, status string) error {
	u, ok := m.users[userID]
	if !ok {
		return service.ErrUserNotFound
	}
	u.Status = models.UserStatus(status)
	m.userStatus[userID] = status
	return nil
}

func (m *mockAdminRepo) UpdateUserRole(ctx context.Context, userID uuid.UUID, role string) error {
	u, ok := m.users[userID]
	if !ok {
		return service.ErrUserNotFound
	}
	u.Role = models.UserRole(role)
	m.userRoles[userID] = role
	return nil
}

func (m *mockAdminRepo) GetUserActivities(ctx context.Context, userID uuid.UUID) ([]dto.StudentActivityLogItem, error) {
	_, ok := m.users[userID]
	if !ok {
		return nil, service.ErrUserNotFound
	}
	return []dto.StudentActivityLogItem{
		{
			ID:            "act-1",
			Type:          "practice",
			Title:         "Mengerjakan Latihan: Pemahaman Inferensial",
			Description:   "Pencatatan evaluasi otomatis paket diagnostik berhasil disimpan.",
			Timestamp:     time.Now(),
			FormattedTime: "18 Sep 2026, 14:10 WIB",
		},
	}, nil
}

func (m *mockAdminRepo) GetUserProgress(ctx context.Context, userID uuid.UUID, timeframe string) (*dto.StudentProgressResponse, error) {
	_, ok := m.users[userID]
	if !ok {
		return nil, service.ErrUserNotFound
	}
	return &dto.StudentProgressResponse{
		LatestScore:         84,
		PreviousScore:       78,
		ScoreDiff:           6,
		TrendText:           "Tren: Nilai latihan meningkat (+6 poin)",
		LatestPracticeTitle: "Pemahaman Inferensial & Hubungan Gagasan",
		LatestPracticeDate:  "22 September 2026",
		ChartData: []dto.StudentProgressChartPoint{
			{Date: "12 Sep", Score: 68, Label: "Kaidah Kebahasaan Dasar"},
			{Date: "22 Sep", Score: 84, Label: "Pemahaman Inferensial"},
		},
		Evaluation: &dto.StudentAuditEvaluation{
			EvaluationTitle: "Pemahaman Inferensial & Hubungan Gagasan",
			EvaluationDate:  "18 September 2026",
			ResultStatus:    "Hasil: Baik",
			TestDomain:      "Bahasa Indonesia: Literasi Wacana",
			TestMode:        "Mandiri Berwaktu (TKA Standar)",
		},
	}, nil
}

func TestAdminService_GetDashboardStats(t *testing.T) {
	repo := newMockAdminRepo()
	svc := service.NewAdminService(repo)

	stats, err := svc.GetDashboardStats(context.Background())
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if stats.TotalStudents != 50 {
		t.Errorf("expected 50 students, got %d", stats.TotalStudents)
	}
	if stats.TotalQuestions != 120 {
		t.Errorf("expected 120 questions, got %d", stats.TotalQuestions)
	}
	if stats.AverageTryoutScore != 78.5 {
		t.Errorf("expected 78.5 avg score, got %f", stats.AverageTryoutScore)
	}
}

func TestAdminService_ListAndDetail(t *testing.T) {
	repo := newMockAdminRepo()
	u1 := &models.User{
		ID:        uuid.New(),
		Email:     "student1@example.com",
		FullName:  "Student One",
		Role:      models.UserRoleStudent,
		Status:    models.UserStatusActive,
		CreatedAt: time.Now(),
	}
	u2 := &models.User{
		ID:        uuid.New(),
		Email:     "cm@example.com",
		FullName:  "Content Manager",
		Role:      models.UserRoleContentManager,
		Status:    models.UserStatusActive,
		CreatedAt: time.Now(),
	}
	repo.users[u1.ID] = u1
	repo.users[u2.ID] = u2
	repo.attemptNums[u1.ID] = 5
	repo.avgScores[u1.ID] = 82.0
	repo.profiles[u1.ID] = &models.StudentProfile{
		School: "SMA 1 Bandung",
		Grade:  "12",
	}

	svc := service.NewAdminService(repo)

	// List all
	res, err := svc.ListUsers(context.Background(), dto.ListAdminUserFilter{})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if res.Total != 2 {
		t.Errorf("expected 2 users, got %d", res.Total)
	}

	// Filter by role
	resStudent, err := svc.ListUsers(context.Background(), dto.ListAdminUserFilter{Role: "student"})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if resStudent.Total != 1 || resStudent.Users[0].Email != "student1@example.com" {
		t.Errorf("expected 1 student user, got %+v", resStudent)
	}

	// Get detail
	detail, err := svc.GetUserDetail(context.Background(), u1.ID)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if detail.AttemptCount != 5 {
		t.Errorf("expected 5 attempts, got %d", detail.AttemptCount)
	}
	if detail.Profile == nil || detail.Profile.School != "SMA 1 Bandung" {
		t.Errorf("expected profile school 'SMA 1 Bandung', got %+v", detail.Profile)
	}
}

func TestAdminService_RoleAndStatusUpdate(t *testing.T) {
	repo := newMockAdminRepo()
	adminID := uuid.New()
	targetID := uuid.New()

	adminUser := &models.User{
		ID:       adminID,
		Email:    "admin@simantik.id",
		FullName: "Super Admin",
		Role:     models.UserRoleAdmin,
		Status:   models.UserStatusActive,
	}
	targetUser := &models.User{
		ID:       targetID,
		Email:    "user@simantik.id",
		FullName: "Regular User",
		Role:     models.UserRoleStudent,
		Status:   models.UserStatusActive,
	}
	repo.users[adminID] = adminUser
	repo.users[targetID] = targetUser

	svc := service.NewAdminService(repo)

	// Self-deactivation protection
	err := svc.UpdateUserStatus(context.Background(), adminID, adminID, "inactive")
	if err != service.ErrCannotSelfDeactivate {
		t.Errorf("expected ErrCannotSelfDeactivate, got %v", err)
	}

	// Valid target status update
	err = svc.UpdateUserStatus(context.Background(), targetID, adminID, "suspended")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if targetUser.Status != models.UserStatusSuspended {
		t.Errorf("expected status suspended, got %s", targetUser.Status)
	}

	// Self-role update protection
	err = svc.UpdateUserRole(context.Background(), adminID, adminID, "student")
	if err != service.ErrCannotChangeOwnRole {
		t.Errorf("expected ErrCannotChangeOwnRole, got %v", err)
	}

	// Valid target role update
	err = svc.UpdateUserRole(context.Background(), targetID, adminID, "content_manager")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if targetUser.Role != models.UserRoleContentManager {
		t.Errorf("expected role content_manager, got %s", targetUser.Role)
	}

	// Invalid role check
	err = svc.UpdateUserRole(context.Background(), targetID, adminID, "superman")
	if err != service.ErrInvalidRole {
		t.Errorf("expected ErrInvalidRole, got %v", err)
	}

	// Test GetUserActivities
	acts, err := svc.GetUserActivities(context.Background(), targetID)
	if err != nil {
		t.Fatalf("expected no error getting activities, got %v", err)
	}
	if len(acts) == 0 {
		t.Errorf("expected at least 1 activity, got 0")
	}

	// Test GetUserProgress
	prog, err := svc.GetUserProgress(context.Background(), targetID, "3m")
	if err != nil {
		t.Fatalf("expected no error getting progress, got %v", err)
	}
	if prog.LatestScore != 84 {
		t.Errorf("expected latest score 84, got %v", prog.LatestScore)
	}
}

