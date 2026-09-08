package utils

import (
	"crypto/rand"
	"fmt"
	"math/big"

	"golang.org/x/crypto/bcrypt"
)

const otpBcryptCost = 10

// GenerateOTP generates a cryptographically secure 6-digit numeric code
// and returns the plaintext OTP along with its bcrypt hash.
func GenerateOTP() (code string, hash string, err error) {
	n, err := rand.Int(rand.Reader, big.NewInt(1000000))
	if err != nil {
		return "", "", fmt.Errorf("failed to generate secure random number: %w", err)
	}

	code = fmt.Sprintf("%06d", n.Int64())

	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(code), otpBcryptCost)
	if err != nil {
		return "", "", fmt.Errorf("failed to hash OTP: %w", err)
	}

	return code, string(hashedBytes), nil
}

// CompareOTP compares a plaintext OTP against a bcrypt hash.
func CompareOTP(hash, code string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(code))
	return err == nil
}
