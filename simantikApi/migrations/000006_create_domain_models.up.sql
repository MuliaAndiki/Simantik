-- 000006_create_domain_models.up.sql
-- Complete SIMANTIK domain tables according to PRD and plan2.md

-- 1. Roles & Permissions (RBAC)
CREATE TABLE IF NOT EXISTS roles (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS permissions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL UNIQUE,
    resource    VARCHAR(50) NOT NULL,
    action      VARCHAR(50) NOT NULL,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id       UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (role_id, permission_id)
);

-- 2. Student Profile
CREATE TABLE IF NOT EXISTS student_profiles (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    school            VARCHAR(150),
    grade             VARCHAR(50),
    major             VARCHAR(100),
    target_university VARCHAR(150),
    target_major      VARCHAR(100),
    bio               TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Competencies
CREATE TABLE IF NOT EXISTS competencies (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code        VARCHAR(50) NOT NULL UNIQUE,
    name        VARCHAR(150) NOT NULL,
    description TEXT,
    status      VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at  TIMESTAMPTZ
);

-- 4. Learning System
CREATE TABLE IF NOT EXISTS learning_modules (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title         VARCHAR(200) NOT NULL,
    description   TEXT,
    display_order INT NOT NULL DEFAULT 0,
    status        VARCHAR(20) NOT NULL DEFAULT 'draft',
    created_by    UUID NOT NULL REFERENCES users(id),
    updated_by    UUID REFERENCES users(id),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at    TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS materials (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id     UUID NOT NULL REFERENCES learning_modules(id) ON DELETE CASCADE,
    competency_id UUID REFERENCES competencies(id) ON DELETE SET NULL,
    title         VARCHAR(255) NOT NULL,
    description   TEXT,
    content       TEXT NOT NULL,
    type          VARCHAR(20) NOT NULL DEFAULT 'text',
    display_order INT NOT NULL DEFAULT 0,
    status        VARCHAR(20) NOT NULL DEFAULT 'draft',
    created_by    UUID NOT NULL REFERENCES users(id),
    updated_by    UUID REFERENCES users(id),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at    TIMESTAMPTZ
);

-- 5. Files (Storage metadata)
CREATE TABLE IF NOT EXISTS files (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    object_key       VARCHAR(500) NOT NULL UNIQUE,
    original_name    VARCHAR(255) NOT NULL,
    mime_type        VARCHAR(100) NOT NULL,
    size_bytes       BIGINT NOT NULL,
    storage_provider VARCHAR(50) NOT NULL DEFAULT 's3',
    uploaded_by      UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at       TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS material_attachments (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id   UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    file_id       UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    display_order INT NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS learning_progress (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    material_id  UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, material_id)
);

-- 6. Question Bank
CREATE TABLE IF NOT EXISTS question_types (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code        VARCHAR(50) NOT NULL UNIQUE,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_type_id UUID NOT NULL REFERENCES question_types(id),
    question_text    TEXT NOT NULL,
    difficulty_level INT NOT NULL DEFAULT 1,
    status           VARCHAR(20) NOT NULL DEFAULT 'draft',
    created_by       UUID NOT NULL REFERENCES users(id),
    updated_by       UUID REFERENCES users(id),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at       TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS question_options (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id   UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_label  VARCHAR(10) NOT NULL,
    option_text   TEXT NOT NULL,
    is_correct    BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS question_competencies (
    question_id   UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    competency_id UUID NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (question_id, competency_id)
);

CREATE TABLE IF NOT EXISTS question_explanations (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id    UUID NOT NULL UNIQUE REFERENCES questions(id) ON DELETE CASCADE,
    explanation    TEXT NOT NULL,
    answering_tips TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Tryouts & Adaptive Assessment
CREATE TABLE IF NOT EXISTS tryouts (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title            VARCHAR(200) NOT NULL,
    description      TEXT,
    duration_seconds INT NOT NULL DEFAULT 4500,
    total_questions  INT NOT NULL DEFAULT 30,
    status           VARCHAR(20) NOT NULL DEFAULT 'draft',
    start_at         TIMESTAMPTZ,
    end_at           TIMESTAMPTZ,
    created_by       UUID NOT NULL REFERENCES users(id),
    updated_by       UUID REFERENCES users(id),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at       TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS tryout_questions (
    tryout_id     UUID NOT NULL REFERENCES tryouts(id) ON DELETE CASCADE,
    question_id   UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    display_order INT NOT NULL DEFAULT 0,
    score_weight  NUMERIC(5,2) NOT NULL DEFAULT 1.0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (tryout_id, question_id)
);

CREATE TABLE IF NOT EXISTS tryout_attempts (
    id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tryout_id                UUID NOT NULL REFERENCES tryouts(id) ON DELETE CASCADE,
    user_id                  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status                   VARCHAR(20) NOT NULL DEFAULT 'in_progress',
    current_question_number  INT NOT NULL DEFAULT 1,
    current_difficulty_level INT NOT NULL DEFAULT 1,
    correct_streak           INT NOT NULL DEFAULT 0,
    score                    NUMERIC(10,2),
    started_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    submitted_at             TIMESTAMPTZ,
    created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attempt_questions (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id       UUID NOT NULL REFERENCES tryout_attempts(id) ON DELETE CASCADE,
    question_id      UUID NOT NULL REFERENCES questions(id),
    question_number  INT NOT NULL,
    difficulty_level INT NOT NULL,
    presented_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    answered_at      TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (attempt_id, question_number)
);

CREATE TABLE IF NOT EXISTS student_answers (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id            UUID NOT NULL REFERENCES tryout_attempts(id) ON DELETE CASCADE,
    question_id           UUID NOT NULL REFERENCES questions(id),
    attempt_question_id   UUID REFERENCES attempt_questions(id) ON DELETE SET NULL,
    selected_option_id    UUID REFERENCES question_options(id) ON DELETE SET NULL,
    answer_data           JSONB,
    is_correct            BOOLEAN,
    score                 NUMERIC(5,2),
    response_time_seconds INT NOT NULL DEFAULT 0,
    answered_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (attempt_id, question_id)
);

-- 8. Practice System
CREATE TABLE IF NOT EXISTS practices (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    competency_id UUID REFERENCES competencies(id) ON DELETE SET NULL,
    status        VARCHAR(20) NOT NULL DEFAULT 'in_progress',
    started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at  TIMESTAMPTZ,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS practice_answers (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    practice_id        UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
    question_id        UUID NOT NULL REFERENCES questions(id),
    selected_option_id UUID REFERENCES question_options(id) ON DELETE SET NULL,
    answer_data        JSONB,
    is_correct         BOOLEAN,
    score              NUMERIC(5,2),
    answered_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (practice_id, question_id)
);

-- 9. Evaluation & Recommendations
CREATE TABLE IF NOT EXISTS evaluations (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    source_type       VARCHAR(20) NOT NULL,
    source_id         UUID NOT NULL,
    total_questions   INT NOT NULL,
    correct_answers   INT NOT NULL,
    incorrect_answers INT NOT NULL,
    score             NUMERIC(10,2) NOT NULL,
    accuracy          NUMERIC(5,2) NOT NULL,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS competency_evaluations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluation_id   UUID NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    competency_id   UUID NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
    total_questions INT NOT NULL,
    correct_answers INT NOT NULL,
    score           NUMERIC(10,2) NOT NULL,
    accuracy        NUMERIC(5,2) NOT NULL,
    level           VARCHAR(20) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recommendations (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    competency_id       UUID NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
    evaluation_id       UUID REFERENCES evaluations(id) ON DELETE SET NULL,
    material_id         UUID REFERENCES materials(id) ON DELETE SET NULL,
    recommendation_text TEXT NOT NULL,
    priority            VARCHAR(20) NOT NULL DEFAULT 'medium',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. CMS & Audit
CREATE TABLE IF NOT EXISTS news (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title         VARCHAR(255) NOT NULL,
    slug          VARCHAR(255) NOT NULL UNIQUE,
    content       TEXT NOT NULL,
    thumbnail_url VARCHAR(500),
    status        VARCHAR(20) NOT NULL DEFAULT 'draft',
    published_at  TIMESTAMPTZ,
    created_by    UUID NOT NULL REFERENCES users(id),
    updated_by    UUID REFERENCES users(id),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at    TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS documentation (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title      VARCHAR(255) NOT NULL,
    slug       VARCHAR(255) NOT NULL UNIQUE,
    content    TEXT NOT NULL,
    category   VARCHAR(100) NOT NULL,
    status     VARCHAR(20) NOT NULL DEFAULT 'draft',
    created_by UUID NOT NULL REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS testimonials (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
    author_name VARCHAR(150) NOT NULL,
    author_role VARCHAR(100),
    content     TEXT NOT NULL,
    rating      INT NOT NULL DEFAULT 5,
    status      VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at  TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
    action      VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id   UUID,
    metadata    JSONB,
    ip_address  VARCHAR(45),
    user_agent  TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Common Indexes
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions (difficulty_level);
CREATE INDEX IF NOT EXISTS idx_questions_status ON questions (status);
CREATE INDEX IF NOT EXISTS idx_tryout_attempts_user ON tryout_attempts (user_id);
CREATE INDEX IF NOT EXISTS idx_tryout_attempts_tryout ON tryout_attempts (tryout_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_user ON evaluations (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs (action);
