package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// News represents published articles, announcements, and updates.
type News struct {
	ID           uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	Title        string         `gorm:"type:varchar(255);not null" json:"title"`
	Slug         string         `gorm:"type:varchar(255);not null;uniqueIndex" json:"slug"`
	Content      string         `gorm:"type:text;not null" json:"content"`
	ThumbnailURL *string        `gorm:"type:varchar(500)" json:"thumbnailUrl"`
	Status       ContentStatus  `gorm:"type:varchar(20);not null;default:'draft';index" json:"status"`
	PublishedAt  *time.Time     `json:"publishedAt"`
	CreatedBy    uuid.UUID      `gorm:"type:uuid;not null;index" json:"createdBy"`
	UpdatedBy    *uuid.UUID     `gorm:"type:uuid" json:"updatedBy"`
	CreatedAt    time.Time      `json:"createdAt"`
	UpdatedAt    time.Time      `json:"updatedAt"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}

func (n *News) BeforeCreate(tx *gorm.DB) error {
	if n.ID == uuid.Nil {
		n.ID = uuid.New()
	}
	return nil
}

// Documentation represents platform guidebooks, manuals, and technical/user docs.
type Documentation struct {
	ID        uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	Title     string         `gorm:"type:varchar(255);not null" json:"title"`
	Slug      string         `gorm:"type:varchar(255);not null;uniqueIndex" json:"slug"`
	Content   string         `gorm:"type:text;not null" json:"content"`
	Category  string         `gorm:"type:varchar(100);not null;index" json:"category"`
	Status    ContentStatus  `gorm:"type:varchar(20);not null;default:'draft';index" json:"status"`
	CreatedBy uuid.UUID      `gorm:"type:uuid;not null;index" json:"createdBy"`
	UpdatedBy *uuid.UUID     `gorm:"type:uuid" json:"updatedBy"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

func (d *Documentation) BeforeCreate(tx *gorm.DB) error {
	if d.ID == uuid.Nil {
		d.ID = uuid.New()
	}
	return nil
}

// TestimonialStatus represents the moderation state of a student testimonial.
type TestimonialStatus string

const (
	TestimonialStatusPending  TestimonialStatus = "pending"
	TestimonialStatusApproved TestimonialStatus = "approved"
	TestimonialStatusRejected TestimonialStatus = "rejected"
)

// Testimonial represents user feedback, success stories, and ratings.
type Testimonial struct {
	ID         uuid.UUID         `gorm:"type:uuid;primaryKey" json:"id"`
	UserID     *uuid.UUID        `gorm:"type:uuid;index" json:"userId"` // optional linked student
	AuthorName string            `gorm:"type:varchar(150);not null" json:"authorName"`
	AuthorRole string            `gorm:"type:varchar(100)" json:"authorRole"` // e.g. "Alumni SMAN 1 Jakarta"
	Content    string            `gorm:"type:text;not null" json:"content"`
	Rating     int               `gorm:"not null;default:5" json:"rating"` // 1 to 5
	Status     TestimonialStatus `gorm:"type:varchar(20);not null;default:'pending';index" json:"status"`
	CreatedAt  time.Time         `json:"createdAt"`
	UpdatedAt  time.Time         `json:"updatedAt"`
	DeletedAt  gorm.DeletedAt    `gorm:"index" json:"-"`
}

func (t *Testimonial) BeforeCreate(tx *gorm.DB) error {
	if t.ID == uuid.Nil {
		t.ID = uuid.New()
	}
	if t.Rating < 1 {
		t.Rating = 1
	} else if t.Rating > 5 {
		t.Rating = 5
	}
	return nil
}
