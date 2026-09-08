package dto

import (
	"time"

	"github.com/google/uuid"
)

// ─── News DTOs ───────────────────────────────────────────────────────────────

type CreateNewsRequest struct {
	Title        string  `json:"title" validate:"required,min=3,max=255"`
	Slug         string  `json:"slug" validate:"omitempty,min=3,max=255"`
	Content      string  `json:"content" validate:"required"`
	ThumbnailURL *string `json:"thumbnailUrl" validate:"omitempty"`
	Status       string  `json:"status" validate:"omitempty,oneof=draft review published archived"`
}

type UpdateNewsRequest struct {
	Title        string  `json:"title" validate:"omitempty,min=3,max=255"`
	Slug         string  `json:"slug" validate:"omitempty,min=3,max=255"`
	Content      string  `json:"content"`
	ThumbnailURL *string `json:"thumbnailUrl" validate:"omitempty"`
	Status       string  `json:"status" validate:"omitempty,oneof=draft review published archived"`
}

type UpdateNewsStatusRequest struct {
	Status string `json:"status" validate:"required,oneof=draft review published archived"`
}

type NewsResponse struct {
	ID           uuid.UUID  `json:"id"`
	Title        string     `json:"title"`
	Slug         string     `json:"slug"`
	Content      string     `json:"content"`
	ThumbnailURL *string    `json:"thumbnailUrl"`
	Status       string     `json:"status"`
	PublishedAt  *time.Time `json:"publishedAt"`
	CreatedBy    uuid.UUID  `json:"createdBy"`
	UpdatedBy    *uuid.UUID `json:"updatedBy"`
	CreatedAt    time.Time  `json:"createdAt"`
	UpdatedAt    time.Time  `json:"updatedAt"`
}

type ListNewsFilter struct {
	Search string `query:"search"`
	Status string `query:"status"`
	Limit  int    `query:"limit"`
	Offset int    `query:"offset"`
}

type PaginatedNewsResponse struct {
	News   []NewsResponse `json:"news"`
	Total  int64          `json:"total"`
	Limit  int            `json:"limit"`
	Offset int            `json:"offset"`
}

// ─── Documentation DTOs ──────────────────────────────────────────────────────

type CreateDocumentationRequest struct {
	Title    string `json:"title" validate:"required,min=3,max=255"`
	Slug     string `json:"slug" validate:"omitempty,min=3,max=255"`
	Content  string `json:"content" validate:"required"`
	Category string `json:"category" validate:"required,min=2,max=100"`
	Status   string `json:"status" validate:"omitempty,oneof=draft review published archived"`
}

type UpdateDocumentationRequest struct {
	Title    string `json:"title" validate:"omitempty,min=3,max=255"`
	Slug     string `json:"slug" validate:"omitempty,min=3,max=255"`
	Content  string `json:"content"`
	Category string `json:"category" validate:"omitempty,min=2,max=100"`
	Status   string `json:"status" validate:"omitempty,oneof=draft review published archived"`
}

type UpdateDocumentationStatusRequest struct {
	Status string `json:"status" validate:"required,oneof=draft review published archived"`
}

type DocumentationResponse struct {
	ID        uuid.UUID  `json:"id"`
	Title     string     `json:"title"`
	Slug      string     `json:"slug"`
	Content   string     `json:"content"`
	Category  string     `json:"category"`
	Status    string     `json:"status"`
	CreatedBy uuid.UUID  `json:"createdBy"`
	UpdatedBy *uuid.UUID `json:"updatedBy"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
}

type ListDocumentationFilter struct {
	Search   string `query:"search"`
	Category string `query:"category"`
	Status   string `query:"status"`
	Limit    int    `query:"limit"`
	Offset   int    `query:"offset"`
}

type PaginatedDocumentationResponse struct {
	Documentation []DocumentationResponse `json:"documentation"`
	Total         int64                   `json:"total"`
	Limit         int                     `json:"limit"`
	Offset        int                     `json:"offset"`
}

// ─── Testimonial DTOs ────────────────────────────────────────────────────────

type CreateTestimonialRequest struct {
	AuthorName string `json:"authorName" validate:"required,min=2,max=150"`
	AuthorRole string `json:"authorRole" validate:"omitempty,max=100"`
	Content    string `json:"content" validate:"required,min=10,max=1000"`
	Rating     int    `json:"rating" validate:"required,min=1,max=5"`
}

type UpdateTestimonialStatusRequest struct {
	Status string `json:"status" validate:"required,oneof=pending approved rejected"`
}

type TestimonialResponse struct {
	ID         uuid.UUID  `json:"id"`
	UserID     *uuid.UUID `json:"userId"`
	AuthorName string     `json:"authorName"`
	AuthorRole string     `json:"authorRole"`
	Content    string     `json:"content"`
	Rating     int        `json:"rating"`
	Status     string     `json:"status"`
	CreatedAt  time.Time  `json:"createdAt"`
	UpdatedAt  time.Time  `json:"updatedAt"`
}

type ListTestimonialFilter struct {
	Status string `query:"status"`
	Limit  int    `query:"limit"`
	Offset int    `query:"offset"`
}

type PaginatedTestimonialsResponse struct {
	Testimonials []TestimonialResponse `json:"testimonials"`
	Total        int64                 `json:"total"`
	Limit        int                   `json:"limit"`
	Offset       int                   `json:"offset"`
}
