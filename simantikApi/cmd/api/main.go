// Command api is the HTTP entry point for the service: it loads
// configuration, connects to the database, wires dependencies, and serves
// requests until an interrupt/terminate signal triggers a graceful
// shutdown.
package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gofiber/fiber/v2"

	"simantikApi/config"
	"simantikApi/internal/handler"
	"simantikApi/internal/repository"
	"simantikApi/internal/routes"
	"simantikApi/internal/service"
)

func main() {
	cfg := config.Load()

	db, err := config.NewDatabase(cfg)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	if cfg.DBAutoMigrate {
		log.Println("running dev auto-migration (disable DB_AUTO_MIGRATE in production)")
		if err := config.AutoMigrateDev(db); err != nil {
			log.Fatalf("auto-migration failed: %v", err)
		}
	}

	// Dependency injection: repository -> service -> handler.
	userRepo := repository.NewUserRepository(db)
	userService := service.NewUserService(userRepo, cfg.JWTSecret, cfg.JWTExpiryHours)
	userHandler := handler.NewUserHandler(userService)

	app := fiber.New(fiber.Config{
		AppName:      "boilerpad-go-service",
		ErrorHandler: fiberErrorHandler,
	})

	routes.Register(app, cfg, &routes.Handlers{
		User: userHandler,
	})

	go func() {
		addr := ":" + cfg.AppPort
		log.Printf("listening on %s (env=%s)", addr, cfg.AppEnv)
		if err := app.Listen(addr); err != nil {
			log.Fatalf("server error: %v", err)
		}
	}()

	waitForShutdown(app)
}

// waitForShutdown blocks until SIGINT/SIGTERM is received, then gives
// in-flight requests up to 15 seconds to finish before forcing the process
// to exit.
func waitForShutdown(app *fiber.App) {
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("shutdown signal received, draining connections...")

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	if err := app.ShutdownWithContext(ctx); err != nil {
		log.Printf("graceful shutdown failed: %v", err)
		return
	}

	log.Println("shutdown complete")
}

func fiberErrorHandler(c *fiber.Ctx, err error) error {
	code := fiber.StatusInternalServerError
	if fiberErr, ok := err.(*fiber.Error); ok {
		code = fiberErr.Code
	}

	return c.Status(code).JSON(fiber.Map{
		"success": false,
		"message": "request failed",
		"data":    nil,
		"error":   err.Error(),
	})
}
