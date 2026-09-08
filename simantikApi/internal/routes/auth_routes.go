package routes

import (
	"github.com/gofiber/fiber/v2"

	"simantikApi/config"
	"simantikApi/internal/handler"
	"simantikApi/internal/middleware"
)

// registerAuthRoutes registers all public and session auth endpoints under /api/v1/auth.
func registerAuthRoutes(router fiber.Router, cfg *config.Config, h *handler.AuthHandler) {
	auth := router.Group("/auth", middleware.AuthLimiter())

	auth.Post("/register", h.Register)
	auth.Post("/verifyRegisterOtp", h.VerifyRegisterOTP)
	auth.Post("/resendRegisterOtp", h.ResendRegisterOTP)
	auth.Post("/login", h.Login)
	auth.Post("/refresh", h.Refresh)
	auth.Post("/logout", h.Logout)
	auth.Post("/forgotPassword", h.ForgotPassword)
	auth.Post("/verifyOtp", h.VerifyOTP)
	auth.Post("/resetPassword", h.ResetPassword)
	auth.Post("/loginGoogle", h.LoginGoogle)
}
