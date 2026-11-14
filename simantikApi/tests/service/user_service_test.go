package service_test

import (
	"context"
	"testing"

	"github.com/google/uuid"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
	"simantikApi/internal/repository"
	"simantikApi/internal/service"
	"simantikApi/pkg/utils"
)

type mockUserRepo struct {
	users map[uuid.UUID]*models.User
}

func newMockUserRepo() *mockUserRepo {
	return &mockUserRepo{users: make(map[uuid.UUID]*models.User)}
}

func (m *mockUserRepo) Create(ctx context.Context, user *models.User) error {
	if user.ID == uuid.Nil {
		user.ID = uuid.New()
	}
	m.users[user.ID] = user
	return nil
}

func (m *mockUserRepo) FindByID(ctx context.Context, id uuid.UUID) (*models.User, error) {
	u, ok := m.users[id]
	if !ok {
		return nil, repository.ErrNotFound
	}
	return u, nil
}

func (m *mockUserRepo) FindByEmail(ctx context.Context, email string) (*models.User, error) {
	for _, u := range m.users {
		if u.Email == email {
			return u, nil
		}
	}
	return nil, repository.ErrNotFound
}

func (m *mockUserRepo) Update(ctx context.Context, user *models.User) error {
	m.users[user.ID] = user
	return nil
}

func (m *mockUserRepo) UpdateLastLogin(ctx context.Context, id uuid.UUID) error {
	return nil
}

func (m *mockUserRepo) List(ctx context.Context, filter dto.UserFilter) ([]models.User, int64, error) {
	var list []models.User
	for _, u := range m.users {
		list = append(list, *u)
	}
	return list, int64(len(list)), nil
}

type mockRefreshTokenRepo struct {
	tokens map[string]*models.RefreshToken
}

func newMockRefreshTokenRepo() *mockRefreshTokenRepo {
	return &mockRefreshTokenRepo{tokens: make(map[string]*models.RefreshToken)}
}

func (m *mockRefreshTokenRepo) Create(ctx context.Context, token *models.RefreshToken) error {
	m.tokens[token.TokenHash] = token
	return nil
}

func (m *mockRefreshTokenRepo) FindByTokenHash(ctx context.Context, hash string) (*models.RefreshToken, error) {
	t, ok := m.tokens[hash]
	if !ok {
		return nil, repository.ErrNotFound
	}
	return t, nil
}

func (m *mockRefreshTokenRepo) RevokeByID(ctx context.Context, id uuid.UUID) error {
	return nil
}

func (m *mockRefreshTokenRepo) RevokeAllByUserID(ctx context.Context, userID uuid.UUID) error {
	return nil
}

func (m *mockRefreshTokenRepo) DeleteExpired(ctx context.Context) error {
	return nil
}

func TestUserService_GetMe(t *testing.T) {
	userRepo := newMockUserRepo()
	sessionRepo := newMockRefreshTokenRepo()
	svc := service.NewUserService(userRepo, sessionRepo, newMockSchoolRepo(), newMockStudentProfileRepo())

	user := &models.User{
		ID:       uuid.New(),
		FullName: "Ahmad Santoso",
		Email:    "ahmad@example.com",
		Role:     models.UserRoleStudent,
		Status:   models.UserStatusActive,
	}
	_ = userRepo.Create(context.Background(), user)

	res, err := svc.GetMe(context.Background(), user.ID)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if res.FullName != "Ahmad Santoso" {
		t.Errorf("expected FullName %q, got %q", "Ahmad Santoso", res.FullName)
	}
	if res.Role != "student" {
		t.Errorf("expected Role %q, got %q", "student", res.Role)
	}
}

func TestUserService_ChangePassword(t *testing.T) {
	userRepo := newMockUserRepo()
	sessionRepo := newMockRefreshTokenRepo()
	svc := service.NewUserService(userRepo, sessionRepo, newMockSchoolRepo(), newMockStudentProfileRepo())

	oldPassword := "OldPass123!"
	oldHash, _ := utils.HashPassword(oldPassword)

	user := &models.User{
		ID:           uuid.New(),
		FullName:     "Siti Aminah",
		Email:        "siti@example.com",
		PasswordHash: oldHash,
		Role:         models.UserRoleStudent,
		Status:       models.UserStatusActive,
	}
	_ = userRepo.Create(context.Background(), user)

	// Wrong current password
	err := svc.ChangePassword(context.Background(), user.ID, dto.ChangePasswordRequest{
		CurrentPassword: "WrongCurrentPassword",
		NewPassword:     "NewSecurePass123!",
	})
	if err != service.ErrWrongPassword {
		t.Errorf("expected ErrWrongPassword, got: %v", err)
	}

	// Same password
	err = svc.ChangePassword(context.Background(), user.ID, dto.ChangePasswordRequest{
		CurrentPassword: oldPassword,
		NewPassword:     oldPassword,
	})
	if err != service.ErrSamePassword {
		t.Errorf("expected ErrSamePassword, got: %v", err)
	}

	// Successful password change
	err = svc.ChangePassword(context.Background(), user.ID, dto.ChangePasswordRequest{
		CurrentPassword: oldPassword,
		NewPassword:     "NewPass456!",
	})
	if err != nil {
		t.Fatalf("unexpected error changing password: %v", err)
	}

	// Verify new password matches
	updated, _ := userRepo.FindByID(context.Background(), user.ID)
	if utils.ComparePassword(updated.PasswordHash, "NewPass456!") != nil {
		t.Errorf("expected new password hash to match 'NewPass456!'")
	}
}

func TestUserService_UpdateUserStatus(t *testing.T) {
	userRepo := newMockUserRepo()
	sessionRepo := newMockRefreshTokenRepo()
	svc := service.NewUserService(userRepo, sessionRepo, newMockSchoolRepo(), newMockStudentProfileRepo())

	adminID := uuid.New()
	studentID := uuid.New()

	_ = userRepo.Create(context.Background(), &models.User{
		ID:       studentID,
		FullName: "Budi",
		Email:    "budi@example.com",
		Role:     models.UserRoleStudent,
		Status:   models.UserStatusActive,
	})

	// Admin cannot self-deactivate
	_, err := svc.UpdateUserStatus(context.Background(), adminID, adminID, "inactive")
	if err != service.ErrCannotSelfDeactivate {
		t.Errorf("expected ErrCannotSelfDeactivate, got %v", err)
	}

	// Update student to suspended
	res, err := svc.UpdateUserStatus(context.Background(), adminID, studentID, "suspended")
	if err != nil {
		t.Fatalf("unexpected error updating status: %v", err)
	}
	if res.Status != "suspended" {
		t.Errorf("expected status suspended, got %s", res.Status)
	}
}

type userServiceTestDeps struct {
	svc         service.UserService
	userRepo    *mockUserRepo
	schoolRepo  *mockSchoolRepo
	profileRepo *mockStudentProfileRepo
}

func newUserServiceTestDeps() userServiceTestDeps {
	userRepo := newMockUserRepo()
	schoolRepo := newMockSchoolRepo()
	profileRepo := newMockStudentProfileRepo()
	svc := service.NewUserService(
		userRepo,
		newMockRefreshTokenRepo(),
		schoolRepo,
		profileRepo,
	)
	return userServiceTestDeps{svc: svc, userRepo: userRepo, schoolRepo: schoolRepo, profileRepo: profileRepo}
}

func TestUserService_UpdateMySchool(t *testing.T) {
	deps := newUserServiceTestDeps()
	ctx := context.Background()

	// Seed a school
	if err := deps.schoolRepo.Create(ctx, &models.School{
		ID:      testSchoolID,
		NPSN:    "20100199",
		Name:    "SMAN 1 Test",
		Level:   models.SchoolLevelSMA,
		Status:  models.SchoolStatusNegeri,
		Address: "Jl. Test No. 1",
	}); err != nil {
		t.Fatalf("school seed failed: %v", err)
	}

	// Seed an active student
	student := &models.User{
		ID:       uuid.New(),
		FullName: "Anak Sekolah",
		Email:    "anak@example.com",
		Role:     models.UserRoleStudent,
		Status:   models.UserStatusActive,
	}
	_ = deps.userRepo.Create(ctx, student)

	// Admin cannot set a school
	admin := &models.User{
		ID:       uuid.New(),
		FullName: "Admin Sekolah",
		Email:    "admin@example.com",
		Role:     models.UserRoleAdmin,
		Status:   models.UserStatusActive,
	}
	_ = deps.userRepo.Create(ctx, admin)
	_, err := deps.svc.UpdateMySchool(ctx, admin.ID, dto.UpdateMySchoolRequest{SchoolID: testSchoolID.String()})
	if err != service.ErrInvalidRole {
		t.Fatalf("expected ErrInvalidRole for admin, got %v", err)
	}

	// Unknown school is rejected
	_, err = deps.svc.UpdateMySchool(ctx, student.ID, dto.UpdateMySchoolRequest{SchoolID: uuid.New().String()})
	if err != service.ErrSchoolNotFound {
		t.Fatalf("expected ErrSchoolNotFound, got %v", err)
	}

	// Student sets a school: profile created, response has hasSchool=true
	res, err := deps.svc.UpdateMySchool(ctx, student.ID, dto.UpdateMySchoolRequest{SchoolID: testSchoolID.String()})
	if err != nil {
		t.Fatalf("unexpected UpdateMySchool error: %v", err)
	}
	if !res.HasSchool {
		t.Fatal("expected hasSchool=true after setting school")
	}

	profile, err := deps.profileRepo.FindByUserID(ctx, student.ID)
	if err != nil {
		t.Fatalf("expected profile created: %v", err)
	}
	if profile.SchoolID == nil || *profile.SchoolID != testSchoolID {
		t.Fatalf("expected profile school %s, got %v", testSchoolID, profile.SchoolID)
	}
	if profile.School != "SMAN 1 Test" {
		t.Fatalf("expected profile school name 'SMAN 1 Test', got %q", profile.School)
	}

	// Setting a different school updates the existing profile (no duplicate)
	otherSchool := &models.School{
		ID:      uuid.New(),
		NPSN:    "20100200",
		Name:    "SMKN 2 Test",
		Level:   models.SchoolLevelSMK,
		Status:  models.SchoolStatusSwasta,
		Address: "Jl. Test No. 2",
	}
	_ = deps.schoolRepo.Create(ctx, otherSchool)

	res2, err := deps.svc.UpdateMySchool(ctx, student.ID, dto.UpdateMySchoolRequest{SchoolID: otherSchool.ID.String()})
	if err != nil {
		t.Fatalf("unexpected second UpdateMySchool error: %v", err)
	}
	if !res2.HasSchool {
		t.Fatal("expected hasSchool=true on school change")
	}
	updated, _ := deps.profileRepo.FindByUserID(ctx, student.ID)
	if updated.School != "SMKN 2 Test" {
		t.Fatalf("expected school updated to 'SMKN 2 Test', got %q", updated.School)
	}

	// Submitter can select their own pending school, while another student or rejected school is blocked
	pendingOwned := &models.School{
		ID:                 uuid.New(),
		NPSN:               "20100300",
		Name:               "SMA Ajuan Sendiri",
		Level:              models.SchoolLevelSMA,
		Status:             models.SchoolStatusSwasta,
		Address:            "Jl. Ajuan",
		VerificationStatus: models.SchoolVerificationPending,
		SubmittedByUserID:  &student.ID,
	}
	_ = deps.schoolRepo.Create(ctx, pendingOwned)

	if _, err := deps.svc.UpdateMySchool(ctx, student.ID, dto.UpdateMySchoolRequest{SchoolID: pendingOwned.ID.String()}); err != nil {
		t.Fatalf("expected owner of pending school to select it, got %v", err)
	}

	otherUser := &models.User{
		ID:       uuid.New(),
		FullName: "Siswa Lain",
		Email:    "lain@example.com",
		Role:     models.UserRoleStudent,
		Status:   models.UserStatusActive,
	}
	_ = deps.userRepo.Create(ctx, otherUser)
	if _, err := deps.svc.UpdateMySchool(ctx, otherUser.ID, dto.UpdateMySchoolRequest{SchoolID: pendingOwned.ID.String()}); err != service.ErrSchoolNotAllowed {
		t.Fatalf("expected ErrSchoolNotAllowed for non-owner selecting pending school, got %v", err)
	}

	rejectedSchool := &models.School{
		ID:                 uuid.New(),
		NPSN:               "20100400",
		Name:               "SMA Ditolak",
		Level:              models.SchoolLevelSMA,
		Status:             models.SchoolStatusSwasta,
		Address:            "Jl. Ditolak",
		VerificationStatus: models.SchoolVerificationRejected,
		SubmittedByUserID:  &student.ID,
	}
	_ = deps.schoolRepo.Create(ctx, rejectedSchool)
	if _, err := deps.svc.UpdateMySchool(ctx, student.ID, dto.UpdateMySchoolRequest{SchoolID: rejectedSchool.ID.String()}); err != service.ErrSchoolNotAllowed {
		t.Fatalf("expected ErrSchoolNotAllowed for rejected school, got %v", err)
	}
}


func TestUserService_UpdateMe_JenjangUpsertAndSync(t *testing.T) {
	deps := newUserServiceTestDeps()
	ctx := context.Background()

	student := &models.User{
		ID:       uuid.New(),
		FullName: "Siswa Skip Sekolah",
		Email:    "skip@example.com",
		Role:     models.UserRoleStudent,
		Status:   models.UserStatusActive,
	}
	_ = deps.userRepo.Create(ctx, student)

	// Setting explicit jenjang without an existing StudentProfile creates it without marking hasSchool=true
	jenjangSMA := "sma"
	res, err := deps.svc.UpdateMe(ctx, student.ID, dto.UpdateMeRequest{Jenjang: &jenjangSMA})
	if err != nil {
		t.Fatalf("expected UpdateMe to upsert missing profile, got %v", err)
	}
	if res.HasSchool {
		t.Fatal("expected hasSchool=false when only jenjang is set")
	}
	if res.StudentProfile == nil {
		t.Fatal("expected StudentProfile in response")
	}
	if res.StudentProfile.Jenjang == nil || *res.StudentProfile.Jenjang != "sma" {
		t.Fatalf("expected profile jenjang 'sma', got %v", res.StudentProfile.Jenjang)
	}
	if res.StudentProfile.EffectiveJenjang == nil || *res.StudentProfile.EffectiveJenjang != "sma" {
		t.Fatalf("expected effectiveJenjang 'sma', got %v", res.StudentProfile.EffectiveJenjang)
	}

	// Updating jenjang again updates the existing profile cleanly
	jenjangSMK := "smk"
	resUpdated, err := deps.svc.UpdateMe(ctx, student.ID, dto.UpdateMeRequest{Jenjang: &jenjangSMK})
	if err != nil {
		t.Fatalf("expected UpdateMe jenjang update to succeed, got %v", err)
	}
	if resUpdated.StudentProfile == nil || resUpdated.StudentProfile.EffectiveJenjang == nil || *resUpdated.StudentProfile.EffectiveJenjang != "smk" {
		t.Fatalf("expected effectiveJenjang 'smk', got %+v", resUpdated.StudentProfile)
	}
}

func TestUserService_GetMeAndUpdateMySchool_JenjangResolution(t *testing.T) {
	deps := newUserServiceTestDeps()
	ctx := context.Background()

	schoolSMP := &models.School{
		ID:      uuid.New(),
		NPSN:    "20100991",
		Name:    "SMPN 1 Nusantara",
		Level:   models.SchoolLevelSMP,
		Status:  models.SchoolStatusNegeri,
		Address: "Jl. SMP No. 1",
	}
	schoolSMA := &models.School{
		ID:      uuid.New(),
		NPSN:    "20100992",
		Name:    "SMAN 1 Nusantara",
		Level:   models.SchoolLevelSMA,
		Status:  models.SchoolStatusNegeri,
		Address: "Jl. SMA No. 1",
	}
	_ = deps.schoolRepo.Create(ctx, schoolSMP)
	_ = deps.schoolRepo.Create(ctx, schoolSMA)

	student := &models.User{
		ID:       uuid.New(),
		FullName: "Siswa Pindah Jenjang",
		Email:    "pindah@example.com",
		Role:     models.UserRoleStudent,
		Status:   models.UserStatusActive,
	}
	_ = deps.userRepo.Create(ctx, student)

	// 1. Select SMP school -> effectiveJenjang & schoolJenjang resolve to "smp"
	resSMP, err := deps.svc.UpdateMySchool(ctx, student.ID, dto.UpdateMySchoolRequest{SchoolID: schoolSMP.ID.String()})
	if err != nil {
		t.Fatalf("UpdateMySchool SMP failed: %v", err)
	}
	if resSMP.StudentProfile == nil || resSMP.StudentProfile.SchoolJenjang == nil || *resSMP.StudentProfile.SchoolJenjang != "smp" {
		t.Fatalf("expected schoolJenjang 'smp', got %+v", resSMP.StudentProfile)
	}
	if resSMP.StudentProfile.EffectiveJenjang == nil || *resSMP.StudentProfile.EffectiveJenjang != "smp" {
		t.Fatalf("expected effectiveJenjang 'smp', got %+v", resSMP.StudentProfile)
	}

	// 2. Apply explicit override to "smk" -> GetMe reflects schoolJenjang="smp" & effectiveJenjang="smk"
	overrideSMK := "smk"
	if _, err := deps.svc.UpdateMe(ctx, student.ID, dto.UpdateMeRequest{Jenjang: &overrideSMK}); err != nil {
		t.Fatalf("UpdateMe override failed: %v", err)
	}
	meOverride, err := deps.svc.GetMe(ctx, student.ID)
	if err != nil {
		t.Fatalf("GetMe failed: %v", err)
	}
	if meOverride.StudentProfile == nil || meOverride.StudentProfile.SchoolJenjang == nil || *meOverride.StudentProfile.SchoolJenjang != "smp" {
		t.Fatalf("expected GetMe schoolJenjang 'smp', got %+v", meOverride.StudentProfile)
	}
	if meOverride.StudentProfile.EffectiveJenjang == nil || *meOverride.StudentProfile.EffectiveJenjang != "smk" {
		t.Fatalf("expected GetMe effectiveJenjang 'smk', got %+v", meOverride.StudentProfile)
	}

	// 3. Switching to SMA school clears stale explicit override -> GetMe resolves effectiveJenjang="sma"
	resSMA, err := deps.svc.UpdateMySchool(ctx, student.ID, dto.UpdateMySchoolRequest{SchoolID: schoolSMA.ID.String()})
	if err != nil {
		t.Fatalf("UpdateMySchool SMA failed: %v", err)
	}
	if resSMA.StudentProfile == nil || resSMA.StudentProfile.Jenjang != nil {
		t.Fatalf("expected explicit Jenjang override cleared on school switch, got %+v", resSMA.StudentProfile)
	}
	if resSMA.StudentProfile.EffectiveJenjang == nil || *resSMA.StudentProfile.EffectiveJenjang != "sma" {
		t.Fatalf("expected effectiveJenjang 'sma', got %+v", resSMA.StudentProfile)
	}

	storedProfile, err := deps.profileRepo.FindByUserID(ctx, student.ID)
	if err != nil {
		t.Fatalf("expected stored profile: %v", err)
	}
	if storedProfile.Jenjang != nil {
		t.Fatalf("expected stored profile.Jenjang cleared to nil, got %v", *storedProfile.Jenjang)
	}

	meAfterSwitch, err := deps.svc.GetMe(ctx, student.ID)
	if err != nil {
		t.Fatalf("GetMe after switch failed: %v", err)
	}
	if meAfterSwitch.StudentProfile == nil || meAfterSwitch.StudentProfile.EffectiveJenjang == nil || *meAfterSwitch.StudentProfile.EffectiveJenjang != "sma" {
		t.Fatalf("expected GetMe effectiveJenjang 'sma' after switch, got %+v", meAfterSwitch.StudentProfile)
	}
}
