/**
 * SIMANTIK Database Model Interfaces
 *
 * Synchronized with Go backend models in `simantikApi/internal/models/`.
 * Pure database entity schemas and enums.
 *
 * For API Request/Response DTOs, see `@/types/service/*`.
 */

// ============================================================================
// 1. Enums & Literal Union Types
// ============================================================================

export type UserStatus = 'active' | 'pending' | 'inactive' | 'suspended';
export const UserStatus = {
  ACTIVE: 'active',
  PENDING: 'pending',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
} as const;

export type UserRole = 'student' | 'admin' | 'content_manager';
export const UserRole = {
  STUDENT: 'student',
  ADMIN: 'admin',
  CONTENT_MANAGER: 'content_manager',
} as const;

export type OTPPurpose = 'PASSWORD_RESET' | 'REGISTER';
export const OTPPurpose = {
  PASSWORD_RESET: 'PASSWORD_RESET',
  REGISTER: 'REGISTER',
} as const;

export type CompetencyStatus = 'active' | 'inactive';
export const CompetencyStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export type QuestionTypeCode = 'multiple_choice' | 'complex_multiple_choice' | 'true_false';
export const QuestionTypeCode = {
  MULTIPLE_CHOICE: 'multiple_choice',
  COMPLEX_MULTIPLE_CHOICE: 'complex_multiple_choice',
  TRUE_FALSE: 'true_false',
} as const;

export type AttemptStatus = 'in_progress' | 'completed' | 'abandoned' | 'expired';
export const AttemptStatus = {
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned',
  EXPIRED: 'expired',
} as const;

export type ContentStatus = 'draft' | 'review' | 'published' | 'archived';
export const ContentStatus = {
  DRAFT: 'draft',
  REVIEW: 'review',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

export type MaterialType = 'text' | 'document' | 'video';
export const MaterialType = {
  TEXT: 'text',
  DOCUMENT: 'document',
  VIDEO: 'video',
} as const;

export type EvaluationSourceType = 'tryout' | 'practice';
export const EvaluationSourceType = {
  TRYOUT: 'tryout',
  PRACTICE: 'practice',
} as const;

export type PerformanceLevel = 'low' | 'medium' | 'high';
export const PerformanceLevel = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export type RecommendationPriority = 'high' | 'medium' | 'low';
export const RecommendationPriority = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export type TestimonialStatus = 'pending' | 'approved' | 'rejected';
export const TestimonialStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type NotificationType =
  | 'tryout_result'
  | 'announcement'
  | 'recommendation'
  | 'system'
  | (string & {});

// ============================================================================
// 2. Standard API Response Envelope
// ============================================================================

// ============================================================================
// 2. Standard API Response Envelope
// ============================================================================

/**
 * Standard HTTP response envelope returned by Go Fiber handlers.
 * Maps to backend: `utils.Response`
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  error?: string | Record<string, string[]> | null;
}

// ============================================================================
// 3. Database Table Models (simantikApi/internal/models)
// ============================================================================

// ─── 3.1 IAM & Authentication Models ─────────────────────────────────────────

/**
 * Core user identity entity
 * Maps to backend: `models.User`
 */
export interface User {
  id: string;
  fullName: string;
  email: string;
  passwordHash?: string; // Excluded from public JSON
  avatarURL: string | null;
  role: UserRole;
  status: UserStatus;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;

  // Relations
  profile?: StudentProfile;
  externalAccounts?: ExternalAccount[];
  refreshTokens?: RefreshToken[];
}

/**
 * Authorization role for RBAC
 * Maps to backend: `models.Role`
 */
export interface Role {
  id: string;
  name: string; // e.g., 'student', 'admin', 'content_manager'
  description: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  permissions?: Permission[];
}

/**
 * Granular resource permission
 * Maps to backend: `models.Permission`
 */
export interface Permission {
  id: string;
  name: string; // e.g., "questions:create"
  resource: string; // e.g., "questions"
  action: string; // e.g., "create", "read"
  description: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Junction table between Role and Permission
 * Maps to backend: `models.RolePermission`
 */
export interface RolePermission {
  roleId: string;
  permissionId: string;
  createdAt: string;

  // Relations
  role?: Role;
  permission?: Permission;
}

/**
 * OAuth/OIDC external account links (Google, etc.)
 * Maps to backend: `models.ExternalAccount`
 */
export interface ExternalAccount {
  id: string;
  userId: string;
  provider: string; // e.g. "google"
  providerUserId: string;
  email?: string | null;
  createdAt: string;
  updatedAt: string;

  // Relations
  user?: User;
}

/**
 * Supplementary student academic profile
 * Maps to backend: `models.StudentProfile`
 */
export interface StudentProfile {
  id: string;
  userId: string;
  school: string;
  grade: string; // e.g. "12 SMA", "Gap Year"
  major: string; // e.g. "IPA", "IPS"
  targetUniversity: string;
  targetMajor: string;
  bio: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  user?: User;
}

/**
 * Persistent login refresh token session
 * Maps to backend: `models.RefreshToken`
 */
export interface RefreshToken {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
  revokedAt: string | null;
  lastUsedAt: string | null;
  userAgent: string;
  ipAddress: string;
  createdAt: string;

  // Relations
  user?: User;
}

/**
 * One-time password record for account activation or password reset
 * Maps to backend: `models.OTPCode`
 */
export interface OTPCode {
  id: string;
  userId: string;
  purpose: OTPPurpose;
  codeHash: string;
  expiresAt: string;
  attempts: number;
  maxAttempts: number;
  verifiedAt: string | null;
  createdAt: string;

  // Relations
  user?: User;
}

/**
 * Single-use authorization token for password reset
 * Maps to backend: `models.PasswordResetToken`
 */
export interface PasswordResetToken {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
  usedAt: string | null;
  createdAt: string;

  // Relations
  user?: User;
}

// ─── 3.2 Competency Models ───────────────────────────────────────────────────

/**
 * Assessment competency domain (e.g. Tekstual, Inferensial, Evaluasi)
 * Maps to backend: `models.Competency`
 */
export interface Competency {
  id: string;
  code: string;
  name: string;
  description: string;
  status: CompetencyStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// ─── 3.3 Question Bank Models ───────────────────────────────────────────────

/**
 * Question format definitions (Pilihan Ganda, MCMA, Benar/Salah)
 * Maps to backend: `models.QuestionType`
 */
export interface QuestionType {
  id: string;
  code: QuestionTypeCode;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Core assessment question unit
 * Maps to backend: `models.Question`
 */
export interface Question {
  id: string;
  questionTypeId: string;
  questionText: string;
  difficultyLevel: number; // 1 (easiest) to 5 (hardest)
  status: ContentStatus;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;

  // Relations
  type?: QuestionType;
  options?: QuestionOption[];
  competencies?: Competency[];
  explanation?: QuestionExplanation;
}

/**
 * Option answer choice for a question
 * Maps to backend: `models.QuestionOption`
 */
export interface QuestionOption {
  id: string;
  questionId: string;
  optionLabel: string; // e.g. "A", "B", "C", "D", "E"
  optionText: string;
  isCorrect?: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;

  // Relations
  question?: Question;
}

/**
 * Junction table connecting Question to Competency
 * Maps to backend: `models.QuestionCompetency`
 */
export interface QuestionCompetency {
  questionId: string;
  competencyId: string;
  createdAt: string;

  // Relations
  question?: Question;
  competency?: Competency;
}

/**
 * Pedagogical explanation and answering tips ("tips & trik")
 * Maps to backend: `models.QuestionExplanation`
 */
export interface QuestionExplanation {
  id: string;
  questionId: string;
  explanation: string;
  answeringTips: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  question?: Question;
}

// ─── 3.4 Tryout & Adaptive Engine Models ─────────────────────────────────────

/**
 * Tryout simulation exam package
 * Maps to backend: `models.Tryout`
 */
export interface Tryout {
  id: string;
  title: string;
  description: string;
  durationSeconds: number; // Default 4500 (75 mins)
  totalQuestions: number; // Default 30 questions
  status: ContentStatus;
  startAt: string | null;
  endAt: string | null;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;

  // Relations
  questions?: Question[];
}

/**
 * Question assignment to a tryout with ordering and weight
 * Maps to backend: `models.TryoutQuestion`
 */
export interface TryoutQuestion {
  tryoutId: string;
  questionId: string;
  displayOrder: number;
  scoreWeight: number;
  createdAt: string;

  // Relations
  tryout?: Tryout;
  question?: Question;
}

/**
 * Student attempt session for a tryout
 * Maps to backend: `models.TryoutAttempt`
 */
export interface TryoutAttempt {
  id: string;
  tryoutId: string;
  userId: string;
  status: AttemptStatus;
  currentQuestionNumber: number;
  currentDifficultyLevel: number; // 1 to 5
  correctStreak: number;
  score: number | null;
  startedAt: string;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;

  // Relations
  tryout?: Tryout;
  user?: User;
  attemptQuestions?: AttemptQuestion[];
  answers?: StudentAnswer[];
}

/**
 * Audit record of question delivery in an adaptive tryout path
 * Maps to backend: `models.AttemptQuestion`
 */
export interface AttemptQuestion {
  id: string;
  attemptId: string;
  questionId: string;
  questionNumber: number;
  difficultyLevel: number;
  presentedAt: string;
  answeredAt: string | null;
  createdAt: string;

  // Relations
  attempt?: TryoutAttempt;
  question?: Question;
}

/**
 * Student's submitted answer in a tryout attempt
 * Maps to backend: `models.StudentAnswer`
 */
export interface StudentAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  attemptQuestionId: string | null;
  selectedOptionId: string | null;
  answerData: string; // JSON representation for complex / multi-choice answers
  isCorrect: boolean | null;
  score: number | null;
  responseTimeSeconds: number;
  answeredAt: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  attempt?: TryoutAttempt;
  question?: Question;
  selectedOption?: QuestionOption;
}

// ─── 3.5 Practice System Models ─────────────────────────────────────────────

/**
 * Self-study / practice session
 * Maps to backend: `models.Practice`
 */
export interface Practice {
  id: string;
  userId: string;
  competencyId: string | null; // Optional focus on specific competency
  status: AttemptStatus;
  startedAt: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;

  // Relations
  user?: User;
  competency?: Competency;
  answers?: PracticeAnswer[];
}

/**
 * Student's answer during a self-study practice session
 * Maps to backend: `models.PracticeAnswer`
 */
export interface PracticeAnswer {
  id: string;
  practiceId: string;
  questionId: string;
  selectedOptionId: string | null;
  answerData: string;
  isCorrect: boolean | null;
  score: number | null;
  answeredAt: string;
  createdAt: string;

  // Relations
  practice?: Practice;
  question?: Question;
  selectedOption?: QuestionOption;
}

// ─── 3.6 Learning Management System (LMS) Models ────────────────────────────

/**
 * Structured unit grouping sequential learning materials
 * Maps to backend: `models.LearningModule`
 */
export interface LearningModule {
  id: string;
  title: string;
  description: string;
  displayOrder: number;
  status: ContentStatus;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;

  // Relations
  materials?: Material[];
}

/**
 * Individual learning resource or article within a module
 * Maps to backend: `models.Material`
 */
export interface Material {
  id: string;
  moduleId: string;
  competencyId: string | null;
  title: string;
  description: string;
  content: string;
  type: MaterialType;
  displayOrder: number;
  status: ContentStatus;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;

  // Relations
  module?: LearningModule;
  competency?: Competency;
  attachments?: MaterialAttachment[];
}

/**
 * Document or media file attached to a material
 * Maps to backend: `models.MaterialAttachment`
 */
export interface MaterialAttachment {
  id: string;
  materialId: string;
  fileId: string;
  displayOrder: number;
  createdAt: string;

  // Relations
  material?: Material;
  file?: FileRecord;
}

/**
 * Student's progress and completion of materials
 * Maps to backend: `models.LearningProgress`
 */
export interface LearningProgress {
  id: string;
  userId: string;
  materialId: string;
  isCompleted: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;

  // Relations
  user?: User;
  material?: Material;
}

// ─── 3.7 Evaluation & Recommendation Models ──────────────────────────────────

/**
 * Assessment outcome summary and performance metrics snapshot
 * Maps to backend: `models.Evaluation`
 */
export interface Evaluation {
  id: string;
  userId: string;
  sourceType: EvaluationSourceType;
  sourceId: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  accuracy: number;
  createdAt: string;

  // Relations
  user?: User;
  competencyEvaluations?: CompetencyEvaluation[];
}

/**
 * Competency score breakdown from an evaluation
 * Maps to backend: `models.CompetencyEvaluation`
 */
export interface CompetencyEvaluation {
  id: string;
  evaluationId: string;
  userId: string;
  competencyId: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  accuracy: number;
  level: PerformanceLevel;
  createdAt: string;

  // Relations
  evaluation?: Evaluation;
  competency?: Competency;
}

/**
 * Recommendation linking weak competencies to learning materials
 * Maps to backend: `models.Recommendation`
 */
export interface Recommendation {
  id: string;
  userId: string;
  competencyId: string;
  evaluationId: string | null;
  materialId: string | null;
  recommendationText: string;
  priority: RecommendationPriority;
  createdAt: string;

  // Relations
  competency?: Competency;
  material?: Material;
}

// ─── 3.8 CMS Content Models ─────────────────────────────────────────────────

/**
 * Published articles, announcements, and news updates
 * Maps to backend: `models.News`
 */
export interface News {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnailUrl: string | null;
  status: ContentStatus;
  publishedAt: string | null;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

/**
 * Platform documentation, guidebooks, and user manuals
 * Maps to backend: `models.Documentation`
 */
export interface Documentation {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  status: ContentStatus;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

/**
 * User testimonials and feedback ratings
 * Maps to backend: `models.Testimonial`
 */
export interface Testimonial {
  id: string;
  userId: string | null;
  authorName: string;
  authorRole: string;
  content: string;
  rating: number; // 1 to 5
  status: TestimonialStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;

  // Relations
  user?: User;
}

// ─── 3.9 System & Infrastructure Models ─────────────────────────────────────

/**
 * Metadata for files uploaded to object storage
 * Maps to backend: `models.FileRecord`
 */
export interface FileRecord {
  id: string;
  objectKey: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  storageProvider: string;
  uploadedBy: string | null;
  createdAt: string;
  deletedAt?: string | null;
}

/**
 * Audit log entry for tracking critical administrative actions
 * Maps to backend: `models.AuditLog`
 */
export interface AuditLog {
  id: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;

  // Relations
  user?: User;
}

/**
 * In-app user notifications and system alerts
 * Maps to backend: `models.Notification`
 */
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  link: string;
  isRead: boolean;
  createdAt: string;

  // Relations
  user?: User;
}
