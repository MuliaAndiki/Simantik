package dto

import "time"

type TestimonialMyStatusResponse struct {
	HasSubmitted     bool       `json:"hasSubmitted"`
	CompletedTryouts int64      `json:"completedTryouts"`
	RequiredTryouts  int        `json:"requiredTryouts"`
	Eligible         bool       `json:"eligible"`
	LastSubmittedAt  *time.Time `json:"lastSubmittedAt,omitempty"`
}
