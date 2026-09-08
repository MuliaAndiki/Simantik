package middleware_test

import (
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"

	"simantikApi/internal/middleware"
)

func TestAPISecretMiddleware(t *testing.T) {
	secret := "my-super-secret-key"

	tests := []struct {
		name           string
		headerKey      string
		headerVal      string
		expectedStatus int
	}{
		{
			name:           "Valid with X-Internal-Api-Key",
			headerKey:      "X-Internal-Api-Key",
			headerVal:      "my-super-secret-key",
			expectedStatus: http.StatusOK,
		},
		{
			name:           "Valid with lowercase x-internal-api-key",
			headerKey:      "x-internal-api-key",
			headerVal:      "my-super-secret-key",
			expectedStatus: http.StatusOK,
		},
		{
			name:           "Valid with X-Internal-Api-Secret",
			headerKey:      "X-Internal-Api-Secret",
			headerVal:      "my-super-secret-key",
			expectedStatus: http.StatusOK,
		},
		{
			name:           "Valid with X-API-Key",
			headerKey:      "X-API-Key",
			headerVal:      "my-super-secret-key",
			expectedStatus: http.StatusOK,
		},
		{
			name:           "Valid with X-API-Secret",
			headerKey:      "X-API-Secret",
			headerVal:      "my-super-secret-key",
			expectedStatus: http.StatusOK,
		},
		{
			name:           "Invalid secret value",
			headerKey:      "X-Internal-Api-Key",
			headerVal:      "wrong-secret",
			expectedStatus: http.StatusUnauthorized,
		},
		{
			name:           "Missing header",
			headerKey:      "",
			headerVal:      "",
			expectedStatus: http.StatusUnauthorized,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			app := fiber.New()
			app.Use(middleware.APISecret(secret))
			app.Get("/test", func(c *fiber.Ctx) error {
				return c.SendString("ok")
			})

			req := httptest.NewRequest(http.MethodGet, "/test", nil)
			if tt.headerKey != "" {
				req.Header.Set(tt.headerKey, tt.headerVal)
			}

			resp, err := app.Test(req)
			if err != nil {
				t.Fatalf("request failed: %v", err)
			}
			defer resp.Body.Close()

			if resp.StatusCode != tt.expectedStatus {
				body, _ := io.ReadAll(resp.Body)
				t.Errorf("expected status %d, got %d, body: %s", tt.expectedStatus, resp.StatusCode, string(body))
			}
		})
	}
}
