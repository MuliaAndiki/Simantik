package service_test

import (
	"context"
	"testing"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
	"simantikApi/internal/service"
)

// ─── Mock Repository ─────────────────────────────────────────────────────────

type mockSchoolRepo struct {
	items map[uuid.UUID]*models.School
}

func newMockSchoolRepo() *mockSchoolRepo {
	return &mockSchoolRepo{items: make(map[uuid.UUID]*models.School)}
}

func (m *mockSchoolRepo) Create(ctx context.Context, s *models.School) error {
	if s.ID == uuid.Nil {
		s.ID = uuid.New()
	}
	s.CreatedAt = time.Now()
	s.UpdatedAt = time.Now()
	m.items[s.ID] = s
	return nil
}

func (m *mockSchoolRepo) FindByID(ctx context.Context, id uuid.UUID) (*models.School, error) {
	s, ok := m.items[id]
	if !ok {
		return nil, gorm.ErrRecordNotFound
	}
	return s, nil
}

func (m *mockSchoolRepo) FindByNPSN(ctx context.Context, npsn string) (*models.School, error) {
	for _, s := range m.items {
		if s.NPSN == npsn {
			return s, nil
		}
	}
	return nil, gorm.ErrRecordNotFound
}

func (m *mockSchoolRepo) Update(ctx context.Context, s *models.School) error {
	s.UpdatedAt = time.Now()
	m.items[s.ID] = s
	return nil
}

func (m *mockSchoolRepo) Delete(ctx context.Context, id uuid.UUID) error {
	delete(m.items, id)
	return nil
}

func (m *mockSchoolRepo) List(ctx context.Context, filter dto.ListSchoolFilter) ([]models.School, int64, error) {
	res := make([]models.School, 0)
	for _, s := range m.items {
		if filter.Level != "" && string(s.Level) != filter.Level {
			continue
		}
		if filter.Status != "" && string(s.Status) != filter.Status {
			continue
		}
		res = append(res, *s)
	}
	return res, int64(len(res)), nil
}

// ─── Tests ───────────────────────────────────────────────────────────────────

func newSchoolService() service.SchoolService {
	return service.NewSchoolService(newMockSchoolRepo())
}

func validCreateSchoolReq() dto.CreateSchoolRequest {
	return dto.CreateSchoolRequest{
		NPSN:      "20100101",
		Name:      "SMAN 1 Jakarta",
		Level:     "sma",
		Status:    "negeri",
		Address:   "Jl. Gambir No. 1, Jakarta Pusat",
		Provinsi:  "DKI Jakarta",
		Kabupaten: "Jakarta Pusat",
		Kecamatan: "Gambir",
	}
}

func TestSchoolService_Create_Success(t *testing.T) {
	svc := newSchoolService()
	res, err := svc.CreateSchool(context.Background(), validCreateSchoolReq())
	if err != nil {
		t.Fatalf("expected success, got error: %v", err)
	}
	if res.NPSN != "20100101" || res.Name != "SMAN 1 Jakarta" || res.Level != "sma" {
		t.Fatalf("unexpected response: %+v", res)
	}
	if res.ID == uuid.Nil {
		t.Fatal("expected non-nil school id")
	}
}

func TestSchoolService_Create_DuplicateNPSN(t *testing.T) {
	svc := newSchoolService()
	if _, err := svc.CreateSchool(context.Background(), validCreateSchoolReq()); err != nil {
		t.Fatalf("first create failed: %v", err)
	}

	_, err := svc.CreateSchool(context.Background(), validCreateSchoolReq())
	if err != service.ErrSchoolNPSNExists {
		t.Fatalf("expected ErrSchoolNPSNExists, got: %v", err)
	}
}

func TestSchoolService_GetByID_NotFound(t *testing.T) {
	svc := newSchoolService()
	_, err := svc.GetSchoolByID(context.Background(), uuid.New())
	if err != service.ErrSchoolNotFound {
		t.Fatalf("expected ErrSchoolNotFound, got: %v", err)
	}
}

func TestSchoolService_Update_Success(t *testing.T) {
	svc := newSchoolService()
	created, err := svc.CreateSchool(context.Background(), validCreateSchoolReq())
	if err != nil {
		t.Fatalf("create failed: %v", err)
	}

	newName := "SMAN 1 Jakarta Barat"
	res, err := svc.UpdateSchool(context.Background(), created.ID, dto.UpdateSchoolRequest{Name: newName})
	if err != nil {
		t.Fatalf("update failed: %v", err)
	}
	if res.Name != newName {
		t.Fatalf("expected name %q, got %q", newName, res.Name)
	}
	if res.NPSN != created.NPSN {
		t.Fatal("npsn should be unchanged when omitted")
	}
}

func TestSchoolService_Update_NotFound(t *testing.T) {
	svc := newSchoolService()
	_, err := svc.UpdateSchool(context.Background(), uuid.New(), dto.UpdateSchoolRequest{Name: "X"})
	if err != service.ErrSchoolNotFound {
		t.Fatalf("expected ErrSchoolNotFound, got: %v", err)
	}
}

func TestSchoolService_Delete_Success(t *testing.T) {
	svc := newSchoolService()
	created, err := svc.CreateSchool(context.Background(), validCreateSchoolReq())
	if err != nil {
		t.Fatalf("create failed: %v", err)
	}

	if err := svc.DeleteSchool(context.Background(), created.ID); err != nil {
		t.Fatalf("delete failed: %v", err)
	}
	if _, err := svc.GetSchoolByID(context.Background(), created.ID); err != service.ErrSchoolNotFound {
		t.Fatalf("expected ErrSchoolNotFound after delete, got: %v", err)
	}
}

func TestSchoolService_List_FilterByLevel(t *testing.T) {
	svc := newSchoolService()
	req := validCreateSchoolReq()
	if _, err := svc.CreateSchool(context.Background(), req); err != nil {
		t.Fatalf("create failed: %v", err)
	}

	req2 := validCreateSchoolReq()
	req2.NPSN = "20100102"
	req2.Name = "SMKN 2 Jakarta"
	req2.Level = "smk"
	if _, err := svc.CreateSchool(context.Background(), req2); err != nil {
		t.Fatalf("create 2 failed: %v", err)
	}

	res, err := svc.ListSchools(context.Background(), dto.ListSchoolFilter{Level: "smk"})
	if err != nil {
		t.Fatalf("list failed: %v", err)
	}
	if res.Total != 1 || len(res.Schools) != 1 || res.Schools[0].Level != "smk" {
		t.Fatalf("expected 1 smk school, got %+v", res)
	}
}
