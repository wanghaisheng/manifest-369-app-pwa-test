-- Migration: 0008_create_practice_session_table
-- Description: Creates the practice session table for the 369 Manifestation App

-- Drop the table if it exists
DROP TABLE IF EXISTS "practice_session";

-- Create the practice session table
CREATE TABLE "practice_session" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "user_id" TEXT NOT NULL,
  "affirmation_id" TEXT NOT NULL,
  "session_type" TEXT NOT NULL, -- 'morning', 'afternoon', 'evening'
  "session_index" INTEGER NOT NULL, -- 0-2 for morning, 0-5 for afternoon, 0-8 for evening
  "completed_at" INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
  FOREIGN KEY (affirmation_id) REFERENCES affirmation(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "practice_session_user_id_idx" ON "practice_session" ("user_id");
CREATE INDEX IF NOT EXISTS "practice_session_affirmation_id_idx" ON "practice_session" ("affirmation_id");
CREATE INDEX IF NOT EXISTS "practice_session_completed_at_idx" ON "practice_session" ("completed_at");
