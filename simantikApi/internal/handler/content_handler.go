package handler

import (
	"errors"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"simantikApi/internal/dto"
	"simantikApi/internal/middleware"
	"simantikApi/internal/service"
	"simantikApi/pkg/utils"
)

type ContentHandler struct {
	contentService service.ContentService
}

func NewContentHandler(contentService service.ContentService) *ContentHandler {
	return &ContentHandler{contentService: contentService}
}

// ─── News Endpoints ──────────────────────────────────────────────────────────

// CreateNews handles POST /api/v1/cms/news.
func (h *ContentHandler) CreateNews(c *fiber.Ctx) error {
	var req dto.CreateNewsRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if errs := utils.ValidateStruct(req); errs != nil {
		return utils.ValidationError(c, errs)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.contentService.CreateNews(c.UserContext(), req, userID)
	if err != nil {
		if errors.Is(err, service.ErrNewsSlugExists) {
			return utils.Error(c, fiber.StatusConflict, "news slug already in use", err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to create news", err)
	}

	return utils.Created(c, "news created successfully", res)
}

// GetNewsByID handles GET /api/v1/cms/news/:id.
func (h *ContentHandler) GetNewsByID(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid news id", err)
	}

	res, err := h.contentService.GetNewsByID(c.UserContext(), id)
	if err != nil {
		if errors.Is(err, service.ErrNewsNotFound) {
			return utils.Error(c, fiber.StatusNotFound, "news not found", err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to get news", err)
	}

	return utils.OK(c, "news retrieved successfully", res)
}

// GetNewsBySlug handles GET /api/v1/news/:slug.
func (h *ContentHandler) GetNewsBySlug(c *fiber.Ctx) error {
	slug := c.Params("slug")
	if slug == "" {
		return utils.Error(c, fiber.StatusBadRequest, "slug is required", errors.New("missing slug"))
	}

	res, err := h.contentService.GetNewsBySlug(c.UserContext(), slug)
	if err != nil {
		if errors.Is(err, service.ErrNewsNotFound) {
			return utils.Error(c, fiber.StatusNotFound, "news article not found", err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to get news", err)
	}

	return utils.OK(c, "news retrieved successfully", res)
}

// UpdateNews handles PATCH /api/v1/cms/news/:id.
func (h *ContentHandler) UpdateNews(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid news id", err)
	}

	var req dto.UpdateNewsRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if errs := utils.ValidateStruct(req); errs != nil {
		return utils.ValidationError(c, errs)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.contentService.UpdateNews(c.UserContext(), id, req, userID)
	if err != nil {
		if errors.Is(err, service.ErrNewsNotFound) {
			return utils.Error(c, fiber.StatusNotFound, "news not found", err)
		}
		if errors.Is(err, service.ErrNewsSlugExists) {
			return utils.Error(c, fiber.StatusConflict, "news slug already in use", err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to update news", err)
	}

	return utils.OK(c, "news updated successfully", res)
}

// UpdateNewsStatus handles PATCH /api/v1/cms/news/:id/status.
func (h *ContentHandler) UpdateNewsStatus(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid news id", err)
	}

	var req dto.UpdateNewsStatusRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if errs := utils.ValidateStruct(req); errs != nil {
		return utils.ValidationError(c, errs)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.contentService.UpdateNewsStatus(c.UserContext(), id, req.Status, userID)
	if err != nil {
		if errors.Is(err, service.ErrNewsNotFound) {
			return utils.Error(c, fiber.StatusNotFound, "news not found", err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to update news status", err)
	}

	return utils.OK(c, "news status updated successfully", res)
}

// DeleteNews handles DELETE /api/v1/cms/news/:id.
func (h *ContentHandler) DeleteNews(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid news id", err)
	}

	if err := h.contentService.DeleteNews(c.UserContext(), id); err != nil {
		if errors.Is(err, service.ErrNewsNotFound) {
			return utils.Error(c, fiber.StatusNotFound, "news not found", err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to delete news", err)
	}

	return utils.OK(c, "news deleted successfully", nil)
}

// ListNewsAdmin handles GET /api/v1/cms/news.
func (h *ContentHandler) ListNewsAdmin(c *fiber.Ctx) error {
	var filter dto.ListNewsFilter
	if err := c.QueryParser(&filter); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid query parameters", err)
	}

	res, err := h.contentService.ListNewsAdmin(c.UserContext(), filter)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to list news", err)
	}

	return utils.OK(c, "news list retrieved successfully", res)
}

// ListNewsPublic handles GET /api/v1/news.
func (h *ContentHandler) ListNewsPublic(c *fiber.Ctx) error {
	var filter dto.ListNewsFilter
	if err := c.QueryParser(&filter); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid query parameters", err)
	}

	res, err := h.contentService.ListNewsPublic(c.UserContext(), filter)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to list news", err)
	}

	return utils.OK(c, "published news retrieved successfully", res)
}

// ─── Documentation Endpoints ─────────────────────────────────────────────────

// CreateDocumentation handles POST /api/v1/cms/documentation.
func (h *ContentHandler) CreateDocumentation(c *fiber.Ctx) error {
	var req dto.CreateDocumentationRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if errs := utils.ValidateStruct(req); errs != nil {
		return utils.ValidationError(c, errs)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.contentService.CreateDocumentation(c.UserContext(), req, userID)
	if err != nil {
		if errors.Is(err, service.ErrDocumentationSlugExists) {
			return utils.Error(c, fiber.StatusConflict, "documentation slug already in use", err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to create documentation", err)
	}

	return utils.Created(c, "documentation created successfully", res)
}

// GetDocumentationByID handles GET /api/v1/cms/documentation/:id.
func (h *ContentHandler) GetDocumentationByID(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid documentation id", err)
	}

	res, err := h.contentService.GetDocumentationByID(c.UserContext(), id)
	if err != nil {
		if errors.Is(err, service.ErrDocumentationNotFound) {
			return utils.Error(c, fiber.StatusNotFound, "documentation not found", err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to get documentation", err)
	}

	return utils.OK(c, "documentation retrieved successfully", res)
}

// GetDocumentationBySlug handles GET /api/v1/documentation/:slug.
func (h *ContentHandler) GetDocumentationBySlug(c *fiber.Ctx) error {
	slug := c.Params("slug")
	if slug == "" {
		return utils.Error(c, fiber.StatusBadRequest, "slug is required", errors.New("missing slug"))
	}

	res, err := h.contentService.GetDocumentationBySlug(c.UserContext(), slug)
	if err != nil {
		if errors.Is(err, service.ErrDocumentationNotFound) {
			return utils.Error(c, fiber.StatusNotFound, "documentation not found", err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to get documentation", err)
	}

	return utils.OK(c, "documentation retrieved successfully", res)
}

// UpdateDocumentation handles PATCH /api/v1/cms/documentation/:id.
func (h *ContentHandler) UpdateDocumentation(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid documentation id", err)
	}

	var req dto.UpdateDocumentationRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if errs := utils.ValidateStruct(req); errs != nil {
		return utils.ValidationError(c, errs)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.contentService.UpdateDocumentation(c.UserContext(), id, req, userID)
	if err != nil {
		if errors.Is(err, service.ErrDocumentationNotFound) {
			return utils.Error(c, fiber.StatusNotFound, "documentation not found", err)
		}
		if errors.Is(err, service.ErrDocumentationSlugExists) {
			return utils.Error(c, fiber.StatusConflict, "documentation slug already in use", err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to update documentation", err)
	}

	return utils.OK(c, "documentation updated successfully", res)
}

// UpdateDocumentationStatus handles PATCH /api/v1/cms/documentation/:id/status.
func (h *ContentHandler) UpdateDocumentationStatus(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid documentation id", err)
	}

	var req dto.UpdateDocumentationStatusRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if errs := utils.ValidateStruct(req); errs != nil {
		return utils.ValidationError(c, errs)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.contentService.UpdateDocumentationStatus(c.UserContext(), id, req.Status, userID)
	if err != nil {
		if errors.Is(err, service.ErrDocumentationNotFound) {
			return utils.Error(c, fiber.StatusNotFound, "documentation not found", err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to update documentation status", err)
	}

	return utils.OK(c, "documentation status updated successfully", res)
}

// DeleteDocumentation handles DELETE /api/v1/cms/documentation/:id.
func (h *ContentHandler) DeleteDocumentation(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid documentation id", err)
	}

	if err := h.contentService.DeleteDocumentation(c.UserContext(), id); err != nil {
		if errors.Is(err, service.ErrDocumentationNotFound) {
			return utils.Error(c, fiber.StatusNotFound, "documentation not found", err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to delete documentation", err)
	}

	return utils.OK(c, "documentation deleted successfully", nil)
}

// ListDocumentationAdmin handles GET /api/v1/cms/documentation.
func (h *ContentHandler) ListDocumentationAdmin(c *fiber.Ctx) error {
	var filter dto.ListDocumentationFilter
	if err := c.QueryParser(&filter); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid query parameters", err)
	}

	res, err := h.contentService.ListDocumentationAdmin(c.UserContext(), filter)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to list documentation", err)
	}

	return utils.OK(c, "documentation retrieved successfully", res)
}

// ListDocumentationPublic handles GET /api/v1/documentation.
func (h *ContentHandler) ListDocumentationPublic(c *fiber.Ctx) error {
	var filter dto.ListDocumentationFilter
	if err := c.QueryParser(&filter); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid query parameters", err)
	}

	res, err := h.contentService.ListDocumentationPublic(c.UserContext(), filter)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to list documentation", err)
	}

	return utils.OK(c, "documentation retrieved successfully", res)
}

// ─── Testimonial Endpoints ───────────────────────────────────────────────────

// CreateTestimonial handles POST /api/v1/testimonials.
func (h *ContentHandler) CreateTestimonial(c *fiber.Ctx) error {
	var req dto.CreateTestimonialRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if errs := utils.ValidateStruct(req); errs != nil {
		return utils.ValidationError(c, errs)
	}

	var userID *uuid.UUID
	if uid, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID); ok && uid != uuid.Nil {
		userID = &uid
	}

	res, err := h.contentService.CreateTestimonial(c.UserContext(), req, userID)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to submit testimonial", err)
	}

	return utils.Created(c, "testimonial submitted successfully and is pending approval", res)
}

// ListTestimonialsPublic handles GET /api/v1/testimonials.
func (h *ContentHandler) ListTestimonialsPublic(c *fiber.Ctx) error {
	var filter dto.ListTestimonialFilter
	if err := c.QueryParser(&filter); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid query parameters", err)
	}

	limit := filter.Limit
	if limit <= 0 {
		limit = 20
	}

	res, err := h.contentService.ListTestimonialsPublic(c.UserContext(), limit, filter.Offset)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to list testimonials", err)
	}

	return utils.OK(c, "testimonials retrieved successfully", res)
}

// ListTestimonialsAdmin handles GET /api/v1/cms/testimonials.
func (h *ContentHandler) ListTestimonialsAdmin(c *fiber.Ctx) error {
	var filter dto.ListTestimonialFilter
	if err := c.QueryParser(&filter); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid query parameters", err)
	}

	res, err := h.contentService.ListTestimonialsAdmin(c.UserContext(), filter)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to list testimonials", err)
	}

	return utils.OK(c, "testimonials retrieved successfully", res)
}

// UpdateTestimonialStatus handles PATCH /api/v1/cms/testimonials/:id/status.
func (h *ContentHandler) UpdateTestimonialStatus(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid testimonial id", err)
	}

	var req dto.UpdateTestimonialStatusRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if errs := utils.ValidateStruct(req); errs != nil {
		return utils.ValidationError(c, errs)
	}

	res, err := h.contentService.UpdateTestimonialStatus(c.UserContext(), id, req)
	if err != nil {
		if errors.Is(err, service.ErrTestimonialNotFound) {
			return utils.Error(c, fiber.StatusNotFound, "testimonial not found", err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to update testimonial status", err)
	}

	return utils.OK(c, "testimonial status updated successfully", res)
}

// DeleteTestimonial handles DELETE /api/v1/cms/testimonials/:id.
func (h *ContentHandler) DeleteTestimonial(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid testimonial id", err)
	}

	if err := h.contentService.DeleteTestimonial(c.UserContext(), id); err != nil {
		if errors.Is(err, service.ErrTestimonialNotFound) {
			return utils.Error(c, fiber.StatusNotFound, "testimonial not found", err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to delete testimonial", err)
	}

	return utils.OK(c, "testimonial deleted successfully", nil)
}
