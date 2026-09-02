package utils

import (
	"fmt"
	"strings"

	"github.com/go-playground/validator/v10"
)

var validate = validator.New()

// ValidateStruct validates s against its `validate:"..."` struct tags and
// returns a map of field -> human-readable message. It returns nil when the
// struct is valid.
func ValidateStruct(s interface{}) map[string]string {
	err := validate.Struct(s)
	if err == nil {
		return nil
	}

	validationErrors, ok := err.(validator.ValidationErrors)
	if !ok {
		return map[string]string{"error": err.Error()}
	}

	details := make(map[string]string, len(validationErrors))
	for _, fieldErr := range validationErrors {
		details[fieldErr.Field()] = formatFieldError(fieldErr)
	}
	return details
}

func formatFieldError(fe validator.FieldError) string {
	switch fe.Tag() {
	case "required":
		return fmt.Sprintf("%s is required", fe.Field())
	case "email":
		return fmt.Sprintf("%s must be a valid email address", fe.Field())
	case "min":
		return fmt.Sprintf("%s must be at least %s characters/value", fe.Field(), fe.Param())
	case "max":
		return fmt.Sprintf("%s must be at most %s characters/value", fe.Field(), fe.Param())
	case "oneof":
		return fmt.Sprintf("%s must be one of [%s]", fe.Field(), strings.ReplaceAll(fe.Param(), " ", ", "))
	default:
		return fmt.Sprintf("%s failed validation on %q", fe.Field(), fe.Tag())
	}
}
