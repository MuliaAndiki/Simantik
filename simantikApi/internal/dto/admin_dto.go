package dto

import (
	"time"

	"github.com/google/uuid"
)

// RecentAttemptItem represents an activity feed item on the admin dashboard.
type RecentAttemptItem struct {
	AttemptID    uuid.UUID  `json:"attempt_id"`
	UserID       uuid.UUID  `json:"user_id"`
	StudentName  string     `json:"student_name"`
	StudentEmail string     `json:"student_email"`
	TryoutTitle  string     `json:"tryout_title"`
	Score        *float64   `json:"score"`
	Status       string     `json:"status"`
	SubmittedAt  *time.Time `json:"submitted_at"`
}

// StudentProfileResponse represents student academic details.
type StudentProfileResponse struct {
	School           string  `json:"school"`
	Grade            string  `json:"grade"`
	Jenjang          *string `json:"jenjang,omitempty"`
	Major            string  `json:"major"`
	TargetUniversity string  `json:"target_university"`
	TargetMajor      string  `json:"target_major"`
	Bio              string  `json:"bio"`
}

// AdminDashboardStatsResponse aggregates high-level platform health metrics.
type AdminDashboardStatsResponse struct {
	TotalStudents      int64               `json:"total_students"`
	TotalQuestions     int64               `json:"total_questions"`
	TotalTryouts       int64               `json:"total_tryouts"`
	TotalModules       int64               `json:"total_modules"`
	TotalMaterials     int64               `json:"total_materials"`
	TotalAttempts      int64               `json:"total_attempts"`
	CompletedAttempts  int64               `json:"completed_attempts"`
	AverageTryoutScore float64             `json:"average_tryout_score"`
	RecentActivities   []RecentAttemptItem `json:"recent_activities"`
}

// AdminUserListItem represents a user summary in the admin user table.
type AdminUserListItem struct {
	ID              uuid.UUID  `json:"id"`
	Email           string     `json:"email"`
	FullName        string     `json:"full_name"`
	Role            string     `json:"role"`
	Status          string     `json:"status"`
	IsEmailVerified bool       `json:"is_email_verified"`
	TotalAttempts   int64      `json:"total_attempts"`
	CreatedAt       time.Time  `json:"created_at"`
	LastLoginAt     *time.Time `json:"last_login_at"`
}

// AdminUserDetailResponse provides comprehensive details about a user for administrators.
type AdminUserDetailResponse struct {
	ID                      uuid.UUID               `json:"id"`
	Email                   string                  `json:"email"`
	FullName                string                  `json:"full_name"`
	Role                    string                  `json:"role"`
	Status                  string                  `json:"status"`
	IsEmailVerified         bool                    `json:"is_email_verified"`
	CreatedAt               time.Time               `json:"created_at"`
	LastLoginAt             *time.Time              `json:"last_login_at"`
	Profile                 *StudentProfileResponse `json:"profile,omitempty"`
	AttemptCount            int64                   `json:"attempt_count"`
	AverageScore            float64                 `json:"average_score"`
	CompletedMaterialsCount int64                   `json:"completed_materials_count"`
}

// ListAdminUserFilter supports searching and filtering users by role and status.
type ListAdminUserFilter struct {
	Search string `query:"search"`
	Role   string `query:"role"`
	Status string `query:"status"`
	Limit  int    `query:"limit"`
	Offset int    `query:"offset"`
}

// PaginatedAdminUsersResponse wraps paginated user list results for admin views.
type PaginatedAdminUsersResponse struct {
	Users  []AdminUserListItem `json:"users"`
	Total  int64               `json:"total"`
	Limit  int                 `json:"limit"`
	Offset int                 `json:"offset"`
}

// UpdateUserRoleRequest payload for changing user role.
type UpdateUserRoleRequest struct {
	Role string `json:"role" validate:"required,oneof=student content_manager admin"`
}
