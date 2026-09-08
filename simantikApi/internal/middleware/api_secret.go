package middleware

import (
	"errors"
	"strings"

	"github.com/gofiber/fiber/v2"

	"simantikApi/pkg/utils"
)

// APISecret guards requests behind a shared secret key.
// It checks standard internal API key/secret header conventions:
// - X-Internal-Api-Key / X-internal-api-key
// - X-Internal-Api-Secret / X-internal-api-secret
// - X-API-Key / x-api-key
// - X-API-Secret / x-api-secret
func APISecret(secret string) fiber.Handler {
	secret = strings.TrimSpace(secret)

	return func(c *fiber.Ctx) error {

		if secret == "" {
			return c.Next()
		}

		provided := c.Get("X-Internal-Api-Key")
		if provided == "" {
			provided = c.Get("X-Internal-Api-Secret")
		}
		if provided == "" {
			provided = c.Get("X-API-Key")
		}
		if provided == "" {
			provided = c.Get("X-API-Secret")
		}

		provided = strings.TrimSpace(provided)

		if provided == "" || provided != secret {
			return utils.Error(c, fiber.StatusUnauthorized, "missing or invalid API secret", errors.New("unauthorized"))
		}

		return c.Next()
	}
}
