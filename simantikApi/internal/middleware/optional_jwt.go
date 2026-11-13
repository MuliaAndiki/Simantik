package middleware

import (
	"github.com/gofiber/fiber/v2"

	"simantikApi/pkg/utils"
)

// OptionalJWTAuth parses a Bearer token when present and populates user locals,
// allowing the request to continue anonymously when missing or invalid.
func OptionalJWTAuth(secret string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		tokenStr, err := utils.ExtractBearerToken(c.Get("Authorization"))
		if err != nil || tokenStr == "" {
			return c.Next()
		}
		claims, err := utils.ParseToken(secret, tokenStr)
		if err != nil {
			return c.Next()
		}
		c.Locals(LocalsUserID, claims.UserID)
		c.Locals(LocalsRole, claims.Role)
		c.Locals(LocalsClaims, claims)
		return c.Next()
	}
}
