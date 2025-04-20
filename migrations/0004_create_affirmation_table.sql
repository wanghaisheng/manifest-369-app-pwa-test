-- Migration: 0004_create_affirmation_table
-- Description: Creates the affirmation table for the 369 Manifestation App

-- Drop the table if it exists
DROP TABLE IF EXISTS "affirmation";

-- Create the affirmation table
CREATE TABLE "affirmation" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "user_id" TEXT NOT NULL,
  "text" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "duration_days" INTEGER NOT NULL DEFAULT 33,
  "current_day" INTEGER NOT NULL DEFAULT 1,
  "is_active" INTEGER NOT NULL DEFAULT 1,
  "is_completed" INTEGER NOT NULL DEFAULT 0,
  "created_at" INTEGER NOT NULL DEFAULT (unixepoch()),
  "updated_at" INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "affirmation_user_id_idx" ON "affirmation" ("user_id");
CREATE INDEX IF NOT EXISTS "affirmation_category_idx" ON "affirmation" ("category");
CREATE INDEX IF NOT EXISTS "affirmation_is_active_idx" ON "affirmation" ("is_active");
