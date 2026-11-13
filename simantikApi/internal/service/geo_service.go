package service

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"sync"
	"time"

	"golang.org/x/time/rate"

	"simantikApi/internal/dto"
)

const (
	defaultNominatimBaseURL = "https://nominatim.openstreetmap.org"
	defaultGeoUserAgent     = "SIMANTIK/1.0 (+https://simantik.id)"
	geoCacheTTL             = 15 * time.Minute
	geoCacheMaxEntries      = 500
	geoHTTPTimeout          = 6 * time.Second
)

type GeoService interface {
	SearchSchools(ctx context.Context, q string) ([]dto.GeoPlace, error)
	Reverse(ctx context.Context, lat, lon float64) (*dto.GeoPlace, error)
}

type geoCacheEntry[T any] struct {
	value     T
	expiresAt time.Time
}

type geoCache[T any] struct {
	mu      sync.RWMutex
	entries map[string]geoCacheEntry[T]
	maxSize int
	ttl     time.Duration
}

func newGeoCache[T any](maxSize int, ttl time.Duration) *geoCache[T] {
	return &geoCache[T]{
		entries: make(map[string]geoCacheEntry[T]),
		maxSize: maxSize,
		ttl:     ttl,
	}
}

func (c *geoCache[T]) get(key string) (T, bool) {
	var zero T
	c.mu.RLock()
	entry, ok := c.entries[key]
	c.mu.RUnlock()
	if !ok {
		return zero, false
	}
	if time.Now().After(entry.expiresAt) {
		c.mu.Lock()
		delete(c.entries, key)
		c.mu.Unlock()
		return zero, false
	}
	return entry.value, true
}

func (c *geoCache[T]) set(key string, val T) {
	now := time.Now()
	c.mu.Lock()
	defer c.mu.Unlock()

	if len(c.entries) >= c.maxSize {
		for k, v := range c.entries {
			if now.After(v.expiresAt) {
				delete(c.entries, k)
			}
		}
		for k := range c.entries {
			if len(c.entries) < c.maxSize {
				break
			}
			delete(c.entries, k)
		}
	}

	c.entries[key] = geoCacheEntry[T]{
		value:     val,
		expiresAt: now.Add(c.ttl),
	}
}

type geoService struct {
	baseURL     string
	userAgent   string
	client      *http.Client
	limiter     *rate.Limiter
	searchCache *geoCache[[]dto.GeoPlace]
	revCache    *geoCache[dto.GeoPlace]
}

// NewGeoService creates a Nominatim geocoding proxy enforcing a 1 req/s upstream
// rate limit, a 6-second timeout, a custom User-Agent, and an in-memory TTL cache.
func NewGeoService(baseURL, userAgent string) GeoService {
	return NewGeoServiceWithLimiter(baseURL, userAgent, rate.Limit(1), 1)
}

// NewGeoServiceWithLimiter allows configuring the upstream rate limiter (useful in tests).
func NewGeoServiceWithLimiter(baseURL, userAgent string, r rate.Limit, burst int) GeoService {
	trimmedBase := strings.TrimRight(strings.TrimSpace(baseURL), "/")
	if trimmedBase == "" {
		trimmedBase = defaultNominatimBaseURL
	}
	trimmedUA := strings.TrimSpace(userAgent)
	if trimmedUA == "" {
		trimmedUA = defaultGeoUserAgent
	}

	return &geoService{
		baseURL:     trimmedBase,
		userAgent:   trimmedUA,
		client:      &http.Client{Timeout: geoHTTPTimeout},
		limiter:     rate.NewLimiter(r, burst),
		searchCache: newGeoCache[[]dto.GeoPlace](geoCacheMaxEntries, geoCacheTTL),
		revCache:    newGeoCache[dto.GeoPlace](geoCacheMaxEntries, geoCacheTTL),
	}
}

type nominatimPlace struct {
	Name        string            `json:"name"`
	DisplayName string            `json:"display_name"`
	Lat         string            `json:"lat"`
	Lon         string            `json:"lon"`
	Class       string            `json:"class"`
	Category    string            `json:"category"`
	Type        string            `json:"type"`
	Address     map[string]string `json:"address"`
	Error       string            `json:"error"`
}

func (s *geoService) SearchSchools(ctx context.Context, q string) ([]dto.GeoPlace, error) {
	normalized := strings.ToLower(strings.Join(strings.Fields(strings.TrimSpace(q)), " "))
	if len([]rune(normalized)) < 3 {
		return []dto.GeoPlace{}, nil
	}

	if cached, ok := s.searchCache.get("s:" + normalized); ok {
		return cached, nil
	}

	if err := s.limiter.Wait(ctx); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrGeoUpstream, err)
	}

	params := url.Values{}
	params.Set("q", normalized)
	params.Set("format", "jsonv2")
	params.Set("countrycodes", "id")
	params.Set("addressdetails", "1")
	params.Set("accept-language", "id")
	params.Set("limit", "8")

	endpoint := fmt.Sprintf("%s/search?%s", s.baseURL, params.Encode())
	var raw []nominatimPlace
	if err := s.doRequest(ctx, endpoint, &raw); err != nil {
		return nil, err
	}

	places := make([]dto.GeoPlace, 0, len(raw))
	for _, item := range raw {
		if !isSchoolNominatimItem(item) {
			continue
		}
		place, ok := nominatimToGeoPlace(item)
		if !ok {
			continue
		}
		places = append(places, place)
	}

	s.searchCache.set("s:"+normalized, places)
	return places, nil
}

func (s *geoService) Reverse(ctx context.Context, lat, lon float64) (*dto.GeoPlace, error) {
	if err := validateIndonesiaCoordinates(&lat, &lon); err != nil {
		return nil, err
	}

	cacheKey := fmt.Sprintf("r:%.5f,%.5f", lat, lon)
	if cached, ok := s.revCache.get(cacheKey); ok {
		copied := cached
		return &copied, nil
	}

	if err := s.limiter.Wait(ctx); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrGeoUpstream, err)
	}

	params := url.Values{}
	params.Set("format", "jsonv2")
	params.Set("lat", strconv.FormatFloat(lat, 'f', 6, 64))
	params.Set("lon", strconv.FormatFloat(lon, 'f', 6, 64))
	params.Set("addressdetails", "1")
	params.Set("accept-language", "id")

	endpoint := fmt.Sprintf("%s/reverse?%s", s.baseURL, params.Encode())
	var raw nominatimPlace
	if err := s.doRequest(ctx, endpoint, &raw); err != nil {
		return nil, err
	}
	if raw.Error != "" {
		return nil, ErrGeoNotFound
	}

	place, ok := nominatimToGeoPlace(raw)
	if !ok {
		return nil, ErrGeoNotFound
	}

	s.revCache.set(cacheKey, place)
	copied := place
	return &copied, nil
}

func (s *geoService) doRequest(ctx context.Context, endpoint string, target any) error {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	if err != nil {
		return fmt.Errorf("%w: %v", ErrGeoUpstream, err)
	}
	req.Header.Set("User-Agent", s.userAgent)
	req.Header.Set("Accept", "application/json")

	resp, err := s.client.Do(req)
	if err != nil {
		return fmt.Errorf("%w: %v", ErrGeoUpstream, err)
	}
	defer func() {
		_ = resp.Body.Close()
	}()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("%w: status %d", ErrGeoUpstream, resp.StatusCode)
	}

	if err := json.NewDecoder(resp.Body).Decode(target); err != nil {
		return fmt.Errorf("%w: decode error: %v", ErrGeoUpstream, err)
	}
	return nil
}

func isSchoolNominatimItem(item nominatimPlace) bool {
	class := item.Class
	if class == "" {
		class = item.Category
	}
	if !strings.EqualFold(class, "amenity") {
		return false
	}
	switch strings.ToLower(item.Type) {
	case "school", "kindergarten", "college":
		return true
	default:
		return false
	}
}

func nominatimToGeoPlace(item nominatimPlace) (dto.GeoPlace, bool) {
	lat, err := strconv.ParseFloat(strings.TrimSpace(item.Lat), 64)
	if err != nil {
		return dto.GeoPlace{}, false
	}
	lon, err := strconv.ParseFloat(strings.TrimSpace(item.Lon), 64)
	if err != nil {
		return dto.GeoPlace{}, false
	}

	provinsi, kabupaten, kecamatan := MapNominatimAddress(item.Address)

	name := strings.TrimSpace(item.Name)
	if name == "" {
		name = firstNonEmpty(item.Address["amenity"], item.Address["school"])
	}
	if name == "" && item.DisplayName != "" {
		name = strings.TrimSpace(strings.SplitN(item.DisplayName, ",", 2)[0])
	}

	return dto.GeoPlace{
		Name:        name,
		DisplayName: strings.TrimSpace(item.DisplayName),
		Latitude:    lat,
		Longitude:   lon,
		Provinsi:    provinsi,
		Kabupaten:   kabupaten,
		Kecamatan:   kecamatan,
	}, true
}

// MapNominatimAddress extracts Indonesian administrative hierarchy (Provinsi,
// Kabupaten/Kota, Kecamatan) from Nominatim's address object.
func MapNominatimAddress(addr map[string]string) (provinsi, kabupaten, kecamatan string) {
	if len(addr) == 0 {
		return "", "", ""
	}
	provinsi = firstNonEmpty(addr["state"], addr["region"])
	kabupaten = firstNonEmpty(addr["county"], addr["city"], addr["municipality"], addr["state_district"])
	kecamatan = firstNonEmpty(addr["city_district"], addr["district"], addr["suburb"])
	return provinsi, kabupaten, kecamatan
}

func firstNonEmpty(values ...string) string {
	for _, v := range values {
		if trimmed := strings.TrimSpace(v); trimmed != "" {
			return trimmed
		}
	}
	return ""
}
