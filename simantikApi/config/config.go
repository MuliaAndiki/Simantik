// Package config centralizes environment configuration and the PostgreSQL
// (Neon-ready) database connection used across the service.
package config

import (
	"fmt"
	"log"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"gorm.io/plugin/opentelemetry/tracing"

	"simantikApi/internal/models"
)

// Config holds every environment-driven setting the application needs.
type Config struct {
	AppEnv  string
	AppPort string

	APISecret              string
	JWTSecret              string
	JWTAccessExpiryMinutes int
	RefreshExpiryDays      int

	CookieSecure   bool
	CookieSameSite string

	// Google OAuth / OIDC
	GoogleClientID     string
	GoogleClientSecret string
	GoogleRedirectURL  string

	// Resend Email API
	ResendAPIKey    string
	ResendFromEmail string

	DatabaseURL string
	DBHost      string
	DBPort      string
	DBUser      string
	DBPassword  string
	DBName      string
	DBSSLMode   string

	DBMaxOpenConns           int
	DBMaxIdleConns           int
	DBConnMaxLifetimeMinutes int
	DBConnMaxIdleTimeMinutes int

	DBAutoMigrate      bool
	DBAutoMigrateForce bool
	DBLogLevel         string

	// OpenTelemetry Tracing
	OtelEnabled     bool
	OtelServiceName string
	OtelEndpoint    string
	OtelInsecure    bool
}

// Load reads a local .env file (if present) and populates Config from the
// process environment, applying sane defaults for local development.
func Load() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("config: no .env file found, relying on process environment")
	}

	appEnv := getEnv("APP_ENV", "development")

	return &Config{
		AppEnv:  appEnv,
		AppPort: getEnv("APP_PORT", "8080"),

		APISecret:              getEnv("API_SECRET", ""),
		JWTSecret:              getEnv("JWT_SECRET", ""),
		JWTAccessExpiryMinutes: getEnvInt("JWT_ACCESS_EXPIRY_MINUTES", 15),
		RefreshExpiryDays:      getEnvInt("REFRESH_EXPIRY_DAYS", 7),

		CookieSecure:   getEnvBool("COOKIE_SECURE", appEnv == "production"),
		CookieSameSite: getEnv("COOKIE_SAMESITE", "Lax"),

		GoogleClientID:     getEnv("GOOGLE_CLIENT_ID", ""),
		GoogleClientSecret: getEnv("GOOGLE_CLIENT_SECRET", ""),
		GoogleRedirectURL:  getEnv("GOOGLE_REDIRECT_URL", ""),

		ResendAPIKey:    getEnv("RESEND_API_KEY", ""),
		ResendFromEmail: getEnv("RESEND_FROM_EMAIL", "SIMANTIK <onboarding@resend.dev>"),

		DatabaseURL: getEnv("DATABASE_URL", ""),
		DBHost:      getEnv("DB_HOST", "localhost"),
		DBPort:      getEnv("DB_PORT", "5432"),
		DBUser:      getEnv("DB_USER", "postgres"),
		DBPassword:  getEnv("DB_PASSWORD", "postgres"),
		DBName:      getEnv("DB_NAME", "boilerpad"),
		DBSSLMode:   getEnv("DB_SSLMODE", "require"),

		DBMaxOpenConns:           getEnvInt("DB_MAX_OPEN_CONNS", 10),
		DBMaxIdleConns:           getEnvInt("DB_MAX_IDLE_CONNS", 5),
		DBConnMaxLifetimeMinutes: getEnvInt("DB_CONN_MAX_LIFETIME_MINUTES", 30),
		DBConnMaxIdleTimeMinutes: getEnvInt("DB_CONN_MAX_IDLE_TIME_MINUTES", 5),

		DBAutoMigrate:      getEnvBool("DB_AUTO_MIGRATE", true),
		DBAutoMigrateForce: getEnvBool("DB_AUTO_MIGRATE_FORCE", false),
		DBLogLevel:         getEnv("DB_LOG_LEVEL", "warn"),

		OtelEnabled:     getEnvBool("OTEL_ENABLED", true),
		OtelServiceName: getEnv("OTEL_SERVICE_NAME", "simantik-api"),
		OtelEndpoint:    getEnv("OTEL_EXPORTER_OTLP_ENDPOINT", "jaeger:4317"),
		OtelInsecure:    getEnvBool("OTEL_INSECURE", true),
	}
}

// DSN builds the PostgreSQL connection string, preferring a full
// DATABASE_URL (as provided by Neon) and otherwise assembling one from the
// discrete DB_* parts. sslmode=require is enforced whenever a DATABASE_URL
// is used, since Neon rejects unencrypted connections.
func (c *Config) DSN() string {
	if c.DatabaseURL != "" {
		return ensureSSLRequire(c.DatabaseURL)
	}

	return fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		c.DBHost, c.DBPort, c.DBUser, c.DBPassword, c.DBName, c.DBSSLMode,
	)
}

// ensureSSLRequire guarantees the sslmode=require query parameter is present
// on a Postgres connection URL, which Neon mandates.
func ensureSSLRequire(rawURL string) string {
	parsed, err := url.Parse(rawURL)
	if err != nil {
		// Not a parseable URL (e.g. already a keyword/value DSN) — leave as-is.
		if !strings.Contains(rawURL, "sslmode=") {
			return rawURL + " sslmode=require"
		}
		return rawURL
	}

	query := parsed.Query()
	if query.Get("sslmode") == "" {
		query.Set("sslmode", "require")
		parsed.RawQuery = query.Encode()
	}
	return parsed.String()
}

// NewDatabase opens a GORM connection to PostgreSQL and tunes the underlying
// sql.DB connection pool for Neon's serverless connection pooler.
func NewDatabase(cfg *Config) (*gorm.DB, error) {
	var gormLogLevel logger.LogLevel
	switch strings.ToLower(cfg.DBLogLevel) {
	case "info":
		gormLogLevel = logger.Info
	case "silent":
		gormLogLevel = logger.Silent
	case "error":
		gormLogLevel = logger.Error
	default:
		gormLogLevel = logger.Warn
	}

	customLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags),
		logger.Config{
			SlowThreshold:             1 * time.Second, // 1s threshold for remote cloud databases (Neon)
			LogLevel:                  gormLogLevel,
			IgnoreRecordNotFoundError: true,
			Colorful:                  true,
		},
	)

	db, err := gorm.Open(postgres.Open(cfg.DSN()), &gorm.Config{
		Logger: customLogger,
	})
	if err != nil {
		return nil, fmt.Errorf("config: failed to connect to database: %w", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("config: failed to access underlying sql.DB: %w", err)
	}

	sqlDB.SetMaxOpenConns(cfg.DBMaxOpenConns)
	sqlDB.SetMaxIdleConns(cfg.DBMaxIdleConns)
	sqlDB.SetConnMaxLifetime(time.Duration(cfg.DBConnMaxLifetimeMinutes) * time.Minute)
	sqlDB.SetConnMaxIdleTime(time.Duration(cfg.DBConnMaxIdleTimeMinutes) * time.Minute)

	if cfg.OtelEnabled {
		if err := db.Use(tracing.NewPlugin()); err != nil {
			log.Printf("warning: failed to register gorm opentelemetry plugin: %v", err)
		}
	}

	return db, nil
}

// AutoMigrateDev runs GORM's schema auto-migration for all models.
// If core tables already exist, it skips running auto-migration to prevent hundreds of
// remote information_schema roundtrips. Set force=true (or DB_AUTO_MIGRATE_FORCE=true)
// to force schema re-synchronization.
func AutoMigrateDev(db *gorm.DB, force bool) error {
	if !force && db.Migrator().HasTable(&models.User{}) && db.Migrator().HasTable(&models.Tryout{}) {
		log.Println("config: database tables already exist, skipping dev auto-migration (set DB_AUTO_MIGRATE_FORCE=true to force)")
		return nil
	}

	log.Println("config: executing GORM auto-migration for all models...")
	return db.AutoMigrate(
		// Identity & Access
		&models.Role{},
		&models.Permission{},
		&models.RolePermission{},
		&models.User{},
		&models.RefreshToken{},
		&models.OTPCode{},
		&models.PasswordResetToken{},
		&models.ExternalAccount{},
		&models.StudentProfile{},

		// Competency
		&models.Competency{},

		// Learning System
		&models.LearningModule{},
		&models.Material{},
		&models.MaterialAttachment{},
		&models.LearningProgress{},

		// Question Bank
		&models.QuestionType{},
		&models.Question{},
		&models.QuestionOption{},
		&models.QuestionCompetency{},
		&models.QuestionExplanation{},

		// Tryout & Adaptive Engine
		&models.Tryout{},
		&models.TryoutQuestion{},
		&models.TryoutAttempt{},
		&models.AttemptQuestion{},
		&models.StudentAnswer{},

		// Practice System
		&models.Practice{},
		&models.PracticeAnswer{},

		// Evaluation & Recommendation
		&models.Evaluation{},
		&models.CompetencyEvaluation{},
		&models.Recommendation{},

		// CMS Content
		&models.News{},
		&models.Documentation{},
		&models.Testimonial{},

		// System & Audit
		&models.FileRecord{},
		&models.AuditLog{},
		&models.Notification{},
	)
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok && value != "" {
		return value
	}
	return fallback
}

func getEnvInt(key string, fallback int) int {
	value, ok := os.LookupEnv(key)
	if !ok || value == "" {
		return fallback
	}
	parsed, err := strconv.Atoi(value)
	if err != nil {
		log.Printf("config: invalid int for %s=%q, using default %d", key, value, fallback)
		return fallback
	}
	return parsed
}

func getEnvBool(key string, fallback bool) bool {
	value, ok := os.LookupEnv(key)
	if !ok || value == "" {
		return fallback
	}
	parsed, err := strconv.ParseBool(value)
	if err != nil {
		log.Printf("config: invalid bool for %s=%q, using default %t", key, value, fallback)
		return fallback
	}
	return parsed
}
