// Package service defines sentinel errors that the service layer returns.
// Handlers map these to HTTP status codes using errors.Is.
package service

import "errors"

// Auth errors.
var (
	ErrEmailAlreadyExists     = errors.New("email already registered")
	ErrInvalidCredentials     = errors.New("invalid email or password")
	ErrAccountInactive        = errors.New("account is not active")
	ErrAccountSuspended       = errors.New("account is suspended")
	ErrInvalidRefreshToken    = errors.New("invalid or expired refresh token")
	ErrInvalidOTP             = errors.New("invalid or expired OTP")
	ErrOTPMaxAttempts         = errors.New("maximum OTP attempts exceeded")
	ErrInvalidResetToken      = errors.New("invalid or expired password reset token")
	ErrInvalidGoogleToken     = errors.New("invalid Google identity token")
	ErrPasswordOnlyAccount    = errors.New("this account uses a password — Google login not available")
	ErrGoogleOnlyAccount      = errors.New("this account uses Google login — set a password first")
	ErrAccountPending         = errors.New("account is pending verification, please verify the OTP sent to your email")
	ErrAccountAlreadyVerified = errors.New("account is already verified")
)

// User errors.
var (
	ErrUserNotFound         = errors.New("user not found")
	ErrWrongPassword        = errors.New("current password is incorrect")
	ErrSamePassword         = errors.New("new password must differ from the current password")
	ErrInvalidStatus        = errors.New("invalid account status")
	ErrCannotSelfDeactivate = errors.New("you cannot deactivate your own account")
	ErrInvalidRole          = errors.New("invalid user role")
)

// Tryout and Tryout Attempt errors.
var (
	ErrTryoutNotFound              = errors.New("tryout not found")
	ErrInsufficientPool            = errors.New("insufficient questions in pool")
	ErrCannotDeletePublishedTryout = errors.New("cannot delete a published tryout")
	ErrAttemptNotFound             = errors.New("attempt not found")
	ErrAttemptAlreadyActive        = errors.New("an active attempt already exists")
	ErrAttemptExpired              = errors.New("attempt expired")
	ErrAttemptNotActive            = errors.New("attempt is not active")
	ErrAttemptNotOwner             = errors.New("you do not own this attempt")
	ErrTryoutNotAvailable          = errors.New("tryout is not available")
)

// Practice and Practice Attempt errors.
var (
	ErrPracticePackageNotFound       = errors.New("practice package not found")
	ErrCannotDeletePublishedPractice = errors.New("cannot delete a published practice package")
	ErrPracticeNotFound              = errors.New("practice attempt not found")
	ErrPracticeAlreadyActive         = errors.New("an active practice attempt already exists for this package")
	ErrPracticeNotActive             = errors.New("practice attempt is not active")
	ErrPracticeNotOwner              = errors.New("you do not own this practice attempt")
	ErrPracticeNotAvailable          = errors.New("practice package is not available")
	ErrPracticeEmptyPackage          = errors.New("practice package has no questions")
	ErrPracticeQuestionNotFound      = errors.New("question not found in this practice package")
)

// Competency and Question errors.
var (
	ErrCompetencyNotFound   = errors.New("competency not found")
	ErrCompetencyCodeExists = errors.New("competency code already exists")
	ErrQuestionNotFound     = errors.New("question not found")
	ErrQuestionTypeNotFound = errors.New("question type not found")
)

// Evaluation errors.
var (
	ErrEvaluationNotFound  = errors.New("evaluation not found")
	ErrAttemptNotCompleted = errors.New("attempt is not completed yet")
)

// Recommendation and Learning errors.
var (
	ErrRecommendationNotFound = errors.New("recommendation not found")
	ErrModuleNotFound         = errors.New("learning module not found")
	ErrMaterialNotFound       = errors.New("material not found")
)

// Content errors (News, Documentation, Testimonials).
var (
	ErrNewsNotFound            = errors.New("news article not found")
	ErrNewsSlugExists          = errors.New("news article slug already exists")
	ErrDocumentationNotFound   = errors.New("documentation article not found")
	ErrDocumentationSlugExists = errors.New("documentation slug already exists")
	ErrTestimonialNotFound     = errors.New("testimonial not found")
	ErrCannotChangeOwnRole     = errors.New("you cannot change your own role")
)

// Notification errors.
var (
	ErrNotificationNotFound = errors.New("notification not found")
)

// School errors.
var (
	ErrSchoolNotFound   = errors.New("school not found")
	ErrSchoolNPSNExists = errors.New("school NPSN already registered")
)
