package service_test

import (
	"testing"

	"github.com/google/uuid"
	"simantikApi/internal/domain/adaptive"
)

func TestAdaptiveEngine_Transitions(t *testing.T) {
	engine := adaptive.NewEngine(adaptive.DefaultConfig())

	tests := []struct {
		name              string
		currentDifficulty int
		currentStreak     int
		isCorrect         bool
		wantDifficulty    int
		wantStreak        int
		wantChanged       bool
	}{
		// Correct answers with streak progression (threshold = 2)
		{
			name:              "Level 1 first correct answer increments streak",
			currentDifficulty: 1,
			currentStreak:     0,
			isCorrect:         true,
			wantDifficulty:    1,
			wantStreak:        1,
			wantChanged:       false,
		},
		{
			name:              "Level 1 second correct answer advances to Level 2 and resets streak",
			currentDifficulty: 1,
			currentStreak:     1,
			isCorrect:         true,
			wantDifficulty:    2,
			wantStreak:        0,
			wantChanged:       true,
		},
		{
			name:              "Level 2 to Level 3 transition",
			currentDifficulty: 2,
			currentStreak:     1,
			isCorrect:         true,
			wantDifficulty:    3,
			wantStreak:        0,
			wantChanged:       true,
		},
		{
			name:              "Level 3 to Level 4 transition",
			currentDifficulty: 3,
			currentStreak:     1,
			isCorrect:         true,
			wantDifficulty:    4,
			wantStreak:        0,
			wantChanged:       true,
		},
		{
			name:              "Level 4 to Level 5 transition",
			currentDifficulty: 4,
			currentStreak:     1,
			isCorrect:         true,
			wantDifficulty:    5,
			wantStreak:        0,
			wantChanged:       true,
		},
		{
			name:              "Level 5 upper bound clamping (cannot exceed 5)",
			currentDifficulty: 5,
			currentStreak:     1,
			isCorrect:         true,
			wantDifficulty:    5,
			wantStreak:        0,
			wantChanged:       false,
		},
		// Incorrect answers and lower bound clamping
		{
			name:              "Level 5 incorrect drops to Level 4 and resets streak",
			currentDifficulty: 5,
			currentStreak:     1,
			isCorrect:         false,
			wantDifficulty:    4,
			wantStreak:        0,
			wantChanged:       true,
		},
		{
			name:              "Level 4 incorrect drops to Level 3",
			currentDifficulty: 4,
			currentStreak:     0,
			isCorrect:         false,
			wantDifficulty:    3,
			wantStreak:        0,
			wantChanged:       true,
		},
		{
			name:              "Level 3 incorrect drops to Level 2",
			currentDifficulty: 3,
			currentStreak:     1,
			isCorrect:         false,
			wantDifficulty:    2,
			wantStreak:        0,
			wantChanged:       true,
		},
		{
			name:              "Level 2 incorrect drops to Level 1",
			currentDifficulty: 2,
			currentStreak:     1,
			isCorrect:         false,
			wantDifficulty:    1,
			wantStreak:        0,
			wantChanged:       true,
		},
		{
			name:              "Level 1 lower bound clamping (cannot drop below 1)",
			currentDifficulty: 1,
			currentStreak:     0,
			isCorrect:         false,
			wantDifficulty:    1,
			wantStreak:        0,
			wantChanged:       false,
		},
		{
			name:              "Negative difficulty input clamps to MinDifficulty 1",
			currentDifficulty: -2,
			currentStreak:     0,
			isCorrect:         false,
			wantDifficulty:    1,
			wantStreak:        0,
			wantChanged:       false,
		},
		{
			name:              "Difficulty > 5 input clamps to MaxDifficulty 5",
			currentDifficulty: 10,
			currentStreak:     1,
			isCorrect:         true,
			wantDifficulty:    5,
			wantStreak:        0,
			wantChanged:       false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gotDiff, gotStreak, gotChanged := engine.CalculateNextState(tt.currentDifficulty, tt.currentStreak, tt.isCorrect)
			if gotDiff != tt.wantDifficulty {
				t.Errorf("CalculateNextState() gotDiff = %v, want %v", gotDiff, tt.wantDifficulty)
			}
			if gotStreak != tt.wantStreak {
				t.Errorf("CalculateNextState() gotStreak = %v, want %v", gotStreak, tt.wantStreak)
			}
			if gotChanged != tt.wantChanged {
				t.Errorf("CalculateNextState() gotChanged = %v, want %v", gotChanged, tt.wantChanged)
			}
		})
	}
}

func TestAdaptiveEngine_QuestionSelection(t *testing.T) {
	engine := adaptive.NewEngine(adaptive.DefaultConfig())

	q1 := uuid.New()
	q2 := uuid.New()
	q3 := uuid.New()
	q4 := uuid.New()

	candidates := []adaptive.QuestionCandidate{
		{ID: q1, DifficultyLevel: 1},
		{ID: q2, DifficultyLevel: 2},
		{ID: q3, DifficultyLevel: 4},
		{ID: q4, DifficultyLevel: 5},
	}

	// 1. Exact match selection
	selected := engine.SelectNextQuestion(candidates, nil, 2)
	if selected == nil {
		t.Fatal("expected selected question, got nil")
	}
	if selected.ID != q2 {
		t.Errorf("expected question ID %s (diff 2), got %s", q2, selected.ID)
	}

	// 2. Exact match already exposed -> fallback to closest difficulty
	// Target is 2, but q2 is exposed. Closest is q1 (dist 1)
	selected = engine.SelectNextQuestion(candidates, []uuid.UUID{q2}, 2)
	if selected == nil {
		t.Fatal("expected fallback question, got nil")
	}
	if selected.ID != q1 {
		t.Errorf("expected closest question %s (diff 1), got %s", q1, selected.ID)
	}

	// 3. Target is 3 (none exact). Closest are q2 (dist 1) and q4 (dist 2) and q3 (dist 1)
	selected = engine.SelectNextQuestion(candidates, nil, 3)
	if selected == nil {
		t.Fatal("expected selected question, got nil")
	}
	if selected.DifficultyLevel != 2 && selected.DifficultyLevel != 4 {
		t.Errorf("expected diff 2 or 4 (dist 1), got %d", selected.DifficultyLevel)
	}

	// 4. All exposed -> returns nil
	selected = engine.SelectNextQuestion(candidates, []uuid.UUID{q1, q2, q3, q4}, 1)
	if selected != nil {
		t.Errorf("expected nil for exhausted pool, got %v", selected)
	}
}

func TestAdaptiveEngine_ProcessStep(t *testing.T) {
	engine := adaptive.NewEngine(adaptive.DefaultConfig())

	q1 := uuid.New()
	q2 := uuid.New()

	candidates := []adaptive.QuestionCandidate{
		{ID: q1, DifficultyLevel: 1},
		{ID: q2, DifficultyLevel: 2},
	}

	// Start at Level 1, streak 1. Answer is correct -> advance to Level 2
	step := engine.ProcessStep(
		adaptive.State{CurrentDifficulty: 1, CorrectStreak: 1},
		true,
		candidates,
		nil,
	)

	if step.NextDifficulty != 2 {
		t.Errorf("expected next difficulty 2, got %d", step.NextDifficulty)
	}
	if step.NewStreak != 0 {
		t.Errorf("expected streak reset to 0, got %d", step.NewStreak)
	}
	if !step.DifficultyChanged {
		t.Errorf("expected DifficultyChanged to be true")
	}
	if step.SelectedQuestion == nil || step.SelectedQuestion.ID != q2 {
		t.Errorf("expected question q2 (diff 2) to be selected")
	}
}
