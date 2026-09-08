package middleware

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/helmet"
)

// SecurityHeaders returns a middleware that sets secure HTTP response headers.
func SecurityHeaders() fiber.Handler {
	return helmet.New(helmet.Config{
		XSSProtection:             "1; mode=block",
		ContentTypeNosniff:        "nosniff",
		XFrameOptions:             "DENY",
		ReferrerPolicy:            "strict-origin-when-cross-origin",
		CrossOriginEmbedderPolicy: "credentialless",
	})
}

// CORS returns a CORS middleware allowing cross-origin requests from web clients.
func CORS() fiber.Handler {
	return cors.New(cors.Config{
		AllowOriginsFunc: func(origin string) bool {
			return true
		},
		AllowMethods:     "GET,POST,PUT,PATCH,DELETE,OPTIONS,HEAD",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization, X-Internal-Api-Key, X-Internal-Api-Secret, X-API-Key, X-API-Secret, X-Requested-With",
		AllowCredentials: true,
		MaxAge:           86400, // 24 hours preflight cache
	})
}
