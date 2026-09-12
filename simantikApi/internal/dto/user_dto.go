package dto

import (
	"time"

	"github.com/google/uuid"
)

// ─── Request DTOs ────────────────────────────────────────────────────────────

// RegisterRequest is the payload for self-service user registration.
type RegisterRequest struct {
	FullName string `json:"fullName" validate:"required,min=2,max=150"`
	Email    string `json:"email"    validate:"required,email"`
	Password string `json:"password" validate:"required,min=8,max=72"`
}

// LoginRequest is the payload for email/password authentication.
type LoginRequest struct {
	Email    string `json:"email"    validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

// RefreshRequest carries the refresh token for session renewal.
// The token is read from the httpOnly cookie set at login, so this struct
// is used only in the service layer — the handler reads from c.Cookies().
type RefreshRequest struct {
	RefreshToken string `json:"refreshToken"`
}

// LogoutRequest carries the refresh token to revoke.
// Same as RefreshRequest — read from cookie in handler.
type LogoutRequest struct {
	RefreshToken string `json:"refreshToken"`
}

// ForgotPasswordRequest initiates the OTP-based password recovery flow.
type ForgotPasswordRequest struct {
	Email string `json:"email" validate:"required,email"`
}

// VerifyOTPRequest validates the OTP sent to the user's email.
type VerifyOTPRequest struct {
	Email string `json:"email" validate:"required,email"`
	OTP   string `json:"otp"   validate:"required,len=6,numeric"`
}

// ResetPasswordRequest sets a new password using the token from VerifyOTP.
type ResetPasswordRequest struct {
	ResetToken  string `json:"resetToken"  validate:"required"`
	NewPassword string `json:"newPassword" validate:"required,min=8,max=72"`
}

// GoogleLoginRequest carries the Google ID token for server-side verification.
type GoogleLoginRequest struct {
	IDToken string `json:"idToken" validate:"required"`
}

// UpdateMySchoolRequest sets the student's school on their profile.
type UpdateMySchoolRequest struct {
	SchoolID string `json:"schoolId" validate:"required,uuid"`
}

// ─── Response DTOs ───────────────────────────────────────────────────────────

// RegisterResponse is returned when registration is initiated and OTP is dispatched.
type RegisterResponse struct {
	Email   string `json:"email"`
	Message string `json:"message"`
}

// ResendOTPRequest requests a fresh OTP for registration or verification.
type ResendOTPRequest struct {
	Email string `json:"email" validate:"required,email"`
}

// VerifyRegisterOTPRequest validates the registration OTP and activates the account.
type VerifyRegisterOTPRequest struct {
	Email string `json:"email" validate:"required,email"`
	OTP   string `json:"otp"   validate:"required,len=6,numeric"`
}

// AuthResponse is returned on successful login, register verification, refresh, or Google login.
// The refresh token is NOT included here — it is delivered via httpOnly cookie only.
type AuthResponse struct {
	User        UserResponse `json:"user"`
	AccessToken string       `json:"accessToken"`
}

// VerifyOTPResponse is returned after a successful password reset OTP verification.
// The reset token must be presented to /auth/resetPassword.
type VerifyOTPResponse struct {
	ResetToken string `json:"resetToken"`
	Message    string `json:"message"`
}

// ─── Internal helper ─────────────────────────────────────────────────────────

// RequestMeta carries per-request metadata (IP, User-Agent) for session tracking.
// It is populated by the handler and passed to the auth service.
type RequestMeta struct {
	UserAgent string
	IPAddress string
}

// ─── User DTOs ────────────────────────────────────────────────────────────────

// UserResponse is the safe, outward-facing representation of a User.
// Sensitive fields (PasswordHash, DeletedAt) are never included.
// HasSchool tells the frontend whether a student has picked a school yet
// (students without one are routed to school onboarding after login).
type UserResponse struct {
	ID          uuid.UUID  `json:"id"`
	FullName    string     `json:"fullName"`
	Email       string     `json:"email"`
	Otp         string     `json:"otp"`
	AvatarURL   *string    `json:"avatarURL"`
	Role        string     `json:"role"`
	Status      string     `json:"status"`
	HasSchool   bool       `json:"hasSchool"`
	LastLoginAt *time.Time `json:"lastLoginAt"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
}

// UpdateMeRequest allows authenticated users to update their own profile.
// Only non-sensitive fields are editable via this request.
type UpdateMeRequest struct {
	FullName string `json:"fullName" validate:"omitempty,min=2,max=150"`
}

// ChangePasswordRequest allows authenticated users to change their own password.
type ChangePasswordRequest struct {
	CurrentPassword string `json:"currentPassword" validate:"required"`
	NewPassword     string `json:"newPassword"     validate:"required,min=8,max=72"`
}

// UpdateAvatarRequest allows authenticated users to update their avatar URL.
// File upload is out of scope for MVP; a URL is accepted directly.
type UpdateAvatarRequest struct {
	AvatarURL string `json:"avatarURL" validate:"required,url"`
}

// UserRolesResponse exposes the role and derived permissions for the frontend.
type UserRolesResponse struct {
	Role        string   `json:"role"`
	Permissions []string `json:"permissions"`
}

// UpdateUserStatusRequest is used by admins to change a user's account status.
type UpdateUserStatusRequest struct {
	Status string `json:"status" validate:"required,oneof=active inactive suspended"`
}

// UserFilter contains pagination and search parameters for the user list.
type UserFilter struct {
	Search string
	Status string
	Role   string
	Limit  int
	Offset int
}

// PaginatedUsersResponse wraps a user list with pagination metadata.
type PaginatedUsersResponse struct {
	Users  []UserResponse `json:"users"`
	Total  int64          `json:"total"`
	Limit  int            `json:"limit"`
	Offset int            `json:"offset"`
}
