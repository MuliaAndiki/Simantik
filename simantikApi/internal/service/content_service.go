package service

import (
	"context"
	"errors"
	"regexp"
	"strings"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
	"simantikApi/internal/repository"
)

type ContentService interface {
	// News
	CreateNews(ctx context.Context, req dto.CreateNewsRequest, authorID uuid.UUID) (*dto.NewsResponse, error)
	GetNewsByID(ctx context.Context, id uuid.UUID) (*dto.NewsResponse, error)
	GetNewsBySlug(ctx context.Context, slug string) (*dto.NewsResponse, error)
	UpdateNews(ctx context.Context, id uuid.UUID, req dto.UpdateNewsRequest, updatedByID uuid.UUID) (*dto.NewsResponse, error)
	UpdateNewsStatus(ctx context.Context, id uuid.UUID, status string, updatedByID uuid.UUID) (*dto.NewsResponse, error)
	DeleteNews(ctx context.Context, id uuid.UUID) error
	ListNewsAdmin(ctx context.Context, filter dto.ListNewsFilter) (*dto.PaginatedNewsResponse, error)
	ListNewsPublic(ctx context.Context, filter dto.ListNewsFilter) (*dto.PaginatedNewsResponse, error)

	// Documentation
	CreateDocumentation(ctx context.Context, req dto.CreateDocumentationRequest, authorID uuid.UUID) (*dto.DocumentationResponse, error)
	GetDocumentationByID(ctx context.Context, id uuid.UUID) (*dto.DocumentationResponse, error)
	GetDocumentationBySlug(ctx context.Context, slug string) (*dto.DocumentationResponse, error)
	UpdateDocumentation(ctx context.Context, id uuid.UUID, req dto.UpdateDocumentationRequest, updatedByID uuid.UUID) (*dto.DocumentationResponse, error)
	UpdateDocumentationStatus(ctx context.Context, id uuid.UUID, status string, updatedByID uuid.UUID) (*dto.DocumentationResponse, error)
	DeleteDocumentation(ctx context.Context, id uuid.UUID) error
	ListDocumentationAdmin(ctx context.Context, filter dto.ListDocumentationFilter) (*dto.PaginatedDocumentationResponse, error)
	ListDocumentationPublic(ctx context.Context, filter dto.ListDocumentationFilter) (*dto.PaginatedDocumentationResponse, error)

	// Testimonials
	CreateTestimonial(ctx context.Context, req dto.CreateTestimonialRequest, userID *uuid.UUID) (*dto.TestimonialResponse, error)
	UpdateTestimonialStatus(ctx context.Context, id uuid.UUID, req dto.UpdateTestimonialStatusRequest) (*dto.TestimonialResponse, error)
	DeleteTestimonial(ctx context.Context, id uuid.UUID) error
	ListTestimonialsAdmin(ctx context.Context, filter dto.ListTestimonialFilter) (*dto.PaginatedTestimonialsResponse, error)
	ListTestimonialsPublic(ctx context.Context, limit, offset int) (*dto.PaginatedTestimonialsResponse, error)
}

type contentService struct {
	newsRepo repository.NewsRepository
	docRepo  repository.DocumentationRepository
	testRepo repository.TestimonialRepository
}

func NewContentService(
	newsRepo repository.NewsRepository,
	docRepo repository.DocumentationRepository,
	testRepo repository.TestimonialRepository,
) ContentService {
	return &contentService{
		newsRepo: newsRepo,
		docRepo:  docRepo,
		testRepo: testRepo,
	}
}

// ─── News Methods ────────────────────────────────────────────────────────────

func (s *contentService) CreateNews(ctx context.Context, req dto.CreateNewsRequest, authorID uuid.UUID) (*dto.NewsResponse, error) {
	slug := req.Slug
	if strings.TrimSpace(slug) == "" {
		slug = slugify(req.Title)
	} else {
		slug = slugify(slug)
	}

	// Check if slug exists
	existing, err := s.newsRepo.FindBySlug(ctx, slug)
	if err == nil && existing != nil {
		return nil, ErrNewsSlugExists
	}

	status := models.ContentStatusDraft
	if req.Status != "" {
		status = models.ContentStatus(req.Status)
	}

	var publishedAt *time.Time
	if status == models.ContentStatusPublished {
		now := time.Now()
		publishedAt = &now
	}

	news := &models.News{
		Title:        req.Title,
		Slug:         slug,
		Content:      req.Content,
		ThumbnailURL: req.ThumbnailURL,
		Status:       status,
		PublishedAt:  publishedAt,
		CreatedBy:    authorID,
	}

	if err := s.newsRepo.Create(ctx, news); err != nil {
		return nil, err
	}

	return mapNewsToResponse(news), nil
}

func (s *contentService) GetNewsByID(ctx context.Context, id uuid.UUID) (*dto.NewsResponse, error) {
	news, err := s.newsRepo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrNewsNotFound
		}
		return nil, err
	}
	return mapNewsToResponse(news), nil
}

func (s *contentService) GetNewsBySlug(ctx context.Context, slug string) (*dto.NewsResponse, error) {
	news, err := s.newsRepo.FindBySlug(ctx, slug)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrNewsNotFound
		}
		return nil, err
	}
	return mapNewsToResponse(news), nil
}

func (s *contentService) UpdateNews(ctx context.Context, id uuid.UUID, req dto.UpdateNewsRequest, updatedByID uuid.UUID) (*dto.NewsResponse, error) {
	news, err := s.newsRepo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrNewsNotFound
		}
		return nil, err
	}

	if req.Title != "" {
		news.Title = req.Title
	}
	if req.Slug != "" {
		newSlug := slugify(req.Slug)
		if newSlug != news.Slug {
			existing, err := s.newsRepo.FindBySlug(ctx, newSlug)
			if err == nil && existing != nil && existing.ID != news.ID {
				return nil, ErrNewsSlugExists
			}
			news.Slug = newSlug
		}
	}
	if req.Content != "" {
		news.Content = req.Content
	}
	if req.ThumbnailURL != nil {
		news.ThumbnailURL = req.ThumbnailURL
	}
	if req.Status != "" {
		newStatus := models.ContentStatus(req.Status)
		if news.Status != models.ContentStatusPublished && newStatus == models.ContentStatusPublished && news.PublishedAt == nil {
			now := time.Now()
			news.PublishedAt = &now
		}
		news.Status = newStatus
	}

	news.UpdatedBy = &updatedByID
	if err := s.newsRepo.Update(ctx, news); err != nil {
		return nil, err
	}

	return mapNewsToResponse(news), nil
}

func (s *contentService) UpdateNewsStatus(ctx context.Context, id uuid.UUID, status string, updatedByID uuid.UUID) (*dto.NewsResponse, error) {
	return s.UpdateNews(ctx, id, dto.UpdateNewsRequest{Status: status}, updatedByID)
}

func (s *contentService) DeleteNews(ctx context.Context, id uuid.UUID) error {
	_, err := s.newsRepo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrNewsNotFound
		}
		return err
	}
	return s.newsRepo.Delete(ctx, id)
}

func (s *contentService) ListNewsAdmin(ctx context.Context, filter dto.ListNewsFilter) (*dto.PaginatedNewsResponse, error) {
	limit := filter.Limit
	if limit <= 0 {
		limit = 20
	}
	offset := filter.Offset
	if offset < 0 {
		offset = 0
	}

	list, total, err := s.newsRepo.List(ctx, filter)
	if err != nil {
		return nil, err
	}

	items := make([]dto.NewsResponse, len(list))
	for i := range list {
		items[i] = *mapNewsToResponse(&list[i])
	}

	return &dto.PaginatedNewsResponse{
		News:   items,
		Total:  total,
		Limit:  limit,
		Offset: offset,
	}, nil
}

func (s *contentService) ListNewsPublic(ctx context.Context, filter dto.ListNewsFilter) (*dto.PaginatedNewsResponse, error) {
	limit := filter.Limit
	if limit <= 0 {
		limit = 20
	}
	offset := filter.Offset
	if offset < 0 {
		offset = 0
	}

	list, total, err := s.newsRepo.ListPublished(ctx, filter)
	if err != nil {
		return nil, err
	}

	items := make([]dto.NewsResponse, len(list))
	for i := range list {
		items[i] = *mapNewsToResponse(&list[i])
	}

	return &dto.PaginatedNewsResponse{
		News:   items,
		Total:  total,
		Limit:  limit,
		Offset: offset,
	}, nil
}

// ─── Documentation Methods ───────────────────────────────────────────────────

func (s *contentService) CreateDocumentation(ctx context.Context, req dto.CreateDocumentationRequest, authorID uuid.UUID) (*dto.DocumentationResponse, error) {
	slug := req.Slug
	if strings.TrimSpace(slug) == "" {
		slug = slugify(req.Title)
	} else {
		slug = slugify(slug)
	}

	existing, err := s.docRepo.FindBySlug(ctx, slug)
	if err == nil && existing != nil {
		return nil, ErrDocumentationSlugExists
	}

	status := models.ContentStatusDraft
	if req.Status != "" {
		status = models.ContentStatus(req.Status)
	}

	doc := &models.Documentation{
		Title:     req.Title,
		Slug:      slug,
		Content:   req.Content,
		Category:  req.Category,
		Status:    status,
		CreatedBy: authorID,
	}

	if err := s.docRepo.Create(ctx, doc); err != nil {
		return nil, err
	}

	return mapDocToResponse(doc), nil
}

func (s *contentService) GetDocumentationByID(ctx context.Context, id uuid.UUID) (*dto.DocumentationResponse, error) {
	doc, err := s.docRepo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrDocumentationNotFound
		}
		return nil, err
	}
	return mapDocToResponse(doc), nil
}

func (s *contentService) GetDocumentationBySlug(ctx context.Context, slug string) (*dto.DocumentationResponse, error) {
	doc, err := s.docRepo.FindBySlug(ctx, slug)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrDocumentationNotFound
		}
		return nil, err
	}
	return mapDocToResponse(doc), nil
}

func (s *contentService) UpdateDocumentation(ctx context.Context, id uuid.UUID, req dto.UpdateDocumentationRequest, updatedByID uuid.UUID) (*dto.DocumentationResponse, error) {
	doc, err := s.docRepo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrDocumentationNotFound
		}
		return nil, err
	}

	if req.Title != "" {
		doc.Title = req.Title
	}
	if req.Slug != "" {
		newSlug := slugify(req.Slug)
		if newSlug != doc.Slug {
			existing, err := s.docRepo.FindBySlug(ctx, newSlug)
			if err == nil && existing != nil && existing.ID != doc.ID {
				return nil, ErrDocumentationSlugExists
			}
			doc.Slug = newSlug
		}
	}
	if req.Content != "" {
		doc.Content = req.Content
	}
	if req.Category != "" {
		doc.Category = req.Category
	}
	if req.Status != "" {
		doc.Status = models.ContentStatus(req.Status)
	}

	doc.UpdatedBy = &updatedByID
	if err := s.docRepo.Update(ctx, doc); err != nil {
		return nil, err
	}

	return mapDocToResponse(doc), nil
}

func (s *contentService) UpdateDocumentationStatus(ctx context.Context, id uuid.UUID, status string, updatedByID uuid.UUID) (*dto.DocumentationResponse, error) {
	return s.UpdateDocumentation(ctx, id, dto.UpdateDocumentationRequest{Status: status}, updatedByID)
}

func (s *contentService) DeleteDocumentation(ctx context.Context, id uuid.UUID) error {
	_, err := s.docRepo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrDocumentationNotFound
		}
		return err
	}
	return s.docRepo.Delete(ctx, id)
}

func (s *contentService) ListDocumentationAdmin(ctx context.Context, filter dto.ListDocumentationFilter) (*dto.PaginatedDocumentationResponse, error) {
	limit := filter.Limit
	if limit <= 0 {
		limit = 20
	}
	offset := filter.Offset
	if offset < 0 {
		offset = 0
	}

	list, total, err := s.docRepo.List(ctx, filter)
	if err != nil {
		return nil, err
	}

	items := make([]dto.DocumentationResponse, len(list))
	for i := range list {
		items[i] = *mapDocToResponse(&list[i])
	}

	return &dto.PaginatedDocumentationResponse{
		Documentation: items,
		Total:         total,
		Limit:         limit,
		Offset:        offset,
	}, nil
}

func (s *contentService) ListDocumentationPublic(ctx context.Context, filter dto.ListDocumentationFilter) (*dto.PaginatedDocumentationResponse, error) {
	limit := filter.Limit
	if limit <= 0 {
		limit = 20
	}
	offset := filter.Offset
	if offset < 0 {
		offset = 0
	}

	list, total, err := s.docRepo.ListPublished(ctx, filter)
	if err != nil {
		return nil, err
	}

	items := make([]dto.DocumentationResponse, len(list))
	for i := range list {
		items[i] = *mapDocToResponse(&list[i])
	}

	return &dto.PaginatedDocumentationResponse{
		Documentation: items,
		Total:         total,
		Limit:         limit,
		Offset:        offset,
	}, nil
}

// ─── Testimonial Methods ─────────────────────────────────────────────────────

func (s *contentService) CreateTestimonial(ctx context.Context, req dto.CreateTestimonialRequest, userID *uuid.UUID) (*dto.TestimonialResponse, error) {
	t := &models.Testimonial{
		UserID:     userID,
		AuthorName: req.AuthorName,
		AuthorRole: req.AuthorRole,
		Content:    req.Content,
		Rating:     req.Rating,
		Status:     models.TestimonialStatusPending,
	}

	if err := s.testRepo.Create(ctx, t); err != nil {
		return nil, err
	}

	return mapTestimonialToResponse(t), nil
}

func (s *contentService) UpdateTestimonialStatus(ctx context.Context, id uuid.UUID, req dto.UpdateTestimonialStatusRequest) (*dto.TestimonialResponse, error) {
	t, err := s.testRepo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrTestimonialNotFound
		}
		return nil, err
	}

	status := models.TestimonialStatus(req.Status)
	if err := s.testRepo.UpdateStatus(ctx, id, status); err != nil {
		return nil, err
	}

	t.Status = status
	return mapTestimonialToResponse(t), nil
}

func (s *contentService) DeleteTestimonial(ctx context.Context, id uuid.UUID) error {
	_, err := s.testRepo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrTestimonialNotFound
		}
		return err
	}
	return s.testRepo.Delete(ctx, id)
}

func (s *contentService) ListTestimonialsAdmin(ctx context.Context, filter dto.ListTestimonialFilter) (*dto.PaginatedTestimonialsResponse, error) {
	limit := filter.Limit
	if limit <= 0 {
		limit = 20
	}
	offset := filter.Offset
	if offset < 0 {
		offset = 0
	}

	list, total, err := s.testRepo.List(ctx, filter)
	if err != nil {
		return nil, err
	}

	items := make([]dto.TestimonialResponse, len(list))
	for i := range list {
		items[i] = *mapTestimonialToResponse(&list[i])
	}

	return &dto.PaginatedTestimonialsResponse{
		Testimonials: items,
		Total:        total,
		Limit:        limit,
		Offset:       offset,
	}, nil
}

func (s *contentService) ListTestimonialsPublic(ctx context.Context, limit, offset int) (*dto.PaginatedTestimonialsResponse, error) {
	if limit <= 0 {
		limit = 20
	}
	if offset < 0 {
		offset = 0
	}

	list, total, err := s.testRepo.ListApproved(ctx, limit, offset)
	if err != nil {
		return nil, err
	}

	items := make([]dto.TestimonialResponse, len(list))
	for i := range list {
		items[i] = *mapTestimonialToResponse(&list[i])
	}

	return &dto.PaginatedTestimonialsResponse{
		Testimonials: items,
		Total:        total,
		Limit:        limit,
		Offset:       offset,
	}, nil
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

var nonAlphaRegex = regexp.MustCompile(`[^a-z0-9]+`)

func slugify(s string) string {
	lower := strings.ToLower(strings.TrimSpace(s))
	slug := nonAlphaRegex.ReplaceAllString(lower, "-")
	return strings.Trim(slug, "-")
}

func mapNewsToResponse(n *models.News) *dto.NewsResponse {
	return &dto.NewsResponse{
		ID:           n.ID,
		Title:        n.Title,
		Slug:         n.Slug,
		Content:      n.Content,
		ThumbnailURL: n.ThumbnailURL,
		Status:       string(n.Status),
		PublishedAt:  n.PublishedAt,
		CreatedBy:    n.CreatedBy,
		UpdatedBy:    n.UpdatedBy,
		CreatedAt:    n.CreatedAt,
		UpdatedAt:    n.UpdatedAt,
	}
}

func mapDocToResponse(d *models.Documentation) *dto.DocumentationResponse {
	return &dto.DocumentationResponse{
		ID:        d.ID,
		Title:     d.Title,
		Slug:      d.Slug,
		Content:   d.Content,
		Category:  d.Category,
		Status:    string(d.Status),
		CreatedBy: d.CreatedBy,
		UpdatedBy: d.UpdatedBy,
		CreatedAt: d.CreatedAt,
		UpdatedAt: d.UpdatedAt,
	}
}

func mapTestimonialToResponse(t *models.Testimonial) *dto.TestimonialResponse {
	return &dto.TestimonialResponse{
		ID:         t.ID,
		UserID:     t.UserID,
		AuthorName: t.AuthorName,
		AuthorRole: t.AuthorRole,
		Content:    t.Content,
		Rating:     t.Rating,
		Status:     string(t.Status),
		CreatedAt:  t.CreatedAt,
		UpdatedAt:  t.UpdatedAt,
	}
}
