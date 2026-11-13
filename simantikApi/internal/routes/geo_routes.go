package routes

import (
	"github.com/gofiber/fiber/v2"

	"simantikApi/config"
	"simantikApi/internal/handler"
	"simantikApi/internal/middleware"
)

func RegisterGeoRoutes(api fiber.Router, cfg *config.Config, h *handler.GeoHandler) {
	auth := middleware.JWTAuth(cfg.JWTSecret)

	geo := api.Group("/geo", auth)
	geo.Get("/schools/search", h.SearchSchools)
	geo.Get("/reverse", h.Reverse)
}
