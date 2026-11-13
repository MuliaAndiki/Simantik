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
	if s.VerificationStatus == "" {
		s.VerificationStatus = models.SchoolVerificationVerified
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
		status := s.VerificationStatus
		if status == "" {
			status = models.SchoolVerificationVerified
		}
		if filter.VerificationStatus != "" && filter.VerificationStatus != "all" && string(status) != filter.VerificationStatus {
			continue
		}
		if filter.SubmittedByUserID != nil {
			if s.SubmittedByUserID == nil || *s.SubmittedByUserID != *filter.SubmittedByUserID {
				continue
			}
		}
		res = append(res, *s)
	}
	return res, int64(len(res)), nil
}

func (m *mockSchoolRepo) CountSummary(ctx context.Context) (*dto.SchoolVerificationSummary, error) {
	summary := &dto.SchoolVerificationSummary{}
	for _, s := range m.items {
		summary.Total++
		switch s.VerificationStatus {
		case models.SchoolVerificationPending:
			summary.Pending++
		case models.SchoolVerificationRejected:
			summary.Rejected++
		default:
			summary.Verified++
		}
		if s.Status == models.SchoolStatusNegeri {
			summary.Negeri++
		} else {
			summary.Swasta++
		}
		switch s.Level {
		case models.SchoolLevelSMA:
			summary.SMACount++
		case models.SchoolLevelSMK:
			summary.SMKCount++
		}
	}
	return summary, nil
}

// ─── Tests ───────────────────────────────────────────────────────────────────

func newSchoolService() service.SchoolService {
	return service.NewSchoolService(newMockSchoolRepo(), newMockUserRepo())
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
	if res.Summary == nil || res.Summary.Total != 2 || res.Summary.Verified != 2 {
		t.Fatalf("expected summary total=2 verified=2, got %+v", res.Summary)
	}
}

func TestSchoolService_Propose_Verify_Reject_Workflow(t *testing.T) {
	ctx := context.Background()
	schoolRepo := newMockSchoolRepo()
	userRepo := newMockUserRepo()

	student := &models.User{
		ID:       uuid.New(),
		FullName: "Budi Santoso",
		Email:    "budi@example.com",
		Role:     models.UserRoleStudent,
		Status:   models.UserStatusActive,
	}
	_ = userRepo.Create(ctx, student)
	adminID := uuid.New()

	svc := service.NewSchoolService(schoolRepo, userRepo)

	// 1. Propose new school -> created as pending with submitter metadata and coordinates
	lat1, lng1 := -6.9175, 107.6191
	proposed, err := svc.ProposeSchool(ctx, student.ID, dto.ProposeSchoolRequest{
		NPSN:      "20200303",
		Name:      "SMAN 99 Harapan",
		Level:     "sma",
		Status:    "negeri",
		Address:   "Jl. Harapan No. 99",
		Provinsi:  "Jawa Barat",
		Kabupaten: "Kota Bandung",
		Latitude:  &lat1,
		Longitude: &lng1,
	})
	if err != nil {
		t.Fatalf("propose failed: %v", err)
	}
	if proposed.VerificationStatus != "pending" {
		t.Fatalf("expected pending status, got %s", proposed.VerificationStatus)
	}
	if proposed.SubmittedByName != "Budi Santoso" || proposed.SubmittedByEmail != "budi@example.com" {
		t.Fatalf("expected submitter metadata preserved, got name=%q email=%q", proposed.SubmittedByName, proposed.SubmittedByEmail)
	}
	if proposed.Latitude == nil || proposed.Longitude == nil || *proposed.Latitude != lat1 || *proposed.Longitude != lng1 {
		t.Fatalf("expected coordinates (%v, %v), got (%v, %v)", lat1, lng1, proposed.Latitude, proposed.Longitude)
	}

	// 2. Duplicate NPSN while pending is blocked with ErrSchoolPendingExists
	if _, err := svc.ProposeSchool(ctx, uuid.New(), dto.ProposeSchoolRequest{
		NPSN:      "20200303",
		Name:      "SMAN 99 Duplikat",
		Level:     "sma",
		Status:    "negeri",
		Address:   "Jl. Lain No. 1",
		Latitude:  &lat1,
		Longitude: &lng1,
	}); err != service.ErrSchoolPendingExists {
		t.Fatalf("expected ErrSchoolPendingExists, got %v", err)
	}

	// 3. Public list does NOT expose pending schools
	pubList, err := svc.ListPublicSchools(ctx, dto.ListSchoolFilter{})
	if err != nil {
		t.Fatalf("list public failed: %v", err)
	}
	if pubList.Total != 0 || len(pubList.Schools) != 0 {
		t.Fatalf("expected 0 public schools before verify, got %+v", pubList)
	}
	if _, err := svc.GetPublicSchoolByID(ctx, proposed.ID); err != service.ErrSchoolNotFound {
		t.Fatalf("expected ErrSchoolNotFound for unverified public detail, got %v", err)
	}

	// 4. Student can list their own submissions
	subs, err := svc.ListMySubmissions(ctx, student.ID)
	if err != nil || len(subs) != 1 || subs[0].ID != proposed.ID {
		t.Fatalf("expected 1 submission for student, got %+v, err=%v", subs, err)
	}

	// 5. Reject with reason -> status becomes rejected, rejectionReason populated
	rejected, err := svc.RejectSchool(ctx, adminID, proposed.ID, dto.RejectSchoolRequest{
		Reason: "NPSN belum terdaftar di Dapodik",
	})
	if err != nil {
		t.Fatalf("reject failed: %v", err)
	}
	if rejected.VerificationStatus != "rejected" || rejected.RejectionReason != "NPSN belum terdaftar di Dapodik" {
		t.Fatalf("unexpected rejected payload: %+v", rejected)
	}

	// 6. Resubmit rejected NPSN updates record cleanly back to pending and updates coordinates
	lat2, lng2 := -6.9025, 107.6188
	resubmitted, err := svc.ProposeSchool(ctx, student.ID, dto.ProposeSchoolRequest{
		NPSN:      "20200303",
		Name:      "SMAN 99 Harapan Revisi",
		Level:     "sma",
		Status:    "negeri",
		Address:   "Jl. Harapan Baru No. 99",
		Latitude:  &lat2,
		Longitude: &lng2,
	})
	if err != nil {
		t.Fatalf("resubmit rejected school failed: %v", err)
	}
	if resubmitted.ID != proposed.ID || resubmitted.VerificationStatus != "pending" || resubmitted.RejectionReason != "" {
		t.Fatalf("expected rejected school updated cleanly on resubmit, got %+v", resubmitted)
	}
	if resubmitted.Latitude == nil || resubmitted.Longitude == nil || *resubmitted.Latitude != lat2 || *resubmitted.Longitude != lng2 {
		t.Fatalf("expected updated coordinates (%v, %v), got (%v, %v)", lat2, lng2, resubmitted.Latitude, resubmitted.Longitude)
	}

	// 7. Verify -> becomes visible in public list
	verified, err := svc.VerifySchool(ctx, adminID, proposed.ID)
	if err != nil {
		t.Fatalf("verify failed: %v", err)
	}
	if verified.VerificationStatus != "verified" {
		t.Fatalf("expected verified status, got %s", verified.VerificationStatus)
	}

	pubListAfter, err := svc.ListPublicSchools(ctx, dto.ListSchoolFilter{})
	if err != nil || pubListAfter.Total != 1 || pubListAfter.Schools[0].ID != proposed.ID {
		t.Fatalf("expected 1 public school after verify, got %+v, err=%v", pubListAfter, err)
	}
}

func TestSchoolService_CoordinateValidation(t *testing.T) {
	ctx := context.Background()
	svc := newSchoolService()

	outLat, outLng := 35.6762, 139.6503 // Tokyo — outside Indonesia bounds
	if _, err := svc.ProposeSchool(ctx, uuid.New(), dto.ProposeSchoolRequest{
		NPSN:      "20990001",
		Name:      "School Outside ID",
		Level:     "sma",
		Status:    "negeri",
		Address:   "Jl. Luar Batas No. 1",
		Latitude:  &outLat,
		Longitude: &outLng,
	}); err != service.ErrInvalidCoordinates {
		t.Fatalf("expected ErrInvalidCoordinates for outside Indonesia coordinates, got %v", err)
	}

	validLat := -6.2088
	if _, err := svc.ProposeSchool(ctx, uuid.New(), dto.ProposeSchoolRequest{
		NPSN:     "20990002",
		Name:     "School Missing Lng",
		Level:    "sma",
		Status:   "negeri",
		Address:  "Jl. Incomplete No. 1",
		Latitude: &validLat,
	}); err != service.ErrInvalidCoordinates {
		t.Fatalf("expected ErrInvalidCoordinates when longitude missing, got %v", err)
	}

	// Admin CreateSchool rejects half coordinates or out-of-Indonesia coords when supplied
	if _, err := svc.CreateSchool(ctx, dto.CreateSchoolRequest{
		NPSN:      "20990003",
		Name:      "Admin Outside ID",
		Level:     "sma",
		Status:    "negeri",
		Address:   "Jl. Admin No. 1",
		Latitude:  &outLat,
		Longitude: &outLng,
	}); err != service.ErrInvalidCoordinates {
		t.Fatalf("expected ErrInvalidCoordinates for admin outside Indonesia, got %v", err)
	}

	// Admin CreateSchool accepts valid coords and UpdateSchool updates them
	okLat, okLng := -6.1754, 106.8272
	created, err := svc.CreateSchool(ctx, dto.CreateSchoolRequest{
		NPSN:      "20990004",
		Name:      "SMAN 1 Monas",
		Level:     "sma",
		Status:    "negeri",
		Address:   "Jl. Medan Merdeka",
		Latitude:  &okLat,
		Longitude: &okLng,
	})
	if err != nil {
		t.Fatalf("expected admin create with coords to succeed, got %v", err)
	}
	if created.Latitude == nil || *created.Latitude != okLat || created.Longitude == nil || *created.Longitude != okLng {
		t.Fatalf("expected saved admin coordinates, got (%v, %v)", created.Latitude, created.Longitude)
	}

	newLat := -7.2575
	updated, err := svc.UpdateSchool(ctx, created.ID, dto.UpdateSchoolRequest{
		Latitude: &newLat,
	})
	if err != nil {
		t.Fatalf("expected partial coordinate update with existing longitude to succeed, got %v", err)
	}
	if updated.Latitude == nil || *updated.Latitude != newLat || updated.Longitude == nil || *updated.Longitude != okLng {
		t.Fatalf("expected updated latitude %v with preserved longitude %v, got (%v, %v)", newLat, okLng, updated.Latitude, updated.Longitude)
	}
}
