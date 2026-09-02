package middleware

import (
	"github.com/gofiber/fiber/v2"

	"simantikApi/pkg/utils"
)

// Context keys used to propagate authenticated request data via c.Locals.
const (
	LocalsUserID = "userID"
	LocalsRole   = "role"
	LocalsClaims = "claims"
)

// JWTAuth validates the "Authorization: Bearer <token>" header and, on
// success, stores the user ID and role in c.Locals for downstream
// middlewares/handlers.
func JWTAuth(secret string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		tokenString, err := utils.ExtractBearerToken(c.Get("Authorization"))
		if err != nil {
			return utils.Error(c, fiber.StatusUnauthorized, "authentication required", err)
		}

		claims, err := utils.ParseToken(secret, tokenString)
		if err != nil {
			return utils.Error(c, fiber.StatusUnauthorized, "invalid or expired token", err)
		}

		c.Locals(LocalsUserID, claims.UserID)
		c.Locals(LocalsRole, claims.Role)
		c.Locals(LocalsClaims, claims)

		return c.Next()
	}
}
