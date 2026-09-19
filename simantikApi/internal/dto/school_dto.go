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

type SchoolResponse struct {
	ID        uuid.UUID `json:"id"`
	NPSN      string    `json:"npsn"`
	Name      string    `json:"nama"`
	Level     string    `json:"jenjang"`
	Status    string    `json:"status"`
	LogoURL   *string   `json:"logo"`
	Address   string    `json:"alamat"`
	Provinsi  string    `json:"provinsi"`
	Kabupaten string    `json:"kabupaten"`
	Kecamatan string    `json:"kecamatan"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type ListSchoolFilter struct {
	Search string `query:"search"`
	Level  string `query:"jenjang"`
	Status string `query:"status"`
	Limit  int    `query:"limit"`
	Offset int    `query:"offset"`
}

type PaginatedSchoolsResponse struct {
	Schools []SchoolResponse `json:"schools"`
	Total   int64            `json:"total"`
	Limit   int              `json:"limit"`
	Offset  int              `json:"offset"`
}
