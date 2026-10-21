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

// ─── Mock: StimulusRepository ────────────────────────────────────────────────

type mockStimulusRepo struct {
	repository.StimulusRepository
	stimuli map[uuid.UUID]*models.Stimulus
	pkgUse  map[uuid.UUID][]repository.StimulusPackageRef
}

func newMockStimulusRepo() *mockStimulusRepo {
	return &mockStimulusRepo{
		stimuli: make(map[uuid.UUID]*models.Stimulus),
		pkgUse:  make(map[uuid.UUID][]repository.StimulusPackageRef),
	}
}

func (m *mockStimulusRepo) Create(_ context.Context, s *models.Stimulus) error {
	if s.ID == uuid.Nil {
		s.ID = uuid.New()
	}
	m.stimuli[s.ID] = s
	return nil
}

func (m *mockStimulusRepo) FindByID(_ context.Context, id uuid.UUID) (*models.Stimulus, error) {
	s, ok := m.stimuli[id]
	if !ok {
		return nil, gorm.ErrRecordNotFound
	}
	return s, nil
}

func (m *mockStimulusRepo) Update(_ context.Context, s *models.Stimulus) error {
	m.stimuli[s.ID] = s
	return nil
}

func (m *mockStimulusRepo) Delete(_ context.Context, id uuid.UUID) error {
	delete(m.stimuli, id)
	return nil
}

func (m *mockStimulusRepo) List(_ context.Context, filter dto.ListStimulusFilter) ([]models.Stimulus, int64, error) {
	var out []models.Stimulus
	for _, s := range m.stimuli {
		if filter.PackageID != nil && filter.PackageKind != "" {
			if s.PackageID != nil {
				if *s.PackageID != *filter.PackageID || s.PackageKind != filter.PackageKind {
					continue
				}
			} else {
				refs := m.pkgUse[s.ID]
				usedElsewhere := false
				for _, r := range refs {
					if r.PackageID != *filter.PackageID || r.Kind != filter.PackageKind {
						usedElsewhere = true
						break
					}
				}
				if usedElsewhere {
					continue
				}
			}
		}
		out = append(out, *s)
	}
	return out, int64(len(out)), nil
}

// pkgUse records stimulus usage: stimulusID -> list of packages.
func (m *mockStimulusRepo) FindPackagesUsingStimulus(_ context.Context, stimulusID uuid.UUID) ([]repository.StimulusPackageRef, error) {
	return m.pkgUse[stimulusID], nil
}

func (m *mockStimulusRepo) FindLinkedQuestions(_ context.Context, stimulusID uuid.UUID) ([]models.Question, error) {
	// Delegated via the shared question mock in each test (see helper below).
	return nil, nil
}

// mockStimulusRepoWithQuestions serves linked questions from a question mock.
type mockStimulusRepoWithQuestions struct {
	*mockStimulusRepo
	qRepo *mockQuestionRepo
}

func (m *mockStimulusRepoWithQuestions) FindLinkedQuestions(_ context.Context, stimulusID uuid.UUID) ([]models.Question, error) {
	var out []models.Question
	for _, q := range m.qRepo.questions {
		if q.StimulusID != nil && *q.StimulusID == stimulusID {
			out = append(out, models.Question{ID: q.ID, DifficultyLevel: q.DifficultyLevel})
		}
	}
	return out, nil
}

// ─── Tests ────────────────────────────────────────────────────────────────────

func TestStimulusService_CreateAndGet(t *testing.T) {
	svc := service.NewStimulusService(newMockStimulusRepo(), newMockQuestionRepo())
	ctx := context.Background()

	res, err := svc.CreateStimulus(ctx, dto.CreateStimulusRequest{
		Title:   "Teks 1",
		Content: "<p>Rhodamin B ...</p>",
	}, uuid.New())
	if err != nil {
		t.Fatalf("CreateStimulus failed: %v", err)
	}
	if res.Title != "Teks 1" || res.QuestionCount != 0 {
		t.Errorf("unexpected response: %+v", res)
	}

	got, err := svc.GetStimulus(ctx, res.ID)
	if err != nil {
		t.Fatalf("GetStimulus failed: %v", err)
	}
	if got.ID != res.ID {
		t.Errorf("expected same stimulus, got %v", got.ID)
	}

	if _, err := svc.GetStimulus(ctx, uuid.New()); err != service.ErrStimulusNotFound {
		t.Errorf("expected ErrStimulusNotFound, got %v", err)
	}
}

func TestStimulusService_LinkMaxThree(t *testing.T) {
	stimRepo := newMockStimulusRepo()
	qRepo := newMockQuestionRepo()
	svc := service.NewStimulusService(
		&mockStimulusRepoWithQuestions{mockStimulusRepo: stimRepo, qRepo: qRepo},
		qRepo,
	)
	ctx := context.Background()
	authorID := uuid.New()

	stim, err := svc.CreateStimulus(ctx, dto.CreateStimulusRequest{Title: "T", Content: "C"}, authorID)
	if err != nil {
		t.Fatalf("CreateStimulus failed: %v", err)
	}

	// Seed 4 standalone questions with spread levels.
	levels := []int{2, 3, 4, 5}
	var ids []uuid.UUID
	for _, level := range levels {
		id := uuid.New()
		qRepo.questions[id] = &models.Question{ID: id, DifficultyLevel: level, QuestionText: "soal"}
		ids = append(ids, id)
	}

	// First three link fine.
	for _, id := range ids[:3] {
		if _, err := svc.LinkQuestionToStimulus(ctx, stim.ID, id); err != nil {
			t.Fatalf("link failed: %v", err)
		}
	}

	// Fourth and subsequent questions link successfully (unlimited).
	if _, err := svc.LinkQuestionToStimulus(ctx, stim.ID, ids[3]); err != nil {
		t.Errorf("expected 4th question to link successfully, got %v", err)
	}

	// Relink of an already-linked question is idempotent.
	if _, err := svc.LinkQuestionToStimulus(ctx, stim.ID, ids[0]); err != nil {
		t.Errorf("expected idempotent relink, got %v", err)
	}

	// Unlink frees a slot.
	if err := svc.UnlinkQuestionFromStimulus(ctx, ids[0]); err != nil {
		t.Fatalf("unlink failed: %v", err)
	}
	if _, err := svc.LinkQuestionToStimulus(ctx, stim.ID, ids[3]); err != nil {
		t.Errorf("expected link after unlink to succeed, got %v", err)
	}
}

func TestStimulusService_LevelSpreadWarning(t *testing.T) {
	stimRepo := newMockStimulusRepo()
	qRepo := newMockQuestionRepo()
	svc := service.NewStimulusService(
		&mockStimulusRepoWithQuestions{mockStimulusRepo: stimRepo, qRepo: qRepo},
		qRepo,
	)
	ctx := context.Background()

	stim, _ := svc.CreateStimulus(ctx, dto.CreateStimulusRequest{Title: "T", Content: "C"}, uuid.New())

	same1 := uuid.New()
	same2 := uuid.New()
	qRepo.questions[same1] = &models.Question{ID: same1, DifficultyLevel: 5, QuestionText: "a"}
	qRepo.questions[same2] = &models.Question{ID: same2, DifficultyLevel: 5, QuestionText: "b"}

	if _, err := svc.LinkQuestionToStimulus(ctx, stim.ID, same1); err != nil {
		t.Fatalf("link failed: %v", err)
	}
	res, err := svc.LinkQuestionToStimulus(ctx, stim.ID, same2)
	if err != nil {
		t.Fatalf("link failed: %v", err)
	}
	if res.Warning == "" {
		t.Error("expected level-spread warning for same-level questions")
	}

	spread := uuid.New()
	qRepo.questions[spread] = &models.Question{ID: spread, DifficultyLevel: 2, QuestionText: "c"}
	res, err = svc.LinkQuestionToStimulus(ctx, stim.ID, spread)
	if err != nil {
		t.Fatalf("link failed: %v", err)
	}
	if res.Warning != "" {
		t.Errorf("expected no warning for spread levels, got %q", res.Warning)
	}
}

func TestQuestionService_CreateLinksStimulus(t *testing.T) {
	compRepo := newMockCompetencyRepo()
	qRepo := newMockQuestionRepo()
	stimRepo := newMockStimulusRepo()
	linked := &mockStimulusRepoWithQuestions{mockStimulusRepo: stimRepo, qRepo: qRepo}
	svc := service.NewQuestionService(compRepo, qRepo, linked, nil)
	ctx := context.Background()
	adminID := uuid.New()
	qTypeID := uuid.New()

	stim, err := service.NewStimulusService(stimRepo, qRepo).CreateStimulus(ctx, dto.CreateStimulusRequest{
		Title: "T", Content: "C",
	}, adminID)
	if err != nil {
		t.Fatalf("CreateStimulus failed: %v", err)
	}

	newQuestion := func(level int) dto.CreateQuestionRequest {
		return dto.CreateQuestionRequest{
			QuestionTypeID:  qTypeID,
			QuestionText:    "Soal?",
			DifficultyLevel: level,
			Options: []dto.CreateQuestionOptionRequest{
				{OptionLabel: "A", OptionText: "1", DisplayOrder: 1},
				{OptionLabel: "B", OptionText: "2", IsCorrect: true, DisplayOrder: 2},
			},
			StimulusID: &stim.ID,
		}
	}

	// Three creations link fine and store the relation.
	for _, level := range []int{2, 3, 4} {
		res, err := svc.CreateQuestion(ctx, newQuestion(level), adminID)
		if err != nil {
			t.Fatalf("CreateQuestion failed: %v", err)
		}
		qid, err := uuid.Parse(res.ID)
		if err != nil {
			t.Fatalf("invalid question id: %v", err)
		}
		stored, _ := qRepo.FindByID(ctx, qid)
		if stored == nil || stored.StimulusID == nil || *stored.StimulusID != stim.ID {
			t.Errorf("expected question linked to stimulus")
		}
	}

	// Fourth is allowed without cap.
	if _, err := svc.CreateQuestion(ctx, newQuestion(5), adminID); err != nil {
		t.Errorf("expected 4th question creation to succeed, got %v", err)
	}

	// Unknown stimulus is rejected.
	unknown := uuid.New()
	req := newQuestion(1)
	req.StimulusID = &unknown
	if _, err := svc.CreateQuestion(ctx, req, adminID); err != service.ErrStimulusNotFound {
		t.Errorf("expected ErrStimulusNotFound, got %v", err)
	}
}

func TestStimulusService_ListPackageScope(t *testing.T) {
	stimRepo := newMockStimulusRepo()
	svc := service.NewStimulusService(stimRepo, newMockQuestionRepo())
	ctx := context.Background()
	authorID := uuid.New()

	pkgA := uuid.New()
	pkgB := uuid.New()
	free, _ := svc.CreateStimulus(ctx, dto.CreateStimulusRequest{Title: "Bebas", Content: "C"}, authorID)
	used, _ := svc.CreateStimulus(ctx, dto.CreateStimulusRequest{Title: "Terpakai", Content: "C"}, authorID)
	stimRepo.pkgUse[used.ID] = []repository.StimulusPackageRef{{Kind: "practice", PackageID: pkgA}}

	// Tanpa filter: semua tampil.
	all, err := svc.ListStimuli(ctx, dto.ListStimulusFilter{})
	if err != nil || len(all.Stimuli) != 2 {
		t.Fatalf("expected 2 stimuli, got %d (%v)", len(all.Stimuli), err)
	}

	// Dari paket B: yang terpakai di A disembunyikan.
	scoped, err := svc.ListStimuli(ctx, dto.ListStimulusFilter{PackageID: &pkgB, PackageKind: "practice"})
	if err != nil {
		t.Fatalf("scoped list failed: %v", err)
	}
	if len(scoped.Stimuli) != 1 || scoped.Stimuli[0].ID != free.ID {
		t.Errorf("expected only free stimulus, got %+v", scoped.Stimuli)
	}

	// Dari paket A sendiri: keduanya tampil.
	own, err := svc.ListStimuli(ctx, dto.ListStimulusFilter{PackageID: &pkgA, PackageKind: "practice"})
	if err != nil || len(own.Stimuli) != 2 {
		t.Errorf("expected 2 stimuli for own package, got %d (%v)", len(own.Stimuli), err)
	}
}

func TestStimulusService_EnsureQuestionsPackageScope(t *testing.T) {
	stimRepo := newMockStimulusRepo()
	qRepo := newMockQuestionRepo()
	ctx := context.Background()

	pkgA := uuid.New()
	pkgB := uuid.New()
	stimID := uuid.New()
	stimRepo.pkgUse[stimID] = []repository.StimulusPackageRef{{Kind: "practice", PackageID: pkgA}}

	withStim := uuid.New()
	plain := uuid.New()
	sid := stimID
	qRepo.questions[withStim] = &models.Question{ID: withStim, StimulusID: &sid}
	qRepo.questions[plain] = &models.Question{ID: plain}

	// Paket yang sama: lolos.
	if err := service.EnsureQuestionsPackageScope(ctx, qRepo, stimRepo, "practice", pkgA, []uuid.UUID{withStim, plain}); err != nil {
		t.Errorf("expected same-package attach to pass, got %v", err)
	}
	// Paket lain: ditolak.
	if err := service.EnsureQuestionsPackageScope(ctx, qRepo, stimRepo, "practice", pkgB, []uuid.UUID{withStim}); err != service.ErrStimulusUsedElsewhere {
		t.Errorf("expected ErrStimulusUsedElsewhere, got %v", err)
	}
	// Lintas jenis paket juga ditolak.
	if err := service.EnsureQuestionsPackageScope(ctx, qRepo, stimRepo, "tryout", uuid.New(), []uuid.UUID{withStim}); err != service.ErrStimulusUsedElsewhere {
		t.Errorf("expected cross-kind rejection, got %v", err)
	}
}

func TestPracticeService_AddQuestionsRejectsForeignStimulus(t *testing.T) {
	pRepo := newMockPracticeRepo()
	qRepo := newMockQuestionRepo()
	stimRepo := newMockStimulusRepo()
	svc := service.NewPracticeService(nil, pRepo, qRepo, nil, nil, nil, stimRepo)
	ctx := context.Background()

	pkgA := uuid.New()
	pkgB := uuid.New()
	pRepo.packages[pkgB] = &models.PracticePackage{ID: pkgB, Status: models.ContentStatusPublished}

	stimID := uuid.New()
	stimRepo.pkgUse[stimID] = []repository.StimulusPackageRef{{Kind: "practice", PackageID: pkgA}}
	qID := uuid.New()
	sid := stimID
	qRepo.questions[qID] = &models.Question{ID: qID, StimulusID: &sid}

	_, err := svc.AddQuestionsToPackage(ctx, pkgB, dto.AddPracticeQuestionsRequest{QuestionIDs: []uuid.UUID{qID}})
	if err != service.ErrStimulusUsedElsewhere {
		t.Errorf("expected ErrStimulusUsedElsewhere, got %v", err)
	}
}

func TestStimulusService_BackfillDedupe(t *testing.T) {
	stimRepo := newMockStimulusRepo()
	qRepo := newMockQuestionRepo()
	svc := service.NewStimulusService(stimRepo, qRepo)
	ctx := context.Background()
	authorID := uuid.New()

	shared := "[WACANA: Teks 1]\n<p>Rhodamin B adalah zat pewarna.</p>\n\n<p>Soal A?</p>"
	sharedVariantWS := "[WACANA:  Teks 1 ]\n<p>Rhodamin B adalah  zat pewarna.</p>\n\n<p>Soal B?</p>"
	other := "[WACANA: Teks 2]\n<p>Bentuk serbuk kristal.</p>\n\n<p>Soal C?</p>"
	plain := "<p>Soal tanpa stimulus?</p>"

	ids := map[string]uuid.UUID{}
	for name, text := range map[string]string{"a": shared, "b": sharedVariantWS, "c": other, "d": plain} {
		id := uuid.New()
		ids[name] = id
		qRepo.questions[id] = &models.Question{ID: id, QuestionText: text, DifficultyLevel: 3}
	}

	created, linked, err := svc.BackfillStimuliFromMarkers(ctx, authorID)
	if err != nil {
		t.Fatalf("backfill failed: %v", err)
	}
	if created != 2 {
		t.Errorf("expected 2 stimuli created (dedupe), got %d", created)
	}
	if linked != 3 {
		t.Errorf("expected 3 questions linked, got %d", linked)
	}

	// Same-content questions share one stimulus.
	if qRepo.questions[ids["a"]].StimulusID == nil || qRepo.questions[ids["b"]].StimulusID == nil {
		t.Fatal("expected a and b linked")
	}
	if *qRepo.questions[ids["a"]].StimulusID != *qRepo.questions[ids["b"]].StimulusID {
		t.Error("expected a and b to share one stimulus")
	}
	if qRepo.questions[ids["d"]].StimulusID != nil {
		t.Error("expected plain question to stay unlinked")
	}

	// Linked questions carry the bare body (marker stripped).
	if got := qRepo.questions[ids["a"]].QuestionText; got != "<p>Soal A?</p>" {
		t.Errorf("expected stripped body, got %q", got)
	}

	// Second run is a no-op (all linked, nothing embedded left unlinked).
	created, linked, err = svc.BackfillStimuliFromMarkers(ctx, authorID)
	if err != nil {
		t.Fatalf("second backfill failed: %v", err)
	}
	if created != 0 || linked != 0 {
		t.Errorf("expected idempotent no-op, got created=%d linked=%d", created, linked)
	}
}

func TestStimulusService_PackageIsolation(t *testing.T) {
	stimRepo := newMockStimulusRepo()
	qRepo := newMockQuestionRepo()
	svc := service.NewStimulusService(stimRepo, qRepo)
	ctx := context.Background()
	authorID := uuid.New()

	tryoutA := uuid.New()
	tryoutB := uuid.New()
	practiceC := uuid.New()

	// 1. Create stimulus in Tryout A
	stimA, err := svc.CreateStimulus(ctx, dto.CreateStimulusRequest{
		Title:       "Wacana Tryout A",
		Content:     "<p>Isi wacana A</p>",
		PackageID:   &tryoutA,
		PackageKind: "tryout",
	}, authorID)
	if err != nil {
		t.Fatalf("CreateStimulus A failed: %v", err)
	}

	// 2. Create stimulus in Practice C
	stimC, err := svc.CreateStimulus(ctx, dto.CreateStimulusRequest{
		Title:       "Wacana Latihan C",
		Content:     "<p>Isi wacana C</p>",
		PackageID:   &practiceC,
		PackageKind: "practice",
	}, authorID)
	if err != nil {
		t.Fatalf("CreateStimulus C failed: %v", err)
	}

	// 3. Query stimuli for Tryout A: should only see stimA
	listA, err := svc.ListStimuli(ctx, dto.ListStimulusFilter{
		PackageID:   &tryoutA,
		PackageKind: "tryout",
	})
	if err != nil {
		t.Fatalf("ListStimuli A failed: %v", err)
	}
	if len(listA.Stimuli) != 1 || listA.Stimuli[0].ID != stimA.ID {
		t.Errorf("expected 1 stimulus (stimA) in Tryout A, got %d", len(listA.Stimuli))
	}

	// 4. Query stimuli for Tryout B: should be empty
	listB, err := svc.ListStimuli(ctx, dto.ListStimulusFilter{
		PackageID:   &tryoutB,
		PackageKind: "tryout",
	})
	if err != nil {
		t.Fatalf("ListStimuli B failed: %v", err)
	}
	if len(listB.Stimuli) != 0 {
		t.Errorf("expected 0 stimuli in Tryout B, got %d", len(listB.Stimuli))
	}

	// 5. Query stimuli for Practice C: should only see stimC
	listC, err := svc.ListStimuli(ctx, dto.ListStimulusFilter{
		PackageID:   &practiceC,
		PackageKind: "practice",
	})
	if err != nil {
		t.Fatalf("ListStimuli C failed: %v", err)
	}
	if len(listC.Stimuli) != 1 || listC.Stimuli[0].ID != stimC.ID {
		t.Errorf("expected 1 stimulus (stimC) in Practice C, got %d", len(listC.Stimuli))
	}

	// 6. EnsureStimulusPackageScope rejects using stimA in Tryout B
	if err := service.EnsureStimulusPackageScope(ctx, stimRepo, stimA.ID, "tryout", tryoutB); err != service.ErrStimulusUsedElsewhere {
		t.Errorf("expected ErrStimulusUsedElsewhere for stimA in Tryout B, got %v", err)
	}

	// 7. EnsureStimulusPackageScope rejects using stimA in Practice C
	if err := service.EnsureStimulusPackageScope(ctx, stimRepo, stimA.ID, "practice", practiceC); err != service.ErrStimulusUsedElsewhere {
		t.Errorf("expected ErrStimulusUsedElsewhere for stimA in Practice C, got %v", err)
	}

	// 8. EnsureStimulusPackageScope succeeds for stimA in Tryout A
	if err := service.EnsureStimulusPackageScope(ctx, stimRepo, stimA.ID, "tryout", tryoutA); err != nil {
		t.Errorf("expected success for stimA in Tryout A, got %v", err)
	}
}

func TestStimulusService_DeleteStimulus(t *testing.T) {
	ctx := context.Background()
	stimRepo := newMockStimulusRepo()
	qRepo := newMockQuestionRepo()
	svc := service.NewStimulusService(stimRepo, qRepo)
	authorID := uuid.New()

	// 1. Create a stimulus
	stim, err := svc.CreateStimulus(ctx, dto.CreateStimulusRequest{
		Title:   "Wacana untuk Dihapus",
		Content: "<p>Konten wacana</p>",
	}, authorID)
	if err != nil {
		t.Fatalf("CreateStimulus failed: %v", err)
	}

	// 2. Delete stimulus
	if err := svc.DeleteStimulus(ctx, stim.ID); err != nil {
		t.Fatalf("DeleteStimulus failed: %v", err)
	}

	// 3. Verify it's no longer retrievable
	_, err = svc.GetStimulus(ctx, stim.ID)
	if err != service.ErrStimulusNotFound {
		t.Fatalf("expected ErrStimulusNotFound, got: %v", err)
	}

	// 4. Deleting non-existent stimulus returns ErrStimulusNotFound
	if err := svc.DeleteStimulus(ctx, uuid.New()); err != service.ErrStimulusNotFound {
		t.Fatalf("expected ErrStimulusNotFound for non-existent id, got: %v", err)
	}
}

