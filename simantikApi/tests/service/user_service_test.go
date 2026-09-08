package service_test

import (
	"context"
	"testing"

	"github.com/google/uuid"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
	"simantikApi/internal/repository"
	"simantikApi/internal/service"
	"simantikApi/pkg/utils"
)

type mockUserRepo struct {
	users map[uuid.UUID]*models.User
}

func newMockUserRepo() *mockUserRepo {
	return &mockUserRepo{users: make(map[uuid.UUID]*models.User)}
}

func (m *mockUserRepo) Create(ctx context.Context, user *models.User) error {
	if user.ID == uuid.Nil {
		user.ID = uuid.New()
	}
	m.users[user.ID] = user
	return nil
}

func (m *mockUserRepo) FindByID(ctx context.Context, id uuid.UUID) (*models.User, error) {
	u, ok := m.users[id]
	if !ok {
		return nil, repository.ErrNotFound
	}
	return u, nil
}

func (m *mockUserRepo) FindByEmail(ctx context.Context, email string) (*models.User, error) {
	for _, u := range m.users {
		if u.Email == email {
			return u, nil
		}
	}
	return nil, repository.ErrNotFound
}

func (m *mockUserRepo) Update(ctx context.Context, user *models.User) error {
	m.users[user.ID] = user
	return nil
}

func (m *mockUserRepo) UpdateLastLogin(ctx context.Context, id uuid.UUID) error {
	return nil
}

func (m *mockUserRepo) List(ctx context.Context, filter dto.UserFilter) ([]models.User, int64, error) {
	var list []models.User
	for _, u := range m.users {
		list = append(list, *u)
	}
	return list, int64(len(list)), nil
}

type mockRefreshTokenRepo struct {
	tokens map[string]*models.RefreshToken
}

func newMockRefreshTokenRepo() *mockRefreshTokenRepo {
	return &mockRefreshTokenRepo{tokens: make(map[string]*models.RefreshToken)}
}

func (m *mockRefreshTokenRepo) Create(ctx context.Context, token *models.RefreshToken) error {
	m.tokens[token.TokenHash] = token
	return nil
}

func (m *mockRefreshTokenRepo) FindByTokenHash(ctx context.Context, hash string) (*models.RefreshToken, error) {
	t, ok := m.tokens[hash]
	if !ok {
		return nil, repository.ErrNotFound
	}
	return t, nil
}

func (m *mockRefreshTokenRepo) RevokeByID(ctx context.Context, id uuid.UUID) error {
	return nil
}

func (m *mockRefreshTokenRepo) RevokeAllByUserID(ctx context.Context, userID uuid.UUID) error {
	return nil
}

func (m *mockRefreshTokenRepo) DeleteExpired(ctx context.Context) error {
	return nil
}

func TestUserService_GetMe(t *testing.T) {
	userRepo := newMockUserRepo()
	sessionRepo := newMockRefreshTokenRepo()
	svc := service.NewUserService(userRepo, sessionRepo)

	user := &models.User{
		ID:       uuid.New(),
		FullName: "Ahmad Santoso",
		Email:    "ahmad@example.com",
		Role:     models.UserRoleStudent,
		Status:   models.UserStatusActive,
	}
	_ = userRepo.Create(context.Background(), user)

	res, err := svc.GetMe(context.Background(), user.ID)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if res.FullName != "Ahmad Santoso" {
		t.Errorf("expected FullName %q, got %q", "Ahmad Santoso", res.FullName)
	}
	if res.Role != "student" {
		t.Errorf("expected Role %q, got %q", "student", res.Role)
	}
}

func TestUserService_ChangePassword(t *testing.T) {
	userRepo := newMockUserRepo()
	sessionRepo := newMockRefreshTokenRepo()
	svc := service.NewUserService(userRepo, sessionRepo)

	oldPassword := "OldPass123!"
	oldHash, _ := utils.HashPassword(oldPassword)

	user := &models.User{
		ID:           uuid.New(),
		FullName:     "Siti Aminah",
		Email:        "siti@example.com",
		PasswordHash: oldHash,
		Role:         models.UserRoleStudent,
		Status:       models.UserStatusActive,
	}
	_ = userRepo.Create(context.Background(), user)

	// Wrong current password
	err := svc.ChangePassword(context.Background(), user.ID, dto.ChangePasswordRequest{
		CurrentPassword: "WrongCurrentPassword",
		NewPassword:     "NewSecurePass123!",
	})
	if err != service.ErrWrongPassword {
		t.Errorf("expected ErrWrongPassword, got: %v", err)
	}

	// Same password
	err = svc.ChangePassword(context.Background(), user.ID, dto.ChangePasswordRequest{
		CurrentPassword: oldPassword,
		NewPassword:     oldPassword,
	})
	if err != service.ErrSamePassword {
		t.Errorf("expected ErrSamePassword, got: %v", err)
	}

	// Successful password change
	err = svc.ChangePassword(context.Background(), user.ID, dto.ChangePasswordRequest{
		CurrentPassword: oldPassword,
		NewPassword:     "NewPass456!",
	})
	if err != nil {
		t.Fatalf("unexpected error changing password: %v", err)
	}

	// Verify new password matches
	updated, _ := userRepo.FindByID(context.Background(), user.ID)
	if utils.ComparePassword(updated.PasswordHash, "NewPass456!") != nil {
		t.Errorf("expected new password hash to match 'NewPass456!'")
	}
}

func TestUserService_UpdateUserStatus(t *testing.T) {
	userRepo := newMockUserRepo()
	sessionRepo := newMockRefreshTokenRepo()
	svc := service.NewUserService(userRepo, sessionRepo)

	adminID := uuid.New()
	studentID := uuid.New()

	_ = userRepo.Create(context.Background(), &models.User{
		ID:       studentID,
		FullName: "Budi",
		Email:    "budi@example.com",
		Role:     models.UserRoleStudent,
		Status:   models.UserStatusActive,
	})

	// Admin cannot self-deactivate
	_, err := svc.UpdateUserStatus(context.Background(), adminID, adminID, "inactive")
	if err != service.ErrCannotSelfDeactivate {
		t.Errorf("expected ErrCannotSelfDeactivate, got %v", err)
	}

	// Update student to suspended
	res, err := svc.UpdateUserStatus(context.Background(), adminID, studentID, "suspended")
	if err != nil {
		t.Fatalf("unexpected error updating status: %v", err)
	}
	if res.Status != "suspended" {
		t.Errorf("expected status suspended, got %s", res.Status)
	}
}
