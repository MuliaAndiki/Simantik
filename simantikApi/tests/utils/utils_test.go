package utils_test

import (
	"testing"
	"time"

	"github.com/google/uuid"

	"simantikApi/pkg/utils"
)

func TestHashPasswordAndCompare(t *testing.T) {
	raw := "SecurePassword123!"
	hashed, err := utils.HashPassword(raw)
	if err != nil {
		t.Fatalf("unexpected error hashing password: %v", err)
	}

	if err := utils.ComparePassword(hashed, raw); err != nil {
		t.Errorf("expected password to match hash, got: %v", err)
	}

	if err := utils.ComparePassword(hashed, "WrongPassword"); err == nil {
		t.Errorf("expected wrong password to fail comparison")
	}
}

func TestGenerateAndParseJWT(t *testing.T) {
	secret := "test-jwt-secret-key-12345"
	userID := uuid.New()
	role := "student"
	expiry := 15 * time.Minute

	tokenString, err := utils.GenerateToken(secret, userID, role, expiry)
	if err != nil {
		t.Fatalf("unexpected error generating token: %v", err)
	}

	claims, err := utils.ParseToken(secret, tokenString)
	if err != nil {
		t.Fatalf("unexpected error parsing token: %v", err)
	}

	if claims.UserID != userID {
		t.Errorf("expected UserID %v, got %v", userID, claims.UserID)
	}
	if claims.Role != role {
		t.Errorf("expected Role %v, got %v", role, claims.Role)
	}

	// Test invalid secret
	if _, err := utils.ParseToken("wrong-secret", tokenString); err == nil {
		t.Errorf("expected parse with wrong secret to fail")
	}
}

func TestGenerateAndCompareOTP(t *testing.T) {
	code, hash, err := utils.GenerateOTP()
	if err != nil {
		t.Fatalf("unexpected error generating OTP: %v", err)
	}

	if len(code) != 6 {
		t.Errorf("expected 6-digit OTP, got length %d (%s)", len(code), code)
	}

	if !utils.CompareOTP(hash, code) {
		t.Errorf("expected OTP code %s to match its hash", code)
	}

	if utils.CompareOTP(hash, "000000") && code != "000000" {
		t.Errorf("expected incorrect OTP to fail comparison")
	}
}

func TestTokenGeneratorsAndHashing(t *testing.T) {
	raw, err := utils.GenerateRandomHex(32)
	if err != nil {
		t.Fatalf("unexpected error generating random hex: %v", err)
	}

	if len(raw) != 64 { // 32 bytes = 64 hex characters
		t.Errorf("expected 64 hex chars, got %d", len(raw))
	}

	hash1 := utils.HashSHA256(raw)
	hash2 := utils.HashSHA256(raw)

	if hash1 != hash2 {
		t.Errorf("expected deterministic hash output, got %s vs %s", hash1, hash2)
	}
	if len(hash1) != 64 {
		t.Errorf("expected 64 hex chars for SHA-256 sum, got %d", len(hash1))
	}
}
