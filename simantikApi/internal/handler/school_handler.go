package handler

import (
	"errors"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"simantikApi/internal/dto"
	"simantikApi/internal/service"
	"simantikApi/pkg/utils"
)

type SchoolHandler struct {
	schoolService service.SchoolService
}

func NewSchoolHandler(schoolService service.SchoolService) *SchoolHandler {
	return &SchoolHandler{schoolService: schoolService}
}

// CreateSchool handles POST /api/v1/admin/schools.
func (h *SchoolHandler) CreateSchool(c *fiber.Ctx) error {
	var req dto.CreateSchoolRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if errs := utils.ValidateStruct(req); errs != nil {
		return utils.ValidationError(c, errs)
	}

	res, err := h.schoolService.CreateSchool(c.UserContext(), req)
	if err != nil {
		if errors.Is(err, service.ErrSchoolNPSNExists) {
			return utils.Error(c, fiber.StatusConflict, "school NPSN already registered", err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to create school", err)
	}

	return utils.Created(c, "school created successfully", res)
}

// ListSchools handles GET /api/v1/admin/schools.
func (h *SchoolHandler) ListSchools(c *fiber.Ctx) error {
	var filter dto.ListSchoolFilter
	if err := c.QueryParser(&filter); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid query parameters", err)
	}

	res, err := h.schoolService.ListSchools(c.UserContext(), filter)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to retrieve schools", err)
	}

	return utils.OK(c, "schools retrieved successfully", res)
}

// GetSchool handles GET /api/v1/admin/schools/:id.
func (h *SchoolHandler) GetSchool(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid school id", err)
	}

	res, err := h.schoolService.GetSchoolByID(c.UserContext(), id)
	if err != nil {
		if errors.Is(err, service.ErrSchoolNotFound) {
			return utils.Error(c, fiber.StatusNotFound, "school not found", err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to retrieve school", err)
	}

	return utils.OK(c, "school retrieved successfully", res)
}

// UpdateSchool handles PATCH /api/v1/admin/schools/:id.
func (h *SchoolHandler) UpdateSchool(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid school id", err)
	}

	var req dto.UpdateSchoolRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if errs := utils.ValidateStruct(req); errs != nil {
		return utils.ValidationError(c, errs)
	}

	res, err := h.schoolService.UpdateSchool(c.UserContext(), id, req)
	if err != nil {
		if errors.Is(err, service.ErrSchoolNotFound) {
			return utils.Error(c, fiber.StatusNotFound, "school not found", err)
		}
		if errors.Is(err, service.ErrSchoolNPSNExists) {
			return utils.Error(c, fiber.StatusConflict, "school NPSN already registered", err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to update school", err)
	}

	return utils.OK(c, "school updated successfully", res)
}

// DeleteSchool handles DELETE /api/v1/admin/schools/:id.
func (h *SchoolHandler) DeleteSchool(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid school id", err)
	}

	if err := h.schoolService.DeleteSchool(c.UserContext(), id); err != nil {
		if errors.Is(err, service.ErrSchoolNotFound) {
			return utils.Error(c, fiber.StatusNotFound, "school not found", err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to delete school", err)
	}

	return utils.OK(c, "school deleted successfully", nil)
}
