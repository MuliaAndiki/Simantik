package service

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
	"simantikApi/internal/repository"
)

// SchoolService manages school master data (admin CRUD).
type SchoolService interface {
	CreateSchool(ctx context.Context, req dto.CreateSchoolRequest) (*dto.SchoolResponse, error)
	GetSchoolByID(ctx context.Context, id uuid.UUID) (*dto.SchoolResponse, error)
	UpdateSchool(ctx context.Context, id uuid.UUID, req dto.UpdateSchoolRequest) (*dto.SchoolResponse, error)
	DeleteSchool(ctx context.Context, id uuid.UUID) error
	ListSchools(ctx context.Context, filter dto.ListSchoolFilter) (*dto.PaginatedSchoolsResponse, error)
}

type schoolService struct {
	schoolRepo repository.SchoolRepository
}

func NewSchoolService(schoolRepo repository.SchoolRepository) SchoolService {
	return &schoolService{schoolRepo: schoolRepo}
}

func (s *schoolService) CreateSchool(ctx context.Context, req dto.CreateSchoolRequest) (*dto.SchoolResponse, error) {
	if _, err := s.schoolRepo.FindByNPSN(ctx, req.NPSN); err == nil {
		return nil, ErrSchoolNPSNExists
	}

	school := &models.School{
		NPSN:      req.NPSN,
		Name:      req.Name,
		Level:     models.SchoolLevel(req.Level),
		Status:    models.SchoolStatus(req.Status),
		LogoURL:   req.LogoURL,
		Address:   req.Address,
		Provinsi:  req.Provinsi,
		Kabupaten: req.Kabupaten,
		Kecamatan: req.Kecamatan,
	}

	if err := s.schoolRepo.Create(ctx, school); err != nil {
		return nil, err
	}

	return mapSchoolToResponse(school), nil
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

func mapSchoolToResponse(s *models.School) *dto.SchoolResponse {
	return &dto.SchoolResponse{
		ID:        s.ID,
		NPSN:      s.NPSN,
		Name:      s.Name,
		Level:     string(s.Level),
		Status:    string(s.Status),
		LogoURL:   s.LogoURL,
		Address:   s.Address,
		Provinsi:  s.Provinsi,
		Kabupaten: s.Kabupaten,
		Kecamatan: s.Kecamatan,
		CreatedAt: s.CreatedAt,
		UpdatedAt: s.UpdatedAt,
	}
}
