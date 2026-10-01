package service_test

import (
	"context"
	"testing"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
	"simantikApi/internal/service"
)

// ─── Mock Tutorial Repository (hand-rolled, mirror content_service_test.go) ───

type mockTutorialRepo struct {
	items map[uuid.UUID]*models.Tutorial
}

func newMockTutorialRepo() *mockTutorialRepo {
	return &mockTutorialRepo{items: make(map[uuid.UUID]*models.Tutorial)}
}

func (m *mockTutorialRepo) Create(ctx context.Context, t *models.Tutorial) error {
	if t.ID == uuid.Nil {
		t.ID = uuid.New()
	}
	t.CreatedAt = time.Now()
	t.UpdatedAt = time.Now()
	m.items[t.ID] = t
	return nil
}

func (m *mockTutorialRepo) FindByID(ctx context.Context, id uuid.UUID) (*models.Tutorial, error) {
	t, ok := m.items[id]
	if !ok {
		return nil, gorm.ErrRecordNotFound
	}
	return t, nil
}

func (m *mockTutorialRepo) FindBySlug(ctx context.Context, slug string) (*models.Tutorial, error) {
	for _, t := range m.items {
		if t.Slug == slug {
			return t, nil
		}
	}
	return nil, gorm.ErrRecordNotFound
}

func (m *mockTutorialRepo) Update(ctx context.Context, t *models.Tutorial) error {
	m.items[t.ID] = t
	return nil
}

func (m *mockTutorialRepo) Delete(ctx context.Context, id uuid.UUID) error {
	delete(m.items, id)
	return nil
}

func (m *mockTutorialRepo) List(ctx context.Context, filter dto.ListTutorialFilter) ([]models.Tutorial, int64, error) {
	res := make([]models.Tutorial, 0)
	for _, t := range m.items {
		if filter.Category != "" && t.Category != filter.Category {
			continue
		}
		if filter.Status != "" && string(t.Status) != filter.Status {
			continue
		}
		res = append(res, *t)
	}
	return res, int64(len(res)), nil
}

func (m *mockTutorialRepo) ListPublished(ctx context.Context, filter dto.ListTutorialFilter) ([]models.Tutorial, int64, error) {
	filter.Status = string(models.ContentStatusPublished)
	return m.List(ctx, filter)
}

func newTutorialTestService() service.ContentService {
	return service.NewContentService(newMockNewsRepo(), newMockDocRepo(), newMockTestimonialRepo(), newMockTutorialRepo())
}

// ─── Tests ───────────────────────────────────────────────────────────────────

func TestContentService_Tutorial_RejectNonYoutubeURL(t *testing.T) {
	svc := newTutorialTestService()
	authorID := uuid.New()

	for _, raw := range []string{
		"https://vimeo.com/123456789",
		"https://example.com/watch?v=dQw4w9WgXcQ",
		"not-a-url",
		"https://www.youtube.com/playlist?list=PLabc123",
	} {
		_, err := svc.CreateTutorial(context.Background(), dto.CreateTutorialRequest{
			Title:      "Limit Fungsi Aljabar",
			YoutubeURL: raw,
			Category:   "Matematika",
		}, authorID)
		if err != service.ErrInvalidYoutubeURL {
			t.Errorf("expected ErrInvalidYoutubeURL for %q, got %v", raw, err)
		}
	}
}

func TestContentService_Tutorial_AcceptFormatsAndEmbedURL(t *testing.T) {
	svc := newTutorialTestService()
	authorID := uuid.New()

	const videoID = "dQw4w9WgXcQ"
	const wantEmbed = "https://www.youtube.com/embed/dQw4w9WgXcQ"

	cases := []struct {
		name string
		raw  string
		want string
	}{
		{"watch", "https://www.youtube.com/watch?v=" + videoID, wantEmbed},
		{"watch with params", "https://www.youtube.com/watch?v=" + videoID + "&t=42s", wantEmbed},
		{"share", "https://youtu.be/" + videoID, wantEmbed},
		{"embed as-is", "https://www.youtube.com/embed/" + videoID, "https://www.youtube.com/embed/" + videoID},
		{"shorts", "https://www.youtube.com/shorts/" + videoID, wantEmbed},
	}

	for _, tc := range cases {
		created, err := svc.CreateTutorial(context.Background(), dto.CreateTutorialRequest{
			Title:      "Tutorial Format YouTube",
			Slug:       "tutorial-format-youtube",
			YoutubeURL: tc.raw,
			Category:   "Matematika",
		}, authorID)
		if err != nil {
			t.Fatalf("%s: expected no error, got %v", tc.name, err)
		}
		if created.YoutubeEmbedURL != tc.want {
			t.Errorf("%s: expected embed %q, got %q", tc.name, tc.want, created.YoutubeEmbedURL)
		}
		if err := svc.DeleteTutorial(context.Background(), created.ID); err != nil {
			t.Fatalf("%s: cleanup delete failed: %v", tc.name, err)
		}
	}
}

func TestContentService_Tutorial_DuplicateSlugRejected(t *testing.T) {
	svc := newTutorialTestService()
	authorID := uuid.New()

	first, err := svc.CreateTutorial(context.Background(), dto.CreateTutorialRequest{
		Title:      "Integral Parsial Dasar",
		YoutubeURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
		Category:   "Matematika",
	}, authorID)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if first.Slug != "integral-parsial-dasar" {
		t.Errorf("expected slug 'integral-parsial-dasar', got %s", first.Slug)
	}

	_, err = svc.CreateTutorial(context.Background(), dto.CreateTutorialRequest{
		Title:      "Integral Parsial Dasar",
		YoutubeURL: "https://youtu.be/dQw4w9WgXcQ",
		Category:   "Matematika",
	}, authorID)
	if err != service.ErrTutorialSlugExists {
		t.Errorf("expected ErrTutorialSlugExists, got %v", err)
	}
}
