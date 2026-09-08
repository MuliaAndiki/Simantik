// Package service implements business logic for each domain, orchestrating
// repositories and translating between DTOs and models.
package service

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
	"simantikApi/internal/repository"
	"simantikApi/pkg/utils"
)

// UserService defines the business operations for user profile and account management.
type UserService interface {
	GetMe(ctx context.Context, userID uuid.UUID) (*dto.UserResponse, error)
	UpdateMe(ctx context.Context, userID uuid.UUID, req dto.UpdateMeRequest) (*dto.UserResponse, error)
	ChangePassword(ctx context.Context, userID uuid.UUID, req dto.ChangePasswordRequest) error
	UpdateAvatar(ctx context.Context, userID uuid.UUID, req dto.UpdateAvatarRequest) (*dto.UserResponse, error)
	GetMyRoles(ctx context.Context, userID uuid.UUID) (*dto.UserRolesResponse, error)

	// Admin operations
	ListUsers(ctx context.Context, filter dto.UserFilter) (*dto.PaginatedUsersResponse, error)
	GetUserByID(ctx context.Context, id uuid.UUID) (*dto.UserResponse, error)
	UpdateUserStatus(ctx context.Context, currentAdminID, targetUserID uuid.UUID, status string) (*dto.UserResponse, error)
}

type userService struct {
	userRepo         repository.UserRepository
	refreshTokenRepo repository.RefreshTokenRepository
}

// NewUserService builds a UserService backed by user and session repositories.
func NewUserService(
	userRepo repository.UserRepository,
	refreshTokenRepo repository.RefreshTokenRepository,
) UserService {
	return &userService{
		userRepo:         userRepo,
		refreshTokenRepo: refreshTokenRepo,
	}
}

func (s *userService) GetMe(ctx context.Context, userID uuid.UUID) (*dto.UserResponse, error) {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	res := ToUserResponse(user)
	return &res, nil
}

func (s *userService) UpdateMe(ctx context.Context, userID uuid.UUID, req dto.UpdateMeRequest) (*dto.UserResponse, error) {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	if req.FullName != "" {
		user.FullName = req.FullName
	}

	if err := s.userRepo.Update(ctx, user); err != nil {
		return nil, err
	}

	res := ToUserResponse(user)
	return &res, nil
}

func (s *userService) ChangePassword(ctx context.Context, userID uuid.UUID, req dto.ChangePasswordRequest) error {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return ErrUserNotFound
		}
		return err
	}

	// Verify current password
	if user.PasswordHash == "" {
		return ErrGoogleOnlyAccount
	}
	if err := utils.ComparePassword(user.PasswordHash, req.CurrentPassword); err != nil {
		return ErrWrongPassword
	}

	// Prevent reusing the exact same password
	if req.CurrentPassword == req.NewPassword {
		return ErrSamePassword
	}

	newHash, err := utils.HashPassword(req.NewPassword)
	if err != nil {
		return err
	}

	user.PasswordHash = newHash
	if err := s.userRepo.Update(ctx, user); err != nil {
		return err
	}

	// Revoke existing sessions to enforce security after password change
	_ = s.refreshTokenRepo.RevokeAllByUserID(ctx, userID)

	return nil
}

func (s *userService) UpdateAvatar(ctx context.Context, userID uuid.UUID, req dto.UpdateAvatarRequest) (*dto.UserResponse, error) {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	user.AvatarURL = &req.AvatarURL
	if err := s.userRepo.Update(ctx, user); err != nil {
		return nil, err
	}

	res := ToUserResponse(user)
	return &res, nil
}

func (s *userService) GetMyRoles(ctx context.Context, userID uuid.UUID) (*dto.UserRolesResponse, error) {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	permissions := getPermissionsForRole(string(user.Role))

	return &dto.UserRolesResponse{
		Role:        string(user.Role),
		Permissions: permissions,
	}, nil
}

func (s *userService) ListUsers(ctx context.Context, filter dto.UserFilter) (*dto.PaginatedUsersResponse, error) {
	users, total, err := s.userRepo.List(ctx, filter)
	if err != nil {
		return nil, err
	}

	items := make([]dto.UserResponse, 0, len(users))
	for i := range users {
		items = append(items, ToUserResponse(&users[i]))
	}

	limit := filter.Limit
	if limit <= 0 || limit > 100 {
		limit = 20
	}

	return &dto.PaginatedUsersResponse{
		Users:  items,
		Total:  total,
		Limit:  limit,
		Offset: filter.Offset,
	}, nil
}

func (s *userService) GetUserByID(ctx context.Context, id uuid.UUID) (*dto.UserResponse, error) {
	user, err := s.userRepo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	res := ToUserResponse(user)
	return &res, nil
}

func (s *userService) UpdateUserStatus(ctx context.Context, currentAdminID, targetUserID uuid.UUID, status string) (*dto.UserResponse, error) {
	if currentAdminID == targetUserID && status != string(models.UserStatusActive) {
		return nil, ErrCannotSelfDeactivate
	}

	var newStatus models.UserStatus
	switch status {
	case string(models.UserStatusActive):
		newStatus = models.UserStatusActive
	case string(models.UserStatusInactive):
		newStatus = models.UserStatusInactive
	case string(models.UserStatusSuspended):
		newStatus = models.UserStatusSuspended
	default:
		return nil, ErrInvalidStatus
	}

	user, err := s.userRepo.FindByID(ctx, targetUserID)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	user.Status = newStatus
	if err := s.userRepo.Update(ctx, user); err != nil {
		return nil, err
	}

	// If account was made inactive or suspended, revoke all active sessions immediately
	if newStatus != models.UserStatusActive {
		_ = s.refreshTokenRepo.RevokeAllByUserID(ctx, targetUserID)
	}

	res := ToUserResponse(user)
	return &res, nil
}

// ToUserResponse translates an internal User model into an external safe DTO.
func ToUserResponse(u *models.User) dto.UserResponse {
	return dto.UserResponse{
		ID:          u.ID,
		FullName:    u.FullName,
		Email:       u.Email,
		AvatarURL:   u.AvatarURL,
		Role:        string(u.Role),
		Status:      string(u.Status),
		LastLoginAt: u.LastLoginAt,
		CreatedAt:   u.CreatedAt,
		UpdatedAt:   u.UpdatedAt,
	}
}

// getPermissionsForRole returns granular permission strings mapped from the RBAC role.
func getPermissionsForRole(role string) []string {
	switch role {
	case string(models.UserRoleAdmin):
		return []string{"*"}
	case string(models.UserRoleContentManager):
		return []string{
			"materials:*",
			"questions:*",
			"tryouts:*",
			"news:*",
			"documentation:*",
			"testimonials:*",
			"tutorials:*",
			"profile:read",
			"profile:update",
		}
	default: // Student
		return []string{
			"dashboard:view",
			"materials:view",
			"practice:*",
			"tryout:*",
			"evaluation:view",
			"recommendation:view",
			"profile:read",
			"profile:update",
		}
	}
}
