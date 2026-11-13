package service_test

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"sync/atomic"
	"testing"

	"golang.org/x/time/rate"

	"simantikApi/internal/service"
)

func TestMapNominatimAddress(t *testing.T) {
	prov, kab, kec := service.MapNominatimAddress(map[string]string{
		"state":        "Jawa Barat",
		"county":       "Kabupaten Bandung",
		"city_district": "Cimenyan",
	})
	if prov != "Jawa Barat" || kab != "Kabupaten Bandung" || kec != "Cimenyan" {
		t.Fatalf("unexpected mapping: prov=%q kab=%q kec=%q", prov, kab, kec)
	}

	prov2, kab2, kec2 := service.MapNominatimAddress(map[string]string{
		"region":   "DKI Jakarta",
		"city":     "Kota Jakarta Selatan",
		"suburb":   "Kebayoran Baru",
	})
	if prov2 != "DKI Jakarta" || kab2 != "Kota Jakarta Selatan" || kec2 != "Kebayoran Baru" {
		t.Fatalf("unexpected fallback mapping: prov=%q kab=%q kec=%q", prov2, kab2, kec2)
	}
}

func TestGeoService_SearchSchools_FiltersNonSchoolAndCaches(t *testing.T) {
	var hits atomic.Int32
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		hits.Add(1)
		if got := r.Header.Get("User-Agent"); got != "SIMANTIK-Test/1.0" {
			t.Errorf("expected User-Agent SIMANTIK-Test/1.0, got %q", got)
		}
		if r.URL.Path != "/search" {
			t.Errorf("expected /search path, got %q", r.URL.Path)
		}
		if got := r.URL.Query().Get("countrycodes"); got != "id" {
			t.Errorf("expected countrycodes=id, got %q", got)
		}
		_ = json.NewEncoder(w).Encode([]map[string]any{
			{
				"name":         "SMAN 1 Bandung",
				"display_name": "SMAN 1 Bandung, Jalan Ir. H. Djuanda, Coblong, Kota Bandung, Jawa Barat",
				"lat":          "-6.890212",
				"lon":          "107.613145",
				"class":        "amenity",
				"type":         "school",
				"address": map[string]string{
					"state":         "Jawa Barat",
					"city":          "Kota Bandung",
					"city_district": "Coblong",
				},
			},
			{
				"name":         "Warung Kopi Bandung",
				"display_name": "Warung Kopi Bandung, Jalan Ir. H. Djuanda",
				"lat":          "-6.890500",
				"lon":          "107.613500",
				"class":        "amenity",
				"type":         "cafe",
				"address": map[string]string{
					"state": "Jawa Barat",
					"city":  "Kota Bandung",
				},
			},
		})
	}))
	defer srv.Close()

	svc := service.NewGeoServiceWithLimiter(srv.URL, "SIMANTIK-Test/1.0", rate.Inf, 1)
	ctx := context.Background()

	// Short queries return empty without calling upstream
	shortRes, err := svc.SearchSchools(ctx, "SM")
	if err != nil || len(shortRes) != 0 {
		t.Fatalf("expected empty result for <3 chars, got %+v, err=%v", shortRes, err)
	}
	if hits.Load() != 0 {
		t.Fatalf("expected 0 upstream hits for short query, got %d", hits.Load())
	}

	// First full query calls upstream once and filters out non-school amenity
	res, err := svc.SearchSchools(ctx, "SMAN 1 Bandung")
	if err != nil {
		t.Fatalf("search failed: %v", err)
	}
	if len(res) != 1 {
		t.Fatalf("expected 1 filtered school result, got %d (%+v)", len(res), res)
	}
	if res[0].Name != "SMAN 1 Bandung" || res[0].Provinsi != "Jawa Barat" || res[0].Kabupaten != "Kota Bandung" || res[0].Kecamatan != "Coblong" {
		t.Fatalf("unexpected mapped place: %+v", res[0])
	}

	// Repeated query (different casing/spacing) hits cache -> still only 1 upstream call
	res2, err := svc.SearchSchools(ctx, "  sman   1  bandung ")
	if err != nil {
		t.Fatalf("cached search failed: %v", err)
	}
	if len(res2) != 1 || res2[0].Name != "SMAN 1 Bandung" {
		t.Fatalf("unexpected cached result: %+v", res2)
	}
	if hits.Load() != 1 {
		t.Fatalf("expected 1 upstream hit total due to cache, got %d", hits.Load())
	}
}

func TestGeoService_Reverse_AndErrors(t *testing.T) {
	var hits atomic.Int32
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		hits.Add(1)
		if r.URL.Query().Get("lat") == "-6.175390" {
			w.WriteHeader(http.StatusServiceUnavailable)
			return
		}
		_ = json.NewEncoder(w).Encode(map[string]any{
			"name":         "SMA Negeri 3 Jakarta",
			"display_name": "SMA Negeri 3 Jakarta, Setiabudi, Jakarta Selatan, DKI Jakarta",
			"lat":          "-6.210234",
			"lon":          "106.832111",
			"address": map[string]string{
				"state":         "Daerah Khusus Ibukota Jakarta",
				"city":          "Jakarta Selatan",
				"city_district": "Setiabudi",
			},
		})
	}))
	defer srv.Close()

	svc := service.NewGeoServiceWithLimiter(srv.URL, "SIMANTIK-Test/1.0", rate.Inf, 1)
	ctx := context.Background()

	// Out-of-Indonesia bounds rejected before hitting upstream
	if _, err := svc.Reverse(ctx, 48.8566, 2.3522); !errors.Is(err, service.ErrInvalidCoordinates) {
		t.Fatalf("expected ErrInvalidCoordinates, got %v", err)
	}
	if hits.Load() != 0 {
		t.Fatalf("expected 0 upstream hits for out-of-bounds coords, got %d", hits.Load())
	}

	// Valid reverse call succeeds and maps fields
	place, err := svc.Reverse(ctx, -6.210234, 106.832111)
	if err != nil {
		t.Fatalf("reverse failed: %v", err)
	}
	if place.Provinsi != "Daerah Khusus Ibukota Jakarta" || place.Kabupaten != "Jakarta Selatan" || place.Kecamatan != "Setiabudi" {
		t.Fatalf("unexpected reverse regions: %+v", place)
	}

	// Cached when rounded to 5 decimals
	if _, err := svc.Reverse(ctx, -6.2102344, 106.8321114); err != nil {
		t.Fatalf("cached reverse failed: %v", err)
	}
	if hits.Load() != 1 {
		t.Fatalf("expected cache hit on 5-decimal match, got %d upstream hits", hits.Load())
	}

	// Upstream 503 maps to ErrGeoUpstream
	if _, err := svc.Reverse(ctx, -6.175390, 106.827153); !errors.Is(err, service.ErrGeoUpstream) {
		t.Fatalf("expected ErrGeoUpstream, got %v", err)
	}
}
