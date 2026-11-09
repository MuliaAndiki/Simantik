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

// ─── Mock Repositories ───────────────────────────────────────────────────────

type mockNewsRepo struct {
	items map[uuid.UUID]*models.News
}

func newMockNewsRepo() *mockNewsRepo {
	return &mockNewsRepo{items: make(map[uuid.UUID]*models.News)}
}

func (m *mockNewsRepo) Create(ctx context.Context, n *models.News) error {
	if n.ID == uuid.Nil {
		n.ID = uuid.New()
	}
	n.CreatedAt = time.Now()
	n.UpdatedAt = time.Now()
	m.items[n.ID] = n
	return nil
}

func (m *mockNewsRepo) FindByID(ctx context.Context, id uuid.UUID) (*models.News, error) {
	n, ok := m.items[id]
	if !ok {
		return nil, gorm.ErrRecordNotFound
	}
	return n, nil
}

func (m *mockNewsRepo) FindBySlug(ctx context.Context, slug string) (*models.News, error) {
	for _, n := range m.items {
		if n.Slug == slug {
			return n, nil
		}
	}
	return nil, gorm.ErrRecordNotFound
}

func (m *mockNewsRepo) Update(ctx context.Context, n *models.News) error {
	m.items[n.ID] = n
	return nil
}

func (m *mockNewsRepo) Delete(ctx context.Context, id uuid.UUID) error {
	delete(m.items, id)
	return nil
}

func (m *mockNewsRepo) List(ctx context.Context, filter dto.ListNewsFilter) ([]models.News, int64, error) {
	res := make([]models.News, 0)
	for _, n := range m.items {
		if filter.Status != "" && string(n.Status) != filter.Status {
			continue
		}
		res = append(res, *n)
	}
	return res, int64(len(res)), nil
}

func (m *mockNewsRepo) ListPublished(ctx context.Context, filter dto.ListNewsFilter) ([]models.News, int64, error) {
	filter.Status = string(models.ContentStatusPublished)
	return m.List(ctx, filter)
}

type mockDocRepo struct {
	items map[uuid.UUID]*models.Documentation
}

func newMockDocRepo() *mockDocRepo {
	return &mockDocRepo{items: make(map[uuid.UUID]*models.Documentation)}
}

func (m *mockDocRepo) Create(ctx context.Context, d *models.Documentation) error {
	if d.ID == uuid.Nil {
		d.ID = uuid.New()
	}
	d.CreatedAt = time.Now()
	d.UpdatedAt = time.Now()
	m.items[d.ID] = d
	return nil
}

func (m *mockDocRepo) FindByID(ctx context.Context, id uuid.UUID) (*models.Documentation, error) {
	d, ok := m.items[id]
	if !ok {
		return nil, gorm.ErrRecordNotFound
	}
	return d, nil
}

func (m *mockDocRepo) FindBySlug(ctx context.Context, slug string) (*models.Documentation, error) {
	for _, d := range m.items {
		if d.Slug == slug {
			return d, nil
		}
	}
	return nil, gorm.ErrRecordNotFound
}

func (m *mockDocRepo) Update(ctx context.Context, d *models.Documentation) error {
	m.items[d.ID] = d
	return nil
}

func (m *mockDocRepo) Delete(ctx context.Context, id uuid.UUID) error {
	delete(m.items, id)
	return nil
}

func (m *mockDocRepo) List(ctx context.Context, filter dto.ListDocumentationFilter) ([]models.Documentation, int64, error) {
	res := make([]models.Documentation, 0)
	for _, d := range m.items {
		if filter.Category != "" && d.Category != filter.Category {
			continue
		}
		if filter.Status != "" && string(d.Status) != filter.Status {
			continue
		}
		res = append(res, *d)
	}
	return res, int64(len(res)), nil
}

func (m *mockDocRepo) ListPublished(ctx context.Context, filter dto.ListDocumentationFilter) ([]models.Documentation, int64, error) {
	filter.Status = string(models.ContentStatusPublished)
	return m.List(ctx, filter)
}

func (m *mockDocRepo) GetDistinctCategories(ctx context.Context) ([]string, error) {
	seen := make(map[string]bool)
	var cats []string
	for _, d := range m.items {
		if d.Category != "" && !seen[d.Category] {
			seen[d.Category] = true
			cats = append(cats, d.Category)
		}
	}
	return cats, nil
}

type mockTestimonialRepo struct {
	items map[uuid.UUID]*models.Testimonial
}

func newMockTestimonialRepo() *mockTestimonialRepo {
	return &mockTestimonialRepo{items: make(map[uuid.UUID]*models.Testimonial)}
}

func (m *mockTestimonialRepo) Create(ctx context.Context, t *models.Testimonial) error {
	if t.ID == uuid.Nil {
		t.ID = uuid.New()
	}
	t.CreatedAt = time.Now()
	t.UpdatedAt = time.Now()
	m.items[t.ID] = t
	return nil
}

func (m *mockTestimonialRepo) FindByID(ctx context.Context, id uuid.UUID) (*models.Testimonial, error) {
	t, ok := m.items[id]
	if !ok {
		return nil, gorm.ErrRecordNotFound
	}
	return t, nil
}

func (m *mockTestimonialRepo) UpdateStatus(ctx context.Context, id uuid.UUID, status models.TestimonialStatus) error {
	t, ok := m.items[id]
	if !ok {
		return gorm.ErrRecordNotFound
	}
	t.Status = status
	return nil
}

func (m *mockTestimonialRepo) Delete(ctx context.Context, id uuid.UUID) error {
	delete(m.items, id)
	return nil
}

func (m *mockTestimonialRepo) List(ctx context.Context, filter dto.ListTestimonialFilter) ([]models.Testimonial, int64, error) {
	res := make([]models.Testimonial, 0)
	for _, t := range m.items {
		if filter.Status != "" && string(t.Status) != filter.Status {
			continue
		}
		res = append(res, *t)
	}
	return res, int64(len(res)), nil
}

func (m *mockTestimonialRepo) ListApproved(ctx context.Context, limit, offset int) ([]models.Testimonial, int64, error) {
	return m.List(ctx, dto.ListTestimonialFilter{Status: string(models.TestimonialStatusApproved)})
}

// ─── Tests ───────────────────────────────────────────────────────────────────

func TestContentService_News(t *testing.T) {
	newsRepo := newMockNewsRepo()
	docRepo := newMockDocRepo()
	testRepo := newMockTestimonialRepo()
	svc := service.NewContentService(newsRepo, docRepo, testRepo, newMockTutorialRepo())

	authorID := uuid.New()

	// 1. Create News with auto-slug
	created, err := svc.CreateNews(context.Background(), dto.CreateNewsRequest{
		Title:   "Jadwal UTBK SNBT 2026",
		Content: "Pengumuman jadwal pendaftaran dan pelaksanaan UTBK...",
		Status:  "draft",
	}, authorID)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if created.Slug != "jadwal-utbk-snbt-2026" {
		t.Errorf("expected slug 'jadwal-utbk-snbt-2026', got %s", created.Slug)
	}

	// 2. Duplicate slug rejection
	_, err = svc.CreateNews(context.Background(), dto.CreateNewsRequest{
		Title:   "Jadwal UTBK SNBT 2026",
		Content: "Another article with same title...",
	}, authorID)
	if err != service.ErrNewsSlugExists {
		t.Errorf("expected ErrNewsSlugExists, got %v", err)
	}

	// 3. Publish News (sets publishedAt)
	pub, err := svc.UpdateNewsStatus(context.Background(), created.ID, "published", authorID)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if pub.Status != "published" || pub.PublishedAt == nil {
		t.Errorf("expected published status with timestamp, got %+v", pub)
	}

	// 4. Public list should return it
	pubList, err := svc.ListNewsPublic(context.Background(), dto.ListNewsFilter{})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if pubList.Total != 1 {
		t.Errorf("expected 1 published news, got %d", pubList.Total)
	}

	// 5. Get by slug
	bySlug, err := svc.GetNewsBySlug(context.Background(), created.Slug)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if bySlug.ID != created.ID {
		t.Errorf("expected matching ID, got %s", bySlug.ID)
	}

	// 6. Delete News
	if err := svc.DeleteNews(context.Background(), created.ID); err != nil {
		t.Fatalf("expected delete to succeed, got %v", err)
	}
	_, err = svc.GetNewsByID(context.Background(), created.ID)
	if err != service.ErrNewsNotFound {
		t.Errorf("expected ErrNewsNotFound, got %v", err)
	}
}

func TestContentService_Documentation(t *testing.T) {
	newsRepo := newMockNewsRepo()
	docRepo := newMockDocRepo()
	testRepo := newMockTestimonialRepo()
	svc := service.NewContentService(newsRepo, docRepo, testRepo, newMockTutorialRepo())

	authorID := uuid.New()

	// 1. Create Doc
	doc, err := svc.CreateDocumentation(context.Background(), dto.CreateDocumentationRequest{
		Title:    "Panduan Tryout Adaptif",
		Content:  "Cara mengerjakan soal adaptif di SIMANTIK...",
		Category: "Guide",
		Status:   "published",
	}, authorID)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if doc.Slug != "panduan-tryout-adaptif" {
		t.Errorf("expected slug 'panduan-tryout-adaptif', got %s", doc.Slug)
	}

	// 2. Query by category
	docs, err := svc.ListDocumentationPublic(context.Background(), dto.ListDocumentationFilter{Category: "Guide"})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if docs.Total != 1 {
		t.Errorf("expected 1 doc, got %d", docs.Total)
	}
}

func TestContentService_Testimonials(t *testing.T) {
	newsRepo := newMockNewsRepo()
	docRepo := newMockDocRepo()
	testRepo := newMockTestimonialRepo()
	svc := service.NewContentService(newsRepo, docRepo, testRepo, newMockTutorialRepo())

	studentID := uuid.New()

	// 1. Student submits testimonial (defaults to pending)
	sub, err := svc.CreateTestimonial(context.Background(), dto.CreateTestimonialRequest{
		AuthorName: "Budi Santoso",
		AuthorRole: "Lolos FK UI",
		Content:    "SIMANTIK sangat membantu persiapan UTBK saya dengan fitur adaptifnya!",
		Rating:     5,
	}, &studentID)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if sub.Status != "pending" {
		t.Errorf("expected status 'pending', got %s", sub.Status)
	}

	// 2. Public list should NOT show pending testimonial
	pubList, err := svc.ListTestimonialsPublic(context.Background(), 10, 0)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if pubList.Total != 0 {
		t.Errorf("expected 0 approved testimonials, got %d", pubList.Total)
	}

	// 3. Admin approves testimonial
	appr, err := svc.UpdateTestimonialStatus(context.Background(), sub.ID, dto.UpdateTestimonialStatusRequest{
		Status: "approved",
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if appr.Status != "approved" {
		t.Errorf("expected status 'approved', got %s", appr.Status)
	}

	// 4. Public list should now include the approved testimonial
	pubListAfter, err := svc.ListTestimonialsPublic(context.Background(), 10, 0)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if pubListAfter.Total != 1 {
		t.Errorf("expected 1 approved testimonial, got %d", pubListAfter.Total)
	}
}

func TestContentService_GetDocumentationCategories(t *testing.T) {
	docRepo := newMockDocRepo()
	svc := service.NewContentService(newMockNewsRepo(), docRepo, newMockTestimonialRepo(), newMockTutorialRepo())

	authorID := uuid.New()
	_, err := svc.CreateDocumentation(context.Background(), dto.CreateDocumentationRequest{
		Title:    "Panduan Tryout",
		Content:  "Isi panduan...",
		Category: "Pedoman Khusus",
	}, authorID)
	if err != nil {
		t.Fatalf("failed to create doc: %v", err)
	}

	categories, err := svc.GetDocumentationCategories(context.Background())
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	found := false
	for _, c := range categories {
		if c == "Pedoman Khusus" {
			found = true
			break
		}
	}
	if !found {
		t.Errorf("expected 'Pedoman Khusus' to be in categories, got %v", categories)
	}
}
