// Package adaptive implements the isolated Adaptive Difficulty Engine for SIMANTIK.
// It is a pure domain package with no dependencies on HTTP frameworks or database drivers.
package adaptive

import (
	"math"
	"math/rand"
	"time"

	"github.com/google/uuid"
)

const (
	DefaultMinDifficulty   = 1
	DefaultMaxDifficulty   = 5
	DefaultStreakThreshold = 2 // 2 consecutive correct answers to advance difficulty
)

// EngineConfig configures the constraints of the adaptive difficulty engine.
type EngineConfig struct {
	MinDifficulty   int
	MaxDifficulty   int
	StreakThreshold int
}

// DefaultConfig returns the standard engine configuration based on PRD requirements.
func DefaultConfig() EngineConfig {
	return EngineConfig{
		MinDifficulty:   DefaultMinDifficulty,
		MaxDifficulty:   DefaultMaxDifficulty,
		StreakThreshold: DefaultStreakThreshold,
	}
}

// State represents the basic progression state of an assessment attempt.
type State struct {
	CurrentDifficulty int
	CorrectStreak     int
}

// WindowState represents the dynamic streak window state for adaptive learning:
// - TargetStreak: dynamic threshold in range 1 to 3
// - WindowCorrect: correct answers accumulated within current window
// - WindowIncorrect: incorrect answers accumulated within current window
// - IsTieBreaker: true if currently in an odd tie-breaker window
type WindowState struct {
	CurrentDifficulty int
	TargetStreak      int // 1 to 3
	WindowCorrect     int
	WindowIncorrect   int
	IsTieBreaker      bool
}

// WindowTransitionResult holds the output after evaluating an adaptive window step.
type WindowTransitionResult struct {
	NextDifficulty      int
	NextTargetStreak    int
	NextWindowCorrect   int
	NextWindowIncorrect int
	IsTieBreaker        bool
	DifficultyChanged   bool
	Action              string // "LEVEL_UP", "LEVEL_DOWN", "STAY", "TIE_BREAKER"
}

// QuestionCandidate represents an eligible question item in the pool.
type QuestionCandidate struct {
	ID              uuid.UUID
	DifficultyLevel int
	CompetencyIDs   []uuid.UUID
}

// TransitionResult holds the output of an adaptive step.
type TransitionResult struct {
	NextDifficulty    int
	NewStreak         int
	DifficultyChanged bool
	SelectedQuestion  *QuestionCandidate
}

// Engine defines the contract for adaptive difficulty calculations and question selection.
type Engine interface {
	RandomInitialDifficulty() int
	RandomStreakWindow() int
	CalculateNextState(currentDifficulty, currentStreak int, isCorrect bool) (nextDifficulty, newStreak int, changed bool)
	CalculateAdaptiveWindowStep(state WindowState, isCorrect bool) WindowTransitionResult
	SelectNextQuestion(candidates []QuestionCandidate, exposedIDs []uuid.UUID, targetDifficulty int) *QuestionCandidate
	ProcessStep(state State, isCorrect bool, candidates []QuestionCandidate, exposedIDs []uuid.UUID) TransitionResult
}

type engine struct {
	cfg EngineConfig
	rng *rand.Rand
}

// NewEngine creates a new isolated Adaptive Engine.
func NewEngine(cfg EngineConfig) Engine {
	if cfg.MinDifficulty <= 0 {
		cfg.MinDifficulty = DefaultMinDifficulty
	}
	if cfg.MaxDifficulty <= 0 || cfg.MaxDifficulty < cfg.MinDifficulty {
		cfg.MaxDifficulty = DefaultMaxDifficulty
	}
	if cfg.StreakThreshold <= 0 {
		cfg.StreakThreshold = DefaultStreakThreshold
	}

	return &engine{
		cfg: cfg,
		rng: rand.New(rand.NewSource(time.Now().UnixNano())),
	}
}

// RandomInitialDifficulty selects a random starting difficulty level between 1 and 5.
func (e *engine) RandomInitialDifficulty() int {
	return e.rng.Intn(e.cfg.MaxDifficulty-e.cfg.MinDifficulty+1) + e.cfg.MinDifficulty
}

// RandomStreakWindow selects a random target streak between 1 and 3.
func (e *engine) RandomStreakWindow() int {
	return e.rng.Intn(3) + 1
}

// CalculateAdaptiveWindowStep implements the dynamic streak window with tie-breaking rules:
// - Streak target is randomized in range 1 to 3.
// - If all answers in window are correct: Level UP (+1, max 5), reset window, pick new target streak (1-3).
// - If all answers in window are incorrect: Level DOWN (-1, min 1), reset window, pick new target streak (1-3).
// - If tied (e.g. target is 2 with 1 correct, 1 incorrect): student is stuck! Switch to odd streak (1 or 3) as tie-breaker:
//   - Target 3: majority rule (2 correct -> Level UP; 2 incorrect -> Level DOWN).
//   - Target 1: decisive question (1 correct -> Level UP; 1 incorrect -> Level DOWN).
func (e *engine) CalculateAdaptiveWindowStep(state WindowState, isCorrect bool) WindowTransitionResult {
	currDiff := state.CurrentDifficulty
	if currDiff < e.cfg.MinDifficulty {
		currDiff = e.cfg.MinDifficulty
	} else if currDiff > e.cfg.MaxDifficulty {
		currDiff = e.cfg.MaxDifficulty
	}

	target := state.TargetStreak
	if target < 1 || target > 3 {
		target = e.RandomStreakWindow()
	}

	wCorrect := state.WindowCorrect
	wIncorrect := state.WindowIncorrect
	if isCorrect {
		wCorrect++
	} else {
		wIncorrect++
	}

	// ─── Case 1: Target Streak is 1 (immediate decider) ──────────────────────
	if target == 1 {
		nextTarget := e.RandomStreakWindow()
		if isCorrect {
			nextDiff := currDiff + 1
			if nextDiff > e.cfg.MaxDifficulty {
				nextDiff = e.cfg.MaxDifficulty
			}
			return WindowTransitionResult{
				NextDifficulty:      nextDiff,
				NextTargetStreak:    nextTarget,
				NextWindowCorrect:   0,
				NextWindowIncorrect: 0,
				IsTieBreaker:        false,
				DifficultyChanged:   nextDiff != currDiff,
				Action:              "LEVEL_UP",
			}
		}

		nextDiff := currDiff - 1
		if nextDiff < e.cfg.MinDifficulty {
			nextDiff = e.cfg.MinDifficulty
		}
		return WindowTransitionResult{
			NextDifficulty:      nextDiff,
			NextTargetStreak:    nextTarget,
			NextWindowCorrect:   0,
			NextWindowIncorrect: 0,
			IsTieBreaker:        false,
			DifficultyChanged:   nextDiff != currDiff,
			Action:              "LEVEL_DOWN",
		}
	}

	// ─── Case 2: Target Streak is 2 ──────────────────────────────────────────
	if target == 2 {
		if wCorrect == 2 {
			nextDiff := currDiff + 1
			if nextDiff > e.cfg.MaxDifficulty {
				nextDiff = e.cfg.MaxDifficulty
			}
			return WindowTransitionResult{
				NextDifficulty:      nextDiff,
				NextTargetStreak:    e.RandomStreakWindow(),
				NextWindowCorrect:   0,
				NextWindowIncorrect: 0,
				IsTieBreaker:        false,
				DifficultyChanged:   nextDiff != currDiff,
				Action:              "LEVEL_UP",
			}
		}
		if wIncorrect == 2 {
			nextDiff := currDiff - 1
			if nextDiff < e.cfg.MinDifficulty {
				nextDiff = e.cfg.MinDifficulty
			}
			return WindowTransitionResult{
				NextDifficulty:      nextDiff,
				NextTargetStreak:    e.RandomStreakWindow(),
				NextWindowCorrect:   0,
				NextWindowIncorrect: 0,
				IsTieBreaker:        false,
				DifficultyChanged:   nextDiff != currDiff,
				Action:              "LEVEL_DOWN",
			}
		}
		// Tie condition: 1 correct + 1 incorrect = stuck!
		if wCorrect+wIncorrect >= 2 {
			// Switch to odd target streak (1 or 3) for decisive tie-breaker
			oddOptions := []int{1, 3}
			oddTarget := oddOptions[e.rng.Intn(len(oddOptions))]
			return WindowTransitionResult{
				NextDifficulty:      currDiff,
				NextTargetStreak:    oddTarget,
				NextWindowCorrect:   0,
				NextWindowIncorrect: 0,
				IsTieBreaker:        true,
				DifficultyChanged:   false,
				Action:              "TIE_BREAKER",
			}
		}
		// In-progress: 1 answer recorded, 1 remaining
		return WindowTransitionResult{
			NextDifficulty:      currDiff,
			NextTargetStreak:    target,
			NextWindowCorrect:   wCorrect,
			NextWindowIncorrect: wIncorrect,
			IsTieBreaker:        false,
			DifficultyChanged:   false,
			Action:              "STAY",
		}
	}

	// ─── Case 3: Target Streak is 3 (odd) ────────────────────────────────────
	// Majority threshold: 2 answers out of 3 determines level transition
	if target == 3 {
		if wCorrect >= 2 {
			nextDiff := currDiff + 1
			if nextDiff > e.cfg.MaxDifficulty {
				nextDiff = e.cfg.MaxDifficulty
			}
			return WindowTransitionResult{
				NextDifficulty:      nextDiff,
				NextTargetStreak:    e.RandomStreakWindow(),
				NextWindowCorrect:   0,
				NextWindowIncorrect: 0,
				IsTieBreaker:        false,
				DifficultyChanged:   nextDiff != currDiff,
				Action:              "LEVEL_UP",
			}
		}
		if wIncorrect >= 2 {
			nextDiff := currDiff - 1
			if nextDiff < e.cfg.MinDifficulty {
				nextDiff = e.cfg.MinDifficulty
			}
			return WindowTransitionResult{
				NextDifficulty:      nextDiff,
				NextTargetStreak:    e.RandomStreakWindow(),
				NextWindowCorrect:   0,
				NextWindowIncorrect: 0,
				IsTieBreaker:        false,
				DifficultyChanged:   nextDiff != currDiff,
				Action:              "LEVEL_DOWN",
			}
		}
		// In-progress: within window of 3
		return WindowTransitionResult{
			NextDifficulty:      currDiff,
			NextTargetStreak:    target,
			NextWindowCorrect:   wCorrect,
			NextWindowIncorrect: wIncorrect,
			IsTieBreaker:        state.IsTieBreaker,
			DifficultyChanged:   false,
			Action:              "STAY",
		}
	}

	return WindowTransitionResult{
		NextDifficulty:   currDiff,
		NextTargetStreak: e.RandomStreakWindow(),
		Action:           "STAY",
	}
}

// CalculateNextState computes difficulty transitions and streak counters based on PRD rules:
// - Correct: streak increments. If streak reaches StreakThreshold, difficulty advances by +1 (capped at MaxDifficulty) and streak resets to 0.
// - Incorrect: streak resets to 0, difficulty drops by -1 (clamped at MinDifficulty).
func (e *engine) CalculateNextState(currentDifficulty, currentStreak int, isCorrect bool) (nextDifficulty, newStreak int, changed bool) {
	if currentDifficulty < e.cfg.MinDifficulty {
		currentDifficulty = e.cfg.MinDifficulty
	} else if currentDifficulty > e.cfg.MaxDifficulty {
		currentDifficulty = e.cfg.MaxDifficulty
	}

	if isCorrect {
		streak := currentStreak + 1
		if streak >= e.cfg.StreakThreshold {
			nextDiff := currentDifficulty + 1
			if nextDiff > e.cfg.MaxDifficulty {
				nextDiff = e.cfg.MaxDifficulty
			}
			changed = nextDiff != currentDifficulty
			return nextDiff, 0, changed
		}
		return currentDifficulty, streak, false
	}

	nextDiff := currentDifficulty - 1
	if nextDiff < e.cfg.MinDifficulty {
		nextDiff = e.cfg.MinDifficulty
	}
	changed = nextDiff != currentDifficulty
	return nextDiff, 0, changed
}

// SelectNextQuestion picks an eligible question from candidates:
// 1. Excludes questions already present in exposedIDs.
// 2. Prioritizes questions matching targetDifficulty exactly.
// 3. If no exact match is found, picks from the closest available difficulty level.
// 4. Returns nil if the remaining pool is completely exhausted.
func (e *engine) SelectNextQuestion(candidates []QuestionCandidate, exposedIDs []uuid.UUID, targetDifficulty int) *QuestionCandidate {
	exposedMap := make(map[uuid.UUID]struct{}, len(exposedIDs))
	for _, id := range exposedIDs {
		exposedMap[id] = struct{}{}
	}

	// Filter out exposed questions
	var unexposed []QuestionCandidate
	for _, c := range candidates {
		if _, used := exposedMap[c.ID]; !used {
			unexposed = append(unexposed, c)
		}
	}

	if len(unexposed) == 0 {
		return nil
	}

	// Find exact matches first
	var exactMatches []QuestionCandidate
	for _, c := range unexposed {
		if c.DifficultyLevel == targetDifficulty {
			exactMatches = append(exactMatches, c)
		}
	}

	if len(exactMatches) > 0 {
		idx := e.rng.Intn(len(exactMatches))
		chosen := exactMatches[idx]
		return &chosen
	}

	// Fallback: Find questions with minimum distance to targetDifficulty
	minDist := math.MaxInt32
	for _, c := range unexposed {
		dist := int(math.Abs(float64(c.DifficultyLevel - targetDifficulty)))
		if dist < minDist {
			minDist = dist
		}
	}

	var closestMatches []QuestionCandidate
	for _, c := range unexposed {
		dist := int(math.Abs(float64(c.DifficultyLevel - targetDifficulty)))
		if dist == minDist {
			closestMatches = append(closestMatches, c)
		}
	}

	if len(closestMatches) > 0 {
		idx := e.rng.Intn(len(closestMatches))
		chosen := closestMatches[idx]
		return &chosen
	}

	return nil
}

// ProcessStep evaluates the answer, updates adaptive state, and chooses the next question.
func (e *engine) ProcessStep(state State, isCorrect bool, candidates []QuestionCandidate, exposedIDs []uuid.UUID) TransitionResult {
	nextDiff, newStreak, changed := e.CalculateNextState(state.CurrentDifficulty, state.CorrectStreak, isCorrect)
	selected := e.SelectNextQuestion(candidates, exposedIDs, nextDiff)

	return TransitionResult{
		NextDifficulty:    nextDiff,
		NewStreak:         newStreak,
		DifficultyChanged: changed,
		SelectedQuestion:  selected,
	}
}
