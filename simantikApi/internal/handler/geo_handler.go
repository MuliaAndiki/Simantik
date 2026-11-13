package handler

import (
	"errors"
	"strconv"

	"github.com/gofiber/fiber/v2"

	"simantikApi/internal/dto"
	"simantikApi/internal/service"
	"simantikApi/pkg/utils"
)

type GeoHandler struct {
	geoService service.GeoService
}

func NewGeoHandler(geoService service.GeoService) *GeoHandler {
	return &GeoHandler{geoService: geoService}
}

// SearchSchools handles GET /api/v1/geo/schools/search?q=...
func (h *GeoHandler) SearchSchools(c *fiber.Ctx) error {
	q := c.Query("q")
	places, err := h.geoService.SearchSchools(c.UserContext(), q)
	if err != nil {
		if errors.Is(err, service.ErrGeoUpstream) {
			return utils.Error(c, fiber.StatusBadGateway, "layanan pencarian peta sedang sibuk, coba lagi sebentar", err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to search school locations", err)
	}
	if places == nil {
		places = []dto.GeoPlace{}
	}
	return utils.OK(c, "school locations retrieved successfully", places)
}

// Reverse handles GET /api/v1/geo/reverse?lat=...&lon=...
func (h *GeoHandler) Reverse(c *fiber.Ctx) error {
	latStr := c.Query("lat")
	lonStr := c.Query("lon")
	lat, err := strconv.ParseFloat(latStr, 64)
	if err != nil || latStr == "" {
		return utils.Error(c, fiber.StatusBadRequest, "invalid latitude query parameter", errors.New("invalid lat"))
	}
	lon, err := strconv.ParseFloat(lonStr, 64)
	if err != nil || lonStr == "" {
		return utils.Error(c, fiber.StatusBadRequest, "invalid longitude query parameter", errors.New("invalid lon"))
	}

	place, err := h.geoService.Reverse(c.UserContext(), lat, lon)
	if err != nil {
		if errors.Is(err, service.ErrInvalidCoordinates) {
			return utils.Error(c, fiber.StatusBadRequest, "koordinat harus berada di wilayah Indonesia", err)
		}
		if errors.Is(err, service.ErrGeoNotFound) {
			return utils.Error(c, fiber.StatusNotFound, "wilayah tidak ditemukan pada koordinat tersebut", err)
		}
		if errors.Is(err, service.ErrGeoUpstream) {
			return utils.Error(c, fiber.StatusBadGateway, "layanan peta sedang sibuk, coba lagi sebentar", err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to reverse geocode coordinates", err)
	}

	return utils.OK(c, "location retrieved successfully", place)
}
