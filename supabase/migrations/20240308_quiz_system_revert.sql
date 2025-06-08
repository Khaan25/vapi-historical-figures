-- Drop tables (in reverse order of creation to handle dependencies)
DROP TABLE IF EXISTS transcripts;
DROP TABLE IF EXISTS quiz_responses;
DROP TABLE IF EXISTS quiz_questions;
DROP TABLE IF EXISTS quiz_sessions;

-- Drop enums
DROP TYPE IF EXISTS role_type;
DROP TYPE IF EXISTS difficulty_type;
DROP TYPE IF EXISTS mood_type;

-- Note: The historicalFigures table is preserved intentionally
