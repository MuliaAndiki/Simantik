package service

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
	"simantikApi/internal/repository"
)

// SchoolService manages school master data and submission moderation.
type SchoolService interface {
	CreateSchool(ctx context.Context, req dto.CreateSchoolRequest) (*dto.SchoolResponse, error)
	ProposeSchool(ctx context.Context, userID uuid.UUID, req dto.ProposeSchoolRequest) (*dto.SchoolResponse, error)
	ListMySubmissions(ctx context.Context, userID uuid.UUID) ([]dto.SchoolResponse, error)
	GetSchoolByID(ctx context.Context, id uuid.UUID) (*dto.SchoolResponse, error)
	GetPublicSchoolByID(ctx context.Context, id uuid.UUID) (*dto.SchoolResponse, error)
	UpdateSchool(ctx context.Context, id uuid.UUID, req dto.UpdateSchoolRequest) (*dto.SchoolResponse, error)
	VerifySchool(ctx context.Context, adminID uuid.UUID, id uuid.UUID) (*dto.SchoolResponse, error)
	RejectSchool(ctx context.Context, adminID uuid.UUID, id uuid.UUID, req dto.RejectSchoolRequest) (*dto.SchoolResponse, error)
	DeleteSchool(ctx context.Context, id uuid.UUID) error
	ListSchools(ctx context.Context, filter dto.ListSchoolFilter) (*dto.PaginatedSchoolsResponse, error)
	ListPublicSchools(ctx context.Context, filter dto.ListSchoolFilter) (*dto.PaginatedSchoolsResponse, error)
}

type schoolService struct {
	schoolRepo repository.SchoolRepository
	userRepo   repository.UserRepository
}

func NewSchoolService(schoolRepo repository.SchoolRepository, userRepo repository.UserRepository) SchoolService {
	return &schoolService{schoolRepo: schoolRepo, userRepo: userRepo}
}

func (s *schoolService) CreateSchool(ctx context.Context, req dto.CreateSchoolRequest) (*dto.SchoolResponse, error) {
	npsn := strings.TrimSpace(req.NPSN)
	if _, err := s.schoolRepo.FindByNPSN(ctx, npsn); err == nil {
		return nil, ErrSchoolNPSNExists
	}

	school := &models.School{
		NPSN:               npsn,
		Name:               strings.TrimSpace(req.Name),
		Level:              models.SchoolLevel(req.Level),
		Status:             models.SchoolStatus(req.Status),
		LogoURL:            req.LogoURL,
		Address:            strings.TrimSpace(req.Address),
		Provinsi:           strings.TrimSpace(req.Provinsi),
		Kabupaten:          strings.TrimSpace(req.Kabupaten),
		Kecamatan:          strings.TrimSpace(req.Kecamatan),
		VerificationStatus: models.SchoolVerificationVerified,
	}

	if err := s.schoolRepo.Create(ctx, school); err != nil {
		return nil, err
	}

	return mapSchoolToResponse(school), nil
}

func (s *schoolService) ProposeSchool(ctx context.Context, userID uuid.UUID, req dto.ProposeSchoolRequest) (*dto.SchoolResponse, error) {
	npsn := strings.TrimSpace(req.NPSN)
	submitterName, submitterEmail := s.resolveSubmitterInfo(ctx, userID)

	existing, err := s.schoolRepo.FindByNPSN(ctx, npsn)
	if err == nil && existing != nil {
		switch existing.VerificationStatus {
		case models.SchoolVerificationPending:
			return nil, ErrSchoolPendingExists
		case models.SchoolVerificationVerified, "":
			return nil, ErrSchoolNPSNExists
		case models.SchoolVerificationRejected:
			// Resubmit the previously rejected NPSN entry instead of violating unique index.
			existing.Name = strings.TrimSpace(req.Name)
			existing.Level = models.SchoolLevel(req.Level)
			existing.Status = models.SchoolStatus(req.Status)
			existing.LogoURL = req.LogoURL
			existing.Address = strings.TrimSpace(req.Address)
			existing.Provinsi = strings.TrimSpace(req.Provinsi)
			existing.Kabupaten = strings.TrimSpace(req.Kabupaten)
			existing.Kecamatan = strings.TrimSpace(req.Kecamatan)
			existing.VerificationStatus = models.SchoolVerificationPending
			existing.SubmittedByUserID = &userID
			existing.SubmittedByName = submitterName
			existing.SubmittedByEmail = submitterEmail
			existing.VerifiedBy = nil
			existing.VerifiedAt = nil
			existing.RejectionReason = ""

			if err := s.schoolRepo.Update(ctx, existing); err != nil {
				return nil, err
			}
			return mapSchoolToResponse(existing), nil
		}
	} else if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	school := &models.School{
		NPSN:               npsn,
		Name:               strings.TrimSpace(req.Name),
		Level:              models.SchoolLevel(req.Level),
		Status:             models.SchoolStatus(req.Status),
		LogoURL:            req.LogoURL,
		Address:            strings.TrimSpace(req.Address),
		Provinsi:           strings.TrimSpace(req.Provinsi),
		Kabupaten:          strings.TrimSpace(req.Kabupaten),
		Kecamatan:          strings.TrimSpace(req.Kecamatan),
		VerificationStatus: models.SchoolVerificationPending,
		SubmittedByUserID:  &userID,
		SubmittedByName:    submitterName,
		SubmittedByEmail:   submitterEmail,
	}

	if err := s.schoolRepo.Create(ctx, school); err != nil {
		return nil, err
	}

	return mapSchoolToResponse(school), nil
}

func (s *schoolService) ListMySubmissions(ctx context.Context, userID uuid.UUID) ([]dto.SchoolResponse, error) {
	list, _, err := s.schoolRepo.List(ctx, dto.ListSchoolFilter{
		SubmittedByUserID: &userID,
		Limit:             50,
		Offset:            0,
	})
	if err != nil {
		return nil, err
	}

	res := make([]dto.SchoolResponse, 0, len(list))
	for i := range list {
		res = append(res, *mapSchoolToResponse(&list[i]))
	}
	return res, nil
}

func (s *schoolService) GetSchoolByID(ctx context.Context, id uuid.UUID) (*dto.SchoolResponse, error) {
	school, err := s.schoolRepo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrSchoolNotFound
		}
		return nil, err
	}
	return mapSchoolToResponse(school), nil
}

func (s *schoolService) GetPublicSchoolByID(ctx context.Context, id uuid.UUID) (*dto.SchoolResponse, error) {
	school, err := s.schoolRepo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrSchoolNotFound
		}
		return nil, err
	}
	if effectiveVerificationStatus(school) != models.SchoolVerificationVerified {
		return nil, ErrSchoolNotFound
	}
	return mapSchoolToResponse(school), nil
}

func (s *schoolService) UpdateSchool(ctx context.Context, id uuid.UUID, req dto.UpdateSchoolRequest) (*dto.SchoolResponse, error) {
	school, err := s.schoolRepo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrSchoolNotFound
		}
		return nil, err
	}

	if req.NPSN != "" && req.NPSN != school.NPSN {
		if _, err := s.schoolRepo.FindByNPSN(ctx, req.NPSN); err == nil {
			return nil, ErrSchoolNPSNExists
		}
		school.NPSN = req.NPSN
	}
	if req.Name != "" {
		school.Name = req.Name
	}
	if req.Level != "" {
		school.Level = models.SchoolLevel(req.Level)
	}
	if req.Status != "" {
		school.Status = models.SchoolStatus(req.Status)
	}
	if req.Address != "" {
		school.Address = req.Address
	}
	if req.LogoURL != nil {
		school.LogoURL = req.LogoURL
	}
	if req.Provinsi != nil {
		school.Provinsi = *req.Provinsi
	}
	if req.Kabupaten != nil {
		school.Kabupaten = *req.Kabupaten
	}
	if req.Kecamatan != nil {
		school.Kecamatan = *req.Kecamatan
	}

	if err := s.schoolRepo.Update(ctx, school); err != nil {
		return nil, err
	}

	return mapSchoolToResponse(school), nil
}

func (s *schoolService) VerifySchool(ctx context.Context, adminID uuid.UUID, id uuid.UUID) (*dto.SchoolResponse, error) {
	school, err := s.schoolRepo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrSchoolNotFound
		}
		return nil, err
	}

	now := time.Now()
	school.VerificationStatus = models.SchoolVerificationVerified
	school.VerifiedBy = &adminID
	school.VerifiedAt = &now
	school.RejectionReason = ""

	if err := s.schoolRepo.Update(ctx, school); err != nil {
		return nil, err
	}

	return mapSchoolToResponse(school), nil
}

func (s *schoolService) RejectSchool(ctx context.Context, adminID uuid.UUID, id uuid.UUID, req dto.RejectSchoolRequest) (*dto.SchoolResponse, error) {
	school, err := s.schoolRepo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrSchoolNotFound
		}
		return nil, err
	}

	now := time.Now()
	school.VerificationStatus = models.SchoolVerificationRejected
	school.VerifiedBy = &adminID
	school.VerifiedAt = &now
	school.RejectionReason = strings.TrimSpace(req.Reason)

	if err := s.schoolRepo.Update(ctx, school); err != nil {
		return nil, err
	}

	return mapSchoolToResponse(school), nil
}

func (s *schoolService) DeleteSchool(ctx context.Context, id uuid.UUID) error {
	if _, err := s.schoolRepo.FindByID(ctx, id); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrSchoolNotFound
		}
		return err
	}
	return s.schoolRepo.Delete(ctx, id)
}

func (s *schoolService) ListSchools(ctx context.Context, filter dto.ListSchoolFilter) (*dto.PaginatedSchoolsResponse, error) {
	res, err := s.listWithFilter(ctx, filter)
	if err != nil {
		return nil, err
	}

	summary, err := s.schoolRepo.CountSummary(ctx)
	if err == nil && summary != nil {
		res.Summary = summary
	}
	return res, nil
}

func (s *schoolService) ListPublicSchools(ctx context.Context, filter dto.ListSchoolFilter) (*dto.PaginatedSchoolsResponse, error) {
	filter.VerificationStatus = string(models.SchoolVerificationVerified)
	filter.SubmittedByUserID = nil
	return s.listWithFilter(ctx, filter)
}

func (s *schoolService) listWithFilter(ctx context.Context, filter dto.ListSchoolFilter) (*dto.PaginatedSchoolsResponse, error) {
	limit := filter.Limit
	if limit <= 0 {
		limit = 20
	}
	offset := filter.Offset
	if offset < 0 {
		offset = 0
	}

	list, total, err := s.schoolRepo.List(ctx, filter)
	if err != nil {
		return nil, err
	}

	res := make([]dto.SchoolResponse, 0, len(list))
	for i := range list {
		res = append(res, *mapSchoolToResponse(&list[i]))
	}

	return &dto.PaginatedSchoolsResponse{
		Schools: res,
		Total:   total,
		Limit:   limit,
		Offset:  offset,
	}, nil
}

func (s *schoolService) resolveSubmitterInfo(ctx context.Context, userID uuid.UUID) (string, string) {
	if s.userRepo == nil {
		return "", ""
	}
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil || user == nil {
		return "", ""
	}
	return user.FullName, user.Email
}

func effectiveVerificationStatus(s *models.School) models.SchoolVerificationStatus {
	if s.VerificationStatus == "" {
		return models.SchoolVerificationVerified
	}
	return s.VerificationStatus
}

func mapSchoolToResponse(s *models.School) *dto.SchoolResponse {
	return &dto.SchoolResponse{
		ID:                 s.ID,
		NPSN:               s.NPSN,
		Name:               s.Name,
		Level:              string(s.Level),
		Status:             string(s.Status),
		LogoURL:            s.LogoURL,
		Address:            s.Address,
		Provinsi:           s.Provinsi,
		Kabupaten:          s.Kabupaten,
		Kecamatan:          s.Kecamatan,
		VerificationStatus: string(effectiveVerificationStatus(s)),
		SubmittedByUserID:  s.SubmittedByUserID,
		SubmittedByName:    s.SubmittedByName,
		SubmittedByEmail:   s.SubmittedByEmail,
		VerifiedBy:         s.VerifiedBy,
		VerifiedAt:         s.VerifiedAt,
		RejectionReason:    s.RejectionReason,
		CreatedAt:          s.CreatedAt,
		UpdatedAt:          s.UpdatedAt,
	}
}
