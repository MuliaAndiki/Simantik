package handler

import (
	"context"
	"fmt"
	"runtime"
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"simantikApi/config"
	"simantikApi/pkg/utils"
)

var serverStartTime = time.Now()

type SystemHandler struct {
	db  *gorm.DB
	cfg *config.Config
}

func NewSystemHandler(db *gorm.DB, cfg *config.Config) *SystemHandler {
	return &SystemHandler{
		db:  db,
		cfg: cfg,
	}
}

// Health handles GET /api/v1/health.
func (h *SystemHandler) Health(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(c.Context(), 3*time.Second)
	defer cancel()

	dbStatus := "healthy"
	isHealthy := true

	if h.db != nil {
		sqlDB, err := h.db.DB()
		if err != nil || sqlDB.PingContext(ctx) != nil {
			dbStatus = "unreachable"
			isHealthy = false
		}
	} else {
		dbStatus = "unconfigured"
	}

	var m runtime.MemStats
	runtime.ReadMemStats(&m)

	statusCode := fiber.StatusOK
	if !isHealthy {
		statusCode = fiber.StatusServiceUnavailable
	}

	return c.Status(statusCode).JSON(fiber.Map{
		"success": isHealthy,
		"status": func() string {
			if isHealthy {
				return "ok"
			}
			return "degraded"
		}(),
		"uptime":      time.Since(serverStartTime).String(),
		"environment": h.cfg.AppEnv,
		"timestamp":   time.Now().UTC().Format(time.RFC3339),
		"services": fiber.Map{
			"database": dbStatus,
		},
		"memory": fiber.Map{
			"alloc_mb":       fmt.Sprintf("%.2f MB", float64(m.Alloc)/(1024*1024)),
			"total_alloc_mb": fmt.Sprintf("%.2f MB", float64(m.TotalAlloc)/(1024*1024)),
			"sys_mb":         fmt.Sprintf("%.2f MB", float64(m.Sys)/(1024*1024)),
			"num_gc":         m.NumGC,
		},
	})
}

// SystemInfo handles GET /api/v1/system/info (admin-only).
func (h *SystemHandler) SystemInfo(c *fiber.Ctx) error {
	var poolStats fiber.Map
	if h.db != nil {
		if sqlDB, err := h.db.DB(); err == nil {
			stats := sqlDB.Stats()
			poolStats = fiber.Map{
				"max_open_connections": stats.MaxOpenConnections,
				"open_connections":     stats.OpenConnections,
				"in_use":               stats.InUse,
				"idle":                 stats.Idle,
				"wait_count":           stats.WaitCount,
				"wait_duration":        stats.WaitDuration.String(),
			}
		}
	}

	return utils.OK(c, "system info retrieved successfully", fiber.Map{
		"go_version":    runtime.Version(),
		"num_goroutine": runtime.NumGoroutine(),
		"num_cpu":       runtime.NumCPU(),
		"uptime":        time.Since(serverStartTime).String(),
		"started_at":    serverStartTime.UTC().Format(time.RFC3339),
		"database_pool": poolStats,
	})
}
