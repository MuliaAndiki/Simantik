package main

import (
	"errors"
	"flag"
	"log"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"

	"simantikApi/config"
)

func main() {
	var step int
	flag.IntVar(&step, "step", 0, "Number of migration steps to apply (can be positive or negative)")
	flag.Parse()

	
	action := flag.Arg(0)
	if action == "" && step == 0 {
		log.Fatal("Usage: go run cmd/migrate/main.go [up|down|version|force <version>] OR -step <n>")
	}

	cfg := config.Load()
	if cfg.DatabaseURL == "" {
		log.Fatal("DATABASE_URL or equivalent connection string is missing in config")
	}

	// Inisialisasi migration engine menunjuk ke folder migrations
	m, err := migrate.New("file://migrations", cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("failed to init migrate instance: %v", err)
	}
	defer m.Close()

	if step != 0 {
		log.Printf("applying %d migration step(s)...", step)
		if err := m.Steps(step); err != nil && !errors.Is(err, migrate.ErrNoChange) {
			log.Fatalf("migration steps failed: %v", err)
		}
		log.Println("migration steps completed")
		return
	}

	switch action {
	case "up":
		log.Println("applying all up migrations...")
		if err := m.Up(); err != nil {
			if errors.Is(err, migrate.ErrNoChange) {
				log.Println("no new migrations to apply (database is up-to-date)")
				return
			}
			log.Fatalf("migration up failed: %v", err)
		}
		log.Println("migrations applied successfully")

	case "down":
		log.Println("rolling back all migrations...")
		if err := m.Down(); err != nil {
			if errors.Is(err, migrate.ErrNoChange) {
				log.Println("no migrations to roll back")
				return
			}
			log.Fatalf("migration down failed: %v", err)
		}
		log.Println("rollback completed successfully")

	case "version":
		version, dirty, err := m.Version()
		if err != nil {
			log.Fatalf("failed to get migration version: %v", err)
		}
		log.Printf("current migration version: %d (dirty: %v)\n", version, dirty)

	default:
		log.Fatalf("unknown action '%s'. Use 'up', 'down', 'version', or pass -step flag", action)
	}
}