package routes

import (
	"github.com/gofiber/fiber/v2"

	"simantikApi/config"
	"simantikApi/internal/handler"
	"simantikApi/internal/middleware"
)

// RegisterLearningRoutes mounts learning module, material, and progress endpoints.
func RegisterLearningRoutes(api fiber.Router, cfg *config.Config, lh *handler.LearningHandler) {
	auth := middleware.JWTAuth(cfg.JWTSecret)
	adminOrCM := middleware.RequireRoles("admin", "content_manager")
	

	// ─── Learning Modules ──────────────────────────────────────────────────────
	mod := api.Group("/learning-modules", auth)
	mod.Get("/", lh.ListModules)
	mod.Get("/labels", lh.ListModuleLabels)
	mod.Post("/", adminOrCM, lh.CreateModule)
	mod.Get("/:id", lh.GetModule)
	mod.Patch("/:id", adminOrCM, lh.UpdateModule)
	mod.Patch("/:id/status", adminOrCM, lh.UpdateModuleStatus)
	mod.Delete("/:id", adminOrCM, lh.DeleteModule)
	mod.Get("/:id/progress", lh.GetModuleProgress)

	// ─── Materials ─────────────────────────────────────────────────────────────
	mat := api.Group("/materials", auth)
	mat.Get("/", lh.ListMaterials)
	mat.Post("/", adminOrCM, lh.CreateMaterial)
	mat.Get("/:id", lh.GetMaterial)
	mat.Patch("/:id", adminOrCM, lh.UpdateMaterial)
	mat.Patch("/:id/status", adminOrCM, lh.UpdateMaterialStatus)
	mat.Delete("/:id", adminOrCM, lh.DeleteMaterial)
	mat.Post("/:id/progress", lh.MarkMaterialProgress)

	// ─── Progress ──────────────────────────────────────────────────────────────
	api.Get("/learning-progress", auth, lh.ListMyProgress)
}
