package service_test

import (
	"context"
	"testing"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
	"simantikApi/internal/repository"
	"simantikApi/internal/service"
)

// ─── Mock: LearningModuleRepository ──────────────────────────────────────────

type mockModuleRepo struct {
	repository.LearningModuleRepository
	modules map[uuid.UUID]*models.LearningModule
}

func newMockModuleRepo() *mockModuleRepo {
	return &mockModuleRepo{
		modules: make(map[uuid.UUID]*models.LearningModule),
	}
}

func (m *mockModuleRepo) Create(_ context.Context, mod *models.LearningModule) error {
	if mod.ID == uuid.Nil {
		mod.ID = uuid.New()
	}
	m.modules[mod.ID] = mod
	return nil
}

func (m *mockModuleRepo) FindByID(_ context.Context, id uuid.UUID) (*models.LearningModule, error) {
	mod, ok := m.modules[id]
	if !ok {
		return nil, gorm.ErrRecordNotFound
	}
	return mod, nil
}

func (m *mockModuleRepo) FindByIDWithMaterials(_ context.Context, id uuid.UUID) (*models.LearningModule, error) {
	return m.FindByID(context.Background(), id)
}

func (m *mockModuleRepo) Update(_ context.Context, mod *models.LearningModule) error {
	m.modules[mod.ID] = mod
	return nil
}

func (m *mockModuleRepo) Delete(_ context.Context, id uuid.UUID) error {
	delete(m.modules, id)
	return nil
}

func (m *mockModuleRepo) List(_ context.Context, _ dto.ListModuleFilter) ([]models.LearningModule, int64, error) {
	var result []models.LearningModule
	for _, mod := range m.modules {
		result = append(result, *mod)
	}
	return result, int64(len(result)), nil
}

func (m *mockModuleRepo) ListPublished(_ context.Context, _ dto.ListModuleFilter) ([]models.LearningModule, int64, error) {
	var result []models.LearningModule
	for _, mod := range m.modules {
		if mod.Status == models.ContentStatusPublished {
			result = append(result, *mod)
		}
	}
	return result, int64(len(result)), nil
}

func (m *mockModuleRepo) GetDistinctLabels(_ context.Context) ([]string, error) {
	labelMap := make(map[string]bool)
	for _, mod := range m.modules {
		if mod.Label != "" {
			labelMap[mod.Label] = true
		}
	}
	var labels []string
	for l := range labelMap {
		labels = append(labels, l)
	}
	return labels, nil
}

// ─── Mock: MaterialRepository ────────────────────────────────────────────────

type mockMaterialRepo struct {
	repository.MaterialRepository
	materials map[uuid.UUID]*models.Material
}

func newMockMaterialRepo() *mockMaterialRepo {
	return &mockMaterialRepo{
		materials: make(map[uuid.UUID]*models.Material),
	}
}

func (m *mockMaterialRepo) Create(_ context.Context, mat *models.Material) error {
	if mat.ID == uuid.Nil {
		mat.ID = uuid.New()
	}
	m.materials[mat.ID] = mat
	return nil
}

func (m *mockMaterialRepo) FindByID(_ context.Context, id uuid.UUID) (*models.Material, error) {
	mat, ok := m.materials[id]
	if !ok {
		return nil, gorm.ErrRecordNotFound
	}
	return mat, nil
}

func (m *mockMaterialRepo) Update(_ context.Context, mat *models.Material) error {
	m.materials[mat.ID] = mat
	return nil
}

func (m *mockMaterialRepo) Delete(_ context.Context, id uuid.UUID) error {
	delete(m.materials, id)
	return nil
}

func (m *mockMaterialRepo) List(_ context.Context, filter dto.ListMaterialFilter) ([]models.Material, int64, error) {
	var result []models.Material
	for _, mat := range m.materials {
		if filter.ModuleID != nil && mat.ModuleID != *filter.ModuleID {
			continue
		}
		result = append(result, *mat)
	}
	return result, int64(len(result)), nil
}

func (m *mockMaterialRepo) ListPublished(_ context.Context, filter dto.ListMaterialFilter) ([]models.Material, int64, error) {
	var result []models.Material
	for _, mat := range m.materials {
		if filter.ModuleID != nil && mat.ModuleID != *filter.ModuleID {
			continue
		}
		if mat.Status == models.ContentStatusPublished {
			result = append(result, *mat)
		}
	}
	return result, int64(len(result)), nil
}

func (m *mockMaterialRepo) UpdateStatusByModuleID(_ context.Context, moduleID uuid.UUID, status models.ContentStatus, updatedByID uuid.UUID) error {
	for _, mat := range m.materials {
		if mat.ModuleID == moduleID {
			mat.Status = status
			mat.UpdatedBy = &updatedByID
		}
	}
	return nil
}

func (m *mockMaterialRepo) GetMaterialStudentActivities(_ context.Context, materialID uuid.UUID, filter dto.ListMaterialActivityFilter) (*dto.MaterialStudentActivitiesResponse, error) {
	mat, ok := m.materials[materialID]
	if !ok {
		return nil, gorm.ErrRecordNotFound
	}
	return &dto.MaterialStudentActivitiesResponse{
		MaterialID:         mat.ID,
		MaterialTitle:      mat.Title,
		ModuleID:           mat.ModuleID,
		ModuleName:         "Mock Module",
		CompetencyName:     "Pemahaman Tekstual",
		Status:             string(mat.Status),
		TotalStudents:      120,
		AccessedStudents:   86,
		UnaccessedStudents: 34,
		ParticipationRate:  72,
		LastUpdatedAt:      "22 September 2026, 10:20 WIB",
		Students:           make([]dto.MaterialStudentActivityItem, 0),
		Total:              120,
	}, nil
}

func (m *mockMaterialRepo) PublishMaterialsByModuleID(ctx context.Context, moduleID uuid.UUID, updatedByID uuid.UUID) error {
	return m.UpdateStatusByModuleID(ctx, moduleID, models.ContentStatusPublished, updatedByID)
}

// ─── Mock: LearningProgressRepository ────────────────────────────────────────

type mockProgressRepo struct {
	repository.LearningProgressRepository
	progresses map[string]*models.LearningProgress // "userID:materialID"
	moduleRepo *mockModuleRepo
	matRepo    *mockMaterialRepo
}

func newMockProgressRepo(moduleRepo *mockModuleRepo, matRepo *mockMaterialRepo) *mockProgressRepo {
	return &mockProgressRepo{
		progresses: make(map[string]*models.LearningProgress),
		moduleRepo: moduleRepo,
		matRepo:    matRepo,
	}
}

func (m *mockProgressRepo) UpsertProgress(_ context.Context, p *models.LearningProgress) error {
	key := p.UserID.String() + ":" + p.MaterialID.String()
	m.progresses[key] = p
	return nil
}

func (m *mockProgressRepo) FindByUserAndMaterial(_ context.Context, userID, materialID uuid.UUID) (*models.LearningProgress, error) {
	key := userID.String() + ":" + materialID.String()
	p, ok := m.progresses[key]
	if !ok {
		return nil, gorm.ErrRecordNotFound
	}
	return p, nil
}

func (m *mockProgressRepo) ListUserProgress(_ context.Context, userID uuid.UUID) ([]models.LearningProgress, error) {
	var result []models.LearningProgress
	for _, p := range m.progresses {
		if p.UserID == userID {
			result = append(result, *p)
		}
	}
	return result, nil
}

func (m *mockProgressRepo) CountCompletedByModule(_ context.Context, userID, moduleID uuid.UUID) (int64, error) {
	var count int64
	for _, p := range m.progresses {
		if p.UserID == userID && p.IsCompleted {
			mat, ok := m.matRepo.materials[p.MaterialID]
			if ok && mat.ModuleID == moduleID {
				count++
			}
		}
	}
	return count, nil
}

func (m *mockProgressRepo) CountMaterialsByModule(_ context.Context, moduleID uuid.UUID) (int64, error) {
	var count int64
	for _, mat := range m.matRepo.materials {
		if mat.ModuleID == moduleID && mat.Status == models.ContentStatusPublished {
			count++
		}
	}
	return count, nil
}

// ─── Tests ────────────────────────────────────────────────────────────────────

func TestLearningService_ModuleAndMaterialLifecycle(t *testing.T) {
	moduleRepo := newMockModuleRepo()
	matRepo := newMockMaterialRepo()
	progRepo := newMockProgressRepo(moduleRepo, matRepo)

	svc := service.NewLearningService(moduleRepo, matRepo, progRepo)
	ctx := context.Background()

	adminID := uuid.New()
	studentID := uuid.New()

	// 1. Admin creates a draft module
	createdMod, err := svc.CreateModule(ctx, dto.CreateLearningModuleRequest{
		Title:        "Modul Bahasa Indonesia",
		Description:  "Struktur bacaan dan teks",
		DisplayOrder: 1,
	}, adminID)
	if err != nil {
		t.Fatalf("CreateModule failed: %v", err)
	}

	moduleID := createdMod.ID

	// 2. Student cannot access draft module
	_, err = svc.GetModule(ctx, moduleID, studentID, false)
	if err == nil {
		t.Fatal("expected ErrModuleNotFound for student on draft module, got nil")
	}
	if err != service.ErrModuleNotFound {
		t.Errorf("expected ErrModuleNotFound, got %v", err)
	}

	// 3. Admin creates draft material inside module
	createdMat, err := svc.CreateMaterial(ctx, dto.CreateMaterialRequest{
		ModuleID:     moduleID,
		Title:        "Pengenalan Teks Argumentasi",
		Description:  "Dasar-dasar teks",
		Content:      "Isi materi teks argumentasi...",
		Type:         "text",
		DisplayOrder: 1,
	}, adminID)
	if err != nil {
		t.Fatalf("CreateMaterial failed: %v", err)
	}

	materialID := createdMat.ID

	// 4. Student cannot access draft material
	_, err = svc.GetMaterial(ctx, materialID, studentID, false)
	if err != service.ErrMaterialNotFound {
		t.Errorf("expected ErrMaterialNotFound, got %v", err)
	}

	// 5. Admin publishes module and material
	_, err = svc.UpdateModuleStatus(ctx, moduleID, "published", adminID)
	if err != nil {
		t.Fatalf("UpdateModuleStatus failed: %v", err)
	}
	_, err = svc.UpdateMaterialStatus(ctx, materialID, "published", adminID)
	if err != nil {
		t.Fatalf("UpdateMaterialStatus failed: %v", err)
	}

	// 6. Student can now access published material
	pubMat, err := svc.GetMaterial(ctx, materialID, studentID, false)
	if err != nil {
		t.Fatalf("student GetMaterial failed after publish: %v", err)
	}
	if pubMat.Title != "Pengenalan Teks Argumentasi" {
		t.Errorf("unexpected material title: %s", pubMat.Title)
	}
}

func TestLearningService_ProgressTracking(t *testing.T) {
	moduleRepo := newMockModuleRepo()
	matRepo := newMockMaterialRepo()
	progRepo := newMockProgressRepo(moduleRepo, matRepo)

	svc := service.NewLearningService(moduleRepo, matRepo, progRepo)
	ctx := context.Background()

	studentID := uuid.New()

	// Create published module
	mod := &models.LearningModule{
		ID:     uuid.New(),
		Title:  "Modul Penalaran",
		Status: models.ContentStatusPublished,
	}
	_ = moduleRepo.Create(ctx, mod)

	// Create 2 published materials
	m1 := &models.Material{
		ID:       uuid.New(),
		ModuleID: mod.ID,
		Title:    "Materi 1",
		Status:   models.ContentStatusPublished,
	}
	m2 := &models.Material{
		ID:       uuid.New(),
		ModuleID: mod.ID,
		Title:    "Materi 2",
		Status:   models.ContentStatusPublished,
	}
	_ = matRepo.Create(ctx, m1)
	_ = matRepo.Create(ctx, m2)

	// Initial progress: 0%
	p0, err := svc.GetModuleProgress(ctx, mod.ID, studentID)
	if err != nil {
		t.Fatalf("GetModuleProgress failed: %v", err)
	}
	if p0.TotalMaterials != 2 || p0.CompletedMaterials != 0 || p0.ProgressPercentage != 0.0 {
		t.Errorf("expected 0%% progress, got %+v", p0)
	}

	// Mark Materi 1 completed
	progRes, err := svc.MarkMaterialCompleted(ctx, m1.ID, studentID, true)
	if err != nil {
		t.Fatalf("MarkMaterialCompleted failed: %v", err)
	}
	if !progRes.IsCompleted || progRes.CompletedAt == nil {
		t.Errorf("expected completed with timestamp, got %+v", progRes)
	}

	// Progress should be 50%
	p1, err := svc.GetModuleProgress(ctx, mod.ID, studentID)
	if err != nil {
		t.Fatalf("GetModuleProgress failed: %v", err)
	}
	if p1.CompletedMaterials != 1 || p1.ProgressPercentage != 50.0 {
		t.Errorf("expected 50%% progress, got %+v", p1)
	}

	// Mark Materi 2 completed -> 100%
	_, _ = svc.MarkMaterialCompleted(ctx, m2.ID, studentID, true)
	p2, err := svc.GetModuleProgress(ctx, mod.ID, studentID)
	if err != nil {
		t.Fatalf("GetModuleProgress failed: %v", err)
	}
	if p2.CompletedMaterials != 2 || p2.ProgressPercentage != 100.0 {
		t.Errorf("expected 100%% progress, got %+v", p2)
	}
}

func TestLearningService_ListModuleLabels(t *testing.T) {
	ctx := context.Background()
	modRepo := newMockModuleRepo()
	matRepo := newMockMaterialRepo()
	progRepo := newMockProgressRepo(modRepo, matRepo)
	svc := service.NewLearningService(modRepo, matRepo, progRepo)

	adminID := uuid.New()
	_, _ = svc.CreateModule(ctx, dto.CreateLearningModuleRequest{
		Title: "Module 1",
		Label: "Pemahaman Tekstual",
	}, adminID)
	_, _ = svc.CreateModule(ctx, dto.CreateLearningModuleRequest{
		Title: "Module 2",
		Label: "Pemahaman Inferensial",
	}, adminID)

	labels, err := svc.ListModuleLabels(ctx)
	if err != nil {
		t.Fatalf("ListModuleLabels failed: %v", err)
	}
	if len(labels) != 2 {
		t.Errorf("expected 2 labels, got %d", len(labels))
	}
}

func TestLearningService_CascadingPublishMaterials(t *testing.T) {
	ctx := context.Background()
	modRepo := newMockModuleRepo()
	matRepo := newMockMaterialRepo()
	progRepo := newMockProgressRepo(modRepo, matRepo)
	svc := service.NewLearningService(modRepo, matRepo, progRepo)

	adminID := uuid.New()

	// 1. Create draft module
	mod, err := svc.CreateModule(ctx, dto.CreateLearningModuleRequest{
		Title: "Draft Module",
	}, adminID)
	if err != nil {
		t.Fatalf("CreateModule failed: %v", err)
	}

	// 2. Create 2 draft materials under this module
	m1, err := svc.CreateMaterial(ctx, dto.CreateMaterialRequest{
		ModuleID: mod.ID,
		Title:    "Material 1",
		Content:  "Content 1",
		Type:     "document",
	}, adminID)
	if err != nil {
		t.Fatalf("CreateMaterial 1 failed: %v", err)
	}

	m2, err := svc.CreateMaterial(ctx, dto.CreateMaterialRequest{
		ModuleID: mod.ID,
		Title:    "Material 2",
		Content:  "Content 2",
		Type:     "document",
	}, adminID)
	if err != nil {
		t.Fatalf("CreateMaterial 2 failed: %v", err)
	}

	if m1.Status != string(models.ContentStatusDraft) || m2.Status != string(models.ContentStatusDraft) {
		t.Fatal("expected materials to be in draft initially")
	}

	// 3. Update module status to published
	_, err = svc.UpdateModuleStatus(ctx, mod.ID, string(models.ContentStatusPublished), adminID)
	if err != nil {
		t.Fatalf("UpdateModuleStatus failed: %v", err)
	}

	// 4. Verify that child materials are now automatically published!
	mat1, _ := matRepo.FindByID(ctx, m1.ID)
	mat2, _ := matRepo.FindByID(ctx, m2.ID)

	if mat1.Status != models.ContentStatusPublished {
		t.Errorf("expected Material 1 to be published automatically, got %s", mat1.Status)
	}
	if mat2.Status != models.ContentStatusPublished {
		t.Errorf("expected Material 2 to be published automatically, got %s", mat2.Status)
	}

	// 5. Update module status back to draft -> verify child materials also revert to draft!
	_, err = svc.UpdateModuleStatus(ctx, mod.ID, string(models.ContentStatusDraft), adminID)
	if err != nil {
		t.Fatalf("UpdateModuleStatus back to draft failed: %v", err)
	}

	mat1Draft, _ := matRepo.FindByID(ctx, m1.ID)
	mat2Draft, _ := matRepo.FindByID(ctx, m2.ID)

	if mat1Draft.Status != models.ContentStatusDraft {
		t.Errorf("expected Material 1 to revert to draft, got %s", mat1Draft.Status)
	}
	if mat2Draft.Status != models.ContentStatusDraft {
		t.Errorf("expected Material 2 to revert to draft, got %s", mat2Draft.Status)
	}
}

func TestLearningService_GetMaterialStudentActivities(t *testing.T) {
	ctx := context.Background()
	modRepo := newMockModuleRepo()
	matRepo := newMockMaterialRepo()
	progRepo := newMockProgressRepo(modRepo, matRepo)
	svc := service.NewLearningService(modRepo, matRepo, progRepo)

	adminID := uuid.New()
	mod, _ := svc.CreateModule(ctx, dto.CreateLearningModuleRequest{
		Title:   "Modul 1",
		Jenjang: "sma",
	}, adminID)

	mat, _ := svc.CreateMaterial(ctx, dto.CreateMaterialRequest{
		ModuleID: mod.ID,
		Title:    "Materi 1",
		Content:  "Isi teks",
		Type:     "text",
	}, adminID)

	res, err := svc.GetMaterialStudentActivities(ctx, mat.ID, dto.ListMaterialActivityFilter{})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if res.TotalStudents != 120 {
		t.Errorf("expected 120 total students, got %d", res.TotalStudents)
	}
	if res.AccessedStudents != 86 {
		t.Errorf("expected 86 accessed students, got %d", res.AccessedStudents)
	}
	if res.ParticipationRate != 72 {
		t.Errorf("expected 72 participation rate, got %f", res.ParticipationRate)
	}
}

