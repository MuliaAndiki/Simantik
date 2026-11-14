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
	SchoolID         *string `json:"schoolId,omitempty"`
	School           string  `json:"school"`
	Grade            string  `json:"grade"`
	Jenjang          *string `json:"jenjang,omitempty"`
	SchoolJenjang    *string `json:"schoolJenjang,omitempty"`
	EffectiveJenjang *string `json:"effectiveJenjang,omitempty"`
	Major            string  `json:"major"`
	TargetUniversity string  `json:"target_university"`
	TargetMajor      string  `json:"target_major"`
	Bio              string  `json:"bio"`
}

// ContentStatusBreakdown details content items across publication stages.
type ContentStatusBreakdown struct {
	Total     int64 `json:"total"`
	Published int64 `json:"published"`
	Review    int64 `json:"review"`
	Draft     int64 `json:"draft"`
}

// StudentGrowthPoint represents a single data point for student registration growth.
type StudentGrowthPoint struct {
	Period   string `json:"period"`
	Students int64  `json:"students"`
	Label    string `json:"label"`
}

// RecentStudentItem represents a student in the admin dashboard latest student table.
type RecentStudentItem struct {
	ID            uuid.UUID `json:"id"`
	FullName      string    `json:"full_name"`
	Email         string    `json:"email"`
	School        string    `json:"school"`
	RegisteredAt  time.Time `json:"registered_at"`
	FormattedDate string    `json:"formatted_date"`
	Status        string    `json:"status"`
}

// AdminAuditLogItem represents a high-level administrative audit log item.
type AdminAuditLogItem struct {
	ID            string    `json:"id"`
	UserName      string    `json:"user_name"`
	UserRole      string    `json:"user_role"`
	Action        string    `json:"action"`
	TargetTitle   string    `json:"target_title"`
	FormattedTime string    `json:"formatted_time"`
	RelativeTime  string    `json:"relative_time"`
	Timestamp     time.Time `json:"timestamp"`
}

// AdminDashboardStatsResponse aggregates high-level platform health metrics and charts.
type AdminDashboardStatsResponse struct {
	TotalStudents          int64                  `json:"total_students"`
	ActiveStudents         int64                  `json:"active_students"`
	ActiveStudentsPercent  float64                `json:"active_students_percent"`
	StudentGrowthRate      string                 `json:"student_growth_rate"`
	TotalQuestions         int64                  `json:"total_questions"`
	TotalTryouts           int64                  `json:"total_tryouts"`
	TotalModules           int64                  `json:"total_modules"`
	TotalMaterials         int64                  `json:"total_materials"`
	TotalPracticePackages  int64                  `json:"total_practice_packages"`
	TotalAttempts          int64                  `json:"total_attempts"`
	CompletedAttempts      int64                  `json:"completed_attempts"`
	AverageTryoutScore     float64                `json:"average_tryout_score"`
	MaterialStatus         ContentStatusBreakdown `json:"material_status"`
	PracticeStatus         ContentStatusBreakdown `json:"practice_status"`
	TryoutStatus           ContentStatusBreakdown `json:"tryout_status"`
	CompletedTryouts       int64                  `json:"completed_tryouts"`
	LiveTryouts            int64                  `json:"live_tryouts"`
	StudentGrowthChart     []StudentGrowthPoint   `json:"student_growth_chart"`
	AverageMonthlyGrowth   string                 `json:"average_monthly_growth"`
	RecentStudents         []RecentStudentItem    `json:"recent_students"`
	RecentAuditLogs        []AdminAuditLogItem    `json:"recent_audit_logs"`
	RecentActivities       []RecentAttemptItem    `json:"recent_activities"`
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

// StudentActivityLogItem represents an activity feed / audit log item for a specific student.
type StudentActivityLogItem struct {
	ID            string     `json:"id"`
	Type          string     `json:"type"` // "practice", "tryout", "learning", "auth"
	Title         string     `json:"title"`
	Description   string     `json:"description"`
	Timestamp     time.Time  `json:"timestamp"`
	FormattedTime string     `json:"formatted_time"`
	Score         *float64   `json:"score,omitempty"`
}

// StudentProgressChartPoint represents a data point on the score progress curve.
type StudentProgressChartPoint struct {
	Date  string  `json:"date"`
	Score float64 `json:"score"`
	Label string  `json:"label"`
}

// StudentAuditEvaluation represents the latest evaluation audit for a student.
type StudentAuditEvaluation struct {
	EvaluationTitle string   `json:"evaluation_title"`
	EvaluationDate  string   `json:"evaluation_date"`
	ResultStatus    string   `json:"result_status"` // "Hasil: Baik", "Hasil: Cukup", "Perlu Perbaikan"
	TestDomain      string   `json:"test_domain"`
	TestMode        string   `json:"test_mode"`
	Score           *float64 `json:"score,omitempty"`
	Accuracy        *float64 `json:"accuracy,omitempty"`
}

// StudentProgressResponse aggregates student performance metrics, progress curves, and evaluation audits.
type StudentProgressResponse struct {
	LatestScore         float64                     `json:"latest_score"`
	PreviousScore       float64                     `json:"previous_score"`
	ScoreDiff           float64                     `json:"score_diff"`
	TrendText           string                      `json:"trend_text"`
	LatestPracticeTitle string                      `json:"latest_practice_title"`
	LatestPracticeDate  string                      `json:"latest_practice_date"`
	ChartData           []StudentProgressChartPoint `json:"chart_data"`
	Evaluation          *StudentAuditEvaluation     `json:"evaluation,omitempty"`
}
