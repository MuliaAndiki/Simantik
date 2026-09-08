// Package utils provides small, reusable helpers shared across handlers,
// services, and middlewares: the standardized response envelope, request
// validation, JWT issuance/parsing, and password hashing.
package utils

import "github.com/gofiber/fiber/v2"

// Response is the single JSON shape every handler in the service returns.
type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
	Error   interface{} `json:"error"`
}

// Success writes a 200 OK response with the standardized envelope.
func Success(c *fiber.Ctx, message string, data interface{}) error {
	return SuccessWithStatus(c, fiber.StatusOK, message, data)
}

// OK is an alias for Success.
func OK(c *fiber.Ctx, message string, data interface{}) error {
	return Success(c, message, data)
}

// Created writes a 201 Created response with the standardized envelope.
func Created(c *fiber.Ctx, message string, data interface{}) error {
	return SuccessWithStatus(c, fiber.StatusCreated, message, data)
}

// SuccessWithStatus writes a success response with a caller-chosen status
// code (e.g. 200, 201, 204).
func SuccessWithStatus(c *fiber.Ctx, statusCode int, message string, data interface{}) error {
	return c.Status(statusCode).JSON(Response{
		Success: true,
		Message: message,
		Data:    data,
		Error:   nil,
	})
}

// Error writes an error response with the standardized envelope. err may be
// nil; when present, its message is surfaced in the "error" field.
func Error(c *fiber.Ctx, statusCode int, message string, err error) error {
	var errDetail interface{}
	if err != nil {
		errDetail = err.Error()
	}

	return c.Status(statusCode).JSON(Response{
		Success: false,
		Message: message,
		Data:    nil,
		Error:   errDetail,
	})
}

// ValidationError writes a 422 Unprocessable Entity response whose "error"
// field carries structured, field-level validation details (as produced by
// ValidateStruct).
func ValidationError(c *fiber.Ctx, details interface{}) error {
	return c.Status(fiber.StatusUnprocessableEntity).JSON(Response{
		Success: false,
		Message: "validation failed",
		Data:    nil,
		Error:   details,
	})
}
