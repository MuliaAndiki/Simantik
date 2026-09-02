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

	"simantikApi/internal/models"
)

// Config holds every environment-driven setting the application needs.
type Config struct {
	AppEnv  string
	AppPort string

	APISecret      string
	JWTSecret      string
	JWTExpiryHours int

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

	DBAutoMigrate bool
}

// Load reads a local .env file (if present) and populates Config from the
// process environment, applying sane defaults for local development.
func Load() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("config: no .env file found, relying on process environment")
	}

	return &Config{
		AppEnv:  getEnv("APP_ENV", "development"),
		AppPort: getEnv("APP_PORT", "8080"),

		APISecret:      getEnv("API_SECRET", ""),
		JWTSecret:      getEnv("JWT_SECRET", ""),
		JWTExpiryHours: getEnvInt("JWT_EXPIRY_HOURS", 24),

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

		DBAutoMigrate: getEnvBool("DB_AUTO_MIGRATE", true),
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
// sql.DB connection pool for Neon's serverless connection pooler, which
// works best with a modest number of long-lived connections that recycle
// periodically.
func NewDatabase(cfg *Config) (*gorm.DB, error) {
	gormLogLevel := logger.Warn
	if cfg.AppEnv == "development" {
		gormLogLevel = logger.Info
	}

	db, err := gorm.Open(postgres.Open(cfg.DSN()), &gorm.Config{
		Logger: logger.Default.LogMode(gormLogLevel),
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

	return db, nil
}

// AutoMigrateDev runs GORM's schema auto-migration for development
// convenience only. Production deployments should disable DB_AUTO_MIGRATE
// and manage schema changes with versioned SQL migrations under
// /migrations, applied via golang-migrate.
func AutoMigrateDev(db *gorm.DB) error {
	return db.AutoMigrate(&models.User{})
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
