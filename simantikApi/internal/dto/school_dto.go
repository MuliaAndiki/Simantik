package dto

import (
	"time"

	"github.com/google/uuid"
)

type CreateSchoolRequest struct {
	NPSN      string  `json:"npsn" validate:"required,max=20"`
	Name      string  `json:"nama" validate:"required,min=2,max=255"`
	Level     string  `json:"jenjang" validate:"required,oneof=sd smp sma smk"`
	Status    string  `json:"status" validate:"required,oneof=negeri swasta"`
	LogoURL   *string `json:"logo" validate:"omitempty,max=500"`
	Address   string  `json:"alamat" validate:"required,max=500"`
	Provinsi  string  `json:"provinsi" validate:"omitempty,max=100"`
	Kabupaten string  `json:"kabupaten" validate:"omitempty,max=100"`
	Kecamatan string  `json:"kecamatan" validate:"omitempty,max=100"`
}

type UpdateSchoolRequest struct {
	NPSN      string  `json:"npsn" validate:"omitempty,max=20"`
	Name      string  `json:"nama" validate:"omitempty,min=2,max=255"`
	Level     string  `json:"jenjang" validate:"omitempty,oneof=sd smp sma smk"`
	Status    string  `json:"status" validate:"omitempty,oneof=negeri swasta"`
	LogoURL   *string `json:"logo" validate:"omitempty,max=500"`
	Address   string  `json:"alamat" validate:"omitempty,max=500"`
	Provinsi  *string `json:"provinsi" validate:"omitempty,max=100"`
	Kabupaten *string `json:"kabupaten" validate:"omitempty,max=100"`
	Kecamatan *string `json:"kecamatan" validate:"omitempty,max=100"`
}

type ProposeSchoolRequest struct {
	NPSN      string  `json:"npsn" validate:"required,min=5,max=20"`
	Name      string  `json:"nama" validate:"required,min=2,max=255"`
	Level     string  `json:"jenjang" validate:"required,oneof=sd smp sma smk"`
	Status    string  `json:"status" validate:"required,oneof=negeri swasta"`
	LogoURL   *string `json:"logo" validate:"omitempty,max=500"`
	Address   string  `json:"alamat" validate:"required,min=5,max=500"`
	Provinsi  string  `json:"provinsi" validate:"omitempty,max=100"`
	Kabupaten string  `json:"kabupaten" validate:"omitempty,max=100"`
	Kecamatan string  `json:"kecamatan" validate:"omitempty,max=100"`
}

type RejectSchoolRequest struct {
	Reason string `json:"reason" validate:"required,min=5,max=500"`
}

type SchoolResponse struct {
	ID                 uuid.UUID  `json:"id"`
	NPSN               string     `json:"npsn"`
	Name               string     `json:"nama"`
	Level              string     `json:"jenjang"`
	Status             string     `json:"status"`
	LogoURL            *string    `json:"logo"`
	Address            string     `json:"alamat"`
	Provinsi           string     `json:"provinsi"`
	Kabupaten          string     `json:"kabupaten"`
	Kecamatan          string     `json:"kecamatan"`
	VerificationStatus string     `json:"verificationStatus"`
	SubmittedByUserID  *uuid.UUID `json:"submittedByUserId,omitempty"`
	SubmittedByName    string     `json:"submittedByName,omitempty"`
	SubmittedByEmail   string     `json:"submittedByEmail,omitempty"`
	VerifiedBy         *uuid.UUID `json:"verifiedBy,omitempty"`
	VerifiedAt         *time.Time `json:"verifiedAt,omitempty"`
	RejectionReason    string     `json:"rejectionReason,omitempty"`
	CreatedAt          time.Time  `json:"createdAt"`
	UpdatedAt          time.Time  `json:"updatedAt"`
}

type ListSchoolFilter struct {
	Search             string     `query:"search"`
	Level              string     `query:"jenjang"`
	Status             string     `query:"status"`
	VerificationStatus string     `query:"verificationStatus"`
	SubmittedByUserID  *uuid.UUID `query:"-"`
	Limit              int        `query:"limit"`
	Offset             int        `query:"offset"`
}

type SchoolVerificationSummary struct {
	Total    int64 `json:"total"`
	Verified int64 `json:"verified"`
	Pending  int64 `json:"pending"`
	Rejected int64 `json:"rejected"`
	Negeri   int64 `json:"negeri"`
	Swasta   int64 `json:"swasta"`
	SMACount int64 `json:"smaCount"`
	SMKCount int64 `json:"smkCount"`
}

type PaginatedSchoolsResponse struct {
	Schools []SchoolResponse           `json:"schools"`
	Total   int64                      `json:"total"`
	Limit   int                        `json:"limit"`
	Offset  int                        `json:"offset"`
	Summary *SchoolVerificationSummary `json:"summary,omitempty"`
}
