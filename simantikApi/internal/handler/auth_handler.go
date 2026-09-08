package handler

import (
	"errors"
	"time"

	"github.com/gofiber/fiber/v2"

	"simantikApi/config"
	"simantikApi/internal/dto"
	"simantikApi/internal/service"
	"simantikApi/pkg/utils"
)

const refreshTokenCookieName = "refreshToken"

// AuthHandler exposes HTTP endpoints for authentication, sessions, and recovery.
type AuthHandler struct {
	service service.AuthService
	cfg     *config.Config
}

// NewAuthHandler constructs an AuthHandler with its service and config dependencies.
func NewAuthHandler(s service.AuthService, cfg *config.Config) *AuthHandler {
	return &AuthHandler{service: s, cfg: cfg}
}

// Register handles POST /api/v1/auth/register.
func (h *AuthHandler) Register(c *fiber.Ctx) error {
	var req dto.RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if details := utils.ValidateStruct(req); details != nil {
		return utils.ValidationError(c, details)
	}

	res, err := h.service.Register(c.UserContext(), req)
	if err != nil {
		if errors.Is(err, service.ErrEmailAlreadyExists) {
			return utils.Error(c, fiber.StatusConflict, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to register user", err)
	}

	return utils.Created(c, res.Message, res)
}

// VerifyRegisterOTP handles POST /api/v1/auth/verifyRegisterOtp.
func (h *AuthHandler) VerifyRegisterOTP(c *fiber.Ctx) error {
	var req dto.VerifyRegisterOTPRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if details := utils.ValidateStruct(req); details != nil {
		return utils.ValidationError(c, details)
	}

	meta := extractRequestMeta(c)
	res, rawRefreshToken, err := h.service.VerifyRegisterOTP(c.UserContext(), req, meta)
	if err != nil {
		if errors.Is(err, service.ErrInvalidOTP) {
			return utils.Error(c, fiber.StatusBadRequest, err.Error(), err)
		}
		if errors.Is(err, service.ErrOTPMaxAttempts) {
			return utils.Error(c, fiber.StatusTooManyRequests, err.Error(), err)
		}
		if errors.Is(err, service.ErrAccountAlreadyVerified) {
			return utils.Error(c, fiber.StatusBadRequest, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to verify registration OTP", err)
	}

	h.setRefreshTokenCookie(c, rawRefreshToken)
	return utils.Success(c, "registration verified successfully", res)
}

// ResendRegisterOTP handles POST /api/v1/auth/resendRegisterOtp.
func (h *AuthHandler) ResendRegisterOTP(c *fiber.Ctx) error {
	var req dto.ResendOTPRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if details := utils.ValidateStruct(req); details != nil {
		return utils.ValidationError(c, details)
	}

	if err := h.service.ResendRegisterOTP(c.UserContext(), req); err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to resend registration OTP", err)
	}

	return utils.Success(c, "verification OTP resent successfully", nil)
}

// Login handles POST /api/v1/auth/login.
func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var req dto.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if details := utils.ValidateStruct(req); details != nil {
		return utils.ValidationError(c, details)
	}

	meta := extractRequestMeta(c)
	res, rawRefreshToken, err := h.service.Login(c.UserContext(), req, meta)
	if err != nil {
		if errors.Is(err, service.ErrInvalidCredentials) {
			return utils.Error(c, fiber.StatusUnauthorized, err.Error(), err)
		}
		if errors.Is(err, service.ErrAccountPending) {
			return utils.Error(c, fiber.StatusForbidden, err.Error(), err)
		}
		if errors.Is(err, service.ErrAccountSuspended) || errors.Is(err, service.ErrAccountInactive) {
			return utils.Error(c, fiber.StatusForbidden, err.Error(), err)
		}
		if errors.Is(err, service.ErrGoogleOnlyAccount) {
			return utils.Error(c, fiber.StatusBadRequest, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to login", err)
	}

	h.setRefreshTokenCookie(c, rawRefreshToken)
	return utils.Success(c, "login successful", res)
}

// Refresh handles POST /api/v1/auth/refresh.
// Reads the refresh token from httpOnly cookie (fallback to JSON body).
func (h *AuthHandler) Refresh(c *fiber.Ctx) error {
	rawToken := c.Cookies(refreshTokenCookieName)
	if rawToken == "" {
		var req dto.RefreshRequest
		_ = c.BodyParser(&req)
		rawToken = req.RefreshToken
	}

	if rawToken == "" {
		return utils.Error(c, fiber.StatusUnauthorized, "missing refresh token", errors.New("refresh token required"))
	}

	meta := extractRequestMeta(c)
	res, newRawRefreshToken, err := h.service.Refresh(c.UserContext(), rawToken, meta)
	if err != nil {
		h.clearRefreshTokenCookie(c)
		if errors.Is(err, service.ErrInvalidRefreshToken) {
			return utils.Error(c, fiber.StatusUnauthorized, err.Error(), err)
		}
		if errors.Is(err, service.ErrAccountInactive) {
			return utils.Error(c, fiber.StatusForbidden, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to refresh token", err)
	}

	h.setRefreshTokenCookie(c, newRawRefreshToken)
	return utils.Success(c, "token refreshed successfully", res)
}

// Logout handles POST /api/v1/auth/logout.
func (h *AuthHandler) Logout(c *fiber.Ctx) error {
	rawToken := c.Cookies(refreshTokenCookieName)
	if rawToken == "" {
		var req dto.LogoutRequest
		_ = c.BodyParser(&req)
		rawToken = req.RefreshToken
	}

	_ = h.service.Logout(c.UserContext(), rawToken)
	h.clearRefreshTokenCookie(c)

	return utils.Success(c, "logout successful", nil)
}

// ForgotPassword handles POST /api/v1/auth/forgotPassword.
func (h *AuthHandler) ForgotPassword(c *fiber.Ctx) error {
	var req dto.ForgotPasswordRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if details := utils.ValidateStruct(req); details != nil {
		return utils.ValidationError(c, details)
	}

	if err := h.service.ForgotPassword(c.UserContext(), req); err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to process request", err)
	}

	// Always return success to prevent email enumeration
	return utils.Success(c, "if your email is registered, you will receive an OTP shortly", nil)
}

// VerifyOTP handles POST /api/v1/auth/verifyOtp.
func (h *AuthHandler) VerifyOTP(c *fiber.Ctx) error {
	var req dto.VerifyOTPRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if details := utils.ValidateStruct(req); details != nil {
		return utils.ValidationError(c, details)
	}

	res, err := h.service.VerifyOTP(c.UserContext(), req)
	if err != nil {
		if errors.Is(err, service.ErrInvalidOTP) {
			return utils.Error(c, fiber.StatusBadRequest, err.Error(), err)
		}
		if errors.Is(err, service.ErrOTPMaxAttempts) {
			return utils.Error(c, fiber.StatusTooManyRequests, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to verify OTP", err)
	}

	return utils.Success(c, "OTP verified successfully", res)
}

// ResetPassword handles POST /api/v1/auth/resetPassword.
func (h *AuthHandler) ResetPassword(c *fiber.Ctx) error {
	var req dto.ResetPasswordRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if details := utils.ValidateStruct(req); details != nil {
		return utils.ValidationError(c, details)
	}

	if err := h.service.ResetPassword(c.UserContext(), req); err != nil {
		if errors.Is(err, service.ErrInvalidResetToken) {
			return utils.Error(c, fiber.StatusBadRequest, err.Error(), err)
		}
		if errors.Is(err, service.ErrSamePassword) {
			return utils.Error(c, fiber.StatusBadRequest, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to reset password", err)
	}

	return utils.Success(c, "password has been reset successfully, please log in with your new password", nil)
}

// LoginGoogle handles POST /api/v1/auth/loginGoogle.
func (h *AuthHandler) LoginGoogle(c *fiber.Ctx) error {
	var req dto.GoogleLoginRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if details := utils.ValidateStruct(req); details != nil {
		return utils.ValidationError(c, details)
	}

	meta := extractRequestMeta(c)
	res, rawRefreshToken, err := h.service.LoginGoogle(c.UserContext(), req, meta)
	if err != nil {
		if errors.Is(err, service.ErrInvalidGoogleToken) {
			return utils.Error(c, fiber.StatusUnauthorized, err.Error(), err)
		}
		if errors.Is(err, service.ErrAccountSuspended) || errors.Is(err, service.ErrAccountInactive) {
			return utils.Error(c, fiber.StatusForbidden, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to authenticate with Google", err)
	}

	h.setRefreshTokenCookie(c, rawRefreshToken)
	return utils.Success(c, "google login successful", res)
}

func (h *AuthHandler) setRefreshTokenCookie(c *fiber.Ctx, rawToken string) {
	c.Cookie(&fiber.Cookie{
		Name:     refreshTokenCookieName,
		Value:    rawToken,
		Expires:  time.Now().Add(time.Duration(h.cfg.RefreshExpiryDays) * 24 * time.Hour),
		HTTPOnly: true,
		Secure:   h.cfg.CookieSecure,
		SameSite: h.cfg.CookieSameSite,
		Path:     "/api/v1/auth",
	})
}

func (h *AuthHandler) clearRefreshTokenCookie(c *fiber.Ctx) {
	c.Cookie(&fiber.Cookie{
		Name:     refreshTokenCookieName,
		Value:    "",
		Expires:  time.Now().Add(-1 * time.Hour),
		HTTPOnly: true,
		Secure:   h.cfg.CookieSecure,
		SameSite: h.cfg.CookieSameSite,
		Path:     "/api/v1/auth",
	})
}

func extractRequestMeta(c *fiber.Ctx) dto.RequestMeta {
	return dto.RequestMeta{
		UserAgent: c.Get("User-Agent"),
		IPAddress: c.IP(),
	}
}
