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

// State represents the current progression state of an assessment attempt.
type State struct {
	CurrentDifficulty int
	CorrectStreak     int
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
	CalculateNextState(currentDifficulty, currentStreak int, isCorrect bool) (nextDifficulty, newStreak int, changed bool)
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

// CalculateNextState computes difficulty transitions and streak counters based on PRD rules:
// - Correct: streak increments. If streak reaches StreakThreshold, difficulty advances by +1 (capped at MaxDifficulty) and streak resets to 0.
// - Incorrect: streak resets to 0, difficulty drops by -1 (clamped at MinDifficulty).
func (e *engine) CalculateNextState(currentDifficulty, currentStreak int, isCorrect bool) (nextDifficulty, newStreak int, changed bool) {
	// Clamp initial currentDifficulty within configured bounds
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

	// Incorrect answer: reset streak to 0, step difficulty down by 1
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
