package service_test

import (
	"context"
	"testing"

	"github.com/google/uuid"

	"simantikApi/internal/models"
	"simantikApi/internal/service"
)

func TestJenjangResolver_Resolve(t *testing.T) {
	ctx := context.Background()
	schoolRepo := newMockSchoolRepo()
	profileRepo := newMockStudentProfileRepo()
	resolver := service.NewJenjangResolver(profileRepo, schoolRepo)

	// 1. Sekolah SMA
	smaID := uuid.New()
	_ = schoolRepo.Create(ctx, &models.School{ID: smaID, NPSN: "20100101", Name: "SMAN 1", Level: models.SchoolLevelSMA, Status: models.SchoolStatusNegeri})

	// 2. Siswa dengan sekolah (tanpa jenjang eksplisit)
	userSchool := uuid.New()
	_ = profileRepo.Create(ctx, &models.StudentProfile{ID: uuid.New(), UserID: userSchool, SchoolID: &smaID})

	// 3. Siswa gap year dengan jenjang eksplisit
	userGapYear := uuid.New()
	explicit := "smp"
	_ = profileRepo.Create(ctx, &models.StudentProfile{ID: uuid.New(), UserID: userGapYear, Jenjang: &explicit})

	// 4. Siswa tanpa profil
	userNone := uuid.New()

	if got, _ := resolver.Resolve(ctx, userSchool); got != "sma" {
		t.Errorf("Resolve(sekolah) = %q, want %q", got, "sma")
	}
	if got, _ := resolver.Resolve(ctx, userGapYear); got != "smp" {
		t.Errorf("Resolve(gap year) = %q, want %q", got, "smp")
	}
	if got, _ := resolver.Resolve(ctx, userNone); got != "" {
		t.Errorf("Resolve(tanpa profil) = %q, want kosong", got)
	}
}
