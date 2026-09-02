package middleware

import (
	"errors"

	"github.com/gofiber/fiber/v2"

	"simantikApi/pkg/utils"
)

// RequireRoles is a middleware factory that only allows the request through
// when the role stored in c.Locals (populated by JWTAuth) matches one of the
// allowed roles. It must be mounted after JWTAuth.
func RequireRoles(allowedRoles ...string) fiber.Handler {
	allowed := make(map[string]struct{}, len(allowedRoles))
	for _, r := range allowedRoles {
		allowed[r] = struct{}{}
	}

	return func(c *fiber.Ctx) error {
		role, ok := c.Locals(LocalsRole).(string)
		if !ok || role == "" {
			return utils.Error(c, fiber.StatusForbidden, "access denied", errors.New("role not found in request context"))
		}

		if _, isAllowed := allowed[role]; !isAllowed {
			return utils.Error(c, fiber.StatusForbidden, "access denied", errors.New("insufficient role permissions"))
		}

		return c.Next()
	}
}
