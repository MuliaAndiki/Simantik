package middleware

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/limiter"

	"simantikApi/pkg/utils"
)

// AuthLimiter rate-limits authentication endpoints (login, OTP, password reset)
// to 15 requests per minute per IP to protect against brute-force attacks.
func AuthLimiter() fiber.Handler {
	return limiter.New(limiter.Config{
		Max:        15,
		Expiration: 1 * time.Minute,
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.IP()
		},
		LimitReached: func(c *fiber.Ctx) error {
			return utils.Error(c, fiber.StatusTooManyRequests, "too many authentication attempts, please try again in a minute", nil)
		},
	})
}

// GeneralLimiter rate-limits general public API requests to 120 requests per minute per IP.
func GeneralLimiter() fiber.Handler {
	return limiter.New(limiter.Config{
		Max:        120,
		Expiration: 1 * time.Minute,
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.IP()
		},
		LimitReached: func(c *fiber.Ctx) error {
			return utils.Error(c, fiber.StatusTooManyRequests, "rate limit exceeded, please slow down your requests", nil)
		},
	})
}
