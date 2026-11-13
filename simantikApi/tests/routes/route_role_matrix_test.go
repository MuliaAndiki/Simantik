package routes_test

// Matrix pengunci batas role admin vs content_manager vs student.
//
// Harness memakai routing ASLI (routes.Register) dengan service nil + DB nil.
// Request yang lolos guard akan jatuh ke handler nil-service dan berakhir
// 4xx/5xx non-403 (panic ditangkap RecoverMiddleware) — yang diassert hanya:
// allow      -> status BUKAN 401/403 (guard lolos)
// deny-role  -> 403 (RequireRoles menolak)
// deny-auth  -> 401 (tanpa token / secret salah)
//
// UBAH TEST INI HANYA bila matrix role memang diputuskan berubah (Fase 0).

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"simantikApi/config"
	"simantikApi/internal/handler"
	"simantikApi/internal/middleware"
	"simantikApi/internal/routes"
	"simantikApi/pkg/utils"
)

const (
	testAPISecret = "test-api-secret"
	testJWTSecret = "test-jwt-secret-for-role-matrix"
)

func newRoleMatrixApp() *fiber.App {
	cfg := &config.Config{
		AppEnv:          "test",
		APISecret:       testAPISecret,
		JWTSecret:       testJWTSecret,
		OtelServiceName: "role-matrix-test",
	}
	app := fiber.New()
	app.Use(middleware.RecoverMiddleware())
	routes.Register(app, cfg, &routes.Handlers{
		Auth:           handler.NewAuthHandler(nil, cfg),
		User:           handler.NewUserHandler(nil),
		Question:       handler.NewQuestionHandler(nil),
		Tryout:         handler.NewTryoutHandler(nil),
		TryoutAttempt:  handler.NewTryoutAttemptHandler(nil),
		Evaluation:     handler.NewEvaluationHandler(nil),
		Recommendation: handler.NewRecommendationHandler(nil),
		Learning:       handler.NewLearningHandler(nil),
		Admin:          handler.NewAdminHandler(nil),
		Content:        handler.NewContentHandler(nil),
		Notification:   handler.NewNotificationHandler(nil),
		Reporting:      handler.NewReportingHandler(nil),
		School:         handler.NewSchoolHandler(nil),
		Geo:            handler.NewGeoHandler(nil),
		Practice:       handler.NewPracticeHandler(nil),
		System:         handler.NewSystemHandler(nil, cfg),
		Stimulus:       handler.NewStimulusHandler(nil),
	})
	return app
}

func tokenForRole(t *testing.T, role string) string {
	t.Helper()
	tok, err := utils.GenerateToken(testJWTSecret, uuid.New(), role, time.Hour)
	if err != nil {
		t.Fatalf("GenerateToken failed: %v", err)
	}
	return tok
}

type matrixCase struct {
	name   string
	method string
	path   string
	// allowed[i] sejajar dengan roles[i]: true = guard lolos (bukan 401/403)
	roles   []string
	allowed []bool
}

func TestRouteRoleMatrix(t *testing.T) {
	app := newRoleMatrixApp()
	id := uuid.NewString()

	adminOnly := []string{"admin", "content_manager", "student"}
	adminOnlyAllow := []bool{true, false, false}

	shared := []string{"admin", "content_manager", "student"}
	sharedAllow := []bool{true, true, false}

	cases := []matrixCase{
		// ─── Admin saja ───
		{"AdminDashboard", "GET", "/api/v1/admin/dashboard", adminOnly, adminOnlyAllow},
		{"AdminListUsers", "GET", "/api/v1/admin/users", adminOnly, adminOnlyAllow},
		{"AdminListSchools", "GET", "/api/v1/admin/schools/", adminOnly, adminOnlyAllow},
		{"AdminBroadcast", "POST", "/api/v1/admin/notifications/broadcast", adminOnly, adminOnlyAllow},
		{"SystemInfo", "GET", "/api/v1/system/info", adminOnly, adminOnlyAllow},
		{"UsersList", "GET", "/api/v1/users/", adminOnly, adminOnlyAllow},
		{"TryoutDelete", "DELETE", "/api/v1/tryouts/" + id, adminOnly, adminOnlyAllow},
		{"PracticePackageDelete", "DELETE", "/api/v1/practice-packages/" + id, adminOnly, adminOnlyAllow},
		{"QuestionDelete", "DELETE", "/api/v1/questions/" + id, adminOnly, adminOnlyAllow},
		{"CMSNewsDelete", "DELETE", "/api/v1/cms/news/" + id, adminOnly, adminOnlyAllow},
		{"CMSDocDelete", "DELETE", "/api/v1/cms/documentation/" + id, adminOnly, adminOnlyAllow},
		{"CMSTestimoniDelete", "DELETE", "/api/v1/cms/testimonials/" + id, adminOnly, adminOnlyAllow},

		// ─── Berbagi admin + content_manager ───
		{"QuestionCreate", "POST", "/api/v1/questions/", shared, sharedAllow},
		{"QuestionBulk", "POST", "/api/v1/questions/bulk", shared, sharedAllow},
		{"QuestionStatus", "PATCH", "/api/v1/questions/" + id + "/status", shared, sharedAllow},
		{"CompetencyCreate", "POST", "/api/v1/competencies/", shared, sharedAllow},
		{"CompetencyDelete", "DELETE", "/api/v1/competencies/" + id, shared, sharedAllow},
		{"TryoutCreate", "POST", "/api/v1/tryouts/", shared, sharedAllow},
		{"TryoutStatus", "PATCH", "/api/v1/tryouts/" + id + "/status", shared, sharedAllow},
		{"TryoutResults", "GET", "/api/v1/tryouts/" + id + "/results", shared, sharedAllow},
		{"ModuleCreate", "POST", "/api/v1/learning-modules/", shared, sharedAllow},
		{"ModuleDelete", "DELETE", "/api/v1/learning-modules/" + id, shared, sharedAllow},
		{"MaterialCreate", "POST", "/api/v1/materials/", shared, sharedAllow},
		{"MaterialDelete", "DELETE", "/api/v1/materials/" + id, shared, sharedAllow},
		{"MaterialActivities", "GET", "/api/v1/materials/" + id + "/activities", shared, sharedAllow},
		{"PracticePackageCreate", "POST", "/api/v1/practice-packages/", shared, sharedAllow},
		{"PracticePackageStatus", "PATCH", "/api/v1/practice-packages/" + id + "/status", shared, sharedAllow},
		{"PracticePackageResults", "GET", "/api/v1/practice-packages/" + id + "/results", shared, sharedAllow},
		{"CMSNewsList", "GET", "/api/v1/cms/news", shared, sharedAllow},
		{"CMSNewsCreate", "POST", "/api/v1/cms/news", shared, sharedAllow},
		{"CMSDocList", "GET", "/api/v1/cms/documentation", shared, sharedAllow},
		{"CMSTestimonials", "GET", "/api/v1/cms/testimonials", shared, sharedAllow},
		{"StimulusList", "GET", "/api/v1/stimuli/", shared, sharedAllow},
		{"StimulusCreate", "POST", "/api/v1/stimuli/", shared, sharedAllow},
		{"StimulusGet", "GET", "/api/v1/stimuli/" + id, shared, sharedAllow},
		{"StimulusUpdate", "PATCH", "/api/v1/stimuli/" + id, shared, sharedAllow},
		{"StimulusLink", "POST", "/api/v1/stimuli/" + id + "/questions", shared, sharedAllow},
		{"StimulusUnlink", "DELETE", "/api/v1/stimuli/questions/" + id, shared, sharedAllow},
		{"StimulusDelete", "DELETE", "/api/v1/stimuli/" + id, shared, sharedAllow},
		{"StimulusBackfill", "POST", "/api/v1/admin/stimuli/backfill", adminOnly, adminOnlyAllow},
		{"ReportsOverview", "GET", "/api/v1/admin/reports/overview", shared, sharedAllow},
		{"ReportsCompetencies", "GET", "/api/v1/admin/reports/competencies", shared, sharedAllow},
		{"ReportsDifficulties", "GET", "/api/v1/admin/reports/difficulties", shared, sharedAllow},

		// ─── Semua role login (termasuk student) ───
		{"QuestionList", "GET", "/api/v1/questions/", []string{"admin", "content_manager", "student"}, []bool{true, true, true}},
		{"TryoutList", "GET", "/api/v1/tryouts/", []string{"admin", "content_manager", "student"}, []bool{true, true, true}},
		{"MyAttempts", "GET", "/api/v1/attempts/", []string{"admin", "content_manager", "student"}, []bool{true, true, true}},
		{"MyProgress", "GET", "/api/v1/learning-progress", []string{"admin", "content_manager", "student"}, []bool{true, true, true}},
		{"MyNotifications", "GET", "/api/v1/notifications/", []string{"admin", "content_manager", "student"}, []bool{true, true, true}},
		{"MyProfile", "GET", "/api/v1/users/me", []string{"admin", "content_manager", "student"}, []bool{true, true, true}},
		{"GeoSchoolsSearch", "GET", "/api/v1/geo/schools/search?q=SMA", []string{"admin", "content_manager", "student"}, []bool{true, true, true}},
		{"GeoReverse", "GET", "/api/v1/geo/reverse?lat=-6.2&lon=106.8", []string{"admin", "content_manager", "student"}, []bool{true, true, true}},
		{"MyTestimonialStatus", "GET", "/api/v1/testimonials/me/status", []string{"admin", "content_manager", "student"}, []bool{true, true, true}},
	}

	for _, tc := range cases {
		for i, role := range tc.roles {
			name := fmt.Sprintf("%s/%s", tc.name, role)
			t.Run(name, func(t *testing.T) {
				req := httptest.NewRequest(tc.method, tc.path, nil)
				req.Header.Set("X-Internal-Api-Key", testAPISecret)
				req.Header.Set("Authorization", "Bearer "+tokenForRole(t, role))

				resp, err := app.Test(req, 5000)
				if err != nil {
					t.Fatalf("app.Test failed: %v", err)
				}
				defer resp.Body.Close()

				blocked := resp.StatusCode == http.StatusUnauthorized || resp.StatusCode == http.StatusForbidden
				if tc.allowed[i] && blocked {
					t.Errorf("%s %s role=%s: expected guard PASS, got %d", tc.method, tc.path, role, resp.StatusCode)
				}
				if !tc.allowed[i] && resp.StatusCode != http.StatusForbidden {
					t.Errorf("%s %s role=%s: expected 403, got %d", tc.method, tc.path, role, resp.StatusCode)
				}
			})
		}
	}
}

func TestRouteRoleMatrix_NoAuth(t *testing.T) {
	app := newRoleMatrixApp()

	t.Run("HealthPublic", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/health", nil)
		resp, err := app.Test(req, 5000)
		if err != nil {
			t.Fatalf("app.Test failed: %v", err)
		}
		defer resp.Body.Close()
		if resp.StatusCode != http.StatusOK {
			t.Errorf("expected 200, got %d", resp.StatusCode)
		}
	})

	t.Run("DashboardTanpaToken", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/api/v1/admin/dashboard", nil)
		req.Header.Set("X-Internal-Api-Key", testAPISecret)
		resp, err := app.Test(req, 5000)
		if err != nil {
			t.Fatalf("app.Test failed: %v", err)
		}
		defer resp.Body.Close()
		if resp.StatusCode != http.StatusUnauthorized {
			t.Errorf("expected 401, got %d", resp.StatusCode)
		}
	})

	t.Run("SecretSalah", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/api/v1/admin/dashboard", nil)
		req.Header.Set("X-Internal-Api-Key", "salah")
		req.Header.Set("Authorization", "Bearer "+tokenForRole(t, "admin"))
		resp, err := app.Test(req, 5000)
		if err != nil {
			t.Fatalf("app.Test failed: %v", err)
		}
		defer resp.Body.Close()
		if resp.StatusCode != http.StatusUnauthorized {
			t.Errorf("expected 401, got %d", resp.StatusCode)
		}
	})

	t.Run("GeoTanpaToken", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/api/v1/geo/schools/search?q=SMA", nil)
		req.Header.Set("X-Internal-Api-Key", testAPISecret)
		resp, err := app.Test(req, 5000)
		if err != nil {
			t.Fatalf("app.Test failed: %v", err)
		}
		defer resp.Body.Close()
		if resp.StatusCode != http.StatusUnauthorized {
			t.Errorf("expected 401, got %d", resp.StatusCode)
		}
	})

	t.Run("TestimonialStatusTanpaToken", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/api/v1/testimonials/me/status", nil)
		req.Header.Set("X-Internal-Api-Key", testAPISecret)
		resp, err := app.Test(req, 5000)
		if err != nil {
			t.Fatalf("app.Test failed: %v", err)
		}
		defer resp.Body.Close()
		if resp.StatusCode != http.StatusUnauthorized {
			t.Errorf("expected 401, got %d", resp.StatusCode)
		}
	})

	t.Run("CreateTestimonialAnonim", func(t *testing.T) {
		req := httptest.NewRequest("POST", "/api/v1/testimonials", nil)
		req.Header.Set("X-Internal-Api-Key", testAPISecret)
		resp, err := app.Test(req, 5000)
		if err != nil {
			t.Fatalf("app.Test failed: %v", err)
		}
		defer resp.Body.Close()
		if resp.StatusCode == http.StatusUnauthorized || resp.StatusCode == http.StatusForbidden {
			t.Errorf("expected anonymous POST /testimonials guard PASS, got %d", resp.StatusCode)
		}
	})
}
