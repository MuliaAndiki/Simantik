package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// StudentProfile holds supplementary academic profile attributes for students.
// Keeping this distinct from the core User account maintains separation between
// authentication concerns and educational domain attributes.
type StudentProfile struct {
	ID               uuid.UUID  `gorm:"type:uuid;primaryKey" json:"id"`
	UserID           uuid.UUID  `gorm:"type:uuid;not null;uniqueIndex" json:"userId"`
	SchoolID         *uuid.UUID `gorm:"type:uuid;index" json:"schoolId"`
	School           string     `gorm:"type:varchar(150)" json:"school"`
	Grade            string     `gorm:"type:varchar(50)" json:"grade"` // e.g. "12 SMA", "Gap Year"
	Jenjang          *string    `gorm:"column:jenjang;type:varchar(20);index" json:"jenjang"` // eksplisit (gap year), fallback ke jenjang sekolah
	Major            string     `gorm:"type:varchar(100)" json:"major"`                      // e.g. "IPA", "IPS"
	TargetUniversity string     `gorm:"type:varchar(150)" json:"targetUniversity"`
	TargetMajor      string     `gorm:"type:varchar(100)" json:"targetMajor"`
	Bio              string     `gorm:"type:text" json:"bio"`
	CreatedAt        time.Time  `json:"createdAt"`
	UpdatedAt        time.Time  `json:"updatedAt"`

	User *User `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE;" json:"-"`
}

func (sp *StudentProfile) BeforeCreate(tx *gorm.DB) error {
	if sp.ID == uuid.Nil {
		sp.ID = uuid.New()
	}
	return nil
}
