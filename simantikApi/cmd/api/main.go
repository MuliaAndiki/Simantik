// Command api is the HTTP entry point for the SIMANTIK API service:
// it loads configuration, connects to PostgreSQL (Neon-ready), runs dev migrations,
// wires repositories, services, and handlers, and gracefully handles termination.
package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"simantikApi/config"
	"simantikApi/internal/handler"
	"simantikApi/internal/middleware"
	"simantikApi/internal/repository"
	"simantikApi/internal/routes"
	"simantikApi/internal/service"
	"simantikApi/pkg/telemetry"
	"simantikApi/pkg/utils"

	"github.com/gofiber/contrib/otelfiber/v2"
	"github.com/gofiber/fiber/v2"
)

func main() {
	cfg := config.Load()

	// ─── 0. OpenTelemetry Tracing ──────────────────────────────────────────────
	shutdownTracer, err := telemetry.InitTracer(context.Background(), telemetry.Config{
		Enabled:        cfg.OtelEnabled,
		ServiceName:    cfg.OtelServiceName,
		ServiceVersion: "1.0.0",
		Environment:    cfg.AppEnv,
		Endpoint:       cfg.OtelEndpoint,
		Insecure:       cfg.OtelInsecure,
	})
	if err != nil {
		log.Printf("warning: failed to initialize telemetry tracer: %v", err)
	} else {
		defer func() {
			shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
			defer cancel()
			if err := shutdownTracer(shutdownCtx); err != nil {
				log.Printf("telemetry shutdown error: %v", err)
			}
		}()
	}

	db, err := config.NewDatabase(cfg)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	if cfg.DBAutoMigrate {
		if cfg.AppEnv == "production" {
			log.Println("config: DB_AUTO_MIGRATE is ignored in production. Schema migrations must be run explicitly via cmd/migrate.")
		} else {
			log.Println("running dev auto-migration (disable DB_AUTO_MIGRATE in production)")
			if err := config.AutoMigrateDev(db, cfg.DBAutoMigrateForce); err != nil {
				log.Fatalf("auto-migration failed: %v", err)
			}
			if err := config.SeedInitialData(db); err != nil {
				log.Printf("warning: initial master data seeding failed: %v", err)
			}
		}
	}

	// ─── 1. Repositories ───────────────────────────────────────────────────────
	userRepo := repository.NewUserRepository(db)
	refreshTokenRepo := repository.NewRefreshTokenRepository(db)
	otpRepo := repository.NewOTPRepository(db)
	resetTokenRepo := repository.NewPasswordResetTokenRepository(db)
	extAccountRepo := repository.NewExternalAccountRepository(db)
	schoolRepo := repository.NewSchoolRepository(db)
	profileRepo := repository.NewStudentProfileRepository(db)

	competencyRepo := repository.NewCompetencyRepository(db)
	questionRepo := repository.NewQuestionRepository(db)

	tryoutRepo := repository.NewTryoutRepository(db)
	attemptRepo := repository.NewTryoutAttemptRepository(db)
	evaluationRepo := repository.NewEvaluationRepository(db)
	moduleRepo := repository.NewLearningModuleRepository(db)
	materialRepo := repository.NewMaterialRepository(db)
	progressRepo := repository.NewLearningProgressRepository(db)
	recommendationRepo := repository.NewRecommendationRepository(db)
	adminRepo := repository.NewAdminRepository(db)
	newsRepo := repository.NewNewsRepository(db)
	docRepo := repository.NewDocumentationRepository(db)
	testRepo := repository.NewTestimonialRepository(db)
	notifRepo := repository.NewNotificationRepository(db)
	reportingRepo := repository.NewReportingRepository(db)
	practiceRepo := repository.NewPracticeRepository(db)

	// ─── 2. External Service Abstractions ─────────────────────────────────────
	emailSender := utils.NewEmailSender(utils.ResendConfig{
		APIKey: cfg.ResendAPIKey,
		From:   cfg.ResendFromEmail,
	})
	googleVerifier := utils.NewGoogleVerifier(cfg.GoogleClientID)

	// ─── 3. Business Services ──────────────────────────────────────────────────
	authService := service.NewAuthService(
		db,
		userRepo,
		refreshTokenRepo,
		otpRepo,
		resetTokenRepo,
		extAccountRepo,
		profileRepo,
		emailSender,
		googleVerifier,
		cfg.JWTSecret,
		cfg.JWTAccessExpiryMinutes,
		cfg.RefreshExpiryDays,
	)
	userService := service.NewUserService(userRepo, refreshTokenRepo, schoolRepo, profileRepo)
	jenjangResolver := service.NewJenjangResolver(profileRepo, schoolRepo)
	questionService := service.NewQuestionService(competencyRepo, questionRepo, db)
	tryoutService := service.NewTryoutService(tryoutRepo, questionRepo, jenjangResolver, questionService, db)
	attemptService := service.NewTryoutAttemptService(db, attemptRepo, tryoutRepo, emailSender, jenjangResolver)
	evaluationService := service.NewEvaluationService(evaluationRepo, attemptRepo, tryoutRepo, db)
	recommendationService := service.NewRecommendationService(recommendationRepo, evaluationRepo, materialRepo)
	learningService := service.NewLearningService(moduleRepo, materialRepo, progressRepo, jenjangResolver)
	adminService := service.NewAdminService(adminRepo)
	contentService := service.NewContentService(newsRepo, docRepo, testRepo)
	notificationService := service.NewNotificationService(notifRepo, emailSender)
	reportingService := service.NewReportingService(reportingRepo, recommendationService)
	schoolService := service.NewSchoolService(schoolRepo)
	practiceService := service.NewPracticeService(db, practiceRepo, questionRepo, evaluationRepo, jenjangResolver)

	// ─── 4. HTTP Handlers ──────────────────────────────────────────────────────
	authHandler := handler.NewAuthHandler(authService, cfg)
	userHandler := handler.NewUserHandler(userService)
	questionHandler := handler.NewQuestionHandler(questionService)
	tryoutHandler := handler.NewTryoutHandler(tryoutService)
	attemptHandler := handler.NewTryoutAttemptHandler(attemptService)
	evaluationHandler := handler.NewEvaluationHandler(evaluationService)
	recommendationHandler := handler.NewRecommendationHandler(recommendationService)
	learningHandler := handler.NewLearningHandler(learningService)
	adminHandler := handler.NewAdminHandler(adminService)
	contentHandler := handler.NewContentHandler(contentService)
	notificationHandler := handler.NewNotificationHandler(notificationService)
	reportingHandler := handler.NewReportingHandler(reportingService)
	schoolHandler := handler.NewSchoolHandler(schoolService)
	practiceHandler := handler.NewPracticeHandler(practiceService)
	systemHandler := handler.NewSystemHandler(db, cfg)

	// ─── 5. HTTP Router & Production Hardening ────────────────────────────────
	app := fiber.New(fiber.Config{
		AppName:      "simantik-backend-api",
		ErrorHandler: fiberErrorHandler,
	})

	// Observability, Security, CORS, Logger, Limiter, and Panic Recovery middlewares
	if cfg.OtelEnabled {
		app.Use(otelfiber.Middleware(
			otelfiber.WithNext(func(c *fiber.Ctx) bool {
				return c.Path() == "/health"
			}),
		))
	}
	app.Use(middleware.RecoverMiddleware())
	app.Use(middleware.SecurityHeaders())
	app.Use(middleware.CORS())
	app.Use(middleware.RequestLogger())
	app.Use(middleware.GeneralLimiter())

	routes.Register(app, cfg, &routes.Handlers{
		Auth:           authHandler,
		User:           userHandler,
		Question:       questionHandler,
		Tryout:         tryoutHandler,
		TryoutAttempt:  attemptHandler,
		Evaluation:     evaluationHandler,
		Recommendation: recommendationHandler,
		Learning:       learningHandler,
		Admin:          adminHandler,
		Content:        contentHandler,
		Notification:   notificationHandler,
		Reporting:      reportingHandler,
		School:         schoolHandler,
		Practice:       practiceHandler,
		System:         systemHandler,
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
