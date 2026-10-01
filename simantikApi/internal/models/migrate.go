package models

// AllModels returns all GORM entity models in strict dependency order.
// Independent master entities are listed first, followed by dependent
// entities with foreign key associations, ensuring foreign keys and indexes
// can be created without schema dependency errors.
func AllModels() []interface{} {
	return []interface{}{
		&Role{},
		&Permission{},
		&RolePermission{},
		&User{},
		&RefreshToken{},
		&OTPCode{},
		&PasswordResetToken{},
		&ExternalAccount{},
		&School{},
		&StudentProfile{},
		&Competency{},
		&FileRecord{},
		&LearningModule{},
		&Material{},
		&MaterialAttachment{},
		&LearningProgress{},
		&QuestionType{},
		&Question{},
		&QuestionOption{},
		&QuestionCompetency{},
		&QuestionExplanation{},
		&Tryout{},
		&TryoutQuestion{},
		&TryoutAttempt{},
		&AttemptQuestion{},
		&StudentAnswer{},
		&PracticePackage{},
		&PracticePackageQuestion{},
		&Practice{},
		&PracticeAnswer{},
		&Evaluation{},
		&CompetencyEvaluation{},
		&Recommendation{},
		&News{},
		&Documentation{},
		&Tutorial{},
		&Testimonial{},
		&AuditLog{},
		&Notification{},
	}
}
