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

// StimulusHandler exposes HTTP endpoints for shared reading passages.
type StimulusHandler struct {
	stimulusService service.StimulusService
}

// NewStimulusHandler wires a StimulusHandler with a StimulusService.
func NewStimulusHandler(stimulusService service.StimulusService) *StimulusHandler {
	return &StimulusHandler{stimulusService: stimulusService}
}

func stimulusActorID(c *fiber.Ctx) (uuid.UUID, error) {
	actorID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return uuid.Nil, errors.New("missing user context")
	}
	return actorID, nil
}

// CreateStimulus handles POST /api/v1/stimuli.
func (h *StimulusHandler) CreateStimulus(c *fiber.Ctx) error {
	var req dto.CreateStimulusRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if errs := utils.ValidateStruct(req); errs != nil {
		return utils.ValidationError(c, errs)
	}

	actorID, err := stimulusActorID(c)
	if err != nil {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", err)
	}

	res, err := h.stimulusService.CreateStimulus(c.UserContext(), req, actorID)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to create stimulus", err)
	}
	return utils.Created(c, "stimulus created successfully", res)
}

// ListStimuli handles GET /api/v1/stimuli.
func (h *StimulusHandler) ListStimuli(c *fiber.Ctx) error {
	var filter dto.ListStimulusFilter
	if err := c.QueryParser(&filter); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid query parameters", err)
	}

	res, err := h.stimulusService.ListStimuli(c.UserContext(), filter)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to list stimuli", err)
	}
	return utils.Success(c, "stimuli fetched successfully", res)
}

// GetStimulus handles GET /api/v1/stimuli/:id.
func (h *StimulusHandler) GetStimulus(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid stimulus id", err)
	}

	res, err := h.stimulusService.GetStimulus(c.UserContext(), id)
	if err != nil {
		if errors.Is(err, service.ErrStimulusNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to fetch stimulus", err)
	}
	return utils.Success(c, "stimulus fetched successfully", res)
}

// UpdateStimulus handles PATCH /api/v1/stimuli/:id.
func (h *StimulusHandler) UpdateStimulus(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid stimulus id", err)
	}

	var req dto.UpdateStimulusRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if errs := utils.ValidateStruct(req); errs != nil {
		return utils.ValidationError(c, errs)
	}

	res, err := h.stimulusService.UpdateStimulus(c.UserContext(), id, req)
	if err != nil {
		if errors.Is(err, service.ErrStimulusNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to update stimulus", err)
	}
	return utils.Success(c, "stimulus updated successfully", res)
}

// DeleteStimulus handles DELETE /api/v1/stimuli/:id (links dissolve, questions stay).
func (h *StimulusHandler) DeleteStimulus(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid stimulus id", err)
	}

	if err := h.stimulusService.DeleteStimulus(c.UserContext(), id); err != nil {
		if errors.Is(err, service.ErrStimulusNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to delete stimulus", err)
	}
	return utils.Success(c, "stimulus deleted successfully", nil)
}

// LinkQuestion handles POST /api/v1/stimuli/:id/questions (max 3, hard cap).
func (h *StimulusHandler) LinkQuestion(c *fiber.Ctx) error {
	stimulusID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid stimulus id", err)
	}

	var req dto.LinkStimulusQuestionRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if errs := utils.ValidateStruct(req); errs != nil {
		return utils.ValidationError(c, errs)
	}

	res, err := h.stimulusService.LinkQuestionToStimulus(c.UserContext(), stimulusID, req.QuestionID)
	if err != nil {
		if errors.Is(err, service.ErrStimulusNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		if errors.Is(err, service.ErrStimulusFull) {
			return utils.Error(c, fiber.StatusConflict, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to link question", err)
	}

	message := "question linked to stimulus successfully"
	if res.Warning != "" {
		message += " (" + res.Warning + ")"
	}
	return utils.Success(c, message, res)
}

// UnlinkQuestion handles DELETE /api/v1/stimuli/questions/:questionId.
func (h *StimulusHandler) UnlinkQuestion(c *fiber.Ctx) error {
	questionID, err := uuid.Parse(c.Params("questionId"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid question id", err)
	}

	if err := h.stimulusService.UnlinkQuestionFromStimulus(c.UserContext(), questionID); err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to unlink question", err)
	}
	return utils.Success(c, "question unlinked from stimulus successfully", nil)
}

// BackfillStimuli handles POST /api/v1/admin/stimuli/backfill (admin only, one-off).
func (h *StimulusHandler) BackfillStimuli(c *fiber.Ctx) error {
	actorID, err := stimulusActorID(c)
	if err != nil {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", err)
	}

	created, linked, err := h.stimulusService.BackfillStimuliFromMarkers(c.UserContext(), actorID)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "stimulus backfill failed", err)
	}
	return utils.Success(c, "stimulus backfill completed successfully", fiber.Map{
		"stimuli_created":  created,
		"questions_linked": linked,
	})
}
