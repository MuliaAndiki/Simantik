package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Notification represents an in-app system notification or announcement for a user.
type Notification struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	UserID    uuid.UUID `gorm:"type:uuid;not null;index" json:"userId"`
	Title     string    `gorm:"type:varchar(255);not null" json:"title"`
	Message   string    `gorm:"type:text;not null" json:"message"`
	Type      string    `gorm:"type:varchar(50);not null;default:'system';index" json:"type"` // e.g. "tryout_result", "announcement", "recommendation", "system"
	Link      string    `gorm:"type:varchar(255)" json:"link"`
	IsRead    bool      `gorm:"not null;default:false;index" json:"isRead"`
	CreatedAt time.Time `gorm:"not null;index" json:"createdAt"`

	User *User `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE;" json:"-"`
}

func (n *Notification) BeforeCreate(tx *gorm.DB) error {
	if n.ID == uuid.Nil {
		n.ID = uuid.New()
	}
	if n.CreatedAt.IsZero() {
		n.CreatedAt = time.Now()
	}
	return nil
}
