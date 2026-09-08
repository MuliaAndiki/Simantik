package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// OTPPurpose categorizes why an OTP was issued.
type OTPPurpose string

const (
	OTPPurposePasswordReset OTPPurpose = "PASSWORD_RESET"
	OTPPurposeRegister      OTPPurpose = "REGISTER"
)

// OTPCode stores a one-time password record for a specific user action.
// The plaintext OTP is NEVER stored — only its bcrypt hash is persisted.
// A separate record is created per request; previous records are invalidated.
type OTPCode struct {
	ID          uuid.UUID  `gorm:"type:uuid;primaryKey"           json:"-"`
	UserID      uuid.UUID  `gorm:"type:uuid;not null;index"       json:"-"`
	Purpose     OTPPurpose `gorm:"type:varchar(30);not null"      json:"-"`
	CodeHash    string     `gorm:"type:varchar(255);not null"     json:"-"`
	ExpiresAt   time.Time  `gorm:"not null;index"                 json:"-"`
	Attempts    int        `gorm:"not null;default:0"             json:"-"`
	MaxAttempts int        `gorm:"not null;default:5"             json:"-"`
	VerifiedAt  *time.Time `json:"-"`
	CreatedAt   time.Time  `json:"-"`
}

// BeforeCreate generates a UUID primary key application-side.
func (o *OTPCode) BeforeCreate(tx *gorm.DB) error {
	if o.ID == uuid.Nil {
		o.ID = uuid.New()
	}
	return nil
}

// IsExpired returns true when the OTP has passed its expiry time.
func (o *OTPCode) IsExpired() bool {
	return time.Now().After(o.ExpiresAt)
}

// IsUsed returns true when the OTP has already been successfully verified.
func (o *OTPCode) IsUsed() bool {
	return o.VerifiedAt != nil
}

// IsExhausted returns true when the maximum number of attempts has been reached.
func (o *OTPCode) IsExhausted() bool {
	return o.Attempts >= o.MaxAttempts
}
