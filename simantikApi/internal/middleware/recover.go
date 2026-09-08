package middleware

import (
	"fmt"
	"runtime/debug"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/recover"

	"simantikApi/pkg/utils"
)

// RecoverMiddleware handles panics gracefully and returns a standardized JSON 500 error envelope.
func RecoverMiddleware() fiber.Handler {
	return recover.New(recover.Config{
		EnableStackTrace: true,
		StackTraceHandler: func(c *fiber.Ctx, e interface{}) {
			fmt.Printf("PANIC RECOVERED: %v\n%s\n", e, string(debug.Stack()))
			_ = utils.Error(c, fiber.StatusInternalServerError, "an unexpected internal server error occurred", fmt.Errorf("%v", e))
		},
	})
}
