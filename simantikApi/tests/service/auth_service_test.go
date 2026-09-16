package service_test

import (
	"context"
	"testing"
	"time"

	"github.com/google/uuid"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
	"simantikApi/internal/repository"
	"simantikApi/internal/service"
	"simantikApi/pkg/utils"
)

type mockOTPRepo struct {
	otps map[uuid.UUID]*models.OTPCode
}

func newMockOTPRepo() *mockOTPRepo {
	return &mockOTPRepo{otps: make(map[uuid.UUID]*models.OTPCode)}
}

func (m *mockOTPRepo) Create(ctx context.Context, otp *models.OTPCode) error {
	if otp.ID == uuid.Nil {
		otp.ID = uuid.New()
	}
	m.otps[otp.ID] = otp
	return nil
}

func (m *mockOTPRepo) FindLatestValid(ctx context.Context, userID uuid.UUID, purpose models.OTPPurpose) (*models.OTPCode, error) {
	for _, o := range m.otps {
		if o.UserID == userID && o.Purpose == purpose && o.VerifiedAt == nil && time.Now().Before(o.ExpiresAt) {
			return o, nil
		}
	}
	return nil, repository.ErrNotFound
}

func (m *mockOTPRepo) IncrementAttempts(ctx context.Context, id uuid.UUID) error {
	if o, ok := m.otps[id]; ok {
		o.Attempts++
	}
	return nil
}

func (m *mockOTPRepo) MarkVerified(ctx context.Context, id uuid.UUID) error {
	if o, ok := m.otps[id]; ok {
		now := time.Now()
		o.VerifiedAt = &now
	}
	return nil
}

func (m *mockOTPRepo) InvalidatePrevious(ctx context.Context, userID uuid.UUID, purpose models.OTPPurpose) error {
	for _, o := range m.otps {
		if o.UserID == userID && o.Purpose == purpose {
			o.ExpiresAt = time.Now().Add(-1 * time.Second)
		}
	}
	return nil
}

type mockResetTokenRepo struct {
	tokens map[string]*models.PasswordResetToken
}

func newMockResetTokenRepo() *mockResetTokenRepo {
	return &mockResetTokenRepo{tokens: make(map[string]*models.PasswordResetToken)}
}

func (m *mockResetTokenRepo) Create(ctx context.Context, token *models.PasswordResetToken) error {
	if token.ID == uuid.Nil {
		token.ID = uuid.New()
	}
	m.tokens[token.TokenHash] = token
	return nil
}

func (m *mockResetTokenRepo) FindByTokenHash(ctx context.Context, hash string) (*models.PasswordResetToken, error) {
	t, ok := m.tokens[hash]
	if !ok {
		return nil, repository.ErrNotFound
	}
	return t, nil
}

func (m *mockResetTokenRepo) MarkUsed(ctx context.Context, id uuid.UUID) error {
	for _, t := range m.tokens {
		if t.ID == id {
			now := time.Now()
			t.UsedAt = &now
		}
	}
	return nil
}

func (m *mockResetTokenRepo) InvalidateAllForUser(ctx context.Context, userID uuid.UUID) error {
	return nil
}

type mockExtAccountRepo struct {
	accounts map[string]*models.ExternalAccount
}

func newMockExtAccountRepo() *mockExtAccountRepo {
	return &mockExtAccountRepo{accounts: make(map[string]*models.ExternalAccount)}
}

func (m *mockExtAccountRepo) Create(ctx context.Context, account *models.ExternalAccount) error {
	m.accounts[account.Provider+":"+account.ProviderUserID] = account
	return nil
}

func (m *mockExtAccountRepo) FindByProviderAndUserID(ctx context.Context, provider, providerUserID string) (*models.ExternalAccount, error) {
	a, ok := m.accounts[provider+":"+providerUserID]
	if !ok {
		return nil, repository.ErrNotFound
	}
	return a, nil
}

func (m *mockExtAccountRepo) FindByUserID(ctx context.Context, userID uuid.UUID) ([]models.ExternalAccount, error) {
	return nil, nil
}

type mockStudentProfileRepo struct {
	profiles map[uuid.UUID]*models.StudentProfile
}

func newMockStudentProfileRepo() *mockStudentProfileRepo {
	return &mockStudentProfileRepo{profiles: make(map[uuid.UUID]*models.StudentProfile)}
}

func (m *mockStudentProfileRepo) Create(ctx context.Context, p *models.StudentProfile) error {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	m.profiles[p.UserID] = p
	return nil
}

func (m *mockStudentProfileRepo) FindByUserID(ctx context.Context, userID uuid.UUID) (*models.StudentProfile, error) {
	p, ok := m.profiles[userID]
	if !ok {
		return nil, repository.ErrNotFound
	}
	return p, nil
}

func (m *mockStudentProfileRepo) Update(ctx context.Context, p *models.StudentProfile) error {
	m.profiles[p.UserID] = p
	return nil
}

type mockGoogleVerifier struct{}

type mockEmailSender struct {
	lastRegEmail   string
	lastRegOTP     string
	lastResetEmail string
	lastResetOTP   string
}

func (m *mockEmailSender) SendRegistrationOTP(ctx context.Context, toEmail, otpCode string) error {
	m.lastRegEmail = toEmail
	m.lastRegOTP = otpCode
	return nil
}

func (m *mockEmailSender) SendPasswordResetOTP(ctx context.Context, toEmail, otpCode string) error {
	m.lastResetEmail = toEmail
	m.lastResetOTP = otpCode
	return nil
}

func (m *mockEmailSender) SendPasswordResetConfirmation(ctx context.Context, toEmail string) error {
	return nil
}

func (m *mockEmailSender) SendTryoutResult(ctx context.Context, toEmail, studentName, tryoutTitle string, score, accuracy float64) error {
	return nil
}

func (m *mockEmailSender) SendTryoutDetailedResult(ctx context.Context, data utils.TryoutResultEmailData) error {
	return nil
}

func (m *mockGoogleVerifier) Verify(ctx context.Context, idToken string) (*utils.GoogleClaims, error) {
	if idToken == "valid-token" {
		return &utils.GoogleClaims{
			Sub:   "google-12345",
			Email: "googleuser@example.com",
			Name:  "Google User",
		}, nil
	}
	return nil, service.ErrInvalidGoogleToken
}

var testSchoolID = uuid.MustParse("11111111-1111-1111-1111-111111111111")

type authTestDeps struct {
	svc         service.AuthService
	userRepo    *mockUserRepo
	profileRepo *mockStudentProfileRepo
	emailSender *mockEmailSender
}

func newAuthTestDeps() authTestDeps {
	userRepo := newMockUserRepo()
	profileRepo := newMockStudentProfileRepo()
	emailSender := &mockEmailSender{}
	svc := service.NewAuthService(
		nil,
		userRepo,
		newMockRefreshTokenRepo(),
		newMockOTPRepo(),
		newMockResetTokenRepo(),
		newMockExtAccountRepo(),
		profileRepo,
		emailSender,
		&mockGoogleVerifier{},
		"jwt-secret-for-test-32bytes-long",
		15,
		7,
	)
	return authTestDeps{svc: svc, userRepo: userRepo, profileRepo: profileRepo, emailSender: emailSender}
}

func TestAuthService_RegisterAndLogin(t *testing.T) {
	deps := newAuthTestDeps()
	svc := deps.svc
	emailSender := deps.emailSender

	ctx := context.Background()
	meta := dto.RequestMeta{UserAgent: "test", IPAddress: "127.0.0.1"}

	// 1. Register: should create pending user and send OTP
	regRes, err := svc.Register(ctx, dto.RegisterRequest{
		FullName: "Rudi Hartono",
		Email:    "rudi@example.com",
		Password: "Password123!",
	})
	if err != nil {
		t.Fatalf("unexpected register error: %v", err)
	}
	if regRes.Email != "rudi@example.com" {
		t.Errorf("expected email rudi@example.com, got %s", regRes.Email)
	}
	if emailSender.lastRegOTP == "" {
		t.Fatalf("expected registration OTP to be sent")
	}

	// 2. Attempt login while pending: should return ErrAccountPending
	_, _, err = svc.Login(ctx, dto.LoginRequest{
		Email:    "rudi@example.com",
		Password: "Password123!",
	}, meta)
	if err != service.ErrAccountPending {
		t.Errorf("expected ErrAccountPending, got %v", err)
	}

	// 3. Resend OTP for pending registration
	err = svc.ResendRegisterOTP(ctx, dto.ResendOTPRequest{Email: "rudi@example.com"})
	if err != nil {
		t.Fatalf("unexpected resend register OTP error: %v", err)
	}
	activeOTP := emailSender.lastRegOTP

	// 4. Verify with invalid OTP
	_, _, err = svc.VerifyRegisterOTP(ctx, dto.VerifyRegisterOTPRequest{
		Email: "rudi@example.com",
		OTP:   "999999",
	}, meta)
	if err != service.ErrInvalidOTP {
		t.Errorf("expected ErrInvalidOTP, got %v", err)
	}

	// 5. Verify with correct OTP: activates account and returns tokens.
	//    New student has no school yet: hasSchool must be false.
	authRes, rawRefreshToken, err := svc.VerifyRegisterOTP(ctx, dto.VerifyRegisterOTPRequest{
		Email: "rudi@example.com",
		OTP:   activeOTP,
	}, meta)
	if err != nil {
		t.Fatalf("unexpected verify OTP error: %v", err)
	}
	if authRes.User.Email != "rudi@example.com" {
		t.Errorf("expected email rudi@example.com, got %s", authRes.User.Email)
	}
	if authRes.User.HasSchool {
		t.Errorf("expected hasSchool=false for fresh student, got true")
	}
	if authRes.AccessToken == "" {
		t.Errorf("expected non-empty access token")
	}
	if rawRefreshToken == "" {
		t.Errorf("expected non-empty raw refresh token")
	}

	// 6. Duplicate registration after verified: should fail with ErrEmailAlreadyExists
	_, err = svc.Register(ctx, dto.RegisterRequest{
		FullName: "Rudi Hartono",
		Email:    "rudi@example.com",
		Password: "Password123!",
	})
	if err != service.ErrEmailAlreadyExists {
		t.Errorf("expected ErrEmailAlreadyExists, got %v", err)
	}

	// 7. Login with correct credentials: still no school
	loginRes, loginRefresh, err := svc.Login(ctx, dto.LoginRequest{
		Email:    "rudi@example.com",
		Password: "Password123!",
	}, meta)
	if err != nil {
		t.Fatalf("unexpected login error: %v", err)
	}
	if loginRes.AccessToken == "" || loginRefresh == "" {
		t.Errorf("expected access token and refresh token")
	}
	if loginRes.User.HasSchool {
		t.Errorf("expected hasSchool=false before school selection, got true")
	}

	// 8. Set school on the profile, then login again: hasSchool must be true
	user, err := deps.userRepo.FindByEmail(ctx, "rudi@example.com")
	if err != nil {
		t.Fatalf("user not found: %v", err)
	}
	if err := deps.profileRepo.Create(ctx, &models.StudentProfile{
		UserID:   user.ID,
		SchoolID: &testSchoolID,
		School:   "SMAN 1 Test",
	}); err != nil {
		t.Fatalf("profile create failed: %v", err)
	}
	loginRes2, _, err := svc.Login(ctx, dto.LoginRequest{
		Email:    "rudi@example.com",
		Password: "Password123!",
	}, meta)
	if err != nil {
		t.Fatalf("unexpected login error: %v", err)
	}
	if !loginRes2.User.HasSchool {
		t.Errorf("expected hasSchool=true after school selection, got false")
	}

	// 9. Login with wrong password
	_, _, err = svc.Login(ctx, dto.LoginRequest{
		Email:    "rudi@example.com",
		Password: "WrongPassword!",
	}, meta)
	if err != service.ErrInvalidCredentials {
		t.Errorf("expected ErrInvalidCredentials, got %v", err)
	}
}

func TestAuthService_RefreshSession(t *testing.T) {
	deps := newAuthTestDeps()
	svc := deps.svc
	emailSender := deps.emailSender

	ctx := context.Background()
	meta := dto.RequestMeta{UserAgent: "test", IPAddress: "127.0.0.1"}

	// Register user
	_, err := svc.Register(ctx, dto.RegisterRequest{
		FullName: "Test User",
		Email:    "test@example.com",
		Password: "Password123!",
	})
	if err != nil {
		t.Fatalf("register failed: %v", err)
	}

	// Verify registration OTP to obtain refresh token
	_, rawRefresh, err := svc.VerifyRegisterOTP(ctx, dto.VerifyRegisterOTPRequest{
		Email: "test@example.com",
		OTP:   emailSender.lastRegOTP,
	}, meta)
	if err != nil {
		t.Fatalf("verify registration OTP failed: %v", err)
	}

	// Refresh token
	refRes, newRefresh, err := svc.Refresh(ctx, rawRefresh, meta)
	if err != nil {
		t.Fatalf("unexpected refresh error: %v", err)
	}
	if refRes.AccessToken == "" || newRefresh == "" {
		t.Errorf("expected new token pair from refresh")
	}

	// Refresh with empty token
	_, _, err = svc.Refresh(ctx, "", meta)
	if err != service.ErrInvalidRefreshToken {
		t.Errorf("expected ErrInvalidRefreshToken, got %v", err)
	}
}

func TestAuthService_OTPVerificationFlow(t *testing.T) {
	deps := newAuthTestDeps()
	svc := deps.svc
	userRepo := deps.userRepo
	emailSender := deps.emailSender

	ctx := context.Background()
	user := &models.User{
		ID:       uuid.New(),
		FullName: "OTP Tester",
		Email:    "otp@example.com",
		Role:     models.UserRoleStudent,
		Status:   models.UserStatusActive,
	}
	_ = userRepo.Create(ctx, user)

	// Trigger forgot password
	err := svc.ForgotPassword(ctx, dto.ForgotPasswordRequest{Email: "otp@example.com"})
	if err != nil {
		t.Fatalf("unexpected forgotPassword error: %v", err)
	}

	if emailSender.lastResetOTP == "" {
		t.Fatalf("expected reset OTP to be sent")
	}

	// Verify with invalid OTP
	_, err = svc.VerifyOTP(ctx, dto.VerifyOTPRequest{
		Email: "otp@example.com",
		OTP:   "000000",
	})
	if err != service.ErrInvalidOTP {
		t.Errorf("expected ErrInvalidOTP, got %v", err)
	}

	// Verify with valid OTP
	verifyRes, err := svc.VerifyOTP(ctx, dto.VerifyOTPRequest{
		Email: "otp@example.com",
		OTP:   emailSender.lastResetOTP,
	})
	if err != nil {
		t.Fatalf("unexpected verifyOTP error: %v", err)
	}
	if verifyRes.ResetToken == "" {
		t.Errorf("expected non-empty reset token")
	}

	// Reset password
	err = svc.ResetPassword(ctx, dto.ResetPasswordRequest{
		ResetToken:  verifyRes.ResetToken,
		NewPassword: "NewSecretPassword123!",
	})
	if err != nil {
		t.Fatalf("unexpected resetPassword error: %v", err)
	}

	// Login with new password
	loginRes, _, err := svc.Login(ctx, dto.LoginRequest{
		Email:    "otp@example.com",
		Password: "NewSecretPassword123!",
	}, dto.RequestMeta{UserAgent: "test", IPAddress: "127.0.0.1"})
	if err != nil {
		t.Fatalf("unexpected login error with new password: %v", err)
	}
	if loginRes.AccessToken == "" {
		t.Errorf("expected access token")
	}
}

func TestAuthService_GoogleLoginHasSchoolFlag(t *testing.T) {
	deps := newAuthTestDeps()
	ctx := context.Background()
	meta := dto.RequestMeta{UserAgent: "test", IPAddress: "127.0.0.1"}

	// New Google identity: no school yet, hasSchool must be false
	res, rawRefresh, err := deps.svc.LoginGoogle(ctx, dto.GoogleLoginRequest{IDToken: "valid-token"}, meta)
	if err != nil {
		t.Fatalf("unexpected google login error: %v", err)
	}
	if res.User.Email != "googleuser@example.com" {
		t.Fatalf("expected googleuser@example.com, got %s", res.User.Email)
	}
	if res.AccessToken == "" || rawRefresh == "" {
		t.Fatal("expected tokens from google login")
	}
	if res.User.HasSchool {
		t.Fatal("expected hasSchool=false for fresh google student, got true")
	}

	// Set the school via profile, then google-login again: hasSchool true
	user, err := deps.userRepo.FindByEmail(ctx, "googleuser@example.com")
	if err != nil {
		t.Fatalf("google user not found: %v", err)
	}
	if err := deps.profileRepo.Create(ctx, &models.StudentProfile{
		UserID:   user.ID,
		SchoolID: &testSchoolID,
		School:   "SMAN 1 Test",
	}); err != nil {
		t.Fatalf("profile create failed: %v", err)
	}

	res2, _, err := deps.svc.LoginGoogle(ctx, dto.GoogleLoginRequest{IDToken: "valid-token"}, meta)
	if err != nil {
		t.Fatalf("unexpected second google login error: %v", err)
	}
	if !res2.User.HasSchool {
		t.Fatal("expected hasSchool=true after school selection, got false")
	}
}
