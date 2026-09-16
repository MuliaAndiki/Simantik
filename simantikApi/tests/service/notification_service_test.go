package service_test

import (
	"context"
	"sync"
	"testing"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
	"simantikApi/internal/service"
	"simantikApi/pkg/utils"
)

type mockNotificationRepo struct {
	items   map[uuid.UUID]*models.Notification
	userIDs map[string][]uuid.UUID
}

func newMockNotificationRepo() *mockNotificationRepo {
	return &mockNotificationRepo{
		items:   make(map[uuid.UUID]*models.Notification),
		userIDs: make(map[string][]uuid.UUID),
	}
}

func (m *mockNotificationRepo) Create(ctx context.Context, n *models.Notification) error {
	if n.ID == uuid.Nil {
		n.ID = uuid.New()
	}
	if n.CreatedAt.IsZero() {
		n.CreatedAt = time.Now()
	}
	m.items[n.ID] = n
	return nil
}

func (m *mockNotificationRepo) BulkCreate(ctx context.Context, notifications []models.Notification) error {
	for i := range notifications {
		n := notifications[i]
		if n.ID == uuid.Nil {
			n.ID = uuid.New()
		}
		if n.CreatedAt.IsZero() {
			n.CreatedAt = time.Now()
		}
		m.items[n.ID] = &n
	}
	return nil
}

func (m *mockNotificationRepo) FindByID(ctx context.Context, id uuid.UUID) (*models.Notification, error) {
	n, ok := m.items[id]
	if !ok {
		return nil, gorm.ErrRecordNotFound
	}
	return n, nil
}

func (m *mockNotificationRepo) ListByUserID(ctx context.Context, userID uuid.UUID, filter dto.ListNotificationFilter) ([]models.Notification, int64, error) {
	res := make([]models.Notification, 0)
	for _, n := range m.items {
		if n.UserID != userID {
			continue
		}
		if filter.Type != "" && n.Type != filter.Type {
			continue
		}
		if filter.IsRead != nil && n.IsRead != *filter.IsRead {
			continue
		}
		res = append(res, *n)
	}
	return res, int64(len(res)), nil
}

func (m *mockNotificationRepo) CountUnread(ctx context.Context, userID uuid.UUID) (int64, error) {
	var count int64
	for _, n := range m.items {
		if n.UserID == userID && !n.IsRead {
			count++
		}
	}
	return count, nil
}

func (m *mockNotificationRepo) MarkAsRead(ctx context.Context, id uuid.UUID, userID uuid.UUID) error {
	n, ok := m.items[id]
	if !ok || n.UserID != userID {
		return gorm.ErrRecordNotFound
	}
	n.IsRead = true
	return nil
}

func (m *mockNotificationRepo) MarkAllAsRead(ctx context.Context, userID uuid.UUID) error {
	for _, n := range m.items {
		if n.UserID == userID {
			n.IsRead = true
		}
	}
	return nil
}

func (m *mockNotificationRepo) FindUserIDsByRole(ctx context.Context, role string) ([]uuid.UUID, error) {
	if ids, ok := m.userIDs[role]; ok {
		return ids, nil
	}
	return m.userIDs["all"], nil
}

type spyEmailSender struct {
	mu            sync.Mutex
	lastRecipient string
	lastScore     float64
	lastTitle     string
	sentCount     int
}

func (s *spyEmailSender) SendRegistrationOTP(ctx context.Context, toEmail, otpCode string) error {
	return nil
}

func (s *spyEmailSender) SendPasswordResetOTP(ctx context.Context, toEmail, otpCode string) error {
	return nil
}

func (s *spyEmailSender) SendPasswordResetConfirmation(ctx context.Context, toEmail string) error {
	return nil
}

func (s *spyEmailSender) SendTryoutResult(ctx context.Context, toEmail, studentName, tryoutTitle string, score, accuracy float64) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.lastRecipient = toEmail
	s.lastScore = score
	s.lastTitle = tryoutTitle
	s.sentCount++
	return nil
}

func (s *spyEmailSender) SendTryoutDetailedResult(ctx context.Context, data utils.TryoutResultEmailData) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.lastRecipient = data.StudentEmail
	s.lastScore = data.Score
	s.lastTitle = data.TryoutTitle
	s.sentCount++
	return nil
}

// ─── Tests ───────────────────────────────────────────────────────────────────

func TestNotificationService_CRUDAndUnread(t *testing.T) {
	repo := newMockNotificationRepo()
	emailSpy := &spyEmailSender{}
	svc := service.NewNotificationService(repo, emailSpy)

	userID := uuid.New()

	// 1. Create notification
	notif, err := svc.CreateNotification(context.Background(), dto.CreateNotificationRequest{
		UserID:  userID,
		Title:   "Jadwal Baru",
		Message: "Tryout Akbar 2026 telah dibuka!",
		Type:    "announcement",
		Link:    "/tryouts",
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if notif.IsRead {
		t.Errorf("expected new notification to be unread")
	}

	// 2. Check unread count
	countRes, err := svc.GetUnreadCount(context.Background(), userID)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if countRes.UnreadCount != 1 {
		t.Errorf("expected unread count 1, got %d", countRes.UnreadCount)
	}

	// 3. Mark single as read
	if err := svc.MarkAsRead(context.Background(), notif.ID, userID); err != nil {
		t.Fatalf("expected mark as read to succeed, got %v", err)
	}

	countResAfter, err := svc.GetUnreadCount(context.Background(), userID)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if countResAfter.UnreadCount != 0 {
		t.Errorf("expected unread count 0, got %d", countResAfter.UnreadCount)
	}

	// 4. Create 2 more, mark all as read
	_, _ = svc.CreateNotification(context.Background(), dto.CreateNotificationRequest{UserID: userID, Title: "N1", Message: "M1"})
	_, _ = svc.CreateNotification(context.Background(), dto.CreateNotificationRequest{UserID: userID, Title: "N2", Message: "M2"})

	if err := svc.MarkAllAsRead(context.Background(), userID); err != nil {
		t.Fatalf("expected mark all as read to succeed, got %v", err)
	}

	finalCount, err := svc.GetUnreadCount(context.Background(), userID)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if finalCount.UnreadCount != 0 {
		t.Errorf("expected 0 unread, got %d", finalCount.UnreadCount)
	}
}

func TestNotificationService_Broadcast(t *testing.T) {
	repo := newMockNotificationRepo()
	emailSpy := &spyEmailSender{}
	svc := service.NewNotificationService(repo, emailSpy)

	u1 := uuid.New()
	u2 := uuid.New()
	u3 := uuid.New()
	repo.userIDs["student"] = []uuid.UUID{u1, u2, u3}

	count, err := svc.BroadcastNotification(context.Background(), dto.BroadcastNotificationRequest{
		Title:      "Maintenance Notice",
		Message:    "Server akan maintenance malam ini.",
		TargetRole: "student",
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if count != 3 {
		t.Errorf("expected 3 broadcast recipients, got %d", count)
	}

	// Check user 1 inbox
	res, err := svc.GetMyNotifications(context.Background(), u1, dto.ListNotificationFilter{})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if res.Total != 1 {
		t.Errorf("expected 1 notification for user 1, got %d", res.Total)
	}
}

func TestNotificationService_SendTryoutResultNotification(t *testing.T) {
	repo := newMockNotificationRepo()
	emailSpy := &spyEmailSender{}
	svc := service.NewNotificationService(repo, emailSpy)

	userID := uuid.New()
	attemptID := uuid.New()

	svc.SendTryoutResultNotification(
		context.Background(),
		userID,
		"Andiki",
		"andiki@example.com",
		"Tryout SNBT #1",
		85.5,
		90.0,
		attemptID,
	)

	// Wait briefly for the goroutine email dispatch
	time.Sleep(50 * time.Millisecond)

	// Check in-app notification
	res, err := svc.GetMyNotifications(context.Background(), userID, dto.ListNotificationFilter{})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if res.Total != 1 {
		t.Fatalf("expected 1 notification created, got %d", res.Total)
	}
	if res.Notifications[0].Type != "tryout_result" {
		t.Errorf("expected type 'tryout_result', got %s", res.Notifications[0].Type)
	}

	// Check email spy
	emailSpy.mu.Lock()
	defer emailSpy.mu.Unlock()
	if emailSpy.sentCount != 1 {
		t.Errorf("expected 1 email sent, got %d", emailSpy.sentCount)
	}
	if emailSpy.lastRecipient != "andiki@example.com" {
		t.Errorf("expected email to 'andiki@example.com', got %s", emailSpy.lastRecipient)
	}
	if emailSpy.lastScore != 85.5 {
		t.Errorf("expected score 85.5, got %f", emailSpy.lastScore)
	}
}
