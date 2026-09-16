package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// SchoolLevel represents the education level of a school.
type SchoolLevel string

const (
	SchoolLevelTK  SchoolLevel = "tk"
	SchoolLevelSD  SchoolLevel = "sd"
	SchoolLevelSMP SchoolLevel = "smp"
	SchoolLevelSMA SchoolLevel = "sma"
	SchoolLevelSMK SchoolLevel = "smk"
)

// SchoolStatus represents school ownership (negeri/swasta).
type SchoolStatus string

const (
	SchoolStatusNegeri SchoolStatus = "negeri"
	SchoolStatusSwasta SchoolStatus = "swasta"
)

// School represents a school master data entry managed by admins.
type School struct {
	ID        uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	NPSN      string         `gorm:"type:varchar(20);not null;unique" json:"npsn"`
	Name      string         `gorm:"column:nama;type:varchar(255);not null" json:"nama"`
	Level     SchoolLevel    `gorm:"column:jenjang;type:varchar(20);not null;index" json:"jenjang"`
	Status    SchoolStatus   `gorm:"column:status;type:varchar(20);not null" json:"status"`
	LogoURL   *string        `gorm:"column:logo;type:varchar(500)" json:"logo"`
	Address   string         `gorm:"column:alamat;type:varchar(500);not null" json:"alamat"`
	Provinsi  string         `gorm:"column:provinsi;type:varchar(100)" json:"provinsi"`
	Kabupaten string         `gorm:"column:kabupaten;type:varchar(100)" json:"kabupaten"`
	Kecamatan string         `gorm:"column:kecamatan;type:varchar(100)" json:"kecamatan"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

func (s *School) BeforeCreate(tx *gorm.DB) error {
	if s.ID == uuid.Nil {
		s.ID = uuid.New()
	}
	return nil
}
