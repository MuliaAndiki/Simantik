package service

import (
	"context"
	"errors"
	"log"
	"strings"
	"time"

	"gorm.io/gorm"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
	"simantikApi/internal/repository"
	"simantikApi/pkg/utils"
)

// AuthService encapsulates authentication, session management, and password recovery.
type AuthService interface {
	Register(ctx context.Context, req dto.RegisterRequest) (*dto.RegisterResponse, error)
	VerifyRegisterOTP(ctx context.Context, req dto.VerifyRegisterOTPRequest, meta dto.RequestMeta) (*dto.AuthResponse, string, error)
	ResendRegisterOTP(ctx context.Context, req dto.ResendOTPRequest) error

	Login(ctx context.Context, req dto.LoginRequest, meta dto.RequestMeta) (*dto.AuthResponse, string, error)
	Refresh(ctx context.Context, rawRefreshToken string, meta dto.RequestMeta) (*dto.AuthResponse, string, error)
	Logout(ctx context.Context, rawRefreshToken string) error
	ForgotPassword(ctx context.Context, req dto.ForgotPasswordRequest) error
	VerifyOTP(ctx context.Context, req dto.VerifyOTPRequest) (*dto.VerifyOTPResponse, error)
	ResetPassword(ctx context.Context, req dto.ResetPasswordRequest) error
	LoginGoogle(ctx context.Context, req dto.GoogleLoginRequest, meta dto.RequestMeta) (*dto.AuthResponse, string, error)
}

type authService struct {
	db               *gorm.DB
	userRepo         repository.UserRepository
	refreshTokenRepo repository.RefreshTokenRepository
	otpRepo          repository.OTPRepository
	resetTokenRepo   repository.PasswordResetTokenRepository
	extAccountRepo   repository.ExternalAccountRepository
	profileRepo      repository.StudentProfileRepository
	emailSender      utils.EmailSender
	googleVerifier   utils.GoogleVerifier
	jwtSecret        string
	jwtAccessExpiry  time.Duration
	refreshExpiry    time.Duration
}

// NewAuthService constructs an AuthService with all dependencies injected.
func NewAuthService(
	db *gorm.DB,
	userRepo repository.UserRepository,
	refreshTokenRepo repository.RefreshTokenRepository,
	otpRepo repository.OTPRepository,
	resetTokenRepo repository.PasswordResetTokenRepository,
	extAccountRepo repository.ExternalAccountRepository,
	profileRepo repository.StudentProfileRepository,
	emailSender utils.EmailSender,
	googleVerifier utils.GoogleVerifier,
	jwtSecret string,
	jwtAccessExpiryMinutes int,
	refreshExpiryDays int,
) AuthService {
	return &authService{
		db:               db,
		userRepo:         userRepo,
		refreshTokenRepo: refreshTokenRepo,
		otpRepo:          otpRepo,
		resetTokenRepo:   resetTokenRepo,
		extAccountRepo:   extAccountRepo,
		profileRepo:      profileRepo,
		emailSender:      emailSender,
		googleVerifier:   googleVerifier,
		jwtSecret:        jwtSecret,
		jwtAccessExpiry:  time.Duration(jwtAccessExpiryMinutes) * time.Minute,
		refreshExpiry:    time.Duration(refreshExpiryDays) * 24 * time.Hour,
	}
}

func (s *authService) Register(ctx context.Context, req dto.RegisterRequest) (*dto.RegisterResponse, error) {
	email := normalizeEmail(req.Email)

	existing, err := s.userRepo.FindByEmail(ctx, email)
	if err != nil && !errors.Is(err, repository.ErrNotFound) {
		return nil, err
	}

	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	var user *models.User
	if existing != nil {
		if existing.Status == models.UserStatusActive {
			return nil, ErrEmailAlreadyExists
		}
		// User registered previously but has not completed OTP verification yet: update details
		existing.FullName = strings.TrimSpace(req.FullName)
		existing.PasswordHash = hashedPassword
		if err := s.userRepo.Update(ctx, existing); err != nil {
			return nil, err
		}
		user = existing
	} else {
		user = &models.User{
			FullName:     strings.TrimSpace(req.FullName),
			Email:        email,
			PasswordHash: hashedPassword,
			Role:         models.UserRoleStudent,
			Status:       models.UserStatusPending,
		}
		if err := s.userRepo.Create(ctx, user); err != nil {
			return nil, err
		}
	}

	// Invalidate any previous unverified register OTP for this user
	_ = s.otpRepo.InvalidatePrevious(ctx, user.ID, models.OTPPurposeRegister)

	// Generate 6-digit OTP
	code, codeHash, err := utils.GenerateOTP()
	if err != nil {
		return nil, err
	}

	otp := &models.OTPCode{
		UserID:      user.ID,
		Purpose:     models.OTPPurposeRegister,
		CodeHash:    codeHash,
		ExpiresAt:   time.Now().Add(10 * time.Minute),
		MaxAttempts: 5,
	}

	if err := s.otpRepo.Create(ctx, otp); err != nil {
		return nil, err
	}

	// Send OTP email via Resend
	if err := s.emailSender.SendRegistrationOTP(ctx, user.Email, code); err != nil {
		log.Printf("warning: failed to send registration OTP email via Resend: %v", err)
	}

	return &dto.RegisterResponse{
		Email:   user.Email,
		Message: "Kode OTP verifikasi pendaftaran telah dikirim ke email Anda. Silakan verifikasi untuk mengaktifkan akun.",
	}, nil
}

func (s *authService) VerifyRegisterOTP(ctx context.Context, req dto.VerifyRegisterOTPRequest, meta dto.RequestMeta) (*dto.AuthResponse, string, error) {
	email := normalizeEmail(req.Email)

	user, err := s.userRepo.FindByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, "", ErrInvalidOTP
		}
		return nil, "", err
	}

	if user.Status == models.UserStatusActive {
		return nil, "", ErrAccountAlreadyVerified
	}

	otp, err := s.otpRepo.FindLatestValid(ctx, user.ID, models.OTPPurposeRegister)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, "", ErrInvalidOTP
		}
		return nil, "", err
	}

	if otp.IsExhausted() {
		return nil, "", ErrOTPMaxAttempts
	}

	_ = s.otpRepo.IncrementAttempts(ctx, otp.ID)

	if !utils.CompareOTP(otp.CodeHash, req.OTP) {
		return nil, "", ErrInvalidOTP
	}

	// Mark OTP as verified
	_ = s.otpRepo.MarkVerified(ctx, otp.ID)

	// Activate user account
	user.Status = models.UserStatusActive
	if err := s.userRepo.Update(ctx, user); err != nil {
		return nil, "", err
	}

	// Issue tokens
	accessToken, rawRefreshToken, err := s.issueTokens(ctx, user, meta)
	if err != nil {
		return nil, "", err
	}

	_ = s.userRepo.UpdateLastLogin(ctx, user.ID)

	res := &dto.AuthResponse{
		User:         ToUserResponse(user),
		AccessToken:  accessToken,
		RefreshToken: rawRefreshToken,
	}
	s.applyHasSchool(ctx, user, res)
	return res, rawRefreshToken, nil
}

func (s *authService) ResendRegisterOTP(ctx context.Context, req dto.ResendOTPRequest) error {
	email := normalizeEmail(req.Email)

	user, err := s.userRepo.FindByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil // Anti-enumeration
		}
		return err
	}

	if user.Status != models.UserStatusPending {
		return nil
	}

	_ = s.otpRepo.InvalidatePrevious(ctx, user.ID, models.OTPPurposeRegister)

	code, codeHash, err := utils.GenerateOTP()
	if err != nil {
		return err
	}

	otp := &models.OTPCode{
		UserID:      user.ID,
		Purpose:     models.OTPPurposeRegister,
		CodeHash:    codeHash,
		ExpiresAt:   time.Now().Add(10 * time.Minute),
		MaxAttempts: 5,
	}

	if err := s.otpRepo.Create(ctx, otp); err != nil {
		return err
	}

	return s.emailSender.SendRegistrationOTP(ctx, user.Email, code)
}

func (s *authService) Login(ctx context.Context, req dto.LoginRequest, meta dto.RequestMeta) (*dto.AuthResponse, string, error) {
	email := normalizeEmail(req.Email)

	user, err := s.userRepo.FindByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, "", ErrInvalidCredentials
		}
		return nil, "", err
	}

	// Verify account status
	if user.Status == models.UserStatusPending {
		return nil, "", ErrAccountPending
	}
	if user.Status == models.UserStatusSuspended {
		return nil, "", ErrAccountSuspended
	}
	if user.Status != models.UserStatusActive {
		return nil, "", ErrAccountInactive
	}

	if user.PasswordHash == "" {
		return nil, "", ErrGoogleOnlyAccount
	}

	if err := utils.ComparePassword(user.PasswordHash, req.Password); err != nil {
		return nil, "", ErrInvalidCredentials
	}

	accessToken, rawRefreshToken, err := s.issueTokens(ctx, user, meta)
	if err != nil {
		return nil, "", err
	}

	_ = s.userRepo.UpdateLastLogin(ctx, user.ID)

	res := &dto.AuthResponse{
		User:         ToUserResponse(user),
		AccessToken:  accessToken,
		RefreshToken: rawRefreshToken,
	}
	s.applyHasSchool(ctx, user, res)
	return res, rawRefreshToken, nil
}

func (s *authService) Refresh(ctx context.Context, rawRefreshToken string, meta dto.RequestMeta) (*dto.AuthResponse, string, error) {
	if rawRefreshToken == "" {
		return nil, "", ErrInvalidRefreshToken
	}

	tokenHash := utils.HashSHA256(rawRefreshToken)
	session, err := s.refreshTokenRepo.FindByTokenHash(ctx, tokenHash)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, "", ErrInvalidRefreshToken
		}
		return nil, "", err
	}

	if !session.IsValid() {
		return nil, "", ErrInvalidRefreshToken
	}

	user, err := s.userRepo.FindByID(ctx, session.UserID)
	if err != nil {
		return nil, "", ErrInvalidRefreshToken
	}

	if user.Status != models.UserStatusActive {
		return nil, "", ErrAccountInactive
	}

	// Token rotation: Revoke old session
	if err := s.refreshTokenRepo.RevokeByID(ctx, session.ID); err != nil {
		return nil, "", err
	}

	// Issue new token pair
	newAccessToken, newRawRefreshToken, err := s.issueTokens(ctx, user, meta)
	if err != nil {
		return nil, "", err
	}

	return &dto.AuthResponse{
		User:         ToUserResponse(user),
		AccessToken:  newAccessToken,
		RefreshToken: newRawRefreshToken,
	}, newRawRefreshToken, nil
}

func (s *authService) Logout(ctx context.Context, rawRefreshToken string) error {
	if rawRefreshToken == "" {
		return nil
	}

	tokenHash := utils.HashSHA256(rawRefreshToken)
	session, err := s.refreshTokenRepo.FindByTokenHash(ctx, tokenHash)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil // Graceful exit if session already missing
		}
		return err
	}

	return s.refreshTokenRepo.RevokeByID(ctx, session.ID)
}

func (s *authService) ForgotPassword(ctx context.Context, req dto.ForgotPasswordRequest) error {
	email := normalizeEmail(req.Email)

	user, err := s.userRepo.FindByEmail(ctx, email)
	if err != nil {
		// Anti-enumeration: return success even if user not found
		if errors.Is(err, repository.ErrNotFound) {
			return nil
		}
		return err
	}

	// Do not proceed if user account is not active
	if user.Status != models.UserStatusActive {
		return nil
	}

	// Invalidate any previous pending OTP for this user
	_ = s.otpRepo.InvalidatePrevious(ctx, user.ID, models.OTPPurposePasswordReset)

	// Generate 6-digit OTP
	code, codeHash, err := utils.GenerateOTP()
	if err != nil {
		return err
	}

	otp := &models.OTPCode{
		UserID:      user.ID,
		Purpose:     models.OTPPurposePasswordReset,
		CodeHash:    codeHash,
		ExpiresAt:   time.Now().Add(10 * time.Minute),
		MaxAttempts: 5,
	}

	if err := s.otpRepo.Create(ctx, otp); err != nil {
		return err
	}

	// Send OTP via Resend
	if err := s.emailSender.SendPasswordResetOTP(ctx, user.Email, code); err != nil {
		log.Printf("warning: failed to send password reset OTP email via Resend: %v", err)
	}

	return nil
}

func (s *authService) VerifyOTP(ctx context.Context, req dto.VerifyOTPRequest) (*dto.VerifyOTPResponse, error) {
	email := normalizeEmail(req.Email)

	user, err := s.userRepo.FindByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, ErrInvalidOTP
		}
		return nil, err
	}

	otp, err := s.otpRepo.FindLatestValid(ctx, user.ID, models.OTPPurposePasswordReset)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, ErrInvalidOTP
		}
		return nil, err
	}

	if otp.IsExhausted() {
		return nil, ErrOTPMaxAttempts
	}

	// Count this attempt
	_ = s.otpRepo.IncrementAttempts(ctx, otp.ID)

	if !utils.CompareOTP(otp.CodeHash, req.OTP) {
		return nil, ErrInvalidOTP
	}

	// Mark OTP as verified
	_ = s.otpRepo.MarkVerified(ctx, otp.ID)

	// Invalidate prior reset tokens for user
	_ = s.resetTokenRepo.InvalidateAllForUser(ctx, user.ID)

	// Generate single-use password reset authorization token
	rawResetToken, err := utils.GenerateRandomHex(32)
	if err != nil {
		return nil, err
	}

	resetRecord := &models.PasswordResetToken{
		UserID:    user.ID,
		TokenHash: utils.HashSHA256(rawResetToken),
		ExpiresAt: time.Now().Add(15 * time.Minute),
	}

	if err := s.resetTokenRepo.Create(ctx, resetRecord); err != nil {
		return nil, err
	}

	return &dto.VerifyOTPResponse{
		ResetToken: rawResetToken,
		Message:    "OTP verified successfully",
	}, nil
}

func (s *authService) ResetPassword(ctx context.Context, req dto.ResetPasswordRequest) error {
	tokenHash := utils.HashSHA256(req.ResetToken)

	tokenRecord, err := s.resetTokenRepo.FindByTokenHash(ctx, tokenHash)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return ErrInvalidResetToken
		}
		return err
	}

	if !tokenRecord.IsValid() {
		return ErrInvalidResetToken
	}

	user, err := s.userRepo.FindByID(ctx, tokenRecord.UserID)
	if err != nil {
		return err
	}

	// Check if new password is same as current password (if user had one)
	if user.PasswordHash != "" && utils.ComparePassword(user.PasswordHash, req.NewPassword) == nil {
		return ErrSamePassword
	}

	newHash, err := utils.HashPassword(req.NewPassword)
	if err != nil {
		return err
	}

	// Transaction: update password + mark reset token used + revoke all active sessions
	if s.db != nil {
		err = s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
			user.PasswordHash = newHash
			if err := tx.Save(user).Error; err != nil {
				return err
			}

			now := time.Now()
			if err := tx.Model(&models.PasswordResetToken{}).
				Where("id = ?", tokenRecord.ID).
				Update("used_at", now).Error; err != nil {
				return err
			}

			// Revoke all existing login sessions for security
			if err := tx.Model(&models.RefreshToken{}).
				Where("user_id = ? AND revoked_at IS NULL", user.ID).
				Update("revoked_at", now).Error; err != nil {
				return err
			}

			return nil
		})
	} else {
		user.PasswordHash = newHash
		if err := s.userRepo.Update(ctx, user); err != nil {
			return err
		}
		if err := s.resetTokenRepo.MarkUsed(ctx, tokenRecord.ID); err != nil {
			return err
		}
		if err := s.refreshTokenRepo.RevokeAllByUserID(ctx, user.ID); err != nil {
			return err
		}
	}

	if err != nil {
		return err
	}

	// Notify user of successful password reset via Resend
	_ = s.emailSender.SendPasswordResetConfirmation(ctx, user.Email)

	return nil
}

func (s *authService) LoginGoogle(ctx context.Context, req dto.GoogleLoginRequest, meta dto.RequestMeta) (*dto.AuthResponse, string, error) {
	claims, err := s.googleVerifier.Verify(ctx, req.IDToken)
	if err != nil {
		return nil, "", ErrInvalidGoogleToken
	}

	email := normalizeEmail(claims.Email)

	var user *models.User

	// Check if this Google identity is already linked
	extAccount, err := s.extAccountRepo.FindByProviderAndUserID(ctx, "google", claims.Sub)
	if err != nil && !errors.Is(err, repository.ErrNotFound) {
		return nil, "", err
	}

	if extAccount != nil {
		// Existing linked account
		user, err = s.userRepo.FindByID(ctx, extAccount.UserID)
		if err != nil {
			return nil, "", err
		}
	} else {
		// Check if user already exists with this email
		existingUser, err := s.userRepo.FindByEmail(ctx, email)
		if err != nil && !errors.Is(err, repository.ErrNotFound) {
			return nil, "", err
		}

		if existingUser != nil {
			// Link existing user to Google
			user = existingUser
			newExt := &models.ExternalAccount{
				UserID:         user.ID,
				Provider:       "google",
				ProviderUserID: claims.Sub,
				Email:          email,
			}
			if err := s.extAccountRepo.Create(ctx, newExt); err != nil {
				return nil, "", err
			}
		} else {
			// Create new user + link external account atomically
			fullName := claims.Name
			if fullName == "" {
				fullName = strings.Split(email, "@")[0]
			}

			newUser := &models.User{
				FullName:     fullName,
				Email:        email,
				PasswordHash: "", // No password for OAuth-only users
				Role:         models.UserRoleStudent,
				Status:       models.UserStatusActive,
			}
			if claims.Picture != "" {
				newUser.AvatarURL = &claims.Picture
			}

			if s.db != nil {
				if err := s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
					if err := tx.Create(newUser).Error; err != nil {
						return err
					}

					newExt := &models.ExternalAccount{
						UserID:         newUser.ID,
						Provider:       "google",
						ProviderUserID: claims.Sub,
						Email:          email,
					}
					if err := tx.Create(newExt).Error; err != nil {
						return err
					}

					user = newUser
					return nil
				}); err != nil {
					return nil, "", err
				}
			} else {
				if err := s.userRepo.Create(ctx, newUser); err != nil {
					return nil, "", err
				}
				newExt := &models.ExternalAccount{
					UserID:         newUser.ID,
					Provider:       "google",
					ProviderUserID: claims.Sub,
					Email:          email,
				}
				if err := s.extAccountRepo.Create(ctx, newExt); err != nil {
					return nil, "", err
				}
				user = newUser
			}
		}
	}

	// Check user status
	if user.Status == models.UserStatusSuspended {
		return nil, "", ErrAccountSuspended
	}
	if user.Status != models.UserStatusActive {
		return nil, "", ErrAccountInactive
	}

	accessToken, rawRefreshToken, err := s.issueTokens(ctx, user, meta)
	if err != nil {
		return nil, "", err
	}
	_ = s.userRepo.UpdateLastLogin(ctx, user.ID)

	res := &dto.AuthResponse{
		User:         ToUserResponse(user),
		AccessToken:  accessToken,
		RefreshToken: rawRefreshToken,
	}
	s.applyHasSchool(ctx, user, res)
	return res, rawRefreshToken, nil
}

// issueTokens creates a short-lived access JWT and a long-lived hashed refresh token session.
func (s *authService) issueTokens(ctx context.Context, user *models.User, meta dto.RequestMeta) (accessToken, rawRefreshToken string, err error) {
	accessToken, err = utils.GenerateToken(
		s.jwtSecret,
		user.ID,
		string(user.Role),
		s.jwtAccessExpiry,
	)
	if err != nil {
		return "", "", err
	}

	rawRefreshToken, err = utils.GenerateRandomHex(32)
	if err != nil {
		return "", "", err
	}

	session := &models.RefreshToken{
		UserID:     user.ID,
		TokenHash:  utils.HashSHA256(rawRefreshToken),
		ExpiresAt:  time.Now().Add(s.refreshExpiry),
		UserAgent:  meta.UserAgent,
		IPAddress:  meta.IPAddress,
		LastUsedAt: nil,
	}

	if err := s.refreshTokenRepo.Create(ctx, session); err != nil {
		return "", "", err
	}

	return accessToken, rawRefreshToken, nil
}

func normalizeEmail(e string) string {
	return strings.ToLower(strings.TrimSpace(e))
}

// applyHasSchool flags whether the user (students) has picked a school,
// so the frontend can route them to school onboarding after login.
func (s *authService) applyHasSchool(ctx context.Context, user *models.User, res *dto.AuthResponse) {
	profile, err := s.profileRepo.FindByUserID(ctx, user.ID)
	if err == nil && profile != nil && profile.SchoolID != nil {
		res.User.HasSchool = true
	}
}
