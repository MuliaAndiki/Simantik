package service

import (
	"context"

	"github.com/google/uuid"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
	"simantikApi/internal/repository"
)

type AdminService interface {
	GetDashboardStats(ctx context.Context) (*dto.AdminDashboardStatsResponse, error)
	ListUsers(ctx context.Context, filter dto.ListAdminUserFilter) (*dto.PaginatedAdminUsersResponse, error)
	GetUserDetail(ctx context.Context, userID uuid.UUID) (*dto.AdminUserDetailResponse, error)
	GetUserActivities(ctx context.Context, userID uuid.UUID) ([]dto.StudentActivityLogItem, error)
	GetUserProgress(ctx context.Context, userID uuid.UUID, timeframe string) (*dto.StudentProgressResponse, error)
	UpdateUserStatus(ctx context.Context, targetUserID, actorUserID uuid.UUID, status string) error
	UpdateUserRole(ctx context.Context, targetUserID, actorUserID uuid.UUID, role string) error
}

type adminService struct {
	adminRepo repository.AdminRepository
}

func NewAdminService(adminRepo repository.AdminRepository) AdminService {
	return &adminService{adminRepo: adminRepo}
}

func (s *adminService) GetDashboardStats(ctx context.Context) (*dto.AdminDashboardStatsResponse, error) {
	return s.adminRepo.GetDashboardStats(ctx)
}

func (s *adminService) ListUsers(ctx context.Context, filter dto.ListAdminUserFilter) (*dto.PaginatedAdminUsersResponse, error) {
	limit := filter.Limit
	if limit <= 0 {
		limit = 20
	}
	offset := filter.Offset
	if offset < 0 {
		offset = 0
	}

	users, total, err := s.adminRepo.ListUsers(ctx, filter)
	if err != nil {
		return nil, err
	}

	return &dto.PaginatedAdminUsersResponse{
		Users:  users,
		Total:  total,
		Limit:  limit,
		Offset: offset,
	}, nil
}

func (s *adminService) GetUserDetail(ctx context.Context, userID uuid.UUID) (*dto.AdminUserDetailResponse, error) {
	detail, err := s.adminRepo.GetUserDetail(ctx, userID)
	if err != nil {
		return nil, ErrUserNotFound
	}
	return detail, nil
}

func (s *adminService) GetUserActivities(ctx context.Context, userID uuid.UUID) ([]dto.StudentActivityLogItem, error) {
	return s.adminRepo.GetUserActivities(ctx, userID)
}

func (s *adminService) GetUserProgress(ctx context.Context, userID uuid.UUID, timeframe string) (*dto.StudentProgressResponse, error) {
	return s.adminRepo.GetUserProgress(ctx, userID, timeframe)
}

func (s *adminService) UpdateUserStatus(ctx context.Context, targetUserID, actorUserID uuid.UUID, status string) error {
	if targetUserID == actorUserID && status != string(models.UserStatusActive) {
		return ErrCannotSelfDeactivate
	}

	switch models.UserStatus(status) {
	case models.UserStatusActive, models.UserStatusInactive, models.UserStatusSuspended:
		// Valid status
	default:
		return ErrInvalidStatus
	}

	return s.adminRepo.UpdateUserStatus(ctx, targetUserID, status)
}

func (s *adminService) UpdateUserRole(ctx context.Context, targetUserID, actorUserID uuid.UUID, role string) error {
	if targetUserID == actorUserID {
		return ErrCannotChangeOwnRole
	}

	switch models.UserRole(role) {
	case models.UserRoleStudent, models.UserRoleContentManager, models.UserRoleAdmin:
		// Valid role
	default:
		return ErrInvalidRole
	}

	return s.adminRepo.UpdateUserRole(ctx, targetUserID, role)
}

