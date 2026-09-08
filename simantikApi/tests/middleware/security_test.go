package middleware_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"

	"simantikApi/internal/middleware"
)

func TestSecurityHeadersMiddleware(t *testing.T) {
	app := fiber.New()
	app.Use(middleware.SecurityHeaders())
	app.Get("/test", func(c *fiber.Ctx) error {
		return c.SendString("ok")
	})

	req := httptest.NewRequest(http.MethodGet, "/test", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("failed to execute request: %v", err)
	}

	if resp.Header.Get("X-Frame-Options") != "DENY" {
		t.Errorf("expected X-Frame-Options DENY, got %s", resp.Header.Get("X-Frame-Options"))
	}
	if resp.Header.Get("X-Content-Type-Options") != "nosniff" {
		t.Errorf("expected X-Content-Type-Options nosniff, got %s", resp.Header.Get("X-Content-Type-Options"))
	}
}

func TestCORSMiddleware(t *testing.T) {
	app := fiber.New()
	app.Use(middleware.CORS())
	app.Get("/test", func(c *fiber.Ctx) error {
		return c.SendString("ok")
	})

	req := httptest.NewRequest(http.MethodOptions, "/test", nil)
	req.Header.Set("Origin", "http://localhost:3000")
	req.Header.Set("Access-Control-Request-Method", "GET")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("failed to execute request: %v", err)
	}

	if resp.Header.Get("Access-Control-Allow-Origin") != "http://localhost:3000" {
		t.Errorf("expected Allow-Origin http://localhost:3000, got %s", resp.Header.Get("Access-Control-Allow-Origin"))
	}
}

func TestRecoverMiddleware(t *testing.T) {
	app := fiber.New()
	app.Use(middleware.RecoverMiddleware())
	app.Get("/panic", func(c *fiber.Ctx) error {
		panic("simulated fatal error")
	})

	req := httptest.NewRequest(http.MethodGet, "/panic", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("failed to execute request: %v", err)
	}

	if resp.StatusCode != http.StatusInternalServerError {
		t.Errorf("expected 500 Internal Server Error, got %d", resp.StatusCode)
	}
}
