package middleware

import (
	"errors"

	"github.com/gofiber/fiber/v2"

	"simantikApi/pkg/utils"
)

// APISecret guards every request behind a shared secret passed in the
// "X-API-SECRET" header, suitable for service-to-service or client-to-API
// authentication ahead of user-level auth.
func APISecret(secret string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		provided := c.Get("X-API-SECRET")

		if secret == "" || provided == "" || provided != secret {
			return utils.Error(c, fiber.StatusUnauthorized, "missing or invalid API secret", errors.New("unauthorized"))
		}

		return c.Next()
	}
}
