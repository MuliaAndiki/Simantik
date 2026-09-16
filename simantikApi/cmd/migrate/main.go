package main

import (
	"flag"
	"fmt"
	"log"
	"os"

	"simantikApi/config"
	"simantikApi/internal/database"
	"simantikApi/internal/models"
)

func main() {
	var (
		inspectOnly       bool
		confirmProduction bool
		force             bool
	)

	flag.BoolVar(&inspectOnly, "inspect", false, "Only inspect schema differences without applying changes (dry run)")
	flag.BoolVar(&inspectOnly, "dry-run", false, "Alias for -inspect")
	flag.BoolVar(&confirmProduction, "confirm-production", false, "Confirm running migration against a production database")
	flag.BoolVar(&force, "force", false, "Force migration execution in production environment")
	flag.Parse()

	action := flag.Arg(0)
	if action == "inspect" || action == "dry-run" {
		inspectOnly = true
	}

	// 1. Load configuration and initialize GORM database connection
	cfg := config.Load()
	if cfg.DSN() == "" {
		log.Fatal("[ERROR] Database connection string is missing in configuration")
	}

	// 2. Production safety guard
	if cfg.AppEnv == "production" && !confirmProduction && !force {
		fmt.Fprintf(os.Stderr, "\n[ERROR] Target database environment is 'production'.\n"+
			"Running AutoMigrate in production requires explicit confirmation.\n"+
			"Pass '-confirm-production' or '-force' to proceed:\n\n"+
			"    go run cmd/migrate/main.go -confirm-production\n\n")
		os.Exit(1)
	}

	db, err := config.NewDatabase(cfg)
	if err != nil {
		log.Fatalf("[ERROR] Failed to connect to database: %v", err)
	}

	allModels := models.AllModels()

	// 3. Banner
	fmt.Println("========================================")
	fmt.Println("      SIMANTIK DATABASE MIGRATION       ")
	fmt.Println("========================================")
	fmt.Printf("Environment : %s\n", cfg.AppEnv)
	fmt.Printf("Database    : PostgreSQL (Neon)\n")
	fmt.Printf("Models      : %d registered\n\n", len(allModels))

	// 4. Initialize SafeMigrator
	migrator := database.NewSafeMigrator(db, allModels)

	// 5. Inspect database schema
	report, err := migrator.Inspect()
	if err != nil {
		log.Fatalf("[ERROR] Schema inspection failed: %v", err)
	}

	migrator.PrintInspection(report)

	if inspectOnly {
		fmt.Println("\n[INFO] Dry-run / inspection complete. No changes were applied.")
		return
	}

	// 6. Execute Safe Migration
	result, err := migrator.Migrate(report)
	if err != nil {
		log.Fatalf("\n[ERROR] Migration failed: %v", err)
	}

	// 7. Output summary
	migrator.PrintSummary(result)
}
