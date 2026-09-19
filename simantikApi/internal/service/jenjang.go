package service

import (
	"context"

	"github.com/google/uuid"

	"simantikApi/internal/repository"
)

// JenjangResolver menentukan jenjang efektif seorang siswa:
// 1. Jenjang eksplisit di StudentProfile (misal siswa gap year), atau
// 2. Jenjang sekolah yang dipilih siswa (SchoolID → School.Level).
// Return "" jika keduanya tidak tersedia.
type JenjangResolver struct {
	profileRepo repository.StudentProfileRepository
	schoolRepo  repository.SchoolRepository
}

func NewJenjangResolver(
	profileRepo repository.StudentProfileRepository,
	schoolRepo repository.SchoolRepository,
) *JenjangResolver {
	return &JenjangResolver{profileRepo: profileRepo, schoolRepo: schoolRepo}
}

func (r *JenjangResolver) Resolve(ctx context.Context, userID uuid.UUID) (string, error) {
	profile, err := r.profileRepo.FindByUserID(ctx, userID)
	if err != nil {
		return "", nil // tanpa profil → tidak bisa ditentukan
	}

	if profile.Jenjang != nil && *profile.Jenjang != "" {
		return *profile.Jenjang, nil
	}

	if profile.SchoolID != nil {
		school, err := r.schoolRepo.FindByID(ctx, *profile.SchoolID)
		if err == nil {
			return string(school.Level), nil
		}
	}

	return "", nil
}
