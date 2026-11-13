--
-- PostgreSQL database dump
--

\restrict aU0o6xgYI2Acsq3W6DvEA4QYPahTP819ocdWOk5Wc8z6LkgKou2DAHUfWQnn5Fw

-- Dumped from database version 17.12 (14c6cec)
-- Dumped by pg_dump version 18.6 (Debian 18.6-1.pgdg13+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.learning_progress DROP CONSTRAINT IF EXISTS learning_progress_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.learning_progress DROP CONSTRAINT IF EXISTS learning_progress_material_id_fkey;
ALTER TABLE IF EXISTS ONLY public.student_profiles DROP CONSTRAINT IF EXISTS fk_users_student_profile;
ALTER TABLE IF EXISTS ONLY public.tryout_questions DROP CONSTRAINT IF EXISTS fk_tryout_questions_tryout;
ALTER TABLE IF EXISTS ONLY public.tryout_questions DROP CONSTRAINT IF EXISTS fk_tryout_questions_question;
ALTER TABLE IF EXISTS ONLY public.tryout_attempts DROP CONSTRAINT IF EXISTS fk_tryout_attempts_user;
ALTER TABLE IF EXISTS ONLY public.tryout_attempts DROP CONSTRAINT IF EXISTS fk_tryout_attempts_tryout;
ALTER TABLE IF EXISTS ONLY public.attempt_questions DROP CONSTRAINT IF EXISTS fk_tryout_attempts_attempt_questions;
ALTER TABLE IF EXISTS ONLY public.student_answers DROP CONSTRAINT IF EXISTS fk_tryout_attempts_answers;
ALTER TABLE IF EXISTS ONLY public.student_profiles DROP CONSTRAINT IF EXISTS fk_student_profiles_user;
ALTER TABLE IF EXISTS ONLY public.student_answers DROP CONSTRAINT IF EXISTS fk_student_answers_selected_option;
ALTER TABLE IF EXISTS ONLY public.student_answers DROP CONSTRAINT IF EXISTS fk_student_answers_question;
ALTER TABLE IF EXISTS ONLY public.questions DROP CONSTRAINT IF EXISTS fk_stimulus_questions;
ALTER TABLE IF EXISTS ONLY public.role_permissions DROP CONSTRAINT IF EXISTS fk_role_permissions_role;
ALTER TABLE IF EXISTS ONLY public.role_permissions DROP CONSTRAINT IF EXISTS fk_role_permissions_permission;
ALTER TABLE IF EXISTS ONLY public.recommendations DROP CONSTRAINT IF EXISTS fk_recommendations_material;
ALTER TABLE IF EXISTS ONLY public.recommendations DROP CONSTRAINT IF EXISTS fk_recommendations_competency;
ALTER TABLE IF EXISTS ONLY public.questions DROP CONSTRAINT IF EXISTS fk_questions_type;
ALTER TABLE IF EXISTS ONLY public.question_options DROP CONSTRAINT IF EXISTS fk_questions_options;
ALTER TABLE IF EXISTS ONLY public.question_explanations DROP CONSTRAINT IF EXISTS fk_questions_explanation;
ALTER TABLE IF EXISTS ONLY public.question_competencies DROP CONSTRAINT IF EXISTS fk_question_competencies_question;
ALTER TABLE IF EXISTS ONLY public.question_competencies DROP CONSTRAINT IF EXISTS fk_question_competencies_competency;
ALTER TABLE IF EXISTS ONLY public.practices DROP CONSTRAINT IF EXISTS fk_practices_user;
ALTER TABLE IF EXISTS ONLY public.practices DROP CONSTRAINT IF EXISTS fk_practices_package;
ALTER TABLE IF EXISTS ONLY public.practices DROP CONSTRAINT IF EXISTS fk_practices_competency;
ALTER TABLE IF EXISTS ONLY public.practice_answers DROP CONSTRAINT IF EXISTS fk_practices_answers;
ALTER TABLE IF EXISTS ONLY public.practice_packages DROP CONSTRAINT IF EXISTS fk_practice_packages_competency;
ALTER TABLE IF EXISTS ONLY public.practice_package_questions DROP CONSTRAINT IF EXISTS fk_practice_package_questions_question;
ALTER TABLE IF EXISTS ONLY public.practice_package_questions DROP CONSTRAINT IF EXISTS fk_practice_package_questions_practice_package;
ALTER TABLE IF EXISTS ONLY public.practice_answers DROP CONSTRAINT IF EXISTS fk_practice_answers_selected_option;
ALTER TABLE IF EXISTS ONLY public.practice_answers DROP CONSTRAINT IF EXISTS fk_practice_answers_question;
ALTER TABLE IF EXISTS ONLY public.notifications DROP CONSTRAINT IF EXISTS fk_notifications_user;
ALTER TABLE IF EXISTS ONLY public.materials DROP CONSTRAINT IF EXISTS fk_materials_competency;
ALTER TABLE IF EXISTS ONLY public.material_attachments DROP CONSTRAINT IF EXISTS fk_materials_attachments;
ALTER TABLE IF EXISTS ONLY public.material_attachments DROP CONSTRAINT IF EXISTS fk_material_attachments_file;
ALTER TABLE IF EXISTS ONLY public.learning_progresses DROP CONSTRAINT IF EXISTS fk_learning_progresses_user;
ALTER TABLE IF EXISTS ONLY public.learning_progresses DROP CONSTRAINT IF EXISTS fk_learning_progresses_material;
ALTER TABLE IF EXISTS ONLY public.materials DROP CONSTRAINT IF EXISTS fk_learning_modules_materials;
ALTER TABLE IF EXISTS ONLY public.evaluations DROP CONSTRAINT IF EXISTS fk_evaluations_user;
ALTER TABLE IF EXISTS ONLY public.competency_evaluations DROP CONSTRAINT IF EXISTS fk_evaluations_competency_evaluations;
ALTER TABLE IF EXISTS ONLY public.competency_evaluations DROP CONSTRAINT IF EXISTS fk_competency_evaluations_competency;
ALTER TABLE IF EXISTS ONLY public.attempt_questions DROP CONSTRAINT IF EXISTS fk_attempt_questions_question;
ALTER TABLE IF EXISTS ONLY public.files DROP CONSTRAINT IF EXISTS files_uploaded_by_fkey;
ALTER TABLE IF EXISTS ONLY public.documentation DROP CONSTRAINT IF EXISTS documentation_updated_by_fkey;
ALTER TABLE IF EXISTS ONLY public.documentation DROP CONSTRAINT IF EXISTS documentation_created_by_fkey;
DROP INDEX IF EXISTS public.idx_users_email;
DROP INDEX IF EXISTS public.idx_users_deleted_at;
DROP INDEX IF EXISTS public.idx_tutorials_status;
DROP INDEX IF EXISTS public.idx_tutorials_slug;
DROP INDEX IF EXISTS public.idx_tutorials_deleted_at;
DROP INDEX IF EXISTS public.idx_tutorials_created_by;
DROP INDEX IF EXISTS public.idx_tutorials_category;
DROP INDEX IF EXISTS public.idx_tryouts_status_jenjang;
DROP INDEX IF EXISTS public.idx_tryouts_status;
DROP INDEX IF EXISTS public.idx_tryouts_jenjang;
DROP INDEX IF EXISTS public.idx_tryouts_deleted_at;
DROP INDEX IF EXISTS public.idx_tryouts_created_by;
DROP INDEX IF EXISTS public.idx_tryout_attempts_user_id;
DROP INDEX IF EXISTS public.idx_tryout_attempts_user;
DROP INDEX IF EXISTS public.idx_tryout_attempts_tryout_status;
DROP INDEX IF EXISTS public.idx_tryout_attempts_tryout_id;
DROP INDEX IF EXISTS public.idx_tryout_attempts_tryout;
DROP INDEX IF EXISTS public.idx_tryout_attempts_status;
DROP INDEX IF EXISTS public.idx_tryout_attempts_score;
DROP INDEX IF EXISTS public.idx_tq_q;
DROP INDEX IF EXISTS public.idx_testimonials_user_id;
DROP INDEX IF EXISTS public.idx_testimonials_status;
DROP INDEX IF EXISTS public.idx_testimonials_deleted_at;
DROP INDEX IF EXISTS public.idx_student_profiles_user_id;
DROP INDEX IF EXISTS public.idx_student_profiles_school_id;
DROP INDEX IF EXISTS public.idx_student_profiles_jenjang;
DROP INDEX IF EXISTS public.idx_student_answers_question_opt;
DROP INDEX IF EXISTS public.idx_student_answers_question_id;
DROP INDEX IF EXISTS public.idx_student_answers_question_correct;
DROP INDEX IF EXISTS public.idx_student_answers_attempt_question_id;
DROP INDEX IF EXISTS public.idx_student_answers_attempt_question;
DROP INDEX IF EXISTS public.idx_student_answers_attempt_id;
DROP INDEX IF EXISTS public.idx_stimulus_deleted_at;
DROP INDEX IF EXISTS public.idx_stimulus_created_by;
DROP INDEX IF EXISTS public.idx_stimuli_package_scope;
DROP INDEX IF EXISTS public.idx_schools_level;
DROP INDEX IF EXISTS public.idx_schools_jenjang;
DROP INDEX IF EXISTS public.idx_schools_deleted_at;
DROP INDEX IF EXISTS public.idx_roles_name;
DROP INDEX IF EXISTS public.idx_refresh_tokens_user_id;
DROP INDEX IF EXISTS public.idx_refresh_tokens_token_hash;
DROP INDEX IF EXISTS public.idx_refresh_tokens_expires_at;
DROP INDEX IF EXISTS public.idx_recommendations_user_id;
DROP INDEX IF EXISTS public.idx_recommendations_material_id;
DROP INDEX IF EXISTS public.idx_recommendations_evaluation_id;
DROP INDEX IF EXISTS public.idx_recommendations_competency_id;
DROP INDEX IF EXISTS public.idx_questions_stimulus_id;
DROP INDEX IF EXISTS public.idx_questions_status;
DROP INDEX IF EXISTS public.idx_questions_question_type_id;
DROP INDEX IF EXISTS public.idx_questions_jenjang;
DROP INDEX IF EXISTS public.idx_questions_difficulty_level;
DROP INDEX IF EXISTS public.idx_questions_difficulty;
DROP INDEX IF EXISTS public.idx_questions_deleted_at;
DROP INDEX IF EXISTS public.idx_questions_created_by;
DROP INDEX IF EXISTS public.idx_question_types_code;
DROP INDEX IF EXISTS public.idx_question_options_question_id;
DROP INDEX IF EXISTS public.idx_question_explanations_question_id;
DROP INDEX IF EXISTS public.idx_qc_comp;
DROP INDEX IF EXISTS public.idx_practices_user_id;
DROP INDEX IF EXISTS public.idx_practices_status;
DROP INDEX IF EXISTS public.idx_practices_package_id;
DROP INDEX IF EXISTS public.idx_practices_competency_id;
DROP INDEX IF EXISTS public.idx_practice_packages_status;
DROP INDEX IF EXISTS public.idx_practice_packages_jenjang;
DROP INDEX IF EXISTS public.idx_practice_packages_deleted_at;
DROP INDEX IF EXISTS public.idx_practice_packages_created_by;
DROP INDEX IF EXISTS public.idx_practice_packages_competency_id;
DROP INDEX IF EXISTS public.idx_practice_answers_question_id;
DROP INDEX IF EXISTS public.idx_practice_answers_practice_question;
DROP INDEX IF EXISTS public.idx_practice_answers_practice_id;
DROP INDEX IF EXISTS public.idx_permissions_resource;
DROP INDEX IF EXISTS public.idx_permissions_name;
DROP INDEX IF EXISTS public.idx_password_reset_tokens_user_id;
DROP INDEX IF EXISTS public.idx_password_reset_tokens_token_hash;
DROP INDEX IF EXISTS public.idx_otp_codes_user_id;
DROP INDEX IF EXISTS public.idx_otp_codes_expires_at;
DROP INDEX IF EXISTS public.idx_notifications_user_id;
DROP INDEX IF EXISTS public.idx_notifications_user;
DROP INDEX IF EXISTS public.idx_notifications_type;
DROP INDEX IF EXISTS public.idx_notifications_is_read;
DROP INDEX IF EXISTS public.idx_notifications_created_at;
DROP INDEX IF EXISTS public.idx_news_status;
DROP INDEX IF EXISTS public.idx_news_slug;
DROP INDEX IF EXISTS public.idx_news_deleted_at;
DROP INDEX IF EXISTS public.idx_news_created_by;
DROP INDEX IF EXISTS public.idx_materials_module_id;
DROP INDEX IF EXISTS public.idx_materials_jenjang;
DROP INDEX IF EXISTS public.idx_materials_deleted_at;
DROP INDEX IF EXISTS public.idx_materials_created_by;
DROP INDEX IF EXISTS public.idx_materials_competency_id;
DROP INDEX IF EXISTS public.idx_material_attachments_material_id;
DROP INDEX IF EXISTS public.idx_material_attachments_file_id;
DROP INDEX IF EXISTS public.idx_learning_progresses_user_id;
DROP INDEX IF EXISTS public.idx_learning_progresses_user_completed;
DROP INDEX IF EXISTS public.idx_learning_progresses_material_id;
DROP INDEX IF EXISTS public.idx_learning_progress_user_material;
DROP INDEX IF EXISTS public.idx_learning_modules_label;
DROP INDEX IF EXISTS public.idx_learning_modules_jenjang;
DROP INDEX IF EXISTS public.idx_learning_modules_deleted_at;
DROP INDEX IF EXISTS public.idx_learning_modules_created_by;
DROP INDEX IF EXISTS public.idx_file_records_uploaded_by;
DROP INDEX IF EXISTS public.idx_file_records_object_key;
DROP INDEX IF EXISTS public.idx_file_records_deleted_at;
DROP INDEX IF EXISTS public.idx_external_accounts_user_id;
DROP INDEX IF EXISTS public.idx_external_accounts_provider_user;
DROP INDEX IF EXISTS public.idx_evaluations_user_id;
DROP INDEX IF EXISTS public.idx_evaluations_user;
DROP INDEX IF EXISTS public.idx_evaluations_source_type;
DROP INDEX IF EXISTS public.idx_evaluations_source_id;
DROP INDEX IF EXISTS public.idx_evals_source;
DROP INDEX IF EXISTS public.idx_documentations_status;
DROP INDEX IF EXISTS public.idx_documentations_slug;
DROP INDEX IF EXISTS public.idx_documentations_deleted_at;
DROP INDEX IF EXISTS public.idx_documentations_created_by;
DROP INDEX IF EXISTS public.idx_documentations_category;
DROP INDEX IF EXISTS public.idx_competency_evaluations_user_id;
DROP INDEX IF EXISTS public.idx_competency_evaluations_user_comp;
DROP INDEX IF EXISTS public.idx_competency_evaluations_evaluation_id;
DROP INDEX IF EXISTS public.idx_competency_evaluations_competency_id;
DROP INDEX IF EXISTS public.idx_competency_evaluations_comp_level;
DROP INDEX IF EXISTS public.idx_competencies_deleted_at;
DROP INDEX IF EXISTS public.idx_competencies_code;
DROP INDEX IF EXISTS public.idx_audit_logs_user_id;
DROP INDEX IF EXISTS public.idx_audit_logs_entity_type;
DROP INDEX IF EXISTS public.idx_audit_logs_entity_id;
DROP INDEX IF EXISTS public.idx_audit_logs_created_at;
DROP INDEX IF EXISTS public.idx_audit_logs_action;
DROP INDEX IF EXISTS public.idx_attempts_user_tryout_status;
DROP INDEX IF EXISTS public.idx_attempts_user_started;
DROP INDEX IF EXISTS public.idx_attempt_questions_question_id;
DROP INDEX IF EXISTS public.idx_attempt_questions_attempt_id;
DROP INDEX IF EXISTS public.idx_aq_attempt_question;
DROP INDEX IF EXISTS public.idx_aq_attempt_number;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.tutorials DROP CONSTRAINT IF EXISTS tutorials_pkey;
ALTER TABLE IF EXISTS ONLY public.tryouts DROP CONSTRAINT IF EXISTS tryouts_pkey;
ALTER TABLE IF EXISTS ONLY public.tryout_questions DROP CONSTRAINT IF EXISTS tryout_questions_pkey;
ALTER TABLE IF EXISTS ONLY public.tryout_attempts DROP CONSTRAINT IF EXISTS tryout_attempts_pkey;
ALTER TABLE IF EXISTS ONLY public.testimonials DROP CONSTRAINT IF EXISTS testimonials_pkey;
ALTER TABLE IF EXISTS ONLY public.student_profiles DROP CONSTRAINT IF EXISTS student_profiles_pkey;
ALTER TABLE IF EXISTS ONLY public.student_answers DROP CONSTRAINT IF EXISTS student_answers_pkey;
ALTER TABLE IF EXISTS ONLY public.stimulus DROP CONSTRAINT IF EXISTS stimulus_pkey;
ALTER TABLE IF EXISTS ONLY public.schools DROP CONSTRAINT IF EXISTS schools_pkey;
ALTER TABLE IF EXISTS ONLY public.schools DROP CONSTRAINT IF EXISTS schools_npsn_key;
ALTER TABLE IF EXISTS ONLY public.schema_migrations DROP CONSTRAINT IF EXISTS schema_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS roles_pkey;
ALTER TABLE IF EXISTS ONLY public.role_permissions DROP CONSTRAINT IF EXISTS role_permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_pkey;
ALTER TABLE IF EXISTS ONLY public.recommendations DROP CONSTRAINT IF EXISTS recommendations_pkey;
ALTER TABLE IF EXISTS ONLY public.questions DROP CONSTRAINT IF EXISTS questions_pkey;
ALTER TABLE IF EXISTS ONLY public.question_types DROP CONSTRAINT IF EXISTS question_types_pkey;
ALTER TABLE IF EXISTS ONLY public.question_options DROP CONSTRAINT IF EXISTS question_options_pkey;
ALTER TABLE IF EXISTS ONLY public.question_explanations DROP CONSTRAINT IF EXISTS question_explanations_pkey;
ALTER TABLE IF EXISTS ONLY public.question_competencies DROP CONSTRAINT IF EXISTS question_competencies_pkey;
ALTER TABLE IF EXISTS ONLY public.practices DROP CONSTRAINT IF EXISTS practices_pkey;
ALTER TABLE IF EXISTS ONLY public.practice_packages DROP CONSTRAINT IF EXISTS practice_packages_pkey;
ALTER TABLE IF EXISTS ONLY public.practice_package_questions DROP CONSTRAINT IF EXISTS practice_package_questions_pkey;
ALTER TABLE IF EXISTS ONLY public.practice_answers DROP CONSTRAINT IF EXISTS practice_answers_pkey;
ALTER TABLE IF EXISTS ONLY public.permissions DROP CONSTRAINT IF EXISTS permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.password_reset_tokens DROP CONSTRAINT IF EXISTS password_reset_tokens_pkey;
ALTER TABLE IF EXISTS ONLY public.otp_codes DROP CONSTRAINT IF EXISTS otp_codes_pkey;
ALTER TABLE IF EXISTS ONLY public.notifications DROP CONSTRAINT IF EXISTS notifications_pkey;
ALTER TABLE IF EXISTS ONLY public.news DROP CONSTRAINT IF EXISTS news_pkey;
ALTER TABLE IF EXISTS ONLY public.materials DROP CONSTRAINT IF EXISTS materials_pkey;
ALTER TABLE IF EXISTS ONLY public.material_attachments DROP CONSTRAINT IF EXISTS material_attachments_pkey;
ALTER TABLE IF EXISTS ONLY public.learning_progresses DROP CONSTRAINT IF EXISTS learning_progresses_pkey;
ALTER TABLE IF EXISTS ONLY public.learning_progress DROP CONSTRAINT IF EXISTS learning_progress_user_id_material_id_key;
ALTER TABLE IF EXISTS ONLY public.learning_progress DROP CONSTRAINT IF EXISTS learning_progress_pkey;
ALTER TABLE IF EXISTS ONLY public.learning_modules DROP CONSTRAINT IF EXISTS learning_modules_pkey;
ALTER TABLE IF EXISTS ONLY public.files DROP CONSTRAINT IF EXISTS files_pkey;
ALTER TABLE IF EXISTS ONLY public.files DROP CONSTRAINT IF EXISTS files_object_key_key;
ALTER TABLE IF EXISTS ONLY public.file_records DROP CONSTRAINT IF EXISTS file_records_pkey;
ALTER TABLE IF EXISTS ONLY public.external_accounts DROP CONSTRAINT IF EXISTS external_accounts_pkey;
ALTER TABLE IF EXISTS ONLY public.evaluations DROP CONSTRAINT IF EXISTS evaluations_pkey;
ALTER TABLE IF EXISTS ONLY public.documentations DROP CONSTRAINT IF EXISTS documentations_pkey;
ALTER TABLE IF EXISTS ONLY public.documentation DROP CONSTRAINT IF EXISTS documentation_slug_key;
ALTER TABLE IF EXISTS ONLY public.documentation DROP CONSTRAINT IF EXISTS documentation_pkey;
ALTER TABLE IF EXISTS ONLY public.competency_evaluations DROP CONSTRAINT IF EXISTS competency_evaluations_pkey;
ALTER TABLE IF EXISTS ONLY public.competencies DROP CONSTRAINT IF EXISTS competencies_pkey;
ALTER TABLE IF EXISTS ONLY public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.attempt_questions DROP CONSTRAINT IF EXISTS attempt_questions_pkey;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.tutorials;
DROP TABLE IF EXISTS public.tryouts;
DROP TABLE IF EXISTS public.tryout_questions;
DROP TABLE IF EXISTS public.tryout_attempts;
DROP TABLE IF EXISTS public.testimonials;
DROP TABLE IF EXISTS public.student_profiles;
DROP TABLE IF EXISTS public.student_answers;
DROP TABLE IF EXISTS public.stimulus;
DROP TABLE IF EXISTS public.schools;
DROP TABLE IF EXISTS public.schema_migrations;
DROP TABLE IF EXISTS public.roles;
DROP TABLE IF EXISTS public.role_permissions;
DROP TABLE IF EXISTS public.refresh_tokens;
DROP TABLE IF EXISTS public.recommendations;
DROP TABLE IF EXISTS public.questions;
DROP TABLE IF EXISTS public.question_types;
DROP TABLE IF EXISTS public.question_options;
DROP TABLE IF EXISTS public.question_explanations;
DROP TABLE IF EXISTS public.question_competencies;
DROP TABLE IF EXISTS public.practices;
DROP TABLE IF EXISTS public.practice_packages;
DROP TABLE IF EXISTS public.practice_package_questions;
DROP TABLE IF EXISTS public.practice_answers;
DROP TABLE IF EXISTS public.permissions;
DROP TABLE IF EXISTS public.password_reset_tokens;
DROP TABLE IF EXISTS public.otp_codes;
DROP TABLE IF EXISTS public.notifications;
DROP TABLE IF EXISTS public.news;
DROP TABLE IF EXISTS public.materials;
DROP TABLE IF EXISTS public.material_attachments;
DROP TABLE IF EXISTS public.learning_progresses;
DROP TABLE IF EXISTS public.learning_progress;
DROP TABLE IF EXISTS public.learning_modules;
DROP TABLE IF EXISTS public.files;
DROP TABLE IF EXISTS public.file_records;
DROP TABLE IF EXISTS public.external_accounts;
DROP TABLE IF EXISTS public.evaluations;
DROP TABLE IF EXISTS public.documentations;
DROP TABLE IF EXISTS public.documentation;
DROP TABLE IF EXISTS public.competency_evaluations;
DROP TABLE IF EXISTS public.competencies;
DROP TABLE IF EXISTS public.audit_logs;
DROP TABLE IF EXISTS public.attempt_questions;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: attempt_questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.attempt_questions (
    id uuid NOT NULL,
    attempt_id uuid NOT NULL,
    question_id uuid NOT NULL,
    question_number bigint NOT NULL,
    difficulty_level bigint NOT NULL,
    presented_at timestamp with time zone NOT NULL,
    answered_at timestamp with time zone,
    created_at timestamp with time zone
);


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_logs (
    id uuid NOT NULL,
    user_id uuid,
    action character varying(50) NOT NULL,
    entity_type character varying(50) NOT NULL,
    entity_id uuid,
    metadata jsonb,
    ip_address character varying(45),
    user_agent text,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: competencies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.competencies (
    id uuid NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(150) NOT NULL,
    description text,
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


--
-- Name: competency_evaluations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.competency_evaluations (
    id uuid NOT NULL,
    evaluation_id uuid NOT NULL,
    user_id uuid NOT NULL,
    competency_id uuid NOT NULL,
    total_questions bigint NOT NULL,
    correct_answers bigint NOT NULL,
    score numeric(10,2) NOT NULL,
    accuracy numeric(5,2) NOT NULL,
    level character varying(20) NOT NULL,
    created_at timestamp with time zone
);


--
-- Name: documentation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.documentation (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    content text NOT NULL,
    category character varying(100) NOT NULL,
    status character varying(20) DEFAULT 'draft'::character varying NOT NULL,
    created_by uuid NOT NULL,
    updated_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: documentations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.documentations (
    id uuid NOT NULL,
    title character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    content text NOT NULL,
    category character varying(100) NOT NULL,
    status character varying(20) DEFAULT 'draft'::character varying NOT NULL,
    created_by uuid NOT NULL,
    updated_by uuid,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


--
-- Name: evaluations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evaluations (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    source_type character varying(20) NOT NULL,
    source_id uuid NOT NULL,
    total_questions bigint NOT NULL,
    correct_answers bigint NOT NULL,
    incorrect_answers bigint NOT NULL,
    score numeric(10,2) NOT NULL,
    accuracy numeric(5,2) NOT NULL,
    created_at timestamp with time zone
);


--
-- Name: external_accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.external_accounts (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    provider character varying(30) NOT NULL,
    provider_user_id character varying(255) NOT NULL,
    email character varying(255),
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- Name: file_records; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.file_records (
    id uuid NOT NULL,
    object_key character varying(500) NOT NULL,
    original_name character varying(255) NOT NULL,
    mime_type character varying(100) NOT NULL,
    size_bytes bigint NOT NULL,
    storage_provider character varying(50) DEFAULT 's3'::character varying NOT NULL,
    uploaded_by uuid,
    created_at timestamp with time zone,
    deleted_at timestamp with time zone
);


--
-- Name: files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.files (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    object_key character varying(500) NOT NULL,
    original_name character varying(255) NOT NULL,
    mime_type character varying(100) NOT NULL,
    size_bytes bigint NOT NULL,
    storage_provider character varying(50) DEFAULT 's3'::character varying NOT NULL,
    uploaded_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: learning_modules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.learning_modules (
    id uuid NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    display_order bigint DEFAULT 0 NOT NULL,
    status character varying(20) DEFAULT 'draft'::character varying NOT NULL,
    created_by uuid NOT NULL,
    updated_by uuid,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    label character varying(100),
    jenjang character varying(20) DEFAULT 'sma'::character varying NOT NULL
);


--
-- Name: learning_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.learning_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    material_id uuid NOT NULL,
    is_completed boolean DEFAULT false NOT NULL,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: learning_progresses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.learning_progresses (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    material_id uuid NOT NULL,
    is_completed boolean DEFAULT false NOT NULL,
    completed_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- Name: material_attachments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.material_attachments (
    id uuid NOT NULL,
    material_id uuid NOT NULL,
    file_id uuid NOT NULL,
    display_order bigint DEFAULT 0 NOT NULL,
    created_at timestamp with time zone
);


--
-- Name: materials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.materials (
    id uuid NOT NULL,
    module_id uuid NOT NULL,
    competency_id uuid,
    title character varying(255) NOT NULL,
    description text,
    content text NOT NULL,
    type character varying(20) DEFAULT 'text'::character varying NOT NULL,
    display_order bigint DEFAULT 0 NOT NULL,
    status character varying(20) DEFAULT 'draft'::character varying NOT NULL,
    created_by uuid NOT NULL,
    updated_by uuid,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    jenjang character varying(20) DEFAULT 'sma'::character varying NOT NULL,
    learning_objectives jsonb DEFAULT '[]'::jsonb,
    structure_items jsonb DEFAULT '[]'::jsonb
);


--
-- Name: news; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.news (
    id uuid NOT NULL,
    title character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    content text NOT NULL,
    thumbnail_url character varying(500),
    status character varying(20) DEFAULT 'draft'::character varying NOT NULL,
    published_at timestamp with time zone,
    created_by uuid NOT NULL,
    updated_by uuid,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    type character varying(50) DEFAULT 'system'::character varying NOT NULL,
    link character varying(255),
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: otp_codes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.otp_codes (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    purpose character varying(30) NOT NULL,
    code_hash character varying(255) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    attempts bigint DEFAULT 0 NOT NULL,
    max_attempts bigint DEFAULT 5 NOT NULL,
    verified_at timestamp with time zone,
    created_at timestamp with time zone
);


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.password_reset_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_hash character varying(64) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    used_at timestamp with time zone,
    created_at timestamp with time zone
);


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permissions (
    id uuid NOT NULL,
    name character varying(100) NOT NULL,
    resource character varying(50) NOT NULL,
    action character varying(50) NOT NULL,
    description text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- Name: practice_answers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.practice_answers (
    id uuid NOT NULL,
    practice_id uuid NOT NULL,
    question_id uuid NOT NULL,
    selected_option_id uuid,
    answer_data jsonb,
    is_correct boolean,
    score numeric(5,2),
    answered_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone
);


--
-- Name: practice_package_questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.practice_package_questions (
    package_id uuid NOT NULL,
    question_id uuid NOT NULL,
    display_order bigint DEFAULT 0 NOT NULL,
    created_at timestamp with time zone
);


--
-- Name: practice_packages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.practice_packages (
    id uuid NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    competency_id uuid,
    jenjang character varying(20) DEFAULT 'sma'::character varying NOT NULL,
    total_questions bigint DEFAULT 0 NOT NULL,
    status character varying(20) DEFAULT 'draft'::character varying NOT NULL,
    created_by uuid NOT NULL,
    updated_by uuid,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


--
-- Name: practices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.practices (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    competency_id uuid,
    status character varying(20) DEFAULT 'in_progress'::character varying NOT NULL,
    started_at timestamp with time zone NOT NULL,
    completed_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    package_id uuid,
    score numeric(5,2),
    total_questions bigint DEFAULT 0 NOT NULL,
    correct_answers bigint DEFAULT 0 NOT NULL,
    is_auto_submitted boolean DEFAULT false NOT NULL,
    auto_submit_reason character varying(100)
);


--
-- Name: question_competencies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.question_competencies (
    question_id uuid NOT NULL,
    competency_id uuid NOT NULL,
    created_at timestamp with time zone
);


--
-- Name: question_explanations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.question_explanations (
    id uuid NOT NULL,
    question_id uuid NOT NULL,
    explanation text NOT NULL,
    answering_tips text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- Name: question_options; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.question_options (
    id uuid NOT NULL,
    question_id uuid NOT NULL,
    option_label character varying(10) NOT NULL,
    option_text text NOT NULL,
    is_correct boolean DEFAULT false NOT NULL,
    display_order bigint DEFAULT 0 NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- Name: question_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.question_types (
    id uuid NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- Name: questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.questions (
    id uuid NOT NULL,
    question_type_id uuid NOT NULL,
    question_text text NOT NULL,
    difficulty_level bigint DEFAULT 1 NOT NULL,
    status character varying(20) DEFAULT 'draft'::character varying NOT NULL,
    created_by uuid NOT NULL,
    updated_by uuid,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    jenjang character varying(20) DEFAULT 'sma'::character varying NOT NULL,
    stimulus_id uuid
);


--
-- Name: recommendations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recommendations (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    competency_id uuid NOT NULL,
    evaluation_id uuid,
    material_id uuid,
    recommendation_text text NOT NULL,
    priority character varying(20) DEFAULT 'medium'::character varying NOT NULL,
    created_at timestamp with time zone
);


--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.refresh_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_hash character varying(64) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    revoked_at timestamp with time zone,
    last_used_at timestamp with time zone,
    user_agent text,
    ip_address character varying(45),
    created_at timestamp with time zone
);


--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_permissions (
    role_id uuid NOT NULL,
    permission_id uuid NOT NULL,
    created_at timestamp with time zone
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id uuid NOT NULL,
    name character varying(50) NOT NULL,
    description text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version bigint NOT NULL,
    dirty boolean NOT NULL
);


--
-- Name: schools; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schools (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    npsn character varying(20) NOT NULL,
    nama character varying(255) NOT NULL,
    jenjang character varying(20) NOT NULL,
    status character varying(20) NOT NULL,
    logo character varying(500),
    alamat character varying(500) NOT NULL,
    provinsi character varying(100),
    kabupaten character varying(100),
    kecamatan character varying(100),
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


--
-- Name: stimulus; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stimulus (
    id uuid NOT NULL,
    title character varying(200) NOT NULL,
    content text NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    package_id uuid,
    package_kind character varying(20)
);


--
-- Name: student_answers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_answers (
    id uuid NOT NULL,
    attempt_id uuid NOT NULL,
    question_id uuid NOT NULL,
    attempt_question_id uuid,
    selected_option_id uuid,
    answer_data jsonb,
    is_correct boolean,
    score numeric(5,2),
    response_time_seconds bigint DEFAULT 0 NOT NULL,
    answered_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- Name: student_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_profiles (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    school character varying(150),
    grade character varying(50),
    major character varying(100),
    target_university character varying(150),
    target_major character varying(100),
    bio text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    school_id uuid,
    jenjang character varying(20)
);


--
-- Name: testimonials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.testimonials (
    id uuid NOT NULL,
    user_id uuid,
    author_name character varying(150) NOT NULL,
    author_role character varying(100),
    content text NOT NULL,
    rating bigint DEFAULT 5 NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


--
-- Name: tryout_attempts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tryout_attempts (
    id uuid NOT NULL,
    tryout_id uuid NOT NULL,
    user_id uuid NOT NULL,
    status character varying(20) DEFAULT 'in_progress'::character varying NOT NULL,
    current_question_number bigint DEFAULT 1 NOT NULL,
    current_difficulty_level bigint DEFAULT 1 NOT NULL,
    correct_streak bigint DEFAULT 0 NOT NULL,
    score numeric(10,2),
    started_at timestamp with time zone NOT NULL,
    submitted_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    target_streak bigint DEFAULT 2 NOT NULL,
    window_correct bigint DEFAULT 0 NOT NULL,
    window_incorrect bigint DEFAULT 0 NOT NULL,
    is_tie_breaker boolean DEFAULT false NOT NULL,
    is_auto_submitted boolean DEFAULT false NOT NULL,
    auto_submit_reason character varying(100)
);


--
-- Name: tryout_questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tryout_questions (
    tryout_id uuid NOT NULL,
    question_id uuid NOT NULL,
    display_order bigint DEFAULT 0 NOT NULL,
    score_weight numeric(5,2) DEFAULT 1 NOT NULL,
    created_at timestamp with time zone
);


--
-- Name: tryouts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tryouts (
    id uuid NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    duration_seconds bigint DEFAULT 4500 NOT NULL,
    total_questions bigint DEFAULT 30 NOT NULL,
    status character varying(20) DEFAULT 'draft'::character varying NOT NULL,
    start_at timestamp with time zone,
    end_at timestamp with time zone,
    created_by uuid NOT NULL,
    updated_by uuid,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    jenjang character varying(20) DEFAULT 'sma'::character varying NOT NULL
);


--
-- Name: tutorials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tutorials (
    id uuid NOT NULL,
    title character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    description text,
    youtube_url character varying(500) NOT NULL,
    duration_seconds bigint DEFAULT 0 NOT NULL,
    category character varying(100) NOT NULL,
    jenjang character varying(20) DEFAULT 'sma'::character varying NOT NULL,
    status character varying(20) DEFAULT 'draft'::character varying NOT NULL,
    published_at timestamp with time zone,
    created_by uuid NOT NULL,
    updated_by uuid,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    full_name character varying(150) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) DEFAULT ''::character varying NOT NULL,
    avatar_url character varying(500),
    role character varying(30) DEFAULT 'student'::character varying NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    last_login_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


--
-- Data for Name: attempt_questions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.attempt_questions (id, attempt_id, question_id, question_number, difficulty_level, presented_at, answered_at, created_at) FROM stdin;
8a473be7-98f9-4241-9c34-be9b903ab6be	c4594205-b7fc-45eb-a3b3-d43ac0c6f630	02ba1a6a-8ad2-4587-a92e-9cbc74cef20b	1	2	2026-09-28 06:38:41.681878+00	\N	2026-09-28 06:38:42.188686+00
e3cf599b-811a-491a-b84b-c883e70dc10b	c4594205-b7fc-45eb-a3b3-d43ac0c6f630	f49f136b-d0b0-4588-aa0d-aa549e9e7647	2	1	2026-09-28 06:38:41.681878+00	\N	2026-09-28 06:38:42.188686+00
9f1c6aaf-088a-448d-b449-bf1e96abc242	c4594205-b7fc-45eb-a3b3-d43ac0c6f630	7acc58ec-1d7f-4f2f-aec7-2e9df230ab51	3	3	2026-09-28 06:38:41.681878+00	\N	2026-09-28 06:38:42.188686+00
bc4f9693-578f-4d0f-aa78-e00173e99fb8	c4594205-b7fc-45eb-a3b3-d43ac0c6f630	939e6bb7-af2b-49b6-9fbc-224d14e4ab94	4	4	2026-09-28 06:38:41.681878+00	\N	2026-09-28 06:38:42.188686+00
a7ad07b8-55cb-45f5-95b7-e0cc130c4982	c4594205-b7fc-45eb-a3b3-d43ac0c6f630	ca0f2713-6e49-4385-83ff-3d2a32c9df38	5	5	2026-09-28 06:38:41.681878+00	\N	2026-09-28 06:38:42.188686+00
0e75223b-c22f-4267-9db9-852b764a4394	c4594205-b7fc-45eb-a3b3-d43ac0c6f630	39e9cfa9-ecf9-47c4-a3dc-097178820aff	6	1	2026-09-28 06:38:41.681878+00	\N	2026-09-28 06:38:42.188686+00
ff99f859-7af3-45e4-aa10-68b0f36bba7b	c4594205-b7fc-45eb-a3b3-d43ac0c6f630	e9232f01-bf4c-4f5d-b27e-5d15063d8b8c	7	2	2026-09-28 06:38:41.681878+00	\N	2026-09-28 06:38:42.188686+00
bdafc624-9d7b-49a8-a9c2-6dbe0b411400	c4594205-b7fc-45eb-a3b3-d43ac0c6f630	138e7334-0505-429d-a399-e28418fbb0ac	8	3	2026-09-28 06:38:41.681878+00	\N	2026-09-28 06:38:42.188686+00
bdd9ac8e-a4b5-4210-9ef4-b4b1f670b807	c4594205-b7fc-45eb-a3b3-d43ac0c6f630	afc043b3-bb56-4ed7-b4c9-dff438aad899	9	4	2026-09-28 06:38:41.681878+00	\N	2026-09-28 06:38:42.188686+00
f2b4c3cb-44f6-468b-a503-ec86b64c5c2b	c4594205-b7fc-45eb-a3b3-d43ac0c6f630	ae47dce0-f370-4050-a5e7-d0a27277a414	10	5	2026-09-28 06:38:41.681878+00	\N	2026-09-28 06:38:42.188686+00
2adad9e6-f7cd-4398-9daf-1a9c54924c34	c4594205-b7fc-45eb-a3b3-d43ac0c6f630	37b33e7f-4016-4cfd-a9e0-eb1f33896527	11	1	2026-09-28 06:38:41.681878+00	\N	2026-09-28 06:38:42.188686+00
c0885b7a-ed51-494f-8ac0-18d19d4c0389	c4594205-b7fc-45eb-a3b3-d43ac0c6f630	8a9d3b1f-2724-4193-9caf-71b7de257627	12	2	2026-09-28 06:38:41.681878+00	\N	2026-09-28 06:38:42.188686+00
23130259-a8dd-4a03-9f0f-90c1861ef70d	c4594205-b7fc-45eb-a3b3-d43ac0c6f630	5b8dc496-4c06-4270-9da4-7148aa3cefef	13	3	2026-09-28 06:38:41.681878+00	\N	2026-09-28 06:38:42.188686+00
66488e02-cd87-4567-941b-0b5597da4826	c4594205-b7fc-45eb-a3b3-d43ac0c6f630	7fc19fd7-107f-4e50-89c3-001d188312a7	14	4	2026-09-28 06:38:41.681878+00	\N	2026-09-28 06:38:42.188686+00
b99398ee-399b-49c2-bd62-b6e746bb880c	c4594205-b7fc-45eb-a3b3-d43ac0c6f630	7d011732-3523-4bcf-aa8a-3e4d8461785f	15	5	2026-09-28 06:38:41.681878+00	\N	2026-09-28 06:38:42.188686+00
afe1556e-9b8a-4c9a-8692-89cbd88ccaae	2549e94c-16ac-49de-80dd-dffc9a589825	138e7334-0505-429d-a399-e28418fbb0ac	1	3	2026-09-28 06:39:52.439202+00	\N	2026-09-28 06:39:52.950658+00
96cc168a-721c-444a-93c3-08a2f8f3c582	2549e94c-16ac-49de-80dd-dffc9a589825	f49f136b-d0b0-4588-aa0d-aa549e9e7647	2	1	2026-09-28 06:39:52.439202+00	\N	2026-09-28 06:39:52.950658+00
248c06e4-6512-4b88-9d52-27a028d51b09	2549e94c-16ac-49de-80dd-dffc9a589825	02ba1a6a-8ad2-4587-a92e-9cbc74cef20b	3	2	2026-09-28 06:39:52.439202+00	\N	2026-09-28 06:39:52.950658+00
df2f711b-3fc3-4db0-94d7-0db833db4ec7	2549e94c-16ac-49de-80dd-dffc9a589825	7acc58ec-1d7f-4f2f-aec7-2e9df230ab51	4	3	2026-09-28 06:39:52.439202+00	\N	2026-09-28 06:39:52.950658+00
e4038faa-3631-4a34-b22f-1aa1dfb18389	2549e94c-16ac-49de-80dd-dffc9a589825	939e6bb7-af2b-49b6-9fbc-224d14e4ab94	5	4	2026-09-28 06:39:52.439202+00	\N	2026-09-28 06:39:52.950658+00
72b70269-9ae4-4bac-9c95-b38d34e3e64b	2549e94c-16ac-49de-80dd-dffc9a589825	ca0f2713-6e49-4385-83ff-3d2a32c9df38	6	5	2026-09-28 06:39:52.439202+00	\N	2026-09-28 06:39:52.950658+00
c1fbd694-b641-4590-8c1d-e4af7f8e409b	2549e94c-16ac-49de-80dd-dffc9a589825	39e9cfa9-ecf9-47c4-a3dc-097178820aff	7	1	2026-09-28 06:39:52.439202+00	\N	2026-09-28 06:39:52.950658+00
dd24dee4-fc68-4bff-be95-77bb2af282a2	2549e94c-16ac-49de-80dd-dffc9a589825	e9232f01-bf4c-4f5d-b27e-5d15063d8b8c	8	2	2026-09-28 06:39:52.439202+00	\N	2026-09-28 06:39:52.950658+00
e7bacdf4-09ed-45a0-8311-fe53c7bfb153	2549e94c-16ac-49de-80dd-dffc9a589825	afc043b3-bb56-4ed7-b4c9-dff438aad899	9	4	2026-09-28 06:39:52.439202+00	\N	2026-09-28 06:39:52.950658+00
3059e07b-fb5d-44c2-ad06-cb74cbb94df3	2549e94c-16ac-49de-80dd-dffc9a589825	ae47dce0-f370-4050-a5e7-d0a27277a414	10	5	2026-09-28 06:39:52.439202+00	\N	2026-09-28 06:39:52.950658+00
9e58d6ed-3626-4754-a903-9fcdde536ded	2549e94c-16ac-49de-80dd-dffc9a589825	37b33e7f-4016-4cfd-a9e0-eb1f33896527	11	1	2026-09-28 06:39:52.439202+00	\N	2026-09-28 06:39:52.950658+00
9c4adf60-c4d0-497b-b464-5c2ec28b270c	2549e94c-16ac-49de-80dd-dffc9a589825	8a9d3b1f-2724-4193-9caf-71b7de257627	12	2	2026-09-28 06:39:52.439202+00	\N	2026-09-28 06:39:52.950658+00
2d8418d7-00b2-441f-a740-7f6e621e7a17	2549e94c-16ac-49de-80dd-dffc9a589825	5b8dc496-4c06-4270-9da4-7148aa3cefef	13	3	2026-09-28 06:39:52.439202+00	\N	2026-09-28 06:39:52.950658+00
8ed41f72-7103-4606-b045-77381689ed02	2549e94c-16ac-49de-80dd-dffc9a589825	7fc19fd7-107f-4e50-89c3-001d188312a7	14	4	2026-09-28 06:39:52.439202+00	\N	2026-09-28 06:39:52.950658+00
54fdd281-11a4-4d73-8998-4db690a14f15	2549e94c-16ac-49de-80dd-dffc9a589825	7d011732-3523-4bcf-aa8a-3e4d8461785f	15	5	2026-09-28 06:39:52.439202+00	\N	2026-09-28 06:39:52.950658+00
8b343d89-bc4e-4f26-9a11-d2e3088d8806	a7459e54-5b96-4664-8a32-f770bf02a8d1	37b33e7f-4016-4cfd-a9e0-eb1f33896527	1	1	2026-09-28 06:56:46.089614+00	\N	2026-09-28 06:56:46.602168+00
55852d25-d65c-4c38-b657-b749d39b7de7	a7459e54-5b96-4664-8a32-f770bf02a8d1	f49f136b-d0b0-4588-aa0d-aa549e9e7647	2	1	2026-09-28 06:56:46.089614+00	\N	2026-09-28 06:56:46.602168+00
5ca163fc-5e43-43be-afc1-00a5abf3bc7d	a7459e54-5b96-4664-8a32-f770bf02a8d1	02ba1a6a-8ad2-4587-a92e-9cbc74cef20b	3	2	2026-09-28 06:56:46.089614+00	\N	2026-09-28 06:56:46.602168+00
c0cf960e-1a33-413f-a491-6d4573cdab27	a7459e54-5b96-4664-8a32-f770bf02a8d1	7acc58ec-1d7f-4f2f-aec7-2e9df230ab51	4	3	2026-09-28 06:56:46.089614+00	\N	2026-09-28 06:56:46.602168+00
3f087181-44ca-4276-8566-11740e4f872a	a7459e54-5b96-4664-8a32-f770bf02a8d1	939e6bb7-af2b-49b6-9fbc-224d14e4ab94	5	4	2026-09-28 06:56:46.089614+00	\N	2026-09-28 06:56:46.602168+00
cad00ecf-d2c9-45c2-a07e-a2747463dda5	a7459e54-5b96-4664-8a32-f770bf02a8d1	ca0f2713-6e49-4385-83ff-3d2a32c9df38	6	5	2026-09-28 06:56:46.089614+00	\N	2026-09-28 06:56:46.602168+00
cb9c66c7-c320-442d-be77-1934118961fb	a7459e54-5b96-4664-8a32-f770bf02a8d1	39e9cfa9-ecf9-47c4-a3dc-097178820aff	7	1	2026-09-28 06:56:46.089614+00	\N	2026-09-28 06:56:46.602168+00
7a234eb1-d3cc-429f-9577-083d611e8cfa	a7459e54-5b96-4664-8a32-f770bf02a8d1	e9232f01-bf4c-4f5d-b27e-5d15063d8b8c	8	2	2026-09-28 06:56:46.089614+00	\N	2026-09-28 06:56:46.602168+00
360a77fe-1172-4cb2-b1d1-2a73a1cdb35f	a7459e54-5b96-4664-8a32-f770bf02a8d1	138e7334-0505-429d-a399-e28418fbb0ac	9	3	2026-09-28 06:56:46.089614+00	\N	2026-09-28 06:56:46.602168+00
c27f26fc-189b-450b-b5c4-c53534670c4a	a7459e54-5b96-4664-8a32-f770bf02a8d1	afc043b3-bb56-4ed7-b4c9-dff438aad899	10	4	2026-09-28 06:56:46.089614+00	\N	2026-09-28 06:56:46.602168+00
2375288d-6202-4f05-8e06-dffb4366cd95	a7459e54-5b96-4664-8a32-f770bf02a8d1	ae47dce0-f370-4050-a5e7-d0a27277a414	11	5	2026-09-28 06:56:46.089614+00	\N	2026-09-28 06:56:46.602168+00
558bf61d-63a4-4261-8ea4-93ebdb0e27e6	a7459e54-5b96-4664-8a32-f770bf02a8d1	8a9d3b1f-2724-4193-9caf-71b7de257627	12	2	2026-09-28 06:56:46.089614+00	\N	2026-09-28 06:56:46.602168+00
2a266da1-06f0-49c5-b7ed-8c86e8349c96	a7459e54-5b96-4664-8a32-f770bf02a8d1	5b8dc496-4c06-4270-9da4-7148aa3cefef	13	3	2026-09-28 06:56:46.089614+00	\N	2026-09-28 06:56:46.602168+00
9f720844-592a-4a8a-b045-cf05a8baa0c1	a7459e54-5b96-4664-8a32-f770bf02a8d1	7fc19fd7-107f-4e50-89c3-001d188312a7	14	4	2026-09-28 06:56:46.089614+00	\N	2026-09-28 06:56:46.602168+00
4696a9e3-773d-4274-adcb-ad604ea54a0c	a7459e54-5b96-4664-8a32-f770bf02a8d1	7d011732-3523-4bcf-aa8a-3e4d8461785f	15	5	2026-09-28 06:56:46.089614+00	\N	2026-09-28 06:56:46.602168+00
f25516b0-5364-4097-b3df-6c03b44e7e68	11e6bfde-0b03-4187-bcb0-ade07ff3b916	f49f136b-d0b0-4588-aa0d-aa549e9e7647	1	1	2026-09-28 07:08:46.164496+00	\N	2026-09-28 07:08:46.676343+00
5e448e7d-a761-414c-ba5a-4fab1dde6bb6	11e6bfde-0b03-4187-bcb0-ade07ff3b916	939e6bb7-af2b-49b6-9fbc-224d14e4ab94	4	4	2026-09-28 07:08:46.164496+00	\N	2026-09-28 07:08:46.676343+00
b5802f85-bba7-466d-ae28-9cf1d8a0f3b6	11e6bfde-0b03-4187-bcb0-ade07ff3b916	ca0f2713-6e49-4385-83ff-3d2a32c9df38	5	5	2026-09-28 07:08:46.164496+00	\N	2026-09-28 07:08:46.676343+00
dd91964e-9367-4851-a1c9-7decba33e8c7	11e6bfde-0b03-4187-bcb0-ade07ff3b916	39e9cfa9-ecf9-47c4-a3dc-097178820aff	6	1	2026-09-28 07:08:46.164496+00	\N	2026-09-28 07:08:46.676343+00
48094340-8f14-40f9-811f-a7353542842f	11e6bfde-0b03-4187-bcb0-ade07ff3b916	e9232f01-bf4c-4f5d-b27e-5d15063d8b8c	7	2	2026-09-28 07:08:46.164496+00	\N	2026-09-28 07:08:46.676343+00
3ddf05f0-7220-4edf-8690-c55f56420bbf	11e6bfde-0b03-4187-bcb0-ade07ff3b916	138e7334-0505-429d-a399-e28418fbb0ac	8	3	2026-09-28 07:08:46.164496+00	\N	2026-09-28 07:08:46.676343+00
0df753e8-f7f4-45ec-bb3a-9af5af6db5a2	11e6bfde-0b03-4187-bcb0-ade07ff3b916	afc043b3-bb56-4ed7-b4c9-dff438aad899	9	4	2026-09-28 07:08:46.164496+00	\N	2026-09-28 07:08:46.676343+00
315272b9-821a-460f-b4de-88369439c88e	11e6bfde-0b03-4187-bcb0-ade07ff3b916	ae47dce0-f370-4050-a5e7-d0a27277a414	10	5	2026-09-28 07:08:46.164496+00	\N	2026-09-28 07:08:46.676343+00
22ad0924-e9a8-4ebc-9577-3c9f8f8b5f9f	11e6bfde-0b03-4187-bcb0-ade07ff3b916	37b33e7f-4016-4cfd-a9e0-eb1f33896527	11	1	2026-09-28 07:08:46.164496+00	\N	2026-09-28 07:08:46.676343+00
70c4cea4-a8b0-480f-8ea6-5250c58c6490	11e6bfde-0b03-4187-bcb0-ade07ff3b916	8a9d3b1f-2724-4193-9caf-71b7de257627	12	2	2026-09-28 07:08:46.164496+00	\N	2026-09-28 07:08:46.676343+00
90e9e539-3ad4-4570-9119-5675983f4c86	11e6bfde-0b03-4187-bcb0-ade07ff3b916	5b8dc496-4c06-4270-9da4-7148aa3cefef	13	3	2026-09-28 07:08:46.164496+00	\N	2026-09-28 07:08:46.676343+00
cba78661-944d-4fbf-aece-bebc06e17fec	11e6bfde-0b03-4187-bcb0-ade07ff3b916	7fc19fd7-107f-4e50-89c3-001d188312a7	14	4	2026-09-28 07:08:46.164496+00	\N	2026-09-28 07:08:46.676343+00
786097b0-945a-46f4-8ae1-6e7eec2d9375	11e6bfde-0b03-4187-bcb0-ade07ff3b916	7d011732-3523-4bcf-aa8a-3e4d8461785f	15	5	2026-09-28 07:08:46.164496+00	\N	2026-09-28 07:08:46.676343+00
fdf70779-00b2-43fa-83fc-322abbef5060	11e6bfde-0b03-4187-bcb0-ade07ff3b916	02ba1a6a-8ad2-4587-a92e-9cbc74cef20b	2	1	2026-09-28 07:08:46.164496+00	\N	2026-09-28 07:08:46.676343+00
ee5c05fd-c66b-464d-a864-cff47ca287c2	11e6bfde-0b03-4187-bcb0-ade07ff3b916	7acc58ec-1d7f-4f2f-aec7-2e9df230ab51	3	1	2026-09-28 07:08:46.164496+00	\N	2026-09-28 07:08:46.676343+00
cb702f47-1aa2-49a8-a3c8-956cdf651e8e	32d344dc-2af5-4d74-a05e-f7c892c62809	7d011732-3523-4bcf-aa8a-3e4d8461785f	1	5	2026-09-28 09:07:06.153973+00	\N	2026-09-28 09:07:06.18519+00
05122093-79a7-45d3-8400-1951cc7d7a6c	32d344dc-2af5-4d74-a05e-f7c892c62809	7acc58ec-1d7f-4f2f-aec7-2e9df230ab51	4	3	2026-09-28 09:07:06.153973+00	\N	2026-09-28 09:07:06.18519+00
771f8f1a-1d13-4139-83ec-d3ca04a16dac	32d344dc-2af5-4d74-a05e-f7c892c62809	939e6bb7-af2b-49b6-9fbc-224d14e4ab94	5	4	2026-09-28 09:07:06.153973+00	\N	2026-09-28 09:07:06.18519+00
bec11d70-f18c-4407-8754-d6838b86f5aa	32d344dc-2af5-4d74-a05e-f7c892c62809	ca0f2713-6e49-4385-83ff-3d2a32c9df38	6	5	2026-09-28 09:07:06.153973+00	\N	2026-09-28 09:07:06.18519+00
792aa48f-d190-4911-bca5-868893197fbf	32d344dc-2af5-4d74-a05e-f7c892c62809	39e9cfa9-ecf9-47c4-a3dc-097178820aff	7	1	2026-09-28 09:07:06.153973+00	\N	2026-09-28 09:07:06.18519+00
1a58b2e3-0871-4452-83d1-90d5b6f6b978	32d344dc-2af5-4d74-a05e-f7c892c62809	e9232f01-bf4c-4f5d-b27e-5d15063d8b8c	8	2	2026-09-28 09:07:06.153973+00	\N	2026-09-28 09:07:06.18519+00
d9a523bf-c790-4ce1-b426-07c0f3003610	32d344dc-2af5-4d74-a05e-f7c892c62809	138e7334-0505-429d-a399-e28418fbb0ac	9	3	2026-09-28 09:07:06.153973+00	\N	2026-09-28 09:07:06.18519+00
4fd5b518-1f47-40e2-ae22-6f92b831b497	32d344dc-2af5-4d74-a05e-f7c892c62809	afc043b3-bb56-4ed7-b4c9-dff438aad899	10	4	2026-09-28 09:07:06.153973+00	\N	2026-09-28 09:07:06.18519+00
c33940e8-3815-4d4c-acc2-c12ce3b40781	32d344dc-2af5-4d74-a05e-f7c892c62809	ae47dce0-f370-4050-a5e7-d0a27277a414	11	5	2026-09-28 09:07:06.153973+00	\N	2026-09-28 09:07:06.18519+00
bdaf38b1-e6b4-4d3f-9715-65085fc31562	32d344dc-2af5-4d74-a05e-f7c892c62809	37b33e7f-4016-4cfd-a9e0-eb1f33896527	12	1	2026-09-28 09:07:06.153973+00	\N	2026-09-28 09:07:06.18519+00
18a6315a-7250-44e3-8f38-0b4ef6d54189	32d344dc-2af5-4d74-a05e-f7c892c62809	8a9d3b1f-2724-4193-9caf-71b7de257627	13	2	2026-09-28 09:07:06.153973+00	\N	2026-09-28 09:07:06.18519+00
f8ffa6bc-5cf9-45ab-88ea-cb97251bf6cb	32d344dc-2af5-4d74-a05e-f7c892c62809	f49f136b-d0b0-4588-aa0d-aa549e9e7647	2	5	2026-09-28 09:07:06.153973+00	\N	2026-09-28 09:07:06.18519+00
c7aaecd8-2c33-48b0-b737-7ed74fcfc340	32d344dc-2af5-4d74-a05e-f7c892c62809	02ba1a6a-8ad2-4587-a92e-9cbc74cef20b	3	4	2026-09-28 09:07:06.153973+00	\N	2026-09-28 09:07:06.18519+00
6b3f6e90-c592-481f-a666-671f065f65eb	32d344dc-2af5-4d74-a05e-f7c892c62809	5b8dc496-4c06-4270-9da4-7148aa3cefef	14	3	2026-09-28 09:07:06.153973+00	\N	2026-09-28 09:07:06.18519+00
d86d6088-5399-4a94-9597-f0cc559c7b14	32d344dc-2af5-4d74-a05e-f7c892c62809	7fc19fd7-107f-4e50-89c3-001d188312a7	15	4	2026-09-28 09:07:06.153973+00	\N	2026-09-28 09:07:06.18519+00
297e9e6e-86f8-4675-835c-22a409f94120	4686e74d-d3e9-4bd2-a700-2778cd0bfeb0	37b33e7f-4016-4cfd-a9e0-eb1f33896527	1	1	2026-09-30 02:24:09.244589+00	\N	2026-09-30 02:24:09.266299+00
be1d0788-4415-4004-bbba-228b58ba6b80	4686e74d-d3e9-4bd2-a700-2778cd0bfeb0	f49f136b-d0b0-4588-aa0d-aa549e9e7647	2	1	2026-09-30 02:24:09.244589+00	\N	2026-09-30 02:24:09.266299+00
e1abf77a-5bf9-46dd-9969-c497d7b44b6e	4686e74d-d3e9-4bd2-a700-2778cd0bfeb0	7acc58ec-1d7f-4f2f-aec7-2e9df230ab51	4	3	2026-09-30 02:24:09.244589+00	\N	2026-09-30 02:24:09.266299+00
ff275b1a-da60-4ec8-ad4f-fa8784a1b57b	4686e74d-d3e9-4bd2-a700-2778cd0bfeb0	939e6bb7-af2b-49b6-9fbc-224d14e4ab94	5	4	2026-09-30 02:24:09.244589+00	\N	2026-09-30 02:24:09.266299+00
6cb2913f-b1a6-4069-bbbf-4bf8a8470c95	4686e74d-d3e9-4bd2-a700-2778cd0bfeb0	ca0f2713-6e49-4385-83ff-3d2a32c9df38	6	5	2026-09-30 02:24:09.244589+00	\N	2026-09-30 02:24:09.266299+00
f29909d3-3282-45bf-9a2a-0eac55e0bdbd	4686e74d-d3e9-4bd2-a700-2778cd0bfeb0	39e9cfa9-ecf9-47c4-a3dc-097178820aff	7	1	2026-09-30 02:24:09.244589+00	\N	2026-09-30 02:24:09.266299+00
77f444c2-5352-4162-9d22-426d0795bd6a	4686e74d-d3e9-4bd2-a700-2778cd0bfeb0	e9232f01-bf4c-4f5d-b27e-5d15063d8b8c	8	2	2026-09-30 02:24:09.244589+00	\N	2026-09-30 02:24:09.266299+00
51d73471-f713-4ea9-b8d2-fba70ac7eb2f	4686e74d-d3e9-4bd2-a700-2778cd0bfeb0	138e7334-0505-429d-a399-e28418fbb0ac	9	3	2026-09-30 02:24:09.244589+00	\N	2026-09-30 02:24:09.266299+00
d87488da-c2e5-4553-8c03-f750a7349998	4686e74d-d3e9-4bd2-a700-2778cd0bfeb0	afc043b3-bb56-4ed7-b4c9-dff438aad899	10	4	2026-09-30 02:24:09.244589+00	\N	2026-09-30 02:24:09.266299+00
8e32e48d-e406-4f29-b5eb-1241fe13dcea	4686e74d-d3e9-4bd2-a700-2778cd0bfeb0	ae47dce0-f370-4050-a5e7-d0a27277a414	11	5	2026-09-30 02:24:09.244589+00	\N	2026-09-30 02:24:09.266299+00
5be39496-b07c-4c82-b822-4af04a7c9416	4686e74d-d3e9-4bd2-a700-2778cd0bfeb0	8a9d3b1f-2724-4193-9caf-71b7de257627	12	2	2026-09-30 02:24:09.244589+00	\N	2026-09-30 02:24:09.266299+00
2dad1383-ba04-4c9e-875e-51cb1ed68676	4686e74d-d3e9-4bd2-a700-2778cd0bfeb0	5b8dc496-4c06-4270-9da4-7148aa3cefef	13	3	2026-09-30 02:24:09.244589+00	\N	2026-09-30 02:24:09.266299+00
7bf75e40-481c-4441-9fd2-cf6e84259b48	4686e74d-d3e9-4bd2-a700-2778cd0bfeb0	7fc19fd7-107f-4e50-89c3-001d188312a7	14	4	2026-09-30 02:24:09.244589+00	\N	2026-09-30 02:24:09.266299+00
28dc5a32-aab1-4e78-8cd8-de94c3a626d9	4686e74d-d3e9-4bd2-a700-2778cd0bfeb0	7d011732-3523-4bcf-aa8a-3e4d8461785f	15	5	2026-09-30 02:24:09.244589+00	\N	2026-09-30 02:24:09.266299+00
b4710cb8-3853-447c-9aa1-bd22aba61f82	4686e74d-d3e9-4bd2-a700-2778cd0bfeb0	02ba1a6a-8ad2-4587-a92e-9cbc74cef20b	3	1	2026-09-30 02:24:09.244589+00	\N	2026-09-30 02:24:09.266299+00
91ed4e7d-2027-46f0-9efd-e7048a9fe7bb	8c0c21fd-93d3-4da5-9021-67194ed1cf06	e9232f01-bf4c-4f5d-b27e-5d15063d8b8c	1	2	2026-09-30 02:28:20.228379+00	\N	2026-09-30 02:28:20.239871+00
b4e3c1c0-0c5b-4358-ac7e-4e47c25e130c	8c0c21fd-93d3-4da5-9021-67194ed1cf06	02ba1a6a-8ad2-4587-a92e-9cbc74cef20b	3	2	2026-09-30 02:28:20.228379+00	\N	2026-09-30 02:28:20.239871+00
8b2704f0-0818-4bfd-88e9-65e5c83f01fd	8c0c21fd-93d3-4da5-9021-67194ed1cf06	7acc58ec-1d7f-4f2f-aec7-2e9df230ab51	4	3	2026-09-30 02:28:20.228379+00	\N	2026-09-30 02:28:20.239871+00
6936703f-09d0-4128-b5c6-d4ab28f431d6	8c0c21fd-93d3-4da5-9021-67194ed1cf06	939e6bb7-af2b-49b6-9fbc-224d14e4ab94	5	4	2026-09-30 02:28:20.228379+00	\N	2026-09-30 02:28:20.239871+00
c7510b50-5a74-433f-9c78-71444ba5f6a3	8c0c21fd-93d3-4da5-9021-67194ed1cf06	ca0f2713-6e49-4385-83ff-3d2a32c9df38	6	5	2026-09-30 02:28:20.228379+00	\N	2026-09-30 02:28:20.239871+00
e32cd809-6d9a-4be5-bb61-167594fb7958	8c0c21fd-93d3-4da5-9021-67194ed1cf06	39e9cfa9-ecf9-47c4-a3dc-097178820aff	7	1	2026-09-30 02:28:20.228379+00	\N	2026-09-30 02:28:20.239871+00
b662159c-24f0-4b86-b6f9-b528268b18b9	8c0c21fd-93d3-4da5-9021-67194ed1cf06	138e7334-0505-429d-a399-e28418fbb0ac	8	3	2026-09-30 02:28:20.228379+00	\N	2026-09-30 02:28:20.239871+00
27055fa6-a89b-443c-82fa-bd2c175e6ffa	8c0c21fd-93d3-4da5-9021-67194ed1cf06	afc043b3-bb56-4ed7-b4c9-dff438aad899	9	4	2026-09-30 02:28:20.228379+00	\N	2026-09-30 02:28:20.239871+00
6659fa02-14db-4752-9941-593db2335934	8c0c21fd-93d3-4da5-9021-67194ed1cf06	ae47dce0-f370-4050-a5e7-d0a27277a414	10	5	2026-09-30 02:28:20.228379+00	\N	2026-09-30 02:28:20.239871+00
cc0625a1-54f3-4044-85e6-481365ca1930	8c0c21fd-93d3-4da5-9021-67194ed1cf06	37b33e7f-4016-4cfd-a9e0-eb1f33896527	11	1	2026-09-30 02:28:20.228379+00	\N	2026-09-30 02:28:20.239871+00
ab45297e-ce7d-45a1-965b-6e3ed2c88d56	8c0c21fd-93d3-4da5-9021-67194ed1cf06	8a9d3b1f-2724-4193-9caf-71b7de257627	12	2	2026-09-30 02:28:20.228379+00	\N	2026-09-30 02:28:20.239871+00
f74eb7f0-44bc-4cc2-b554-228f9a5c2dfc	8c0c21fd-93d3-4da5-9021-67194ed1cf06	5b8dc496-4c06-4270-9da4-7148aa3cefef	13	3	2026-09-30 02:28:20.228379+00	\N	2026-09-30 02:28:20.239871+00
6c7c56cb-a291-4fab-804c-1a0eccd125af	8c0c21fd-93d3-4da5-9021-67194ed1cf06	7fc19fd7-107f-4e50-89c3-001d188312a7	14	4	2026-09-30 02:28:20.228379+00	\N	2026-09-30 02:28:20.239871+00
622551d7-4d8a-4073-856a-f548e3d056f9	8c0c21fd-93d3-4da5-9021-67194ed1cf06	7d011732-3523-4bcf-aa8a-3e4d8461785f	15	5	2026-09-30 02:28:20.228379+00	\N	2026-09-30 02:28:20.239871+00
cf302a4c-a78e-42df-afa7-aca6c6a34d0d	8c0c21fd-93d3-4da5-9021-67194ed1cf06	f49f136b-d0b0-4588-aa0d-aa549e9e7647	2	3	2026-09-30 02:28:20.228379+00	\N	2026-09-30 02:28:20.239871+00
633c1af4-5b37-4578-acd0-00e4bb640602	231bc117-58f1-4042-ac2c-b4aec6ffb8b1	5b8dc496-4c06-4270-9da4-7148aa3cefef	1	3	2026-10-01 07:23:10.273742+00	\N	2026-10-01 07:23:11.617878+00
9f8c2d05-bf72-4e1e-b198-d781213f42d3	231bc117-58f1-4042-ac2c-b4aec6ffb8b1	7acc58ec-1d7f-4f2f-aec7-2e9df230ab51	4	3	2026-10-01 07:23:10.273742+00	\N	2026-10-01 07:23:11.617878+00
c5d83bf9-e442-4549-9316-5f9eb4e0b63d	231bc117-58f1-4042-ac2c-b4aec6ffb8b1	939e6bb7-af2b-49b6-9fbc-224d14e4ab94	5	4	2026-10-01 07:23:10.273742+00	\N	2026-10-01 07:23:11.617878+00
517da43b-8b0d-418f-aed9-397d5d1c6f70	231bc117-58f1-4042-ac2c-b4aec6ffb8b1	ca0f2713-6e49-4385-83ff-3d2a32c9df38	6	5	2026-10-01 07:23:10.273742+00	\N	2026-10-01 07:23:11.617878+00
03233cf9-2e6e-4dcb-95d9-a28ad03f1e07	231bc117-58f1-4042-ac2c-b4aec6ffb8b1	39e9cfa9-ecf9-47c4-a3dc-097178820aff	7	1	2026-10-01 07:23:10.273742+00	\N	2026-10-01 07:23:11.617878+00
898c0520-d050-46c5-8ed1-89cbf6443411	231bc117-58f1-4042-ac2c-b4aec6ffb8b1	e9232f01-bf4c-4f5d-b27e-5d15063d8b8c	8	2	2026-10-01 07:23:10.273742+00	\N	2026-10-01 07:23:11.617878+00
e2c3e835-c1d8-4874-83f7-b29f99c69cb8	231bc117-58f1-4042-ac2c-b4aec6ffb8b1	138e7334-0505-429d-a399-e28418fbb0ac	9	3	2026-10-01 07:23:10.273742+00	\N	2026-10-01 07:23:11.617878+00
0c8ca1b8-d2cb-41ac-b4aa-2ab3a3a74e18	231bc117-58f1-4042-ac2c-b4aec6ffb8b1	afc043b3-bb56-4ed7-b4c9-dff438aad899	10	4	2026-10-01 07:23:10.273742+00	\N	2026-10-01 07:23:11.617878+00
0bbb64cc-5c68-4a97-99b1-4e00bfd3e9ca	231bc117-58f1-4042-ac2c-b4aec6ffb8b1	ae47dce0-f370-4050-a5e7-d0a27277a414	11	5	2026-10-01 07:23:10.273742+00	\N	2026-10-01 07:23:11.617878+00
ca59cc77-b121-4bba-aa61-c35b539bd059	231bc117-58f1-4042-ac2c-b4aec6ffb8b1	37b33e7f-4016-4cfd-a9e0-eb1f33896527	12	1	2026-10-01 07:23:10.273742+00	\N	2026-10-01 07:23:11.617878+00
ff574a1d-6bb3-449b-be02-29680519de9f	231bc117-58f1-4042-ac2c-b4aec6ffb8b1	8a9d3b1f-2724-4193-9caf-71b7de257627	13	2	2026-10-01 07:23:10.273742+00	\N	2026-10-01 07:23:11.617878+00
203641f7-834b-403e-b71d-8267532adb5d	231bc117-58f1-4042-ac2c-b4aec6ffb8b1	7fc19fd7-107f-4e50-89c3-001d188312a7	14	4	2026-10-01 07:23:10.273742+00	\N	2026-10-01 07:23:11.617878+00
bf70a959-5cf3-4d4a-8c7e-202b7f21eb23	231bc117-58f1-4042-ac2c-b4aec6ffb8b1	7d011732-3523-4bcf-aa8a-3e4d8461785f	15	5	2026-10-01 07:23:10.273742+00	\N	2026-10-01 07:23:11.617878+00
e42cd5d2-6162-4eb9-a73a-4bdf0ef7b208	231bc117-58f1-4042-ac2c-b4aec6ffb8b1	f49f136b-d0b0-4588-aa0d-aa549e9e7647	2	4	2026-10-01 07:23:10.273742+00	\N	2026-10-01 07:23:11.617878+00
6895c2b5-c50b-4d08-86b1-a653edfb1abb	231bc117-58f1-4042-ac2c-b4aec6ffb8b1	02ba1a6a-8ad2-4587-a92e-9cbc74cef20b	3	4	2026-10-01 07:23:10.273742+00	\N	2026-10-01 07:23:11.617878+00
64f6c330-750d-44eb-a6c6-f8439be59983	8c42f1a7-c7fb-4edb-b027-077f3812e13c	7d011732-3523-4bcf-aa8a-3e4d8461785f	1	5	2026-10-01 09:10:17.434956+00	\N	2026-10-01 09:10:18.422213+00
d29f275f-421b-4768-ac91-b426dfda2ae8	8c42f1a7-c7fb-4edb-b027-077f3812e13c	7acc58ec-1d7f-4f2f-aec7-2e9df230ab51	4	3	2026-10-01 09:10:17.434956+00	\N	2026-10-01 09:10:18.422213+00
7f411730-3c78-4c17-96f6-8487ef35175f	8c42f1a7-c7fb-4edb-b027-077f3812e13c	939e6bb7-af2b-49b6-9fbc-224d14e4ab94	5	4	2026-10-01 09:10:17.434956+00	\N	2026-10-01 09:10:18.422213+00
e45eb331-5dd4-4519-87fe-49530600aa48	8c42f1a7-c7fb-4edb-b027-077f3812e13c	ca0f2713-6e49-4385-83ff-3d2a32c9df38	6	5	2026-10-01 09:10:17.434956+00	\N	2026-10-01 09:10:18.422213+00
89c14a13-da42-48c2-b40c-5380f2d18988	8c42f1a7-c7fb-4edb-b027-077f3812e13c	39e9cfa9-ecf9-47c4-a3dc-097178820aff	7	1	2026-10-01 09:10:17.434956+00	\N	2026-10-01 09:10:18.422213+00
f33f19af-e1ed-4062-a515-a1270a8aaf1b	8c42f1a7-c7fb-4edb-b027-077f3812e13c	e9232f01-bf4c-4f5d-b27e-5d15063d8b8c	8	2	2026-10-01 09:10:17.434956+00	\N	2026-10-01 09:10:18.422213+00
cfbc2440-baa6-4af9-ad63-65c8be04156b	8c42f1a7-c7fb-4edb-b027-077f3812e13c	138e7334-0505-429d-a399-e28418fbb0ac	9	3	2026-10-01 09:10:17.434956+00	\N	2026-10-01 09:10:18.422213+00
67eebb07-6d67-40f2-98c1-59e65b07bd2a	8c42f1a7-c7fb-4edb-b027-077f3812e13c	afc043b3-bb56-4ed7-b4c9-dff438aad899	10	4	2026-10-01 09:10:17.434956+00	\N	2026-10-01 09:10:18.422213+00
8aa8f46b-5e2d-4dbc-b2dc-2e05b4f80098	8c42f1a7-c7fb-4edb-b027-077f3812e13c	ae47dce0-f370-4050-a5e7-d0a27277a414	11	5	2026-10-01 09:10:17.434956+00	\N	2026-10-01 09:10:18.422213+00
431f714f-e5bf-4512-a41a-758317226356	8c42f1a7-c7fb-4edb-b027-077f3812e13c	37b33e7f-4016-4cfd-a9e0-eb1f33896527	12	1	2026-10-01 09:10:17.434956+00	\N	2026-10-01 09:10:18.422213+00
4d3a757a-9ed9-42de-908e-a8897eaf94e5	8c42f1a7-c7fb-4edb-b027-077f3812e13c	8a9d3b1f-2724-4193-9caf-71b7de257627	13	2	2026-10-01 09:10:17.434956+00	\N	2026-10-01 09:10:18.422213+00
d2319241-ea30-4c44-9f48-8b285c7315d2	8c42f1a7-c7fb-4edb-b027-077f3812e13c	5b8dc496-4c06-4270-9da4-7148aa3cefef	14	3	2026-10-01 09:10:17.434956+00	\N	2026-10-01 09:10:18.422213+00
64e3c8cf-9b8c-47d4-8c9c-46e577324275	8c42f1a7-c7fb-4edb-b027-077f3812e13c	7fc19fd7-107f-4e50-89c3-001d188312a7	15	4	2026-10-01 09:10:17.434956+00	\N	2026-10-01 09:10:18.422213+00
8042c24e-dacc-4f0e-927b-563f605e1725	8c42f1a7-c7fb-4edb-b027-077f3812e13c	f49f136b-d0b0-4588-aa0d-aa549e9e7647	2	5	2026-10-01 09:10:17.434956+00	\N	2026-10-01 09:10:18.422213+00
947ae207-ae30-48aa-9701-dc101cff0143	8c42f1a7-c7fb-4edb-b027-077f3812e13c	02ba1a6a-8ad2-4587-a92e-9cbc74cef20b	3	5	2026-10-01 09:10:17.434956+00	\N	2026-10-01 09:10:18.422213+00
d4b0ea98-23d1-49e0-94a3-52f1634b09b1	276b6116-9c80-4267-ba42-c715f30e90d5	7d011732-3523-4bcf-aa8a-3e4d8461785f	1	5	2026-10-01 09:13:22.954365+00	\N	2026-10-01 09:13:24.007598+00
488150a8-9e9a-4922-b6d3-debb76e57a17	276b6116-9c80-4267-ba42-c715f30e90d5	7acc58ec-1d7f-4f2f-aec7-2e9df230ab51	4	3	2026-10-01 09:13:22.954365+00	\N	2026-10-01 09:13:24.007598+00
45d7c001-6bf9-41fe-b18f-bceefd244d4e	276b6116-9c80-4267-ba42-c715f30e90d5	939e6bb7-af2b-49b6-9fbc-224d14e4ab94	5	4	2026-10-01 09:13:22.954365+00	\N	2026-10-01 09:13:24.007598+00
385aa4f3-7874-4f03-91c6-3be7f803cd90	276b6116-9c80-4267-ba42-c715f30e90d5	ca0f2713-6e49-4385-83ff-3d2a32c9df38	6	5	2026-10-01 09:13:22.954365+00	\N	2026-10-01 09:13:24.007598+00
cdd75b2d-77a2-46ee-b9de-6e6f18581dd5	276b6116-9c80-4267-ba42-c715f30e90d5	39e9cfa9-ecf9-47c4-a3dc-097178820aff	7	1	2026-10-01 09:13:22.954365+00	\N	2026-10-01 09:13:24.007598+00
d22d9384-ab6a-4398-a01a-fe95f1bbba85	276b6116-9c80-4267-ba42-c715f30e90d5	f49f136b-d0b0-4588-aa0d-aa549e9e7647	2	5	2026-10-01 09:13:22.954365+00	\N	2026-10-01 09:13:24.007598+00
eabdb86a-aeda-4c12-aa36-7eff90e9d2b2	276b6116-9c80-4267-ba42-c715f30e90d5	02ba1a6a-8ad2-4587-a92e-9cbc74cef20b	3	4	2026-10-01 09:13:22.954365+00	\N	2026-10-01 09:13:24.007598+00
03c45f0c-3d74-4822-94b9-0fac2cd0beae	276b6116-9c80-4267-ba42-c715f30e90d5	e9232f01-bf4c-4f5d-b27e-5d15063d8b8c	8	2	2026-10-01 09:13:22.954365+00	\N	2026-10-01 09:13:24.007598+00
bd733af3-f6e0-4994-b447-5ea5ffe4e489	276b6116-9c80-4267-ba42-c715f30e90d5	138e7334-0505-429d-a399-e28418fbb0ac	9	3	2026-10-01 09:13:22.954365+00	\N	2026-10-01 09:13:24.007598+00
9037fa6d-9a3f-49e1-8246-d25c81641d02	276b6116-9c80-4267-ba42-c715f30e90d5	afc043b3-bb56-4ed7-b4c9-dff438aad899	10	4	2026-10-01 09:13:22.954365+00	\N	2026-10-01 09:13:24.007598+00
71605a69-d029-4273-92e5-79828e476727	276b6116-9c80-4267-ba42-c715f30e90d5	ae47dce0-f370-4050-a5e7-d0a27277a414	11	5	2026-10-01 09:13:22.954365+00	\N	2026-10-01 09:13:24.007598+00
af575ae6-3059-4b80-8cc8-b6b0ff8bc0c3	276b6116-9c80-4267-ba42-c715f30e90d5	37b33e7f-4016-4cfd-a9e0-eb1f33896527	12	1	2026-10-01 09:13:22.954365+00	\N	2026-10-01 09:13:24.007598+00
2adf594b-450b-49c5-b3a9-5f5898e67398	276b6116-9c80-4267-ba42-c715f30e90d5	8a9d3b1f-2724-4193-9caf-71b7de257627	13	2	2026-10-01 09:13:22.954365+00	\N	2026-10-01 09:13:24.007598+00
e4d95b30-fefe-4fa5-bbe5-edf3936c9bc1	276b6116-9c80-4267-ba42-c715f30e90d5	5b8dc496-4c06-4270-9da4-7148aa3cefef	14	3	2026-10-01 09:13:22.954365+00	\N	2026-10-01 09:13:24.007598+00
61bffd0b-2936-441d-b5be-71411b73a65d	276b6116-9c80-4267-ba42-c715f30e90d5	7fc19fd7-107f-4e50-89c3-001d188312a7	15	4	2026-10-01 09:13:22.954365+00	\N	2026-10-01 09:13:24.007598+00
7889d642-fd0d-497b-8b85-d9972eb3e6aa	9bae655a-54e4-4803-bb9d-4df71b815f1d	91c9c73d-4833-46d9-9562-8bdb71d3fdc9	1	1	2026-10-24 04:53:40.242594+00	\N	2026-10-24 04:53:40.754726+00
929923d2-4292-4a71-ab60-55f4cd4dfda5	9bae655a-54e4-4803-bb9d-4df71b815f1d	1d1cc286-8aca-4f34-a355-61befc34b09b	2	1	2026-10-24 04:53:40.242594+00	\N	2026-10-24 04:53:40.754726+00
e0a9cbe2-6f87-4da3-821a-dbda7ef6f890	9bae655a-54e4-4803-bb9d-4df71b815f1d	ccccd4bf-4bf8-44cc-8f33-1919490b6fb0	3	2	2026-10-24 04:53:40.242594+00	\N	2026-10-24 04:53:40.754726+00
f732c169-de48-456c-aeab-88a1921bef44	9bae655a-54e4-4803-bb9d-4df71b815f1d	bc8ba9f3-5fcc-441b-975a-75688de67e5e	4	3	2026-10-24 04:53:40.242594+00	\N	2026-10-24 04:53:40.754726+00
214b4206-eeb5-4e12-8aac-7229396001a1	9bae655a-54e4-4803-bb9d-4df71b815f1d	7edd0484-71d3-49bd-a549-de8010bdfa5a	5	4	2026-10-24 04:53:40.242594+00	\N	2026-10-24 04:53:40.754726+00
00bf3742-5e73-48f8-92db-0cc68ab853ae	9bae655a-54e4-4803-bb9d-4df71b815f1d	2f25a29a-d77b-49d6-9d0e-d2d7751eb52f	6	5	2026-10-24 04:53:40.242594+00	\N	2026-10-24 04:53:40.754726+00
ef418250-e20f-460b-bcd9-cf8a26f66121	9bae655a-54e4-4803-bb9d-4df71b815f1d	27d9c730-e75e-4537-8388-9acaca86dee4	7	2	2026-10-24 04:53:40.242594+00	\N	2026-10-24 04:53:40.754726+00
fedefdeb-cfdf-4beb-8917-de6ecc18d56b	9bae655a-54e4-4803-bb9d-4df71b815f1d	6139c29c-c66a-48ce-af97-1a2526e3285a	8	3	2026-10-24 04:53:40.242594+00	\N	2026-10-24 04:53:40.754726+00
9ed695f4-7059-47c1-bb60-ed997278365d	9bae655a-54e4-4803-bb9d-4df71b815f1d	d1ee3aad-fde4-47df-b431-877218b15fea	9	4	2026-10-24 04:53:40.242594+00	\N	2026-10-24 04:53:40.754726+00
a5a6c2db-d9a2-4b71-b640-4d74c9442991	9bae655a-54e4-4803-bb9d-4df71b815f1d	12a5f102-c612-4b3e-88d2-3aae5a8372ec	10	5	2026-10-24 04:53:40.242594+00	\N	2026-10-24 04:53:40.754726+00
d352e16f-31ba-4e09-b06e-62c309dc1197	9bae655a-54e4-4803-bb9d-4df71b815f1d	e4b65e11-e594-4f62-ba9f-1c88e7658ef0	11	1	2026-10-24 04:53:40.242594+00	\N	2026-10-24 04:53:40.754726+00
c00d5efe-0fbf-48bc-85d0-ae9f193e1061	9bae655a-54e4-4803-bb9d-4df71b815f1d	3de4e2ce-90e5-45c6-be54-e50ae8d044c0	12	2	2026-10-24 04:53:40.242594+00	\N	2026-10-24 04:53:40.754726+00
5c191a67-3b8a-4858-a29f-ba15b9676001	9bae655a-54e4-4803-bb9d-4df71b815f1d	ffa235ae-99b8-43b5-a110-58ee143d2a72	13	3	2026-10-24 04:53:40.242594+00	\N	2026-10-24 04:53:40.754726+00
281cb967-a8ea-48ec-a1d3-cb76536e222f	9bae655a-54e4-4803-bb9d-4df71b815f1d	82868389-0756-4b10-89df-d38fa65d2f1e	14	4	2026-10-24 04:53:40.242594+00	\N	2026-10-24 04:53:40.754726+00
4f9f6842-155e-4754-ac3a-fea9d7a6793a	9bae655a-54e4-4803-bb9d-4df71b815f1d	e39a881b-cf15-4599-98bf-bda0a1bc47c6	15	5	2026-10-24 04:53:40.242594+00	\N	2026-10-24 04:53:40.754726+00
309f3968-fa21-47f2-8073-65bc28e487ef	0729f24c-f6bb-4fd6-994a-c94e6c8a7825	7edd0484-71d3-49bd-a549-de8010bdfa5a	1	4	2026-10-24 05:30:02.317957+00	\N	2026-10-24 05:30:02.8293+00
b1179f4b-76c6-4c69-8813-4b768fc37f66	0729f24c-f6bb-4fd6-994a-c94e6c8a7825	bc8ba9f3-5fcc-441b-975a-75688de67e5e	4	3	2026-10-24 05:30:02.317957+00	\N	2026-10-24 05:30:02.8293+00
6154eeee-2157-4b72-984f-7cd574214d3d	0729f24c-f6bb-4fd6-994a-c94e6c8a7825	2f25a29a-d77b-49d6-9d0e-d2d7751eb52f	5	5	2026-10-24 05:30:02.317957+00	\N	2026-10-24 05:30:02.8293+00
e582b7b7-e45a-4cb1-a778-898ffe6304c5	0729f24c-f6bb-4fd6-994a-c94e6c8a7825	91c9c73d-4833-46d9-9562-8bdb71d3fdc9	6	1	2026-10-24 05:30:02.317957+00	\N	2026-10-24 05:30:02.8293+00
a8ba4677-c87e-465b-85d8-5a866b161de8	0729f24c-f6bb-4fd6-994a-c94e6c8a7825	27d9c730-e75e-4537-8388-9acaca86dee4	7	2	2026-10-24 05:30:02.317957+00	\N	2026-10-24 05:30:02.8293+00
1b9164e9-71e9-4a59-82b7-210883e42827	0729f24c-f6bb-4fd6-994a-c94e6c8a7825	6139c29c-c66a-48ce-af97-1a2526e3285a	8	3	2026-10-24 05:30:02.317957+00	\N	2026-10-24 05:30:02.8293+00
240e2b58-a4b4-4f34-9bc6-2e16591d72f9	0729f24c-f6bb-4fd6-994a-c94e6c8a7825	d1ee3aad-fde4-47df-b431-877218b15fea	9	4	2026-10-24 05:30:02.317957+00	\N	2026-10-24 05:30:02.8293+00
be20b06a-fb32-4342-bae4-6b28632df623	0729f24c-f6bb-4fd6-994a-c94e6c8a7825	12a5f102-c612-4b3e-88d2-3aae5a8372ec	10	5	2026-10-24 05:30:02.317957+00	\N	2026-10-24 05:30:02.8293+00
dd31adb8-7c9a-471d-a0af-7022a8275170	0729f24c-f6bb-4fd6-994a-c94e6c8a7825	e4b65e11-e594-4f62-ba9f-1c88e7658ef0	11	1	2026-10-24 05:30:02.317957+00	\N	2026-10-24 05:30:02.8293+00
d8788146-3867-4667-8bb5-5d961ebedcf5	0729f24c-f6bb-4fd6-994a-c94e6c8a7825	3de4e2ce-90e5-45c6-be54-e50ae8d044c0	12	2	2026-10-24 05:30:02.317957+00	\N	2026-10-24 05:30:02.8293+00
9b932b44-c3d3-457a-9900-2e6d231c3dff	0729f24c-f6bb-4fd6-994a-c94e6c8a7825	ffa235ae-99b8-43b5-a110-58ee143d2a72	13	3	2026-10-24 05:30:02.317957+00	\N	2026-10-24 05:30:02.8293+00
b645f2c4-cd10-4b41-a0d7-00f048e637e6	0729f24c-f6bb-4fd6-994a-c94e6c8a7825	82868389-0756-4b10-89df-d38fa65d2f1e	14	4	2026-10-24 05:30:02.317957+00	\N	2026-10-24 05:30:02.8293+00
e662db7f-733e-488d-ad3a-3da41e528654	0729f24c-f6bb-4fd6-994a-c94e6c8a7825	e39a881b-cf15-4599-98bf-bda0a1bc47c6	15	5	2026-10-24 05:30:02.317957+00	\N	2026-10-24 05:30:02.8293+00
c03850ee-d4b3-46c3-8790-111a9e8fdfd6	0729f24c-f6bb-4fd6-994a-c94e6c8a7825	1d1cc286-8aca-4f34-a355-61befc34b09b	2	4	2026-10-24 05:30:02.317957+00	\N	2026-10-24 05:30:02.8293+00
226e7fb4-5016-46d2-abb7-c80fa11ad6dd	0729f24c-f6bb-4fd6-994a-c94e6c8a7825	ccccd4bf-4bf8-44cc-8f33-1919490b6fb0	3	5	2026-10-24 05:30:02.317957+00	\N	2026-10-24 05:30:02.8293+00
451a015d-ee0c-42e4-aefc-50dca9860f71	bf6c490b-6853-4272-8c6e-b07173ec2ad0	6139c29c-c66a-48ce-af97-1a2526e3285a	1	3	2026-10-24 06:03:56.572242+00	\N	2026-10-24 06:03:57.390253+00
70717d90-8c52-4e04-919b-7b53573db9a2	bf6c490b-6853-4272-8c6e-b07173ec2ad0	ccccd4bf-4bf8-44cc-8f33-1919490b6fb0	3	2	2026-10-24 06:03:56.572242+00	\N	2026-10-24 06:03:57.390253+00
3d79fc08-267c-4fe2-a098-d3c1d03359b2	bf6c490b-6853-4272-8c6e-b07173ec2ad0	bc8ba9f3-5fcc-441b-975a-75688de67e5e	4	3	2026-10-24 06:03:56.572242+00	\N	2026-10-24 06:03:57.390253+00
8aa4b798-8384-484a-aa7f-bf318981155d	bf6c490b-6853-4272-8c6e-b07173ec2ad0	7edd0484-71d3-49bd-a549-de8010bdfa5a	5	4	2026-10-24 06:03:56.572242+00	\N	2026-10-24 06:03:57.390253+00
6ec52ed4-a622-4724-9598-b86dd05fa6f3	bf6c490b-6853-4272-8c6e-b07173ec2ad0	2f25a29a-d77b-49d6-9d0e-d2d7751eb52f	6	5	2026-10-24 06:03:56.572242+00	\N	2026-10-24 06:03:57.390253+00
3e3ade8d-b4ed-483d-bdad-bd8727a0ded7	bf6c490b-6853-4272-8c6e-b07173ec2ad0	91c9c73d-4833-46d9-9562-8bdb71d3fdc9	7	1	2026-10-24 06:03:56.572242+00	\N	2026-10-24 06:03:57.390253+00
e4a411ec-7d43-40ab-8914-74b7526914c7	bf6c490b-6853-4272-8c6e-b07173ec2ad0	27d9c730-e75e-4537-8388-9acaca86dee4	8	2	2026-10-24 06:03:56.572242+00	\N	2026-10-24 06:03:57.390253+00
74a28006-64cf-407b-af18-38cee0f80f96	bf6c490b-6853-4272-8c6e-b07173ec2ad0	d1ee3aad-fde4-47df-b431-877218b15fea	9	4	2026-10-24 06:03:56.572242+00	\N	2026-10-24 06:03:57.390253+00
f81b3deb-a9d7-4da7-b1ef-c81bb2c9e490	bf6c490b-6853-4272-8c6e-b07173ec2ad0	12a5f102-c612-4b3e-88d2-3aae5a8372ec	10	5	2026-10-24 06:03:56.572242+00	\N	2026-10-24 06:03:57.390253+00
1c1cfb8f-aa4d-4de6-b12f-0cd52cfd4b62	bf6c490b-6853-4272-8c6e-b07173ec2ad0	e4b65e11-e594-4f62-ba9f-1c88e7658ef0	11	1	2026-10-24 06:03:56.572242+00	\N	2026-10-24 06:03:57.390253+00
dbe49544-6982-4b58-a047-5492caca9713	bf6c490b-6853-4272-8c6e-b07173ec2ad0	3de4e2ce-90e5-45c6-be54-e50ae8d044c0	12	2	2026-10-24 06:03:56.572242+00	\N	2026-10-24 06:03:57.390253+00
b5100c49-b021-4078-87f7-138e78ff579a	bf6c490b-6853-4272-8c6e-b07173ec2ad0	ffa235ae-99b8-43b5-a110-58ee143d2a72	13	3	2026-10-24 06:03:56.572242+00	\N	2026-10-24 06:03:57.390253+00
ec49358f-78f7-4d45-8e86-90fb1b88c617	bf6c490b-6853-4272-8c6e-b07173ec2ad0	82868389-0756-4b10-89df-d38fa65d2f1e	14	4	2026-10-24 06:03:56.572242+00	\N	2026-10-24 06:03:57.390253+00
1d85c543-0eca-4132-a654-fcf8d9dffa5a	bf6c490b-6853-4272-8c6e-b07173ec2ad0	e39a881b-cf15-4599-98bf-bda0a1bc47c6	15	5	2026-10-24 06:03:56.572242+00	\N	2026-10-24 06:03:57.390253+00
727dce91-6157-4fbc-ae5f-0d48c58c09bc	bf6c490b-6853-4272-8c6e-b07173ec2ad0	1d1cc286-8aca-4f34-a355-61befc34b09b	2	3	2026-10-24 06:03:56.572242+00	\N	2026-10-24 06:03:57.390253+00
f9c0c940-de29-4f85-ac87-65d74bb261e3	d64b94a7-bf46-4265-9198-82f5d6adc599	939e6bb7-af2b-49b6-9fbc-224d14e4ab94	1	4	2026-11-08 10:42:30.044833+00	\N	2026-11-08 10:42:30.323269+00
e653d43a-f8c2-4f52-ab14-f2b13d66c2c4	d64b94a7-bf46-4265-9198-82f5d6adc599	7acc58ec-1d7f-4f2f-aec7-2e9df230ab51	4	3	2026-11-08 10:42:30.044833+00	\N	2026-11-08 10:42:30.323269+00
b9c7d5ec-810a-41aa-a839-0856b7b3a373	d64b94a7-bf46-4265-9198-82f5d6adc599	ca0f2713-6e49-4385-83ff-3d2a32c9df38	5	5	2026-11-08 10:42:30.044833+00	\N	2026-11-08 10:42:30.323269+00
6aeb7cb3-54b2-499a-8b9f-17cc8e206d81	d64b94a7-bf46-4265-9198-82f5d6adc599	39e9cfa9-ecf9-47c4-a3dc-097178820aff	6	1	2026-11-08 10:42:30.044833+00	\N	2026-11-08 10:42:30.323269+00
6a68c67b-42be-4993-b035-23a8103691dd	d64b94a7-bf46-4265-9198-82f5d6adc599	e9232f01-bf4c-4f5d-b27e-5d15063d8b8c	7	2	2026-11-08 10:42:30.044833+00	\N	2026-11-08 10:42:30.323269+00
53a0efd2-cc3a-4dca-b962-ca9e2258f5a8	d64b94a7-bf46-4265-9198-82f5d6adc599	138e7334-0505-429d-a399-e28418fbb0ac	8	3	2026-11-08 10:42:30.044833+00	\N	2026-11-08 10:42:30.323269+00
078fbfb1-97aa-43c6-9f32-bc7d1351e12a	d64b94a7-bf46-4265-9198-82f5d6adc599	afc043b3-bb56-4ed7-b4c9-dff438aad899	9	4	2026-11-08 10:42:30.044833+00	\N	2026-11-08 10:42:30.323269+00
c633cf56-93da-4b48-bc58-dc5600912973	d64b94a7-bf46-4265-9198-82f5d6adc599	ae47dce0-f370-4050-a5e7-d0a27277a414	10	5	2026-11-08 10:42:30.044833+00	\N	2026-11-08 10:42:30.323269+00
1ea375ad-88f5-4c21-b8de-ebf6242dd3de	d64b94a7-bf46-4265-9198-82f5d6adc599	37b33e7f-4016-4cfd-a9e0-eb1f33896527	11	1	2026-11-08 10:42:30.044833+00	\N	2026-11-08 10:42:30.323269+00
da065e7b-f052-4987-b9f7-80f4737fa113	d64b94a7-bf46-4265-9198-82f5d6adc599	8a9d3b1f-2724-4193-9caf-71b7de257627	12	2	2026-11-08 10:42:30.044833+00	\N	2026-11-08 10:42:30.323269+00
f27b99d4-bb2c-4a17-99a3-6e7247639a31	d64b94a7-bf46-4265-9198-82f5d6adc599	5b8dc496-4c06-4270-9da4-7148aa3cefef	13	3	2026-11-08 10:42:30.044833+00	\N	2026-11-08 10:42:30.323269+00
ae7e20b7-087e-499b-82c9-bc2c87e9fc12	d64b94a7-bf46-4265-9198-82f5d6adc599	7fc19fd7-107f-4e50-89c3-001d188312a7	14	4	2026-11-08 10:42:30.044833+00	\N	2026-11-08 10:42:30.323269+00
63510b12-a767-4433-ab5e-c5795c713977	d64b94a7-bf46-4265-9198-82f5d6adc599	7d011732-3523-4bcf-aa8a-3e4d8461785f	15	5	2026-11-08 10:42:30.044833+00	\N	2026-11-08 10:42:30.323269+00
a08adfe6-cb72-4cdc-82c0-6d3809eb134d	d64b94a7-bf46-4265-9198-82f5d6adc599	f49f136b-d0b0-4588-aa0d-aa549e9e7647	2	4	2026-11-08 10:42:30.044833+00	\N	2026-11-08 10:42:30.323269+00
190a1820-a76e-42f7-83fb-0c04f1f8245e	d64b94a7-bf46-4265-9198-82f5d6adc599	02ba1a6a-8ad2-4587-a92e-9cbc74cef20b	3	4	2026-11-08 10:42:30.044833+00	\N	2026-11-08 10:42:30.323269+00
ed2b5cde-ddfc-45db-97e4-84292131820b	568497cb-4fd2-4188-a97c-f4b274db9010	e4b65e11-e594-4f62-ba9f-1c88e7658ef0	1	1	2026-11-08 13:33:40.290654+00	\N	2026-11-08 13:33:40.562896+00
1838ce36-cd1d-4323-adb2-91313b4e5c4b	568497cb-4fd2-4188-a97c-f4b274db9010	1d1cc286-8aca-4f34-a355-61befc34b09b	2	1	2026-11-08 13:33:40.290654+00	\N	2026-11-08 13:33:40.562896+00
4fedd0a9-0ff2-4c8a-8ab6-4bfcb7520e66	568497cb-4fd2-4188-a97c-f4b274db9010	bc8ba9f3-5fcc-441b-975a-75688de67e5e	4	3	2026-11-08 13:33:40.290654+00	\N	2026-11-08 13:33:40.562896+00
b3680bd2-3bb8-4abf-9abb-937417647711	568497cb-4fd2-4188-a97c-f4b274db9010	7edd0484-71d3-49bd-a549-de8010bdfa5a	5	4	2026-11-08 13:33:40.290654+00	\N	2026-11-08 13:33:40.562896+00
652b1b2f-bbbe-443d-8cd9-02a05826c62f	568497cb-4fd2-4188-a97c-f4b274db9010	2f25a29a-d77b-49d6-9d0e-d2d7751eb52f	6	5	2026-11-08 13:33:40.290654+00	\N	2026-11-08 13:33:40.562896+00
43fe9ec8-07b9-4bee-b128-d7d35694ce53	568497cb-4fd2-4188-a97c-f4b274db9010	91c9c73d-4833-46d9-9562-8bdb71d3fdc9	7	1	2026-11-08 13:33:40.290654+00	\N	2026-11-08 13:33:40.562896+00
502ef526-7cba-4ea3-8e6b-11982ee7c445	568497cb-4fd2-4188-a97c-f4b274db9010	27d9c730-e75e-4537-8388-9acaca86dee4	8	2	2026-11-08 13:33:40.290654+00	\N	2026-11-08 13:33:40.562896+00
fedb9274-35b2-4b99-a258-0bc4135b51b3	568497cb-4fd2-4188-a97c-f4b274db9010	6139c29c-c66a-48ce-af97-1a2526e3285a	9	3	2026-11-08 13:33:40.290654+00	\N	2026-11-08 13:33:40.562896+00
2bdafe43-e9dd-4449-ad8c-e30686da498e	568497cb-4fd2-4188-a97c-f4b274db9010	d1ee3aad-fde4-47df-b431-877218b15fea	10	4	2026-11-08 13:33:40.290654+00	\N	2026-11-08 13:33:40.562896+00
37fd7484-d8e8-44af-b805-9a43d73e2727	568497cb-4fd2-4188-a97c-f4b274db9010	12a5f102-c612-4b3e-88d2-3aae5a8372ec	11	5	2026-11-08 13:33:40.290654+00	\N	2026-11-08 13:33:40.562896+00
9e7a1fec-afe7-4b1f-83bb-9223a35f2018	568497cb-4fd2-4188-a97c-f4b274db9010	3de4e2ce-90e5-45c6-be54-e50ae8d044c0	12	2	2026-11-08 13:33:40.290654+00	\N	2026-11-08 13:33:40.562896+00
f169f7ef-1636-4397-aea8-36b829529f2c	568497cb-4fd2-4188-a97c-f4b274db9010	ffa235ae-99b8-43b5-a110-58ee143d2a72	13	3	2026-11-08 13:33:40.290654+00	\N	2026-11-08 13:33:40.562896+00
dab2f2a6-4592-4e1f-8f75-01ca87f01448	568497cb-4fd2-4188-a97c-f4b274db9010	82868389-0756-4b10-89df-d38fa65d2f1e	14	4	2026-11-08 13:33:40.290654+00	\N	2026-11-08 13:33:40.562896+00
6a57556a-756b-4e0d-903b-f63c7be617ae	568497cb-4fd2-4188-a97c-f4b274db9010	e39a881b-cf15-4599-98bf-bda0a1bc47c6	15	5	2026-11-08 13:33:40.290654+00	\N	2026-11-08 13:33:40.562896+00
033d83eb-9143-4a7a-a3b4-37088f97216f	568497cb-4fd2-4188-a97c-f4b274db9010	ccccd4bf-4bf8-44cc-8f33-1919490b6fb0	3	1	2026-11-08 13:33:40.290654+00	\N	2026-11-08 13:33:40.562896+00
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.audit_logs (id, user_id, action, entity_type, entity_id, metadata, ip_address, user_agent, created_at) FROM stdin;
\.


--
-- Data for Name: competencies; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.competencies (id, code, name, description, status, created_at, updated_at, deleted_at) FROM stdin;
5494ff9f-9012-4b95-bfc5-f2393468a438	TEKSTUAL	Pemahaman Tekstual	Kemampuan memahami informasi eksplisit yang terdapat langsung dalam teks	active	2026-09-08 07:53:11.76449+00	2026-09-08 07:53:11.76449+00	\N
8059b8e3-ba94-41ac-96a6-93d97cfcb0ca	INFERENSIAL	Pemahaman Inferensial	Kemampuan menarik kesimpulan dan memahami makna tersirat dari teks	active	2026-09-08 07:53:12.172499+00	2026-09-08 07:53:12.172499+00	\N
50ce66b9-98af-491e-96e8-7f07110a41b2	EVALUASI	Evaluasi dan Apresiasi	Kemampuan menilai kredibilitas, gaya bahasa, dan merefleksikan isi teks	active	2026-09-08 07:53:12.37546+00	2026-09-08 07:53:12.37546+00	\N
\.


--
-- Data for Name: competency_evaluations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.competency_evaluations (id, evaluation_id, user_id, competency_id, total_questions, correct_answers, score, accuracy, level, created_at) FROM stdin;
2a256aad-fca2-4e09-8099-3f7abe22f79f	b025fd1f-7a9a-46c8-81c7-9394ccf901e8	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	2	1	50.00	50.00	medium	2026-09-27 07:44:45.078977+00
0bb2c7c2-0f45-4f82-82bf-94d2e7f56ed4	b0951970-0df6-478d-9dad-f67a1331f383	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	2	1	50.00	50.00	medium	2026-09-27 08:02:41.979059+00
c22587fd-91b2-44fb-a300-a6fe5cd4f3cd	3f879c62-c4bb-4479-a0af-d2a89d69a07f	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	2	1	50.00	50.00	medium	2026-09-27 08:07:57.414901+00
18c69c37-f386-43c5-a532-9bb3a8a6526b	f4f7e649-45ce-454d-96da-dc992f0cb26b	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	1	0	0.00	0.00	low	2026-09-27 08:12:58.046231+00
20931460-8dd8-4b2d-b20e-89a65dfb4e63	9bee0e27-cd1f-4740-a3ce-abc91e71ae4a	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	2	0	0.00	0.00	low	2026-09-27 08:13:19.254034+00
5df14163-66cd-49f1-aada-c463999a8bcf	7757fbdd-180c-46e8-9141-237e4bd197d3	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	2	1	50.00	50.00	medium	2026-09-27 08:15:23.342132+00
7e4e3790-cb32-40b3-bff8-4b51f1951799	7b0976ad-587c-4b34-95f5-7d4b189bf8e1	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	1	0	0.00	0.00	low	2026-09-30 02:20:48.764951+00
7214b8f3-5120-4239-9ca3-5d8fe455a3a3	2c7dc43b-ad30-4013-b176-c6025d8dff6b	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	1	1	100.00	100.00	high	2026-09-30 02:35:54.296578+00
\.


--
-- Data for Name: documentation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.documentation (id, title, slug, content, category, status, created_by, updated_by, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: documentations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.documentations (id, title, slug, content, category, status, created_by, updated_by, created_at, updated_at, deleted_at) FROM stdin;
f029c4bd-b1a6-4ffb-8ed7-14d6c143e772	Contoh Dokumentasi	contoh-dokumen	ansjdsndkfnaskdflkasdfsndklfaslkndfnklasdfknlasdfnlkasfdlanksf	Contoh Document	published	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	\N	2026-11-09 09:05:20.374737+00	2026-11-09 09:05:20.374737+00	\N
\.


--
-- Data for Name: evaluations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.evaluations (id, user_id, source_type, source_id, total_questions, correct_answers, incorrect_answers, score, accuracy, created_at) FROM stdin;
5ffa9d28-a863-4a86-91f9-822512c91f0f	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	3f1a8f26-c11d-46ca-885b-0d254257eb46	1	0	0	0.00	0.00	2026-09-27 05:20:50.385996+00
801f37f1-529f-48d7-bddd-267965288309	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	d544adc0-5f73-4f14-8715-6df06931525c	1	0	0	0.00	0.00	2026-09-27 05:21:51.051148+00
1a3a7b4e-d1c0-4248-8458-0dde57c809d1	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	06687d5e-39d5-4c81-9a33-82bb49343fdd	1	0	0	0.00	0.00	2026-09-27 05:25:35.768644+00
c442dcea-729d-408e-8916-9a2940f1ff04	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	252358ad-3e7b-489d-b643-16489ab3584f	1	0	0	0.00	0.00	2026-09-27 05:35:05.61882+00
91384111-7bed-4a38-a99e-97d108c6fee9	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	634915f4-06a1-48f2-a043-d9f536f7befc	1	0	0	0.00	0.00	2026-09-27 05:49:27.001727+00
aabaab51-84b0-49b3-9ff8-8fb6c6b16419	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	ed651dc4-fcf6-46a2-ad85-cc171f8e71ca	2	0	0	0.00	0.00	2026-09-27 05:51:10.326372+00
1ddf0028-0b80-48fe-805e-2ddc350da429	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	897987e1-221a-4263-8d96-c1abb61327bd	2	0	0	0.00	0.00	2026-09-27 06:19:39.822996+00
73ba6ee6-ae53-4c55-a2d2-d2a34c124c60	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	031c1421-94c0-4489-8e64-6a6687793f3e	2	0	0	0.00	0.00	2026-09-27 06:21:39.120255+00
697f5411-853b-4d59-b352-186e68de421c	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	1484e340-037c-4f19-8b33-9ef5fdddd98b	2	0	0	0.00	0.00	2026-09-27 06:41:41.988189+00
c7c9b8f4-820a-47d4-980a-35b30b200d3f	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	99084518-270a-48dd-ae4f-6e58d9d37d43	2	0	0	0.00	0.00	2026-09-27 06:42:48.449309+00
468dfaf7-ec9b-45d2-aea8-104a2ca097a4	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	9fee81cb-9feb-41ee-b4a1-0cc59276bc4e	2	0	0	0.00	0.00	2026-09-27 06:53:05.605996+00
529712c4-cd9a-4cd4-a423-b881780f7546	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	99f81c30-a88d-4a89-a320-1b12c07ce88b	2	0	0	0.00	0.00	2026-09-27 07:04:29.533089+00
8fce4908-eb6c-46d1-9b5c-873145f4afb1	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	32ebed14-eaf4-4dfc-beca-5b62ea03c8fe	1	0	0	0.00	0.00	2026-09-27 07:05:58.416237+00
0ccdeca7-caca-403b-b5d4-ec9948a02720	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	2ffd9278-309d-4e78-a05a-d832758b2dda	2	0	0	0.00	0.00	2026-09-27 07:28:25.737432+00
40060b1b-e957-4100-9211-8c6927e7d8ee	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	efe03fb0-fc4b-48ab-8577-bedf64ba86c0	2	0	0	0.00	0.00	2026-09-27 07:29:04.54827+00
58e3778b-2bde-4e1d-86cd-aba2b92cc11c	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	986bbb95-4bce-4490-9818-17206f31e0e3	2	0	0	0.00	0.00	2026-09-27 07:41:42.074501+00
b025fd1f-7a9a-46c8-81c7-9394ccf901e8	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	81e8bd79-5bcc-41cc-b41c-2969ac141e66	2	1	1	50.00	50.00	2026-09-27 07:44:43.850125+00
b0951970-0df6-478d-9dad-f67a1331f383	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	1b6091ca-c081-43d2-8769-e9c2ff84acf4	2	1	1	50.00	50.00	2026-09-27 08:02:41.256695+00
2a67340f-288f-4fc4-8489-d6581695a9f9	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	65a1ab4f-01be-40c4-b02d-cbe2406d21f9	2	0	0	0.00	0.00	2026-09-27 08:05:26.90454+00
3f879c62-c4bb-4479-a0af-d2a89d69a07f	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	f005efde-cf52-4f01-b6f6-9576468a8b4f	2	1	1	50.00	50.00	2026-09-27 08:07:56.876913+00
f4f7e649-45ce-454d-96da-dc992f0cb26b	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	9c1950ee-86a7-4cc0-a170-ff9659faf7a0	2	0	1	0.00	0.00	2026-09-27 08:12:57.392868+00
9bee0e27-cd1f-4740-a3ce-abc91e71ae4a	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	2ba706ed-9718-4fb0-b9dc-ba5b901c1fdc	2	0	2	0.00	0.00	2026-09-27 08:13:18.61308+00
7757fbdd-180c-46e8-9141-237e4bd197d3	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	1ccc4194-b9a8-4799-8051-d9f37a3209c1	2	1	1	50.00	50.00	2026-09-27 08:15:22.738536+00
26c814e8-66f9-4870-8d72-581d1213d8bc	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	12a847a5-abfd-49e9-9ac1-48c6a7d2368b	2	0	2	0.00	0.00	2026-09-27 08:26:55.537686+00
661d3b04-7943-4ab2-94a3-d55c984a913f	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	6e943a25-d282-4082-99d7-0af185e23b62	2	2	0	100.00	100.00	2026-09-27 08:32:18.013545+00
19233fa0-9dc7-4e98-ac6b-87657373fc34	f125ef5d-2c6f-4187-b02d-a50465b62803	tryout	c4594205-b7fc-45eb-a3b3-d43ac0c6f630	3	0	0	0.00	0.00	2026-09-28 06:39:46.09028+00
d3d7e85c-adae-42c4-8098-64658d6ca243	f125ef5d-2c6f-4187-b02d-a50465b62803	tryout	2549e94c-16ac-49de-80dd-dffc9a589825	3	0	0	0.00	0.00	2026-09-28 06:40:03.805102+00
8743e8ab-671e-4f50-887a-f2d100bc0275	f125ef5d-2c6f-4187-b02d-a50465b62803	tryout	a7459e54-5b96-4664-8a32-f770bf02a8d1	3	0	0	0.00	0.00	2026-09-28 07:04:03.644096+00
d3cf84c2-1f24-4915-adc8-b2d04791a29e	f125ef5d-2c6f-4187-b02d-a50465b62803	tryout	11e6bfde-0b03-4187-bcb0-ade07ff3b916	3	2	1	66.67	66.67	2026-09-28 07:09:27.432119+00
37626004-453f-4e5d-9fac-e61ffe092490	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	a5518990-f9fa-4241-9068-77d30b3b0455	2	0	2	0.00	0.00	2026-09-28 07:18:13.607008+00
86e08b1d-faa5-4273-8e9f-b3c4c77ced13	f125ef5d-2c6f-4187-b02d-a50465b62803	tryout	32d344dc-2af5-4d74-a05e-f7c892c62809	3	0	3	0.00	0.00	2026-09-28 09:07:41.529608+00
6137ff77-5a20-483b-b8a5-a16be2448bad	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	bc7417db-9b37-47cf-8748-1611a164b24d	2	1	1	50.00	50.00	2026-09-30 02:15:02.722345+00
b2404f40-b420-4b53-938e-531084a8e5e6	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	5a2a51cb-5621-43c1-bef7-5fffd1990f49	2	2	0	100.00	100.00	2026-09-30 02:18:22.304652+00
a2bb7e2b-d8fc-4de9-8ca0-684379ee7555	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	a181880e-7364-4066-9b99-bd77e7f5c404	1	1	0	100.00	100.00	2026-09-30 02:19:34.688379+00
5a3fb3ea-8c13-43d0-b299-bdea3a56eeb2	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	fc69403f-e756-47c9-87d5-f6ce5b84c50a	1	0	0	0.00	0.00	2026-09-30 02:20:23.779632+00
7b0976ad-587c-4b34-95f5-7d4b189bf8e1	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	04032bb3-262c-42a3-995e-fc4bf1593008	1	0	1	0.00	0.00	2026-09-30 02:20:48.734868+00
4a9ccf70-34da-44db-bbf8-0051038e2ce1	f125ef5d-2c6f-4187-b02d-a50465b62803	tryout	4686e74d-d3e9-4bd2-a700-2778cd0bfeb0	3	0	2	0.00	0.00	2026-09-30 02:24:59.234333+00
181f7029-16eb-4268-8e8e-b5f9a920972d	f125ef5d-2c6f-4187-b02d-a50465b62803	tryout	8c0c21fd-93d3-4da5-9021-67194ed1cf06	3	2	1	66.67	66.67	2026-09-30 02:28:41.648944+00
2c7dc43b-ad30-4013-b176-c6025d8dff6b	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	104da301-1e54-481f-9fda-24e05225a905	1	1	0	100.00	100.00	2026-09-30 02:35:54.273369+00
a9ed0077-647a-4fa8-a17e-e7f069fed7e5	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	8edaa5e9-f553-49e4-880a-3594fc638fc7	2	0	1	0.00	0.00	2026-09-30 11:39:33.897751+00
099b9bc5-2278-4cfd-995c-fe2edf28fa98	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	36137138-7fd1-4f9e-9c52-05b15490e2fb	1	0	0	0.00	0.00	2026-09-30 11:40:00.728117+00
a72a5153-b321-427e-a6e8-9594f55c8f1c	f125ef5d-2c6f-4187-b02d-a50465b62803	tryout	231bc117-58f1-4042-ac2c-b4aec6ffb8b1	3	2	1	66.67	66.67	2026-10-01 07:26:09.144392+00
67dea6e4-9209-4bc1-89b9-e40bdc248648	f125ef5d-2c6f-4187-b02d-a50465b62803	tryout	8c42f1a7-c7fb-4edb-b027-077f3812e13c	3	2	1	66.67	66.67	2026-10-01 09:12:03.930609+00
1a7d07ae-2c53-469c-be3a-93921fac06fe	f125ef5d-2c6f-4187-b02d-a50465b62803	tryout	276b6116-9c80-4267-ba42-c715f30e90d5	3	0	3	0.00	0.00	2026-10-01 09:14:50.330725+00
558056ed-7486-48b3-93f1-f63bc2c57578	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	0332a377-f061-452c-bdcc-2bca7a1e65b3	2	0	2	0.00	0.00	2026-10-07 03:10:13.845849+00
24d9899c-3e36-4109-85af-29b6c9cd3980	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	ca88633e-9d34-42d2-99ba-5330285712aa	4	3	1	75.00	75.00	2026-10-21 08:28:39.029375+00
310cd0d0-91ce-41bc-8176-7a52356580be	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	7a8d7f3a-6f17-4957-b0f7-de1638860bd1	4	4	0	100.00	100.00	2026-10-21 08:50:55.242885+00
3a849b49-835a-4e01-a054-6a4e66d63508	f125ef5d-2c6f-4187-b02d-a50465b62803	tryout	9bae655a-54e4-4803-bb9d-4df71b815f1d	3	0	0	0.00	0.00	2026-10-24 04:58:19.997309+00
26abe680-47d1-4252-8cfe-3f14bd55783c	f125ef5d-2c6f-4187-b02d-a50465b62803	tryout	0729f24c-f6bb-4fd6-994a-c94e6c8a7825	3	2	1	66.67	66.67	2026-10-24 05:31:25.570268+00
36958316-9a50-49c0-a745-db76a8f14ffd	f125ef5d-2c6f-4187-b02d-a50465b62803	tryout	bf6c490b-6853-4272-8c6e-b07173ec2ad0	3	0	3	0.00	0.00	2026-10-24 06:13:53.143612+00
f0b0bd9f-5300-4317-86be-98ff4dee0de9	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	2fa47485-8509-4612-9c44-7e8d77c258f6	4	1	3	25.00	25.00	2026-11-08 10:16:33.73441+00
a1fa5c6a-44e1-436f-83b8-84855cbedb86	f125ef5d-2c6f-4187-b02d-a50465b62803	practice	514cdd60-823a-4cc8-83b8-86e0ba1bca0b	4	1	3	25.00	25.00	2026-11-08 10:21:41.090319+00
9c792d58-7e33-4ced-bfc9-8eb67c4ae5ef	f125ef5d-2c6f-4187-b02d-a50465b62803	tryout	d64b94a7-bf46-4265-9198-82f5d6adc599	3	2	1	66.67	66.67	2026-11-08 10:42:56.401857+00
0edb56c2-eab3-4871-a15c-c1e99398456f	fc4baf98-26f0-45e0-89b9-ddd23d0f3bd1	practice	e5161a8c-e199-42ec-a5a1-870d16ec1f03	4	2	2	50.00	50.00	2026-11-08 13:18:38.764534+00
126e3580-920b-4e31-94b5-fd29cf9ca4d7	f125ef5d-2c6f-4187-b02d-a50465b62803	tryout	568497cb-4fd2-4188-a97c-f4b274db9010	3	0	3	0.00	0.00	2026-11-08 13:35:44.473692+00
\.


--
-- Data for Name: external_accounts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.external_accounts (id, user_id, provider, provider_user_id, email, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: file_records; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.file_records (id, object_key, original_name, mime_type, size_bytes, storage_provider, uploaded_by, created_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.files (id, object_key, original_name, mime_type, size_bytes, storage_provider, uploaded_by, created_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: learning_modules; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.learning_modules (id, title, description, display_order, status, created_by, updated_by, created_at, updated_at, deleted_at, label, jenjang) FROM stdin;
92cd98cf-3458-4810-9908-686f341fb773	Bahasa Indonesia	Tetang Bahasa Indonesia	0	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-09-19 02:41:08.004196+00	2026-09-19 02:41:08.004196+00	2026-09-19 02:42:57.571633+00	BI-123	sma
0afd64b9-a18d-4621-b0ad-b25523607ce5	Tester Module [Update-Update]	Mencoba Membuat Module	0	published	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2026-09-15 12:08:20.57738+00	2026-11-07 08:07:24.226694+00	2026-11-07 08:15:50.497603+00	Modul kurikulum terpadu	sma
0bc056d6-1d45-4607-aeff-a1322895d827	Matematika	Ini Belajar Matermatika	0	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-09-19 03:17:03.132432+00	2026-11-08 08:14:07.04944+00	2026-11-08 08:14:39.930099+00	MAT-X1	sma
dcca692f-3a00-427f-9b4f-ff609f71d3a4	Tester Module	UNTUK TETSTER	0	published	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-11-07 08:58:17.970789+00	2026-11-08 08:14:46.864251+00	\N	BI	sma
\.


--
-- Data for Name: learning_progress; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.learning_progress (id, user_id, material_id, is_completed, completed_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: learning_progresses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.learning_progresses (id, user_id, material_id, is_completed, completed_at, created_at, updated_at) FROM stdin;
367af933-b014-426f-8ecb-e78edf897721	f125ef5d-2c6f-4187-b02d-a50465b62803	2a4bb7df-da0a-4591-a773-912c08ac53e8	t	2026-11-07 08:07:44.092206+00	2026-11-07 08:07:44.189954+00	2026-11-07 08:07:44.189954+00
5654f495-5aee-4230-aeb5-03c5f0ce6c5a	f125ef5d-2c6f-4187-b02d-a50465b62803	13ab86e7-25e8-4120-b84d-01f732abe4e9	t	2026-11-08 08:11:18.001687+00	2026-09-27 08:58:20.233972+00	2026-11-08 08:11:18.051213+00
52242ff8-c3d4-43be-8b7c-43a88a41eeb0	f125ef5d-2c6f-4187-b02d-a50465b62803	6a1f24e6-afd5-4b1d-9b8c-3d9542b8455c	t	2026-11-08 08:11:57.400425+00	2026-09-27 08:52:41.906713+00	2026-11-08 08:11:57.452655+00
be88b200-2b2c-432f-8dd1-b54ab63a71b5	f125ef5d-2c6f-4187-b02d-a50465b62803	3213f090-d9a6-4507-be64-1d0ce223247a	t	2026-11-08 08:41:41.397723+00	2026-11-08 08:14:59.889105+00	2026-11-08 08:41:41.453652+00
0515915a-a1a1-4650-9330-76889f624839	fc4baf98-26f0-45e0-89b9-ddd23d0f3bd1	3213f090-d9a6-4507-be64-1d0ce223247a	t	2026-11-08 13:15:22.066513+00	2026-11-08 13:15:22.117745+00	2026-11-08 13:15:22.117745+00
\.


--
-- Data for Name: material_attachments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.material_attachments (id, material_id, file_id, display_order, created_at) FROM stdin;
\.


--
-- Data for Name: materials; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.materials (id, module_id, competency_id, title, description, content, type, display_order, status, created_by, updated_by, created_at, updated_at, deleted_at, jenjang, learning_objectives, structure_items) FROM stdin;
3213f090-d9a6-4507-be64-1d0ce223247a	dcca692f-3a00-427f-9b4f-ff609f71d3a4	8059b8e3-ba94-41ac-96a6-93d97cfcb0ca	BAHASA INDONESIA TESTER	ETRTYYNIOMP,	<p class="western" align="center">\n<font color="#2e74b5"><font size="3"><b>SIMANTIK</b></font></font></p>\n<p align="center">\n<font color="#1f4e79"><font face="Calibri, serif"><font size="6"><b>MATERI\nPEMAHAMAN BACAAN</b></font></font></font></p>\n<p class="western" align="center"><i>Tes Kemampuan Akademik (TKA)\nBahasa Indonesia — Materi Contoh untuk Pengujian Website</i></p>\n<center>\n\t<table width="653" cellpadding="7" cellspacing="0">\n\t\t<colgroup><col width="312">\n\t\t<col width="312">\n\t\t</colgroup><tbody><tr>\n\t\t\t<td width="312"><p class="western" align="left">\n\t\t\t\t<font color="#365f91"><b>Topik</b></font></p>\n\t\t\t</td>\n\t\t\t<td width="312"><p class="western" align="left">\n\t\t\t\t<font color="#365f91"><b>Lingkungan dan Teknologi Hijau</b></font></p>\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td width="312" bgcolor="#d3dfee"><p class="western" align="left">\n\t\t\t\t<font color="#365f91"><b>Fokus kompetensi</b></font></p>\n\t\t\t</td>\n\t\t\t<td width="312" bgcolor="#d3dfee"><p class="western" align="left">\n\t\t\t\t<font color="#365f91">Pemahaman tekstual, inferensial, evaluasi\n\t\t\t\tdan apresiasi</font></p>\n\t\t\t</td>\n\t\t</tr>\n\t</tbody></table>\n</center>\n<h1 class="western">A. Tujuan Pembelajaran</h1>\n<ul><li><p>Mengidentifikasi informasi tersurat dan istilah penting dalam\n\tteks.</p></li><li><p>Menentukan ide pokok serta hubungan makna antarkalimat dan\n\tantarparagraf.</p></li><li><p>Menarik kesimpulan berdasarkan informasi tersirat.</p></li><li><p>Menilai relevansi, kecukupan, dan ketepatan informasi yang\n\tdisampaikan penulis.</p></li></ul>\n<h1 class="western">B. Materi Inti: Memahami Gagasan dalam Teks\nInformasi</h1>\n<p class="western">Teks informasi menyajikan fakta, konsep, atau\npenjelasan mengenai suatu topik. Untuk memahami teks secara\nmenyeluruh, pembaca tidak cukup hanya menemukan kata atau kalimat\ntertentu. Pembaca juga perlu mengenali hubungan antargagasan,\nmembedakan fakta dan opini, serta menyusun kesimpulan berdasarkan\nbukti yang tersedia.</p>\n<p class="western">Salah satu cara membaca secara terarah adalah\nmemperhatikan gagasan utama setiap paragraf. Gagasan utama merupakan\ninti pembahasan, sedangkan gagasan pendukung berfungsi menjelaskan,\nmemberikan contoh, atau memperkuat inti tersebut. Gagasan utama dapat\nterletak di awal, akhir, atau tersirat di beberapa bagian paragraf.</p>\n<h1 class="western">C. Bacaan: Teknologi Hijau dan Masa Depan\nLingkungan</h1>\n<p class="western">Perubahan iklim menjadi tantangan yang semakin\nnyata bagi kehidupan manusia. Peningkatan emisi gas rumah kaca,\npembukaan hutan, dan penggunaan energi fosil menyebabkan suhu bumi\nmeningkat. Dampaknya dapat terlihat melalui cuaca ekstrem, perubahan\npola musim, serta naiknya permukaan air laut. Keadaan tersebut\nmenunjukkan bahwa perlindungan lingkungan tidak dapat hanya\nmengandalkan kebiasaan lama. Diperlukan inovasi yang mampu mengurangi\ntekanan terhadap alam sekaligus mendukung kebutuhan masyarakat.</p>\n<p class="western">Salah satu pendekatan yang dapat dilakukan adalah\npenerapan teknologi hijau. Istilah tersebut merujuk pada teknologi\nyang dirancang untuk mengurangi dampak negatif terhadap lingkungan.\nContohnya ialah panel surya yang mengubah energi matahari menjadi\nlistrik dan turbin angin yang memanfaatkan pergerakan udara. Kedua\nteknologi itu dapat membantu mengurangi ketergantungan pada bahan\nbakar fosil. Selain menghasilkan energi, teknologi hijau juga\nditerapkan dalam pengelolaan air, pengolahan sampah, transportasi,\ndan kegiatan pertanian.</p>\n<p class="western">Meskipun menawarkan manfaat, penerapan teknologi\nhijau tidak selalu mudah. Pembangunan fasilitas energi terbarukan\nmembutuhkan biaya awal yang relatif besar. Di sejumlah wilayah,\nketersediaan tenaga ahli dan infrastruktur pendukung juga masih\nterbatas. Namun, kendala tersebut bukan alasan untuk menghentikan\npengembangan. Pemerintah, dunia usaha, lembaga pendidikan, dan\nmasyarakat dapat bekerja sama melalui penelitian, penyediaan\npelatihan, serta kebijakan yang mendorong penggunaan teknologi ramah\nlingkungan.</p>\n<p class="western">Pada akhirnya, keberhasilan teknologi hijau tidak\nhanya ditentukan oleh kecanggihan alat yang digunakan. Perubahan\nperilaku masyarakat tetap diperlukan, misalnya menghemat listrik,\nmenggunakan transportasi umum, memilah sampah, dan mengurangi barang\nsekali pakai. Teknologi akan memberikan hasil lebih besar apabila\ndidukung kebiasaan yang bertanggung jawab. Dengan demikian, upaya\nmenjaga lingkungan merupakan pekerjaan bersama yang perlu dilakukan\nsecara konsisten.</p>\n<h1 class="western">D. Istilah Penting</h1>\n<center>\n\t<table width="653" cellpadding="7" cellspacing="0">\n\t\t<colgroup><col width="312">\n\t\t<col width="312">\n\t\t</colgroup><tbody>\n\t\t\t<tr valign="top">\n\t\t\t\t<td width="312"><p class="western" align="left">\n\t\t\t\t\t<font color="#365f91"><b>Istilah</b></font></p>\n\t\t\t\t</td>\n\t\t\t\t<td width="312"><p class="western" align="left">\n\t\t\t\t\t<font color="#365f91"><b>Makna dalam konteks bacaan</b></font></p>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t</tbody>\n\t\t<tbody>\n\t\t\t<tr valign="top">\n\t\t\t\t<td width="312" bgcolor="#d3dfee"><p class="western" align="left">\n\t\t\t\t\t<font color="#365f91"><b>Emisi</b></font></p>\n\t\t\t\t</td>\n\t\t\t\t<td width="312" bgcolor="#d3dfee"><p class="western" align="left">\n\t\t\t\t\t<font color="#365f91">zat, energi, atau komponen yang dilepaskan\n\t\t\t\t\tke lingkungan; dalam bacaan ini merujuk pada gas yang dilepaskan\n\t\t\t\t\tke atmosfer.</font></p>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t<tr valign="top">\n\t\t\t\t<td width="312"><p class="western" align="left">\n\t\t\t\t\t<font color="#365f91"><b>Energi terbarukan</b></font></p>\n\t\t\t\t</td>\n\t\t\t\t<td width="312"><p class="western" align="left">\n\t\t\t\t\t<font color="#365f91">energi yang berasal dari sumber alam yang\n\t\t\t\t\tdapat pulih secara alami, seperti matahari dan angin.</font></p>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t<tr valign="top">\n\t\t\t\t<td width="312" bgcolor="#d3dfee"><p class="western" align="left">\n\t\t\t\t\t<font color="#365f91"><b>Infrastruktur</b></font></p>\n\t\t\t\t</td>\n\t\t\t\t<td width="312" bgcolor="#d3dfee"><p class="western" align="left">\n\t\t\t\t\t<font color="#365f91">sarana dan prasarana dasar yang mendukung\n\t\t\t\t\tsuatu kegiatan atau layanan.</font></p>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t<tr valign="top">\n\t\t\t\t<td width="312"><p class="western" align="left">\n\t\t\t\t\t<font color="#365f91"><b>Teknologi hijau</b></font></p>\n\t\t\t\t</td>\n\t\t\t\t<td width="312"><p class="western" align="left">\n\t\t\t\t\t<font color="#365f91">teknologi yang dirancang untuk mengurangi\n\t\t\t\t\tdampak negatif terhadap lingkungan.</font></p>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t</tbody>\n\t</table>\n</center>\n<h1 class="western">E. Strategi Membaca</h1>\n<ol><li><p><b>Temukan topik: </b>Perhatikan judul dan kata-kata yang\n\tsering muncul.</p></li><li><p><b>Tentukan gagasan utama: </b>Tanyakan: hal terpenting apa\n\tyang dibahas dalam paragraf ini?</p></li><li><p><b>Cari bukti pendukung: </b>Tandai fakta, contoh, alasan,\n\tatau penjelasan yang memperkuat gagasan utama.</p></li><li><p><b>Hubungkan antarparagraf: </b>Perhatikan kata penghubung\n\tseperti 'meskipun', 'namun', 'oleh karena itu', dan 'dengan\n\tdemikian'.</p></li><li><p><b>Buat kesimpulan: </b>Simpulkan isi berdasarkan informasi\n\tdalam teks, bukan dugaan di luar teks.</p></li></ol>\n<h1 class="western">F. Latihan Pemahaman</h1>\n<p class="western">Bacalah kembali teks pada bagian C, kemudian\njawablah pertanyaan berikut.</p>\n<p class="western"><b>1. Apa gagasan utama paragraf kedua?</b></p>\n<ul><li><p>A. Teknologi hijau hanya digunakan untuk menghasilkan\n\tlistrik.</p></li><li><p>B. Teknologi hijau memiliki beragam penerapan untuk\n\tmengurangi dampak lingkungan.</p></li><li><p>C. Panel surya merupakan teknologi yang paling murah.</p></li><li><p>D. Pengelolaan sampah tidak berkaitan dengan teknologi hijau.</p></li><li><p>E. Energi fosil tidak lagi digunakan oleh masyarakat.</p></li></ul>\n<p class="western"><b>2. Berdasarkan bacaan, mengapa penerapan\nteknologi hijau menghadapi kendala?</b></p>\n<ul><li><p>A. Masyarakat tidak membutuhkan energi.</p></li><li><p>B. Semua teknologi hijau menghasilkan polusi.</p></li><li><p>C. Biaya awal, tenaga ahli, dan infrastruktur masih menjadi\n\ttantangan.</p></li><li><p>D. Pemerintah melarang penelitian teknologi.</p></li><li><p>E. Sumber energi matahari dan angin tidak tersedia.</p></li></ul>\n<p class="western"><b>3. Pilihlah semua pernyataan yang sesuai dengan\nisi bacaan.</b></p>\n<ul><li><p>A. Panel surya memanfaatkan energi matahari.</p></li><li><p>B. Teknologi hijau hanya diterapkan dalam bidang\n\ttransportasi.</p></li><li><p>C. Kerja sama berbagai pihak dapat mendukung penerapan\n\tteknologi hijau.</p></li><li><p>D. Perubahan perilaku masyarakat tidak diperlukan apabila\n\tteknologi sudah tersedia.</p></li><li><p>E. Mengurangi barang sekali pakai merupakan salah satu contoh\n\tperilaku bertanggung jawab.</p></li></ul>\n<p class="western"><b>4. Kata 'Namun' pada paragraf ketiga berfungsi\nuntuk ....</b></p>\n<ul><li><p>A. menunjukkan pertentangan terhadap gagasan sebelumnya.</p></li><li><p>B. menyatakan urutan waktu.</p></li><li><p>C. memberikan definisi istilah.</p></li><li><p>D. menyatakan tujuan kegiatan.</p></li><li><p>E. mengulang contoh yang sama.</p></li></ul>\n<p class="western"><b>5. Apakah simpulan berikut didukung oleh\nbacaan? Berikan alasan singkat.</b></p>\n<ul><li><p>“Teknologi hijau akan memberikan manfaat yang lebih besar\n\tapabila disertai perubahan perilaku masyarakat.”</p></li></ul>\n<h1 class="western">G. Kunci Jawaban dan Pembahasan</h1>\n<p class="western"><b>1. B — </b>Paragraf kedua menjelaskan\npengertian teknologi hijau dan berbagai contoh penerapannya, tidak\nterbatas pada produksi listrik.</p>\n<p class="western"><b>2. C — </b>Paragraf ketiga menyebutkan biaya\nawal, keterbatasan tenaga ahli, dan infrastruktur sebagai kendala.</p>\n<p class="western"><b>3. A, C, dan E — </b>Panel surya memanfaatkan\nmatahari; kolaborasi berbagai pihak mendukung pengembangan; dan\nmengurangi barang sekali pakai termasuk perilaku bertanggung jawab.\nPernyataan B dan D bertentangan dengan bacaan.</p>\n<p class="western"><b>4. A — </b>Kata 'Namun' menghubungkan dua\ngagasan yang berlawanan: adanya kendala dan perlunya tetap\nmengembangkan teknologi hijau.</p>\n<p class="western"><b>5. Didukung — </b>Paragraf terakhir\nmenyatakan bahwa teknologi akan memberikan hasil lebih besar apabila\ndidukung kebiasaan yang bertanggung jawab.</p>\n<h1 class="western">H. Rangkuman</h1>\n<p class="western">Pemahaman bacaan mencakup kemampuan menemukan\ninformasi tersurat, mengenali gagasan utama, memahami hubungan\nantargagasan, menarik kesimpulan, serta menilai isi teks. Dalam\nmembaca teks informasi, gunakan bukti yang benar-benar tersedia di\ndalam bacaan. Teknologi hijau menjadi contoh topik yang dapat\ndianalisis melalui ketiga kompetensi utama TKA: pemahaman tekstual,\npemahaman inferensial, serta evaluasi dan apresiasi.</p>\n\n	document	1	published	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-11-07 09:28:31.894824+00	2026-11-08 08:41:32.869129+00	\N	sma	[{"id": "1794042259939", "text": "makin jago"}, {"id": "1794042266889", "text": "dan keren"}]	[{"text": "ASDASKDALSDAKSLDALSDKASMDKASLKD", "label": "1. Pokok Bahasan:  PASDPASPD"}, {"text": "ASDFASDF", "label": "2. Pokok Bahasan:ASDASDASDASDAFS"}]
2a4bb7df-da0a-4591-a773-912c08ac53e8	0afd64b9-a18d-4621-b0ad-b25523607ce5	5494ff9f-9012-4b95-bfc5-f2393468a438	Materi Didalam Module [Update ya]	Test Membuat Descripsion Di Material	<p id="docs-internal-guid-560ee48a-7fff-0762-ab72-19ef195a4775"><span>SIMANTIK</span></p><p><span>MATERI PEMAHAMAN BACAAN</span></p><p><span>Tes Kemampuan Akademik (TKA) Bahasa Indonesia — Materi Contoh untuk Pengujian Website</span></p><div align="center"><table><colgroup><col width="326"><col width="326"></colgroup><tbody><tr><td><p><span>Topik</span></p></td><td><p><span>Lingkungan dan Teknologi Hijau</span></p></td></tr><tr><td><p><span>Fokus kompetensi</span></p></td><td><p><span>Pemahaman tekstual, inferensial, evaluasi dan apresiasi</span></p></td></tr></tbody></table></div><h1><span>A. Tujuan Pembelajaran</span></h1><ul><li aria-level="1"><p role="presentation"><span>Mengidentifikasi informasi tersurat dan istilah penting dalam teks.</span></p></li><li aria-level="1"><p role="presentation"><span>Menentukan ide pokok serta hubungan makna antarkalimat dan antarparagraf.</span></p></li><li aria-level="1"><p role="presentation"><span>Menarik kesimpulan berdasarkan informasi tersirat.</span></p></li><li aria-level="1"><p role="presentation"><span>Menilai relevansi, kecukupan, dan ketepatan informasi yang disampaikan penulis.</span></p></li></ul><h1><span>B. Materi Inti: Memahami Gagasan dalam Teks Informasi</span></h1><p><span>Teks informasi menyajikan fakta, konsep, atau penjelasan mengenai suatu topik. Untuk memahami teks secara menyeluruh, pembaca tidak cukup hanya menemukan kata atau kalimat tertentu. Pembaca juga perlu mengenali hubungan antargagasan, membedakan fakta dan opini, serta menyusun kesimpulan berdasarkan bukti yang tersedia.</span></p><p><span>Salah satu cara membaca secara terarah adalah memperhatikan gagasan utama setiap paragraf. Gagasan utama merupakan inti pembahasan, sedangkan gagasan pendukung berfungsi menjelaskan, memberikan contoh, atau memperkuat inti tersebut. Gagasan utama dapat terletak di awal, akhir, atau tersirat di beberapa bagian paragraf.</span></p><h1><span>C. Bacaan: Teknologi Hijau dan Masa Depan Lingkungan</span></h1><p><span>Perubahan iklim menjadi tantangan yang semakin nyata bagi kehidupan manusia. Peningkatan emisi gas rumah kaca, pembukaan hutan, dan penggunaan energi fosil menyebabkan suhu bumi meningkat. Dampaknya dapat terlihat melalui cuaca ekstrem, perubahan pola musim, serta naiknya permukaan air laut. Keadaan tersebut menunjukkan bahwa perlindungan lingkungan tidak dapat hanya mengandalkan kebiasaan lama. Diperlukan inovasi yang mampu mengurangi tekanan terhadap alam sekaligus mendukung kebutuhan masyarakat.</span></p><p><span>Salah satu pendekatan yang dapat dilakukan adalah penerapan teknologi hijau. Istilah tersebut merujuk pada teknologi yang dirancang untuk mengurangi dampak negatif terhadap lingkungan. Contohnya ialah panel surya yang mengubah energi matahari menjadi listrik dan turbin angin yang memanfaatkan pergerakan udara. Kedua teknologi itu dapat membantu mengurangi ketergantungan pada bahan bakar fosil. Selain menghasilkan energi, teknologi hijau juga diterapkan dalam pengelolaan air, pengolahan sampah, transportasi, dan kegiatan pertanian.</span></p><p><span>Meskipun menawarkan manfaat, penerapan teknologi hijau tidak selalu mudah. Pembangunan fasilitas energi terbarukan membutuhkan biaya awal yang relatif besar. Di sejumlah wilayah, ketersediaan tenaga ahli dan infrastruktur pendukung juga masih terbatas. Namun, kendala tersebut bukan alasan untuk menghentikan pengembangan. Pemerintah, dunia usaha, lembaga pendidikan, dan masyarakat dapat bekerja sama melalui penelitian, penyediaan pelatihan, serta kebijakan yang mendorong penggunaan teknologi ramah lingkungan.</span></p><p><span>Pada akhirnya, keberhasilan teknologi hijau tidak hanya ditentukan oleh kecanggihan alat yang digunakan. Perubahan perilaku masyarakat tetap diperlukan, misalnya menghemat listrik, menggunakan transportasi umum, memilah sampah, dan mengurangi barang sekali pakai. Teknologi akan memberikan hasil lebih besar apabila didukung kebiasaan yang bertanggung jawab. Dengan demikian, upaya menjaga lingkungan merupakan pekerjaan bersama yang perlu dilakukan secara konsisten.</span></p><h1><span>D. Istilah Penting</span></h1><div align="center"><table><colgroup><col width="326"><col width="326"></colgroup><tbody><tr><td><p><span>Istilah</span></p></td><td><p><span>Makna dalam konteks bacaan</span></p></td></tr><tr><td><p><span>Emisi</span></p></td><td><p><span>zat, energi, atau komponen yang dilepaskan ke lingkungan; dalam bacaan ini merujuk pada gas yang dilepaskan ke atmosfer.</span></p></td></tr><tr><td><p><span>Energi terbarukan</span></p></td><td><p><span>energi yang berasal dari sumber alam yang dapat pulih secara alami, seperti matahari dan angin.</span></p></td></tr><tr><td><p><span>Infrastruktur</span></p></td><td><p><span>sarana dan prasarana dasar yang mendukung suatu kegiatan atau layanan.</span></p></td></tr><tr><td><p><span>Teknologi hijau</span></p></td><td><p><span>teknologi yang dirancang untuk mengurangi dampak negatif terhadap lingkungan.</span></p></td></tr></tbody></table></div><h1><span>E. Strategi Membaca</span></h1><ol><li aria-level="1"><p role="presentation"><span>Temukan topik: </span><span>Perhatikan judul dan kata-kata yang sering muncul.</span></p></li><li aria-level="1"><p role="presentation"><span>Tentukan gagasan utama: </span><span>Tanyakan: hal terpenting apa yang dibahas dalam paragraf ini?</span></p></li><li aria-level="1"><p role="presentation"><span>Cari bukti pendukung: </span><span>Tandai fakta, contoh, alasan, atau penjelasan yang memperkuat gagasan utama.</span></p></li><li aria-level="1"><p role="presentation"><span>Hubungkan antarparagraf: </span><span>Perhatikan kata penghubung seperti 'meskipun', 'namun', 'oleh karena itu', dan 'dengan demikian'.</span></p></li><li aria-level="1"><p role="presentation"><span>Buat kesimpulan: </span><span>Simpulkan isi berdasarkan informasi dalam teks, bukan dugaan di luar teks.</span></p></li></ol><h1><span>F. Latihan Pemahaman</span></h1><p><span>Bacalah kembali teks pada bagian C, kemudian jawablah pertanyaan berikut.</span></p><p><span>1. Apa gagasan utama paragraf kedua?</span></p><ul><li aria-level="1"><p role="presentation"><span>A. Teknologi hijau hanya digunakan untuk menghasilkan listrik.</span></p></li><li aria-level="1"><p role="presentation"><span>B. Teknologi hijau memiliki beragam penerapan untuk mengurangi dampak lingkungan.</span></p></li><li aria-level="1"><p role="presentation"><span>C. Panel surya merupakan teknologi yang paling murah.</span></p></li><li aria-level="1"><p role="presentation"><span>D. Pengelolaan sampah tidak berkaitan dengan teknologi hijau.</span></p></li><li aria-level="1"><p role="presentation"><span>E. Energi fosil tidak lagi digunakan oleh masyarakat.</span></p></li></ul><p><span>2. Berdasarkan bacaan, mengapa penerapan teknologi hijau menghadapi kendala?</span></p><ul><li aria-level="1"><p role="presentation"><span>A. Masyarakat tidak membutuhkan energi.</span></p></li><li aria-level="1"><p role="presentation"><span>B. Semua teknologi hijau menghasilkan polusi.</span></p></li><li aria-level="1"><p role="presentation"><span>C. Biaya awal, tenaga ahli, dan infrastruktur masih menjadi tantangan.</span></p></li><li aria-level="1"><p role="presentation"><span>D. Pemerintah melarang penelitian teknologi.</span></p></li><li aria-level="1"><p role="presentation"><span>E. Sumber energi matahari dan angin tidak tersedia.</span></p></li></ul><p><span>3. Pilihlah semua pernyataan yang sesuai dengan isi bacaan.</span></p><ul><li aria-level="1"><p role="presentation"><span>A. Panel surya memanfaatkan energi matahari.</span></p></li><li aria-level="1"><p role="presentation"><span>B. Teknologi hijau hanya diterapkan dalam bidang transportasi.</span></p></li><li aria-level="1"><p role="presentation"><span>C. Kerja sama berbagai pihak dapat mendukung penerapan teknologi hijau.</span></p></li><li aria-level="1"><p role="presentation"><span>D. Perubahan perilaku masyarakat tidak diperlukan apabila teknologi sudah tersedia.</span></p></li><li aria-level="1"><p role="presentation"><span>E. Mengurangi barang sekali pakai merupakan salah satu contoh perilaku bertanggung jawab.</span></p></li></ul><p><span>4. Kata 'Namun' pada paragraf ketiga berfungsi untuk ....</span></p><ul><li aria-level="1"><p role="presentation"><span>A. menunjukkan pertentangan terhadap gagasan sebelumnya.</span></p></li><li aria-level="1"><p role="presentation"><span>B. menyatakan urutan waktu.</span></p></li><li aria-level="1"><p role="presentation"><span>C. memberikan definisi istilah.</span></p></li><li aria-level="1"><p role="presentation"><span>D. menyatakan tujuan kegiatan.</span></p></li><li aria-level="1"><p role="presentation"><span>E. mengulang contoh yang sama.</span></p></li></ul><p><span>5. Apakah simpulan berikut didukung oleh bacaan? Berikan alasan singkat.</span></p><ul><li aria-level="1"><p role="presentation"><span>“Teknologi hijau akan memberikan manfaat yang lebih besar apabila disertai perubahan perilaku masyarakat.”</span></p></li></ul><h1><span>G. Kunci Jawaban dan Pembahasan</span></h1><p><span>1. B — </span><span>Paragraf kedua menjelaskan pengertian teknologi hijau dan berbagai contoh penerapannya, tidak terbatas pada produksi listrik.</span></p><p><span>2. C — </span><span>Paragraf ketiga menyebutkan biaya awal, keterbatasan tenaga ahli, dan infrastruktur sebagai kendala.</span></p><p><span>3. A, C, dan E — </span><span>Panel surya memanfaatkan matahari; kolaborasi berbagai pihak mendukung pengembangan; dan mengurangi barang sekali pakai termasuk perilaku bertanggung jawab. Pernyataan B dan D bertentangan dengan bacaan.</span></p><p><span>4. A — </span><span>Kata 'Namun' menghubungkan dua gagasan yang berlawanan: adanya kendala dan perlunya tetap mengembangkan teknologi hijau.</span></p><p><span>5. Didukung — </span><span>Paragraf terakhir menyatakan bahwa teknologi akan memberikan hasil lebih besar apabila didukung kebiasaan yang bertanggung jawab.</span></p><h1><span>H. Rangkuman</span></h1><p><span>Pemahaman bacaan mencakup kemampuan menemukan informasi tersurat, mengenali gagasan utama, memahami hubungan antargagasan, menarik kesimpulan, serta menilai isi teks. Dalam membaca teks informasi, gunakan bukti yang benar-benar tersedia di dalam bacaan. Teknologi hijau menjadi contoh topik yang dapat dianalisis melalui ketiga kompetensi utama TKA: pemahaman tekstual, pemahaman inferensial, serta evaluasi dan apresiasi.</span></p>	document	0	draft	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-09-15 13:07:38.193468+00	2026-11-07 08:15:37.75587+00	\N	sma	[]	[]
6a1f24e6-afd5-4b1d-9b8c-3d9542b8455c	0bc056d6-1d45-4607-aeff-a1322895d827	50ce66b9-98af-491e-96e8-7f07110a41b2	Matematika Wajib	paspdaspdp	Macam Gabetul Aja Budak Ni	document	1	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-09-19 03:19:04.9946+00	2026-11-08 08:14:07.151325+00	\N	sma	[]	[]
13ab86e7-25e8-4120-b84d-01f732abe4e9	0bc056d6-1d45-4607-aeff-a1322895d827	50ce66b9-98af-491e-96e8-7f07110a41b2	Coba	asdadsasd	<div align="center">Cobaaaa&nbsp; Tengah</div><div align="center"><img src="https://pub-6640a1324ad84f30ae0a025294f08244.r2.dev/materials/1790499424456-tb2gfn052e.jpg" alt="hooo.jpg" class="max-w-full h-auto rounded-xl my-4"><br></div><div><br></div>	document	1	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-09-27 08:57:17.636781+00	2026-11-08 08:14:07.151325+00	\N	sma	[]	[]
\.


--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.news (id, title, slug, content, thumbnail_url, status, published_at, created_by, updated_by, created_at, updated_at, deleted_at) FROM stdin;
e7b867eb-c853-454b-80a2-ab856226db1c	Update News	news	update news	https://pub-6640a1324ad84f30ae0a025294f08244.r2.dev/news/1790178650165-i063fh0x7nh.jpg	published	2026-09-23 15:51:40.94256+00	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-09-19 12:04:11.692898+00	2026-09-23 15:51:40.996976+00	\N
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notifications (id, user_id, title, message, type, link, is_read, created_at) FROM stdin;
\.


--
-- Data for Name: otp_codes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.otp_codes (id, user_id, purpose, code_hash, expires_at, attempts, max_attempts, verified_at, created_at) FROM stdin;
44681c3f-ecb5-43ad-8971-367835435ff9	c19b6849-9c8c-4b5b-8547-ea7d93f87b23	REGISTER	$2a$10$GOLqdCQKNpv22JLdMAU.Ouc8ucO00QK61hxcTTF/i3utlY2WCZdcu	2026-09-10 01:51:05.410054+00	0	5	\N	2026-09-10 01:41:05.435243+00
121a31ec-f4c3-407d-a142-0c99b0f2ad14	a28d241d-e428-406a-903d-150f3d31aade	REGISTER	$2a$10$EhA7BhHLsFOU12ePiUH5D.1iVM3h3eaDMVHgFy0W6wNmX8RO2g9Ze	2026-09-12 16:16:27.711843+00	0	5	\N	2026-09-12 16:06:27.761478+00
9ba959cd-04e9-4443-8c86-b7af344f8262	f125ef5d-2c6f-4187-b02d-a50465b62803	REGISTER	$2a$10$NSPxcSl1Zut9R5dVEwDc2eiWooYdOZ/RxRnXBWFOlgHeQ5a.GhYq6	2026-09-13 08:16:00.253742+00	1	5	2026-09-13 08:09:21.139448+00	2026-09-13 08:06:00.663197+00
74d2b4c3-f9c6-4696-b9b2-05e7f52bf504	f125ef5d-2c6f-4187-b02d-a50465b62803	PASSWORD_RESET	$2a$10$i3kGp372HF2AKKf2.qberOIkIw3wrpwmIpQrcEuJIQYyExdIk1IeS	2026-09-13 09:00:42.629767+00	0	5	\N	2026-09-13 08:50:42.780415+00
1649a3b5-eba7-4fa0-b558-4aaa28ef2574	60d9996e-1d82-41b9-b8c4-4642acdd4c08	REGISTER	$2a$10$vU3zmkyKJ4UTIXHiSjk1ruQzZcQPPL2hsfsd.XuhpwnpcIZGOWMZy	2026-09-13 11:18:57.954163+00	1	5	2026-09-13 11:10:32.988128+00	2026-09-13 11:08:58.422103+00
58d1b3f6-8cc4-4ac8-8c35-cb60dfee14d1	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	REGISTER	$2a$10$4xcCeT.u7EmC.UGrkAMCwOvZ8BFlG8rTIH62FzwsYQDXM1RHk59he	2026-09-15 10:16:03.562497+00	1	5	2026-09-15 10:06:36.613228+00	2026-09-15 10:06:03.591421+00
680fe694-1199-49ef-9221-1cf20849d616	bbab3c0e-fa43-40fd-8dde-e65f10309e95	REGISTER	$2a$10$bTrUqXglD2x.SgRQsdxNbeMscn06UZOUCzec/5GjmZROTlAOyb7g2	2026-09-17 05:27:37.123528+00	1	5	2026-09-17 05:18:10.117506+00	2026-09-17 05:17:37.190122+00
b4a7aff8-bd4e-4ae0-88f7-0e98fcafbdd3	b121da5d-5efd-44ea-8630-65bd2c7a9403	REGISTER	$2a$10$uVBatk8UsZ9GxhZgRq4adeFHpYlx7cvcoOzj6pXn3OOmbhrp8tPDO	2026-11-08 10:24:14.297859+00	0	5	\N	2026-11-08 10:14:14.362399+00
657b7dab-30b5-47d1-87d7-17fb6741a8f7	4767ff8e-f884-4ade-baef-bbd6fef2ee15	REGISTER	$2a$10$oAMconvaBGNKZhoowI6MHuZrLc2x8A3XVGiVeHOQy9QvQ6v5deyuW	2026-11-08 10:57:40.306996+00	1	5	2026-11-08 10:47:53.670952+00	2026-11-08 10:47:40.35857+00
2ac143fd-b536-49da-a568-7bb97bbe8e1d	fc4baf98-26f0-45e0-89b9-ddd23d0f3bd1	REGISTER	$2a$10$CSuZFaybjQO8tIYTjJFqceJfecZ2rQTNmrO7XfDXpSn8vBKi5.6/e	2026-11-08 13:22:32.417151+00	1	5	2026-11-08 13:13:10.649565+00	2026-11-08 13:12:32.466938+00
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.password_reset_tokens (id, user_id, token_hash, expires_at, used_at, created_at) FROM stdin;
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.permissions (id, name, resource, action, description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: practice_answers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.practice_answers (id, practice_id, question_id, selected_option_id, answer_data, is_correct, score, answered_at, created_at) FROM stdin;
e7296cfe-2b48-4b7f-81c4-7d553ed94c2e	81e8bd79-5bcc-41cc-b41c-2969ac141e66	2a6cfb98-939b-481c-bed8-b0577e0c02b6	e6bfe245-c8b4-4935-8d92-222deeed4dc3	"e6bfe245-c8b4-4935-8d92-222deeed4dc3"	f	0.00	2026-09-27 07:44:42.62194+00	2026-09-27 07:44:42.812797+00
f0d889c1-e8c9-41ca-885c-b3227c79a903	81e8bd79-5bcc-41cc-b41c-2969ac141e66	d3ea9b84-8c35-42df-8d9a-586efd7f94c4	48372b9b-04f8-4aee-90f0-18195c8dd733	"48372b9b-04f8-4aee-90f0-18195c8dd733"	t	1.00	2026-09-27 07:44:43.150463+00	2026-09-27 07:44:43.298957+00
9ceaa43e-b70b-4a84-b4a4-6ec0c791d54b	1b6091ca-c081-43d2-8769-e9c2ff84acf4	2a6cfb98-939b-481c-bed8-b0577e0c02b6	e6bfe245-c8b4-4935-8d92-222deeed4dc3	"e6bfe245-c8b4-4935-8d92-222deeed4dc3"	f	0.00	2026-09-27 08:02:39.926141+00	2026-09-27 08:02:40.018752+00
9aa2a065-e5b1-49a2-8f29-6e40b4f012f9	1b6091ca-c081-43d2-8769-e9c2ff84acf4	d3ea9b84-8c35-42df-8d9a-586efd7f94c4	48372b9b-04f8-4aee-90f0-18195c8dd733	"48372b9b-04f8-4aee-90f0-18195c8dd733"	t	1.00	2026-09-27 08:02:40.605143+00	2026-09-27 08:02:40.695148+00
837ab832-5d1c-4c68-a6b1-83aa61168949	f005efde-cf52-4f01-b6f6-9576468a8b4f	2a6cfb98-939b-481c-bed8-b0577e0c02b6	e6bfe245-c8b4-4935-8d92-222deeed4dc3	"e6bfe245-c8b4-4935-8d92-222deeed4dc3"	f	0.00	2026-09-27 08:07:55.649483+00	2026-09-27 08:07:55.764373+00
18259cab-28b9-442a-96ac-8c7ff76739e7	f005efde-cf52-4f01-b6f6-9576468a8b4f	d3ea9b84-8c35-42df-8d9a-586efd7f94c4	c99880ab-521b-46d6-a8d1-ebf241f1bd0a	"c99880ab-521b-46d6-a8d1-ebf241f1bd0a"	t	1.00	2026-09-27 08:07:56.370737+00	2026-09-27 08:07:56.476463+00
0bca7af9-257e-48d8-9762-aa2af0a2486f	9c1950ee-86a7-4cc0-a170-ff9659faf7a0	2a6cfb98-939b-481c-bed8-b0577e0c02b6	633bf72e-f68e-4a4c-b4ff-37e4388fdaaf	"633bf72e-f68e-4a4c-b4ff-37e4388fdaaf"	f	0.00	2026-09-27 08:12:56.905276+00	2026-09-27 08:12:56.941856+00
ded21ed2-b0c1-4b80-a35b-8c4b335a01aa	2ba706ed-9718-4fb0-b9dc-ba5b901c1fdc	2a6cfb98-939b-481c-bed8-b0577e0c02b6	e6bfe245-c8b4-4935-8d92-222deeed4dc3	"e6bfe245-c8b4-4935-8d92-222deeed4dc3"	f	0.00	2026-09-27 08:13:17.820837+00	2026-09-27 08:13:17.856888+00
487d51bc-ed45-4ebc-b4ef-357711a86c6e	2ba706ed-9718-4fb0-b9dc-ba5b901c1fdc	d3ea9b84-8c35-42df-8d9a-586efd7f94c4	\N	{"48372b9b-04f8-4aee-90f0-18195c8dd733": "TIDAK_SETUJU", "b3aa9a0d-47ed-40ff-ab54-8f5284a0cba8": "TIDAK_SETUJU", "b3cbf996-a2c6-421d-9958-fc39c5963f57": "TIDAK_SETUJU", "c99880ab-521b-46d6-a8d1-ebf241f1bd0a": "SETUJU"}	f	0.00	2026-09-27 08:13:18.221304+00	2026-09-27 08:13:18.257397+00
3bdf96e4-0792-4fc6-93d2-bc8bcf0126fe	1ccc4194-b9a8-4799-8051-d9f37a3209c1	2a6cfb98-939b-481c-bed8-b0577e0c02b6	f3f9b113-23c6-42bb-b0dd-a193b5bcf46f	"f3f9b113-23c6-42bb-b0dd-a193b5bcf46f"	t	1.00	2026-09-27 08:15:21.821968+00	2026-09-27 08:15:21.921946+00
82d6ac51-31c1-4f51-ae0f-8f87495e665e	1ccc4194-b9a8-4799-8051-d9f37a3209c1	d3ea9b84-8c35-42df-8d9a-586efd7f94c4	\N	{"48372b9b-04f8-4aee-90f0-18195c8dd733": "TIDAK_SETUJU", "b3aa9a0d-47ed-40ff-ab54-8f5284a0cba8": "TIDAK_SETUJU", "b3cbf996-a2c6-421d-9958-fc39c5963f57": "TIDAK_SETUJU", "c99880ab-521b-46d6-a8d1-ebf241f1bd0a": "SETUJU"}	f	0.00	2026-09-27 08:15:22.275529+00	2026-09-27 08:15:22.322129+00
64151adf-5d02-4bf5-8843-09577dd02411	12a847a5-abfd-49e9-9ac1-48c6a7d2368b	7d50fc93-927c-4e5e-9c20-f5c33aa158be	\N	{"05bc63cc-3107-4c1c-9752-c47d16358713": "SETUJU", "2f98ac02-bc99-4770-98d9-689c6025c93b": "SETUJU", "457f0736-8bdd-4af8-8724-ed521b1d3397": "SETUJU", "527678a1-1eab-4836-b180-224e72ff8ea1": "SETUJU"}	f	0.00	2026-09-27 08:26:53.893866+00	2026-09-27 08:26:54.042409+00
2755d8f2-487f-4862-b469-7851bfe25d31	12a847a5-abfd-49e9-9ac1-48c6a7d2368b	7df26d31-e0e4-4fb1-9a18-9821397c5f64	\N	{"288e21bd-c37c-45ec-b752-dd61e83ea470": "TIDAK_TEPAT", "67c02df0-6ff1-4cfe-a93c-d9a1d9bcee39": "TIDAK_TEPAT", "888013ed-49aa-4303-82d7-2eff7999c8b0": "TIDAK_TEPAT", "931a801f-dc97-48c8-b0c1-1f1fde2ead0a": "TIDAK_TEPAT"}	f	0.00	2026-09-27 08:26:54.615773+00	2026-09-27 08:26:54.759193+00
1ca8e57a-9484-4780-8173-964c411fd7d4	6e943a25-d282-4082-99d7-0af185e23b62	7d50fc93-927c-4e5e-9c20-f5c33aa158be	\N	{"05bc63cc-3107-4c1c-9752-c47d16358713": "SETUJU", "2f98ac02-bc99-4770-98d9-689c6025c93b": "SETUJU", "457f0736-8bdd-4af8-8724-ed521b1d3397": "SETUJU", "527678a1-1eab-4836-b180-224e72ff8ea1": "SETUJU"}	t	1.00	2026-09-27 08:32:16.972181+00	2026-09-27 08:32:17.07053+00
5982f829-2ed2-4d3e-875a-82730cb03e09	6e943a25-d282-4082-99d7-0af185e23b62	7df26d31-e0e4-4fb1-9a18-9821397c5f64	\N	{"288e21bd-c37c-45ec-b752-dd61e83ea470": "TIDAK_TEPAT", "67c02df0-6ff1-4cfe-a93c-d9a1d9bcee39": "TIDAK_TEPAT", "888013ed-49aa-4303-82d7-2eff7999c8b0": "TIDAK_TEPAT", "931a801f-dc97-48c8-b0c1-1f1fde2ead0a": "TIDAK_TEPAT"}	t	1.00	2026-09-27 08:32:17.581254+00	2026-09-27 08:32:17.684357+00
94774f00-03c7-4c95-84ca-7f449d9f100a	a5518990-f9fa-4241-9068-77d30b3b0455	7d50fc93-927c-4e5e-9c20-f5c33aa158be	\N	{"05bc63cc-3107-4c1c-9752-c47d16358713": "SETUJU", "2f98ac02-bc99-4770-98d9-689c6025c93b": "TIDAK_SETUJU", "457f0736-8bdd-4af8-8724-ed521b1d3397": "TIDAK_SETUJU", "527678a1-1eab-4836-b180-224e72ff8ea1": "SETUJU"}	f	0.00	2026-09-28 07:18:13.569073+00	2026-09-28 07:18:13.572301+00
166fde08-7ef5-4384-b091-5461e3ebcf5c	a5518990-f9fa-4241-9068-77d30b3b0455	7df26d31-e0e4-4fb1-9a18-9821397c5f64	\N	{"288e21bd-c37c-45ec-b752-dd61e83ea470": "TIDAK_TEPAT", "67c02df0-6ff1-4cfe-a93c-d9a1d9bcee39": "TEPAT", "888013ed-49aa-4303-82d7-2eff7999c8b0": "TIDAK_TEPAT", "931a801f-dc97-48c8-b0c1-1f1fde2ead0a": "TIDAK_TEPAT"}	f	0.00	2026-09-28 07:18:13.59098+00	2026-09-28 07:18:13.593888+00
fbd97f8a-7fe0-44e9-9f89-c914fac3740c	bc7417db-9b37-47cf-8748-1611a164b24d	7d50fc93-927c-4e5e-9c20-f5c33aa158be	\N	{"05bc63cc-3107-4c1c-9752-c47d16358713": "SETUJU", "2f98ac02-bc99-4770-98d9-689c6025c93b": "SETUJU", "457f0736-8bdd-4af8-8724-ed521b1d3397": "SETUJU", "527678a1-1eab-4836-b180-224e72ff8ea1": "SETUJU"}	t	1.00	2026-09-30 02:15:02.689504+00	2026-09-30 02:15:02.692263+00
8518005c-7f0e-400f-bd46-cd06b1fe1d64	bc7417db-9b37-47cf-8748-1611a164b24d	7df26d31-e0e4-4fb1-9a18-9821397c5f64	\N	{"288e21bd-c37c-45ec-b752-dd61e83ea470": "TEPAT", "67c02df0-6ff1-4cfe-a93c-d9a1d9bcee39": "TEPAT", "888013ed-49aa-4303-82d7-2eff7999c8b0": "TEPAT", "931a801f-dc97-48c8-b0c1-1f1fde2ead0a": "TEPAT"}	f	0.00	2026-09-30 02:15:02.707459+00	2026-09-30 02:15:02.709632+00
943a0b0a-d030-45f4-a4e5-2f1c30c8a98c	5a2a51cb-5621-43c1-bef7-5fffd1990f49	7d50fc93-927c-4e5e-9c20-f5c33aa158be	\N	{"05bc63cc-3107-4c1c-9752-c47d16358713": "SETUJU", "2f98ac02-bc99-4770-98d9-689c6025c93b": "SETUJU", "457f0736-8bdd-4af8-8724-ed521b1d3397": "SETUJU", "527678a1-1eab-4836-b180-224e72ff8ea1": "SETUJU"}	t	1.00	2026-09-30 02:18:22.259436+00	2026-09-30 02:18:22.26285+00
d494c7cd-a8c4-4dc9-ad71-fbee56a73304	5a2a51cb-5621-43c1-bef7-5fffd1990f49	7df26d31-e0e4-4fb1-9a18-9821397c5f64	\N	{"288e21bd-c37c-45ec-b752-dd61e83ea470": "TIDAK_TEPAT", "67c02df0-6ff1-4cfe-a93c-d9a1d9bcee39": "TIDAK_TEPAT", "888013ed-49aa-4303-82d7-2eff7999c8b0": "TIDAK_TEPAT", "931a801f-dc97-48c8-b0c1-1f1fde2ead0a": "TIDAK_TEPAT"}	t	1.00	2026-09-30 02:18:22.282376+00	2026-09-30 02:18:22.286375+00
38cc42af-ad49-4881-9a4c-e8d35959a07c	a181880e-7364-4066-9b99-bd77e7f5c404	88a3d3b8-2286-4894-a196-0765f1d9816e	05aa2aea-c168-4fc8-b302-01444e15474b	"05aa2aea-c168-4fc8-b302-01444e15474b"	t	1.00	2026-09-30 02:19:34.67262+00	2026-09-30 02:19:34.675089+00
3b49669e-3840-4b99-b825-ed2e55b478d3	04032bb3-262c-42a3-995e-fc4bf1593008	2a6cfb98-939b-481c-bed8-b0577e0c02b6	633bf72e-f68e-4a4c-b4ff-37e4388fdaaf	"633bf72e-f68e-4a4c-b4ff-37e4388fdaaf"	f	0.00	2026-09-30 02:20:48.717183+00	2026-09-30 02:20:48.720141+00
e89652a8-2f23-49a7-bf49-f8da71d26315	104da301-1e54-481f-9fda-24e05225a905	2a6cfb98-939b-481c-bed8-b0577e0c02b6	f3f9b113-23c6-42bb-b0dd-a193b5bcf46f	"f3f9b113-23c6-42bb-b0dd-a193b5bcf46f"	t	1.00	2026-09-30 02:35:54.254586+00	2026-09-30 02:35:54.25865+00
9796a577-ff94-427c-ba8f-7e30c826f880	8edaa5e9-f553-49e4-880a-3594fc638fc7	7d50fc93-927c-4e5e-9c20-f5c33aa158be	\N	{"2f98ac02-bc99-4770-98d9-689c6025c93b": "SETUJU", "527678a1-1eab-4836-b180-224e72ff8ea1": "SETUJU"}	f	0.00	2026-09-30 11:39:32.254551+00	2026-09-30 11:39:32.430871+00
c4c5aa43-d319-4761-912b-a269e905afb9	0332a377-f061-452c-bdcc-2bca7a1e65b3	7d50fc93-927c-4e5e-9c20-f5c33aa158be	\N	{"05bc63cc-3107-4c1c-9752-c47d16358713": "SETUJU", "2f98ac02-bc99-4770-98d9-689c6025c93b": "TIDAK_SETUJU", "457f0736-8bdd-4af8-8724-ed521b1d3397": "TIDAK_SETUJU", "527678a1-1eab-4836-b180-224e72ff8ea1": "SETUJU"}	f	0.00	2026-10-07 03:10:12.207198+00	2026-10-07 03:10:12.415258+00
5b420a12-5b8c-4f4a-877a-ac6c63448ca0	0332a377-f061-452c-bdcc-2bca7a1e65b3	7df26d31-e0e4-4fb1-9a18-9821397c5f64	\N	{"288e21bd-c37c-45ec-b752-dd61e83ea470": "TEPAT", "67c02df0-6ff1-4cfe-a93c-d9a1d9bcee39": "TEPAT", "888013ed-49aa-4303-82d7-2eff7999c8b0": "TEPAT", "931a801f-dc97-48c8-b0c1-1f1fde2ead0a": "TEPAT"}	f	0.00	2026-10-07 03:10:13.026769+00	2026-10-07 03:10:13.235157+00
dfc5fda3-d58a-4e6c-a8a5-c152880e2040	ca88633e-9d34-42d2-99ba-5330285712aa	f4e39d71-a83a-459d-82a5-dddbcc337f15	feafe5cb-4f71-4fad-a5b6-5b508d234032	"feafe5cb-4f71-4fad-a5b6-5b508d234032"	t	1.00	2026-10-21 08:28:35.650692+00	2026-10-21 08:28:35.815671+00
5c49dbf1-bb0c-4009-a272-e7ba66d9bf5c	ca88633e-9d34-42d2-99ba-5330285712aa	0d7e6daf-3575-4a61-840d-b66acd132f41	90474286-1c2f-4394-b9be-60a3d951700d	"90474286-1c2f-4394-b9be-60a3d951700d"	t	1.00	2026-10-21 08:28:36.469278+00	2026-10-21 08:28:36.630462+00
acc673b0-9ee7-4a0f-a0b4-955e65c458aa	ca88633e-9d34-42d2-99ba-5330285712aa	d5d155f9-933e-4171-a524-8a34a96996ec	f453167d-3bfb-437a-8c02-f911a1ecec46	"f453167d-3bfb-437a-8c02-f911a1ecec46"	f	0.00	2026-10-21 08:28:37.30112+00	2026-10-21 08:28:37.448906+00
55027616-3e26-4c53-a2de-b4f0f115b629	ca88633e-9d34-42d2-99ba-5330285712aa	dd8b59b2-aed2-4227-943a-4d79e7f6d5e4	\N	{"2ddc69cd-5629-4064-9fe3-e10e4b0bebf4": "SALAH", "473870b3-2b7e-4270-98e5-775959049c0e": "SALAH", "9feeb932-0041-4afa-93f3-a0e7f3bc0cf0": "BENAR"}	t	1.00	2026-10-21 08:28:38.111516+00	2026-10-21 08:28:38.273263+00
c7eb739f-65a3-4c4b-a871-811ae731eb07	7a8d7f3a-6f17-4957-b0f7-de1638860bd1	d5d155f9-933e-4171-a524-8a34a96996ec	\N	["5e4ff48b-0d1c-4b63-b524-e773a5934941", "f616019f-74e4-41dc-b878-ed3f4f519fd6"]	t	1.00	2026-10-21 08:50:52.441186+00	2026-10-21 08:50:52.568427+00
9ca10ede-2a11-4aab-9def-a12a62002a48	7a8d7f3a-6f17-4957-b0f7-de1638860bd1	dd8b59b2-aed2-4227-943a-4d79e7f6d5e4	\N	{"2ddc69cd-5629-4064-9fe3-e10e4b0bebf4": "SALAH", "473870b3-2b7e-4270-98e5-775959049c0e": "SALAH", "9feeb932-0041-4afa-93f3-a0e7f3bc0cf0": "BENAR"}	t	1.00	2026-10-21 08:50:52.892423+00	2026-10-21 08:50:53.013455+00
f29a059c-27e0-4118-a63d-bd1b073a44a3	7a8d7f3a-6f17-4957-b0f7-de1638860bd1	f4e39d71-a83a-459d-82a5-dddbcc337f15	feafe5cb-4f71-4fad-a5b6-5b508d234032	"feafe5cb-4f71-4fad-a5b6-5b508d234032"	t	1.00	2026-10-21 08:50:53.501522+00	2026-10-21 08:50:53.673748+00
c76bc09d-9013-48cf-9a46-8d6508bdb8ee	7a8d7f3a-6f17-4957-b0f7-de1638860bd1	0d7e6daf-3575-4a61-840d-b66acd132f41	90474286-1c2f-4394-b9be-60a3d951700d	"90474286-1c2f-4394-b9be-60a3d951700d"	t	1.00	2026-10-21 08:50:54.316275+00	2026-10-21 08:50:54.490891+00
25a89c51-f5c5-4a29-8e71-a622ee72c73d	2fa47485-8509-4612-9c44-7e8d77c258f6	f4e39d71-a83a-459d-82a5-dddbcc337f15	feafe5cb-4f71-4fad-a5b6-5b508d234032	"feafe5cb-4f71-4fad-a5b6-5b508d234032"	t	1.00	2026-11-08 10:16:31.883998+00	2026-11-08 10:16:31.950759+00
68117261-bb79-4b36-adba-e37b489630bb	2fa47485-8509-4612-9c44-7e8d77c258f6	0d7e6daf-3575-4a61-840d-b66acd132f41	d9904aaf-041e-4d2c-83bd-956d2207dea2	"d9904aaf-041e-4d2c-83bd-956d2207dea2"	f	0.00	2026-11-08 10:16:32.341447+00	2026-11-08 10:16:32.404778+00
8f23fab4-ff55-47a9-b9ba-f921635a959b	2fa47485-8509-4612-9c44-7e8d77c258f6	d5d155f9-933e-4171-a524-8a34a96996ec	\N	["5e4ff48b-0d1c-4b63-b524-e773a5934941", "f453167d-3bfb-437a-8c02-f911a1ecec46"]	f	0.00	2026-11-08 10:16:32.787044+00	2026-11-08 10:16:32.85049+00
ecdf0bb3-555b-40f4-8618-1ec3e484f963	2fa47485-8509-4612-9c44-7e8d77c258f6	dd8b59b2-aed2-4227-943a-4d79e7f6d5e4	\N	{"2ddc69cd-5629-4064-9fe3-e10e4b0bebf4": "BENAR", "473870b3-2b7e-4270-98e5-775959049c0e": "BENAR", "9feeb932-0041-4afa-93f3-a0e7f3bc0cf0": "BENAR"}	f	0.00	2026-11-08 10:16:33.232157+00	2026-11-08 10:16:33.295547+00
0bd954ae-9328-4dac-8c07-f2abf6ad2263	514cdd60-823a-4cc8-83b8-86e0ba1bca0b	f4e39d71-a83a-459d-82a5-dddbcc337f15	feafe5cb-4f71-4fad-a5b6-5b508d234032	"feafe5cb-4f71-4fad-a5b6-5b508d234032"	t	1.00	2026-11-08 10:21:39.420331+00	2026-11-08 10:21:39.477567+00
49eefcc7-860f-4a6f-8c78-6c2fc440b271	514cdd60-823a-4cc8-83b8-86e0ba1bca0b	0d7e6daf-3575-4a61-840d-b66acd132f41	d9904aaf-041e-4d2c-83bd-956d2207dea2	"d9904aaf-041e-4d2c-83bd-956d2207dea2"	f	0.00	2026-11-08 10:21:39.826038+00	2026-11-08 10:21:39.882934+00
5f0567c7-2af9-401a-be31-f39687f2eff1	514cdd60-823a-4cc8-83b8-86e0ba1bca0b	d5d155f9-933e-4171-a524-8a34a96996ec	\N	["00bbd0ba-fae4-45f5-a4b6-4a2d1783da32"]	f	0.00	2026-11-08 10:21:40.230641+00	2026-11-08 10:21:40.287454+00
2a3d6cd5-20ab-4843-8202-d2a61a686ee3	514cdd60-823a-4cc8-83b8-86e0ba1bca0b	dd8b59b2-aed2-4227-943a-4d79e7f6d5e4	\N	{"2ddc69cd-5629-4064-9fe3-e10e4b0bebf4": "BENAR", "473870b3-2b7e-4270-98e5-775959049c0e": "BENAR", "9feeb932-0041-4afa-93f3-a0e7f3bc0cf0": "BENAR"}	f	0.00	2026-11-08 10:21:40.634725+00	2026-11-08 10:21:40.691705+00
699ba226-46cb-4989-a5b9-c9a1c4c2f4a6	e5161a8c-e199-42ec-a5a1-870d16ec1f03	f4e39d71-a83a-459d-82a5-dddbcc337f15	feafe5cb-4f71-4fad-a5b6-5b508d234032	"feafe5cb-4f71-4fad-a5b6-5b508d234032"	t	1.00	2026-11-08 13:18:37.04589+00	2026-11-08 13:18:37.132058+00
7e921308-662e-4067-8934-e42e4f4558c2	e5161a8c-e199-42ec-a5a1-870d16ec1f03	0d7e6daf-3575-4a61-840d-b66acd132f41	90474286-1c2f-4394-b9be-60a3d951700d	"90474286-1c2f-4394-b9be-60a3d951700d"	t	1.00	2026-11-08 13:18:37.468725+00	2026-11-08 13:18:37.549704+00
5daeb176-f321-425c-aec5-4e2d628d87a7	e5161a8c-e199-42ec-a5a1-870d16ec1f03	d5d155f9-933e-4171-a524-8a34a96996ec	\N	["5e4ff48b-0d1c-4b63-b524-e773a5934941"]	f	0.00	2026-11-08 13:18:37.88469+00	2026-11-08 13:18:37.96573+00
4f12bc2b-e31f-479c-9f85-ec1fd2d27b00	e5161a8c-e199-42ec-a5a1-870d16ec1f03	dd8b59b2-aed2-4227-943a-4d79e7f6d5e4	\N	{"2ddc69cd-5629-4064-9fe3-e10e4b0bebf4": "SALAH", "473870b3-2b7e-4270-98e5-775959049c0e": "BENAR", "9feeb932-0041-4afa-93f3-a0e7f3bc0cf0": "BENAR"}	f	0.00	2026-11-08 13:18:38.298108+00	2026-11-08 13:18:38.379452+00
\.


--
-- Data for Name: practice_package_questions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.practice_package_questions (package_id, question_id, display_order, created_at) FROM stdin;
a473c70d-73f1-4733-801d-52476f7d2696	88a3d3b8-2286-4894-a196-0765f1d9816e	1	2026-09-27 05:05:02.762326+00
ab87a7bd-2178-4e3f-9e70-a3ac56d5afc4	2a6cfb98-939b-481c-bed8-b0577e0c02b6	1	2026-09-27 05:44:48.681108+00
4073929f-aac4-474e-af21-56b8e48ac1c5	7d50fc93-927c-4e5e-9c20-f5c33aa158be	1	2026-09-27 08:26:23.48376+00
4073929f-aac4-474e-af21-56b8e48ac1c5	7df26d31-e0e4-4fb1-9a18-9821397c5f64	2	2026-09-27 08:26:23.48376+00
6622a443-9a8a-4647-98f0-4436b08278f5	f4e39d71-a83a-459d-82a5-dddbcc337f15	1	2026-10-21 08:25:58.261667+00
6622a443-9a8a-4647-98f0-4436b08278f5	0d7e6daf-3575-4a61-840d-b66acd132f41	2	2026-10-21 08:25:58.261667+00
6622a443-9a8a-4647-98f0-4436b08278f5	d5d155f9-933e-4171-a524-8a34a96996ec	3	2026-10-21 08:25:58.261669+00
6622a443-9a8a-4647-98f0-4436b08278f5	dd8b59b2-aed2-4227-943a-4d79e7f6d5e4	4	2026-10-21 08:25:58.261669+00
ccf3adca-41ab-4f81-9ae7-89165fdbdb4c	08818873-e533-483b-b5d5-42190b4434d2	1	2026-11-08 13:25:03.611423+00
ccf3adca-41ab-4f81-9ae7-89165fdbdb4c	faa6ca56-c2f2-43b6-92a2-887ab3c9e78a	2	2026-11-08 13:25:03.611423+00
\.


--
-- Data for Name: practice_packages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.practice_packages (id, title, description, competency_id, jenjang, total_questions, status, created_by, updated_by, created_at, updated_at, deleted_at) FROM stdin;
ab87a7bd-2178-4e3f-9e70-a3ac56d5afc4	TEST PRACTIKE	ASDASD	50ce66b9-98af-491e-96e8-7f07110a41b2	sma	1	published	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-09-27 05:43:06.793291+00	2026-09-27 08:24:52.86324+00	\N
4073929f-aac4-474e-af21-56b8e48ac1c5	Tester Module	adsasdasd	\N	sma	2	published	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-09-27 08:25:28.304337+00	2026-09-27 08:26:30.96251+00	\N
9a2bae92-10c4-425d-b03c-49cdc7bde4f4	pembuatan stimulus	asdasd	50ce66b9-98af-491e-96e8-7f07110a41b2	sma	0	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-10-07 05:38:20.094241+00	2026-10-07 05:38:20.094241+00	2026-10-21 07:26:21.229219+00
2e0c4656-c227-457a-9164-dac57ef0a96f	Latihan	Latihan ini Menjelaskan Kebenaran	\N	sma	0	draft	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-10-21 07:26:49.594674+00	2026-10-21 08:10:59.285924+00	2026-10-21 08:16:12.120158+00
6622a443-9a8a-4647-98f0-4436b08278f5	Latihan 1 S/d 4	Untuk Tester Ya	\N	sma	4	published	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2026-10-21 08:19:31.391322+00	2026-10-21 08:27:07.074013+00	\N
a473c70d-73f1-4733-801d-52476f7d2696	TKA PRACTICE		\N	sma	1	archived	bbab3c0e-fa43-40fd-8dde-e65f10309e95	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2026-09-19 06:51:14.095114+00	2026-10-21 09:23:17.891039+00	2026-10-21 09:23:27.824444+00
ccf3adca-41ab-4f81-9ae7-89165fdbdb4c	Bikin Latihan	Ini Percobaan	\N	sma	2	archived	bbab3c0e-fa43-40fd-8dde-e65f10309e95	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2026-11-08 13:21:17.287251+00	2026-11-08 14:09:19.786786+00	\N
\.


--
-- Data for Name: practices; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.practices (id, user_id, competency_id, status, started_at, completed_at, created_at, updated_at, package_id, score, total_questions, correct_answers, is_auto_submitted, auto_submit_reason) FROM stdin;
3f1a8f26-c11d-46ca-885b-0d254257eb46	f125ef5d-2c6f-4187-b02d-a50465b62803	\N	completed	2026-09-27 05:15:18.200853+00	2026-09-27 05:20:50.385996+00	2026-09-27 05:15:18.303267+00	2026-09-27 05:20:50.595123+00	a473c70d-73f1-4733-801d-52476f7d2696	0.00	1	0	t	Batas toleransi pelanggaran tata tertib terlampaui (> 3 kali perpindahan tab/layar)
d544adc0-5f73-4f14-8715-6df06931525c	f125ef5d-2c6f-4187-b02d-a50465b62803	\N	completed	2026-09-27 05:15:17.991142+00	2026-09-27 05:21:51.051148+00	2026-09-27 05:15:18.098815+00	2026-09-27 05:21:51.145406+00	a473c70d-73f1-4733-801d-52476f7d2696	0.00	1	0	t	Batas toleransi pelanggaran tata tertib terlampaui (> 3 kali perpindahan tab/layar)
06687d5e-39d5-4c81-9a33-82bb49343fdd	f125ef5d-2c6f-4187-b02d-a50465b62803	\N	completed	2026-09-27 05:22:01.021267+00	2026-09-27 05:25:35.768644+00	2026-09-27 05:22:01.068254+00	2026-09-27 05:25:35.866115+00	a473c70d-73f1-4733-801d-52476f7d2696	0.00	1	0	t	Batas toleransi pelanggaran tata tertib terlampaui (> 3 kali perpindahan tab/layar)
252358ad-3e7b-489d-b643-16489ab3584f	f125ef5d-2c6f-4187-b02d-a50465b62803	\N	completed	2026-09-27 05:30:37.232969+00	2026-09-27 05:35:05.61882+00	2026-09-27 05:30:37.335055+00	2026-09-27 05:35:05.722311+00	a473c70d-73f1-4733-801d-52476f7d2696	0.00	1	0	t	Batas toleransi pelanggaran tata tertib terlampaui (> 3 kali perpindahan tab/layar)
634915f4-06a1-48f2-a043-d9f536f7befc	f125ef5d-2c6f-4187-b02d-a50465b62803	\N	completed	2026-09-27 05:48:45.7459+00	2026-09-27 05:49:27.001727+00	2026-09-27 05:48:45.839458+00	2026-09-27 05:49:27.22427+00	a473c70d-73f1-4733-801d-52476f7d2696	0.00	1	0	f	
ed651dc4-fcf6-46a2-ad85-cc171f8e71ca	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	completed	2026-09-27 05:49:45.334024+00	2026-09-27 05:51:10.326372+00	2026-09-27 05:49:45.436322+00	2026-09-27 05:51:10.530577+00	ab87a7bd-2178-4e3f-9e70-a3ac56d5afc4	0.00	2	0	t	Batas toleransi pelanggaran tata tertib terlampaui (> 3 kali perpindahan tab/layar)
897987e1-221a-4263-8d96-c1abb61327bd	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	completed	2026-09-27 06:19:28.758279+00	2026-09-27 06:19:39.822996+00	2026-09-27 06:19:28.863815+00	2026-09-27 06:19:40.027781+00	ab87a7bd-2178-4e3f-9e70-a3ac56d5afc4	0.00	2	0	f	
031c1421-94c0-4489-8e64-6a6687793f3e	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	completed	2026-09-27 06:21:31.338168+00	2026-09-27 06:21:39.120255+00	2026-09-27 06:21:31.44015+00	2026-09-27 06:21:39.325666+00	ab87a7bd-2178-4e3f-9e70-a3ac56d5afc4	0.00	2	0	f	
1484e340-037c-4f19-8b33-9ef5fdddd98b	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	completed	2026-09-27 06:41:35.434857+00	2026-09-27 06:41:41.988189+00	2026-09-27 06:41:35.483891+00	2026-09-27 06:41:42.183158+00	ab87a7bd-2178-4e3f-9e70-a3ac56d5afc4	0.00	2	0	f	
99084518-270a-48dd-ae4f-6e58d9d37d43	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	completed	2026-09-27 06:42:40.66622+00	2026-09-27 06:42:48.449309+00	2026-09-27 06:42:40.768837+00	2026-09-27 06:42:48.6538+00	ab87a7bd-2178-4e3f-9e70-a3ac56d5afc4	0.00	2	0	f	
9fee81cb-9feb-41ee-b4a1-0cc59276bc4e	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	completed	2026-09-27 06:52:40.411592+00	2026-09-27 06:53:05.605996+00	2026-09-27 06:52:40.463399+00	2026-09-27 06:53:05.811314+00	ab87a7bd-2178-4e3f-9e70-a3ac56d5afc4	0.00	2	0	f	
99f81c30-a88d-4a89-a320-1b12c07ce88b	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	completed	2026-09-27 07:04:22.774469+00	2026-09-27 07:04:29.533089+00	2026-09-27 07:04:22.876829+00	2026-09-27 07:04:29.700287+00	ab87a7bd-2178-4e3f-9e70-a3ac56d5afc4	0.00	2	0	f	
32ebed14-eaf4-4dfc-beca-5b62ea03c8fe	f125ef5d-2c6f-4187-b02d-a50465b62803	\N	completed	2026-09-27 06:42:19.146456+00	2026-09-27 07:05:58.416237+00	2026-09-27 06:42:19.196644+00	2026-09-27 07:05:58.62161+00	a473c70d-73f1-4733-801d-52476f7d2696	0.00	1	0	f	
2ffd9278-309d-4e78-a05a-d832758b2dda	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	completed	2026-09-27 07:28:19.390515+00	2026-09-27 07:28:25.737432+00	2026-09-27 07:28:19.493125+00	2026-09-27 07:28:25.896762+00	ab87a7bd-2178-4e3f-9e70-a3ac56d5afc4	0.00	2	0	f	
efe03fb0-fc4b-48ab-8577-bedf64ba86c0	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	completed	2026-09-27 07:28:58.199411+00	2026-09-27 07:29:04.54827+00	2026-09-27 07:28:58.301725+00	2026-09-27 07:29:04.753336+00	ab87a7bd-2178-4e3f-9e70-a3ac56d5afc4	0.00	2	0	f	
986bbb95-4bce-4490-9818-17206f31e0e3	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	completed	2026-09-27 07:41:23.96787+00	2026-09-27 07:41:42.074501+00	2026-09-27 07:41:24.065647+00	2026-09-27 07:41:42.182721+00	ab87a7bd-2178-4e3f-9e70-a3ac56d5afc4	0.00	2	0	f	
81e8bd79-5bcc-41cc-b41c-2969ac141e66	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	completed	2026-09-27 07:44:33.325729+00	2026-09-27 07:44:43.850125+00	2026-09-27 07:44:33.373968+00	2026-09-27 07:44:44.157419+00	ab87a7bd-2178-4e3f-9e70-a3ac56d5afc4	50.00	2	1	f	
1b6091ca-c081-43d2-8769-e9c2ff84acf4	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	completed	2026-09-27 08:01:58.452723+00	2026-09-27 08:02:41.256695+00	2026-09-27 08:01:58.5065+00	2026-09-27 08:02:41.364759+00	ab87a7bd-2178-4e3f-9e70-a3ac56d5afc4	50.00	2	1	t	Batas toleransi pelanggaran tata tertib terlampaui (> 3 kali perpindahan tab/layar)
65a1ab4f-01be-40c4-b02d-cbe2406d21f9	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	completed	2026-09-27 08:03:46.086632+00	2026-09-27 08:05:26.90454+00	2026-09-27 08:03:46.133904+00	2026-09-27 08:05:27.00367+00	ab87a7bd-2178-4e3f-9e70-a3ac56d5afc4	0.00	2	0	t	Batas toleransi pelanggaran tata tertib terlampaui (> 3 kali perpindahan tab/layar)
f005efde-cf52-4f01-b6f6-9576468a8b4f	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	completed	2026-09-27 08:07:47.388952+00	2026-09-27 08:07:56.876913+00	2026-09-27 08:07:47.436945+00	2026-09-27 08:07:56.973977+00	ab87a7bd-2178-4e3f-9e70-a3ac56d5afc4	50.00	2	1	f	
9c1950ee-86a7-4cc0-a170-ff9659faf7a0	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	completed	2026-09-27 08:09:03.758057+00	2026-09-27 08:12:57.392868+00	2026-09-27 08:09:03.806485+00	2026-09-27 08:12:57.499114+00	ab87a7bd-2178-4e3f-9e70-a3ac56d5afc4	0.00	2	0	t	Batas toleransi pelanggaran tata tertib terlampaui (> 3 kali perpindahan tab/layar)
2ba706ed-9718-4fb0-b9dc-ba5b901c1fdc	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	completed	2026-09-27 08:13:11.662517+00	2026-09-27 08:13:18.61308+00	2026-09-27 08:13:11.711011+00	2026-09-27 08:13:18.711121+00	ab87a7bd-2178-4e3f-9e70-a3ac56d5afc4	0.00	2	0	f	
1ccc4194-b9a8-4799-8051-d9f37a3209c1	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	completed	2026-09-27 08:13:29.095657+00	2026-09-27 08:15:22.738536+00	2026-09-27 08:13:29.144102+00	2026-09-27 08:15:22.895345+00	ab87a7bd-2178-4e3f-9e70-a3ac56d5afc4	50.00	2	1	f	
12a847a5-abfd-49e9-9ac1-48c6a7d2368b	f125ef5d-2c6f-4187-b02d-a50465b62803	\N	completed	2026-09-27 08:26:42.836505+00	2026-09-27 08:26:55.537686+00	2026-09-27 08:26:42.884339+00	2026-09-27 08:26:55.741847+00	4073929f-aac4-474e-af21-56b8e48ac1c5	0.00	2	0	f	
6e943a25-d282-4082-99d7-0af185e23b62	f125ef5d-2c6f-4187-b02d-a50465b62803	\N	completed	2026-09-27 08:31:38.382689+00	2026-09-27 08:32:18.013545+00	2026-09-27 08:31:38.463189+00	2026-09-27 08:32:18.118767+00	4073929f-aac4-474e-af21-56b8e48ac1c5	100.00	2	2	f	
a5518990-f9fa-4241-9068-77d30b3b0455	f125ef5d-2c6f-4187-b02d-a50465b62803	\N	completed	2026-09-28 07:17:57.581522+00	2026-09-28 07:18:13.607008+00	2026-09-28 07:17:57.58307+00	2026-09-28 07:18:13.610652+00	4073929f-aac4-474e-af21-56b8e48ac1c5	0.00	2	0	f	
bc7417db-9b37-47cf-8748-1611a164b24d	f125ef5d-2c6f-4187-b02d-a50465b62803	\N	completed	2026-09-30 02:13:58.80081+00	2026-09-30 02:15:02.722345+00	2026-09-30 02:13:58.803191+00	2026-09-30 02:15:02.725388+00	4073929f-aac4-474e-af21-56b8e48ac1c5	50.00	2	1	f	
5a2a51cb-5621-43c1-bef7-5fffd1990f49	f125ef5d-2c6f-4187-b02d-a50465b62803	\N	completed	2026-09-30 02:17:47.078819+00	2026-09-30 02:18:22.304652+00	2026-09-30 02:17:47.080305+00	2026-09-30 02:18:22.309679+00	4073929f-aac4-474e-af21-56b8e48ac1c5	100.00	2	2	f	
a181880e-7364-4066-9b99-bd77e7f5c404	f125ef5d-2c6f-4187-b02d-a50465b62803	\N	completed	2026-09-30 02:18:55.564733+00	2026-09-30 02:19:34.688379+00	2026-09-30 02:18:55.566257+00	2026-09-30 02:19:34.692492+00	a473c70d-73f1-4733-801d-52476f7d2696	100.00	1	1	t	Batas toleransi pelanggaran tata tertib terlampaui (> 3 kali perpindahan tab/layar)
fc69403f-e756-47c9-87d5-f6ce5b84c50a	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	completed	2026-09-30 02:20:19.101185+00	2026-09-30 02:20:23.779632+00	2026-09-30 02:20:19.103101+00	2026-09-30 02:20:23.783175+00	ab87a7bd-2178-4e3f-9e70-a3ac56d5afc4	0.00	1	0	f	
04032bb3-262c-42a3-995e-fc4bf1593008	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	completed	2026-09-30 02:20:43.901082+00	2026-09-30 02:20:48.734868+00	2026-09-30 02:20:43.902779+00	2026-09-30 02:20:48.739127+00	ab87a7bd-2178-4e3f-9e70-a3ac56d5afc4	0.00	1	0	f	
104da301-1e54-481f-9fda-24e05225a905	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	completed	2026-09-30 02:35:48.621081+00	2026-09-30 02:35:54.273369+00	2026-09-30 02:35:48.623038+00	2026-09-30 02:35:54.277258+00	ab87a7bd-2178-4e3f-9e70-a3ac56d5afc4	100.00	1	1	f	
8edaa5e9-f553-49e4-880a-3594fc638fc7	f125ef5d-2c6f-4187-b02d-a50465b62803	\N	completed	2026-09-30 02:18:40.995854+00	2026-09-30 11:39:33.897751+00	2026-09-30 02:18:40.997565+00	2026-09-30 11:39:34.199559+00	4073929f-aac4-474e-af21-56b8e48ac1c5	0.00	2	0	t	Batas toleransi pelanggaran tata tertib terlampaui (> 3 kali perpindahan tab/layar)
36137138-7fd1-4f9e-9c52-05b15490e2fb	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	completed	2026-09-30 11:39:55.40132+00	2026-09-30 11:40:00.728117+00	2026-09-30 11:39:55.49994+00	2026-09-30 11:40:01.137978+00	ab87a7bd-2178-4e3f-9e70-a3ac56d5afc4	0.00	1	0	f	
0332a377-f061-452c-bdcc-2bca7a1e65b3	f125ef5d-2c6f-4187-b02d-a50465b62803	\N	completed	2026-10-07 03:07:01.130786+00	2026-10-07 03:10:13.845849+00	2026-10-07 03:07:01.232805+00	2026-10-07 03:10:14.050694+00	4073929f-aac4-474e-af21-56b8e48ac1c5	0.00	2	0	f	
ca88633e-9d34-42d2-99ba-5330285712aa	f125ef5d-2c6f-4187-b02d-a50465b62803	\N	completed	2026-10-21 08:27:20.079377+00	2026-10-21 08:28:39.029375+00	2026-10-21 08:27:20.18166+00	2026-10-21 08:28:39.234227+00	6622a443-9a8a-4647-98f0-4436b08278f5	75.00	4	3	f	
7a8d7f3a-6f17-4957-b0f7-de1638860bd1	f125ef5d-2c6f-4187-b02d-a50465b62803	\N	completed	2026-10-21 08:50:00.693705+00	2026-10-21 08:50:55.242885+00	2026-10-21 08:50:00.745267+00	2026-10-21 08:50:55.447563+00	6622a443-9a8a-4647-98f0-4436b08278f5	100.00	4	4	f	
2fa47485-8509-4612-9c44-7e8d77c258f6	f125ef5d-2c6f-4187-b02d-a50465b62803	\N	completed	2026-11-08 10:15:45.721541+00	2026-11-08 10:16:33.73441+00	2026-11-08 10:15:45.772218+00	2026-11-08 10:16:33.845107+00	6622a443-9a8a-4647-98f0-4436b08278f5	25.00	4	1	f	
514cdd60-823a-4cc8-83b8-86e0ba1bca0b	f125ef5d-2c6f-4187-b02d-a50465b62803	\N	completed	2026-11-08 10:21:30.585492+00	2026-11-08 10:21:41.090319+00	2026-11-08 10:21:30.635984+00	2026-11-08 10:21:41.191037+00	6622a443-9a8a-4647-98f0-4436b08278f5	25.00	4	1	f	
e5161a8c-e199-42ec-a5a1-870d16ec1f03	fc4baf98-26f0-45e0-89b9-ddd23d0f3bd1	\N	completed	2026-11-08 13:16:18.74912+00	2026-11-08 13:18:38.764534+00	2026-11-08 13:16:18.800372+00	2026-11-08 13:18:38.867334+00	6622a443-9a8a-4647-98f0-4436b08278f5	50.00	4	2	f	
\.


--
-- Data for Name: question_competencies; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.question_competencies (question_id, competency_id, created_at) FROM stdin;
2a6cfb98-939b-481c-bed8-b0577e0c02b6	50ce66b9-98af-491e-96e8-7f07110a41b2	2026-09-27 05:44:45.404459+00
d3ea9b84-8c35-42df-8d9a-586efd7f94c4	50ce66b9-98af-491e-96e8-7f07110a41b2	2026-09-27 05:44:47.247464+00
dbfa6723-f73f-49f5-bd61-3298a4a8e93b	50ce66b9-98af-491e-96e8-7f07110a41b2	2026-09-27 08:20:44.858176+00
6746468b-df32-46e4-ae24-7ff53b8710c3	50ce66b9-98af-491e-96e8-7f07110a41b2	2026-09-27 08:20:46.599222+00
c6115406-272a-4de9-8e2d-cbf14afed157	50ce66b9-98af-491e-96e8-7f07110a41b2	2026-09-27 08:21:10.661789+00
\.


--
-- Data for Name: question_explanations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.question_explanations (id, question_id, explanation, answering_tips, created_at, updated_at) FROM stdin;
f910cd18-5add-435b-8af7-6a63c431008f	a3f8465c-09c6-47f6-9246-131bf98306db	ASDASDASD		2026-09-21 08:03:49.302381+00	2026-09-21 08:03:49.302381+00
a7e7907a-9f52-49eb-a4c5-040375211917	d960f59c-4bb5-426b-99b1-8801a1e4aca3	ASDASDAS		2026-09-21 08:03:53.705536+00	2026-09-21 08:03:53.705536+00
24921c1a-49fe-429d-ac21-20947dbb1995	51c5b6ee-25a6-4c8a-ae33-67eb43a44576	ASDASDASD		2026-09-21 08:03:55.345468+00	2026-09-21 08:03:55.345468+00
dfa73437-8e3d-44de-a7c7-ab492aef9a43	1068bb20-d27d-4fb3-a9a8-7953ee241f9a	ASDASD		2026-09-21 08:03:57.290398+00	2026-09-21 08:03:57.290398+00
2a50e628-fc94-4c36-a897-71a3d8f99ea5	7d9fa00a-7ee3-4b9e-853e-ee85a96d113c	asdasd		2026-09-23 15:38:49.135841+00	2026-09-23 15:38:49.135841+00
64b2c78d-1aec-41e2-bd96-5efa4ad797b2	4c611f6b-7bb9-4a26-b0d6-fe16df2c42e8	asdasd		2026-09-23 15:38:50.461925+00	2026-09-23 15:38:50.461925+00
23a0760c-f91d-41d2-a67b-6a094f4f3e38	76901441-76ce-44f5-9c47-33d6722d1074	asdasd		2026-09-23 15:38:51.491527+00	2026-09-23 15:38:51.491527+00
11d6a88f-b6a3-4add-a527-71fe1501278e	6c6adf1d-18d5-4505-a007-f41a64d1305e	asdsad		2026-09-23 15:38:52.921462+00	2026-09-23 15:38:52.921462+00
512aec57-0e4c-4a44-9ec3-1ae78c2a8a0f	8ebac3cd-9628-4b70-a61f-e6b67032d6e3	asdasdasd		2026-09-23 15:38:54.15331+00	2026-09-23 15:38:54.15331+00
f117628f-6347-49ed-8a9a-b1e822598f20	4ebfd325-c399-4473-bd19-d3940853713d	asdasd		2026-09-23 15:40:56.945494+00	2026-09-23 15:40:56.945494+00
fe5b5ad2-b334-4c29-9e23-54fc10985f70	4a841dcb-7f62-4a5d-89ad-5a80db74da3c	asdasd		2026-09-23 15:40:58.264696+00	2026-09-23 15:40:58.264696+00
895be804-5273-4bb4-b484-93fe0a57786b	3e3fd5c5-6298-40eb-90fe-4cff2f9e9ab3	asdasd		2026-09-23 15:40:59.595755+00	2026-09-23 15:40:59.595755+00
b55fdc6c-a1a9-4d97-abff-954c57f544d2	7469d6f4-67ce-4b77-9583-7ccf80676476	asdsad		2026-09-23 15:41:01.031249+00	2026-09-23 15:41:01.031249+00
0bccec84-23af-4869-b4f8-c64457b81f97	4016ec73-d601-4910-bbe7-2097adec09b2	asdasdasd		2026-09-23 15:41:02.254281+00	2026-09-23 15:41:02.254281+00
fd0dcd3f-d551-47c2-a114-aa7c6a0a059e	2b23a853-0130-4b6c-b423-a0ed4ab492e2	asdasd		2026-09-23 15:41:53.152643+00	2026-09-23 15:41:53.152643+00
4ce3042e-86cb-4b5d-8f62-c6e6bb268ba3	5f7ec9f7-8a69-4f5a-bfa1-ebb58e7b84bd	asdasd		2026-09-23 15:41:54.478631+00	2026-09-23 15:41:54.478631+00
5df58613-2010-4c7c-9948-6f2521ebbdf0	8f59b804-a656-48e5-9818-8c5ff4d0efd4	asdasd		2026-09-23 15:41:55.712353+00	2026-09-23 15:41:55.712353+00
c996ee04-fa22-429e-a96d-3598b3d0d4fd	059ecdc9-7bfd-4b97-85ce-4b501d15a642	asdsad		2026-09-23 15:41:56.991096+00	2026-09-23 15:41:56.991096+00
1519e717-0131-4ba1-b61b-628afe1af343	2e4adbce-9333-4ed8-ac80-3d6dc6cceaf7	asdasdasd		2026-09-23 15:41:58.067614+00	2026-09-23 15:41:58.067614+00
ec99e32a-92ac-4456-a477-0a60cf34fcb2	f49f136b-d0b0-4588-aa0d-aa549e9e7647	asdasd		2026-09-23 15:44:37.712727+00	2026-09-23 15:44:37.712727+00
766470de-273d-42e9-8a30-b2b4594e1ff2	02ba1a6a-8ad2-4587-a92e-9cbc74cef20b	asdasd		2026-09-23 15:44:39.04503+00	2026-09-23 15:44:39.04503+00
50af0114-7675-4019-86e0-10cf5abe37b8	7acc58ec-1d7f-4f2f-aec7-2e9df230ab51	asdasd		2026-09-23 15:44:40.273049+00	2026-09-23 15:44:40.273049+00
7d8651f9-d9eb-46b1-9d94-24664f5d830a	939e6bb7-af2b-49b6-9fbc-224d14e4ab94	asdsad		2026-09-23 15:44:41.401144+00	2026-09-23 15:44:41.401144+00
6509d00e-8361-4533-bb61-36674c59249d	ca0f2713-6e49-4385-83ff-3d2a32c9df38	asdasdasd		2026-09-23 15:44:42.7314+00	2026-09-23 15:44:42.7314+00
2fe948fc-62da-466d-855a-ef858eac099f	afc043b3-bb56-4ed7-b4c9-dff438aad899	asdasdsas		2026-09-23 15:44:47.495353+00	2026-09-23 15:44:47.495353+00
8c1436b6-b3d8-4b67-8fe7-e3fe58039645	ae47dce0-f370-4050-a5e7-d0a27277a414	adsasdas		2026-09-23 15:44:48.778246+00	2026-09-23 15:44:48.778246+00
bdaead03-7c4f-4af0-a19a-9ee7cab15630	7fc19fd7-107f-4e50-89c3-001d188312a7	asdasdads		2026-09-23 15:44:53.185991+00	2026-09-23 15:44:53.185991+00
e54faee7-e775-4ea8-81ee-0297ab04bd52	7d011732-3523-4bcf-aa8a-3e4d8461785f	asdadsasd		2026-09-23 15:44:54.405146+00	2026-09-23 15:44:54.405146+00
0d71ba93-3faa-4f2e-9a75-0208d3a79b02	88a3d3b8-2286-4894-a196-0765f1d9816e	asdasd		2026-09-27 05:05:01.636119+00	2026-09-27 05:05:01.636119+00
318a0426-e974-4de2-ae89-4c80b61f2710	d3ea9b84-8c35-42df-8d9a-586efd7f94c4	asdasd		2026-09-27 05:44:47.350624+00	2026-09-27 05:44:47.350624+00
d70b54b0-f881-4274-91ae-35fff10d30de	7d50fc93-927c-4e5e-9c20-f5c33aa158be	Bener		2026-09-27 08:26:21.028982+00	2026-09-27 08:26:21.028982+00
f311c823-e7ae-4830-a184-8ddcfc44e6f7	7df26d31-e0e4-4fb1-9a18-9821397c5f64	SSSS		2026-09-27 08:26:22.667226+00	2026-09-27 08:26:22.667226+00
34c58878-cacb-4af1-a487-89f694b01783	85351a72-7b38-4bce-a344-1c69598ad8fc	Contoh Pembahasan Mengidentifikasi penggunaan kata serapan dari bahasa daerah/asing dalam berbagai bidang		2026-10-21 08:11:01.133954+00	2026-10-21 08:11:01.133954+00
5ef0cc63-edf8-460a-af5d-ef7bc2a3ad42	50781746-0671-4ef5-8c3c-73ebe48fa3e2	Contoh Pembahasan Menyimpulkan ide pokok, gagasan pendukung, tokoh, peristiwa, latar, konflik, atau nilai-nilai dalam teks		2026-10-21 08:11:03.284808+00	2026-10-21 08:11:03.284808+00
9c26234b-0c20-44a5-8a42-56d1b7e6890e	2bdc7711-0365-46a0-8bc4-d40235bd409f	Contoh Pembahasan Menjelaskan hubungan makna antarkalimat dan/atau antarparagraf dalam teks		2026-10-21 08:11:05.537223+00	2026-10-21 08:11:05.537223+00
d183a9b3-f2e8-4429-8d9b-d0e2a1f1faa9	f4e39d71-a83a-459d-82a5-dddbcc337f15	Contoh Pembahasan Mengidentifikasi penggunaan kata serapan dari bahasa daerah/asing dalam berbagai bidang		2026-10-21 08:25:48.123528+00	2026-10-21 08:25:48.123528+00
facf5509-a04e-404c-b09f-6bb5def4c00c	0d7e6daf-3575-4a61-840d-b66acd132f41	Contoh Pembahasan Menyimpulkan ide pokok, gagasan pendukung, tokoh, peristiwa, latar, konflik, atau nilai-nilai dalam teks		2026-10-21 08:25:50.786867+00	2026-10-21 08:25:50.786867+00
19f242d8-c17b-4b7d-ad2b-30f4f953248e	dd8b59b2-aed2-4227-943a-4d79e7f6d5e4	Contoh Pembahasan Menilai ketepatan dan kesesuaian penggunaan bahasa dalam teks		2026-10-21 08:25:54.472754+00	2026-10-21 08:25:54.472754+00
98cea28f-f2b8-4e7c-8b64-878b8a72b077	08818873-e533-483b-b5d5-42190b4434d2	Indonesia Adalah Negara		2026-11-08 13:25:01.38225+00	2026-11-08 13:25:01.38225+00
d5fa49ef-9578-4666-b93f-39edbb27429a	faa6ca56-c2f2-43b6-92a2-887ab3c9e78a	aiosdijas		2026-11-08 13:25:02.309198+00	2026-11-08 13:25:02.309198+00
a1d48e82-ed1a-4ccc-9938-eabdf892f66e	a6dc5513-9c30-4780-a3db-5eeedd68be79	asdasdasd		2026-11-08 13:31:42.298818+00	2026-11-08 13:31:42.298818+00
8c778c9a-0f75-4f3d-a88e-1c6452b2c908	ea1e3eae-fc0d-48a7-8333-4446c89c81bb	asdasd		2026-11-08 13:31:43.070961+00	2026-11-08 13:31:43.070961+00
2219d31b-513c-47cf-af14-a61058d45963	bd3ea538-3edb-4dc8-85bd-8a801c98f3d6	test		2026-11-08 13:31:43.851822+00	2026-11-08 13:31:43.851822+00
de364185-d552-456e-9407-dec4e04b19e5	12396019-b799-42e6-b456-8007452b4851	tester		2026-11-08 13:31:45.351419+00	2026-11-08 13:31:45.351419+00
324e8155-5d7c-4b8c-a199-b03efa3917a6	db70cb96-c9f3-4590-8e4b-9dc17ec57d2b	adsasd		2026-11-08 13:31:46.824398+00	2026-11-08 13:31:46.824398+00
\.


--
-- Data for Name: question_options; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.question_options (id, question_id, option_label, option_text, is_correct, display_order, created_at, updated_at) FROM stdin;
a88d9894-3700-446c-9ae9-f04aee04bf29	a3f8465c-09c6-47f6-9246-131bf98306db	A	ASDASD	t	1	2026-09-21 08:03:48.280008+00	2026-09-21 08:03:48.280008+00
a080f272-83ee-4aa6-ae5b-ffa92996f888	a3f8465c-09c6-47f6-9246-131bf98306db	B	ASDASD	f	2	2026-09-21 08:03:48.477353+00	2026-09-21 08:03:48.477353+00
4ba3d7b0-10fb-43d4-a112-9d4181f40759	a3f8465c-09c6-47f6-9246-131bf98306db	C	ASDASD	f	3	2026-09-21 08:03:48.589829+00	2026-09-21 08:03:48.589829+00
d8082ffb-1f3b-46e8-8318-d53e9331da46	a3f8465c-09c6-47f6-9246-131bf98306db	D	ASDASD	f	4	2026-09-21 08:03:48.888426+00	2026-09-21 08:03:48.888426+00
4deefa93-195f-41da-9a41-3d5f0a084889	8f35d2de-5210-40d0-9f27-9950695aac3c	A	ASDASD	t	1	2026-09-21 08:03:50.786555+00	2026-09-21 08:03:50.786555+00
d4b9bd2d-93d3-4f8f-b714-f40e0fc34277	8f35d2de-5210-40d0-9f27-9950695aac3c	B	ASDASD	t	2	2026-09-21 08:03:50.826384+00	2026-09-21 08:03:50.826384+00
f53e1c55-8969-48b5-92a0-377b057fc841	8f35d2de-5210-40d0-9f27-9950695aac3c	C	ASDASD	t	3	2026-09-21 08:03:50.936631+00	2026-09-21 08:03:50.936631+00
db4f4ded-3ea3-4b17-a1ed-e16e8411e8e7	8f35d2de-5210-40d0-9f27-9950695aac3c	D	ASDASD	f	4	2026-09-21 08:03:51.044791+00	2026-09-21 08:03:51.044791+00
c67b6844-36ce-4cbc-b500-ac8b423f5fb0	8f35d2de-5210-40d0-9f27-9950695aac3c	E	ASD	f	5	2026-09-21 08:03:51.2498+00	2026-09-21 08:03:51.2498+00
93ee1cee-052d-4cb1-9354-e23e783bbb89	d960f59c-4bb5-426b-99b1-8801a1e4aca3	A	ASDASD [KUNCI: BENAR]	t	1	2026-09-21 08:03:53.091953+00	2026-09-21 08:03:53.091953+00
ae08853e-4d3f-4092-861a-36b3a130e8ff	d960f59c-4bb5-426b-99b1-8801a1e4aca3	B	ASDASD [KUNCI: SALAH]	t	2	2026-09-21 08:03:53.199826+00	2026-09-21 08:03:53.199826+00
d28dac4f-117a-4a4e-bb12-237eaadfa3e9	d960f59c-4bb5-426b-99b1-8801a1e4aca3	C	ASDASD [KUNCI: SALAH]	t	3	2026-09-21 08:03:53.237268+00	2026-09-21 08:03:53.237268+00
d4f2dbac-c388-44cf-845c-3c400102d920	d960f59c-4bb5-426b-99b1-8801a1e4aca3	D	ASDASD [KUNCI: SALAH]	t	4	2026-09-21 08:03:53.505642+00	2026-09-21 08:03:53.505642+00
87240a52-bf12-4802-a54a-8c83beaf1cac	51c5b6ee-25a6-4c8a-ae33-67eb43a44576	A	ASDASD [KUNCI: TEPAT]	t	1	2026-09-21 08:03:54.833132+00	2026-09-21 08:03:54.833132+00
15bf136c-aea2-46b2-b4b6-9adf744e6d17	51c5b6ee-25a6-4c8a-ae33-67eb43a44576	B	ASDASD [KUNCI: TIDAK TEPAT]	t	2	2026-09-21 08:03:54.934442+00	2026-09-21 08:03:54.934442+00
234fb1e5-fad3-45c3-be99-3129283c4fae	51c5b6ee-25a6-4c8a-ae33-67eb43a44576	C	ASDASD [KUNCI: TEPAT]	t	3	2026-09-21 08:03:54.973505+00	2026-09-21 08:03:54.973505+00
fae84e57-fc15-4c77-acaf-030cd77e1ec7	51c5b6ee-25a6-4c8a-ae33-67eb43a44576	D	ASDASD [KUNCI: TIDAK TEPAT]	t	4	2026-09-21 08:03:55.24315+00	2026-09-21 08:03:55.24315+00
9c0e94cc-39a5-4109-81ed-a6a5c9df5d49	1068bb20-d27d-4fb3-a9a8-7953ee241f9a	A	ASDASD	f	1	2026-09-21 08:03:56.674871+00	2026-09-21 08:03:56.674871+00
2910f246-f136-41f1-ae31-f1e33f667b8b	1068bb20-d27d-4fb3-a9a8-7953ee241f9a	B	ASDASD	f	2	2026-09-21 08:03:56.778942+00	2026-09-21 08:03:56.778942+00
3e448367-5fc1-4b7c-9b10-b6a687edee38	1068bb20-d27d-4fb3-a9a8-7953ee241f9a	C	ASDASD	t	3	2026-09-21 08:03:56.984204+00	2026-09-21 08:03:56.984204+00
4eb69501-d0cc-4fdd-8687-4afb5b8290da	1068bb20-d27d-4fb3-a9a8-7953ee241f9a	D	ASDASD	f	4	2026-09-21 08:03:57.085745+00	2026-09-21 08:03:57.085745+00
62cf1dab-5916-43ce-9916-3f60ac159fce	7d9fa00a-7ee3-4b9e-853e-ee85a96d113c	A	asdasd	t	1	2026-09-23 15:38:48.725704+00	2026-09-23 15:38:48.725704+00
eb3a2396-0dc5-49f8-a0ea-8e889b756a1b	7d9fa00a-7ee3-4b9e-853e-ee85a96d113c	B	adsasd	f	2	2026-09-23 15:38:48.828198+00	2026-09-23 15:38:48.828198+00
410e4aa1-13cf-421c-8c6a-894cfe74e23c	7d9fa00a-7ee3-4b9e-853e-ee85a96d113c	C	asdasd	f	3	2026-09-23 15:38:48.891489+00	2026-09-23 15:38:48.891489+00
862b0839-b577-4caa-96b9-f8bf31eb53d8	7d9fa00a-7ee3-4b9e-853e-ee85a96d113c	D	asdasd	f	4	2026-09-23 15:38:48.942303+00	2026-09-23 15:38:48.942303+00
a4dd58e4-2aa8-4ae4-a7c5-bb3dff9012d1	4c611f6b-7bb9-4a26-b0d6-fe16df2c42e8	A	Opsi A	t	1	2026-09-23 15:38:49.852881+00	2026-09-23 15:38:49.852881+00
01c3673c-1dd8-4b9b-9808-57144b54b659	4c611f6b-7bb9-4a26-b0d6-fe16df2c42e8	B	Opsi B	t	2	2026-09-23 15:38:49.955543+00	2026-09-23 15:38:49.955543+00
3356c5f2-cd38-4dbd-9ba4-ac4240db0ddf	4c611f6b-7bb9-4a26-b0d6-fe16df2c42e8	C	Opsi C	f	3	2026-09-23 15:38:50.057967+00	2026-09-23 15:38:50.057967+00
9e267f8d-d8fb-4248-bc7f-901f995b8e00	4c611f6b-7bb9-4a26-b0d6-fe16df2c42e8	D	Opsi D	f	4	2026-09-23 15:38:50.159408+00	2026-09-23 15:38:50.159408+00
2534a427-e8eb-40cf-a3c8-34e2dc54de5a	4c611f6b-7bb9-4a26-b0d6-fe16df2c42e8	E	Opsi E	f	5	2026-09-23 15:38:50.262683+00	2026-09-23 15:38:50.262683+00
da02ebd6-4280-40a2-9aec-f2e072caf6a7	76901441-76ce-44f5-9c47-33d6722d1074	A	asdasd	t	1	2026-09-23 15:38:51.131171+00	2026-09-23 15:38:51.131171+00
ecab54ab-73cb-46cf-a53a-204fd784ef79	76901441-76ce-44f5-9c47-33d6722d1074	B	asdasd	t	2	2026-09-23 15:38:51.181571+00	2026-09-23 15:38:51.181571+00
d16db9c8-214b-4448-85b5-6a9702d52c70	76901441-76ce-44f5-9c47-33d6722d1074	C	asdasd	f	3	2026-09-23 15:38:51.233675+00	2026-09-23 15:38:51.233675+00
d6f0eaa5-6b5a-4553-9bb1-76b199439c7d	76901441-76ce-44f5-9c47-33d6722d1074	D	asdasd	f	4	2026-09-23 15:38:51.286337+00	2026-09-23 15:38:51.286337+00
29fdd391-05d3-4f38-9fca-3bde3d2bd0db	6c6adf1d-18d5-4505-a007-f41a64d1305e	A	asdasd [KUNCI: TEPAT]	t	1	2026-09-23 15:38:52.413309+00	2026-09-23 15:38:52.413309+00
f5c42100-fa3f-40ea-bfb3-6cbfe55f4374	6c6adf1d-18d5-4505-a007-f41a64d1305e	B	asdasd [KUNCI: TIDAK TEPAT]	t	2	2026-09-23 15:38:52.514508+00	2026-09-23 15:38:52.514508+00
827f08e1-dccf-4c3a-b74b-c9ff22b63919	6c6adf1d-18d5-4505-a007-f41a64d1305e	C	asdasd [KUNCI: TEPAT]	t	3	2026-09-23 15:38:52.617738+00	2026-09-23 15:38:52.617738+00
b790f209-ac26-4557-b835-c6ed0e78e532	6c6adf1d-18d5-4505-a007-f41a64d1305e	D	asdads [KUNCI: TIDAK TEPAT]	t	4	2026-09-23 15:38:52.719364+00	2026-09-23 15:38:52.719364+00
26bfca0c-7b87-4e55-a4eb-13ca747ffe01	8ebac3cd-9628-4b70-a61f-e6b67032d6e3	A	asdasd [KUNCI: BENAR]	t	1	2026-09-23 15:38:53.636095+00	2026-09-23 15:38:53.636095+00
da087adb-ec71-4b3d-b24d-7e0cf9fdb28f	8ebac3cd-9628-4b70-a61f-e6b67032d6e3	B	asdads [KUNCI: SALAH]	t	2	2026-09-23 15:38:53.744236+00	2026-09-23 15:38:53.744236+00
b17ac4e2-8daf-4a40-ba3a-2b3433c5ae7c	8ebac3cd-9628-4b70-a61f-e6b67032d6e3	C	asdasd [KUNCI: BENAR]	t	3	2026-09-23 15:38:53.846671+00	2026-09-23 15:38:53.846671+00
38cdff12-2d6e-4c3c-84fa-8ba83aad09ea	8ebac3cd-9628-4b70-a61f-e6b67032d6e3	D	asdasd [KUNCI: SALAH]	t	4	2026-09-23 15:38:53.949118+00	2026-09-23 15:38:53.949118+00
0b4ff93c-664f-450d-b6b6-3479de1a27ee	4ebfd325-c399-4473-bd19-d3940853713d	A	asdasd	t	1	2026-09-23 15:40:56.523906+00	2026-09-23 15:40:56.523906+00
530626c9-43cd-4d69-b691-45991a116aaf	4ebfd325-c399-4473-bd19-d3940853713d	B	adsasd	f	2	2026-09-23 15:40:56.627067+00	2026-09-23 15:40:56.627067+00
d9f9fbe9-dae3-4614-bda9-e2ae3650d329	4ebfd325-c399-4473-bd19-d3940853713d	C	asdasd	f	3	2026-09-23 15:40:56.729293+00	2026-09-23 15:40:56.729293+00
4ace6908-457f-4ce1-a6ee-93315f4b2b7a	4ebfd325-c399-4473-bd19-d3940853713d	D	asdasd	f	4	2026-09-23 15:40:56.831245+00	2026-09-23 15:40:56.831245+00
5c594e88-c15d-4416-8551-c724c353f626	4a841dcb-7f62-4a5d-89ad-5a80db74da3c	A	Opsi A	t	1	2026-09-23 15:40:57.645622+00	2026-09-23 15:40:57.645622+00
8fed6dca-33ae-43a0-904e-b11f27d40658	4a841dcb-7f62-4a5d-89ad-5a80db74da3c	B	Opsi B	t	2	2026-09-23 15:40:57.752933+00	2026-09-23 15:40:57.752933+00
5391d1ec-1fb9-47c2-885f-68bba8ed9b29	4a841dcb-7f62-4a5d-89ad-5a80db74da3c	C	Opsi C	f	3	2026-09-23 15:40:57.855822+00	2026-09-23 15:40:57.855822+00
22f584ff-50a0-45f5-b06c-b5bc42502bbc	4a841dcb-7f62-4a5d-89ad-5a80db74da3c	D	Opsi D	f	4	2026-09-23 15:40:57.958544+00	2026-09-23 15:40:57.958544+00
3a1eb1af-15cd-45f3-903d-96e18480e338	4a841dcb-7f62-4a5d-89ad-5a80db74da3c	E	Opsi E	f	5	2026-09-23 15:40:58.060268+00	2026-09-23 15:40:58.060268+00
9b569ad4-d8e3-4359-90bc-768af4066087	3e3fd5c5-6298-40eb-90fe-4cff2f9e9ab3	A	asdasd	t	1	2026-09-23 15:40:59.141508+00	2026-09-23 15:40:59.141508+00
411a4ea4-5542-428d-9c5e-8d653124a4c2	3e3fd5c5-6298-40eb-90fe-4cff2f9e9ab3	B	asdasd	t	2	2026-09-23 15:40:59.196474+00	2026-09-23 15:40:59.196474+00
a226718f-36ac-40c5-a426-9a3a26e992d0	3e3fd5c5-6298-40eb-90fe-4cff2f9e9ab3	C	asdasd	f	3	2026-09-23 15:40:59.289213+00	2026-09-23 15:40:59.289213+00
8395a46a-321c-4564-a5ba-14c647d95ab1	3e3fd5c5-6298-40eb-90fe-4cff2f9e9ab3	D	asdasd	f	4	2026-09-23 15:40:59.386826+00	2026-09-23 15:40:59.386826+00
49f8e3e1-d21d-4a50-b018-4b84526ac963	7469d6f4-67ce-4b77-9583-7ccf80676476	A	asdasd [KUNCI: TEPAT]	t	1	2026-09-23 15:41:00.517732+00	2026-09-23 15:41:00.517732+00
3c58e0e0-77d9-45c0-81c7-2baaaf8cb115	7469d6f4-67ce-4b77-9583-7ccf80676476	B	asdasd [KUNCI: TIDAK TEPAT]	t	2	2026-09-23 15:41:00.62009+00	2026-09-23 15:41:00.62009+00
4c4c385e-5159-4cad-a729-10a002fd3bf1	7469d6f4-67ce-4b77-9583-7ccf80676476	C	asdasd [KUNCI: TEPAT]	t	3	2026-09-23 15:41:00.722356+00	2026-09-23 15:41:00.722356+00
fac3562d-8544-4267-93f6-1cec73a424fb	7469d6f4-67ce-4b77-9583-7ccf80676476	D	asdads [KUNCI: TIDAK TEPAT]	t	4	2026-09-23 15:41:00.824547+00	2026-09-23 15:41:00.824547+00
dbf47224-76c1-4c1a-a509-ce458fd0d377	4016ec73-d601-4910-bbe7-2097adec09b2	A	asdasd [KUNCI: BENAR]	t	1	2026-09-23 15:41:01.849069+00	2026-09-23 15:41:01.849069+00
80faebf4-5ff5-4965-ab3f-0ebc94b0df05	4016ec73-d601-4910-bbe7-2097adec09b2	B	asdads [KUNCI: SALAH]	t	2	2026-09-23 15:41:01.945968+00	2026-09-23 15:41:01.945968+00
28f4dfb5-cece-4bfb-bc7c-6780e8a168a4	4016ec73-d601-4910-bbe7-2097adec09b2	C	asdasd [KUNCI: BENAR]	t	3	2026-09-23 15:41:02.051053+00	2026-09-23 15:41:02.051053+00
0bb31341-3c97-4189-8b6c-ab11ab8a41b1	4016ec73-d601-4910-bbe7-2097adec09b2	D	asdasd [KUNCI: SALAH]	t	4	2026-09-23 15:41:02.105321+00	2026-09-23 15:41:02.105321+00
1814ea38-a8b0-4d73-a96a-d48ff2af2583	2b23a853-0130-4b6c-b423-a0ed4ab492e2	A	asdasd	t	1	2026-09-23 15:41:52.893677+00	2026-09-23 15:41:52.893677+00
a0099d76-eacd-4399-bdd6-bed03a26a6b3	2b23a853-0130-4b6c-b423-a0ed4ab492e2	B	adsasd	f	2	2026-09-23 15:41:52.948042+00	2026-09-23 15:41:52.948042+00
cba27c93-21e4-43cc-9cf8-fdcb435fc41b	2b23a853-0130-4b6c-b423-a0ed4ab492e2	C	asdasd	f	3	2026-09-23 15:41:52.99691+00	2026-09-23 15:41:52.99691+00
e558fda6-47c1-4a16-a8b4-2757c0fb7277	2b23a853-0130-4b6c-b423-a0ed4ab492e2	D	asdasd	f	4	2026-09-23 15:41:53.05036+00	2026-09-23 15:41:53.05036+00
fd8c8d6f-9a65-40a0-8a46-62f3e185d14c	5f7ec9f7-8a69-4f5a-bfa1-ebb58e7b84bd	A	Opsi A	t	1	2026-09-23 15:41:54.0218+00	2026-09-23 15:41:54.0218+00
f5185a85-8ac6-4382-b43e-0474e7ca9e7b	5f7ec9f7-8a69-4f5a-bfa1-ebb58e7b84bd	B	Opsi B	t	2	2026-09-23 15:41:54.074554+00	2026-09-23 15:41:54.074554+00
a3229832-eb22-4052-ae2f-3ce3f4e46813	5f7ec9f7-8a69-4f5a-bfa1-ebb58e7b84bd	C	Opsi C	f	3	2026-09-23 15:41:54.177545+00	2026-09-23 15:41:54.177545+00
1d0be579-fc7b-441d-910b-84c4beb1d3a8	5f7ec9f7-8a69-4f5a-bfa1-ebb58e7b84bd	D	Opsi D	f	4	2026-09-23 15:41:54.275272+00	2026-09-23 15:41:54.275272+00
5773a188-ad24-4eee-9fbc-8122fcc8264d	5f7ec9f7-8a69-4f5a-bfa1-ebb58e7b84bd	E	Opsi E	f	5	2026-09-23 15:41:54.324215+00	2026-09-23 15:41:54.324215+00
a06bfd2d-43d9-4fe6-95dd-8ee91c66b2d0	8f59b804-a656-48e5-9818-8c5ff4d0efd4	A	asdasd	t	1	2026-09-23 15:41:55.303022+00	2026-09-23 15:41:55.303022+00
3e210b25-02db-410e-9731-325ca0e6f87a	8f59b804-a656-48e5-9818-8c5ff4d0efd4	B	asdasd	t	2	2026-09-23 15:41:55.352413+00	2026-09-23 15:41:55.352413+00
510b0f3e-3454-4cf4-81a4-b587bbc530f6	8f59b804-a656-48e5-9818-8c5ff4d0efd4	C	asdasd	f	3	2026-09-23 15:41:55.405459+00	2026-09-23 15:41:55.405459+00
64066769-309d-4985-a864-a99efed36c26	8f59b804-a656-48e5-9818-8c5ff4d0efd4	D	asdasd	f	4	2026-09-23 15:41:55.50854+00	2026-09-23 15:41:55.50854+00
26f8872e-52a2-4b96-887d-cc7dc3419edf	059ecdc9-7bfd-4b97-85ce-4b501d15a642	A	asdasd [KUNCI: TEPAT]	t	1	2026-09-23 15:41:56.523044+00	2026-09-23 15:41:56.523044+00
ae0d85bf-5577-4581-b289-81306113cd28	059ecdc9-7bfd-4b97-85ce-4b501d15a642	B	asdasd [KUNCI: TIDAK TEPAT]	t	2	2026-09-23 15:41:56.635086+00	2026-09-23 15:41:56.635086+00
52738194-af12-44be-b25c-ef5dd67b0131	059ecdc9-7bfd-4b97-85ce-4b501d15a642	C	asdasd [KUNCI: TEPAT]	t	3	2026-09-23 15:41:56.737089+00	2026-09-23 15:41:56.737089+00
9e03e48e-bf60-4bdc-a4f7-211e53e51e38	059ecdc9-7bfd-4b97-85ce-4b501d15a642	D	asdads [KUNCI: TIDAK TEPAT]	t	4	2026-09-23 15:41:56.839724+00	2026-09-23 15:41:56.839724+00
7d50ced1-4495-45dc-99a7-fd337493c7fa	2e4adbce-9333-4ed8-ac80-3d6dc6cceaf7	A	asdasd [KUNCI: BENAR]	t	1	2026-09-23 15:41:57.760829+00	2026-09-23 15:41:57.760829+00
1ad5cce2-44a5-4eb0-a73d-90cb195f0622	2e4adbce-9333-4ed8-ac80-3d6dc6cceaf7	B	asdads [KUNCI: SALAH]	t	2	2026-09-23 15:41:57.809952+00	2026-09-23 15:41:57.809952+00
eb0954f3-131a-4023-8707-d974339b094d	2e4adbce-9333-4ed8-ac80-3d6dc6cceaf7	C	asdasd [KUNCI: BENAR]	t	3	2026-09-23 15:41:57.862522+00	2026-09-23 15:41:57.862522+00
1e297a55-ede7-4b49-b172-ea4139c0ceb8	2e4adbce-9333-4ed8-ac80-3d6dc6cceaf7	D	asdasd [KUNCI: SALAH]	t	4	2026-09-23 15:41:57.966057+00	2026-09-23 15:41:57.966057+00
662d6a5c-889c-446f-a1c8-67951ee70156	939e6bb7-af2b-49b6-9fbc-224d14e4ab94	A	asdasd [KUNCI: TEPAT]	t	1	2026-09-23 15:44:40.996036+00	2026-09-23 15:44:40.996036+00
9b3567c3-b70f-42e2-849d-2d48a7d911b2	939e6bb7-af2b-49b6-9fbc-224d14e4ab94	B	asdasd [KUNCI: TIDAK TEPAT]	t	2	2026-09-23 15:44:41.088076+00	2026-09-23 15:44:41.088076+00
859389bf-981e-43e8-bc43-010d8521093c	939e6bb7-af2b-49b6-9fbc-224d14e4ab94	C	asdasd [KUNCI: TEPAT]	t	3	2026-09-23 15:44:41.143022+00	2026-09-23 15:44:41.143022+00
efe6ec82-27ba-4558-9de9-334e1dc93295	939e6bb7-af2b-49b6-9fbc-224d14e4ab94	D	asdads [KUNCI: TIDAK TEPAT]	t	4	2026-09-23 15:44:41.197065+00	2026-09-23 15:44:41.197065+00
b9e6c64e-567b-4223-9193-fd3a93e0d2d5	ca0f2713-6e49-4385-83ff-3d2a32c9df38	A	asdasd [KUNCI: BENAR]	t	1	2026-09-23 15:44:42.219565+00	2026-09-23 15:44:42.219565+00
98f2cbb8-ebf0-4e29-848c-60117a2807aa	ca0f2713-6e49-4385-83ff-3d2a32c9df38	B	asdads [KUNCI: SALAH]	t	2	2026-09-23 15:44:42.322587+00	2026-09-23 15:44:42.322587+00
b5cbc9de-d1e1-4d07-853b-a978b2e84063	ca0f2713-6e49-4385-83ff-3d2a32c9df38	C	asdasd [KUNCI: BENAR]	t	3	2026-09-23 15:44:42.424425+00	2026-09-23 15:44:42.424425+00
3d422ee8-308d-4409-b465-ae147af02e46	ca0f2713-6e49-4385-83ff-3d2a32c9df38	D	asdasd [KUNCI: SALAH]	t	4	2026-09-23 15:44:42.526497+00	2026-09-23 15:44:42.526497+00
02794c27-a4c9-4238-9d65-4037be981fc5	39e9cfa9-ecf9-47c4-a3dc-097178820aff	A	asdasd	t	1	2026-09-23 15:44:43.653185+00	2026-09-23 15:44:43.653185+00
402c33df-ce2d-4e1a-beec-5ff36590dea0	39e9cfa9-ecf9-47c4-a3dc-097178820aff	B	asdasd	f	2	2026-09-23 15:44:43.75581+00	2026-09-23 15:44:43.75581+00
6cbfb78d-e17f-499b-99f2-49d527f5e5dc	39e9cfa9-ecf9-47c4-a3dc-097178820aff	C	asdasd	f	3	2026-09-23 15:44:43.858379+00	2026-09-23 15:44:43.858379+00
590f2e92-273f-4e16-8da4-d2f9d750632f	39e9cfa9-ecf9-47c4-a3dc-097178820aff	D	asdasd	f	4	2026-09-23 15:44:43.960992+00	2026-09-23 15:44:43.960992+00
815c5927-5362-4ad2-8e21-718a22587b05	e9232f01-bf4c-4f5d-b27e-5d15063d8b8c	A	asdasd	t	1	2026-09-23 15:44:44.93523+00	2026-09-23 15:44:44.93523+00
8cecf92c-16e2-446a-b0f7-91bd2d4f31f3	e9232f01-bf4c-4f5d-b27e-5d15063d8b8c	B	asdasd	t	2	2026-09-23 15:44:44.989117+00	2026-09-23 15:44:44.989117+00
4cf5fdd8-b0cb-4a5f-9045-9351b45a67db	e9232f01-bf4c-4f5d-b27e-5d15063d8b8c	C	asdads	f	3	2026-09-23 15:44:45.081956+00	2026-09-23 15:44:45.081956+00
21833c38-06b0-4c5f-83cd-c4cc2e48ea62	e9232f01-bf4c-4f5d-b27e-5d15063d8b8c	D	asdasd	t	4	2026-09-23 15:44:45.135956+00	2026-09-23 15:44:45.135956+00
636905fd-f075-4238-8dc5-590d16dfe209	e9232f01-bf4c-4f5d-b27e-5d15063d8b8c	E	asdasd	f	5	2026-09-23 15:44:45.190213+00	2026-09-23 15:44:45.190213+00
f2e64723-b1d0-4190-8f3e-308360b73c63	138e7334-0505-429d-a399-e28418fbb0ac	A	asdads [KUNCI: SALAH]	t	1	2026-09-23 15:44:46.105225+00	2026-09-23 15:44:46.105225+00
6659db52-8979-41f6-8451-4eeb589b2d34	138e7334-0505-429d-a399-e28418fbb0ac	B	asdasd [KUNCI: SALAH]	t	2	2026-09-23 15:44:46.212937+00	2026-09-23 15:44:46.212937+00
0071fba2-f6a0-4c0b-915b-7860a16e7ddc	138e7334-0505-429d-a399-e28418fbb0ac	C	asdasd [KUNCI: SALAH]	t	3	2026-09-23 15:44:46.315262+00	2026-09-23 15:44:46.315262+00
39013f62-4206-4240-9ca5-01411b453b12	138e7334-0505-429d-a399-e28418fbb0ac	D	asdasd [KUNCI: SALAH]	t	4	2026-09-23 15:44:46.368897+00	2026-09-23 15:44:46.368897+00
e48fd24f-45e8-422e-a814-0b532dde0dd2	afc043b3-bb56-4ed7-b4c9-dff438aad899	A	asdasd [KUNCI: TIDAK TEPAT]	t	1	2026-09-23 15:44:47.067472+00	2026-09-23 15:44:47.067472+00
ef4fbcda-ccc0-4abb-a935-0c68b40fdfc4	afc043b3-bb56-4ed7-b4c9-dff438aad899	B	asdasd [KUNCI: TEPAT]	t	2	2026-09-23 15:44:47.129332+00	2026-09-23 15:44:47.129332+00
ee0f6d4e-4e90-41e8-bc53-7086b9b37589	afc043b3-bb56-4ed7-b4c9-dff438aad899	C	asdasds [KUNCI: TEPAT]	t	3	2026-09-23 15:44:47.183353+00	2026-09-23 15:44:47.183353+00
21e1de0f-b01d-4e10-ae86-de1b86317703	afc043b3-bb56-4ed7-b4c9-dff438aad899	D	asdasd [KUNCI: TIDAK TEPAT]	t	4	2026-09-23 15:44:47.339684+00	2026-09-23 15:44:47.339684+00
5793d4a4-0045-487a-8bee-d2a24e6ece00	ae47dce0-f370-4050-a5e7-d0a27277a414	A	asdasd [KUNCI: BENAR]	t	1	2026-09-23 15:44:48.363626+00	2026-09-23 15:44:48.363626+00
564890f8-d804-4ef6-81d0-9f56f54293ba	ae47dce0-f370-4050-a5e7-d0a27277a414	B	asdasd [KUNCI: SALAH]	t	2	2026-09-23 15:44:48.465974+00	2026-09-23 15:44:48.465974+00
f559f819-13fa-44f2-ae69-ae64b8e83ce2	ae47dce0-f370-4050-a5e7-d0a27277a414	C	asdasd [KUNCI: SALAH]	t	3	2026-09-23 15:44:48.568159+00	2026-09-23 15:44:48.568159+00
9755e4ee-9120-465d-b971-509e66b8719f	ae47dce0-f370-4050-a5e7-d0a27277a414	D	asdasd [KUNCI: SALAH]	t	4	2026-09-23 15:44:48.669975+00	2026-09-23 15:44:48.669975+00
a45f43b3-49ee-4f79-bd34-362ac44f260b	37b33e7f-4016-4cfd-a9e0-eb1f33896527	A	asdasd	f	1	2026-09-23 15:44:49.539048+00	2026-09-23 15:44:49.539048+00
3948c4f6-b4c7-42fb-a094-15abd3fe324b	37b33e7f-4016-4cfd-a9e0-eb1f33896527	B	asdasd	f	2	2026-09-23 15:44:49.593295+00	2026-09-23 15:44:49.593295+00
5efc8358-2986-47b4-985e-af60ef252cfa	37b33e7f-4016-4cfd-a9e0-eb1f33896527	C	asdasd	t	3	2026-09-23 15:44:49.69481+00	2026-09-23 15:44:49.69481+00
c843c471-987f-49ca-95ba-7a5aed3f2f88	37b33e7f-4016-4cfd-a9e0-eb1f33896527	D	asdasd	f	4	2026-09-23 15:44:49.797357+00	2026-09-23 15:44:49.797357+00
05062331-b375-4ae2-ba95-617898fe7dc2	8a9d3b1f-2724-4193-9caf-71b7de257627	A	asdasd	t	1	2026-09-23 15:44:50.671605+00	2026-09-23 15:44:50.671605+00
ef8ff77c-7ba2-45a1-979e-ed0def86a14b	8a9d3b1f-2724-4193-9caf-71b7de257627	B	asdasdas	f	2	2026-09-23 15:44:50.726521+00	2026-09-23 15:44:50.726521+00
2bfe82c3-bb91-42ad-9286-b08952e9dc82	8a9d3b1f-2724-4193-9caf-71b7de257627	C	asdads	t	3	2026-09-23 15:44:50.817274+00	2026-09-23 15:44:50.817274+00
58e874c9-4abe-47f1-8fa0-b09a74c33058	8a9d3b1f-2724-4193-9caf-71b7de257627	D	asdasd	t	4	2026-09-23 15:44:50.871681+00	2026-09-23 15:44:50.871681+00
44cb5820-376c-4737-891d-0b804f0c2675	8a9d3b1f-2724-4193-9caf-71b7de257627	E	asasdasd	f	5	2026-09-23 15:44:50.925792+00	2026-09-23 15:44:50.925792+00
b3a52e93-8b68-4b46-9d55-94875f7cd2ac	5b8dc496-4c06-4270-9da4-7148aa3cefef	A	asdasd	t	1	2026-09-23 15:44:51.742216+00	2026-09-23 15:44:51.742216+00
3152cae4-a957-4f2e-9c9d-918f5e8e88d6	5b8dc496-4c06-4270-9da4-7148aa3cefef	B	asdasd	t	2	2026-09-23 15:44:51.840137+00	2026-09-23 15:44:51.840137+00
7d9f5705-fdfb-450a-85f3-363b7fd346d3	5b8dc496-4c06-4270-9da4-7148aa3cefef	C	asdads	f	3	2026-09-23 15:44:51.948515+00	2026-09-23 15:44:51.948515+00
7fcaf537-9bbd-475d-8c41-1c10cc777c0d	5b8dc496-4c06-4270-9da4-7148aa3cefef	D	asdasd	f	4	2026-09-23 15:44:52.002429+00	2026-09-23 15:44:52.002429+00
d9fac868-6f78-4643-8c22-15971d7927bb	7fc19fd7-107f-4e50-89c3-001d188312a7	A	asdasd	t	1	2026-09-23 15:44:52.766817+00	2026-09-23 15:44:52.766817+00
22daf9a9-32ac-43fe-be58-6562cfedb863	7fc19fd7-107f-4e50-89c3-001d188312a7	B	asdasd	t	2	2026-09-23 15:44:52.860589+00	2026-09-23 15:44:52.860589+00
c35bb2e1-40bc-48c0-8206-499f583d9031	7fc19fd7-107f-4e50-89c3-001d188312a7	C	asdasd	f	3	2026-09-23 15:44:52.971938+00	2026-09-23 15:44:52.971938+00
0a28e25e-2304-494f-bfc9-dd9151a57aba	7fc19fd7-107f-4e50-89c3-001d188312a7	D	asdasd	f	4	2026-09-23 15:44:53.073957+00	2026-09-23 15:44:53.073957+00
a2644d30-babf-401b-ae13-e94b2dbbc0d6	7d011732-3523-4bcf-aa8a-3e4d8461785f	A	asdasd [KUNCI: SETUJU]	t	1	2026-09-23 15:44:53.994889+00	2026-09-23 15:44:53.994889+00
c6b4d011-edc5-495e-a920-b7c13efd3b80	7d011732-3523-4bcf-aa8a-3e4d8461785f	B	asdasd [KUNCI: TIDAK SETUJU]	t	2	2026-09-23 15:44:54.098626+00	2026-09-23 15:44:54.098626+00
92192bf5-a413-43ba-a8a8-54c0967221c1	7d011732-3523-4bcf-aa8a-3e4d8461785f	C	asdasd [KUNCI: SETUJU]	t	3	2026-09-23 15:44:54.199871+00	2026-09-23 15:44:54.199871+00
531d13b6-7fce-4cf1-813a-a7dee95819e7	7d011732-3523-4bcf-aa8a-3e4d8461785f	D	asdads [KUNCI: TIDAK SETUJU]	t	4	2026-09-23 15:44:54.254048+00	2026-09-23 15:44:54.254048+00
44dcb226-300b-4a4c-a918-cd83627c0824	88a3d3b8-2286-4894-a196-0765f1d9816e	A	asdasd	f	1	2026-09-27 05:05:01.14517+00	2026-09-27 05:05:01.14517+00
05aa2aea-c168-4fc8-b302-01444e15474b	88a3d3b8-2286-4894-a196-0765f1d9816e	B	asdasd	t	2	2026-09-27 05:05:01.231113+00	2026-09-27 05:05:01.231113+00
af2b581d-16fa-45e3-ba1f-cc41f3c178ad	88a3d3b8-2286-4894-a196-0765f1d9816e	C	asdasd	f	3	2026-09-27 05:05:01.3344+00	2026-09-27 05:05:01.3344+00
03a24d98-0e13-40ed-889e-2842977e9842	88a3d3b8-2286-4894-a196-0765f1d9816e	D	asddas	f	4	2026-09-27 05:05:01.435976+00	2026-09-27 05:05:01.435976+00
e6bfe245-c8b4-4935-8d92-222deeed4dc3	2a6cfb98-939b-481c-bed8-b0577e0c02b6	A	asdads	f	1	2026-09-27 05:44:44.892188+00	2026-09-27 05:44:44.892188+00
b9dc2ff8-90e9-429d-a4fd-d8d958752f07	7acc58ec-1d7f-4f2f-aec7-2e9df230ab51	A	asdasd	t	1	2026-09-23 15:44:39.762088+00	2026-09-23 15:44:39.762088+00
0cf843fb-7ca7-4e77-8a9e-7306044f812f	7acc58ec-1d7f-4f2f-aec7-2e9df230ab51	B	asdasd	t	2	2026-09-23 15:44:39.864107+00	2026-09-23 15:44:39.864107+00
bd8706b8-182e-409c-8559-6beda8ff22b3	7acc58ec-1d7f-4f2f-aec7-2e9df230ab51	C	asdasd	f	3	2026-09-23 15:44:39.966567+00	2026-09-23 15:44:39.966567+00
dac3dcc6-e08b-4738-b759-a9c37a9814d7	7acc58ec-1d7f-4f2f-aec7-2e9df230ab51	D	asdasd	f	4	2026-09-23 15:44:40.06895+00	2026-09-23 15:44:40.06895+00
e1448a57-8d74-4b70-932b-c6181125f280	f49f136b-d0b0-4588-aa0d-aa549e9e7647	A	asdasd	t	1	2026-09-23 15:44:37.303968+00	2026-09-23 15:44:37.303968+00
f6c74874-c4ad-4f26-b0de-957e122efb96	f49f136b-d0b0-4588-aa0d-aa549e9e7647	B	adsasd	f	2	2026-09-23 15:44:37.357928+00	2026-09-23 15:44:37.357928+00
b2b2fb76-1f00-4a99-bb96-c76398dff053	f49f136b-d0b0-4588-aa0d-aa549e9e7647	C	asdasd	f	3	2026-09-23 15:44:37.41153+00	2026-09-23 15:44:37.41153+00
4a9078ff-9672-42b7-87d7-898e8be22b53	f49f136b-d0b0-4588-aa0d-aa549e9e7647	D	asdasd	f	4	2026-09-23 15:44:37.466018+00	2026-09-23 15:44:37.466018+00
f3f9b113-23c6-42bb-b0dd-a193b5bcf46f	2a6cfb98-939b-481c-bed8-b0577e0c02b6	B	asdasd	t	2	2026-09-27 05:44:44.994899+00	2026-09-27 05:44:44.994899+00
633bf72e-f68e-4a4c-b4ff-37e4388fdaaf	2a6cfb98-939b-481c-bed8-b0577e0c02b6	C	asdasd	f	3	2026-09-27 05:44:45.09715+00	2026-09-27 05:44:45.09715+00
9adc7e7d-e9f7-4896-b285-7c20752f5988	2a6cfb98-939b-481c-bed8-b0577e0c02b6	D	asdasd	f	4	2026-09-27 05:44:45.199744+00	2026-09-27 05:44:45.199744+00
c99880ab-521b-46d6-a8d1-ebf241f1bd0a	d3ea9b84-8c35-42df-8d9a-586efd7f94c4	A	adsasd [KUNCI: SETUJU]	t	1	2026-09-27 05:44:46.735424+00	2026-09-27 05:44:46.735424+00
48372b9b-04f8-4aee-90f0-18195c8dd733	d3ea9b84-8c35-42df-8d9a-586efd7f94c4	B	asdasd [KUNCI: TIDAK SETUJU]	t	2	2026-09-27 05:44:46.837927+00	2026-09-27 05:44:46.837927+00
b3aa9a0d-47ed-40ff-ab54-8f5284a0cba8	d3ea9b84-8c35-42df-8d9a-586efd7f94c4	C	asdasd [KUNCI: TIDAK SETUJU]	t	3	2026-09-27 05:44:46.940474+00	2026-09-27 05:44:46.940474+00
b3cbf996-a2c6-421d-9958-fc39c5963f57	d3ea9b84-8c35-42df-8d9a-586efd7f94c4	D	asdasd [KUNCI: TIDAK SETUJU]	t	4	2026-09-27 05:44:47.042731+00	2026-09-27 05:44:47.042731+00
a77904bd-d923-4216-b5d9-822baa10031a	dbfa6723-f73f-49f5-bd61-3298a4a8e93b	A	asdads	t	1	2026-09-27 08:20:44.346707+00	2026-09-27 08:20:44.346707+00
789f0396-6399-425e-b2fc-f0c1e34e3757	dbfa6723-f73f-49f5-bd61-3298a4a8e93b	B	asdasd	f	2	2026-09-27 08:20:44.448608+00	2026-09-27 08:20:44.448608+00
2559d449-c15f-4a72-bf99-ba2c2511d402	dbfa6723-f73f-49f5-bd61-3298a4a8e93b	C	asdasd	f	3	2026-09-27 08:20:44.551038+00	2026-09-27 08:20:44.551038+00
b8f59dfe-fc43-4243-b802-149e3af91917	dbfa6723-f73f-49f5-bd61-3298a4a8e93b	D	asdasd	f	4	2026-09-27 08:20:44.653541+00	2026-09-27 08:20:44.653541+00
a646d06f-2534-4d36-a7fe-20ab154b5328	6746468b-df32-46e4-ae24-7ff53b8710c3	A	 [KUNCI: SETUJU]	t	1	2026-09-27 08:20:46.085018+00	2026-09-27 08:20:46.085018+00
2a026568-07a6-44d9-8d75-200f945757e7	6746468b-df32-46e4-ae24-7ff53b8710c3	B	 [KUNCI: SETUJU]	t	2	2026-09-27 08:20:46.184545+00	2026-09-27 08:20:46.184545+00
da60bfe3-f093-4bfb-8a48-7a156a4a69c5	6746468b-df32-46e4-ae24-7ff53b8710c3	C	 [KUNCI: TIDAK SETUJU]	t	3	2026-09-27 08:20:46.287432+00	2026-09-27 08:20:46.287432+00
4f900f8a-5764-495e-8da8-2a6d1f0c1809	6746468b-df32-46e4-ae24-7ff53b8710c3	D	 [KUNCI: TIDAK SETUJU]	t	4	2026-09-27 08:20:46.394648+00	2026-09-27 08:20:46.394648+00
95e903f4-c75d-4065-ab89-2333780e1b59	c6115406-272a-4de9-8e2d-cbf14afed157	A	asdads	t	1	2026-09-27 08:21:10.150819+00	2026-09-27 08:21:10.150819+00
3571e7c8-53ef-4cc4-a73a-2afc5379b7dc	c6115406-272a-4de9-8e2d-cbf14afed157	B	asdasd	f	2	2026-09-27 08:21:10.25212+00	2026-09-27 08:21:10.25212+00
11e1910c-abfd-4b3b-8e9f-a5cfaa62fe5b	c6115406-272a-4de9-8e2d-cbf14afed157	C	asdasd	f	3	2026-09-27 08:21:10.354524+00	2026-09-27 08:21:10.354524+00
ded42dca-419c-4823-915a-07c7182d8a20	c6115406-272a-4de9-8e2d-cbf14afed157	D	asdasd	f	4	2026-09-27 08:21:10.457111+00	2026-09-27 08:21:10.457111+00
527678a1-1eab-4836-b180-224e72ff8ea1	7d50fc93-927c-4e5e-9c20-f5c33aa158be	A	BB [KUNCI: SETUJU]	t	1	2026-09-27 08:26:20.619968+00	2026-09-27 08:26:20.619968+00
2f98ac02-bc99-4770-98d9-689c6025c93b	7d50fc93-927c-4e5e-9c20-f5c33aa158be	B	B [KUNCI: SETUJU]	t	2	2026-09-27 08:26:20.675117+00	2026-09-27 08:26:20.675117+00
05bc63cc-3107-4c1c-9752-c47d16358713	7d50fc93-927c-4e5e-9c20-f5c33aa158be	C	B [KUNCI: SETUJU]	t	3	2026-09-27 08:26:20.73046+00	2026-09-27 08:26:20.73046+00
457f0736-8bdd-4af8-8724-ed521b1d3397	7d50fc93-927c-4e5e-9c20-f5c33aa158be	D	B [KUNCI: SETUJU]	t	4	2026-09-27 08:26:20.819299+00	2026-09-27 08:26:20.819299+00
67c02df0-6ff1-4cfe-a93c-d9a1d9bcee39	7df26d31-e0e4-4fb1-9a18-9821397c5f64	A	S [KUNCI: TIDAK TEPAT]	t	1	2026-09-27 08:26:22.155054+00	2026-09-27 08:26:22.155054+00
888013ed-49aa-4303-82d7-2eff7999c8b0	7df26d31-e0e4-4fb1-9a18-9821397c5f64	B	S [KUNCI: TIDAK TEPAT]	t	2	2026-09-27 08:26:22.260228+00	2026-09-27 08:26:22.260228+00
288e21bd-c37c-45ec-b752-dd61e83ea470	7df26d31-e0e4-4fb1-9a18-9821397c5f64	C	S [KUNCI: TIDAK TEPAT]	t	3	2026-09-27 08:26:22.361614+00	2026-09-27 08:26:22.361614+00
931a801f-dc97-48c8-b0c1-1f1fde2ead0a	7df26d31-e0e4-4fb1-9a18-9821397c5f64	D	S [KUNCI: TIDAK TEPAT]	t	4	2026-09-27 08:26:22.46233+00	2026-09-27 08:26:22.46233+00
e9e17f8d-f3f3-4b3a-8db8-ecae1e669f22	82868389-0756-4b10-89df-d38fa65d2f1e	B	Ancaman - Peluang (Pertentangan)	t	2	2026-10-24 04:40:05.252434+00	2026-10-24 04:40:05.252434+00
acae3b92-6273-4c69-9590-643f449d9fac	82868389-0756-4b10-89df-d38fa65d2f1e	C	Proses - Hasil	f	3	2026-10-24 04:40:05.35472+00	2026-10-24 04:40:05.35472+00
5555d807-60af-4a88-a290-3e171f427d40	82868389-0756-4b10-89df-d38fa65d2f1e	D	Proses - Hasil	f	4	2026-10-24 04:40:05.457135+00	2026-10-24 04:40:05.457135+00
a1e61f23-fc64-49ed-93d5-d4c5e401a2fd	82868389-0756-4b10-89df-d38fa65d2f1e	E	Masalah - Masalah yang lebih besar	f	5	2026-10-24 04:40:05.559453+00	2026-10-24 04:40:05.559453+00
00c8d28d-bf76-4816-bceb-ed199e32a3cb	e39a881b-cf15-4599-98bf-bda0a1bc47c6	A	Setuju, karena teks telah membuktikan bahwa AI mengambil alih pekerjaan repetitif sehingga pekerja harus beralih ke ranah kreatif/kritis agar tetap relevan. [KUNCI: SETUJU]	t	1	2026-10-24 04:40:06.89088+00	2026-10-24 04:40:06.89088+00
2866c7c3-6625-4213-b35d-d4b941d37d2c	e39a881b-cf15-4599-98bf-bda0a1bc47c6	B	Tidak Setuju, karena pekerja kerah biru terbukti selalu bisa mempertahankan pekerjaan mereka tanpa perlu belajar literasi digital. [KUNCI: TIDAK SETUJU]	t	2	2026-10-24 04:40:06.993124+00	2026-10-24 04:40:06.993124+00
0a8b6e58-7edf-439b-a582-b179f8a0e8ac	e39a881b-cf15-4599-98bf-bda0a1bc47c6	C	Setuju, karena profesi baru yang bermunculan mutlak membutuhkan kolaborasi dengan teknologi cerdas. [KUNCI: SETUJU]	t	3	2026-10-24 04:40:07.095378+00	2026-10-24 04:40:07.095378+00
a4537c02-f6a4-4866-a079-e61e7a356221	1d1cc286-8aca-4f34-a355-61befc34b09b	B	Jagung	f	2	2026-10-24 04:39:44.77273+00	2026-10-24 04:39:44.77273+00
8297a140-aa40-46c1-9d58-f952a90e68b2	1d1cc286-8aca-4f34-a355-61befc34b09b	C	Sagu	t	3	2026-10-24 04:39:44.875131+00	2026-10-24 04:39:44.875131+00
d4a3ddd4-b923-4a30-99cc-551675a9af00	1d1cc286-8aca-4f34-a355-61befc34b09b	D	Singkong	f	4	2026-10-24 04:39:44.973094+00	2026-10-24 04:39:44.973094+00
c4f3f61b-c749-40ba-87a2-f552a223f478	1d1cc286-8aca-4f34-a355-61befc34b09b	E	Gandum	f	5	2026-10-24 04:39:45.080062+00	2026-10-24 04:39:45.080062+00
fc3fcfb0-49e6-4328-a67a-7c4a74036194	02ba1a6a-8ad2-4587-a92e-9cbc74cef20b	A	Opsi A	t	1	2026-09-23 15:44:38.528251+00	2026-09-23 15:44:38.528251+00
0d10d6bd-a551-4591-b7e8-af71ca85bdf8	02ba1a6a-8ad2-4587-a92e-9cbc74cef20b	B	Opsi B	t	2	2026-09-23 15:44:38.63535+00	2026-09-23 15:44:38.63535+00
488a21f1-3162-4ee9-bffe-b75d39250d5b	08818873-e533-483b-b5d5-42190b4434d2	D	Kue	f	4	2026-11-08 13:25:01.228498+00	2026-11-08 13:25:01.228498+00
d5bb5a6f-4443-4a0d-a395-963bb422cd86	08818873-e533-483b-b5d5-42190b4434d2	E	Sisir	f	5	2026-11-08 13:25:01.279114+00	2026-11-08 13:25:01.279114+00
b125a07d-b906-4f66-af1b-c1e8362f3531	faa6ca56-c2f2-43b6-92a2-887ab3c9e78a	A	Makanan [KUNCI: BENAR]	t	1	2026-11-08 13:25:02.050486+00	2026-11-08 13:25:02.050486+00
7c2e1a1d-363e-422f-9c48-462153f6acf5	faa6ca56-c2f2-43b6-92a2-887ab3c9e78a	B	Padi [KUNCI: BENAR]	t	2	2026-11-08 13:25:02.102162+00	2026-11-08 13:25:02.102162+00
d67af76f-3c6a-4c0c-9810-aafe9be5b4c2	faa6ca56-c2f2-43b6-92a2-887ab3c9e78a	C	Hewan [KUNCI: SALAH]	t	3	2026-11-08 13:25:02.15417+00	2026-11-08 13:25:02.15417+00
719e7e95-8af8-4d3c-8a7d-fe0fb5dd3c0a	85351a72-7b38-4bce-a344-1c69598ad8fc	A	<ol type="A" style="color: rgb(0, 0, 0); font-size: medium;"><li><p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><font color="#000000"><font face="Aptos, serif">bergerak bersama&nbsp;</font></font></p></li></ol>	t	1	2026-10-21 08:11:00.520176+00	2026-10-21 08:11:00.520176+00
d32e101b-292f-4241-ada4-34ac83fce7f7	85351a72-7b38-4bce-a344-1c69598ad8fc	B	<ol type="A" style="color: rgb(0, 0, 0); font-size: medium;"><li><p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><font color="#000000"><font face="Aptos, serif">melangkah cepat</font></font></p></li></ol>	f	2	2026-10-21 08:11:00.621772+00	2026-10-21 08:11:00.621772+00
be2a2fe6-b8ed-4ee4-925e-dd79513862fe	85351a72-7b38-4bce-a344-1c69598ad8fc	C	<ol type="A" style="color: rgb(0, 0, 0); font-size: medium;"><li><p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><font color="#000000"><font face="Aptos, serif">beradu cepat</font></font></p></li></ol>	f	3	2026-10-21 08:11:00.724443+00	2026-10-21 08:11:00.724443+00
1eda0dcf-0080-450e-88bd-e7a7a0cfcc6b	85351a72-7b38-4bce-a344-1c69598ad8fc	D	<ol type="A" style="color: rgb(0, 0, 0); font-size: medium;"><li><p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><font color="#000000"><font face="Aptos, serif">mengatur bersama</font></font></p></li></ol>	f	4	2026-10-21 08:11:00.82687+00	2026-10-21 08:11:00.82687+00
9fe69914-7d80-42de-9d24-bbe692b7e666	02ba1a6a-8ad2-4587-a92e-9cbc74cef20b	C	Opsi C	f	3	2026-09-23 15:44:38.737424+00	2026-09-23 15:44:38.737424+00
a17ebee3-ebcc-4421-b011-1483dd82ca78	02ba1a6a-8ad2-4587-a92e-9cbc74cef20b	D	Opsi D	f	4	2026-09-23 15:44:38.841497+00	2026-09-23 15:44:38.841497+00
84f432ea-9c2e-4b71-9303-fe6ad1bd4b9c	85351a72-7b38-4bce-a344-1c69598ad8fc	E	<ol type="A" style="color: rgb(0, 0, 0); font-size: medium;"><li><p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><font color="#000000"><font face="Aptos, serif">berpikir bersama</font></font></p></li></ol>	f	5	2026-10-21 08:11:00.929514+00	2026-10-21 08:11:00.929514+00
5b417d7d-3ec3-4f86-ae6c-6635c946ec8f	50781746-0671-4ef5-8c3c-73ebe48fa3e2	A	<ol type="A" style="color: rgb(0, 0, 0); font-size: medium;"><li><p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><font color="#000000"><font face="Aptos, serif">Ancaman plastik terhadap lautan.</font></font></p></li></ol>	t	1	2026-10-21 08:11:02.670513+00	2026-10-21 08:11:02.670513+00
dd819d31-9f4f-4b02-966f-ed061635d405	50781746-0671-4ef5-8c3c-73ebe48fa3e2	B	<ol type="A" style="color: rgb(0, 0, 0); font-size: medium;"><li><p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><font color="#000000"><font face="Aptos, serif">Efek dari pemanasan laut.</font></font></p></li></ol>	f	2	2026-10-21 08:11:02.77238+00	2026-10-21 08:11:02.77238+00
c5288345-af13-4046-afc9-bf42934056a1	50781746-0671-4ef5-8c3c-73ebe48fa3e2	C	<ol type="A" style="color: rgb(0, 0, 0); font-size: medium;"><li><p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><font color="#000000"><font face="Aptos, serif">Kadar tingkat keasaman laut.</font></font></p></li></ol>	f	3	2026-10-21 08:11:02.875528+00	2026-10-21 08:11:02.875528+00
1864ba94-159b-4877-8fac-14e8322361b9	50781746-0671-4ef5-8c3c-73ebe48fa3e2	D	<ol type="A" style="color: rgb(0, 0, 0); font-size: medium;"><li><p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><font color="#000000"><font face="Aptos, serif">Pemompaan CO</font></font><font color="#000000"><sub><font face="Aptos, serif">2</font></sub></font><font color="#000000"><font face="Aptos, serif"> ke atmosfer.</font></font></p></li></ol>	f	4	2026-10-21 08:11:02.977388+00	2026-10-21 08:11:02.977388+00
076891a4-ec25-472a-950c-9c9f0ef58849	50781746-0671-4ef5-8c3c-73ebe48fa3e2	E	<ol type="A" style="color: rgb(0, 0, 0); font-size: medium;"><li><p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><font color="#000000"><font face="Aptos, serif">Ancaman bagi negara berkembang.</font></font></p></li></ol>	f	5	2026-10-21 08:11:03.079663+00	2026-10-21 08:11:03.079663+00
86ae1949-7606-44ba-9ba9-8efc8d5434b8	2bdc7711-0365-46a0-8bc4-d40235bd409f	A	<ol type="A" style="color: rgb(0, 0, 0); font-size: medium;"><li><p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><font color="#000000"><font face="Aptos, serif">Sampah plastik di laut akan lebih banyak daripada jumlah ikan.</font></font></p></li></ol>	t	1	2026-10-21 08:11:04.922456+00	2026-10-21 08:11:04.922456+00
6ea427d8-1a2e-4606-8440-0fc6cded4ea9	2bdc7711-0365-46a0-8bc4-d40235bd409f	B	<ol type="A" style="color: rgb(0, 0, 0); font-size: medium;"><li><p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><font color="#000000"><font face="Aptos, serif">Lautan akan terus mengalami pemanasan dan semakin asam.</font></font></p></li></ol>	f	2	2026-10-21 08:11:05.025344+00	2026-10-21 08:11:05.025344+00
44df9140-ab68-45cd-9115-5440cf92c86f	2bdc7711-0365-46a0-8bc4-d40235bd409f	C	<ol type="A" style="color: rgb(0, 0, 0); font-size: medium;"><li><p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><font color="#000000"><font face="Aptos, serif">Manusia terus memompa lebih banyak CO</font></font><font color="#000000"><sub><font face="Aptos, serif">2</font></sub></font><font color="#000000"><font face="Aptos, serif"> ke atmosfer.</font></font></p></li></ol>	f	3	2026-10-21 08:11:05.12776+00	2026-10-21 08:11:05.12776+00
5444625a-e916-42b9-86bc-c461f46aa503	2bdc7711-0365-46a0-8bc4-d40235bd409f	D	<p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; color: rgb(0, 0, 0); font-size: medium; text-indent: -0.25in; margin-left: 0.3in;"><font color="#000000"><font face="Aptos, serif">Jumlah ikan yang terancam punah semakin banyak.</font></font></p>	f	4	2026-10-21 08:11:05.230144+00	2026-10-21 08:11:05.230144+00
3c312766-4e6f-44ea-9e23-2ca26ce9326a	2bdc7711-0365-46a0-8bc4-d40235bd409f	E	<ol type="A" style="color: rgb(0, 0, 0); font-size: medium;"><li><p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><font color="#000000"><font face="Aptos, serif">Penggunaan plastik terus meningkat dan tidak dikelola dengan baik.</font></font></p></li></ol>	t	5	2026-10-21 08:11:05.332755+00	2026-10-21 08:11:05.332755+00
feafe5cb-4f71-4fad-a5b6-5b508d234032	f4e39d71-a83a-459d-82a5-dddbcc337f15	A	<ol type="A" style="color: rgb(0, 0, 0); font-size: medium;"><li><p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><font color="#000000"><font face="Aptos, serif">bergerak bersama&nbsp;</font></font></p></li></ol>	t	1	2026-10-21 08:25:47.509145+00	2026-10-21 08:25:47.509145+00
836f3f08-8b23-42c1-b740-7994324aa321	f4e39d71-a83a-459d-82a5-dddbcc337f15	B	<ol type="A" style="color: rgb(0, 0, 0); font-size: medium;"><li><p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><font color="#000000"><font face="Aptos, serif">melangkah cepat</font></font></p></li></ol>	f	2	2026-10-21 08:25:47.606397+00	2026-10-21 08:25:47.606397+00
ae123034-00d9-4a53-8c10-5fbb7b1ae4e7	f4e39d71-a83a-459d-82a5-dddbcc337f15	C	<ol type="A" style="color: rgb(0, 0, 0); font-size: medium;"><li><p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><font color="#000000"><font face="Aptos, serif">beradu cepat</font></font></p></li></ol>	f	3	2026-10-21 08:25:47.714121+00	2026-10-21 08:25:47.714121+00
5e22d976-8638-46e4-8dac-2ebed07cdf02	1d1cc286-8aca-4f34-a355-61befc34b09b	A	Padi	f	1	2026-10-24 04:39:44.670227+00	2026-10-24 04:39:44.670227+00
b8b578ca-44b8-4806-b515-eae2141ed4dc	f4e39d71-a83a-459d-82a5-dddbcc337f15	D	<ol type="A" style="color: rgb(0, 0, 0); font-size: medium;"><li><p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><font color="#000000"><font face="Aptos, serif">mengatur bersama</font></font></p></li></ol>	f	4	2026-10-21 08:25:47.816574+00	2026-10-21 08:25:47.816574+00
29fe9bf8-2717-475b-9d27-b176b85e1c51	f4e39d71-a83a-459d-82a5-dddbcc337f15	E	<ol type="A" style="color: rgb(0, 0, 0); font-size: medium;"><li><p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><font color="#000000"><font face="Aptos, serif">berpikir bersama</font></font></p></li></ol>	f	5	2026-10-21 08:25:47.91883+00	2026-10-21 08:25:47.91883+00
90474286-1c2f-4394-b9be-60a3d951700d	0d7e6daf-3575-4a61-840d-b66acd132f41	A	<ol type="A" style="color: rgb(0, 0, 0); font-size: medium;"><li><p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><font color="#000000"><font face="Aptos, serif">Ancaman plastik terhadap lautan.</font></font></p></li></ol>	t	1	2026-10-21 08:25:50.17215+00	2026-10-21 08:25:50.17215+00
d9925976-e162-4af2-832b-34065503a034	0d7e6daf-3575-4a61-840d-b66acd132f41	B	<ol type="A" style="color: rgb(0, 0, 0); font-size: medium;"><li><p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><font color="#000000"><font face="Aptos, serif">Efek dari pemanasan laut.</font></font></p></li></ol>	f	2	2026-10-21 08:25:50.272634+00	2026-10-21 08:25:50.272634+00
d9904aaf-041e-4d2c-83bd-956d2207dea2	0d7e6daf-3575-4a61-840d-b66acd132f41	C	<ol type="A" style="color: rgb(0, 0, 0); font-size: medium;"><li><p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><font color="#000000"><font face="Aptos, serif">Kadar tingkat keasaman laut.</font></font></p></li></ol>	f	3	2026-10-21 08:25:50.376805+00	2026-10-21 08:25:50.376805+00
cf830452-559e-427b-877c-8bebbcbcd772	0d7e6daf-3575-4a61-840d-b66acd132f41	D	<ol type="A" style="color: rgb(0, 0, 0); font-size: medium;"><li><p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><font color="#000000"><font face="Aptos, serif">Pemompaan CO</font></font><font color="#000000"><sub><font face="Aptos, serif">2</font></sub></font><font color="#000000"><font face="Aptos, serif"> ke atmosfer.</font></font></p></li></ol>	f	4	2026-10-21 08:25:50.479096+00	2026-10-21 08:25:50.479096+00
207ddb81-9bff-4f92-bc14-b90f8bf88d83	0d7e6daf-3575-4a61-840d-b66acd132f41	E	<ol type="A" style="color: rgb(0, 0, 0); font-size: medium;"><li><p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><font color="#000000"><font face="Aptos, serif">Ancaman bagi negara berkembang.</font></font></p></li></ol>	f	5	2026-10-21 08:25:50.581902+00	2026-10-21 08:25:50.581902+00
5e4ff48b-0d1c-4b63-b524-e773a5934941	d5d155f9-933e-4171-a524-8a34a96996ec	A	<ol type="A" style="color: rgb(0, 0, 0); font-size: medium;"><li><p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><font color="#000000"><font face="Aptos, serif">Sampah plastik di laut akan lebih banyak daripada jumlah ikan.</font></font></p></li></ol>	t	1	2026-10-21 08:25:52.214872+00	2026-10-21 08:25:52.214872+00
f453167d-3bfb-437a-8c02-f911a1ecec46	d5d155f9-933e-4171-a524-8a34a96996ec	B	<ol type="A" style="color: rgb(0, 0, 0); font-size: medium;"><li><p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><font color="#000000"><font face="Aptos, serif">Lautan akan terus mengalami pemanasan dan semakin asam.</font></font></p></li></ol>	f	2	2026-10-21 08:25:52.322204+00	2026-10-21 08:25:52.322204+00
f5dd4335-6425-4649-b6e6-012422947d7c	d5d155f9-933e-4171-a524-8a34a96996ec	C	<ol type="A" style="color: rgb(0, 0, 0); font-size: medium;"><li><p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><font color="#000000"><font face="Aptos, serif">Manusia terus memompa lebih banyak CO</font></font><font color="#000000"><sub><font face="Aptos, serif">2</font></sub></font><font color="#000000"><font face="Aptos, serif"> ke atmosfer.</font></font></p></li></ol>	f	3	2026-10-21 08:25:52.406692+00	2026-10-21 08:25:52.406692+00
00bbd0ba-fae4-45f5-a4b6-4a2d1783da32	d5d155f9-933e-4171-a524-8a34a96996ec	D	<ol type="A" style="color: rgb(0, 0, 0); font-size: medium;"><li><p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><font color="#000000"><font face="Aptos, serif">Jumlah ikan yang terancam punah semakin banyak.</font></font></p></li></ol>	f	4	2026-10-21 08:25:52.527328+00	2026-10-21 08:25:52.527328+00
f616019f-74e4-41dc-b878-ed3f4f519fd6	d5d155f9-933e-4171-a524-8a34a96996ec	E	<ol type="A" style="color: rgb(0, 0, 0); font-size: medium;"><li><p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><font color="#000000"><font face="Aptos, serif">Penggunaan plastik terus meningkat dan tidak dikelola dengan baik</font></font></p></li></ol>	t	5	2026-10-21 08:25:52.629015+00	2026-10-21 08:25:52.629015+00
473870b3-2b7e-4270-98e5-775959049c0e	dd8b59b2-aed2-4227-943a-4d79e7f6d5e4	A	Menginformasikan kepada pembaca bahwa pemecahan masalah sampah merupakan tanggung jawab utama kita sebagai masyarakat sipil sehingga sulit untuk diselesaikan. [KUNCI: SALAH]	t	1	2026-10-21 08:25:54.058336+00	2026-10-21 08:25:54.058336+00
9feeb932-0041-4afa-93f3-a0e7f3bc0cf0	dd8b59b2-aed2-4227-943a-4d79e7f6d5e4	B	Menunjukkan kepada pembaca bahwa permasalahan sampah plastik sangat rumit dan tidak bisa diselesaikan dalam jangka waktu singkat. [KUNCI: BENAR]	t	2	2026-10-21 08:25:54.160843+00	2026-10-21 08:25:54.160843+00
2ddc69cd-5629-4064-9fe3-e10e4b0bebf4	dd8b59b2-aed2-4227-943a-4d79e7f6d5e4	C	Membuktikan kepada pembaca bahwa  permasalahan sampah yang rumit disebabkan pemecahan masalah yang bergantung pada perekonomian negara berkembang. [KUNCI: SALAH]	t	3	2026-10-21 08:25:54.267632+00	2026-10-21 08:25:54.267632+00
cf04e1d6-8a3c-4ba2-87ff-5c24c6e5dbdd	ffa235ae-99b8-43b5-a110-58ee143d2a72	E	Kreativitas dan kemampuan berempati dalam melayani klien.	t	5	2026-10-24 04:40:03.921364+00	2026-10-24 04:40:03.921364+00
95cc0102-f9e1-41da-843c-009083c8ff9b	bc8ba9f3-5fcc-441b-975a-75688de67e5e	A	Mengganti lahan gambut menjadi sawah padi.	f	1	2026-10-24 04:39:47.641091+00	2026-10-24 04:39:47.641091+00
bc0ee859-a796-40aa-b2f3-de69a6253d88	bc8ba9f3-5fcc-441b-975a-75688de67e5e	B	Mengolah singkong menjadi beras analog dan mi bebas gluten.	t	2	2026-10-24 04:39:47.742315+00	2026-10-24 04:39:47.742315+00
e49f04d4-71ea-43e5-8673-c3620293595e	bc8ba9f3-5fcc-441b-975a-75688de67e5e	C	Menjual sagu dalam bentuk kue-kue modern.	t	3	2026-10-24 04:39:47.844574+00	2026-10-24 04:39:47.844574+00
ec20a489-084a-43ae-94c7-3524f816a7b6	bc8ba9f3-5fcc-441b-975a-75688de67e5e	D	Mewajibkan seluruh masyarakat mengonsumsi jagung setiap pagi.	f	4	2026-10-24 04:39:47.947102+00	2026-10-24 04:39:47.947102+00
65b967c6-23a4-4e2d-9c04-6ff51c5c4a83	bc8ba9f3-5fcc-441b-975a-75688de67e5e	E	Menjadikan beras putih sebagai satu-satunya bahan makanan sehat.	f	5	2026-10-24 04:39:48.04935+00	2026-10-24 04:39:48.04935+00
316fcf7f-8ee0-40e5-8334-7f7f3956e155	7edd0484-71d3-49bd-a549-de8010bdfa5a	A	Paragraf 3 memaparkan akibat dari kegagalan inovasi di paragraf 2.	f	1	2026-10-24 04:39:49.176203+00	2026-10-24 04:39:49.176203+00
a1cd8323-8a0e-4f57-90d4-d0f060e5be40	7edd0484-71d3-49bd-a549-de8010bdfa5a	B	Paragraf 3 menjabarkan bentuk dukungan terhadap inovasi yang dibahas pada paragraf 2.	t	2	2026-10-24 04:39:49.278169+00	2026-10-24 04:39:49.278169+00
ca7bd1be-4c44-4c10-b8be-9cebcde23a16	7edd0484-71d3-49bd-a549-de8010bdfa5a	C	Paragraf 3 memberikan pandangan yang bertentangan dengan masalah pada paragraf 2.	f	3	2026-10-24 04:39:49.380738+00	2026-10-24 04:39:49.380738+00
a6b4c2fe-8f64-4917-bc88-ddbfe770b64d	7edd0484-71d3-49bd-a549-de8010bdfa5a	D	Paragraf 3 mengklasifikasikan jenis makanan kelas dua yang disebut di paragraf 2.	f	4	2026-10-24 04:39:49.483071+00	2026-10-24 04:39:49.483071+00
99b8f11a-d758-471f-bf83-c38d666ae4f1	7edd0484-71d3-49bd-a549-de8010bdfa5a	E	Paragraf 3 menyimpulkan bahwa beras tidak lagi dikonsumsi akibat inovasi di paragraf 2.	f	5	2026-10-24 04:39:49.585367+00	2026-10-24 04:39:49.585367+00
b473b568-8b13-4012-96af-cdb653cd3bfc	2f25a29a-d77b-49d6-9d0e-d2d7751eb52f	A	Argumen tepat karena teks telah memaparkan peran pemerintah (kebijakan/kolaborasi), UMKM (inovasi), dan perubahan pola pikir warga. [KUNCI: SETUJU]	t	1	2026-10-24 04:39:50.815375+00	2026-10-24 04:39:50.815375+00
8daad9f7-39ed-4ab2-9540-93ee9f71e7f8	2f25a29a-d77b-49d6-9d0e-d2d7751eb52f	B	Argumen tidak akurat karena penulis tidak menyertakan data persentase penurunan konsumsi beras secara nasional. [KUNCI: TIDAK SETUJU]	t	2	2026-10-24 04:39:50.912555+00	2026-10-24 04:39:50.912555+00
1d8d4293-6ab9-41da-b695-a38d1fa6bb8d	2f25a29a-d77b-49d6-9d0e-d2d7751eb52f	C	Argumen masuk akal karena sinergi berbagai pihak memang diperlukan untuk mengubah budaya konsumsi yang sudah mengakar. [KUNCI: SETUJU]	t	3	2026-10-24 04:39:51.014662+00	2026-10-24 04:39:51.014662+00
12999ff4-8032-4d65-b067-dfcbf3d9ff47	91c9c73d-4833-46d9-9562-8bdb71d3fdc9	A	Memperbaiki mesin perahu motor	f	1	2026-10-24 04:39:52.250664+00	2026-10-24 04:39:52.250664+00
3e03150c-3c57-43e9-8733-86e6949f7125	91c9c73d-4833-46d9-9562-8bdb71d3fdc9	B	Menambal jaring pukat yang koyak	t	2	2026-10-24 04:39:52.350112+00	2026-10-24 04:39:52.350112+00
52ff9b76-746d-45e5-98b6-427edb01342e	91c9c73d-4833-46d9-9562-8bdb71d3fdc9	C	Menghitung hasil tangkapan ikan tenggiri	f	3	2026-10-24 04:39:52.45255+00	2026-10-24 04:39:52.45255+00
8e73facf-a6ed-4007-a542-72d5d0ff54f7	91c9c73d-4833-46d9-9562-8bdb71d3fdc9	D	Membaca buku pinjaman dari perpustakaan	f	4	2026-10-24 04:39:52.554785+00	2026-10-24 04:39:52.554785+00
9daed7bc-bd77-4217-98cb-343d43b39332	91c9c73d-4833-46d9-9562-8bdb71d3fdc9	E	Bersiap-siap berangkat melaut	f	5	2026-10-24 04:39:52.659875+00	2026-10-24 04:39:52.659875+00
5efdc854-10dc-48e4-ae6a-75f57f51b139	27d9c730-e75e-4537-8388-9acaca86dee4	A	Kekecewaan tokoh aku karena Ayah melarangnya ikut melaut saat musim ikan tenggiri tiba. [KUNCI: SALAH]	t	1	2026-10-24 04:39:53.88646+00	2026-10-24 04:39:53.88646+00
6486b4af-f013-4cb0-b7ff-80a17a158d7e	27d9c730-e75e-4537-8388-9acaca86dee4	B	Kebingungan tokoh aku antara harus ikut melaut membantu ekonomi atau mengikuti ujian seleksi olimpiade sains. [KUNCI: BENAR]	t	2	2026-10-24 04:39:53.988351+00	2026-10-24 04:39:53.988351+00
5873e276-031f-49ba-a104-1f2a6c615563	27d9c730-e75e-4537-8388-9acaca86dee4	C	Kesedihan tokoh aku karena tidak memiliki biaya untuk menyewa perahu motor Paman Huda. [KUNCI: SALAH]	t	3	2026-10-24 04:39:54.091041+00	2026-10-24 04:39:54.091041+00
c1efcbde-78fa-440c-b0a6-bbbe5a7ac231	6139c29c-c66a-48ce-af97-1a2526e3285a	A	Menyelinap pergi ke sekolah besok subuh dan membiarkan Ayahnya marah.	f	1	2026-10-24 04:39:55.32002+00	2026-10-24 04:39:55.32002+00
a87c8d62-de61-4b08-a620-13a0e9724528	6139c29c-c66a-48ce-af97-1a2526e3285a	B	Menangis histeris di depan Ayah agar diizinkan mengikuti ujian.	f	2	2026-10-24 04:39:55.421858+00	2026-10-24 04:39:55.421858+00
193936d7-5ea8-4992-bcba-24fbe4827f30	6139c29c-c66a-48ce-af97-1a2526e3285a	C	Meminta bantuan Paman Huda untuk meminjamkan perahunya atau membujuk Ayahnya.	t	3	2026-10-24 04:39:55.524528+00	2026-10-24 04:39:55.524528+00
160e678a-d6c0-4197-bfc4-a68f3f010223	6139c29c-c66a-48ce-af97-1a2526e3285a	D	Membakar jaring pukat Ayah agar batal pergi melaut keesokan harinya.	f	4	2026-10-24 04:39:55.626965+00	2026-10-24 04:39:55.626965+00
8065b2d8-d8f5-45b1-8dc4-5f6dd77daf7e	6139c29c-c66a-48ce-af97-1a2526e3285a	E	Menyerah pada mimpinya dan membuang buku-buku perpustakaan ke laut.	f	5	2026-10-24 04:39:55.680564+00	2026-10-24 04:39:55.680564+00
0d78dbfe-6de2-40b9-9a5e-77c07cdf4179	d1ee3aad-fde4-47df-b431-877218b15fea	A	Matahari baru saja tergelincir di ufuk barat, membiaskan semburat jingga di langit.	f	1	2026-10-24 04:39:57.060681+00	2026-10-24 04:39:57.060681+00
3454b723-1e45-4c1e-8070-2e82df5b2a49	d1ee3aad-fde4-47df-b431-877218b15fea	B	"Kita butuh banyak tangkapan untuk membayar sewa perahu."	t	2	2026-10-24 04:39:57.16306+00	2026-10-24 04:39:57.16306+00
90d99ae6-b622-479e-8541-9579a9433aeb	d1ee3aad-fde4-47df-b431-877218b15fea	C	Jemarinya yang kasar dengan cekatan menambal rajutan tali pelonco itu.	f	3	2026-10-24 04:39:57.265149+00	2026-10-24 04:39:57.265149+00
1925b203-1feb-416a-99ff-06369309aa9c	d1ee3aad-fde4-47df-b431-877218b15fea	D	Bagi Ayah, laut adalah satu-satunya sekolah yang memberi makan.	t	4	2026-10-24 04:39:57.367722+00	2026-10-24 04:39:57.367722+00
32845399-eac2-4faa-8347-9cdbbe980016	d1ee3aad-fde4-47df-b431-877218b15fea	E	Ijazah dan piala tak bisa ditukar dengan sekilo beras.	t	5	2026-10-24 04:39:57.470016+00	2026-10-24 04:39:57.470016+00
263c77de-9f41-4597-828d-8e623439b27e	12a5f102-c612-4b3e-88d2-3aae5a8372ec	A	Ungkapan ini tepat untuk menggambarkan latar tempat yang berada di pesisir rawan badai. [KUNCI: TIDAK TEPAT]	t	1	2026-10-24 04:39:58.699168+00	2026-10-24 04:39:58.699168+00
162fa5ae-cf18-42a0-9ddb-23a055b452cc	12a5f102-c612-4b3e-88d2-3aae5a8372ec	B	Ungkapan ini tepat untuk menekankan betapa besar kemarahan Ayah dan konflik besar yang akan terjadi jika tokoh aku membantah. [KUNCI: TEPAT]	t	2	2026-10-24 04:39:58.801183+00	2026-10-24 04:39:58.801183+00
e1fedc94-87de-4dfe-b29e-13f438410e37	12a5f102-c612-4b3e-88d2-3aae5a8372ec	C	Ungkapan ini tidak tepat karena badai tidak mungkin masuk ke dalam bangunan rumah nelayan. [KUNCI: TIDAK TEPAT]	t	3	2026-10-24 04:39:58.903662+00	2026-10-24 04:39:58.903662+00
33535afa-9bc2-4e1a-91b7-0a49f0688eb3	e4b65e11-e594-4f62-ba9f-1c88e7658ef0	A	Data Scientist dan Insinyur Prompt AI	f	1	2026-10-24 04:40:00.234835+00	2026-10-24 04:40:00.234835+00
6eb5e863-a951-4036-842e-333a7ac08462	e4b65e11-e594-4f62-ba9f-1c88e7658ef0	B	Analis Etika AI dan manajer perusahaan	f	2	2026-10-24 04:40:00.337144+00	2026-10-24 04:40:00.337144+00
b814c721-ffe1-4031-ba18-70055610866f	e4b65e11-e594-4f62-ba9f-1c88e7658ef0	C	Kasir dan layanan pelanggan	t	3	2026-10-24 04:40:00.439432+00	2026-10-24 04:40:00.439432+00
e166c1fb-ca42-4bd7-9cb3-3ac455c14261	e4b65e11-e594-4f62-ba9f-1c88e7658ef0	D	Staf pemasaran dan perancang busana	f	4	2026-10-24 04:40:00.541892+00	2026-10-24 04:40:00.541892+00
afd0b4cd-7180-4961-ad61-8c9ec2c5e35e	e4b65e11-e594-4f62-ba9f-1c88e7658ef0	E	Teknisi mesin dan seniman	f	5	2026-10-24 04:40:00.644315+00	2026-10-24 04:40:00.644315+00
7834b6b6-951d-40e7-9b84-d942ee810402	3de4e2ce-90e5-45c6-be54-e50ae8d044c0	A	Istilah upskilling berarti menolak penggunaan teknologi demi menjaga lapangan pekerjaan tradisional. [KUNCI: SALAH]	t	1	2026-10-24 04:40:01.976173+00	2026-10-24 04:40:01.976173+00
8d8edc36-6b03-44c7-a7e4-9f8f06a19844	3de4e2ce-90e5-45c6-be54-e50ae8d044c0	B	Otomatisasi menimbulkan keresahan karena berpotensi menghilangkan pekerjaan yang bersifat repetitif. [KUNCI: BENAR]	t	2	2026-10-24 04:40:02.077991+00	2026-10-24 04:40:02.077991+00
f8cbc770-160c-4a93-970a-812e769a5db0	3de4e2ce-90e5-45c6-be54-e50ae8d044c0	C	Teknologi AI dirancang untuk mengambil alih tugas repetitif, bukan menghapus peran manusia sepenuhnya. [KUNCI: BENAR]	t	3	2026-10-24 04:40:02.180361+00	2026-10-24 04:40:02.180361+00
9f29d781-c612-4e9d-9ac7-ac09d2e70c6c	ffa235ae-99b8-43b5-a110-58ee143d2a72	A	Keterampilan mengetik secara berulang dan cepat.	f	1	2026-10-24 04:40:03.511763+00	2026-10-24 04:40:03.511763+00
98529735-46b5-4334-b0f8-e2d5fc7223af	ffa235ae-99b8-43b5-a110-58ee143d2a72	B	Pelatihan literasi digital dan pemahaman data.	t	2	2026-10-24 04:40:03.613917+00	2026-10-24 04:40:03.613917+00
908eb6e7-48c9-4755-b6f2-31027bf8bfa2	ffa235ae-99b8-43b5-a110-58ee143d2a72	C	Kemampuan berpikir kritis dan analisis strategis.	t	3	2026-10-24 04:40:03.678873+00	2026-10-24 04:40:03.678873+00
f21734a8-8cce-47a8-b38c-7b5f379a9fe9	ffa235ae-99b8-43b5-a110-58ee143d2a72	D	Teknik merakit mesin kasir mandiri (<i data-path-to-node="32,2" data-index-in-node="195">self-checkout</i>).	f	4	2026-10-24 04:40:03.818767+00	2026-10-24 04:40:03.818767+00
92c8df47-343a-4a04-a048-55eb0ae01e12	82868389-0756-4b10-89df-d38fa65d2f1e	A	Sebab - Akibat&nbsp;	f	1	2026-10-24 04:40:05.150012+00	2026-10-24 04:40:05.150012+00
341db950-6de0-470f-a1fb-3eac0adf584d	02ba1a6a-8ad2-4587-a92e-9cbc74cef20b	E	Opsi E	f	5	2026-09-23 15:44:38.908657+00	2026-09-23 15:44:38.908657+00
fb0cf6f5-e821-4888-864c-f28fa036f464	08818873-e533-483b-b5d5-42190b4434d2	A	Negara	t	1	2026-11-08 13:25:01.074685+00	2026-11-08 13:25:01.074685+00
f6a9a753-88e2-4a0c-8267-011c3074372e	08818873-e533-483b-b5d5-42190b4434d2	B	Minuman	f	2	2026-11-08 13:25:01.126089+00	2026-11-08 13:25:01.126089+00
a53e37ef-3aeb-4d5e-a0b0-5396804aeab6	08818873-e533-483b-b5d5-42190b4434d2	C	Makanan	f	3	2026-11-08 13:25:01.178492+00	2026-11-08 13:25:01.178492+00
53899155-0ec3-45c3-ac83-0177e172741d	faa6ca56-c2f2-43b6-92a2-887ab3c9e78a	D	Hutan [KUNCI: SALAH]	t	4	2026-11-08 13:25:02.205949+00	2026-11-08 13:25:02.205949+00
06f26616-5025-4ef8-8dff-411653e74ebb	a6dc5513-9c30-4780-a3db-5eeedd68be79	A	asdads	t	1	2026-11-08 13:31:42.018467+00	2026-11-08 13:31:42.018467+00
323d975e-5c10-463f-84fd-0f2a0cbc0b1a	a6dc5513-9c30-4780-a3db-5eeedd68be79	B	asdasd	f	2	2026-11-08 13:31:42.073579+00	2026-11-08 13:31:42.073579+00
214b9114-ed5f-4df4-b43a-abc01ecffc5b	a6dc5513-9c30-4780-a3db-5eeedd68be79	C	asdasd	f	3	2026-11-08 13:31:42.127902+00	2026-11-08 13:31:42.127902+00
107b2a03-6de9-4256-970e-217c0ff52e64	a6dc5513-9c30-4780-a3db-5eeedd68be79	D	asdasd	f	4	2026-11-08 13:31:42.182324+00	2026-11-08 13:31:42.182324+00
c3ca37c2-8372-41d2-967e-194f3f1efefd	ea1e3eae-fc0d-48a7-8333-4446c89c81bb	A	asdasd	t	1	2026-11-08 13:31:42.797027+00	2026-11-08 13:31:42.797027+00
20d2b72d-12ce-4590-915e-68564a2aa3f3	ea1e3eae-fc0d-48a7-8333-4446c89c81bb	B	asdasd	f	2	2026-11-08 13:31:42.852117+00	2026-11-08 13:31:42.852117+00
15a20f50-2ecb-4930-b046-bf5f704ab136	ea1e3eae-fc0d-48a7-8333-4446c89c81bb	C	asdasd	f	3	2026-11-08 13:31:42.906567+00	2026-11-08 13:31:42.906567+00
3016cf68-1f2c-4d95-9760-41952aebaf1e	ea1e3eae-fc0d-48a7-8333-4446c89c81bb	D	asdasd	f	4	2026-11-08 13:31:42.962331+00	2026-11-08 13:31:42.962331+00
a741efcb-ff5f-4221-860c-c936148833a9	bd3ea538-3edb-4dc8-85bd-8a801c98f3d6	A	test [KUNCI: SETUJU]	t	1	2026-11-08 13:31:43.566244+00	2026-11-08 13:31:43.566244+00
d0dd0683-aa7c-4c98-a026-90b3bcf883ef	bd3ea538-3edb-4dc8-85bd-8a801c98f3d6	B	test [KUNCI: TIDAK SETUJU]	t	2	2026-11-08 13:31:43.623222+00	2026-11-08 13:31:43.623222+00
7297a22b-44ce-439b-878b-77800c7c9adf	bd3ea538-3edb-4dc8-85bd-8a801c98f3d6	C	test [KUNCI: SETUJU]	t	3	2026-11-08 13:31:43.68031+00	2026-11-08 13:31:43.68031+00
8a1bd2a4-04a7-4b02-9a43-4bb00fc371ba	bd3ea538-3edb-4dc8-85bd-8a801c98f3d6	D	test [KUNCI: TIDAK SETUJU]	t	4	2026-11-08 13:31:43.73682+00	2026-11-08 13:31:43.73682+00
13cf8f63-5bc7-446f-8a56-e6a3210b76c0	381e7add-5f96-4c1c-8b0d-07ae711ac296	A	tester	t	1	2026-11-08 13:31:44.361248+00	2026-11-08 13:31:44.361248+00
e9ee5f67-ecb4-4db0-9566-809f60707b98	381e7add-5f96-4c1c-8b0d-07ae711ac296	B	tester	t	2	2026-11-08 13:31:44.415764+00	2026-11-08 13:31:44.415764+00
032ef6ba-7091-4441-93eb-5bf180eeec7b	381e7add-5f96-4c1c-8b0d-07ae711ac296	C	tester	t	3	2026-11-08 13:31:44.470078+00	2026-11-08 13:31:44.470078+00
7ff57d20-b142-426a-8db8-77882378ff50	381e7add-5f96-4c1c-8b0d-07ae711ac296	D	tester	f	4	2026-11-08 13:31:44.525779+00	2026-11-08 13:31:44.525779+00
287a9fee-7c0e-4f53-8345-e2a703c98990	12396019-b799-42e6-b456-8007452b4851	A	tester [KUNCI: BENAR]	t	1	2026-11-08 13:31:45.07929+00	2026-11-08 13:31:45.07929+00
5dfcc7fa-3f89-4b54-948d-83b509e7c3b9	12396019-b799-42e6-b456-8007452b4851	B	tester [KUNCI: SALAH]	t	2	2026-11-08 13:31:45.134266+00	2026-11-08 13:31:45.134266+00
1e140201-b292-480a-a732-610a2f5d9478	12396019-b799-42e6-b456-8007452b4851	C	tester [KUNCI: BENAR]	t	3	2026-11-08 13:31:45.188537+00	2026-11-08 13:31:45.188537+00
9b4321a4-cc9e-4027-8f9b-2fb8dee0b59a	12396019-b799-42e6-b456-8007452b4851	D	tester [KUNCI: SALAH]	t	4	2026-11-08 13:31:45.24278+00	2026-11-08 13:31:45.24278+00
9e9f0ddd-9226-425b-864c-063a53022f2c	f206f347-7202-4b67-b792-90596f4837c9	A	setset<img src="https://pub-6640a1324ad84f30ae0a025294f08244.r2.dev/tryouts/1794144637004-2amth4ropw8.webp" alt="1.jpg" class="max-w-full h-auto rounded-xl my-2">	f	1	2026-11-08 13:31:45.840656+00	2026-11-08 13:31:45.840656+00
25022b31-a03b-4470-9ea7-46a35a05c20b	f206f347-7202-4b67-b792-90596f4837c9	B	setset	t	2	2026-11-08 13:31:45.895138+00	2026-11-08 13:31:45.895138+00
932db568-31fa-454f-82e3-61254e89490a	f206f347-7202-4b67-b792-90596f4837c9	C	setset	f	3	2026-11-08 13:31:45.949624+00	2026-11-08 13:31:45.949624+00
021257fd-0500-4258-b475-5ba8a5e93ebf	f206f347-7202-4b67-b792-90596f4837c9	D	setset	f	4	2026-11-08 13:31:46.007555+00	2026-11-08 13:31:46.007555+00
43e20b89-3ad6-49dc-a943-6bfb0fb4d9e2	db70cb96-c9f3-4590-8e4b-9dc17ec57d2b	A	asdasd	t	1	2026-11-08 13:31:46.553221+00	2026-11-08 13:31:46.553221+00
816036c9-585f-428f-801b-74f13f06c0c7	db70cb96-c9f3-4590-8e4b-9dc17ec57d2b	B	asdasd	f	2	2026-11-08 13:31:46.607508+00	2026-11-08 13:31:46.607508+00
63982980-182c-49a6-9ee6-d250bb54995f	db70cb96-c9f3-4590-8e4b-9dc17ec57d2b	C	<b>asdasdasd<i>asdasdasdasd</i></b>	f	3	2026-11-08 13:31:46.6617+00	2026-11-08 13:31:46.6617+00
10aae3e8-39a4-41a0-b840-9af337d7643d	db70cb96-c9f3-4590-8e4b-9dc17ec57d2b	D	asdasd	f	4	2026-11-08 13:31:46.716141+00	2026-11-08 13:31:46.716141+00
cd1878dc-6726-41b2-903f-d0703b62cbd6	f81267a5-0f32-45e0-9667-9642f29994b7	A	asdasd	t	1	2026-11-08 13:31:47.316173+00	2026-11-08 13:31:47.316173+00
8fd1277e-847f-4aca-8688-c612818e8e17	f81267a5-0f32-45e0-9667-9642f29994b7	B	asdasd	t	2	2026-11-08 13:31:47.371348+00	2026-11-08 13:31:47.371348+00
d037b603-a1d6-4290-98f7-94f13cc87ea2	f81267a5-0f32-45e0-9667-9642f29994b7	C	asdasd	f	3	2026-11-08 13:31:47.425928+00	2026-11-08 13:31:47.425928+00
440e0aa7-9195-46f7-8f72-7a3bffae3d3f	f81267a5-0f32-45e0-9667-9642f29994b7	D	asdasd	f	4	2026-11-08 13:31:47.482924+00	2026-11-08 13:31:47.482924+00
c5ae48cc-b7d3-4a03-b60f-0f3c2e97cf75	ee52c084-adef-477f-9e57-30ddfe413859	A	asdasd	t	1	2026-11-08 13:31:48.028043+00	2026-11-08 13:31:48.028043+00
0a1786c1-1234-4626-bff9-4affdc75de0f	ee52c084-adef-477f-9e57-30ddfe413859	B	asdasd	t	2	2026-11-08 13:31:48.082451+00	2026-11-08 13:31:48.082451+00
b3c035f5-9468-44d6-8060-b95280d7a965	ee52c084-adef-477f-9e57-30ddfe413859	C	asdasd	f	3	2026-11-08 13:31:48.136888+00	2026-11-08 13:31:48.136888+00
3fb91e9e-8b75-45ab-8b55-1fde29132c1f	ee52c084-adef-477f-9e57-30ddfe413859	D	asdasd	f	4	2026-11-08 13:31:48.191249+00	2026-11-08 13:31:48.191249+00
8a64e102-7975-4778-9416-1a0f19d10b49	48d80012-822a-429c-976a-e71faaab2af3	A	asdasd [KUNCI: BENAR]	t	1	2026-11-08 13:31:48.735322+00	2026-11-08 13:31:48.735322+00
eea59d0f-3a90-4d84-a6a0-cacff5bf07fc	48d80012-822a-429c-976a-e71faaab2af3	B	asdasd [KUNCI: SALAH]	t	2	2026-11-08 13:31:48.789543+00	2026-11-08 13:31:48.789543+00
82dab491-5179-47be-9b2e-00e1fd936e28	48d80012-822a-429c-976a-e71faaab2af3	C	asdads [KUNCI: BENAR]	t	3	2026-11-08 13:31:48.844892+00	2026-11-08 13:31:48.844892+00
647a4459-f97b-490b-aff4-1022b6bdbbb4	48d80012-822a-429c-976a-e71faaab2af3	D	asdas [KUNCI: SALAH]	t	4	2026-11-08 13:31:48.899206+00	2026-11-08 13:31:48.899206+00
6028cbb2-2087-48f6-bac6-850fb7057018	ccccd4bf-4bf8-44cc-8f33-1919490b6fb0	A	Masyarakat menganggap singkong dan sagu sebagai simbol kemakmuran yang lebih tinggi dari beras. [KUNCI: SALAH]	t	1	2026-10-24 04:39:46.206372+00	2026-10-24 04:39:46.206372+00
f9385691-e5b9-445a-9437-17cb275c074d	ccccd4bf-4bf8-44cc-8f33-1919490b6fb0	B	Inovasi kuliner dilakukan untuk menghilangkan stigma bahwa sumber pangan selain beras adalah makanan kelas dua. [KUNCI: BENAR]	t	2	2026-10-24 04:39:46.308789+00	2026-10-24 04:39:46.308789+00
8a37a406-8a3e-4907-97fe-e76a7d30ecf2	ccccd4bf-4bf8-44cc-8f33-1919490b6fb0	C	UMKM turut berperan dalam memasarkan produk olahan pangan lokal melalui kampanye digital. [KUNCI: BENAR]	t	3	2026-10-24 04:39:46.412085+00	2026-10-24 04:39:46.412085+00
\.


--
-- Data for Name: question_types; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.question_types (id, code, name, description, created_at, updated_at) FROM stdin;
a3e5deb5-0eab-4123-b169-f0f3c1608f93	multiple_choice	Pilihan Ganda Tunggal	Soal dengan satu pilihan jawaban benar dari 5 opsi (A-E)	2026-09-08 07:53:10.431449+00	2026-09-08 07:53:10.431449+00
312c5852-cff5-4953-ba7f-17b6c8008508	complex_multiple_choice	Pilihan Ganda Kompleks	Soal dengan beberapa pilihan jawaban benar (MCMA)	2026-09-08 07:53:11.149856+00	2026-09-08 07:53:11.149856+00
2df77cd4-0ce0-449a-98c6-eeb5ac4adad0	true_false	Benar / Salah	Soal kategori pernyataan Tepat / Tidak Tepat atau Benar / Salah	2026-09-08 07:53:11.458535+00	2026-09-08 07:53:11.458535+00
\.


--
-- Data for Name: questions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.questions (id, question_type_id, question_text, difficulty_level, status, created_by, updated_by, created_at, updated_at, deleted_at, jenjang, stimulus_id) FROM stdin;
f49f136b-d0b0-4588-aa0d-aa549e9e7647	a3e5deb5-0eab-4123-b169-f0f3c1608f93	Update Soal 1	1	published	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-09-23 15:44:37.153619+00	2026-11-08 10:23:51.366447+00	\N	sma	\N
39e9cfa9-ecf9-47c4-a3dc-097178820aff	a3e5deb5-0eab-4123-b169-f0f3c1608f93	[WACANA: Konversi]\nasdasdasd\n\nasdasdasd	1	published	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-09-23 15:44:43.550291+00	2026-11-08 10:23:51.366447+00	\N	sma	\N
37b33e7f-4016-4cfd-a9e0-eb1f33896527	a3e5deb5-0eab-4123-b169-f0f3c1608f93	[WACANA: asdasd]\nadsasd\n\nasdasd	1	published	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-09-23 15:44:49.485108+00	2026-11-08 10:23:51.366447+00	\N	sma	\N
02ba1a6a-8ad2-4587-a92e-9cbc74cef20b	312c5852-cff5-4953-ba7f-17b6c8008508	Update Soal 1	2	published	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-09-23 15:44:38.381252+00	2026-11-08 10:23:51.366447+00	\N	sma	\N
7acc58ec-1d7f-4f2f-aec7-2e9df230ab51	312c5852-cff5-4953-ba7f-17b6c8008508	Update Soal 1	3	published	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-09-23 15:44:39.659404+00	2026-11-08 10:23:51.366447+00	\N	sma	\N
e9232f01-bf4c-4f5d-b27e-5d15063d8b8c	312c5852-cff5-4953-ba7f-17b6c8008508	asdasd	2	published	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-09-23 15:44:44.880909+00	2026-11-08 10:23:51.366447+00	\N	sma	\N
939e6bb7-af2b-49b6-9fbc-224d14e4ab94	2df77cd4-0ce0-449a-98c6-eeb5ac4adad0	Update Soal 1	4	published	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-09-23 15:44:40.941607+00	2026-11-08 10:23:51.366447+00	\N	sma	\N
ca0f2713-6e49-4385-83ff-3d2a32c9df38	2df77cd4-0ce0-449a-98c6-eeb5ac4adad0	Update Soal 1	5	published	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-09-23 15:44:42.117451+00	2026-11-08 10:23:51.366447+00	\N	sma	\N
138e7334-0505-429d-a399-e28418fbb0ac	2df77cd4-0ce0-449a-98c6-eeb5ac4adad0	[WACANA: asdasd]\nasdasd\n\nasdasdasdasd	3	published	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-09-23 15:44:46.009389+00	2026-11-08 10:23:51.366447+00	\N	sma	\N
afc043b3-bb56-4ed7-b4c9-dff438aad899	2df77cd4-0ce0-449a-98c6-eeb5ac4adad0	asdasdasd	4	published	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-09-23 15:44:47.013837+00	2026-11-08 10:23:51.366447+00	\N	sma	\N
a3f8465c-09c6-47f6-9246-131bf98306db	a3e5deb5-0eab-4123-b169-f0f3c1608f93	ASDASDASDASD	1	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-09-21 08:03:48.068099+00	2026-09-21 08:03:48.068099+00	\N	sma	\N
1068bb20-d27d-4fb3-a9a8-7953ee241f9a	a3e5deb5-0eab-4123-b169-f0f3c1608f93	ASDASDASD	5	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-09-21 08:03:56.578484+00	2026-09-21 08:03:56.578484+00	\N	sma	\N
7d9fa00a-7ee3-4b9e-853e-ee85a96d113c	a3e5deb5-0eab-4123-b169-f0f3c1608f93	asdasd	1	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-09-23 15:38:48.623939+00	2026-09-23 15:38:48.623939+00	\N	sma	\N
4ebfd325-c399-4473-bd19-d3940853713d	a3e5deb5-0eab-4123-b169-f0f3c1608f93	asdasd	1	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-09-23 15:40:56.421778+00	2026-09-23 15:40:56.421778+00	\N	sma	\N
2b23a853-0130-4b6c-b423-a0ed4ab492e2	a3e5deb5-0eab-4123-b169-f0f3c1608f93	Update Soal 1	1	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-09-23 15:41:52.844786+00	2026-09-23 15:41:52.844786+00	\N	sma	\N
ae47dce0-f370-4050-a5e7-d0a27277a414	2df77cd4-0ce0-449a-98c6-eeb5ac4adad0	asdasd	5	published	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-09-23 15:44:48.260531+00	2026-11-08 10:23:51.366447+00	\N	sma	\N
a6dc5513-9c30-4780-a3db-5eeedd68be79	a3e5deb5-0eab-4123-b169-f0f3c1608f93	Mie Instan Makanan?	1	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-11-08 13:31:41.962884+00	2026-11-08 13:31:41.962884+00	\N	sma	\N
ea1e3eae-fc0d-48a7-8333-4446c89c81bb	a3e5deb5-0eab-4123-b169-f0f3c1608f93	[WACANA: Wacana]\n\n\nIndomie Makanan?	2	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-11-08 13:31:42.742195+00	2026-11-08 13:31:42.742195+00	\N	sma	\N
bd3ea538-3edb-4dc8-85bd-8a801c98f3d6	2df77cd4-0ce0-449a-98c6-eeb5ac4adad0	test	3	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-11-08 13:31:43.508467+00	2026-11-08 13:31:43.508467+00	\N	sma	\N
381e7add-5f96-4c1c-8b0d-07ae711ac296	312c5852-cff5-4953-ba7f-17b6c8008508	tester	4	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-11-08 13:31:44.306767+00	2026-11-08 13:31:44.306767+00	\N	sma	\N
12396019-b799-42e6-b456-8007452b4851	2df77cd4-0ce0-449a-98c6-eeb5ac4adad0	tester	5	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-11-08 13:31:45.024694+00	2026-11-08 13:31:45.024694+00	\N	sma	\N
f206f347-7202-4b67-b792-90596f4837c9	a3e5deb5-0eab-4123-b169-f0f3c1608f93	<img src="https://pub-6640a1324ad84f30ae0a025294f08244.r2.dev/tryouts/1794144612786-us9y74zgkwh.webp" alt="logo.png" class="max-w-full h-auto rounded-xl my-2">	1	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-11-08 13:31:45.786244+00	2026-11-08 13:31:45.786244+00	\N	sma	\N
db70cb96-c9f3-4590-8e4b-9dc17ec57d2b	a3e5deb5-0eab-4123-b169-f0f3c1608f93	asdasdasd	2	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-11-08 13:31:46.498841+00	2026-11-08 13:31:46.498841+00	\N	sma	\N
f81267a5-0f32-45e0-9667-9642f29994b7	312c5852-cff5-4953-ba7f-17b6c8008508	asdasd	3	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-11-08 13:31:47.261382+00	2026-11-08 13:31:47.261382+00	\N	sma	\N
ee52c084-adef-477f-9e57-30ddfe413859	312c5852-cff5-4953-ba7f-17b6c8008508	asdasd	4	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-11-08 13:31:47.973435+00	2026-11-08 13:31:47.973435+00	\N	sma	\N
48d80012-822a-429c-976a-e71faaab2af3	2df77cd4-0ce0-449a-98c6-eeb5ac4adad0	asdasd	5	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-11-08 13:31:48.680783+00	2026-11-08 13:31:48.680783+00	\N	sma	\N
08818873-e533-483b-b5d5-42190b4434d2	a3e5deb5-0eab-4123-b169-f0f3c1608f93	Apa Itu Indonesia	3	archived	bbab3c0e-fa43-40fd-8dde-e65f10309e95	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2026-11-08 13:25:01.018609+00	2026-11-08 14:09:19.938913+00	\N	sma	88714c40-8c33-49e5-b0cd-551b7f4d8b4f
faa6ca56-c2f2-43b6-92a2-887ab3c9e78a	2df77cd4-0ce0-449a-98c6-eeb5ac4adad0	Apa itu Nasi	3	archived	bbab3c0e-fa43-40fd-8dde-e65f10309e95	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2026-11-08 13:25:01.998684+00	2026-11-08 14:09:19.938913+00	\N	sma	88714c40-8c33-49e5-b0cd-551b7f4d8b4f
8f35d2de-5210-40d0-9f27-9950695aac3c	312c5852-cff5-4953-ba7f-17b6c8008508	ASDASD	2	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-09-21 08:03:50.743149+00	2026-09-21 08:03:50.743149+00	\N	sma	\N
4c611f6b-7bb9-4a26-b0d6-fe16df2c42e8	312c5852-cff5-4953-ba7f-17b6c8008508	asdasdasd	2	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-09-23 15:38:49.74542+00	2026-09-23 15:38:49.74542+00	\N	sma	\N
76901441-76ce-44f5-9c47-33d6722d1074	312c5852-cff5-4953-ba7f-17b6c8008508	asdasd	3	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-09-23 15:38:51.080024+00	2026-09-23 15:38:51.080024+00	\N	sma	\N
4a841dcb-7f62-4a5d-89ad-5a80db74da3c	312c5852-cff5-4953-ba7f-17b6c8008508	asdasdasd	2	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-09-23 15:40:57.54777+00	2026-09-23 15:40:57.54777+00	\N	sma	\N
3e3fd5c5-6298-40eb-90fe-4cff2f9e9ab3	312c5852-cff5-4953-ba7f-17b6c8008508	asdasd	3	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-09-23 15:40:59.086491+00	2026-09-23 15:40:59.086491+00	\N	sma	\N
5f7ec9f7-8a69-4f5a-bfa1-ebb58e7b84bd	312c5852-cff5-4953-ba7f-17b6c8008508	Update Soal 1	2	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-09-23 15:41:53.972457+00	2026-09-23 15:41:53.972457+00	\N	sma	\N
8f59b804-a656-48e5-9818-8c5ff4d0efd4	312c5852-cff5-4953-ba7f-17b6c8008508	Update Soal 1	3	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-09-23 15:41:55.19633+00	2026-09-23 15:41:55.19633+00	\N	sma	\N
d960f59c-4bb5-426b-99b1-8801a1e4aca3	2df77cd4-0ce0-449a-98c6-eeb5ac4adad0	ASDASD	3	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-09-21 08:03:52.937834+00	2026-09-21 08:03:52.937834+00	\N	sma	\N
51c5b6ee-25a6-4c8a-ae33-67eb43a44576	2df77cd4-0ce0-449a-98c6-eeb5ac4adad0	ASDASD	4	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-09-21 08:03:54.738929+00	2026-09-21 08:03:54.738929+00	\N	sma	\N
6c6adf1d-18d5-4505-a007-f41a64d1305e	2df77cd4-0ce0-449a-98c6-eeb5ac4adad0	asdasd	4	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-09-23 15:38:52.310334+00	2026-09-23 15:38:52.310334+00	\N	sma	\N
8ebac3cd-9628-4b70-a61f-e6b67032d6e3	2df77cd4-0ce0-449a-98c6-eeb5ac4adad0	asdasd	5	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-09-23 15:38:53.538842+00	2026-09-23 15:38:53.538842+00	\N	sma	\N
7469d6f4-67ce-4b77-9583-7ccf80676476	2df77cd4-0ce0-449a-98c6-eeb5ac4adad0	asdasd	4	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-09-23 15:41:00.411479+00	2026-09-23 15:41:00.411479+00	\N	sma	\N
4016ec73-d601-4910-bbe7-2097adec09b2	2df77cd4-0ce0-449a-98c6-eeb5ac4adad0	asdasd	5	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-09-23 15:41:01.741341+00	2026-09-23 15:41:01.741341+00	\N	sma	\N
059ecdc9-7bfd-4b97-85ce-4b501d15a642	2df77cd4-0ce0-449a-98c6-eeb5ac4adad0	Update Soal 1	4	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-09-23 15:41:56.473826+00	2026-09-23 15:41:56.473826+00	\N	sma	\N
2e4adbce-9333-4ed8-ac80-3d6dc6cceaf7	2df77cd4-0ce0-449a-98c6-eeb5ac4adad0	Update Soal 1	5	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-09-23 15:41:57.658847+00	2026-09-23 15:41:57.658847+00	\N	sma	\N
8a9d3b1f-2724-4193-9caf-71b7de257627	312c5852-cff5-4953-ba7f-17b6c8008508	asdasd	2	published	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-09-23 15:44:50.616885+00	2026-11-08 10:23:51.366447+00	\N	sma	\N
5b8dc496-4c06-4270-9da4-7148aa3cefef	312c5852-cff5-4953-ba7f-17b6c8008508	asdasd	3	published	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-09-23 15:44:51.640046+00	2026-11-08 10:23:51.366447+00	\N	sma	\N
7fc19fd7-107f-4e50-89c3-001d188312a7	312c5852-cff5-4953-ba7f-17b6c8008508	[WACANA: Wacana]\nasdasd<font face="Inter">asdasd</font><font face="Poppins">asdasd<font size="4">asdasd</font></font>\n\nasdasd	4	published	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-09-23 15:44:52.669872+00	2026-11-08 10:23:51.366447+00	\N	sma	\N
7d011732-3523-4bcf-aa8a-3e4d8461785f	2df77cd4-0ce0-449a-98c6-eeb5ac4adad0	asdasdasdasd	5	published	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-09-23 15:44:53.893141+00	2026-11-08 10:23:51.366447+00	\N	sma	\N
2a6cfb98-939b-481c-bed8-b0577e0c02b6	a3e5deb5-0eab-4123-b169-f0f3c1608f93	[WACANA: Stimulus Wacana]\nMencoba Menggunakan&nbsp;<h3 class="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide" style="border-color: rgb(229, 231, 235); outline-color: oklab(0.863808 -0.00436801 0.153952 / 0.5); font-size: 14px; font-weight: 700; line-height: 1.42857; --tw-font-weight: 700; --tw-tracking: .025em; letter-spacing: 0.35px; color: lab(16.132 -0.318035 -14.6672); background-color: rgb(242, 250, 249);">Stimulus Wacana</h3>\n\nASDASD	3	published	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-09-27 05:44:44.789839+00	2026-09-27 05:45:01.993153+00	\N	sma	\N
dbfa6723-f73f-49f5-bd61-3298a4a8e93b	a3e5deb5-0eab-4123-b169-f0f3c1608f93	[WACANA: Stimulus Wacana]\nMencoba Menggunakan&nbsp;<h3 class="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide" style="border-color: rgb(229, 231, 235); outline-color: oklab(0.863808 -0.00436801 0.153952 / 0.5); font-size: 14px; font-weight: 700; line-height: 1.42857; --tw-font-weight: 700; --tw-tracking: .025em; letter-spacing: 0.35px; color: lab(16.132 -0.318035 -14.6672); background-color: rgb(242, 250, 249);">Stimulus Wacana</h3>\n\nASDASD	3	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-09-27 08:20:44.243989+00	2026-09-27 08:20:44.243989+00	\N	sma	\N
c6115406-272a-4de9-8e2d-cbf14afed157	a3e5deb5-0eab-4123-b169-f0f3c1608f93	[WACANA: Stimulus Wacana]\nMencoba Menggunakan&nbsp;<h3 class="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide" style="border-color: rgb(229, 231, 235); outline-color: oklab(0.863808 -0.00436801 0.153952 / 0.5); font-size: 14px; font-weight: 700; line-height: 1.42857; --tw-font-weight: 700; --tw-tracking: .025em; letter-spacing: 0.35px; color: lab(16.132 -0.318035 -14.6672); background-color: rgb(242, 250, 249);">Stimulus Wacana</h3>\n\nASDASD	3	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-09-27 08:21:10.043414+00	2026-09-27 08:21:10.043414+00	\N	sma	\N
85351a72-7b38-4bce-a344-1c69598ad8fc	a3e5deb5-0eab-4123-b169-f0f3c1608f93	Baca Dan Pahami	3	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-10-21 08:11:00.417255+00	2026-10-21 08:11:00.417255+00	\N	sma	8f28f1b0-4a70-4239-be78-3c7fce0b1a68
50781746-0671-4ef5-8c3c-73ebe48fa3e2	a3e5deb5-0eab-4123-b169-f0f3c1608f93	<p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; color: rgb(0, 0, 0); font-size: medium;"><font color="#000000"><font face="Aptos, serif">Apa gagasan utama yang disampaikan pada paragraf pertama teks tersebut?</font></font></p>	3	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-10-21 08:11:02.567606+00	2026-10-21 08:11:02.567606+00	\N	sma	8f28f1b0-4a70-4239-be78-3c7fce0b1a68
f4e39d71-a83a-459d-82a5-dddbcc337f15	a3e5deb5-0eab-4123-b169-f0f3c1608f93	Baca Dan Pahami&nbsp;	3	published	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2026-10-21 08:25:47.406764+00	2026-10-21 08:27:07.381727+00	\N	sma	2583445a-0ff7-4b32-b347-33ec037709d6
0d7e6daf-3575-4a61-840d-b66acd132f41	a3e5deb5-0eab-4123-b169-f0f3c1608f93	<p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; color: rgb(0, 0, 0); font-size: medium;"><font color="#000000"><font face="Aptos, serif">Apa gagasan utama yang disampaikan pada paragraf pertama teks tersebut?</font></font></p>	3	published	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2026-10-21 08:25:50.069287+00	2026-10-21 08:27:07.381727+00	\N	sma	2583445a-0ff7-4b32-b347-33ec037709d6
2bdc7711-0365-46a0-8bc4-d40235bd409f	312c5852-cff5-4953-ba7f-17b6c8008508	Mengapa lautan menghadapi ancaman pada 2050? Pilihlah jawaban yang benar! Jawaban benar lebih dari satu.	3	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-10-21 08:11:04.820579+00	2026-10-21 08:11:04.820579+00	\N	sma	8f28f1b0-4a70-4239-be78-3c7fce0b1a68
d5d155f9-933e-4171-a524-8a34a96996ec	312c5852-cff5-4953-ba7f-17b6c8008508	Mengapa lautan menghadapi ancaman pada 2050? Pilihlah jawaban yang benar! Jawaban benar lebih dari satu.	3	published	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2026-10-21 08:25:52.1119+00	2026-10-21 08:27:07.381727+00	\N	sma	2583445a-0ff7-4b32-b347-33ec037709d6
d3ea9b84-8c35-42df-8d9a-586efd7f94c4	2df77cd4-0ce0-449a-98c6-eeb5ac4adad0	asdasd	3	published	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-09-27 05:44:46.628144+00	2026-09-27 05:45:01.993153+00	\N	sma	\N
6746468b-df32-46e4-ae24-7ff53b8710c3	2df77cd4-0ce0-449a-98c6-eeb5ac4adad0	asdasd	3	draft	bbab3c0e-fa43-40fd-8dde-e65f10309e95	\N	2026-09-27 08:20:45.980767+00	2026-09-27 08:20:45.980767+00	\N	sma	\N
7d50fc93-927c-4e5e-9c20-f5c33aa158be	2df77cd4-0ce0-449a-98c6-eeb5ac4adad0	Bener Sumua Nih	3	published	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-09-27 08:26:20.516635+00	2026-09-27 08:26:31.268554+00	\N	sma	\N
7df26d31-e0e4-4fb1-9a18-9821397c5f64	2df77cd4-0ce0-449a-98c6-eeb5ac4adad0	Salah SEmua Nih	3	published	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-09-27 08:26:22.053451+00	2026-09-27 08:26:31.268554+00	\N	sma	\N
88a3d3b8-2286-4894-a196-0765f1d9816e	a3e5deb5-0eab-4123-b169-f0f3c1608f93	asdasd	3	archived	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2026-09-27 05:05:01.026689+00	2026-10-21 09:23:18.198407+00	\N	sma	\N
dd8b59b2-aed2-4227-943a-4d79e7f6d5e4	2df77cd4-0ce0-449a-98c6-eeb5ac4adad0	"<span style="font-family: Aptos, serif; color: rgb(0, 0, 0); font-size: medium;">Solusi tersebut tidak mudah.</span>"<br><div>Mengapa penulis menggunakan kalimat tersebut pada teks? Tentukan Benar atau Salah untuk setiap pernyataan berikut!</div>	3	published	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2026-10-21 08:25:53.960257+00	2026-10-21 08:27:07.381727+00	\N	sma	2583445a-0ff7-4b32-b347-33ec037709d6
1d1cc286-8aca-4f34-a355-61befc34b09b	a3e5deb5-0eab-4123-b169-f0f3c1608f93	Tanaman apa yang disebutkan dalam teks mampu tumbuh subur di lahan gambut tanpa pupuk kimia?	1	published	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2026-10-24 04:39:44.567909+00	2026-10-24 04:42:37.51836+00	\N	sma	2515e4bb-1541-42e8-ac0f-3577549c606b
91c9c73d-4833-46d9-9562-8bdb71d3fdc9	a3e5deb5-0eab-4123-b169-f0f3c1608f93	Apa yang sedang dikerjakan Ayah saat berbicara dengan tokoh "Aku" pada sore hari itu?	1	published	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2026-10-24 04:39:52.145236+00	2026-10-24 04:42:37.51836+00	\N	sma	279b02df-4b67-4bc3-a885-c396b46eb6d9
ccccd4bf-4bf8-44cc-8f33-1919490b6fb0	2df77cd4-0ce0-449a-98c6-eeb5ac4adad0	Tentukan <b data-path-to-node="5,0" data-index-in-node="45">Benar</b> atau <b data-path-to-node="5,0" data-index-in-node="56">Salah</b> untuk setiap pernyataan berikut terkait gagasan dalam teks!	2	published	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2026-10-24 04:39:46.103921+00	2026-10-24 04:42:37.51836+00	\N	sma	2515e4bb-1541-42e8-ac0f-3577549c606b
12a5f102-c612-4b3e-88d2-3aae5a8372ec	2df77cd4-0ce0-449a-98c6-eeb5ac4adad0	Penulis menggunakan ungkapan "menolak perintah Ayah sama saja dengan mengundang badai ke dalam rumah". Tentukan <b data-path-to-node="22,0" data-index-in-node="155">Tepat</b> atau <b data-path-to-node="22,0" data-index-in-node="166">Tidak Tepat</b> alasan penggunaan ungkapan tersebut!	5	published	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2026-10-24 04:39:58.597824+00	2026-10-24 04:42:37.51836+00	\N	sma	279b02df-4b67-4bc3-a885-c396b46eb6d9
bc8ba9f3-5fcc-441b-975a-75688de67e5e	312c5852-cff5-4953-ba7f-17b6c8008508	<span data-path-to-node="7,0" class="">Apa saja tindakan yang menunjukkan penerapan inovasi kuliner berdasarkan teks tersebut? Pilihlah jawaban yang benar! Jawaban benar lebih dari satu.</span><span data-path-to-node="7,1" class=""><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><source-footnote _nghost-ng-c395889312="" class="ng-star-inserted"><sup _ngcontent-ng-c395889312="" class="superscript"><!----></sup></source-footnote><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----></span><span data-path-to-node="7,2" class=""></span>	3	published	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2026-10-24 04:39:47.53762+00	2026-10-24 04:42:37.51836+00	\N	sma	2515e4bb-1541-42e8-ac0f-3577549c606b
7edd0484-71d3-49bd-a549-de8010bdfa5a	a3e5deb5-0eab-4123-b169-f0f3c1608f93	<span data-path-to-node="8,0" class="">Bagaimana hubungan makna antara paragraf kedua dan ketiga dalam teks tersebut?</span><span data-path-to-node="8,1" class=""><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><source-footnote _nghost-ng-c395889312="" class="ng-star-inserted"><sup _ngcontent-ng-c395889312="" class="superscript"><!----></sup></source-footnote><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----></span><span data-path-to-node="8,2" class=""></span>	4	published	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2026-10-24 04:39:49.073265+00	2026-10-24 04:42:37.51836+00	\N	sma	2515e4bb-1541-42e8-ac0f-3577549c606b
2f25a29a-d77b-49d6-9d0e-d2d7751eb52f	2df77cd4-0ce0-449a-98c6-eeb5ac4adad0	"Keberhasilan program diversifikasi pangan ini sangat bergantung pada sinergi antara kebijakan pemerintah, inovasi produsen, dan kesediaan masyarakat."<br><span data-path-to-node="9,0" class="">Tentukan <b data-path-to-node="9,0" data-index-in-node="205">Setuju</b> atau <b data-path-to-node="9,0" data-index-in-node="217">Tidak Setuju</b> terhadap alasan kelayakan argumen penulis tersebut!</span><span data-path-to-node="9,1" class=""><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><source-footnote _nghost-ng-c395889312="" class="ng-star-inserted"><sup _ngcontent-ng-c395889312="" class="superscript"><!----></sup></source-footnote><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----></span><sources-carousel-inline ng-version="0.0.0-PLACEHOLDER" _nghost-ng-c2052859659=""></sources-carousel-inline>	5	published	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2026-10-24 04:39:50.706888+00	2026-10-24 04:42:37.51836+00	\N	sma	2515e4bb-1541-42e8-ac0f-3577549c606b
27d9c730-e75e-4537-8388-9acaca86dee4	2df77cd4-0ce0-449a-98c6-eeb5ac4adad0	<span data-path-to-node="18,0" class="">Apa permasalahan utama yang dihadapi tokoh aku dalam kutipan tersebut? Tentukan <b data-path-to-node="18,0" data-index-in-node="116">Benar</b> atau <b data-path-to-node="18,0" data-index-in-node="127">Salah</b> untuk setiap pernyataan berikut!</span><span data-path-to-node="18,1" class=""><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><source-footnote _nghost-ng-c395889312="" class="ng-star-inserted"><sup _ngcontent-ng-c395889312="" class="superscript"><!----></sup></source-footnote><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----></span><sources-carousel-inline ng-version="0.0.0-PLACEHOLDER" _nghost-ng-c2052859659=""></sources-carousel-inline>	2	published	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2026-10-24 04:39:53.783862+00	2026-10-24 04:42:37.51836+00	\N	sma	279b02df-4b67-4bc3-a885-c396b46eb6d9
6139c29c-c66a-48ce-af97-1a2526e3285a	a3e5deb5-0eab-4123-b169-f0f3c1608f93	<span data-path-to-node="20,0" class="">Berdasarkan bagian akhir teks, apa yang kemungkinan besar akan dilakukan oleh tokoh "Aku" selanjutnya?</span><span data-path-to-node="20,1" class=""><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><source-footnote _nghost-ng-c395889312="" class="ng-star-inserted"><sup _ngcontent-ng-c395889312="" class="superscript"><!----></sup></source-footnote><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----></span><span data-path-to-node="20,2" class=""></span>	3	published	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2026-10-24 04:39:55.217236+00	2026-10-24 04:42:37.51836+00	\N	sma	279b02df-4b67-4bc3-a885-c396b46eb6d9
d1ee3aad-fde4-47df-b431-877218b15fea	312c5852-cff5-4953-ba7f-17b6c8008508	<span data-path-to-node="21,0" class="">Kalimat mana saja dari kutipan cerpen tersebut yang membuktikan bahwa Ayah lebih mengutamakan kelangsungan hidup daripada pendidikan? Pilihlah jawaban yang benar! Jawaban benar lebih dari satu.</span><span data-path-to-node="21,1" class=""><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><source-footnote _nghost-ng-c395889312="" class="ng-star-inserted"><sup _ngcontent-ng-c395889312="" class="superscript"><!----></sup></source-footnote><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----></span><span data-path-to-node="21,2" class=""></span>	4	published	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2026-10-24 04:39:56.958079+00	2026-10-24 04:42:37.51836+00	\N	sma	279b02df-4b67-4bc3-a885-c396b46eb6d9
e4b65e11-e594-4f62-ba9f-1c88e7658ef0	a3e5deb5-0eab-4123-b169-f0f3c1608f93	Pekerjaan apa saja yang menurut teks sudah mulai digantikan oleh teknologi AI?	1	published	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2026-10-24 04:40:00.132407+00	2026-10-24 04:42:37.51836+00	\N	sma	7a1d30a8-8b14-4721-ac82-6affcf77f264
3de4e2ce-90e5-45c6-be54-e50ae8d044c0	2df77cd4-0ce0-449a-98c6-eeb5ac4adad0	<span data-path-to-node="30,0" class="">Tentukan <b data-path-to-node="30,0" data-index-in-node="46">Benar</b> atau <b data-path-to-node="30,0" data-index-in-node="57">Salah</b> untuk setiap pernyataan terkait makna kata dan informasi dalam teks!</span><span data-path-to-node="30,1" class=""><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><source-footnote _nghost-ng-c395889312="" class="ng-star-inserted"><sup _ngcontent-ng-c395889312="" class="superscript"><!----></sup></source-footnote><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----></span><sources-carousel-inline ng-version="0.0.0-PLACEHOLDER" _nghost-ng-c2052859659=""></sources-carousel-inline>	2	published	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2026-10-24 04:40:01.873067+00	2026-10-24 04:42:37.51836+00	\N	sma	7a1d30a8-8b14-4721-ac82-6affcf77f264
ffa235ae-99b8-43b5-a110-58ee143d2a72	312c5852-cff5-4953-ba7f-17b6c8008508	<span data-path-to-node="32,0" class="">Jika Anda adalah seorang pekerja yang ingin beradaptasi dengan era otomatisasi sesuai anjuran teks, keterampilan apa saja yang harus Anda pelajari? Pilihlah jawaban yang benar lebih dari satu!</span><span data-path-to-node="32,1" class=""><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><source-footnote _nghost-ng-c395889312="" class="ng-star-inserted"><sup _ngcontent-ng-c395889312="" class="superscript"><!----></sup></source-footnote><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----></span><span data-path-to-node="32,2" class=""></span>	3	published	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2026-10-24 04:40:03.40909+00	2026-10-24 04:42:37.51836+00	\N	sma	7a1d30a8-8b14-4721-ac82-6affcf77f264
82868389-0756-4b10-89df-d38fa65d2f1e	a3e5deb5-0eab-4123-b169-f0f3c1608f93	<span data-path-to-node="33,0" class="">Pola pengembangan paragraf pertama dan kedua pada teks tersebut menunjukkan hubungan....</span><span data-path-to-node="33,1" class=""><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><source-footnote _nghost-ng-c395889312="" class="ng-star-inserted"><sup _ngcontent-ng-c395889312="" class="superscript"><!----></sup></source-footnote><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----></span><span data-path-to-node="33,2" class=""></span>	4	published	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2026-10-24 04:40:05.047587+00	2026-10-24 04:42:37.51836+00	\N	sma	7a1d30a8-8b14-4721-ac82-6affcf77f264
e39a881b-cf15-4599-98bf-bda0a1bc47c6	2df77cd4-0ce0-449a-98c6-eeb5ac4adad0	<span data-path-to-node="34,0" class="">Teks tersebut menyimpulkan bahwa pekerja yang menolak beradaptasi berisiko tertinggal oleh dinamika pasar kerja.\nTentukan <b data-path-to-node="34,0" data-index-in-node="167">Setuju</b> atau <b data-path-to-node="34,0" data-index-in-node="179">Tidak Setuju</b> terhadap keakuratan simpulan tersebut berdasarkan argumen dalam teks!</span><span data-path-to-node="34,1" class=""><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><source-footnote _nghost-ng-c395889312="" class="ng-star-inserted"><sup _ngcontent-ng-c395889312="" class="superscript"><!----></sup></source-footnote><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----></span><sources-carousel-inline ng-version="0.0.0-PLACEHOLDER" _nghost-ng-c2052859659=""></sources-carousel-inline>	5	published	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2026-10-24 04:40:06.788174+00	2026-10-24 04:42:37.51836+00	\N	sma	7a1d30a8-8b14-4721-ac82-6affcf77f264
\.


--
-- Data for Name: recommendations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recommendations (id, user_id, competency_id, evaluation_id, material_id, recommendation_text, priority, created_at) FROM stdin;
c55413ce-8c24-4e3b-887c-ee4bd89fbba4	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	7b0976ad-587c-4b34-95f5-7d4b189bf8e1	6a1f24e6-afd5-4b1d-9b8c-3d9542b8455c	Pelajari materi 'Matematika Wajib' untuk memperkuat penguasaan kompetensimu (1 dari 1 soal salah (akurasi 0%); rata-rata salah di tingkat 3.0; jebakan tersering: "asdasd" (1x dipilih); tren menurun dibanding attempt sebelumnya)	high	2026-09-30 02:20:48.789932+00
89985ba8-42b4-40ba-bf44-8632bbad3574	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	7b0976ad-587c-4b34-95f5-7d4b189bf8e1	13ab86e7-25e8-4120-b84d-01f732abe4e9	Pelajari materi 'Coba' untuk memperkuat penguasaan kompetensimu (1 dari 1 soal salah (akurasi 0%); rata-rata salah di tingkat 3.0; jebakan tersering: "asdasd" (1x dipilih); tren menurun dibanding attempt sebelumnya)	high	2026-09-30 02:20:48.789932+00
a5baa075-cadd-426c-bce2-8ac5468ff9e9	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	2c7dc43b-ad30-4013-b176-c6025d8dff6b	6a1f24e6-afd5-4b1d-9b8c-3d9542b8455c	Pelajari materi 'Matematika Wajib' untuk memperkuat penguasaan kompetensimu (0 dari 1 soal salah (akurasi 100%); tren membaik, pertahankan)	medium	2026-09-30 02:35:54.312709+00
581d3727-26b7-4568-8c47-e7f321c6b4f7	f125ef5d-2c6f-4187-b02d-a50465b62803	50ce66b9-98af-491e-96e8-7f07110a41b2	2c7dc43b-ad30-4013-b176-c6025d8dff6b	13ab86e7-25e8-4120-b84d-01f732abe4e9	Pelajari materi 'Coba' untuk memperkuat penguasaan kompetensimu (0 dari 1 soal salah (akurasi 100%); tren membaik, pertahankan)	medium	2026-09-30 02:35:54.312709+00
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.refresh_tokens (id, user_id, token_hash, expires_at, revoked_at, last_used_at, user_agent, ip_address, created_at) FROM stdin;
ff43eda8-2239-490c-94a5-6804b978e9c6	93b71d30-3437-4c41-af7d-2f2fafb54af4	5272d757f6eac0fdc421b46997210f31421754663f96439500d6bd15a85074a5	2026-09-15 10:47:27.516713+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-08 10:47:27.564381+00
1a49cac8-dc16-4644-9a3a-4cf77d178bde	f125ef5d-2c6f-4187-b02d-a50465b62803	77aac89b4bdc406821901816bfee3cdcc6e3746bba24748ba8f9d6a72f13f7dd	2026-09-20 08:09:23.810474+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-13 08:09:24.230296+00
d2195485-f798-4761-8a2d-d88be044f292	f125ef5d-2c6f-4187-b02d-a50465b62803	b4ba2d0c86a126bf40a7f259f4660bfaa82b04d6f4a59a9491ea09ebeb47bd6a	2026-09-20 08:10:30.527875+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-13 08:10:30.776955+00
96d9ca96-7be4-4e88-9247-8273cfd5e9dd	f125ef5d-2c6f-4187-b02d-a50465b62803	c940f6a4780794a98b6bc5ab2dde26d49116583a85ccf928f1d09e731774cb66	2026-09-20 08:11:57.204894+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-13 08:11:57.849475+00
fd2d1545-9d09-4942-95cf-441dbe3ec957	f125ef5d-2c6f-4187-b02d-a50465b62803	c6bbef310fb71a26eb352a27b583e6e86314b75e3f470214d0cf7d89c4e8055e	2026-09-20 08:53:36.404268+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-13 08:53:36.706359+00
965cf9bb-2c45-4203-b039-c8156b4968b6	f125ef5d-2c6f-4187-b02d-a50465b62803	d5ee7be37d6162e8304257764856fc7b6a50c449a10f0e145c051c16a3dc9413	2026-09-20 09:07:49.780007+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-13 09:07:50.033141+00
6624294e-4ea4-41b5-a527-db15b7185da0	f125ef5d-2c6f-4187-b02d-a50465b62803	ac6be1d31787302109a7b381ca09ed5809b13bca0395b41eace26f068ed43a57	2026-09-20 09:07:50.255642+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-13 09:07:50.307182+00
d25b2308-bd35-449f-b7f4-dbd712dcaece	f125ef5d-2c6f-4187-b02d-a50465b62803	82737490f593665e62b8899dfade6a8ff963897d9deafd09656b3886b69552fd	2026-09-20 09:09:55.706067+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-13 09:09:57.066754+00
8dc0f274-662a-46b6-88d2-ad1aa8b31818	f125ef5d-2c6f-4187-b02d-a50465b62803	3b6f8a623575ce1971a0cb4219b7b73d0ed8bdf927a6b4f2081696f2913ef33d	2026-09-20 09:09:57.39848+00	2026-09-13 09:10:17.153189+00	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-13 09:09:57.570193+00
a5aadd4e-baa6-4ee4-85ea-b4c72bdd7512	f125ef5d-2c6f-4187-b02d-a50465b62803	c4e64d5811ede099fff5c31bd0fb2044947d7c5eefcbf34220b4efa0438e0b02	2026-09-20 09:10:19.237055+00	2026-09-13 09:14:53.455627+00	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-13 09:10:19.997855+00
3dbb9923-008c-45f2-a9b5-da7e2f6dfdd1	f125ef5d-2c6f-4187-b02d-a50465b62803	0b7b9b1fa4377365100052b54c2b2646a9588dcda65e2a47bc097fc6ca0b7a71	2026-09-20 10:03:30.116537+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-13 10:03:35.872053+00
a32a9b1f-9d9d-44ef-9bc1-fa3f49b7cd07	f125ef5d-2c6f-4187-b02d-a50465b62803	bb3d4eea852fb1c26d859f1ebdd12ce82bf49ef0171ec3c5e1ca918c0f2850cd	2026-09-20 10:08:54.327387+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-13 10:08:54.777692+00
6cd94b7f-4d9a-4fc5-be75-b5de980191e3	f125ef5d-2c6f-4187-b02d-a50465b62803	c5c9448bf522b6ccbad02311a6e829f7aa7e58257369b74dd5da9cc801f56761	2026-09-20 10:34:43.79491+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-13 10:34:44.121807+00
7aafe836-8420-43f3-bd0d-69486dbc1c3e	f125ef5d-2c6f-4187-b02d-a50465b62803	5f087c5cc742a5f2867ad391efa117ad2271ebf4014698a6ff9cf90870bc60f2	2026-09-20 10:39:24.828316+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-13 10:39:25.27189+00
40aa9741-de59-4919-8c44-d8f3bea36270	f125ef5d-2c6f-4187-b02d-a50465b62803	6c822cf4e611dc442ca80d93d4cad77f939737e4a8340c066ba597ac5861a84b	2026-09-20 10:56:13.03628+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-13 10:56:13.245467+00
4b429f98-5342-49c9-b0cd-4525eb2b0d02	60d9996e-1d82-41b9-b8c4-4642acdd4c08	e57111d71d5ba8c4f80fc9c83480af20b523b32d70e9c147d54477db54d45f23	2026-09-20 11:10:42.206991+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-13 11:10:42.454839+00
b3c244e4-6c6b-48f0-a00f-595dd67ef0bb	60d9996e-1d82-41b9-b8c4-4642acdd4c08	413376bcb03c3a33643d395ca494edde1dedc507c7f503413bfb13b85aa77f78	2026-09-20 11:24:48.739571+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-13 11:24:49.193937+00
d5ace7d1-7279-433d-b339-595da717d766	60d9996e-1d82-41b9-b8c4-4642acdd4c08	e0a2e4a4c65b16e0a0c0d484881acb74b9d99e2071cdf05e150d6f1a935e6426	2026-09-20 12:54:46.52731+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-13 12:54:46.5891+00
581c370b-43ac-4f99-8166-76d5de5bc337	60d9996e-1d82-41b9-b8c4-4642acdd4c08	6149fa890e925ac0b555cd915f984882810afeb4a3726d6509fdfab9c46ab331	2026-09-20 13:11:30.991381+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-13 13:11:31.542405+00
e9370956-9262-4872-8526-a67b2e2d6c23	f125ef5d-2c6f-4187-b02d-a50465b62803	6e1516c3408d74172f9039213ddb096599bcebf85d716a823c44cbe531b5664a	2026-09-20 13:16:32.679428+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-13 13:16:32.876818+00
baa98f46-9a0a-4f7b-accc-b401cee5ffe3	60d9996e-1d82-41b9-b8c4-4642acdd4c08	9773579530d6a84f746d98d48911b6428743573ae04f82b05eb7df6fb98302e9	2026-09-20 13:18:28.984154+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-13 13:18:29.0602+00
88c12f96-6d2c-4781-ba5d-13bdd45e1465	f125ef5d-2c6f-4187-b02d-a50465b62803	819d394e903c37e538ee0e95719ac791d16a0110abe05342b1883687d069475b	2026-09-20 13:19:56.957468+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-13 13:19:57.103628+00
f6d41707-c07c-41d3-afb9-f4aa40aafe76	60d9996e-1d82-41b9-b8c4-4642acdd4c08	1b00057e49b6cab6bfb08c0e4b64e927218efe8cc811e5463e61ebc8f3de081c	2026-09-20 13:25:53.413039+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-13 13:25:53.822836+00
22f574e1-11fc-463f-9b78-21c7783df7ed	f125ef5d-2c6f-4187-b02d-a50465b62803	4ebd244fb6d1e67e8b5ba6b5be93ea47d28ebfb3e9e13a56985b464345833d60	2026-09-20 13:26:01.61323+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-13 13:26:01.85991+00
7b529ece-0f2d-42a8-a8be-69a1f984761f	f125ef5d-2c6f-4187-b02d-a50465b62803	62053ac988471f8490f0602708e09464da7b2f2410f57f7ad4d35bd127265d00	2026-09-20 13:45:21.903866+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-13 13:45:22.257628+00
82ee1871-a4cc-4333-b258-c2afb6a2299e	f125ef5d-2c6f-4187-b02d-a50465b62803	b4b04680de41a8c3e985e61584711484a69a147838049ecd94c98db2bb14312c	2026-09-21 02:13:08.221726+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-14 02:13:08.276505+00
471cfec1-f57d-48d0-9494-f38b4b327c8f	f125ef5d-2c6f-4187-b02d-a50465b62803	83d13ec4833cd4b348b9f43962f1abb0369315ed9f6c459382b144b956f0f6a0	2026-09-21 02:22:38.078302+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-14 02:22:38.129399+00
38559ae8-06de-47e0-8d66-049d09ed0037	f125ef5d-2c6f-4187-b02d-a50465b62803	931b9694082ce07800df3ab286823460fac408e1bfef764de582739e3e229b1a	2026-09-21 02:52:53.796966+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-14 02:52:53.996634+00
0cc2de67-f060-4d5a-b13e-2310667041c7	f125ef5d-2c6f-4187-b02d-a50465b62803	c48ae2ed6c90dffffc07fbd696771400a9418fa5aaa2e2f297feb0e867717565	2026-09-21 03:25:46.865863+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-14 03:25:47.055759+00
408a1437-ae07-4df5-9809-ff3d15ba1ff5	f125ef5d-2c6f-4187-b02d-a50465b62803	44cf2bc84548da089d793a7b5caed1b5b7feb065d5a25ac4f5b95b6691dea663	2026-09-21 03:27:43.955096+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-14 03:27:44.104789+00
7cbca392-d2b6-434c-b16c-50851e131e9f	f125ef5d-2c6f-4187-b02d-a50465b62803	b4b53e17137cb953dd8fb598fde63cb6a166b2d75b1953c2ba5b96fa96c8440b	2026-09-21 04:06:45.913552+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-14 04:06:46.116498+00
5a11b4aa-9e36-4a6a-924c-d2bb2dd95e38	f125ef5d-2c6f-4187-b02d-a50465b62803	4252a1ae7d11cae8ee23f992f26e3a277c2085688e95b761cdb2560fa6f7ec7d	2026-09-21 04:45:59.132489+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-14 04:45:59.28025+00
eee8be3a-fce5-42a4-b2a4-20be7fe157a5	f125ef5d-2c6f-4187-b02d-a50465b62803	edf3aa755db3f022232055bd9847ecc9e3d24767e0dd6ea80831b27561f33974	2026-09-21 05:04:08.263266+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-14 05:04:08.325083+00
2042fe1a-a063-47e5-bb2e-b67c96f64fd1	f125ef5d-2c6f-4187-b02d-a50465b62803	8af90c3625ef67537300ebc8616634c50dda200881e339fc0a8b65a0c7a28bcf	2026-09-21 07:05:42.463857+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-14 07:05:42.613022+00
02ed159b-8efe-4feb-8b9c-6275e05fe389	f125ef5d-2c6f-4187-b02d-a50465b62803	2529c924a5bcc6087e89e1d3a248088c67e337f254ef4b262b499ae9f2cbd0c9	2026-09-21 07:38:03.321568+00	2026-09-14 07:53:13.462803+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-14 07:38:03.429761+00
b53b72f4-d151-47ff-85e3-a91e8965fc3d	f125ef5d-2c6f-4187-b02d-a50465b62803	dbe787702aa7060f031ea958d65be136614f4cdccdf3eb74ea6cf049ec025fb8	2026-09-21 07:53:13.880482+00	2026-09-14 08:07:24.129624+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-14 07:53:13.96937+00
9b30c187-e196-479e-bf8c-195e553c7172	f125ef5d-2c6f-4187-b02d-a50465b62803	1090eb581e7fa4fddc782b32d160bc28c69df16a68202ff91aad671d216e634b	2026-09-21 08:07:55.215368+00	2026-09-14 08:23:36.443439+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-14 08:07:55.279062+00
9d74cbd6-3cea-4927-98ea-5b28f078f5d1	f125ef5d-2c6f-4187-b02d-a50465b62803	9460cd548c9667966a38537ae3ccb15a4319349e461c03bf0ab243f862f0abb6	2026-09-21 08:23:36.852115+00	2026-09-14 11:36:42.851642+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-14 08:23:36.876723+00
83c1d305-571c-4586-9e16-94c226dfc3d9	f125ef5d-2c6f-4187-b02d-a50465b62803	4cf955b35a998f8e0ebcbb35c53889a2e9724844fbe8e2c9e90f3baf934fea8a	2026-09-21 11:36:43.232899+00	2026-09-14 11:52:16.246012+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-14 11:36:43.333057+00
ff907b52-f143-4263-a470-1c32ae42e38e	f125ef5d-2c6f-4187-b02d-a50465b62803	f4120305c467209a732608a45c149ceb2202595ebfd3013e4bfab76070242764	2026-09-21 12:05:37.893206+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-14 12:05:38.038864+00
14aaaf53-42b5-4ab8-b4d6-e1b864a3cb63	60d9996e-1d82-41b9-b8c4-4642acdd4c08	8590b814449bb949783ffbef972391fd9daa21131a53d5094ac7ae1dd43053d2	2026-09-21 12:12:35.794167+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-14 12:12:35.939198+00
a036325f-6581-4d55-a7a0-7ca11f5417ea	f125ef5d-2c6f-4187-b02d-a50465b62803	e49a6b5e809d87f4d69c55a360273fdc30860cd1e9d2334aca2916278ac2cdaf	2026-09-21 12:12:46.774791+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-14 12:12:46.89619+00
91071e5c-efd8-4d0f-a5cc-c5f2a198581c	f125ef5d-2c6f-4187-b02d-a50465b62803	62f8f5d8bdfb2596d933b7959da573f4945e301cde626d3251cf976ff1b92d2b	2026-09-21 11:52:16.65592+00	2026-09-14 12:13:16.793087+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-14 11:52:16.757568+00
b2f19037-4858-4058-b2f4-2ec541ffc351	f125ef5d-2c6f-4187-b02d-a50465b62803	3383b138a3f620ee804b4f272e4c75e37a7ce13f96e02f7de73e337f212c88e4	2026-09-21 12:13:17.207458+00	2026-09-14 12:30:01.449994+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-14 12:13:17.309248+00
c4303ab0-48a2-4741-adcc-c10a18330c55	f125ef5d-2c6f-4187-b02d-a50465b62803	36235c52209d11b858231b6ffb9feb346fc48eceaf17c9af2683be8f97ea048e	2026-09-21 12:30:01.839144+00	2026-09-14 12:58:27.359929+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-14 12:30:01.954865+00
a9a2863a-d5fb-4453-96af-b5db1376e3b6	f125ef5d-2c6f-4187-b02d-a50465b62803	c5b318fcbeca614c91e08140580ee1c441b071d966bd50070a8b346668105bdd	2026-09-21 12:58:27.819941+00	2026-09-14 13:17:04.625097+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-14 12:58:27.944705+00
e51269da-e5ed-4925-876c-18cf1aeff469	f125ef5d-2c6f-4187-b02d-a50465b62803	e037acd7bca02e083c2c4bea048e0045ac237a30c4688025365bf58e6195d575	2026-09-21 13:17:05.03493+00	2026-09-14 13:47:50.303066+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-14 13:17:05.137528+00
fc5d75d9-cf32-4d16-b24c-9fc200adf2fe	f125ef5d-2c6f-4187-b02d-a50465b62803	70ab66b343cae9f813d25b1d31a2a739e8b9b753b57f732be728b03c1384a2dd	2026-09-21 13:47:50.709824+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-14 13:47:50.812045+00
43700c12-2487-4167-9173-df91b41b6bed	f125ef5d-2c6f-4187-b02d-a50465b62803	d5dd8869e08a022744889f77b75858bfa3eab058b2d3a31adffc78353a25590b	2026-09-22 09:14:25.200089+00	2026-09-15 09:29:58.710066+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-15 09:14:25.229324+00
dfdbb783-8a84-4110-bcb0-28ba10b30c88	f125ef5d-2c6f-4187-b02d-a50465b62803	7181c2aa68658afec40fda361f25a4f1a1d4c7beb81fbbcff497b2dec7dea337	2026-09-22 09:29:58.957426+00	2026-09-15 09:56:49.606499+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-15 09:29:58.981597+00
1a3244e0-5945-4a57-a521-f57e072db1c1	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	9b93bec91ebd4135fca72b86951c08e9e85335227ff91d2aec0259280636f8ee	2026-09-22 10:06:37.790094+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-15 10:06:37.81678+00
561a34ca-5980-4c87-b713-6e66e7f32b62	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	0a71399ecc234c045508f85eda4b72888f37675eed2217d1f5615aab0b8723f8	2026-09-22 10:08:02.633504+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-15 10:08:02.705625+00
e0f75e44-4437-4d1d-b271-12d7c77ada86	f125ef5d-2c6f-4187-b02d-a50465b62803	4ac378d8c44e32277af98d8fb9f9cc58e960fee70a2c9b63cdc55e069d104546	2026-09-22 09:56:49.864974+00	2026-09-15 12:10:20.900163+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-15 09:56:49.902951+00
5bded6cd-0d1a-4671-9e82-c1ebdebe614c	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	32a87cde1d3191e04f8d9b6c223cdec9c2a347175b6bc10a7b93d080b8237f40	2026-09-22 12:07:05.349267+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-15 12:07:05.619159+00
98135b86-f0bb-4396-9569-24e8468b54db	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	aba15166e2d9da1df7984f2a0395e116eac2c2645e3a050b1b38ff3f587b63b5	2026-09-22 12:08:06.45331+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-15 12:08:06.548337+00
95675459-03f9-407e-acb8-cd3f7e9c68c8	f125ef5d-2c6f-4187-b02d-a50465b62803	5641ec8b328265cd456921c50f38149587d95aa786e9a24daed590118aa51129	2026-09-22 12:10:21.309582+00	2026-09-15 12:30:14.694611+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-15 12:10:21.411695+00
a1df3e75-4589-4f69-8120-c8bfccb8d7d2	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	c97df09adb6cc5dc7ee8295914e7a725a2e02393d70b852c226ccd36875a7e83	2026-09-22 12:39:16.047083+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-15 12:39:16.300248+00
2a13d9c7-32bd-4559-9f67-d3e82a5ca21d	f125ef5d-2c6f-4187-b02d-a50465b62803	b05a121bbb9a57258404d0acfaeaa9fefc843da66ddfb1a859855dc12b7aa1ce	2026-09-22 12:41:38.691223+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-15 12:41:38.84354+00
ea683722-651b-40c7-939b-1c33f4492751	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	06974c6263983c7a910ee777082d177831a96dcf2cf0d412ef94f26afae2684c	2026-09-22 12:42:13.618241+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-15 12:42:13.762522+00
df78f9af-2bf3-4643-bc22-1b6236f54ba6	f125ef5d-2c6f-4187-b02d-a50465b62803	80894871832ab08f17fb6a230acd7038102dcc8c8ba745f418420d3bbdbd632a	2026-09-22 12:30:15.210162+00	2026-09-15 12:46:40.211758+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-15 12:30:15.309254+00
38b02db1-a534-479d-af0e-b2b77e9946d8	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	7ddc3201b6f37f5af962d7e50c90b50f60c6b5455506578f7dac3f4a9c28f4f5	2026-09-22 13:00:54.402389+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-15 13:00:54.637934+00
81f1b896-0719-4651-a852-8407bd700938	f125ef5d-2c6f-4187-b02d-a50465b62803	247bf0dfc8e941718c31cca6e75d43d6c6aba577784e9e2e364af323e5d75fef	2026-09-22 12:46:40.621161+00	2026-09-15 13:07:56.830335+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-15 12:46:40.723507+00
0617681d-2925-4068-a6c5-c001f34b6bf1	f125ef5d-2c6f-4187-b02d-a50465b62803	b3515d24643870511b7dada651782568a293ee96e315f609da1833084cd41b04	2026-09-22 13:12:13.604021+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-15 13:12:13.752197+00
1757d999-b0a5-4718-9712-cece09f9397a	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	d6d0879ad053ec71a58161db11c0063456b3948a1fc8af4dee80654f766aea57	2026-09-22 13:28:03.688771+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-15 13:28:03.929954+00
4903c655-7fbc-4f50-b053-fdf152660876	f125ef5d-2c6f-4187-b02d-a50465b62803	6a316643bf7412bbb38d186b765d51c33b786f5d7a8f1f7b7275278c1b7f68f5	2026-09-22 13:07:57.240839+00	2026-09-15 13:28:22.464956+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-15 13:07:57.343606+00
9c2689f8-94b3-47c1-ab4a-41c9a79d0999	f125ef5d-2c6f-4187-b02d-a50465b62803	b9ebaa21dc1cc076b9470385394ae4e33b2814abcc9144eba3ede020a199ae6e	2026-09-22 13:28:22.874442+00	2026-09-15 13:50:12.158269+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-15 13:28:22.976805+00
c3baa8e1-145d-465a-ae31-2343ca2014fc	f125ef5d-2c6f-4187-b02d-a50465b62803	d429e30c9a053ec5fac52e299fea2296b0e364392b6870256403b60f24f7c4ab	2026-09-22 13:50:12.539426+00	2026-09-15 14:11:19.058793+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-15 13:50:12.64181+00
28eef2e6-dea6-4a11-a907-540baf008e0f	f125ef5d-2c6f-4187-b02d-a50465b62803	a14f21f46ece299fb9e8f5de4b759fb80f3a15d8aa1cb04d3ae9e4c679e76ba0	2026-09-22 14:11:19.541332+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-15 14:11:19.644005+00
0a33f403-b542-408d-a31b-ca7b33cfa5d2	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	7249e1a4e5c79ffc81008f414799ae61c8577f1081ab5e60241cc9603d7d7d7d	2026-09-23 08:09:27.288611+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-16 08:09:27.37148+00
f588e529-093d-41a8-9d2d-0c038f89a87b	f125ef5d-2c6f-4187-b02d-a50465b62803	0c1ddf107964604cefd9abd9dc4bef21b744152f5ab0c31e9a0aa546c56243fc	2026-09-23 08:09:42.9833+00	2026-09-16 08:34:09.738875+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-16 08:09:43.007513+00
6fb60ac0-086d-4e67-aa8d-306889770c82	f125ef5d-2c6f-4187-b02d-a50465b62803	3c0c42a3b990877b1193d132c1818b51deeeca3d64b0c6edc391e9aaccd01c14	2026-09-23 08:34:09.8431+00	2026-09-16 08:57:41.459941+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-16 08:34:09.871456+00
c3aacbfd-4f64-4087-aabc-38ca00d5cd5b	f125ef5d-2c6f-4187-b02d-a50465b62803	b6428bde617a9e7b636066cde914c23c9bade790816f19c00c37d8021f3af275	2026-09-23 08:57:41.760017+00	2026-09-16 09:13:09.868477+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-16 08:57:41.788995+00
5249c14b-497b-469c-af1f-45dac92d7e45	f125ef5d-2c6f-4187-b02d-a50465b62803	7600865ea7a43e512668998a2326a6c778c021d6ed2f3ef79c9c849401378aed	2026-09-23 09:13:10.0516+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-16 09:13:10.086996+00
a58b761e-acbf-4e72-8db0-fc01a4e26e73	bbab3c0e-fa43-40fd-8dde-e65f10309e95	a71d59bd40ad7c189c67e8dc4dbc467bb18a7fc6146034074356567bc0cc2fe1	2026-09-24 05:18:10.454929+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-17 05:18:10.479384+00
65ae02aa-ce5b-47ae-9c16-4c32f037e6e6	bbab3c0e-fa43-40fd-8dde-e65f10309e95	5c9b30dc35654e575631678be72ded9d2f55b71e5ad7ff8247df91e69cafa5c5	2026-09-24 05:18:35.494797+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-17 05:18:35.555275+00
419d3fda-d2d1-4710-9cc9-75c00f45d2d0	bbab3c0e-fa43-40fd-8dde-e65f10309e95	a93398d047defc8f9bdfee27857879db075f8efa5c3b11af91b3b9b5cc42b81d	2026-09-24 05:20:24.646219+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-17 05:20:24.793726+00
5b2aaf50-1924-4222-bdfd-652454577f09	bbab3c0e-fa43-40fd-8dde-e65f10309e95	6f9f749afb36c9548c77d267014791045435c4ded107e14b28aee1bc8e5872fe	2026-09-25 03:32:56.308864+00	2026-09-18 03:33:17.329916+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:156.0) Gecko/20100101 Firefox/156.0	127.0.0.1	2026-09-18 03:32:56.333854+00
9396759b-8290-4ab4-8f8f-83e9c46e6b41	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bdda30eb3387b4ba43384f3461e49f0c3bbda806dd573fae99a05a44f81361c5	2026-09-25 03:33:32.642923+00	2026-09-18 03:50:20.320369+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-18 03:33:32.711625+00
2d0c7e65-dd63-4462-a36a-fe9b07447e91	bbab3c0e-fa43-40fd-8dde-e65f10309e95	4aee2f4c5d7e42b64dd0b9631a615415f2b6ac37a00ac78f0c984b88a3089095	2026-09-25 03:57:22.12827+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64; rv:156.0) Gecko/20100101 Firefox/156.0	127.0.0.1	2026-09-18 03:57:22.27025+00
29abb4e9-ffcf-48b0-b51f-5306d762bf88	bbab3c0e-fa43-40fd-8dde-e65f10309e95	1c8ab79fb23415c23d4037b4dbc7bfd892aaf869a22154a85704d8d0f133ce1c	2026-09-25 03:50:20.488071+00	2026-09-18 04:44:26.437261+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-18 03:50:20.517778+00
85d092b1-2f29-41ca-8695-816cf07b64fb	bbab3c0e-fa43-40fd-8dde-e65f10309e95	b528f1904d21b87c9f5233e69c8fbe0f925f5e2d3b23da3f7578014dc3fe2c58	2026-09-25 04:44:26.703994+00	2026-09-18 06:01:33.428261+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-18 04:44:26.805216+00
d8d547f1-f70a-446d-a32e-35bcf6bfae7f	bbab3c0e-fa43-40fd-8dde-e65f10309e95	c82d36ac7351ba5f15867d6ec30274029ae06f5f4dfb2775e680e1615783d7db	2026-09-25 06:01:34.148204+00	2026-09-18 06:19:22.155999+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-18 06:01:34.249952+00
4d443b19-d92b-44e6-9eb5-65c7afd7924b	bbab3c0e-fa43-40fd-8dde-e65f10309e95	1062bc14053fd5720c36a9c1f29f43efbd2093d1c451aa2e168f57732e738d44	2026-09-25 06:19:23.475484+00	2026-09-18 06:35:14.87799+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-18 06:19:23.893009+00
74e447a3-2cfc-4500-b05f-42804b3e74af	bbab3c0e-fa43-40fd-8dde-e65f10309e95	3c6bd62bc36eb7d3eca4cbf05901dd341d05fe122e8228b888fe299284269255	2026-09-25 06:35:15.25153+00	2026-09-18 06:51:23.044987+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-18 06:35:15.34208+00
4626472d-cce1-48a3-b519-a1e0d3d860a7	bbab3c0e-fa43-40fd-8dde-e65f10309e95	f031757f62f740b63d39f3d7fd362ebabed1acee86dece93838c1ad02221df3a	2026-09-25 06:51:23.454195+00	2026-09-19 02:07:04.058073+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-18 06:51:23.557627+00
e8df2d38-4562-4513-af7a-6bcdebbc850b	bbab3c0e-fa43-40fd-8dde-e65f10309e95	4571b6579cda07c86799333e2f31e62312344a119ac67a07721bae2decaf4495	2026-09-26 02:07:04.460888+00	2026-09-19 02:32:13.907808+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-19 02:07:04.574187+00
143affa6-1757-46bd-90a7-6370e7e8e373	bbab3c0e-fa43-40fd-8dde-e65f10309e95	3ca2ef616ccab48bc1b2077b436f53151cb6a608edb96a4b34f5cbf6d06dace7	2026-09-26 02:32:14.312814+00	2026-09-19 03:10:38.1067+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-19 02:32:14.419965+00
333adcf9-404b-4fb2-8f83-9033b04d97f4	bbab3c0e-fa43-40fd-8dde-e65f10309e95	4c8b13173967bd3ff004047cb8a53bbcc56e26aec99cd3e4f6d373cba92382bb	2026-09-26 03:10:38.477339+00	2026-09-19 04:03:16.420211+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-19 03:10:38.529327+00
f965bcae-0a36-454a-92ed-f60b57158b72	bbab3c0e-fa43-40fd-8dde-e65f10309e95	0f50ab7610b258348b1cc26e50175a7bcb43352efc4d20970ce63abdab1a10a2	2026-09-26 04:03:16.829796+00	2026-09-19 04:22:41.613953+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-19 04:03:16.932255+00
cbef4490-f6c2-4709-bc72-1d3c224f46da	bbab3c0e-fa43-40fd-8dde-e65f10309e95	ca2f8d3b5351f0060b29e445b7997c5c1782803f645a4296b9e010a60edbf2fe	2026-09-26 04:22:42.023702+00	2026-09-19 04:37:45.290899+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-19 04:22:42.125957+00
d75123aa-590f-4157-86c8-9c3309222e36	bbab3c0e-fa43-40fd-8dde-e65f10309e95	39735fa549b3b28f1fe5027b3ecdb357b8f64af2947ebe5db882e6fec9c3426a	2026-09-26 04:37:45.705828+00	2026-09-19 04:57:24.343493+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-19 04:37:45.808435+00
73042573-2bd3-4118-8f1b-ba945b39078d	bbab3c0e-fa43-40fd-8dde-e65f10309e95	4f4b984d50843f6f9bae4c291ffeaaffafe95d298ee81f9fe3a21dc2e83348c0	2026-09-26 04:57:24.654688+00	2026-09-19 05:38:02.156333+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-19 04:57:24.75703+00
2bfed639-b1d9-4e58-b700-e8bfc82059f6	bbab3c0e-fa43-40fd-8dde-e65f10309e95	880ba832d523e4722b88440afad87114f545b5eaefc99f38041e92e0141e9516	2026-09-26 05:38:02.570349+00	2026-09-19 05:53:10.349622+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-19 05:38:02.670864+00
30aeefb7-c36c-4043-ba7f-b6422a2d5ef8	bbab3c0e-fa43-40fd-8dde-e65f10309e95	3ab9d3b09ca88ec80c704776b6050daf7500e630703a90c7d19db5e609d0e437	2026-09-26 05:53:10.861773+00	2026-09-19 05:57:51.644329+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-19 05:53:10.963964+00
c38ed7fa-52fd-43cb-9cf0-f23e5946ca6a	bbab3c0e-fa43-40fd-8dde-e65f10309e95	faa9c2df9a02eae87911da1a60a70390731babf6326a0447a71bdbee195021c8	2026-09-26 05:58:13.734785+00	2026-09-19 06:15:20.528774+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-19 05:58:13.864836+00
096f5034-18a5-4181-80eb-a4a8fbfcacc7	f125ef5d-2c6f-4187-b02d-a50465b62803	6e623650f9fa65af943bc56f784f8ada03b8def1b9297d3d46a7ea78fedb00d7	2026-09-26 05:07:54.678935+00	2026-09-19 06:15:34.996892+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:156.0) Gecko/20100101 Firefox/156.0	127.0.0.1	2026-09-19 05:07:54.822829+00
7746168a-14be-4512-8628-8f5ed7167da8	f125ef5d-2c6f-4187-b02d-a50465b62803	5bc9e57adda26e7489b0e7280d784b657ffcb2fc1c01ab0af4a7b48b17685df6	2026-09-26 06:15:35.275426+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64; rv:156.0) Gecko/20100101 Firefox/156.0	127.0.0.1	2026-09-19 06:15:35.377344+00
cf2fb92e-08ea-4b7b-82f5-e4096d1e0262	bbab3c0e-fa43-40fd-8dde-e65f10309e95	30fcfeb9d5c63e13932455020de227ea465216c23a97f4b83e2cd5f878c65923	2026-09-26 06:15:45.698252+00	2026-09-19 06:31:09.832322+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-19 06:15:45.822049+00
5db22b52-8459-45a9-a9dc-8a6db26c90e7	bbab3c0e-fa43-40fd-8dde-e65f10309e95	092c1303d171bf36577f82e0def40d8b07d711cc936f0f180d13dc8bdc9b304f	2026-09-26 06:31:10.622275+00	2026-09-19 06:49:46.898037+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-19 06:31:11.13461+00
fae2628f-3cc7-4dde-9a6d-eaec8d4bccbb	bbab3c0e-fa43-40fd-8dde-e65f10309e95	c274ccd81cdb94e559690c36671479ed83d4d5f3cb7d8e43974569002760f320	2026-09-26 06:49:47.205359+00	2026-09-19 07:11:11.578369+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-19 06:49:47.307694+00
2883d4fe-84c6-483e-8401-eb00823fef58	bbab3c0e-fa43-40fd-8dde-e65f10309e95	6eae8678398291c153517ee8194e3d0daaa0c77e9ac39672961e6c67f7e0231a	2026-09-26 07:11:11.888377+00	2026-09-19 07:34:29.995829+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-19 07:11:11.987741+00
abcd35a3-5090-4636-ab87-c4078dfdfcb5	bbab3c0e-fa43-40fd-8dde-e65f10309e95	3e1d7fd808a94d3ecf28ecdcdca8babd4f03572fe84e2d58a0fe09aaede784b3	2026-09-26 07:34:30.265024+00	2026-09-19 07:50:32.217377+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-19 07:34:30.367194+00
37c249aa-1a64-40cd-84c3-31b0e56fc8e7	bbab3c0e-fa43-40fd-8dde-e65f10309e95	6b2a033c57719c4ba1f5b39273c6cfa23f82337137eed5a28814957a0672f0ac	2026-09-26 07:50:32.564824+00	2026-09-19 08:06:26.959809+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-19 07:50:32.729777+00
131934dd-6183-4675-9680-3ca9a79883bd	bbab3c0e-fa43-40fd-8dde-e65f10309e95	15b36ff00c0f9c36bea976a1f2c463ec17c4350aada1dba8df61a7e6495dd56b	2026-09-26 08:06:27.211485+00	2026-09-19 08:29:43.345181+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-19 08:06:27.313437+00
167a8bfb-243e-4214-b47b-d167469eebf0	bbab3c0e-fa43-40fd-8dde-e65f10309e95	13cfb14a2d2b4c4f4548fc8ef019fafa4152bd94494d4c99bb7fea2f9ba71c27	2026-09-26 08:29:43.652188+00	2026-09-19 09:37:06.499579+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-19 08:29:43.754472+00
b35ea901-8c3f-4a4f-96c0-24f77eb3ecd4	bbab3c0e-fa43-40fd-8dde-e65f10309e95	b2875888fc31522e82823d96c28731a463ce79f20b50c8db3fc44eea39da7ff5	2026-09-26 09:37:06.808018+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-19 09:37:06.910526+00
75c52194-b4dc-4636-a781-67c9669a6633	bbab3c0e-fa43-40fd-8dde-e65f10309e95	b128abf656ed8d1b7727be4e967393408bdbab3c3006dd2069c1b08d5e20f181	2026-09-26 10:05:41.578548+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-19 10:05:41.800518+00
98a1a77b-19a2-4116-be6f-fbfe48d82f82	bbab3c0e-fa43-40fd-8dde-e65f10309e95	249ed924635475a283b0be54356b8c7afa4b42da15928c002c29f1ef40c0c01b	2026-09-26 10:07:53.135859+00	2026-09-19 10:26:18.478667+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-19 10:07:53.39734+00
e6a586ec-c446-4080-94fa-4a0fdfd53d56	bbab3c0e-fa43-40fd-8dde-e65f10309e95	5cf79348203e88a9bc1337c432562ef2063e7ba28c396cccea64d65c91b4f3be	2026-09-26 11:20:23.272557+00	2026-09-19 11:49:30.786146+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-19 11:20:23.350843+00
b0171247-75f6-4d17-9894-30b06d8bce59	bbab3c0e-fa43-40fd-8dde-e65f10309e95	12691e1d3e9134f04cd62b69561f0b2674fc23e56f631f93f777e53f7beab700	2026-09-26 11:20:22.830713+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-19 11:20:23.046055+00
96dcef32-0577-4d3d-b103-253a9953cd88	bbab3c0e-fa43-40fd-8dde-e65f10309e95	a25df2f36687c50d038ef21002c9463d01f70a02f065e19b04309408fb82c824	2026-09-26 10:26:19.413341+00	2026-09-19 11:20:22.830619+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-19 10:26:19.44406+00
e7d2dc58-8d47-494b-ad94-77b8546be6fa	bbab3c0e-fa43-40fd-8dde-e65f10309e95	4179a06417785781b2ea570cf1b38bf4cb65c432c8b471709a1c253252d7b257	2026-09-26 11:49:31.093335+00	2026-09-19 12:06:23.63115+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-19 11:49:31.195496+00
986e8a12-43d3-42b7-8ab0-5225ef8066ac	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2563d8fa76bcd2c44277a0de1543acb24c58648919e25ebdd8b2de0d5212e514	2026-09-26 12:06:23.743816+00	2026-09-19 12:24:56.517352+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-19 12:06:23.779745+00
c5f15590-ef4e-4981-836d-92cd8c929985	bbab3c0e-fa43-40fd-8dde-e65f10309e95	c7b01b494dd6705d90b8ef24a53633a0e47f1253273a7334a728fe25f65b206e	2026-09-26 12:19:49.732554+00	\N	\N	bruno-runtime/4.1.0	127.0.0.1	2026-09-19 12:19:49.810147+00
924c42b7-1d9a-47ad-a8ba-8a7129a25512	bbab3c0e-fa43-40fd-8dde-e65f10309e95	db5b139a545f2b3b2d8a458d363929fa12106bde7c56529086c3d3f910d94ce3	2026-09-26 12:24:57.079362+00	2026-09-21 06:49:43.222752+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-19 12:24:57.105579+00
5df697c4-2414-40d4-8add-7020e7076a10	bbab3c0e-fa43-40fd-8dde-e65f10309e95	8165cbc2df289c241f6136cc0a3dd16c99bfb9ce0fc71bafad25e3fdd1948cfd	2026-09-28 06:49:43.837732+00	2026-09-21 07:11:44.044704+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-21 06:49:43.940713+00
5f053b8f-6c42-46a9-98a6-1be325da4f3b	bbab3c0e-fa43-40fd-8dde-e65f10309e95	88603d7539b64ef6381727716699106651b6f6bceb1413a8f750b39f6da2dbce	2026-09-28 07:11:44.558248+00	2026-09-21 07:36:07.31873+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-21 07:11:44.66065+00
6f395fce-3f5d-433e-9132-81003e20fb26	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2b77cc69e3ed8769dbf8adc4ed2f0227409b982a16c3955a9274b126f7812a7b	2026-09-28 07:36:07.584629+00	2026-09-21 07:55:21.504079+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-21 07:36:07.681577+00
a0b95f94-c50b-43fe-84e0-ef2a92440210	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2ac4f90ba04fa3f6992ccd499f93763f20ae14efa4bbe8ce25d8f973b2afc459	2026-09-28 07:55:21.71787+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-21 07:55:21.754897+00
7d590790-9120-4861-ad03-5857d0818b24	bbab3c0e-fa43-40fd-8dde-e65f10309e95	49e4df3434cec9f409af999deb0722e0f38562da74b74659dcb18ed8a32f9c50	2026-09-30 15:27:15.50002+00	2026-09-23 15:44:35.153508+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-23 15:27:15.556682+00
0a16b07b-286d-4ba8-939e-01a599f2e1fc	60d9996e-1d82-41b9-b8c4-4642acdd4c08	8fcf1daef112b33786aee03d999c875a1a2e42f2724c8fc4bd373f7ff9cb7c84	2026-10-01 13:29:31.20189+00	2026-09-24 15:03:33.644291+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-24 13:29:31.257765+00
2cfcc2c3-7f9f-46ef-b55c-6a08d119f33a	bbab3c0e-fa43-40fd-8dde-e65f10309e95	56866acafc6042969785f2253703742cf523d68c7d5c22443d0be315208b5807	2026-09-30 16:01:37.413131+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-23 16:01:37.515438+00
72d41ff5-114e-4b06-a9de-8c35c79de384	bbab3c0e-fa43-40fd-8dde-e65f10309e95	d530ceb4c3cd537bd0182c59c04d8219000ed3eede0162effa1b5febdba4d741	2026-09-30 15:44:35.413873+00	2026-09-23 16:01:37.617937+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-23 15:44:35.467837+00
ddc9ce85-f803-47ce-b1ea-a890478789ec	bbab3c0e-fa43-40fd-8dde-e65f10309e95	06c3763c88f0427e56361ad0e0c8d94f5ec8810d65476f37552493ea37379ebf	2026-09-30 16:01:37.925021+00	2026-09-23 16:12:07.721979+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-23 16:01:38.027788+00
9209b274-ba4f-4085-8ab6-eb459932a25a	60d9996e-1d82-41b9-b8c4-4642acdd4c08	87c76e497b50762f293ad45fd1e2d0e4831821fdb4c4a9fea917f1be25b4483e	2026-09-30 16:12:18.221327+00	2026-09-23 16:27:31.340516+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-23 16:12:18.369933+00
02094d0e-45e8-4536-8df6-048305d60157	60d9996e-1d82-41b9-b8c4-4642acdd4c08	d4a9bd4d5ff4cf14409f69c28090182235dabda4a14f4df15a7678b518c39d23	2026-09-30 16:27:31.647978+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-23 16:27:31.750185+00
64d414f8-cd68-4901-97ff-dd8aa4c6c09f	60d9996e-1d82-41b9-b8c4-4642acdd4c08	66e804065d4fbce28f5dbe6cfdb4c589078ead4ac3634c4ece7d413457268ef3	2026-10-01 12:46:20.397142+00	2026-09-24 13:02:01.421832+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-24 12:46:20.520959+00
4ab5212b-e26d-4ffc-8686-b4c53c29ec0f	60d9996e-1d82-41b9-b8c4-4642acdd4c08	2e19be144f481d7e3b429769b9d0cf961a7bedee05c15b3d2c74f4209fea6232	2026-10-01 13:02:01.73356+00	2026-09-24 13:29:31.052622+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-24 13:02:01.836085+00
629a66ae-1434-48a7-a346-51915cd48272	60d9996e-1d82-41b9-b8c4-4642acdd4c08	9d653c9a8c07e262b2ceb6c986bf7c48c90aa0e15381bda457073c8c520f0b27	2026-10-01 13:29:31.138776+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-24 13:29:31.188396+00
65efc3aa-8abb-4345-909f-aca8964e6b3d	60d9996e-1d82-41b9-b8c4-4642acdd4c08	1b0d3cdfcb8577e64a1b27192a22adf9d6968ea567243b2c30861beae238d4f0	2026-10-01 15:03:33.844441+00	2026-09-24 15:22:03.28459+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-24 15:03:33.895658+00
7b7d8ce2-caf6-4972-aa93-e4799a6f2b6b	60d9996e-1d82-41b9-b8c4-4642acdd4c08	013db1774d695f7be4e9638310638e74bc3d3bf947c4c1c7137e76da23891a6b	2026-10-01 15:22:03.43895+00	2026-09-24 15:49:58.340997+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-24 15:22:03.490368+00
61b03a9d-9bcc-4267-9b2b-e53d20726a79	60d9996e-1d82-41b9-b8c4-4642acdd4c08	b561a162937c7f43477844142eb875e273114510ceb926eeae4927d527829a15	2026-10-01 15:49:58.647561+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-24 15:49:58.697189+00
ae47313f-dabd-4eba-bc46-ad47603776be	60d9996e-1d82-41b9-b8c4-4642acdd4c08	f7b66b1ff7706ed095ca01d30934e4f239f74824cb8ec2414ac2a7f9f0c5fa4b	2026-10-02 16:26:04.221565+00	2026-09-25 16:57:28.94083+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-25 16:26:04.3584+00
4b42b768-0fc7-4ced-8d1a-040904fffb06	60d9996e-1d82-41b9-b8c4-4642acdd4c08	b822ca8bc5689af41fe471615cc5165eef9f4b8f4e4fcfcbf79b7ba4ce472406	2026-10-02 16:42:55.288683+00	2026-09-25 17:09:20.878762+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:156.0) Gecko/20100101 Firefox/156.0	127.0.0.1	2026-09-25 16:42:55.292794+00
c5de7e1f-e388-41f5-814b-63d4b225a43d	60d9996e-1d82-41b9-b8c4-4642acdd4c08	8c3531692c851fc6306f796a05520673ec5c8083faa577bca484b9c7682fbec1	2026-10-02 16:57:29.250458+00	2026-09-26 03:01:55.206606+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-25 16:57:29.350297+00
b418f894-137e-4a59-9de7-64e123cb4045	60d9996e-1d82-41b9-b8c4-4642acdd4c08	6a8458feb289c175d1b1e601fa2c727358695a9f678955ca6a7ba3eb7a309670	2026-10-03 03:01:55.411555+00	2026-09-26 03:17:09.648631+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-26 03:01:55.513659+00
cfcf457c-555b-4833-b26b-3aa71234cbd1	60d9996e-1d82-41b9-b8c4-4642acdd4c08	13476b9b61adcbf4051a67578cb929f5fe2513ff665a799ded9beb4e41b4ea21	2026-10-03 03:17:10.057799+00	2026-09-26 03:52:46.551903+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-26 03:17:10.160463+00
1eeea7c1-d5a3-462c-94c0-c6804495dc1e	f125ef5d-2c6f-4187-b02d-a50465b62803	0ecdea10e6d7cffe68350e8cd072ec1d8a0a7ca8bf2b351638480ca9c44158ac	2026-10-03 03:14:28.007964+00	2026-09-26 04:06:33.512323+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:156.0) Gecko/20100101 Firefox/156.0	127.0.0.1	2026-09-26 03:14:28.260288+00
a3ac8723-9d57-4d86-a312-be223296ea58	60d9996e-1d82-41b9-b8c4-4642acdd4c08	7f8907e0308bf8da553635eec8bbbcb2e0a712aee3ae57369300c9c2cd8912fc	2026-10-03 03:52:46.858986+00	2026-09-26 04:07:04.086676+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-26 03:52:46.961342+00
7df7c7bb-e628-4420-b105-5fc62d6cf462	f125ef5d-2c6f-4187-b02d-a50465b62803	0ae833eb2bbe90b735410ab360de0d638f13dcb898a8ab8dc5bb78b0ed4b50e0	2026-10-03 06:05:43.481484+00	2026-09-26 06:21:50.77295+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-26 06:05:43.55193+00
d2aaa19a-1b49-42f9-b02d-d025f2c83634	f125ef5d-2c6f-4187-b02d-a50465b62803	aac3a1fddbbf7ff866762353295f19430f429bcd7d92c24281e84e8b6383df2c	2026-10-03 06:21:50.994107+00	2026-09-26 06:39:48.615133+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-26 06:21:51.061281+00
077658e3-bee8-47a0-9f82-085606e2f830	f125ef5d-2c6f-4187-b02d-a50465b62803	6c239dd6e25b17677ab06b163c57f3385749a3ac9596b798a380407d40b769b5	2026-10-03 04:06:33.674709+00	2026-09-26 06:39:48.615017+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:156.0) Gecko/20100101 Firefox/156.0	127.0.0.1	2026-09-26 04:06:33.72734+00
94ed94af-a579-4c8b-a306-72363e00aef7	f125ef5d-2c6f-4187-b02d-a50465b62803	66b223becd6d94579024203ad8613acbe8ce637da30660c4ad3da7a8264766d8	2026-10-03 06:39:48.786714+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-26 06:39:48.852169+00
c3d1eaf0-64b6-4e9e-9da5-5db963dc60c6	f125ef5d-2c6f-4187-b02d-a50465b62803	bf530295fdbddf5db81aef26184fc15bd59e31ba1c5500c4853c850d39537bfc	2026-10-03 06:39:48.855788+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64; rv:156.0) Gecko/20100101 Firefox/156.0	127.0.0.1	2026-09-26 06:39:48.913278+00
9cab6b02-fb52-4f27-b72f-216e295054a8	bbab3c0e-fa43-40fd-8dde-e65f10309e95	e9ba6b99fd0c37cb406ab880cbe43d2269b7082dbfb658917f898af02600b08c	2026-10-04 01:49:28.003721+00	2026-09-27 02:30:41.185302+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-27 01:49:28.127549+00
e5cef36c-50cb-423b-8f24-c532e45ec506	bbab3c0e-fa43-40fd-8dde-e65f10309e95	330ccaf860590d0a9f5f08c406172be584dbcae1a8da38e406942e772a534ec0	2026-10-04 02:30:41.390922+00	2026-09-27 02:36:53.310873+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-27 02:30:41.49234+00
72dfcbe7-d10a-4500-9cfa-4d09f77e63d0	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	818d32060cf8e5755d300141fbf09ce37b5ce4c477604b5fe0c7d9cdf4effbdb	2026-10-04 02:37:04.906225+00	2026-09-27 02:57:42.177946+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-27 02:37:04.958901+00
86b4ea29-0642-4d16-ac3f-121451297f92	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	e9ab6f824ef128fa17dbe07a9715ac433770ecd257db3e16f7be353974a03c20	2026-10-04 02:57:42.485049+00	2026-09-27 03:12:44.013171+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-27 02:57:42.587068+00
676f5b14-de46-4478-a592-c896fe409331	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	9468a622681c25e7877eeb7aeeb29a8da1dd5e5e78aef34d6f8c9af01db87aef	2026-10-04 03:12:44.209413+00	2026-09-27 03:32:42.174068+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-27 03:12:44.312866+00
2ce9bbb3-7b08-41b5-a3f4-df9616baa747	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	18ded7e439726395f3aa0b01451782486d99e0acd75d9d16eb8473d44dc95d3c	2026-10-04 03:32:42.379031+00	2026-09-27 03:59:11.730983+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-27 03:32:42.481802+00
7636d065-9a7b-4a7f-bfb3-add5e198bd0c	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	778503a487328131ef5b05a0c49b0ce84ff2ba9d286c40fdddc0fdf6bff33301	2026-10-04 03:59:12.052547+00	2026-09-27 04:23:08.720274+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-27 03:59:12.155147+00
eaaea1d1-7705-4ef3-977c-b273c2d15d97	f125ef5d-2c6f-4187-b02d-a50465b62803	7414e7ddd0352d9571d59e3b6570baea93a99f66c62a325fa6f32e078392bb28	2026-10-04 02:49:08.919115+00	2026-09-27 04:23:26.844989+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:156.0) Gecko/20100101 Firefox/156.0	127.0.0.1	2026-09-27 02:49:09.05282+00
44c35a88-7049-4e3d-ab30-59d707437baa	f125ef5d-2c6f-4187-b02d-a50465b62803	484aa3239e254104fdaecedd1df1af30aa31c74c7d8f24e1978563408127c726	2026-10-04 04:23:27.15197+00	2026-09-27 04:49:32.732236+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:156.0) Gecko/20100101 Firefox/156.0	127.0.0.1	2026-09-27 04:23:27.254343+00
ab2aa02d-05fe-4e9f-b090-4cafba393aec	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	efc9e61ed18f2808258ed8523676e86af666cacb85a62af4555bbab1604e5848	2026-10-04 04:23:09.028153+00	2026-09-27 04:52:27.229769+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-27 04:23:09.130027+00
f3700ede-c58e-4d7e-9832-cbc0b2cb1dc0	f125ef5d-2c6f-4187-b02d-a50465b62803	790b86747b544f3dc6313584740d9dbc5761c8f2c3039caa5a986549b167fb5e	2026-10-04 04:49:33.039781+00	2026-09-27 05:05:31.542442+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:156.0) Gecko/20100101 Firefox/156.0	127.0.0.1	2026-09-27 04:49:33.141371+00
ba29c35e-e064-41f0-930c-b7f85fa9beb9	f125ef5d-2c6f-4187-b02d-a50465b62803	e02081874c65591b78b024540ac013968518f4ed63928e75f902d77e30054cd7	2026-10-04 05:05:31.844618+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64; rv:156.0) Gecko/20100101 Firefox/156.0	127.0.0.1	2026-09-27 05:05:31.899584+00
0e4c78cf-c8ab-4245-b339-982c1e32bcd1	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	d0a572324e67d6ca9914bb977609d90f267110421260190dc79fa2ad41749ab5	2026-10-04 04:52:27.535858+00	2026-09-27 05:10:24.815907+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-27 04:52:27.643259+00
52ad2460-4b7e-4574-b43f-fda14308c33a	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	5f61040c40c9ec05fa8362afcb475b608f2599c9deb56df3f6c37c3fd6375305	2026-10-04 05:10:25.128883+00	2026-09-27 05:19:36.765868+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-27 05:10:25.231716+00
bc1a85b0-3200-4393-914f-77933145b74f	f125ef5d-2c6f-4187-b02d-a50465b62803	ec52a909b91a3278cc2c665d772a1e0b987bfe016fc49bf9f142744f60061e1f	2026-10-04 05:19:55.45026+00	2026-09-27 05:35:04.083322+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-27 05:19:55.605115+00
5d2c1cdd-98ce-443b-9a15-e508a496d721	f125ef5d-2c6f-4187-b02d-a50465b62803	1298e403d280e3be8292670dd5de28bff59509024f0d6c54fa06db27c9ef34e1	2026-10-04 05:35:04.390134+00	2026-09-27 05:42:25.936041+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-27 05:35:04.492528+00
d269fab2-6d57-46c6-8521-de1497b3e7eb	bbab3c0e-fa43-40fd-8dde-e65f10309e95	d3e0cdfd51ad057dce4315bbfc6e7de115cee345c029fe5aa688e0d30bd92070	2026-10-04 05:42:42.680628+00	2026-09-27 05:45:18.099057+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-27 05:42:42.831979+00
bead51bf-e5f8-4f5f-822d-9c66337cb7ed	f125ef5d-2c6f-4187-b02d-a50465b62803	4f8f173bee7f01155bae26f0cf94d84d68a8be8f5a50cbcb14c3fb6d33a5a439	2026-10-04 05:47:19.825629+00	2026-09-27 06:09:44.558185+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-27 05:47:19.872885+00
2ed25652-48cc-4ae9-8012-9c8e9200d30f	f125ef5d-2c6f-4187-b02d-a50465b62803	8746e7de8a16105bf235c163a1eca32801381632a0cd495540e851db6e43b398	2026-10-04 06:09:44.864537+00	2026-09-27 06:41:06.14887+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-27 06:09:44.916544+00
d515d9ac-ea9c-411d-a037-6cec94a1ae4d	f125ef5d-2c6f-4187-b02d-a50465b62803	d9cbffe9d886a1d47e688bba915c049d9da396650fc0919ba2540646802527ff	2026-10-04 06:41:06.353548+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-27 06:41:06.402624+00
5429a2e7-918a-433c-aa0f-d0067de87784	bbab3c0e-fa43-40fd-8dde-e65f10309e95	493842e6328ed7ded4ae500d7e13e6d0fe38923d510775f505b9fcf6b7cf6f4e	2026-10-04 06:20:39.989114+00	2026-09-27 06:44:01.863566+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:156.0) Gecko/20100101 Firefox/156.0	127.0.0.1	2026-09-27 06:20:40.137138+00
f45a88ba-9ba6-462a-9687-dc7f458c3c2a	f125ef5d-2c6f-4187-b02d-a50465b62803	faf7d0117937cfa8b5369ea64ddb438f8b6ee329446afdd75240c1397758781d	2026-10-04 06:41:20.591985+00	2026-09-27 07:03:25.123509+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-27 06:41:20.641752+00
871a0b94-05e5-487a-b0b2-35b931d99f94	bbab3c0e-fa43-40fd-8dde-e65f10309e95	a5f3314dac1ffdf70857bbcfeee906cf75a839dbaa74e481dfacd8a296638d5f	2026-10-04 06:44:02.175834+00	2026-09-27 07:04:13.763216+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:156.0) Gecko/20100101 Firefox/156.0	127.0.0.1	2026-09-27 06:44:02.277881+00
2bac48d7-9e66-481f-b26e-23eb702bfe8d	bbab3c0e-fa43-40fd-8dde-e65f10309e95	0c9d856d975ae8aade7e4cda0676cf644a9d53d5d033b644563aef36fff7ab3a	2026-10-04 07:04:14.065826+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64; rv:156.0) Gecko/20100101 Firefox/156.0	127.0.0.1	2026-09-27 07:04:14.172949+00
50f8f07a-3696-4592-9be5-f93ccf649357	f125ef5d-2c6f-4187-b02d-a50465b62803	bd879a3c585171e2b1a010e1129fadc5bf4870e0b0763599848c430a8958f9cb	2026-10-04 07:03:25.433342+00	2026-09-27 07:27:59.013275+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-27 07:03:25.533013+00
71fb2bea-af6e-4e99-831a-b7a5cc8a77c7	f125ef5d-2c6f-4187-b02d-a50465b62803	021aeba722195e712a68029a419e6a326d31cfbd5f4c346daa6cf3991285651f	2026-10-04 07:27:59.218744+00	2026-09-27 07:44:09.648798+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-27 07:27:59.315905+00
5f787931-c33c-4cef-afeb-90a3c0d1cdb9	f125ef5d-2c6f-4187-b02d-a50465b62803	7b43ce37e8fe7ef7c281e15553ed5d303ae4a352239b8071217d5a93a4dd2db7	2026-10-04 07:44:09.956458+00	2026-09-27 07:44:11.652787+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-27 07:44:10.05898+00
d5bc176d-b72e-4422-9a9a-a55e390c7e43	f125ef5d-2c6f-4187-b02d-a50465b62803	413b48cb787542d4418379465ded8823788a56cdc72964721f257b476cbeedb3	2026-10-04 07:44:22.96886+00	2026-09-27 07:59:24.737796+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-27 07:44:23.022159+00
cf1ec544-2376-40b1-9e94-45873844a767	bbab3c0e-fa43-40fd-8dde-e65f10309e95	0e60f9274974927d67e9a9ad79f26afeb7e6b7a3a523d25824ee0a98b03d9af3	2026-10-04 08:14:11.704362+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64; rv:156.0) Gecko/20100101 Firefox/156.0	127.0.0.1	2026-09-27 08:14:11.753411+00
a38c6379-a1f3-49c8-84fb-a887c3d402e0	f125ef5d-2c6f-4187-b02d-a50465b62803	990c7cf521576c78e3dbb921d048c09419b844b7ca905848081059c2b46be598	2026-10-04 07:59:24.902401+00	2026-09-27 08:15:20.889797+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-27 07:59:24.955254+00
ff1e21c8-99a3-4513-96eb-604ed66108ab	f125ef5d-2c6f-4187-b02d-a50465b62803	3b958a79c812a23e46e481bb3439ba81ddebce449bfdd4d302af75989e971190	2026-10-04 08:15:21.099496+00	2026-09-27 08:31:37.341601+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-27 08:15:21.202603+00
4fb28af3-10f8-4986-bb90-a5050f887d43	f125ef5d-2c6f-4187-b02d-a50465b62803	35f11fdecd0acf482c5eba778aa6c47dfc9357a5c4f800bbc86453a4206cc5e7	2026-10-04 08:31:37.494036+00	2026-09-27 08:48:17.403407+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-27 08:31:37.545863+00
b3a89bbe-f8f6-4eef-bab0-196d535c2ba4	bbab3c0e-fa43-40fd-8dde-e65f10309e95	655f4e3331d34e68f69f26e96863604b65370f753867b164c7ec70203de7d32f	2026-10-04 08:18:59.65507+00	2026-09-27 08:53:53.498203+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:156.0) Gecko/20100101 Firefox/156.0	127.0.0.1	2026-09-27 08:18:59.703448+00
cbc19863-aff6-4539-91d1-c19a3190ec82	bbab3c0e-fa43-40fd-8dde-e65f10309e95	c9a3101a84a22ea106d9defa994ee5b74a9082f1ff5ffd7d930f00629b05e149	2026-10-04 08:53:53.6383+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64; rv:156.0) Gecko/20100101 Firefox/156.0	127.0.0.1	2026-09-27 08:53:53.685543+00
ba8e302c-c4e7-4a10-92c4-7ae9ad9389ec	f125ef5d-2c6f-4187-b02d-a50465b62803	4b27f0ac7a7302554a9c626b2b203aa34de89c404be0c4e17780fdcfa63acdef	2026-10-04 08:48:17.667989+00	2026-09-27 11:53:59.230044+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-27 08:48:17.812544+00
7fa2ad92-31c4-4f48-83d2-eeddcd633c6f	f125ef5d-2c6f-4187-b02d-a50465b62803	8efa2c89a8446fdda240adc064536eaf51c7c184c6c39eaa87aebba3402503ae	2026-10-04 11:53:59.545312+00	2026-09-28 03:08:09.951849+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-27 11:53:59.673054+00
db334ab7-89be-443c-9e7f-5c4e828c7954	f125ef5d-2c6f-4187-b02d-a50465b62803	90789667308b29be63a2855b93f9f2c7cbb50f89893772a05df2d2624bd53571	2026-10-05 03:08:10.263159+00	2026-09-28 03:23:14.05596+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-28 03:08:10.368665+00
3ec2368f-16a0-4ece-bc2d-1549ab411480	f125ef5d-2c6f-4187-b02d-a50465b62803	eb2717bdd565413c1b6e8d08e4ab18fcd243085e969719a4b4c717744cb96180	2026-10-05 03:23:14.363263+00	2026-09-28 03:40:24.554443+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-28 03:23:14.465223+00
15dbdd55-67f1-4d89-91c5-eef51e41f84c	f125ef5d-2c6f-4187-b02d-a50465b62803	0dcba0ecaacd5e15961c1e7a0a8b23ca477d47a01ce18f7f862939342ac14562	2026-10-05 03:40:24.861342+00	2026-09-28 03:41:55.504054+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-28 03:40:24.963693+00
89530e3f-8763-4310-8925-23ab4a63cd47	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	622a971a71aad8cff178f8776daa8e476cff734c54710ce071476f2fb4491c2f	2026-10-05 03:42:29.326324+00	2026-09-28 03:51:28.805222+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-28 03:42:29.473433+00
a02380b3-2d1d-4181-b7d4-3541ae20985e	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	27f2452c7cb162b0e2355778556c28134a189857d03f7764c4b0c96ff76f537c	2026-10-05 03:51:41.057826+00	2026-09-28 03:52:05.565804+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-28 03:51:41.196217+00
e535c1c4-052f-405d-8ab5-d37542dd91c2	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	7ea0c713700c323b5e55e426c2eb702ab1d4516f3f35275d04bac8c89ff5b71c	2026-10-05 03:52:13.635798+00	2026-09-28 03:52:21.542702+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-28 03:52:13.75773+00
12373aec-a6ce-4804-b72c-bd1f0419a14f	f125ef5d-2c6f-4187-b02d-a50465b62803	e141614aeb989de51d99109baaca84d6e9c6d19cdd9fdae1a38eda35b0817742	2026-10-05 03:52:32.545457+00	2026-09-28 03:52:44.406875+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-28 03:52:32.701407+00
cc14a720-7cc0-4380-9d24-dfab49fd8e4a	bbab3c0e-fa43-40fd-8dde-e65f10309e95	9e1f911a32e3cc4e43579d1fc718a21acbdbb4244b6332d03013aa79e403436a	2026-10-05 03:52:54.11177+00	2026-09-28 03:54:29.640477+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-28 03:52:54.204962+00
7a58603f-3ca5-446a-8a04-bcd45c025453	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	7c100672ea2379f0d405349c8a8681e80e841ddd315bb74e9d82f9f70d6b46ff	2026-10-05 02:42:26.014226+00	2026-09-28 04:31:18.587007+00	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-28 02:42:26.016671+00
63faf482-c41f-41e6-867a-079a16cdb7ac	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	b3deb7448330093b21cfc4a69e5205a227a9d25c428315aa6596b668a14108a3	2026-10-05 03:54:39.858505+00	2026-09-28 04:37:42.650947+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-28 03:54:39.983294+00
92b917b7-8bc2-47f0-ab2d-728d8ce91407	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	047f6eca44e1b1ccbee3e88f51f2c8dcd02332890ec55c6166aaa002313916f1	2026-10-05 04:37:42.957968+00	2026-09-28 06:27:34.133257+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-28 04:37:43.055595+00
833e6327-41a7-424f-b434-112835f20aed	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	aaef8e19073cac0f50ec99813f23959bc97906a87dd1460e2b86bdabb7f6ea68	2026-10-05 06:27:34.443041+00	2026-09-28 06:27:37.201101+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-28 06:27:34.542895+00
b6adff39-ebe4-45fd-a6cb-acbaf34f273c	f125ef5d-2c6f-4187-b02d-a50465b62803	9622154309f38a60d4a1ac3259088664deba8fba7968f668c3d490269b5030a7	2026-10-05 06:27:56.716164+00	2026-09-28 06:56:31.840947+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-28 06:27:56.86638+00
dd20df0e-39c9-47f0-9354-69ba3167c1ad	f125ef5d-2c6f-4187-b02d-a50465b62803	10bfdc70c8c275b0586bbde1b1cdaeddb6dd3b03d9ffb60d8d4ed4fd44b05726	2026-10-05 06:56:33.187279+00	2026-09-28 07:12:51.684518+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-28 06:56:33.904488+00
94ddec1d-c61f-4a10-b668-271bcf54748e	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	26dff1031f7d6f5544eda59abdb2b16b262efecd23350d0e0c9817917a958f20	2026-10-05 04:31:18.597227+00	2026-09-28 07:15:45.387761+00	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-28 04:31:18.599302+00
c769cb82-4a83-4d10-9909-4d74748a9456	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	68ea9e1b1f5c351168f95d0771cc1424288fb1021e11f2c63138e4e595b15f3e	2026-10-05 07:15:45.394291+00	2026-09-28 07:16:41.561285+00	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-28 07:15:45.39595+00
95fb062c-2810-4202-b39b-0dfad91bc7c6	f125ef5d-2c6f-4187-b02d-a50465b62803	8af93309a5374512f355e577a137caea9a7f65a86834b705acb4df2c05d2ab89	2026-10-05 07:12:51.850303+00	2026-09-28 07:29:55.813925+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-28 07:12:51.904932+00
1a7d2e0e-c1d2-467f-957a-854f299e1ef5	f125ef5d-2c6f-4187-b02d-a50465b62803	f21ee894078c6602d6c2d754921d7c0fa7fa6388ffcfb2d74a4a31b8d6abcc4b	2026-10-05 07:16:54.038909+00	2026-09-28 08:36:16.13106+00	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-28 07:16:54.041525+00
982b8003-58dd-4f59-89cd-8427de4683de	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	a5d5971b23900e2426ef1dadb799cb3a5cf0316111643ac996e9a502dd0cb925	2026-10-05 07:30:12.625277+00	2026-09-28 07:46:29.957417+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-28 07:30:12.745786+00
4963d4df-80e5-43a5-8dba-6ebc20f101d4	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	cecb2bd2fe654314f0128b829b39f507a9e968a90cd9cd50d470a885a05b6b4d	2026-10-05 07:46:30.264286+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-28 07:46:30.366723+00
5ee65107-ca84-4524-b227-d4d67880ded3	f125ef5d-2c6f-4187-b02d-a50465b62803	c4ce674e6dbfe735e7ebaa3f7186efc63c2e161977c7ca037203dbc1499b9d00	2026-10-05 08:36:16.141266+00	2026-09-28 09:06:38.225339+00	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-28 08:36:16.143275+00
c30d78c8-3a8c-451c-bf6e-758b7d087881	f125ef5d-2c6f-4187-b02d-a50465b62803	9d97f6c64331f11ed30bff2b22b5bbad51793e0fdb964d8a727ffadc828c0c06	2026-10-05 09:06:38.236735+00	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	127.0.0.1	2026-09-28 09:06:38.239225+00
35ffe58e-f82d-4d5d-b452-fc889609b849	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	82a8a755308e923d4841d3af67a73135891f081d5858f5d0df38debc5b64ff63	2026-10-05 14:51:10.117368+00	2026-09-28 17:27:47.822128+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-28 14:51:10.278656+00
a9b63db0-1d07-4987-b5e9-cc40cd7f40ba	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	61705b8d0955ddfe6e353ba4a5c05473e80be6c780eb66d8f111ba39d6717570	2026-10-05 17:27:48.14559+00	2026-09-28 18:19:36.322794+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-28 17:27:48.181374+00
273ba117-ef9a-4a1f-811c-9b83c14a83a5	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	66b2a42adf46f1d0065154f30287c73e2cb85a06a890939016934eee0b4934b3	2026-10-05 18:19:36.537023+00	2026-09-28 18:38:17.334566+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-28 18:19:36.60764+00
1cacf327-e1d8-4aaa-833d-58c83de3b0fe	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	4d7b57152286646a23745494e98372c5ff028fbb56a6dc86bb1930e128f12bae	2026-10-05 18:38:17.577382+00	2026-09-28 18:59:35.818978+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-28 18:38:17.678639+00
a534f2f8-2eeb-4e8e-9fd8-f7ed8bb5f730	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	d89c9fd989c36a7528fddb8234c844e4092907ad1c68e36c1251ac9f590aa089	2026-10-05 18:59:36.130521+00	2026-09-28 19:22:17.525965+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-28 18:59:36.23305+00
11e7adb9-f164-4a26-98c3-54f00ca86e22	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	40454a7a88c2d05f69319db2a36628f8defe3ff6cdd4cbb309ab227c2fe0de9e	2026-10-05 19:22:17.731592+00	2026-09-28 19:39:03.213167+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-28 19:22:17.838794+00
4674d591-e8f2-4a0b-8fa2-acdc565bca78	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	3a46e2eeb6476493e1b6333dbc2a8d8baf651db110dfe73aae5fc6b9d9c60509	2026-10-05 19:39:03.56495+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-28 19:39:03.667294+00
eb1f30e3-07da-4b2c-a95a-b0ee4470ad26	f125ef5d-2c6f-4187-b02d-a50465b62803	5bbaa5816eae6c8b2907f33cb359423d9511fe2c9f50e485897ba257de06e8a2	2026-10-05 19:27:58.366576+00	2026-09-29 03:51:56.829262+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:156.0) Gecko/20100101 Firefox/156.0	127.0.0.1	2026-09-28 19:27:58.571554+00
6572d207-c690-4127-8cde-7812eba9e45d	f125ef5d-2c6f-4187-b02d-a50465b62803	cd0746828ff658878b60c067ed5813150bebb6e87d15de3817937f48a0378635	2026-10-06 03:51:57.435575+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64; rv:156.0) Gecko/20100101 Firefox/156.0	127.0.0.1	2026-09-29 03:51:57.533911+00
7aae3397-b16d-49bb-b28d-ba303f9aead7	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	db14b313b9aa435570901c4fa09ff6f55890eb399c299d8664e53f6af2df0589	2026-10-06 03:46:32.340321+00	2026-09-29 04:08:40.58414+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-29 03:46:32.488518+00
ba518d72-9c54-4b6a-b47a-1f32f3dfdd7b	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	df05d1f95662694fd64106f6e3bc401f8c7b052f6922513a7fe1d37b31d68e62	2026-10-06 04:08:40.732447+00	2026-09-29 04:27:17.889164+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-29 04:08:40.780284+00
d774b0b8-bb1f-47d6-9550-9c329a9246ce	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	ea274b14b4613fe5a9cb93c2e4b6102485c617ceecc1bf6135e6bf3786705fb9	2026-10-06 04:27:18.03942+00	2026-09-29 04:55:34.192258+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-29 04:27:18.087737+00
72f6dfe7-dd06-4f4f-bd51-6967b2110cd7	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	d945d09425458b9525976a927369a21ede0afdb711f49139e874d32089655fcb	2026-10-06 04:55:34.360296+00	2026-09-29 06:36:43.891285+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-29 04:55:34.414956+00
88f07935-dddb-46e8-b49a-46331f3085d5	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	f5060968700de86d0ed7af50fecdc825417c1af65e66ecc3c346dff4be6a43a6	2026-10-06 06:36:44.09667+00	2026-09-29 06:36:58.69647+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-29 06:36:44.153194+00
373690ec-caa5-488e-aa4b-fb30b840f6b4	bbab3c0e-fa43-40fd-8dde-e65f10309e95	0142b534053af8eb3a7c2892c217c1b415fda06ee28c09653900ad8f3fd1dcdb	2026-10-06 06:37:58.524943+00	2026-09-29 07:17:55.471103+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-29 06:37:58.573145+00
2c52c260-4f1e-48f2-9766-06a722fd84f1	bbab3c0e-fa43-40fd-8dde-e65f10309e95	3c1a6de845e0c5e2de4b3e44ff20c0270080325dbd505e7c88e129988675167e	2026-10-06 07:17:55.618497+00	2026-09-29 07:18:38.009324+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-29 07:17:55.666427+00
23188bb1-b800-4be9-8568-b2b6a3027ccc	bbab3c0e-fa43-40fd-8dde-e65f10309e95	c3beb7be22017da7ccb0437a637f0916d5cd3adffce52b4647dcabdcc9db04da	2026-10-06 07:19:01.395022+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-29 07:19:01.444704+00
cf166a02-b723-4033-abb0-8fc26681ad9f	bbab3c0e-fa43-40fd-8dde-e65f10309e95	1c32dcfc76960f67f14f9024e41b56d852536b11ad64862289e4d1c45ff96370	2026-10-06 07:23:49.026767+00	2026-09-29 07:24:11.288524+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-29 07:23:49.078896+00
c7a70578-fbb9-4bd4-bedd-a332fbb8864a	bbab3c0e-fa43-40fd-8dde-e65f10309e95	4c154024c0e3041cd45de1f6a03817f93791a3f68d5d6193e767e0c8438989d0	2026-10-06 07:25:00.317433+00	2026-09-29 07:25:10.307838+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-29 07:25:00.364829+00
ce79cb1c-3c18-4b3e-81b4-136aa924943a	bbab3c0e-fa43-40fd-8dde-e65f10309e95	0bcd59abd08969671af07ab0510009bc2fb369b34eb7f2025b2e92db4f50561b	2026-10-06 07:25:49.332763+00	2026-09-29 07:33:47.215817+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:156.0) Gecko/20100101 Firefox/156.0	127.0.0.1	2026-09-29 07:25:49.390245+00
f99f224e-46e6-4b92-ad8f-7f5f49d51d2b	bbab3c0e-fa43-40fd-8dde-e65f10309e95	cafbd66466fa690f3676fa8f032575924755eea1fba7019f2d600c4558f63dd2	2026-10-06 07:34:06.547606+00	2026-09-29 07:34:19.182722+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:156.0) Gecko/20100101 Firefox/156.0	127.0.0.1	2026-09-29 07:34:06.605425+00
8fbdc5a4-300f-42b4-8a41-4e481154b74d	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	87604793ff91938a47867b8680d5c6cb3522b35622cd90f6e4f6581bfa664ad6	2026-10-06 07:25:20.782323+00	2026-09-29 07:34:37.947187+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-29 07:25:20.838247+00
5be355ae-9abe-485d-a7a7-60160a2025a7	bbab3c0e-fa43-40fd-8dde-e65f10309e95	b652785bdb0c8709b089fd5babd0315d2e72d06903a10df42f00fff6f050b89b	2026-10-06 07:35:26.48672+00	\N	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:156.0) Gecko/20100101 Firefox/156.0	127.0.0.1	2026-09-29 07:35:26.545151+00
03866d2e-cf27-4382-9141-b50fce40fc56	bbab3c0e-fa43-40fd-8dde-e65f10309e95	783c2aa73e9d8a8ea527ca54a6a7a4a2d18ef14a303706e42b8919dc08f0fe01	2026-10-06 07:37:33.742615+00	2026-09-29 07:40:49.93559+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-29 07:37:33.798711+00
f6031af1-268a-4ba8-924c-51894a6cfe0d	bbab3c0e-fa43-40fd-8dde-e65f10309e95	5d09966308523f8085be6ffb1eb19060e8e07f8dafc3403b194a2c72aa72db24	2026-10-06 07:41:05.772016+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-29 07:41:05.821489+00
14940b08-87d6-4701-a982-dce1835cff0f	bbab3c0e-fa43-40fd-8dde-e65f10309e95	3e46a799a295eb0a0730ee71892a94e361a4bdb1dcc996b4bedc218ccde1f7de	2026-10-06 07:42:43.709265+00	\N	\N	bruno-runtime/4.2.0	127.0.0.1	2026-09-29 07:42:43.764109+00
72822ea6-a266-402f-9edf-7b1377fff8c1	bbab3c0e-fa43-40fd-8dde-e65f10309e95	55295d8b740fe6ef3d53d058aa6605f5729476f30689cdc8cb0b2eb3090d6fa3	2026-10-06 07:46:31.554247+00	\N	\N	bruno-runtime/4.2.0	127.0.0.1	2026-09-29 07:46:31.605103+00
498a750e-aa7c-45b9-96f5-524889e4a65d	bbab3c0e-fa43-40fd-8dde-e65f10309e95	6e458ee2209f40444d3e038743f76c3b0d6972c0fc618d67b779b31369bcb249	2026-10-06 07:49:05.103087+00	\N	\N	bruno-runtime/4.2.0	127.0.0.1	2026-09-29 07:49:05.153195+00
5fb4f3cb-fbcc-4f26-85a4-64fe77b5f2be	bbab3c0e-fa43-40fd-8dde-e65f10309e95	23c6825c2dabfef43a0a2cf9461b38a6a262c44a2f2f58bbc999679521d06008	2026-10-06 07:56:33.618911+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-29 07:56:33.668442+00
475a1f68-0acb-4d47-bbc5-8749c6488279	bbab3c0e-fa43-40fd-8dde-e65f10309e95	7c9c62224bc600e48c025dbd865171f0b8cca6d687ccf6085be4d8694f697e5c	2026-10-06 11:43:06.530217+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-29 11:43:06.583046+00
4810f45d-24ec-4d20-a961-137c0618a211	bbab3c0e-fa43-40fd-8dde-e65f10309e95	06ca2ec1e26618067f115b6dd6c801c0c7529accc4993fc6513ca0b1fb4229c0	2026-10-06 15:11:57.260141+00	2026-09-29 15:28:53.505918+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-29 15:11:57.314297+00
0972a090-7dfe-4f25-a0de-583f87221761	bbab3c0e-fa43-40fd-8dde-e65f10309e95	3af486d95783a461d1809600cff058a1254b2bc1abc23184d6a148d4b9cc21ca	2026-10-06 15:28:53.669319+00	2026-09-29 15:32:05.616091+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-29 15:28:53.722703+00
9ea35abe-a1ba-4e8e-a307-190e312ecc3e	bbab3c0e-fa43-40fd-8dde-e65f10309e95	5186dd6b4610b4c3807bfdc285394a7fd09839814174204308209345d6f01fb7	2026-10-06 15:42:22.590428+00	2026-09-29 15:43:38.576464+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-29 15:42:22.701074+00
077080b5-5242-4c74-924f-d6c6127bc3c7	bbab3c0e-fa43-40fd-8dde-e65f10309e95	6d3f447e3402cbd2ff9fa049c06ced5ba5654c3de77e6b0fc93aeacc1ccc36d4	2026-10-06 15:51:13.783294+00	2026-09-29 15:51:21.253965+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-29 15:51:13.883377+00
8cce1a66-bbd1-477d-a66d-c63f97d32ee3	bbab3c0e-fa43-40fd-8dde-e65f10309e95	71b41f287d2a4afcd1e92f1b6547e7235758a7d779ce71ed25f98ca9fa00de8b	2026-10-06 15:51:28.299768+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-29 15:51:28.353277+00
ca167ee0-535e-479d-bbe7-3c59c553886d	f125ef5d-2c6f-4187-b02d-a50465b62803	4ce2e27fc5f123dbacd4d05198e13e2d7797fcfb072f4df832654593231dfa0f	2026-10-07 01:56:57.330812+00	2026-09-30 02:13:58.65465+00	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-30 01:56:57.335939+00
07b07dbe-1dfb-4e47-98a1-180660dbce64	f125ef5d-2c6f-4187-b02d-a50465b62803	2702caf3d1277573aeca3f3f85c185afa82608d4dd3593e43424c99b73da1fe7	2026-10-07 02:13:58.661423+00	2026-09-30 02:31:45.258049+00	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-30 02:13:58.663444+00
c35708ad-49b8-4290-a062-3d0951f242fc	f125ef5d-2c6f-4187-b02d-a50465b62803	a23546669b179400059242e3a930c3fce73e2d498f8ee1ae5295eeb66f804210	2026-10-07 02:31:45.263698+00	2026-09-30 02:44:28.724684+00	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-30 02:31:45.265192+00
7f91d8a5-28da-4e3a-bf2b-23c28db9d033	bbab3c0e-fa43-40fd-8dde-e65f10309e95	53e5064b7c3affe09ea851465fb9e0195ce94f3e98cb65b7bb87863f4f06a65a	2026-10-07 02:44:51.733333+00	2026-09-30 02:47:15.423092+00	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-30 02:44:51.735025+00
10ba7588-39b8-4f22-ac99-b64c0aa3123f	f125ef5d-2c6f-4187-b02d-a50465b62803	fd05af8f07d71c3184b04278f6d3995b392e8bc6c877d0e18cbfe5df60cfd931	2026-10-07 09:42:22.376286+00	2026-09-30 10:36:19.97294+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-30 09:42:22.626128+00
7c45c60b-3ce2-414f-9c1e-59978ec9edad	f125ef5d-2c6f-4187-b02d-a50465b62803	21f0539b7d87143afeeb72bde707b6131458bb6190dd0eb8da85f0504e0fba16	2026-10-07 10:36:20.280218+00	2026-09-30 11:32:32.925078+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-30 10:36:20.383041+00
849f6d42-49b8-44d1-b181-3c1a1f294fbb	f125ef5d-2c6f-4187-b02d-a50465b62803	2641045f007e9958b4f17b730e25b711cb9ce7cd96362c960e3494d93c2b0fd3	2026-10-07 11:32:33.12852+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-09-30 11:32:33.175413+00
5a3f3f19-ff9f-4064-b340-0e6f68190b33	f125ef5d-2c6f-4187-b02d-a50465b62803	e34f9842fd0c210ff89af38b04f0f4d69f1d21ece50ef32db736bdd720d8451d	2026-10-08 07:12:00.739594+00	2026-10-01 07:30:22.075206+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-10-01 07:12:00.906573+00
3d6e97cd-3334-4cea-acdc-05e963600d0a	f125ef5d-2c6f-4187-b02d-a50465b62803	5df175b4aba933ca6f5deb97a4f342a20ee04f978dcdf911bb515d048fa952bb	2026-10-08 07:30:22.280055+00	2026-10-01 09:07:31.92786+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-10-01 07:30:22.385913+00
f437ddbc-23ad-4b61-ba5b-81757b8776b8	f125ef5d-2c6f-4187-b02d-a50465b62803	42251676b9fcefe053f0bfbede7882dcdeb9b3f37918e9d0af643e3161e5ba0e	2026-10-08 09:07:32.235316+00	2026-10-01 09:23:19.670496+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-10-01 09:07:32.337905+00
64c98196-d230-42a4-8d95-1a694731a0d9	f125ef5d-2c6f-4187-b02d-a50465b62803	6fc2c78ba00b3763e06bdd73c498e23c283bfdff2dd9e788b58309ecfccc8903	2026-10-08 09:23:20.182566+00	2026-10-01 09:36:28.798887+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-10-01 09:23:20.358202+00
71b634a6-aed6-475d-9b38-a872ca68f530	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	b7b42061ac53669f4e3a99a56399e87517e290a7f9e1fad3585ed07e900c82c4	2026-10-08 09:36:41.262111+00	2026-10-01 09:43:19.86345+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-10-01 09:36:41.44353+00
ef241b53-5251-4d8f-a927-14beec74add6	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	5ba99db0d18b8afe3b5d81f1bd5d0439f54c54c692f6991b6e7e070979395d2b	2026-10-08 09:57:01.476916+00	2026-10-01 09:58:49.86239+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-10-01 09:57:01.625849+00
977c07a6-0688-4f96-8829-390b36dcb2c7	bbab3c0e-fa43-40fd-8dde-e65f10309e95	372683bee1f20da0ca6ea2210d7c3a99a8a74aa6151f6658b078c754fa831476	2026-10-08 10:26:13.046084+00	2026-10-01 10:43:26.928834+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-10-01 10:26:13.167606+00
3748df84-e661-4063-892a-948b51d73837	bbab3c0e-fa43-40fd-8dde-e65f10309e95	ed50d4e070487f1c5d2e2d480f783bcf5d19b63fc4298ec1cca78833d503b301	2026-10-08 10:43:27.235312+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-10-01 10:43:27.414752+00
5ed6fd31-e332-4793-862a-ce498bf9d398	bbab3c0e-fa43-40fd-8dde-e65f10309e95	f24529925bc9f6ad2a1f27a6bec685293528b545c6b658fe0d5c416ae91055f0	2026-10-11 05:10:56.391279+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64; rv:156.0) Gecko/20100101 Firefox/156.0	127.0.0.1	2026-10-04 05:10:56.468018+00
61e6d286-076f-419f-953c-b6c21961ecb2	bbab3c0e-fa43-40fd-8dde-e65f10309e95	d427bf944046edfebdb2e6bd86bef0eb3fb72612646dfb5178043d64aabd5538	2026-10-12 09:19:50.136833+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-10-05 09:19:50.285079+00
6d83a06a-580f-490c-a89c-c231d3b9f5c8	bbab3c0e-fa43-40fd-8dde-e65f10309e95	00af788a64ec8f8e89ae32beb40af67412a954c91514c523bf4b5430c22ad42a	2026-10-12 09:20:40.106193+00	\N	\N	bruno-runtime/4.2.1	127.0.0.1	2026-10-05 09:20:40.258376+00
3c0f9788-b692-4867-b344-bb6c05938f7e	bbab3c0e-fa43-40fd-8dde-e65f10309e95	90973fedd533ec864b9f4ffc54050888fb3cf5fa4c65bc9de3730d27efbefe0f	2026-10-14 02:58:27.160546+00	2026-10-07 03:06:16.999402+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-10-07 02:58:27.301851+00
ec741313-37e6-4fd0-8326-061c4ad00825	f125ef5d-2c6f-4187-b02d-a50465b62803	d8e5de3b413e3b3c138461dc03110355fe4e78c9154e0d19104776a5bcd029ac	2026-10-14 03:06:30.553854+00	2026-10-07 03:33:13.264273+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-10-07 03:06:30.719206+00
b3ff5d30-5819-4f4a-82c5-51f3e52676af	f125ef5d-2c6f-4187-b02d-a50465b62803	4b0bd959bf5de986e956f68d14424fc4f195d715c457d5f5d816089389120d27	2026-10-14 03:33:13.571842+00	2026-10-07 04:00:01.939837+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-10-07 03:33:13.6745+00
c91128b2-a4b9-4e63-ade0-0a8a4f7028e8	bbab3c0e-fa43-40fd-8dde-e65f10309e95	46d46482d51c213e17ce023ad4313d1792fd755fbae4c9b18f8dfd3890bb0787	2026-10-14 04:00:16.19127+00	2026-10-07 05:29:28.254416+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-10-07 04:00:16.377979+00
64417f70-699a-49e8-85d0-75d28203041b	bbab3c0e-fa43-40fd-8dde-e65f10309e95	d569b5946db344c63378f2c0ac807e89a6a9bae8b21e178ff6f1c43bad4eebc2	2026-10-14 05:29:28.970698+00	2026-10-07 06:05:13.17128+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-10-07 05:29:29.175515+00
f4710d66-790c-4af8-a158-b0bf9e5a71e8	bbab3c0e-fa43-40fd-8dde-e65f10309e95	ea827f21d46b383d074fce9714a56ea3b6a90afd699162bea669f42647e952d1	2026-10-14 06:05:13.482938+00	2026-10-07 06:24:19.63436+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-10-07 06:05:13.585191+00
07542699-7f99-4f34-9489-91672d5b51aa	bbab3c0e-fa43-40fd-8dde-e65f10309e95	9193425c166c16f02ffc4fa6ca8aa6621ffa5cc27e02c28719b8b3d94867c11a	2026-10-14 06:24:19.973507+00	2026-10-07 06:56:29.11017+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-10-07 06:24:20.027097+00
5870f55e-8cec-4bf1-9b50-4a64b8d4440c	f125ef5d-2c6f-4187-b02d-a50465b62803	b1f928738b793108c156113cce3c0e8b9f7bb6e84dba94631d8f33dceceab9ae	2026-10-19 03:04:20.54734+00	2026-10-12 03:06:06.757296+00	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-12 03:04:20.549715+00
c7bfd8be-2ea2-4940-bd9b-fce90a67062c	f125ef5d-2c6f-4187-b02d-a50465b62803	8e7963c80acc4370def637d1b150a6e747e1dc6d2cfb6b6b6ddb3ed95898c054	2026-10-19 03:06:13.048032+00	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-12 03:06:13.049739+00
cec9bbe1-e659-46b4-9b05-73079c99e9d2	bbab3c0e-fa43-40fd-8dde-e65f10309e95	3b9a192123eda4a40fbbab35f22b3c6a9b10292ebf7711bf93edfa0d5e43fbe3	2026-10-14 06:56:29.369466+00	2026-10-12 14:29:02.696001+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	127.0.0.1	2026-10-07 06:56:29.419999+00
8deac7f4-b2ae-45c0-9759-ced27f48f196	bbab3c0e-fa43-40fd-8dde-e65f10309e95	68d0eb76b9129028992267b367d0a5ef1ca3e83291438a1a7b690fe1c1424f7c	2026-10-19 14:29:03.00288+00	2026-10-12 14:29:09.484443+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-12 14:29:03.097304+00
c9ded6a9-8543-4497-9f67-0127c9be0ee9	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	c71663e197b872afd2d20f6d3d6794531243f25cc35bec2d98badd03e9683cc4	2026-10-19 17:28:50.924161+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-12 17:28:50.981078+00
7a812214-2b6f-48d4-b99f-4a09bad13ff4	bbab3c0e-fa43-40fd-8dde-e65f10309e95	79d66d99823eae326aea280ba56d7c32c780317aa3efa6d96f570d48e73eecc7	2026-10-25 13:22:09.895566+00	2026-10-18 13:45:29.433833+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-18 13:22:10.044353+00
df111d50-1009-41b3-9e94-a466fb49df58	bbab3c0e-fa43-40fd-8dde-e65f10309e95	e29c2f852b3de021040415147c9b5f90bcb09f393b945564235b58e757a1ab11	2026-10-25 13:45:29.740354+00	2026-10-18 15:03:29.612295+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-18 13:45:29.842652+00
39f9247c-c758-4c8f-8038-d271a8efe0dc	bbab3c0e-fa43-40fd-8dde-e65f10309e95	4f4a15919d7db8ca605e001d455d62ad3bd419728ad2fa3a28d8a7fde84709fd	2026-10-25 15:03:29.919715+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-18 15:03:30.022023+00
7f2678a1-1138-4166-a17b-9fe516d66583	bbab3c0e-fa43-40fd-8dde-e65f10309e95	927972c079d35b607337ed66ef17d6237c1dc1c21592f53b2578b078c501339c	2026-10-25 15:03:55.262627+00	2026-10-18 15:22:12.434704+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-18 15:03:55.411803+00
1f58237c-9920-4af6-820a-a661c18376fc	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	d209f0ae2c8cd2a536135e4af5d61708dbe09be73a7087b276c39205233a8483	2026-10-28 07:07:39.799925+00	2026-10-21 07:26:20.307773+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:158.0) Gecko/20100101 Firefox/158.0	127.0.0.1	2026-10-21 07:07:39.897874+00
3258dbc5-0f46-4410-9f59-b986c2d041de	bbab3c0e-fa43-40fd-8dde-e65f10309e95	df56feadd2a9f477174b1b6b944bcfc19b4aefa4ee6e036badf477e07ad76c94	2026-10-25 15:22:12.741935+00	2026-10-21 07:27:26.872212+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-18 15:22:12.844293+00
bc378fd8-2180-40fe-a8e7-a5867d8c126e	bbab3c0e-fa43-40fd-8dde-e65f10309e95	b8cbb54db3ef6f715283a9f77a68742d64276101cc55a4411736f8c89900379b	2026-10-28 07:44:49.008863+00	2026-10-21 08:01:50.692008+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-21 07:44:49.111356+00
ec88d87c-6ec1-4eda-b1c4-929d9502ba6e	bbab3c0e-fa43-40fd-8dde-e65f10309e95	03b4e7bd1a0964be2b48bdde48b53fbeba45e07978c5e44c90d620dddd90ffc3	2026-10-28 07:44:48.498136+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-21 07:44:48.599575+00
1181ab8f-7958-4ce4-b3fc-ec01e5bf5814	bbab3c0e-fa43-40fd-8dde-e65f10309e95	28aecf9de5007983de6182f2f18e9009f19ee682bb8df418b6b3ddd8a7e1255e	2026-10-28 07:27:27.174853+00	2026-10-21 07:44:48.701742+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-21 07:27:27.27611+00
b5e1af0c-bc19-4baf-bd79-db7c33439356	bbab3c0e-fa43-40fd-8dde-e65f10309e95	385ba3451df181ba1bf2add25d19ddc1327ad97dda8200704009b6aee44e4a7a	2026-10-28 08:01:50.853981+00	2026-10-21 08:15:41.294224+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-21 08:01:50.904121+00
811754dd-69d6-443e-b81a-0c7961b2680b	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	e674dfd4627cbeddee61e7988838496baeb812343eaf91b5718699ae8efbfb3a	2026-10-28 07:26:20.614995+00	2026-10-21 08:26:21.813167+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:158.0) Gecko/20100101 Firefox/158.0	127.0.0.1	2026-10-21 07:26:20.717387+00
fc9f328a-11f0-4f60-a33d-c5f8171335e7	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	bb1e181a51f27a40fbf712b60eb448579ecede13ac8465751a0a9d82841037f4	2026-10-28 08:26:22.121073+00	2026-10-21 08:26:30.034335+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:158.0) Gecko/20100101 Firefox/158.0	127.0.0.1	2026-10-21 08:26:22.222849+00
a01ec6fe-ae9a-4545-8479-039c00b12dd1	f125ef5d-2c6f-4187-b02d-a50465b62803	4fe9971752c615aa8c2e1a49ccfcfabd7a793625b64b310661ff5f824072df9b	2026-10-28 08:26:43.882351+00	2026-10-21 08:49:53.290995+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:158.0) Gecko/20100101 Firefox/158.0	127.0.0.1	2026-10-21 08:26:44.034113+00
d6cd48fb-2ef8-491a-958a-8549fc115d4f	f125ef5d-2c6f-4187-b02d-a50465b62803	4e03806e3a58324ae8cdaed8adb98c7e04d39a49f3bd905c45074b0275c6d2d0	2026-10-28 08:49:53.597835+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64; rv:158.0) Gecko/20100101 Firefox/158.0	127.0.0.1	2026-10-21 08:49:53.695489+00
f9604ff8-acac-482f-94ff-bf221eb347bf	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	0a9350afb70747e43998cec1b75748a70438a3367d9b216cef289a523f1d8839	2026-10-28 08:16:01.108027+00	2026-10-21 08:59:08.411293+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-21 08:16:01.265728+00
bbee1dd5-9b51-4e46-b405-812c433b95fa	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	f9d4dc4e908eff1e54db3fa8ae41643478aeb461ee4b65efe231258bff641309	2026-10-28 08:59:08.719177+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-21 08:59:08.82085+00
0b2c453f-87e4-460f-bc52-df00eacb5e78	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2c2513ada28610020d75c2e6a7ee4c1d48652dcdb100886e07cb150f18df00a3	2026-10-28 09:20:15.703066+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-21 09:20:15.926892+00
824a04c2-4794-48da-8bd4-bfca20d74b1e	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	43cf1ec21fb6d7155576535340d6f631e9f563f4361934451cfd2775238d4c53	2026-10-29 14:16:16.280498+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-22 14:16:16.432776+00
1887ff04-f127-4f77-94e5-a4d0ed1e77dc	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	dd153bb3143f1bd5f5d5761c55eb11335f878202622347c291238a747aaf7814	2026-10-31 03:17:39.04506+00	2026-10-24 03:52:21.555724+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-24 03:17:39.168929+00
d4d8527e-58b1-4ce8-8274-0cd2bca23cb2	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	6d9d7fb4c338f24656a7e7be94b6e1b6cc34b8c4b59bd460d9a0db1217294df4	2026-10-31 03:52:21.844505+00	2026-10-24 04:17:23.433712+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-24 03:52:21.940205+00
9504dcba-863c-4339-8431-bc18cbbe1f60	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	3a12a4a7197e6cbe2ebb8c102d1b710040dc1cc7bb4bb18b669857732c574eaa	2026-10-31 04:17:23.64442+00	2026-10-24 04:32:38.486604+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-24 04:17:23.698013+00
53e2b70d-e09b-4dc9-8610-29b0bb1bb7aa	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	f717f592c9b30bfba233194182f567dbf15390ca0359775d3ae10d420505f3f2	2026-10-31 04:32:38.794047+00	2026-10-24 04:41:01.66325+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-24 04:32:38.891315+00
412bf175-4060-4937-9dc3-fba24ff170ef	bbab3c0e-fa43-40fd-8dde-e65f10309e95	6d56896d67927337de1391d2f12effcae2adb6ab6d31bf6e559863c94156262c	2026-10-31 04:41:16.369888+00	2026-10-24 04:41:59.220913+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-24 04:41:16.521111+00
06c1a38b-5966-4e19-97e4-abee81652cfc	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	19b9030cb0a3e35caa8ee321c1523501ce05a000c60d37139c063acc1577d2e8	2026-10-31 03:05:36.700611+00	2026-10-24 04:44:59.134846+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:158.0) Gecko/20100101 Firefox/158.0	127.0.0.1	2026-10-24 03:05:36.935856+00
79809302-f358-49c1-b55d-5574bbdeadb3	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	9424f3277d4012c937984d9681c46a15e27b0bc86d699bcaf81de77b7defd6bd	2026-10-31 04:44:59.441848+00	2026-10-24 04:45:04.454354+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:158.0) Gecko/20100101 Firefox/158.0	127.0.0.1	2026-10-24 04:44:59.544329+00
038f81e0-ad03-46df-9076-b2fb28adba09	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	469a8b4afd89fb5261bba1eb5d7e8d02f76d72836e859d6184691c40be2c2b1a	2026-10-31 04:42:10.024561+00	2026-10-24 04:46:55.864696+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-24 04:42:10.177653+00
572f4eda-0590-4633-96d2-e354b758cce3	f125ef5d-2c6f-4187-b02d-a50465b62803	1064d67f9370b647fb4dc0a020d37d0946359f72baa085b1abaca57e856d1ac7	2026-10-31 04:47:14.762103+00	2026-10-24 04:51:28.148081+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-24 04:47:14.915205+00
e8614d4c-feeb-428b-8bca-be866c4f4dba	f125ef5d-2c6f-4187-b02d-a50465b62803	a8e878339bd8833339faaed7521858c215db8282ea07c1cb4e3260e66f9b52cf	2026-10-31 04:53:21.867575+00	2026-10-24 05:29:56.993255+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-24 04:53:22.015695+00
50b1e3b7-f472-4736-bd2a-0d7fa3cf8367	f125ef5d-2c6f-4187-b02d-a50465b62803	16271f63703bfd44c67bc9d6106e69ec285e6e0ddfe9577c8af0217cc2cbd36c	2026-10-31 05:29:57.300303+00	2026-10-24 06:03:35.989366+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-24 05:29:57.402093+00
2cc4eeda-992d-47b1-9090-174eeb4594e0	f125ef5d-2c6f-4187-b02d-a50465b62803	f1f08bba758696f1fc5866f86d9118bcfc73a0ef30b046c7932c786c676808aa	2026-10-31 06:03:36.296462+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-24 06:03:36.398521+00
edb91e9a-b159-4334-aa5a-de5dcf20b005	f125ef5d-2c6f-4187-b02d-a50465b62803	0eeeae2da1be47f3f9ac5ef83fb573898f58af50414d04918ee625ce619e77d8	2026-10-31 04:45:33.695954+00	2026-10-24 09:12:49.625054+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:158.0) Gecko/20100101 Firefox/158.0	127.0.0.1	2026-10-24 04:45:33.8477+00
573d46e5-0250-4f67-b400-0da2e67d5d81	f125ef5d-2c6f-4187-b02d-a50465b62803	2e4a7082d4203a00b60c5e846d7aee613e112890d7306e7b19f15325f2a90d46	2026-10-31 09:12:49.897726+00	2026-10-24 09:12:55.249198+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:158.0) Gecko/20100101 Firefox/158.0	127.0.0.1	2026-10-24 09:12:49.95775+00
b2d53d57-0776-4120-8f8f-6074aca2645d	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	5c617f6e0f6cbb25a75b26a60a92d68a4da726e1161e6a573f5a66d0b98a66b3	2026-11-14 07:59:40.837343+00	2026-11-07 08:14:55.311456+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:159.0) Gecko/20100101 Firefox/159.0	127.0.0.1	2026-11-07 07:59:40.960168+00
fe2609b6-d350-4208-93c3-28528e0d4c50	f125ef5d-2c6f-4187-b02d-a50465b62803	b94a5109d93f750fb2131603c65cac624e831063397387345d9e655a31dbf868	2026-11-14 07:57:33.625132+00	2026-11-07 08:16:00.869681+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 07:57:33.723501+00
bcf66ea7-5453-42eb-80a0-91fb07343185	f125ef5d-2c6f-4187-b02d-a50465b62803	b371d3e880f8311f46d52be8807169f19f76be0fed237524db19fb6394c57ffa	2026-11-14 08:16:01.245103+00	2026-11-07 08:20:30.69369+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 08:16:01.347333+00
354a4b41-caaa-41fb-b166-a58c383fe630	bbab3c0e-fa43-40fd-8dde-e65f10309e95	d645f0978283b543b5c804c908c15591ccb9f4170363b2f4227e5491f52ae823	2026-11-14 08:15:12.589669+00	2026-11-07 08:32:54.676051+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:159.0) Gecko/20100101 Firefox/159.0	127.0.0.1	2026-11-07 08:15:12.711826+00
c4e91a11-f9de-4992-b179-83207b58a59b	bbab3c0e-fa43-40fd-8dde-e65f10309e95	9561b6a4b888ae15c13c3bfeceef3fa7884c5069b4967f8236ce481ef76a138c	2026-11-14 08:32:54.977989+00	2026-11-07 08:49:15.195014+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:159.0) Gecko/20100101 Firefox/159.0	127.0.0.1	2026-11-07 08:32:55.080142+00
013911b4-ba7f-4b9f-89bb-4aa08d795b79	bbab3c0e-fa43-40fd-8dde-e65f10309e95	b90734c9df8973edb30b67fe2a24879ea99cd62a26021451690e5d01acc66b80	2026-11-14 08:49:15.451461+00	2026-11-07 09:05:04.503676+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:159.0) Gecko/20100101 Firefox/159.0	127.0.0.1	2026-11-07 08:49:15.554276+00
ffea9428-724b-4896-9ee5-57b28956418b	bbab3c0e-fa43-40fd-8dde-e65f10309e95	e62a1637103f2c2bdf6ff0f6bbfb0a4ada27de514e83ed1df74f5179c6d0f754	2026-11-14 09:05:04.810513+00	2026-11-07 09:28:31.075755+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:159.0) Gecko/20100101 Firefox/159.0	127.0.0.1	2026-11-07 09:05:04.91338+00
4fd6d446-c11c-4b51-97d1-726d6fb78ebe	bbab3c0e-fa43-40fd-8dde-e65f10309e95	c4449dc12e98b63f919a30eccc5c4de0ec42731a70de5dc7abef9a5702750665	2026-11-14 09:28:31.382903+00	2026-11-08 08:12:05.061414+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:159.0) Gecko/20100101 Firefox/159.0	127.0.0.1	2026-11-07 09:28:31.485468+00
0cf5c39d-e301-4865-97c8-80a657d43fc8	f125ef5d-2c6f-4187-b02d-a50465b62803	811435796a76d85a9b64447a91e3d6d485db2e7db8363daab5533e5a492619d0	2026-11-15 08:11:01.594371+00	2026-11-08 08:16:25.400992+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 08:11:01.644283+00
3165f450-f4bf-4f62-98db-8797555df67e	bbab3c0e-fa43-40fd-8dde-e65f10309e95	e625d21c0b974d5d418615b2088840183b09e5a68e25c3be22cd5ff69d921128	2026-11-15 08:12:05.219484+00	2026-11-08 08:28:16.904106+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:159.0) Gecko/20100101 Firefox/159.0	127.0.0.1	2026-11-08 08:12:05.272093+00
6562b352-87a6-4a61-a786-512d15437a30	f125ef5d-2c6f-4187-b02d-a50465b62803	1dec220d94a5f02defd6f77f1ae3f9f9573443c6cdce495e6331d93b9f94587c	2026-11-15 08:16:38.975053+00	2026-11-08 08:39:01.832582+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 08:16:39.025202+00
269b4119-6c85-47b9-b9d5-eae58d24cd38	bbab3c0e-fa43-40fd-8dde-e65f10309e95	db8db4334eb7e34b80986bcc27a2301eb645cae483d542016b98ff22077eb387	2026-11-15 08:28:17.051308+00	2026-11-08 08:54:26.553141+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:159.0) Gecko/20100101 Firefox/159.0	127.0.0.1	2026-11-08 08:28:17.099898+00
014178f3-c7d6-4061-85d1-50c72837ca93	bbab3c0e-fa43-40fd-8dde-e65f10309e95	14bd22f841113a421c0ba33feef9d67756fc4aa2fcb0325a7164cc51e52f109a	2026-11-15 08:54:26.705395+00	2026-11-08 09:11:13.821413+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:159.0) Gecko/20100101 Firefox/159.0	127.0.0.1	2026-11-08 08:54:26.754987+00
cc977392-fbf2-4cc9-b2f6-42adf3a6bf9c	f125ef5d-2c6f-4187-b02d-a50465b62803	100641f6892391c0887f580b81d586b57111981a4b8f33464cd3bd698edd8d76	2026-11-15 08:39:01.988561+00	2026-11-08 10:08:11.544382+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 08:39:02.040126+00
8aa68fa9-15a9-46a3-b483-392738636b9c	bbab3c0e-fa43-40fd-8dde-e65f10309e95	08d50a335795369239c9032a2e42c91dd8b3cfc1414a262249de812b0fe50ced	2026-11-15 09:11:13.973963+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64; rv:159.0) Gecko/20100101 Firefox/159.0	127.0.0.1	2026-11-08 09:11:14.023557+00
7bc93dcc-1d46-4c95-82e6-8ad374f64646	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2491087a49c4696f756a9ccb24ed2707c446d032dc41449776b7e1ea25803a69	2026-11-15 09:24:46.772603+00	2026-11-08 10:07:59.55942+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:159.0) Gecko/20100101 Firefox/159.0	127.0.0.1	2026-11-08 09:24:46.876287+00
aa0d1669-a756-4b09-8980-eb2568e98b1e	bbab3c0e-fa43-40fd-8dde-e65f10309e95	3b38fdcbefac7cf49b30654262cd68ad3c8896fb17c478edda025bd6458faf0e	2026-11-15 10:07:59.727603+00	2026-11-08 10:08:04.815301+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:159.0) Gecko/20100101 Firefox/159.0	127.0.0.1	2026-11-08 10:07:59.782138+00
4aebd15b-46b4-4558-b04c-ed30e213e057	bbab3c0e-fa43-40fd-8dde-e65f10309e95	7f5e7d4df5c27ef03553db88fcb3cb03b46bc1b9fe253968b303848dfe6a0e83	2026-11-15 10:08:21.621165+00	2026-11-08 10:23:29.619653+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 10:08:21.670486+00
2fc7cdde-99d2-4da4-8ea0-397ee36de961	bbab3c0e-fa43-40fd-8dde-e65f10309e95	a4d295240ab2a30c9c08a96bbb3c884d53e9f361f10416b12e0bd19144718592	2026-11-15 10:23:29.771305+00	2026-11-08 10:41:59.816627+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 10:23:29.821602+00
3a11adf8-af66-4c0a-ba3f-55d55e36e7ed	f125ef5d-2c6f-4187-b02d-a50465b62803	1daa049a2870f9b8ba03ea1411ea074bff8f65c9f79345f8e8de70bd9242eed9	2026-11-15 10:15:30.175544+00	2026-11-08 10:42:28.959065+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:159.0) Gecko/20100101 Firefox/159.0	127.0.0.1	2026-11-08 10:15:30.22559+00
4076d256-db63-4018-99cf-e8d000911b9f	f125ef5d-2c6f-4187-b02d-a50465b62803	358e85e3b3d1c6db44c3cb3a4ce9432528c8f3bca50006ef517405b1cbecb9c7	2026-11-15 10:42:29.116344+00	2026-11-08 10:45:16.687692+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:159.0) Gecko/20100101 Firefox/159.0	127.0.0.1	2026-11-08 10:42:29.168218+00
7e7b8126-e103-47c8-9886-047302430765	4767ff8e-f884-4ade-baef-bbd6fef2ee15	5c094becd529ef1f0c377dd67e1da98921c9aa48d095a4c029eb5cde43aa3504	2026-11-15 10:47:53.985491+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64; rv:159.0) Gecko/20100101 Firefox/159.0	127.0.0.1	2026-11-08 10:47:54.037038+00
f132ead8-a377-48f9-9210-ae7660bfb21d	bbab3c0e-fa43-40fd-8dde-e65f10309e95	e4be2e29b2df97db2d7b56089eabcdf2244e6d13c972f11d188536ca3ba23430	2026-11-15 10:41:59.972413+00	2026-11-08 13:09:50.015641+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 10:42:00.021902+00
1f5d7240-c701-48f2-9b27-a917016b78fe	bbab3c0e-fa43-40fd-8dde-e65f10309e95	b71111dfd198b484a03269adccac000a009e51d4e7c1eeb4653eabaa0174111f	2026-11-15 13:09:50.178593+00	2026-11-08 13:09:52.838975+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 13:09:50.230365+00
aa02d732-6fff-4e3a-ae4f-2c48fdcaa208	fc4baf98-26f0-45e0-89b9-ddd23d0f3bd1	0d39b2a6b7befd502ffd0282e9dd535b6a3d8a0fa11926989611fd770a3d50b9	2026-11-15 13:13:10.955175+00	2026-11-08 13:19:58.559792+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 13:13:11.008075+00
2a827582-f8a6-4418-ab03-2702784eedc4	bbab3c0e-fa43-40fd-8dde-e65f10309e95	6aba2d9f82337230fcbcd02d6af07937766a15dd9493d71f614dc4653f3b2668	2026-11-15 13:20:06.198391+00	2026-11-08 13:38:03.753755+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 13:20:06.249691+00
74b5c479-37ce-46f3-9c73-e2084f27f6d8	f125ef5d-2c6f-4187-b02d-a50465b62803	b3097c8a28c55620fdeaf93158ccfea120217a1e61b3324b5fba69dbb41e2742	2026-11-15 13:25:44.393066+00	2026-11-08 13:39:55.62737+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:159.0) Gecko/20100101 Firefox/159.0	127.0.0.1	2026-11-08 13:25:44.447393+00
dd5c54e9-9e39-438b-93f3-8fbb7ab2cfb7	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bf007b2c7e7708e61768f744edba194e65e86e9bb4937679fcb245d0282347f2	2026-11-15 13:38:03.911594+00	2026-11-08 13:40:09.547268+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 13:38:03.96294+00
51003608-f84b-46e9-8077-b94efe80fb6b	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	467c28466abf258614704073a965d7ee10e37a48af7169b0362bb4e84ee030c7	2026-11-15 13:40:35.892096+00	2026-11-08 13:51:26.77336+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 13:40:35.941096+00
db50fab1-1047-4f96-bd68-5cb8b5206346	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	3d287517e4f57e7d331b3a97656b5fe12d8a440ccaf1f2b81d34d2c742630de8	2026-11-15 13:51:45.692385+00	2026-11-08 13:54:14.983866+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 13:51:45.743261+00
2ec7b9e5-3f28-4ddd-9481-ca6a2edcf623	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	84c2f255e305b4b6bc7bc647c62b586331b1e29e8c248129033d321828122dd8	2026-11-15 14:09:01.994167+00	2026-11-09 05:45:00.961986+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 14:09:02.093451+00
e1bb6163-d261-48b6-8ab0-dd3dfc904299	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	a49f4816e5a957f14c05f37726c6b4ca25754c91401797b1c1a62da6df0ee346	2026-11-16 05:45:01.266792+00	2026-11-09 05:45:12.395875+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 05:45:01.36993+00
2c6c97aa-e3e0-495d-bcac-9e86426dad05	f125ef5d-2c6f-4187-b02d-a50465b62803	892cb121e30fe87994e9a1d133bc8e68962168d6cf8a086aea74a886ece20c76	2026-11-16 06:03:25.488255+00	2026-11-09 06:04:56.939939+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 06:03:25.575554+00
e04154ab-a5cb-44ad-bd7c-4084b79ca75b	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	51109f795f4288a357313a3137f81a37047a1b5e0d0df44034f6642fb633f666	2026-11-16 06:27:17.582575+00	2026-11-09 06:38:49.345539+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 06:27:17.677888+00
f1c8b9fc-aa9e-42ef-bdbe-eeea419d307d	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	4dbd802ba677c40c7fb1c43856417d052411c64b2fd82ba058e95dea340e8f8c	2026-11-16 06:45:58.36409+00	2026-11-09 06:58:37.791534+00	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 06:45:58.497576+00
bb88ad88-f36c-450a-ad38-be7fe589fd93	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	b68cf64f3644e4d548fa8383cd24491be69458bd52d7d5321a3f2c7553d100a3	2026-11-16 09:03:47.280519+00	2026-11-13 02:11:45.703071+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:159.0) Gecko/20100101 Firefox/159.0	127.0.0.1	2026-11-09 09:03:47.395836+00
de0722e5-716f-481f-b9dc-268ff64efebd	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	3c72f4578d3bfaa03f2502f19f13a1033e3fa469472dcabfdaf536801258374a	2026-11-20 02:11:46.014152+00	2026-11-13 02:11:48.472202+00	\N	Mozilla/5.0 (X11; Linux x86_64; rv:159.0) Gecko/20100101 Firefox/159.0	127.0.0.1	2026-11-13 02:11:46.111936+00
4a8f8fa9-14d0-43a4-87cc-ca34c0aa0f45	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	de46b1e0158c504bf961736dfe9882d84b4b8b9bc7b3c825f58b3fa0d5da700f	2026-11-20 03:34:28.852947+00	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36	127.0.0.1	2026-11-13 03:34:28.855375+00
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.role_permissions (role_id, permission_id, created_at) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roles (id, name, description, created_at, updated_at) FROM stdin;
2867ff18-7d85-4794-a331-579e9cd2d0d8	student	Peserta belajar, latihan, dan simulasi tryout	2026-09-08 07:53:09.409448+00	2026-09-08 07:53:09.409448+00
1b0de7b6-3759-4bed-ab72-07f9ddbcd8b1	admin	Administrator operasional dan manajemen sistem	2026-09-08 07:53:09.81961+00	2026-09-08 07:53:09.81961+00
f724065d-0c89-409e-8ce4-57e09f30909f	content_manager	Pengelola modul pembelajaran dan bank soal	2026-09-08 07:53:10.127247+00	2026-09-08 07:53:10.127247+00
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.schema_migrations (version, dirty) FROM stdin;
11	f
\.


--
-- Data for Name: schools; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.schools (id, npsn, nama, jenjang, status, logo, alamat, provinsi, kabupaten, kecamatan, created_at, updated_at, deleted_at) FROM stdin;
53dd3bb9-d11d-49b0-8b4a-89a505e858e0	10101234	SMA Negeri 1 Banda Aceh	sma	negeri	https://example.com/images/logo-sman1-bna.png	Jl. Prof. A. Majid Ibrahim I No.7, Kp. Baru	Aceh	Kota Banda Aceh	Baiturrahman	2026-09-13 13:15:01.790927+00	2026-09-13 13:15:01.790927+00	\N
\.


--
-- Data for Name: stimulus; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.stimulus (id, title, content, created_by, created_at, updated_at, deleted_at, package_id, package_kind) FROM stdin;
dccbcc47-fda9-46fa-912c-f676eb96ad86	Coba Stimulus di Sni	asdasdasdasdasdasdasdasdasdasdasd	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-10-18 13:24:34.122226+00	2026-10-18 13:24:34.122226+00	2026-10-18 15:14:59.895968+00	\N	\N
87f45215-a683-49f3-8d78-e2cdd2420c48	Belajar Bahasa Indonesia	asdasdasd	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-10-07 05:39:08.937642+00	2026-10-07 05:39:08.937642+00	2026-10-18 15:15:02.762887+00	\N	\N
8f28f1b0-4a70-4239-be78-3c7fce0b1a68	Soal 1 s/d 4	<font face="Inter">Lautan mengalami ancaman pemanasan dan menjadi semakin asam karena kita terus memompa lebih banyak CO2 ke atmosfer. Selain itu, lautan juga menghadapi ancaman lain dari manusia, yakni penggunaan plastik. Kehidupan modern saat ini didominasi oleh kemasan makanan berbahan plastik yang diolah dengan teknologi tinggi dan digunakan setiap hari oleh masyarakat. Dalam sebuah laporan telah disebutkan bahwa pada tahun 2050 sampah plastik di laut akan lebih banyak daripada jumlah ikan apabila kecenderungan ini terus berlanjut. Hal tersebut merupakan sebuah ancaman besar. Dibutuhkan tindakan skala besar untuk berpindah dari kecenderungan tersebut mengingat banyak pihak yang terlibat dalam bidang pekerjaan ini. Masyarakat sektor swasta dan masyarakat sipil perlu mobilisasi untuk menangkap peluang ekonomi lain di luar dari pengelolaan plastik. Solusi tersebut tidak mudah. Fakta bahwa harga minyak yang rendah mengakibatkan biaya yang dibutuhkan untuk daur ulang plastik jauh lebih mahal daripada memproduksi yang baru. Kondisi lain yang menunjukkan ekonomi di negara berkembang tumbuh lebih besar menjadikan penggunaan plastik juga meningkat. Solusi yang dibutuhkan adalah cara kita menggunakan plastik. Misalnya dengan mengurangi penggunaan plastik dalam kemasan atau menggunakannya kembali sebanyak yang kita bisa. Produsen plastik juga dapat membantu dalam pengelolaan plastik, seperti memproduksi barang-barang plastik yang dapat digunakan kembali atau beralih ke plastik yang dapat dijadikan kompos. Solusi apa pun akan membawa perubahan besar dalam cara menggunakan produk yang terbuat dari plastik. Makna istilah mobilisasi pada paragraf kedua teks tersebut adalah ....</font>	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-10-21 07:35:30.008919+00	2026-10-21 07:35:30.008919+00	\N	2e0c4656-c227-457a-9164-dac57ef0a96f	practice
2583445a-0ff7-4b32-b347-33ec037709d6	Bacaan 1 Sampai 4	Lautan mengalami ancaman pemanasan dan menjadi semakin asam karena kita terus memompa lebih banyak CO2 ke atmosfer. Selain itu, lautan juga menghadapi ancaman lain dari manusia, yakni penggunaan plastik. Kehidupan modern saat ini didominasi oleh kemasan makanan berbahan plastik yang diolah dengan teknologi tinggi dan digunakan setiap hari oleh masyarakat. Dalam sebuah laporan telah disebutkan bahwa pada tahun 2050 sampah plastik di laut akan lebih banyak daripada jumlah ikan apabila kecenderungan ini terus berlanjut. Hal tersebut merupakan sebuah ancaman besar. Dibutuhkan tindakan skala besar untuk berpindah dari kecenderungan tersebut mengingat banyak pihak yang terlibat dalam bidang pekerjaan ini. Masyarakat sektor swasta dan masyarakat sipil perlu mobilisasi untuk menangkap peluang ekonomi lain di luar dari pengelolaan plastik. Solusi tersebut tidak mudah. Fakta bahwa harga minyak yang rendah mengakibatkan biaya yang dibutuhkan untuk daur ulang plastik jauh lebih mahal daripada memproduksi yang baru. Kondisi lain yang menunjukkan ekonomi di negara berkembang tumbuh lebih besar menjadikan penggunaan plastik juga meningkat. Solusi yang dibutuhkan adalah cara kita menggunakan plastik. Misalnya dengan mengurangi penggunaan plastik dalam kemasan atau menggunakannya kembali sebanyak yang kita bisa. Produsen plastik juga dapat membantu dalam pengelolaan plastik, seperti memproduksi barang-barang plastik yang dapat digunakan kembali atau beralih ke plastik yang dapat dijadikan kompos. Solusi apa pun akan membawa perubahan besar dalam cara menggunakan produk yang terbuat dari plastik. Makna istilah mobilisasi pada paragraf kedua teks tersebut adalah ....	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2026-10-21 08:20:21.670212+00	2026-10-21 08:20:21.670212+00	\N	6622a443-9a8a-4647-98f0-4436b08278f5	practice
c757180d-eb6e-445f-948e-d8b3ef71fa1c	Bacaan 1 s/d 3	<p id="docs-internal-guid-62db5929-7fff-9a8c-322f-64febeb8623d">“E...gurumu itu orang desa ini juga. Pasti tahu bahwa saat ini musim maddongi (mengusir burung saat buah padi mulai menguning). Besok kau menghadap, sampaikan bahwa kau membantu Ayah di sawah. Nah, pasti gurumu mengerti mengapa kamu tidak ke sekolah.”</p><p>Aku terpana. Jawaban Ayah benar-benar membuatku hampir menangis histeris. Bagaimana tidak. Lomba semakin dekat, sementara masih banyak materi yang belum aku paham. Terbayang aku akan hancur dan tidak bisa bersaing dengan siswa sekolah lain. Ingin rasanya aku berteriak agar Ayahku tahu bagaimana kacaunya pikiranku. Namun, aku sadar bahwa ini adalah perbuatan yang tidak akan menyelesaikan masalah. Malah akan semakin membuat Ayahku geram. Otakku terus berpikir untuk mencari solusi terbaik. Sambil berjalan mengikuti Ayah dari belakang, aku mulai menyusun strategi. “Bagaimana kalau aku ke rumah iyye-ku (nenek), menyampaikan masalahku ini. Ya, hanya dia yang mampu menundukkan Ayah.”</p><p>Esok harinya, sepulang sekolah, kuayunkan sepedaku menuju rumah iyye-ku.</p><p>“Kenapa kamu lesu?” Iyye menanyakan keadaanku. Aku pun menceritakan semuanya kepada iyye.</p><p>“Ya sudah, tidak usah sedih. Nanti kusampaikan pada ayahmu. Kau ke dalam, makan dulu, baru pulang,” ujar iyye-ku.</p>	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2026-10-24 03:56:16.126031+00	2026-10-24 03:56:16.126031+00	2026-10-24 04:17:24.25778+00	a8821f5b-dd54-4227-99e3-16ce350a6aa1	tryout
2515e4bb-1541-42e8-ac0f-3577549c606b	Tema Lingkungan dan Pangan	<p id="docs-internal-guid-62db5929-7fff-9a8c-322f-64febeb8623d">Ketahanan pangan lokal kini menjadi fokus utama di berbagai daerah untuk mengurangi ketergantungan pada beras. Singkong, jagung, dan sagu kembali didorong sebagai makanan pokok alternatif. Di beberapa wilayah timur Indonesia, sagu telah lama menjadi sumber karbohidrat utama yang tahan terhadap anomali cuaca. Pohon sagu mampu tumbuh subur di lahan gambut tanpa perlu pupuk kimia, menjadikannya komoditas yang sangat ramah lingkungan.</p><p id="docs-internal-guid-62db5929-7fff-9a8c-322f-64febeb8623d"><br></p><p id="docs-internal-guid-62db5929-7fff-9a8c-322f-64febeb8623d">Sayangnya, mengubah kebiasaan masyarakat yang sudah sangat bergantung pada nasi putih tidaklah mudah. Pandangan bahwa beras adalah simbol kemakmuran membuat sumber pangan lain sering dianggap sebagai makanan kelas dua. Untuk mengatasi stigma ini, berbagai inovasi kuliner mulai dikembangkan. Singkong kini diolah menjadi beras analog dan mi bebas gluten, sementara sagu dijadikan bahan dasar kue-kue modern.</p><p id="docs-internal-guid-62db5929-7fff-9a8c-322f-64febeb8623d"><br></p><p id="docs-internal-guid-62db5929-7fff-9a8c-322f-64febeb8623d">Pemerintah juga berkolaborasi dengan pelaku Usaha Mikro, Kecil, dan Menengah (UMKM) untuk memasarkan produk olahan pangan lokal ini. Melalui kampanye digital dan pameran kuliner, produk-produk tersebut mulai diminati oleh generasi muda yang lebih peduli pada gaya hidup sehat. Keberhasilan program diversifikasi pangan ini sangat bergantung pada sinergi antara kebijakan pemerintah, inovasi produsen, dan kesediaan masyarakat untuk mengubah pola konsumsi mereka demi masa depan lingkungan yang lebih baik.</p>	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2026-10-24 04:17:43.611267+00	2026-10-24 04:17:43.611267+00	\N	a8821f5b-dd54-4227-99e3-16ce350a6aa1	tryout
279b02df-4b67-4bc3-a885-c396b46eb6d9	Fiksi	Matahari baru saja tergelincir di ufuk barat, membiaskan semburat jingga di langit desa nelayan. Aku menatap jaring pukat yang koyak di pangkuan Ayah. Jemarinya yang kasar dengan cekatan menambal rajutan tali pelonco itu.<p><br></p><p>"Tomo, besok subuh ikut Ayah melaut. Musim tenggiri sudah tiba. Kita butuh banyak tangkapan untuk membayar sewa perahu," ucap Ayah tanpa menoleh kepadaku.</p><p><br></p><p>Jantungku seakan merosot ke perut. Besok adalah jadwal ujian seleksi olimpiade sains tingkat kabupaten. Aku sudah mempersiapkan diri selama berbulan-bulan, membaca buku pinjaman dari perpustakaan sekolah di bawah temaram lampu petromaks. Namun, menolak perintah Ayah sama saja dengan mengundang badai ke dalam rumah. Bagi Ayah, laut adalah satu-satunya sekolah yang memberi makan. Ijazah dan piala tak bisa ditukar dengan sekilo beras.</p><p><br></p><p>Aku terdiam, meremas ujung kemeja lusuhku. Pikiran berkecamuk mencari jalan keluar. Haruskah aku mengubur mimpiku demi bakti, atau diam-diam berlari ke sekolah esok pagi dan membiarkan Ayah melaut sendirian menantang ombak ganas? Tiba-tiba, sebuah gagasan melintas. Mungkin aku bisa menemui Paman Huda malam ini. Ia satu-satunya kerabat yang dihormati Ayah dan kebetulan memiliki perahu motor yang menganggur.</p>	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2026-10-24 04:25:55.230967+00	2026-10-24 04:25:55.230967+00	\N	a8821f5b-dd54-4227-99e3-16ce350a6aa1	tryout
7a1d30a8-8b14-4721-ac82-6affcf77f264	Informasi	Otomatisasi berbasis Kecerdasan Buatan (AI) membawa perubahan signifikan dalam dunia kerja moderen. Banyak pekerjaan repetitif dan administratif yang berpotensi digantikan oleh algoritma. Perusahaan ritel kini beralih menggunakan kasir mandiri (self-checkout), sementara layanan pelanggan digantikan oleh chatbot yang dapat melayani konsumen tanpa henti. Kondisi ini sering kali menimbulkan keresahan terkait hilangnya jutaan lapangan pekerjaan bagi tenaga kerja kerah biru.<p><br></p><p>Namun, di balik ancaman tersebut, adopsi AI justru membuka peluang profesi baru yang belum terbayangkan sebelumnya. Posisi seperti Data Scientist, Insinyur Prompt AI, dan Analis Etika AI menjadi sangat dibutuhkan. Teknologi ini tidak dirancang untuk menghapus peran manusia sepenuhnya, melainkan mengambil alih tugas repetitif agar manusia bisa berfokus pada pekerjaan yang membutuhkan kreativitas, empati, dan analisis strategis.</p><p><br></p><p>Untuk beradaptasi, para pekerja dituntut melakukan upskilling atau peningkatan keterampilan. Pelatihan literasi digital, pemahaman data, dan kemampuan berpikir kritis menjadi modal utama. Mereka yang mampu berkolaborasi dengan teknologi cerdas akan memiliki daya saing tinggi, sedangkan yang menolak beradaptasi berisiko tertinggal oleh dinamika pasar kerja global.</p>	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2026-10-24 04:32:39.203639+00	2026-10-24 04:32:39.203639+00	\N	a8821f5b-dd54-4227-99e3-16ce350a6aa1	tryout
88714c40-8c33-49e5-b0cd-551b7f4d8b4f	Bacaan Soal 1 Sampai 3 Tetang A	oaksdakojsjdaksdakosdjaksdakosdakosdaksdaoksdakosdjaoksdjakosdaoksdaoksdakojsd	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-11-08 13:22:43.011666+00	2026-11-08 13:22:43.011666+00	\N	ccf3adca-41ab-4f81-9ae7-89165fdbdb4c	practice
\.


--
-- Data for Name: student_answers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.student_answers (id, attempt_id, question_id, attempt_question_id, selected_option_id, answer_data, is_correct, score, response_time_seconds, answered_at, created_at, updated_at) FROM stdin;
feb78342-bc5d-43b8-afa5-5c7c98f8a113	11e6bfde-0b03-4187-bcb0-ade07ff3b916	f49f136b-d0b0-4588-aa0d-aa549e9e7647	f25516b0-5364-4097-b3df-6c03b44e7e68	f6c74874-c4ad-4f26-b0de-957e122efb96	\N	f	0.00	6	2026-09-28 07:09:03.675158+00	2026-09-28 07:09:03.726695+00	2026-09-28 07:09:03.726695+00
ab1943a7-7e29-4afb-9d36-3e5efd8326ca	11e6bfde-0b03-4187-bcb0-ade07ff3b916	02ba1a6a-8ad2-4587-a92e-9cbc74cef20b	fdf70779-00b2-43fa-83fc-322abbef5060	fc3fcfb0-49e6-4328-a67a-7c4a74036194	\N	t	1.00	4	2026-09-28 07:09:09.789666+00	2026-09-28 07:09:09.840548+00	2026-09-28 07:09:09.840548+00
be60edcd-212c-4835-8b3b-5634037940f9	11e6bfde-0b03-4187-bcb0-ade07ff3b916	7acc58ec-1d7f-4f2f-aec7-2e9df230ab51	ee5c05fd-c66b-464d-a864-cff47ca287c2	0cf843fb-7ca7-4e77-8a9e-7306044f812f	\N	t	1.00	11	2026-09-28 07:09:23.028281+00	2026-09-28 07:09:23.079922+00	2026-09-28 07:09:23.079922+00
3ac35b92-5b9b-4a8c-9e89-d378ac9b59db	32d344dc-2af5-4d74-a05e-f7c892c62809	7d011732-3523-4bcf-aa8a-3e4d8461785f	cb702f47-1aa2-49a8-a3c8-956cdf651e8e	\N	{"531d13b6-7fce-4cf1-813a-a7dee95819e7": "SETUJU", "92192bf5-a413-43ba-a8a8-54c0967221c1": "SETUJU", "a2644d30-babf-401b-ae13-e94b2dbbc0d6": "SETUJU", "c6b4d011-edc5-495e-a920-b7c13efd3b80": "SETUJU"}	f	0.00	21	2026-09-28 09:07:27.389305+00	2026-09-28 09:07:27.390742+00	2026-09-28 09:07:27.390742+00
d5580f51-4177-453f-b91f-b90d79f3788f	32d344dc-2af5-4d74-a05e-f7c892c62809	f49f136b-d0b0-4588-aa0d-aa549e9e7647	f8ffa6bc-5cf9-45ab-88ea-cb97251bf6cb	b2b2fb76-1f00-4a99-bb96-c76398dff053	\N	f	0.00	3	2026-09-28 09:07:31.041984+00	2026-09-28 09:07:31.043326+00	2026-09-28 09:07:31.043326+00
0968faaf-8f74-4eeb-9aa1-35a2af4eb739	32d344dc-2af5-4d74-a05e-f7c892c62809	02ba1a6a-8ad2-4587-a92e-9cbc74cef20b	c7aaecd8-2c33-48b0-b737-7ed74fcfc340	9fe69914-7d80-42de-9d24-bbe692b7e666	\N	f	0.00	5	2026-09-28 09:07:36.351227+00	2026-09-28 09:07:36.35267+00	2026-09-28 09:07:36.35267+00
5c3d3177-ec38-45a9-aff8-eccdc11876a0	4686e74d-d3e9-4bd2-a700-2778cd0bfeb0	f49f136b-d0b0-4588-aa0d-aa549e9e7647	be1d0788-4415-4004-bbba-228b58ba6b80	f6c74874-c4ad-4f26-b0de-957e122efb96	\N	f	0.00	7	2026-09-30 02:24:39.069412+00	2026-09-30 02:24:39.070425+00	2026-09-30 02:24:39.070425+00
7c4387cc-3f58-4fb5-8898-980fe4a1f08b	4686e74d-d3e9-4bd2-a700-2778cd0bfeb0	02ba1a6a-8ad2-4587-a92e-9cbc74cef20b	b4710cb8-3853-447c-9aa1-bd22aba61f82	9fe69914-7d80-42de-9d24-bbe692b7e666	\N	f	0.00	18	2026-09-30 02:24:57.641733+00	2026-09-30 02:24:57.642612+00	2026-09-30 02:24:57.642612+00
e67e5579-d0e1-478d-a871-58a853dfe88b	8c0c21fd-93d3-4da5-9021-67194ed1cf06	e9232f01-bf4c-4f5d-b27e-5d15063d8b8c	91ed4e7d-2027-46f0-9efd-e7048a9fe7bb	815c5927-5362-4ad2-8e21-718a22587b05	\N	t	1.00	8	2026-09-30 02:28:27.499741+00	2026-09-30 02:28:27.5004+00	2026-09-30 02:28:27.5004+00
115351b0-4f68-44b2-b22c-9ca4234e0d65	8c0c21fd-93d3-4da5-9021-67194ed1cf06	f49f136b-d0b0-4588-aa0d-aa549e9e7647	cf302a4c-a78e-42df-afa7-aca6c6a34d0d	b2b2fb76-1f00-4a99-bb96-c76398dff053	\N	f	0.00	7	2026-09-30 02:28:34.844918+00	2026-09-30 02:28:34.845417+00	2026-09-30 02:28:34.845417+00
206c2af7-4480-4c0d-9b84-c9ae132cfe86	8c0c21fd-93d3-4da5-9021-67194ed1cf06	02ba1a6a-8ad2-4587-a92e-9cbc74cef20b	b4e3c1c0-0c5b-4358-ac7e-4e47c25e130c	0d10d6bd-a551-4591-b7e8-af71ca85bdf8	\N	t	1.00	3	2026-09-30 02:28:37.962058+00	2026-09-30 02:28:37.962665+00	2026-09-30 02:28:37.962665+00
0fc2d091-0649-434e-b5af-272a819dd3c8	231bc117-58f1-4042-ac2c-b4aec6ffb8b1	5b8dc496-4c06-4270-9da4-7148aa3cefef	633c1af4-5b37-4578-acd0-00e4bb640602	b3a52e93-8b68-4b46-9d55-94875f7cd2ac	\N	t	1.00	15	2026-10-01 07:23:20.434436+00	2026-10-01 07:23:20.569933+00	2026-10-01 07:23:20.569933+00
deeb4989-3ec7-4406-973a-4a31c63eeb32	231bc117-58f1-4042-ac2c-b4aec6ffb8b1	f49f136b-d0b0-4588-aa0d-aa549e9e7647	e42cd5d2-6162-4eb9-a73a-4bdf0ef7b208	f6c74874-c4ad-4f26-b0de-957e122efb96	\N	f	0.00	3	2026-10-01 07:23:30.532483+00	2026-10-01 07:23:30.665425+00	2026-10-01 07:23:30.665425+00
4d136c9a-4ccc-4c2c-9be9-c56fcad60ef0	231bc117-58f1-4042-ac2c-b4aec6ffb8b1	02ba1a6a-8ad2-4587-a92e-9cbc74cef20b	6895c2b5-c50b-4d08-86b1-a653edfb1abb	0d10d6bd-a551-4591-b7e8-af71ca85bdf8	\N	t	1.00	154	2026-10-01 07:26:09.87093+00	2026-10-01 07:23:45.610756+00	2026-10-01 07:26:10.001554+00
d38e7256-f02d-45eb-9f93-2a2e7693d9c0	8c42f1a7-c7fb-4edb-b027-077f3812e13c	7d011732-3523-4bcf-aa8a-3e4d8461785f	64f6c330-750d-44eb-a6c6-f8439be59983	\N	{"531d13b6-7fce-4cf1-813a-a7dee95819e7": "SETUJU", "92192bf5-a413-43ba-a8a8-54c0967221c1": "SETUJU", "a2644d30-babf-401b-ae13-e94b2dbbc0d6": "SETUJU", "c6b4d011-edc5-495e-a920-b7c13efd3b80": "SETUJU"}	f	0.00	9	2026-10-01 09:10:26.241202+00	2026-10-01 09:10:26.332383+00	2026-10-01 09:10:26.332383+00
d011b0f7-5f2b-4930-8078-77eb9a6f0785	8c42f1a7-c7fb-4edb-b027-077f3812e13c	f49f136b-d0b0-4588-aa0d-aa549e9e7647	8042c24e-dacc-4f0e-927b-563f605e1725	e1448a57-8d74-4b70-932b-c6181125f280	\N	t	1.00	3	2026-10-01 09:10:33.306564+00	2026-10-01 09:10:33.331358+00	2026-10-01 09:10:33.331358+00
25be83ec-02a0-452f-87b6-aa477931b9a4	8c42f1a7-c7fb-4edb-b027-077f3812e13c	02ba1a6a-8ad2-4587-a92e-9cbc74cef20b	947ae207-ae30-48aa-9701-dc101cff0143	0d10d6bd-a551-4591-b7e8-af71ca85bdf8	\N	t	1.00	85	2026-10-01 09:12:01.966426+00	2026-10-01 09:10:39.138955+00	2026-10-01 09:12:01.997256+00
692311b5-aeef-44ce-9d1a-ceda49014876	276b6116-9c80-4267-ba42-c715f30e90d5	7d011732-3523-4bcf-aa8a-3e4d8461785f	d4b0ea98-23d1-49e0-94a3-52f1634b09b1	\N	{"531d13b6-7fce-4cf1-813a-a7dee95819e7": "TIDAK_SETUJU", "92192bf5-a413-43ba-a8a8-54c0967221c1": "SETUJU", "a2644d30-babf-401b-ae13-e94b2dbbc0d6": "TIDAK_SETUJU", "c6b4d011-edc5-495e-a920-b7c13efd3b80": "TIDAK_SETUJU"}	f	0.00	12	2026-10-01 09:13:33.399169+00	2026-10-01 09:13:33.415784+00	2026-10-01 09:13:33.415784+00
e46852d8-a53f-497f-93d3-396a98311198	276b6116-9c80-4267-ba42-c715f30e90d5	f49f136b-d0b0-4588-aa0d-aa549e9e7647	d22d9384-ab6a-4398-a01a-fe95f1bbba85	b2b2fb76-1f00-4a99-bb96-c76398dff053	\N	f	0.00	6	2026-10-01 09:13:46.521613+00	2026-10-01 09:13:46.619723+00	2026-10-01 09:13:46.619723+00
81e73ae8-e09c-4ab2-9dba-3bb09b256b50	276b6116-9c80-4267-ba42-c715f30e90d5	02ba1a6a-8ad2-4587-a92e-9cbc74cef20b	eabdb86a-aeda-4c12-aa36-7eff90e9d2b2	341db950-6de0-470f-a1fb-3eac0adf584d	\N	f	0.00	53	2026-10-01 09:14:46.933917+00	2026-10-01 09:13:59.009336+00	2026-10-01 09:14:46.949913+00
9199c617-4950-4a49-8036-2921ef0bb01b	0729f24c-f6bb-4fd6-994a-c94e6c8a7825	7edd0484-71d3-49bd-a549-de8010bdfa5a	309f3968-fa21-47f2-8073-65bc28e487ef	a1cd8323-8a0e-4f57-90d4-d0f060e5be40	\N	t	1.00	12	2026-10-24 05:30:13.376709+00	2026-10-24 05:30:13.393142+00	2026-10-24 05:30:13.393142+00
67204f96-782f-4615-960c-dbc32e83ca62	0729f24c-f6bb-4fd6-994a-c94e6c8a7825	1d1cc286-8aca-4f34-a355-61befc34b09b	c03850ee-d4b3-46c3-8790-111a9e8fdfd6	8297a140-aa40-46c1-9d58-f952a90e68b2	\N	t	1.00	25	2026-10-24 05:30:40.717826+00	2026-10-24 05:30:40.734145+00	2026-10-24 05:30:40.734145+00
40719234-d977-4841-bc39-942299c341ab	0729f24c-f6bb-4fd6-994a-c94e6c8a7825	ccccd4bf-4bf8-44cc-8f33-1919490b6fb0	226e7fb4-5016-46d2-abb7-c80fa11ad6dd	\N	{"8a37a406-8a3e-4907-97fe-e76a7d30ecf2": "BENAR"}	f	0.00	31	2026-10-24 05:31:15.022288+00	2026-10-24 05:31:15.038105+00	2026-10-24 05:31:15.038105+00
68b0ed74-d3bb-47d2-ac0b-552032e98de3	bf6c490b-6853-4272-8c6e-b07173ec2ad0	6139c29c-c66a-48ce-af97-1a2526e3285a	451a015d-ee0c-42e4-aefc-50dca9860f71	c1efcbde-78fa-440c-b0a6-bbbe5a7ac231	\N	f	0.00	8	2026-10-24 06:04:02.817529+00	2026-10-24 06:04:02.857854+00	2026-10-24 06:04:02.857854+00
bd3c7b6f-f601-4a2b-8ba8-de9426683d6f	bf6c490b-6853-4272-8c6e-b07173ec2ad0	1d1cc286-8aca-4f34-a355-61befc34b09b	727dce91-6157-4fbc-ae5f-0d48c58c09bc	c4f3f61b-c749-40ba-87a2-f552a223f478	\N	f	0.00	5	2026-10-24 06:04:10.599966+00	2026-10-24 06:04:10.640156+00	2026-10-24 06:04:10.640156+00
46e62a61-a0fd-4a04-a458-c5966af74ea1	bf6c490b-6853-4272-8c6e-b07173ec2ad0	ccccd4bf-4bf8-44cc-8f33-1919490b6fb0	70717d90-8c52-4e04-919b-7b53573db9a2	\N	{"6028cbb2-2087-48f6-bac6-850fb7057018": "BENAR", "8a37a406-8a3e-4907-97fe-e76a7d30ecf2": "BENAR", "f9385691-e5b9-445a-9437-17cb275c074d": "BENAR"}	f	0.00	556	2026-10-24 06:13:49.257088+00	2026-10-24 06:04:21.597812+00	2026-10-24 06:13:49.301932+00
e5047e8c-7cfd-4a85-8b24-7dd5e442b2f7	d64b94a7-bf46-4265-9198-82f5d6adc599	939e6bb7-af2b-49b6-9fbc-224d14e4ab94	f9c0c940-de29-4f85-ac87-65d74bb261e3	\N	{"859389bf-981e-43e8-bc43-010d8521093c": "TEPAT", "9b3567c3-b70f-42e2-849d-2d48a7d911b2": "TEPAT"}	f	0.00	12	2026-11-08 10:42:40.857168+00	2026-11-08 10:42:40.847182+00	2026-11-08 10:42:40.847182+00
47b048bc-90d8-4f20-a8ff-78a5a82f92ff	d64b94a7-bf46-4265-9198-82f5d6adc599	f49f136b-d0b0-4588-aa0d-aa549e9e7647	a08adfe6-cb72-4cdc-82c0-6d3809eb134d	e1448a57-8d74-4b70-932b-c6181125f280	\N	t	1.00	3	2026-11-08 10:42:45.332146+00	2026-11-08 10:42:45.321399+00	2026-11-08 10:42:45.321399+00
1e64b90d-dadf-4113-afe9-d46b031ca6c5	d64b94a7-bf46-4265-9198-82f5d6adc599	02ba1a6a-8ad2-4587-a92e-9cbc74cef20b	190a1820-a76e-42f7-83fb-0c04f1f8245e	fc3fcfb0-49e6-4328-a67a-7c4a74036194	\N	t	1.00	6	2026-11-08 10:42:52.668995+00	2026-11-08 10:42:52.658604+00	2026-11-08 10:42:52.658604+00
0c083e23-99cd-49ed-bf9f-cce077a16a15	568497cb-4fd2-4188-a97c-f4b274db9010	e4b65e11-e594-4f62-ba9f-1c88e7658ef0	ed2b5cde-ddfc-45db-97e4-84292131820b	33535afa-9bc2-4e1a-91b7-0a49f0688eb3	\N	f	0.00	35	2026-11-08 13:34:15.120404+00	2026-11-08 13:34:15.158102+00	2026-11-08 13:34:15.158102+00
605d81a8-ffbf-4fd6-8da2-2450499343cd	568497cb-4fd2-4188-a97c-f4b274db9010	1d1cc286-8aca-4f34-a355-61befc34b09b	1838ce36-cd1d-4323-adb2-91313b4e5c4b	a4537c02-f6a4-4866-a079-e61e7a356221	\N	f	0.00	50	2026-11-08 13:35:05.953599+00	2026-11-08 13:35:05.988613+00	2026-11-08 13:35:05.988613+00
1302c386-fb08-422a-925f-6d136a3e187e	568497cb-4fd2-4188-a97c-f4b274db9010	ccccd4bf-4bf8-44cc-8f33-1919490b6fb0	033d83eb-9143-4a7a-a3b4-37088f97216f	\N	{"6028cbb2-2087-48f6-bac6-850fb7057018": "BENAR", "8a37a406-8a3e-4907-97fe-e76a7d30ecf2": "SALAH", "f9385691-e5b9-445a-9437-17cb275c074d": "BENAR"}	f	0.00	11	2026-11-08 13:35:18.673567+00	2026-11-08 13:35:18.711465+00	2026-11-08 13:35:18.711465+00
\.


--
-- Data for Name: student_profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.student_profiles (id, user_id, school, grade, major, target_university, target_major, bio, created_at, updated_at, school_id, jenjang) FROM stdin;
045ead96-1be8-40f0-bcd4-3cd75b518ce3	f125ef5d-2c6f-4187-b02d-a50465b62803	SMA Negeri 1 Banda Aceh						2026-09-13 13:18:13.893158+00	2026-11-08 13:39:39.708954+00	53dd3bb9-d11d-49b0-8b4a-89a505e858e0	\N
eb794260-4793-4edc-9304-8f778aa5212c	fc4baf98-26f0-45e0-89b9-ddd23d0f3bd1	SMA Negeri 1 Banda Aceh						2026-11-08 13:13:30.528795+00	2026-11-08 13:13:30.528795+00	53dd3bb9-d11d-49b0-8b4a-89a505e858e0	\N
\.


--
-- Data for Name: testimonials; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.testimonials (id, user_id, author_name, author_role, content, rating, status, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: tryout_attempts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tryout_attempts (id, tryout_id, user_id, status, current_question_number, current_difficulty_level, correct_streak, score, started_at, submitted_at, created_at, updated_at, target_streak, window_correct, window_incorrect, is_tie_breaker, is_auto_submitted, auto_submit_reason) FROM stdin;
c4594205-b7fc-45eb-a3b3-d43ac0c6f630	3a080abf-19d1-4056-8b9b-029cf70cd4b2	f125ef5d-2c6f-4187-b02d-a50465b62803	completed	1	2	0	0.00	2026-09-28 06:38:41.681878+00	2026-09-28 06:39:45.884961+00	2026-09-28 06:38:42.091253+00	2026-09-28 06:39:45.987333+00	1	0	0	f	t	VIOLATION_THRESHOLD_EXCEEDED
2549e94c-16ac-49de-80dd-dffc9a589825	3a080abf-19d1-4056-8b9b-029cf70cd4b2	f125ef5d-2c6f-4187-b02d-a50465b62803	completed	1	3	0	0.00	2026-09-28 06:39:52.439202+00	2026-09-28 06:40:03.600124+00	2026-09-28 06:39:52.848654+00	2026-09-28 06:40:03.698352+00	3	0	0	f	t	VIOLATION_THRESHOLD_EXCEEDED
a7459e54-5b96-4664-8a32-f770bf02a8d1	3a080abf-19d1-4056-8b9b-029cf70cd4b2	f125ef5d-2c6f-4187-b02d-a50465b62803	completed	1	1	0	0.00	2026-09-28 06:56:46.089614+00	2026-09-28 07:04:03.434208+00	2026-09-28 06:56:46.499231+00	2026-09-28 07:04:03.54129+00	2	0	0	f	f	
568497cb-4fd2-4188-a97c-f4b274db9010	a8821f5b-dd54-4227-99e3-16ce350a6aa1	f125ef5d-2c6f-4187-b02d-a50465b62803	completed	3	1	0	0.00	2026-11-08 13:33:40.290654+00	2026-11-08 13:35:44.263014+00	2026-11-08 13:33:40.504045+00	2026-11-08 13:35:44.420861+00	1	0	0	f	f	
11e6bfde-0b03-4187-bcb0-ade07ff3b916	3a080abf-19d1-4056-8b9b-029cf70cd4b2	f125ef5d-2c6f-4187-b02d-a50465b62803	completed	3	2	2	66.67	2026-09-28 07:08:46.164496+00	2026-09-28 07:09:27.227665+00	2026-09-28 07:08:46.574117+00	2026-09-28 07:09:27.32935+00	2	0	0	f	f	
276b6116-9c80-4267-ba42-c715f30e90d5	3a080abf-19d1-4056-8b9b-029cf70cd4b2	f125ef5d-2c6f-4187-b02d-a50465b62803	completed	3	3	0	0.00	2026-10-01 09:13:22.954365+00	2026-10-01 09:14:49.584693+00	2026-10-01 09:13:23.802494+00	2026-10-01 09:14:50.125932+00	1	0	0	f	t	VIOLATION_THRESHOLD_EXCEEDED
32d344dc-2af5-4d74-a05e-f7c892c62809	3a080abf-19d1-4056-8b9b-029cf70cd4b2	f125ef5d-2c6f-4187-b02d-a50465b62803	completed	3	4	0	0.00	2026-09-28 09:07:06.153973+00	2026-09-28 09:07:41.524346+00	2026-09-28 09:07:06.175969+00	2026-09-28 09:07:41.52692+00	2	0	1	f	f	
9bae655a-54e4-4803-bb9d-4df71b815f1d	a8821f5b-dd54-4227-99e3-16ce350a6aa1	f125ef5d-2c6f-4187-b02d-a50465b62803	completed	1	1	0	0.00	2026-10-24 04:53:40.242594+00	2026-10-24 04:58:19.587747+00	2026-10-24 04:53:40.652165+00	2026-10-24 04:58:19.894826+00	3	0	0	f	t	VIOLATION_THRESHOLD_EXCEEDED
4686e74d-d3e9-4bd2-a700-2778cd0bfeb0	3a080abf-19d1-4056-8b9b-029cf70cd4b2	f125ef5d-2c6f-4187-b02d-a50465b62803	completed	3	1	0	0.00	2026-09-30 02:24:09.244589+00	2026-09-30 02:24:59.223976+00	2026-09-30 02:24:09.256128+00	2026-09-30 02:24:59.231767+00	3	0	1	f	f	
8c0c21fd-93d3-4da5-9021-67194ed1cf06	3a080abf-19d1-4056-8b9b-029cf70cd4b2	f125ef5d-2c6f-4187-b02d-a50465b62803	completed	3	2	1	66.67	2026-09-30 02:28:20.228379+00	2026-09-30 02:28:41.641417+00	2026-09-30 02:28:20.237381+00	2026-09-30 02:28:41.646938+00	2	1	0	f	f	
0729f24c-f6bb-4fd6-994a-c94e6c8a7825	a8821f5b-dd54-4227-99e3-16ce350a6aa1	f125ef5d-2c6f-4187-b02d-a50465b62803	completed	3	5	0	66.67	2026-10-24 05:30:02.317957+00	2026-10-24 05:31:25.159988+00	2026-10-24 05:30:02.727066+00	2026-10-24 05:31:25.462345+00	3	0	1	f	f	
231bc117-58f1-4042-ac2c-b4aec6ffb8b1	3a080abf-19d1-4056-8b9b-029cf70cd4b2	f125ef5d-2c6f-4187-b02d-a50465b62803	expired	3	5	4	\N	2026-10-01 07:23:10.273742+00	\N	2026-10-01 07:23:11.383953+00	2026-10-01 09:07:34.824268+00	3	1	0	f	f	
8c42f1a7-c7fb-4edb-b027-077f3812e13c	3a080abf-19d1-4056-8b9b-029cf70cd4b2	f125ef5d-2c6f-4187-b02d-a50465b62803	completed	3	5	2	66.67	2026-10-01 09:10:17.434956+00	2026-10-01 09:12:03.214039+00	2026-10-01 09:10:18.254225+00	2026-10-01 09:12:03.726872+00	1	0	0	f	t	VIOLATION_THRESHOLD_EXCEEDED
bf6c490b-6853-4272-8c6e-b07173ec2ad0	a8821f5b-dd54-4227-99e3-16ce350a6aa1	f125ef5d-2c6f-4187-b02d-a50465b62803	completed	3	1	0	0.00	2026-10-24 06:03:56.572242+00	2026-10-24 06:13:52.738259+00	2026-10-24 06:03:57.287973+00	2026-10-24 06:13:53.045621+00	3	0	1	f	f	
d64b94a7-bf46-4265-9198-82f5d6adc599	3a080abf-19d1-4056-8b9b-029cf70cd4b2	f125ef5d-2c6f-4187-b02d-a50465b62803	completed	3	4	2	66.67	2026-11-08 10:42:30.044833+00	2026-11-08 10:42:56.189048+00	2026-11-08 10:42:30.260362+00	2026-11-08 10:42:56.345966+00	3	1	0	t	f	
\.


--
-- Data for Name: tryout_questions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tryout_questions (tryout_id, question_id, display_order, score_weight, created_at) FROM stdin;
819ee155-48ac-4001-ac3c-3c660c254223	a3f8465c-09c6-47f6-9246-131bf98306db	1	1.00	2026-09-21 08:03:58.763269+00
819ee155-48ac-4001-ac3c-3c660c254223	8f35d2de-5210-40d0-9f27-9950695aac3c	2	1.00	2026-09-21 08:03:58.763269+00
819ee155-48ac-4001-ac3c-3c660c254223	d960f59c-4bb5-426b-99b1-8801a1e4aca3	3	1.00	2026-09-21 08:03:58.763269+00
819ee155-48ac-4001-ac3c-3c660c254223	51c5b6ee-25a6-4c8a-ae33-67eb43a44576	4	1.00	2026-09-21 08:03:58.763269+00
819ee155-48ac-4001-ac3c-3c660c254223	1068bb20-d27d-4fb3-a9a8-7953ee241f9a	5	1.00	2026-09-21 08:03:58.763269+00
3a080abf-19d1-4056-8b9b-029cf70cd4b2	f49f136b-d0b0-4588-aa0d-aa549e9e7647	1	1.00	2026-09-23 15:44:55.32599+00
3a080abf-19d1-4056-8b9b-029cf70cd4b2	02ba1a6a-8ad2-4587-a92e-9cbc74cef20b	2	1.00	2026-09-23 15:44:55.32599+00
3a080abf-19d1-4056-8b9b-029cf70cd4b2	7acc58ec-1d7f-4f2f-aec7-2e9df230ab51	3	1.00	2026-09-23 15:44:55.32599+00
3a080abf-19d1-4056-8b9b-029cf70cd4b2	939e6bb7-af2b-49b6-9fbc-224d14e4ab94	4	1.00	2026-09-23 15:44:55.32599+00
3a080abf-19d1-4056-8b9b-029cf70cd4b2	ca0f2713-6e49-4385-83ff-3d2a32c9df38	5	1.00	2026-09-23 15:44:55.32599+00
3a080abf-19d1-4056-8b9b-029cf70cd4b2	39e9cfa9-ecf9-47c4-a3dc-097178820aff	6	1.00	2026-09-23 15:44:55.32599+00
3a080abf-19d1-4056-8b9b-029cf70cd4b2	e9232f01-bf4c-4f5d-b27e-5d15063d8b8c	7	1.00	2026-09-23 15:44:55.32599+00
3a080abf-19d1-4056-8b9b-029cf70cd4b2	138e7334-0505-429d-a399-e28418fbb0ac	8	1.00	2026-09-23 15:44:55.32599+00
3a080abf-19d1-4056-8b9b-029cf70cd4b2	afc043b3-bb56-4ed7-b4c9-dff438aad899	9	1.00	2026-09-23 15:44:55.32599+00
3a080abf-19d1-4056-8b9b-029cf70cd4b2	ae47dce0-f370-4050-a5e7-d0a27277a414	10	1.00	2026-09-23 15:44:55.32599+00
3a080abf-19d1-4056-8b9b-029cf70cd4b2	37b33e7f-4016-4cfd-a9e0-eb1f33896527	11	1.00	2026-09-23 15:44:55.32599+00
3a080abf-19d1-4056-8b9b-029cf70cd4b2	8a9d3b1f-2724-4193-9caf-71b7de257627	12	1.00	2026-09-23 15:44:55.32599+00
3a080abf-19d1-4056-8b9b-029cf70cd4b2	5b8dc496-4c06-4270-9da4-7148aa3cefef	13	1.00	2026-09-23 15:44:55.32599+00
3a080abf-19d1-4056-8b9b-029cf70cd4b2	7fc19fd7-107f-4e50-89c3-001d188312a7	14	1.00	2026-09-23 15:44:55.32599+00
3a080abf-19d1-4056-8b9b-029cf70cd4b2	7d011732-3523-4bcf-aa8a-3e4d8461785f	15	1.00	2026-09-23 15:44:55.32599+00
a8821f5b-dd54-4227-99e3-16ce350a6aa1	1d1cc286-8aca-4f34-a355-61befc34b09b	1	1.00	2026-10-24 04:40:18.564024+00
a8821f5b-dd54-4227-99e3-16ce350a6aa1	ccccd4bf-4bf8-44cc-8f33-1919490b6fb0	2	1.00	2026-10-24 04:40:18.564024+00
a8821f5b-dd54-4227-99e3-16ce350a6aa1	bc8ba9f3-5fcc-441b-975a-75688de67e5e	3	1.00	2026-10-24 04:40:18.564024+00
a8821f5b-dd54-4227-99e3-16ce350a6aa1	7edd0484-71d3-49bd-a549-de8010bdfa5a	4	1.00	2026-10-24 04:40:18.564024+00
a8821f5b-dd54-4227-99e3-16ce350a6aa1	2f25a29a-d77b-49d6-9d0e-d2d7751eb52f	5	1.00	2026-10-24 04:40:18.564024+00
a8821f5b-dd54-4227-99e3-16ce350a6aa1	91c9c73d-4833-46d9-9562-8bdb71d3fdc9	6	1.00	2026-10-24 04:40:18.564024+00
a8821f5b-dd54-4227-99e3-16ce350a6aa1	27d9c730-e75e-4537-8388-9acaca86dee4	7	1.00	2026-10-24 04:40:18.564024+00
a8821f5b-dd54-4227-99e3-16ce350a6aa1	6139c29c-c66a-48ce-af97-1a2526e3285a	8	1.00	2026-10-24 04:40:18.564024+00
a8821f5b-dd54-4227-99e3-16ce350a6aa1	d1ee3aad-fde4-47df-b431-877218b15fea	9	1.00	2026-10-24 04:40:18.564024+00
a8821f5b-dd54-4227-99e3-16ce350a6aa1	12a5f102-c612-4b3e-88d2-3aae5a8372ec	10	1.00	2026-10-24 04:40:18.564024+00
a8821f5b-dd54-4227-99e3-16ce350a6aa1	e4b65e11-e594-4f62-ba9f-1c88e7658ef0	11	1.00	2026-10-24 04:40:18.564024+00
a8821f5b-dd54-4227-99e3-16ce350a6aa1	3de4e2ce-90e5-45c6-be54-e50ae8d044c0	12	1.00	2026-10-24 04:40:18.564024+00
a8821f5b-dd54-4227-99e3-16ce350a6aa1	ffa235ae-99b8-43b5-a110-58ee143d2a72	13	1.00	2026-10-24 04:40:18.564024+00
a8821f5b-dd54-4227-99e3-16ce350a6aa1	82868389-0756-4b10-89df-d38fa65d2f1e	14	1.00	2026-10-24 04:40:18.564024+00
a8821f5b-dd54-4227-99e3-16ce350a6aa1	e39a881b-cf15-4599-98bf-bda0a1bc47c6	15	1.00	2026-10-24 04:40:18.564024+00
767b4a1c-f53d-42cd-a233-9add7db7cea7	a6dc5513-9c30-4780-a3db-5eeedd68be79	1	1.00	2026-11-08 13:31:52.170112+00
767b4a1c-f53d-42cd-a233-9add7db7cea7	ea1e3eae-fc0d-48a7-8333-4446c89c81bb	2	1.00	2026-11-08 13:31:52.170112+00
767b4a1c-f53d-42cd-a233-9add7db7cea7	bd3ea538-3edb-4dc8-85bd-8a801c98f3d6	3	1.00	2026-11-08 13:31:52.170112+00
767b4a1c-f53d-42cd-a233-9add7db7cea7	381e7add-5f96-4c1c-8b0d-07ae711ac296	4	1.00	2026-11-08 13:31:52.170112+00
767b4a1c-f53d-42cd-a233-9add7db7cea7	12396019-b799-42e6-b456-8007452b4851	5	1.00	2026-11-08 13:31:52.170112+00
767b4a1c-f53d-42cd-a233-9add7db7cea7	f206f347-7202-4b67-b792-90596f4837c9	6	1.00	2026-11-08 13:31:52.170112+00
767b4a1c-f53d-42cd-a233-9add7db7cea7	db70cb96-c9f3-4590-8e4b-9dc17ec57d2b	7	1.00	2026-11-08 13:31:52.170112+00
767b4a1c-f53d-42cd-a233-9add7db7cea7	f81267a5-0f32-45e0-9667-9642f29994b7	8	1.00	2026-11-08 13:31:52.170112+00
767b4a1c-f53d-42cd-a233-9add7db7cea7	ee52c084-adef-477f-9e57-30ddfe413859	9	1.00	2026-11-08 13:31:52.170112+00
767b4a1c-f53d-42cd-a233-9add7db7cea7	48d80012-822a-429c-976a-e71faaab2af3	10	1.00	2026-11-08 13:31:52.170112+00
\.


--
-- Data for Name: tryouts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tryouts (id, title, description, duration_seconds, total_questions, status, start_at, end_at, created_by, updated_by, created_at, updated_at, deleted_at, jenjang) FROM stdin;
b24ae8dd-9bae-4596-b71a-71e486d8864a	Try Out TKA		4500	150	draft	\N	\N	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-09-19 05:02:55.00157+00	2026-09-19 05:02:55.00157+00	2026-09-19 08:30:24.915465+00	sma
161959f1-02ad-4214-8555-16e77c679254	TKA BI	ASDASD	4500	30	draft	\N	\N	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-09-21 07:37:20.808662+00	2026-09-21 07:40:33.699977+00	2026-09-21 07:59:40.776888+00	sma
819ee155-48ac-4001-ac3c-3c660c254223	TKA	MMMMMM	4500	30	draft	\N	\N	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-09-21 08:02:26.876068+00	2026-09-21 08:03:46.751429+00	2026-09-23 15:33:00.975899+00	sma
a8821f5b-dd54-4227-99e3-16ce350a6aa1	Test TryOut		4500	30	published	\N	\N	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	2026-10-24 03:06:32.227276+00	2026-10-24 04:42:37.21121+00	\N	sma
3a080abf-19d1-4056-8b9b-029cf70cd4b2	Matematika	Mencoba Tryout	4500	30	published	\N	\N	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-09-23 15:33:16.944383+00	2026-11-08 10:23:51.194922+00	\N	sma
767b4a1c-f53d-42cd-a233-9add7db7cea7	Contoh Tryout	Tester	4500	30	draft	\N	\N	bbab3c0e-fa43-40fd-8dde-e65f10309e95	bbab3c0e-fa43-40fd-8dde-e65f10309e95	2026-11-08 13:26:51.182239+00	2026-11-08 13:31:41.462268+00	\N	sma
\.


--
-- Data for Name: tutorials; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tutorials (id, title, slug, description, youtube_url, duration_seconds, category, jenjang, status, published_at, created_by, updated_by, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, full_name, email, password_hash, avatar_url, role, status, last_login_at, created_at, updated_at, deleted_at) FROM stdin;
fc4baf98-26f0-45e0-89b9-ddd23d0f3bd1	Dikzy	mulia23@mhs.usk.ac.id	$2a$10$CnbrPxv02jxuxli5eF3ZFuLnMGqNfbkZXAIVFdGcQqtbgg1ZRTRG2	\N	student	active	2026-11-08 13:13:11.139696+00	2026-11-08 13:12:32.099452+00	2026-11-08 13:13:11.161126+00	\N
bbab3c0e-fa43-40fd-8dde-e65f10309e95	Aninn	anindump15@gmail.com	$2a$10$Pj1a4KOxtaeuaylCd32CT.QVpXIcVycPdOwPCpE9s8hwPw9L.s2uK	\N	content_manager	active	2026-11-08 13:20:06.383795+00	2026-09-17 05:17:36.454719+00	2026-11-08 13:20:06.405762+00	\N
f125ef5d-2c6f-4187-b02d-a50465b62803	Mulia Andiki	muliaandiki@gmail.com	$2a$10$KQGmu6HGEICK9xDhkeMb8OSa/UlatV0gobQAzNJaF60qqk9momEYy	https://pub-6640a1324ad84f30ae0a025294f08244.r2.dev/avatars/1794039496060-2nyfsegbxmh.webp	student	active	2026-11-09 06:03:25.897929+00	2026-09-13 08:05:57.560252+00	2026-11-09 06:03:25.951134+00	\N
d256bb2b-c4e0-4c3d-b2e8-a46260f3b5d3	Anin	anindyahumaira535@gmail.com	$2a$10$xTficOoODk9bVYbB4xv0VOGExvf7yNWgJm/WEkB58UFYjoOFfX5rq	\N	admin	active	2026-11-13 03:34:28.866636+00	2026-09-15 10:06:02.154778+00	2026-11-13 03:34:28.867167+00	\N
b121da5d-5efd-44ea-8630-65bd2c7a9403	Si Bro	sibro@gmail.com	$2a$10$iNLSrUjWVeRfNvyttiw0kOQTs1U2AISpDZVwGLZV2O4Xamn2ph0uy	\N	student	pending	\N	2026-11-08 10:14:13.926906+00	2026-11-08 10:14:13.926906+00	\N
\.


--
-- Name: attempt_questions attempt_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attempt_questions
    ADD CONSTRAINT attempt_questions_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: competencies competencies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.competencies
    ADD CONSTRAINT competencies_pkey PRIMARY KEY (id);


--
-- Name: competency_evaluations competency_evaluations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.competency_evaluations
    ADD CONSTRAINT competency_evaluations_pkey PRIMARY KEY (id);


--
-- Name: documentation documentation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documentation
    ADD CONSTRAINT documentation_pkey PRIMARY KEY (id);


--
-- Name: documentation documentation_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documentation
    ADD CONSTRAINT documentation_slug_key UNIQUE (slug);


--
-- Name: documentations documentations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documentations
    ADD CONSTRAINT documentations_pkey PRIMARY KEY (id);


--
-- Name: evaluations evaluations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evaluations
    ADD CONSTRAINT evaluations_pkey PRIMARY KEY (id);


--
-- Name: external_accounts external_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.external_accounts
    ADD CONSTRAINT external_accounts_pkey PRIMARY KEY (id);


--
-- Name: file_records file_records_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.file_records
    ADD CONSTRAINT file_records_pkey PRIMARY KEY (id);


--
-- Name: files files_object_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_object_key_key UNIQUE (object_key);


--
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);


--
-- Name: learning_modules learning_modules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_modules
    ADD CONSTRAINT learning_modules_pkey PRIMARY KEY (id);


--
-- Name: learning_progress learning_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_progress
    ADD CONSTRAINT learning_progress_pkey PRIMARY KEY (id);


--
-- Name: learning_progress learning_progress_user_id_material_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_progress
    ADD CONSTRAINT learning_progress_user_id_material_id_key UNIQUE (user_id, material_id);


--
-- Name: learning_progresses learning_progresses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_progresses
    ADD CONSTRAINT learning_progresses_pkey PRIMARY KEY (id);


--
-- Name: material_attachments material_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.material_attachments
    ADD CONSTRAINT material_attachments_pkey PRIMARY KEY (id);


--
-- Name: materials materials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materials
    ADD CONSTRAINT materials_pkey PRIMARY KEY (id);


--
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: otp_codes otp_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.otp_codes
    ADD CONSTRAINT otp_codes_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: practice_answers practice_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.practice_answers
    ADD CONSTRAINT practice_answers_pkey PRIMARY KEY (id);


--
-- Name: practice_package_questions practice_package_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.practice_package_questions
    ADD CONSTRAINT practice_package_questions_pkey PRIMARY KEY (package_id, question_id);


--
-- Name: practice_packages practice_packages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.practice_packages
    ADD CONSTRAINT practice_packages_pkey PRIMARY KEY (id);


--
-- Name: practices practices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.practices
    ADD CONSTRAINT practices_pkey PRIMARY KEY (id);


--
-- Name: question_competencies question_competencies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question_competencies
    ADD CONSTRAINT question_competencies_pkey PRIMARY KEY (question_id, competency_id);


--
-- Name: question_explanations question_explanations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question_explanations
    ADD CONSTRAINT question_explanations_pkey PRIMARY KEY (id);


--
-- Name: question_options question_options_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question_options
    ADD CONSTRAINT question_options_pkey PRIMARY KEY (id);


--
-- Name: question_types question_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question_types
    ADD CONSTRAINT question_types_pkey PRIMARY KEY (id);


--
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- Name: recommendations recommendations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recommendations
    ADD CONSTRAINT recommendations_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: schools schools_npsn_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_npsn_key UNIQUE (npsn);


--
-- Name: schools schools_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_pkey PRIMARY KEY (id);


--
-- Name: stimulus stimulus_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stimulus
    ADD CONSTRAINT stimulus_pkey PRIMARY KEY (id);


--
-- Name: student_answers student_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_answers
    ADD CONSTRAINT student_answers_pkey PRIMARY KEY (id);


--
-- Name: student_profiles student_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_profiles
    ADD CONSTRAINT student_profiles_pkey PRIMARY KEY (id);


--
-- Name: testimonials testimonials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT testimonials_pkey PRIMARY KEY (id);


--
-- Name: tryout_attempts tryout_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tryout_attempts
    ADD CONSTRAINT tryout_attempts_pkey PRIMARY KEY (id);


--
-- Name: tryout_questions tryout_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tryout_questions
    ADD CONSTRAINT tryout_questions_pkey PRIMARY KEY (tryout_id, question_id);


--
-- Name: tryouts tryouts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tryouts
    ADD CONSTRAINT tryouts_pkey PRIMARY KEY (id);


--
-- Name: tutorials tutorials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tutorials
    ADD CONSTRAINT tutorials_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_aq_attempt_number; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_aq_attempt_number ON public.attempt_questions USING btree (attempt_id, question_number);


--
-- Name: idx_aq_attempt_question; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_aq_attempt_question ON public.attempt_questions USING btree (attempt_id, question_id);


--
-- Name: idx_attempt_questions_attempt_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_attempt_questions_attempt_id ON public.attempt_questions USING btree (attempt_id);


--
-- Name: idx_attempt_questions_question_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_attempt_questions_question_id ON public.attempt_questions USING btree (question_id);


--
-- Name: idx_attempts_user_started; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_attempts_user_started ON public.tryout_attempts USING btree (user_id, started_at);


--
-- Name: idx_attempts_user_tryout_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_attempts_user_tryout_status ON public.tryout_attempts USING btree (user_id, tryout_id, status);


--
-- Name: idx_audit_logs_action; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_action ON public.audit_logs USING btree (action);


--
-- Name: idx_audit_logs_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_created_at ON public.audit_logs USING btree (created_at);


--
-- Name: idx_audit_logs_entity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_entity_id ON public.audit_logs USING btree (entity_id);


--
-- Name: idx_audit_logs_entity_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_entity_type ON public.audit_logs USING btree (entity_type);


--
-- Name: idx_audit_logs_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs USING btree (user_id);


--
-- Name: idx_competencies_code; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_competencies_code ON public.competencies USING btree (code);


--
-- Name: idx_competencies_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_competencies_deleted_at ON public.competencies USING btree (deleted_at);


--
-- Name: idx_competency_evaluations_comp_level; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_competency_evaluations_comp_level ON public.competency_evaluations USING btree (competency_id, level);


--
-- Name: idx_competency_evaluations_competency_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_competency_evaluations_competency_id ON public.competency_evaluations USING btree (competency_id);


--
-- Name: idx_competency_evaluations_evaluation_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_competency_evaluations_evaluation_id ON public.competency_evaluations USING btree (evaluation_id);


--
-- Name: idx_competency_evaluations_user_comp; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_competency_evaluations_user_comp ON public.competency_evaluations USING btree (user_id, competency_id);


--
-- Name: idx_competency_evaluations_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_competency_evaluations_user_id ON public.competency_evaluations USING btree (user_id);


--
-- Name: idx_documentations_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_documentations_category ON public.documentations USING btree (category);


--
-- Name: idx_documentations_created_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_documentations_created_by ON public.documentations USING btree (created_by);


--
-- Name: idx_documentations_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_documentations_deleted_at ON public.documentations USING btree (deleted_at);


--
-- Name: idx_documentations_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_documentations_slug ON public.documentations USING btree (slug);


--
-- Name: idx_documentations_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_documentations_status ON public.documentations USING btree (status);


--
-- Name: idx_evals_source; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_evals_source ON public.evaluations USING btree (source_type, source_id);


--
-- Name: idx_evaluations_source_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_evaluations_source_id ON public.evaluations USING btree (source_id);


--
-- Name: idx_evaluations_source_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_evaluations_source_type ON public.evaluations USING btree (source_type);


--
-- Name: idx_evaluations_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_evaluations_user ON public.evaluations USING btree (user_id);


--
-- Name: idx_evaluations_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_evaluations_user_id ON public.evaluations USING btree (user_id);


--
-- Name: idx_external_accounts_provider_user; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_external_accounts_provider_user ON public.external_accounts USING btree (provider, provider_user_id);


--
-- Name: idx_external_accounts_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_external_accounts_user_id ON public.external_accounts USING btree (user_id);


--
-- Name: idx_file_records_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_file_records_deleted_at ON public.file_records USING btree (deleted_at);


--
-- Name: idx_file_records_object_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_file_records_object_key ON public.file_records USING btree (object_key);


--
-- Name: idx_file_records_uploaded_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_file_records_uploaded_by ON public.file_records USING btree (uploaded_by);


--
-- Name: idx_learning_modules_created_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_learning_modules_created_by ON public.learning_modules USING btree (created_by);


--
-- Name: idx_learning_modules_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_learning_modules_deleted_at ON public.learning_modules USING btree (deleted_at);


--
-- Name: idx_learning_modules_jenjang; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_learning_modules_jenjang ON public.learning_modules USING btree (jenjang);


--
-- Name: idx_learning_modules_label; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_learning_modules_label ON public.learning_modules USING btree (label);


--
-- Name: idx_learning_progress_user_material; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_learning_progress_user_material ON public.learning_progresses USING btree (user_id, material_id);


--
-- Name: idx_learning_progresses_material_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_learning_progresses_material_id ON public.learning_progresses USING btree (material_id);


--
-- Name: idx_learning_progresses_user_completed; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_learning_progresses_user_completed ON public.learning_progresses USING btree (user_id, is_completed);


--
-- Name: idx_learning_progresses_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_learning_progresses_user_id ON public.learning_progresses USING btree (user_id);


--
-- Name: idx_material_attachments_file_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_material_attachments_file_id ON public.material_attachments USING btree (file_id);


--
-- Name: idx_material_attachments_material_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_material_attachments_material_id ON public.material_attachments USING btree (material_id);


--
-- Name: idx_materials_competency_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_materials_competency_id ON public.materials USING btree (competency_id);


--
-- Name: idx_materials_created_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_materials_created_by ON public.materials USING btree (created_by);


--
-- Name: idx_materials_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_materials_deleted_at ON public.materials USING btree (deleted_at);


--
-- Name: idx_materials_jenjang; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_materials_jenjang ON public.materials USING btree (jenjang);


--
-- Name: idx_materials_module_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_materials_module_id ON public.materials USING btree (module_id);


--
-- Name: idx_news_created_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_news_created_by ON public.news USING btree (created_by);


--
-- Name: idx_news_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_news_deleted_at ON public.news USING btree (deleted_at);


--
-- Name: idx_news_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_news_slug ON public.news USING btree (slug);


--
-- Name: idx_news_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_news_status ON public.news USING btree (status);


--
-- Name: idx_notifications_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_created_at ON public.notifications USING btree (created_at);


--
-- Name: idx_notifications_is_read; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_is_read ON public.notifications USING btree (is_read);


--
-- Name: idx_notifications_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_type ON public.notifications USING btree (type);


--
-- Name: idx_notifications_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_user ON public.notifications USING btree (user_id);


--
-- Name: idx_notifications_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_user_id ON public.notifications USING btree (user_id);


--
-- Name: idx_otp_codes_expires_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_otp_codes_expires_at ON public.otp_codes USING btree (expires_at);


--
-- Name: idx_otp_codes_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_otp_codes_user_id ON public.otp_codes USING btree (user_id);


--
-- Name: idx_password_reset_tokens_token_hash; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_password_reset_tokens_token_hash ON public.password_reset_tokens USING btree (token_hash);


--
-- Name: idx_password_reset_tokens_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_password_reset_tokens_user_id ON public.password_reset_tokens USING btree (user_id);


--
-- Name: idx_permissions_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_permissions_name ON public.permissions USING btree (name);


--
-- Name: idx_permissions_resource; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permissions_resource ON public.permissions USING btree (resource);


--
-- Name: idx_practice_answers_practice_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_practice_answers_practice_id ON public.practice_answers USING btree (practice_id);


--
-- Name: idx_practice_answers_practice_question; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_practice_answers_practice_question ON public.practice_answers USING btree (practice_id, question_id);


--
-- Name: idx_practice_answers_question_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_practice_answers_question_id ON public.practice_answers USING btree (question_id);


--
-- Name: idx_practice_packages_competency_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_practice_packages_competency_id ON public.practice_packages USING btree (competency_id);


--
-- Name: idx_practice_packages_created_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_practice_packages_created_by ON public.practice_packages USING btree (created_by);


--
-- Name: idx_practice_packages_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_practice_packages_deleted_at ON public.practice_packages USING btree (deleted_at);


--
-- Name: idx_practice_packages_jenjang; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_practice_packages_jenjang ON public.practice_packages USING btree (jenjang);


--
-- Name: idx_practice_packages_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_practice_packages_status ON public.practice_packages USING btree (status);


--
-- Name: idx_practices_competency_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_practices_competency_id ON public.practices USING btree (competency_id);


--
-- Name: idx_practices_package_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_practices_package_id ON public.practices USING btree (package_id);


--
-- Name: idx_practices_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_practices_status ON public.practices USING btree (status);


--
-- Name: idx_practices_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_practices_user_id ON public.practices USING btree (user_id);


--
-- Name: idx_qc_comp; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_qc_comp ON public.question_competencies USING btree (competency_id);


--
-- Name: idx_question_explanations_question_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_question_explanations_question_id ON public.question_explanations USING btree (question_id);


--
-- Name: idx_question_options_question_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_question_options_question_id ON public.question_options USING btree (question_id);


--
-- Name: idx_question_types_code; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_question_types_code ON public.question_types USING btree (code);


--
-- Name: idx_questions_created_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_questions_created_by ON public.questions USING btree (created_by);


--
-- Name: idx_questions_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_questions_deleted_at ON public.questions USING btree (deleted_at);


--
-- Name: idx_questions_difficulty; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_questions_difficulty ON public.questions USING btree (difficulty_level);


--
-- Name: idx_questions_difficulty_level; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_questions_difficulty_level ON public.questions USING btree (difficulty_level);


--
-- Name: idx_questions_jenjang; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_questions_jenjang ON public.questions USING btree (jenjang);


--
-- Name: idx_questions_question_type_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_questions_question_type_id ON public.questions USING btree (question_type_id);


--
-- Name: idx_questions_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_questions_status ON public.questions USING btree (status);


--
-- Name: idx_questions_stimulus_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_questions_stimulus_id ON public.questions USING btree (stimulus_id);


--
-- Name: idx_recommendations_competency_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_recommendations_competency_id ON public.recommendations USING btree (competency_id);


--
-- Name: idx_recommendations_evaluation_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_recommendations_evaluation_id ON public.recommendations USING btree (evaluation_id);


--
-- Name: idx_recommendations_material_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_recommendations_material_id ON public.recommendations USING btree (material_id);


--
-- Name: idx_recommendations_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_recommendations_user_id ON public.recommendations USING btree (user_id);


--
-- Name: idx_refresh_tokens_expires_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_refresh_tokens_expires_at ON public.refresh_tokens USING btree (expires_at);


--
-- Name: idx_refresh_tokens_token_hash; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_refresh_tokens_token_hash ON public.refresh_tokens USING btree (token_hash);


--
-- Name: idx_refresh_tokens_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_refresh_tokens_user_id ON public.refresh_tokens USING btree (user_id);


--
-- Name: idx_roles_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_roles_name ON public.roles USING btree (name);


--
-- Name: idx_schools_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_schools_deleted_at ON public.schools USING btree (deleted_at);


--
-- Name: idx_schools_jenjang; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_schools_jenjang ON public.schools USING btree (jenjang);


--
-- Name: idx_schools_level; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_schools_level ON public.schools USING btree (jenjang);


--
-- Name: idx_stimuli_package_scope; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_stimuli_package_scope ON public.stimulus USING btree (package_id, package_kind);


--
-- Name: idx_stimulus_created_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_stimulus_created_by ON public.stimulus USING btree (created_by);


--
-- Name: idx_stimulus_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_stimulus_deleted_at ON public.stimulus USING btree (deleted_at);


--
-- Name: idx_student_answers_attempt_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_answers_attempt_id ON public.student_answers USING btree (attempt_id);


--
-- Name: idx_student_answers_attempt_question; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_student_answers_attempt_question ON public.student_answers USING btree (attempt_id, question_id);


--
-- Name: idx_student_answers_attempt_question_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_answers_attempt_question_id ON public.student_answers USING btree (attempt_question_id);


--
-- Name: idx_student_answers_question_correct; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_answers_question_correct ON public.student_answers USING btree (question_id, is_correct);


--
-- Name: idx_student_answers_question_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_answers_question_id ON public.student_answers USING btree (question_id);


--
-- Name: idx_student_answers_question_opt; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_answers_question_opt ON public.student_answers USING btree (question_id, selected_option_id);


--
-- Name: idx_student_profiles_jenjang; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_profiles_jenjang ON public.student_profiles USING btree (jenjang);


--
-- Name: idx_student_profiles_school_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_profiles_school_id ON public.student_profiles USING btree (school_id);


--
-- Name: idx_student_profiles_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_student_profiles_user_id ON public.student_profiles USING btree (user_id);


--
-- Name: idx_testimonials_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_testimonials_deleted_at ON public.testimonials USING btree (deleted_at);


--
-- Name: idx_testimonials_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_testimonials_status ON public.testimonials USING btree (status);


--
-- Name: idx_testimonials_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_testimonials_user_id ON public.testimonials USING btree (user_id);


--
-- Name: idx_tq_q; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tq_q ON public.tryout_questions USING btree (question_id);


--
-- Name: idx_tryout_attempts_score; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tryout_attempts_score ON public.tryout_attempts USING btree (score);


--
-- Name: idx_tryout_attempts_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tryout_attempts_status ON public.tryout_attempts USING btree (status);


--
-- Name: idx_tryout_attempts_tryout; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tryout_attempts_tryout ON public.tryout_attempts USING btree (tryout_id);


--
-- Name: idx_tryout_attempts_tryout_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tryout_attempts_tryout_id ON public.tryout_attempts USING btree (tryout_id);


--
-- Name: idx_tryout_attempts_tryout_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tryout_attempts_tryout_status ON public.tryout_attempts USING btree (tryout_id, status);


--
-- Name: idx_tryout_attempts_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tryout_attempts_user ON public.tryout_attempts USING btree (user_id);


--
-- Name: idx_tryout_attempts_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tryout_attempts_user_id ON public.tryout_attempts USING btree (user_id);


--
-- Name: idx_tryouts_created_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tryouts_created_by ON public.tryouts USING btree (created_by);


--
-- Name: idx_tryouts_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tryouts_deleted_at ON public.tryouts USING btree (deleted_at);


--
-- Name: idx_tryouts_jenjang; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tryouts_jenjang ON public.tryouts USING btree (jenjang);


--
-- Name: idx_tryouts_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tryouts_status ON public.tryouts USING btree (status);


--
-- Name: idx_tryouts_status_jenjang; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tryouts_status_jenjang ON public.tryouts USING btree (status, jenjang);


--
-- Name: idx_tutorials_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tutorials_category ON public.tutorials USING btree (category);


--
-- Name: idx_tutorials_created_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tutorials_created_by ON public.tutorials USING btree (created_by);


--
-- Name: idx_tutorials_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tutorials_deleted_at ON public.tutorials USING btree (deleted_at);


--
-- Name: idx_tutorials_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_tutorials_slug ON public.tutorials USING btree (slug);


--
-- Name: idx_tutorials_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tutorials_status ON public.tutorials USING btree (status);


--
-- Name: idx_users_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_deleted_at ON public.users USING btree (deleted_at);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: documentation documentation_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documentation
    ADD CONSTRAINT documentation_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: documentation documentation_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documentation
    ADD CONSTRAINT documentation_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);


--
-- Name: files files_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: attempt_questions fk_attempt_questions_question; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attempt_questions
    ADD CONSTRAINT fk_attempt_questions_question FOREIGN KEY (question_id) REFERENCES public.questions(id);


--
-- Name: competency_evaluations fk_competency_evaluations_competency; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.competency_evaluations
    ADD CONSTRAINT fk_competency_evaluations_competency FOREIGN KEY (competency_id) REFERENCES public.competencies(id);


--
-- Name: competency_evaluations fk_evaluations_competency_evaluations; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.competency_evaluations
    ADD CONSTRAINT fk_evaluations_competency_evaluations FOREIGN KEY (evaluation_id) REFERENCES public.evaluations(id) ON DELETE CASCADE;


--
-- Name: evaluations fk_evaluations_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evaluations
    ADD CONSTRAINT fk_evaluations_user FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: materials fk_learning_modules_materials; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materials
    ADD CONSTRAINT fk_learning_modules_materials FOREIGN KEY (module_id) REFERENCES public.learning_modules(id) ON DELETE CASCADE;


--
-- Name: learning_progresses fk_learning_progresses_material; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_progresses
    ADD CONSTRAINT fk_learning_progresses_material FOREIGN KEY (material_id) REFERENCES public.materials(id) ON DELETE CASCADE;


--
-- Name: learning_progresses fk_learning_progresses_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_progresses
    ADD CONSTRAINT fk_learning_progresses_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: material_attachments fk_material_attachments_file; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.material_attachments
    ADD CONSTRAINT fk_material_attachments_file FOREIGN KEY (file_id) REFERENCES public.file_records(id);


--
-- Name: material_attachments fk_materials_attachments; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.material_attachments
    ADD CONSTRAINT fk_materials_attachments FOREIGN KEY (material_id) REFERENCES public.materials(id) ON DELETE CASCADE;


--
-- Name: materials fk_materials_competency; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materials
    ADD CONSTRAINT fk_materials_competency FOREIGN KEY (competency_id) REFERENCES public.competencies(id);


--
-- Name: notifications fk_notifications_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: practice_answers fk_practice_answers_question; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.practice_answers
    ADD CONSTRAINT fk_practice_answers_question FOREIGN KEY (question_id) REFERENCES public.questions(id);


--
-- Name: practice_answers fk_practice_answers_selected_option; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.practice_answers
    ADD CONSTRAINT fk_practice_answers_selected_option FOREIGN KEY (selected_option_id) REFERENCES public.question_options(id);


--
-- Name: practice_package_questions fk_practice_package_questions_practice_package; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.practice_package_questions
    ADD CONSTRAINT fk_practice_package_questions_practice_package FOREIGN KEY (package_id) REFERENCES public.practice_packages(id);


--
-- Name: practice_package_questions fk_practice_package_questions_question; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.practice_package_questions
    ADD CONSTRAINT fk_practice_package_questions_question FOREIGN KEY (question_id) REFERENCES public.questions(id);


--
-- Name: practice_packages fk_practice_packages_competency; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.practice_packages
    ADD CONSTRAINT fk_practice_packages_competency FOREIGN KEY (competency_id) REFERENCES public.competencies(id);


--
-- Name: practice_answers fk_practices_answers; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.practice_answers
    ADD CONSTRAINT fk_practices_answers FOREIGN KEY (practice_id) REFERENCES public.practices(id) ON DELETE CASCADE;


--
-- Name: practices fk_practices_competency; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.practices
    ADD CONSTRAINT fk_practices_competency FOREIGN KEY (competency_id) REFERENCES public.competencies(id);


--
-- Name: practices fk_practices_package; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.practices
    ADD CONSTRAINT fk_practices_package FOREIGN KEY (package_id) REFERENCES public.practice_packages(id);


--
-- Name: practices fk_practices_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.practices
    ADD CONSTRAINT fk_practices_user FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: question_competencies fk_question_competencies_competency; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question_competencies
    ADD CONSTRAINT fk_question_competencies_competency FOREIGN KEY (competency_id) REFERENCES public.competencies(id);


--
-- Name: question_competencies fk_question_competencies_question; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question_competencies
    ADD CONSTRAINT fk_question_competencies_question FOREIGN KEY (question_id) REFERENCES public.questions(id);


--
-- Name: question_explanations fk_questions_explanation; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question_explanations
    ADD CONSTRAINT fk_questions_explanation FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;


--
-- Name: question_options fk_questions_options; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question_options
    ADD CONSTRAINT fk_questions_options FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;


--
-- Name: questions fk_questions_type; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT fk_questions_type FOREIGN KEY (question_type_id) REFERENCES public.question_types(id);


--
-- Name: recommendations fk_recommendations_competency; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recommendations
    ADD CONSTRAINT fk_recommendations_competency FOREIGN KEY (competency_id) REFERENCES public.competencies(id);


--
-- Name: recommendations fk_recommendations_material; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recommendations
    ADD CONSTRAINT fk_recommendations_material FOREIGN KEY (material_id) REFERENCES public.materials(id);


--
-- Name: role_permissions fk_role_permissions_permission; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT fk_role_permissions_permission FOREIGN KEY (permission_id) REFERENCES public.permissions(id);


--
-- Name: role_permissions fk_role_permissions_role; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT fk_role_permissions_role FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: questions fk_stimulus_questions; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT fk_stimulus_questions FOREIGN KEY (stimulus_id) REFERENCES public.stimulus(id);


--
-- Name: student_answers fk_student_answers_question; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_answers
    ADD CONSTRAINT fk_student_answers_question FOREIGN KEY (question_id) REFERENCES public.questions(id);


--
-- Name: student_answers fk_student_answers_selected_option; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_answers
    ADD CONSTRAINT fk_student_answers_selected_option FOREIGN KEY (selected_option_id) REFERENCES public.question_options(id);


--
-- Name: student_profiles fk_student_profiles_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_profiles
    ADD CONSTRAINT fk_student_profiles_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: student_answers fk_tryout_attempts_answers; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_answers
    ADD CONSTRAINT fk_tryout_attempts_answers FOREIGN KEY (attempt_id) REFERENCES public.tryout_attempts(id) ON DELETE CASCADE;


--
-- Name: attempt_questions fk_tryout_attempts_attempt_questions; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attempt_questions
    ADD CONSTRAINT fk_tryout_attempts_attempt_questions FOREIGN KEY (attempt_id) REFERENCES public.tryout_attempts(id) ON DELETE CASCADE;


--
-- Name: tryout_attempts fk_tryout_attempts_tryout; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tryout_attempts
    ADD CONSTRAINT fk_tryout_attempts_tryout FOREIGN KEY (tryout_id) REFERENCES public.tryouts(id);


--
-- Name: tryout_attempts fk_tryout_attempts_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tryout_attempts
    ADD CONSTRAINT fk_tryout_attempts_user FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: tryout_questions fk_tryout_questions_question; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tryout_questions
    ADD CONSTRAINT fk_tryout_questions_question FOREIGN KEY (question_id) REFERENCES public.questions(id);


--
-- Name: tryout_questions fk_tryout_questions_tryout; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tryout_questions
    ADD CONSTRAINT fk_tryout_questions_tryout FOREIGN KEY (tryout_id) REFERENCES public.tryouts(id);


--
-- Name: student_profiles fk_users_student_profile; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_profiles
    ADD CONSTRAINT fk_users_student_profile FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: learning_progress learning_progress_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_progress
    ADD CONSTRAINT learning_progress_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.materials(id) ON DELETE CASCADE;


--
-- Name: learning_progress learning_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_progress
    ADD CONSTRAINT learning_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict aU0o6xgYI2Acsq3W6DvEA4QYPahTP819ocdWOk5Wc8z6LkgKou2DAHUfWQnn5Fw

