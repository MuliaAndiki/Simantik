package models

// AllModels returns all GORM entity models in strict dependency order.
// Independent master entities are listed first, followed by dependent
// entities with foreign key associations, ensuring foreign keys and indexes
// can be created without schema dependency errors.
func AllModels() []interface{} {
	return []interface{}{
		// 1. Identity & Access Control (RBAC)
		&Role{},
		&Permission{},
		&RolePermission{},
		&User{},
		&RefreshToken{},
		&OTPCode{},
		&PasswordResetToken{},
		&ExternalAccount{},

		// 2. Master Data & Profiles
		&School{},
		&StudentProfile{},
		&Competency{},
		&FileRecord{},

		// 3. Learning Management System
		&LearningModule{},
		&Material{},
		&MaterialAttachment{},
		&LearningProgress{},

		// 4. Question Bank
		&QuestionType{},
		&Question{},
		&QuestionOption{},
		&QuestionCompetency{},
		&QuestionExplanation{},

		// 5. Tryout & Adaptive Testing Engine
		&Tryout{},
		&TryoutQuestion{},
		&TryoutAttempt{},
		&AttemptQuestion{},
		&StudentAnswer{},

		// 6. Practice & Self-Study
		&Practice{},
		&PracticeAnswer{},

		// 7. Evaluation & Adaptive Recommendations
		&Evaluation{},
		&CompetencyEvaluation{},
		&Recommendation{},

		// 8. CMS & Static Content
		&News{},
		&Documentation{},
		&Testimonial{},

		// 9. System, Telemetry & Notifications
		&AuditLog{},
		&Notification{},
	}
}
