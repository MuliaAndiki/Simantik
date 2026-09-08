package config

import (
	"log"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"

	"simantikApi/internal/models"
)

// SeedInitialData idempotently seeds baseline master data into the database:
// 1. Roles (student, admin, content_manager)
// 2. Question Types (multiple_choice, complex_multiple_choice, true_false)
// 3. Baseline Competencies (Pemahaman Tekstual, Pemahaman Inferensial, Evaluasi dan Apresiasi)
func SeedInitialData(db *gorm.DB) error {
	// Fast check: if master data already exists, skip inserting to eliminate redundant remote queries
	var roleCount int64
	if err := db.Model(&models.Role{}).Count(&roleCount).Error; err == nil && roleCount >= 3 {
		return nil
	}

	// 1. Roles
	roles := []models.Role{
		{Name: string(models.UserRoleStudent), Description: "Peserta belajar, latihan, dan simulasi tryout"},
		{Name: string(models.UserRoleAdmin), Description: "Administrator operasional dan manajemen sistem"},
		{Name: string(models.UserRoleContentManager), Description: "Pengelola modul pembelajaran dan bank soal"},
	}

	for _, r := range roles {
		if err := db.Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "name"}},
			DoNothing: true,
		}).Create(&r).Error; err != nil {
			return err
		}
	}

	// 2. Question Types
	questionTypes := []models.QuestionType{
		{
			Code:        models.QuestionTypeMultipleChoice,
			Name:        "Pilihan Ganda Tunggal",
			Description: "Soal dengan satu pilihan jawaban benar dari 5 opsi (A-E)",
		},
		{
			Code:        models.QuestionTypeComplexMultipleChoice,
			Name:        "Pilihan Ganda Kompleks",
			Description: "Soal dengan beberapa pilihan jawaban benar (MCMA)",
		},
		{
			Code:        models.QuestionTypeTrueFalse,
			Name:        "Benar / Salah",
			Description: "Soal kategori pernyataan Tepat / Tidak Tepat atau Benar / Salah",
		},
	}

	for _, qt := range questionTypes {
		if err := db.Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "code"}},
			DoNothing: true,
		}).Create(&qt).Error; err != nil {
			return err
		}
	}

	// 3. Baseline Competencies
	competencies := []models.Competency{
		{
			Code:        "TEKSTUAL",
			Name:        "Pemahaman Tekstual",
			Description: "Kemampuan memahami informasi eksplisit yang terdapat langsung dalam teks",
			Status:      models.CompetencyStatusActive,
		},
		{
			Code:        "INFERENSIAL",
			Name:        "Pemahaman Inferensial",
			Description: "Kemampuan menarik kesimpulan dan memahami makna tersirat dari teks",
			Status:      models.CompetencyStatusActive,
		},
		{
			Code:        "EVALUASI",
			Name:        "Evaluasi dan Apresiasi",
			Description: "Kemampuan menilai kredibilitas, gaya bahasa, dan merefleksikan isi teks",
			Status:      models.CompetencyStatusActive,
		},
	}

	for _, c := range competencies {
		if err := db.Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "code"}},
			DoNothing: true,
		}).Create(&c).Error; err != nil {
			return err
		}
	}

	log.Println("config: master data seeding completed successfully")
	return nil
}
