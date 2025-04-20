-- Migration: 0005_create_daily_task_table
-- Description: Creates the daily task table for the 369 Manifestation App

-- Drop the table if it exists
DROP TABLE IF EXISTS "daily_task";

-- Create the daily task table
CREATE TABLE "daily_task" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "user_id" TEXT NOT NULL,
  "affirmation_id" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "method" TEXT NOT NULL DEFAULT 'Typing',
  "is_completed" INTEGER NOT NULL DEFAULT 0,
  "created_at" INTEGER NOT NULL DEFAULT (unixepoch()),
  "updated_at" INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
  FOREIGN KEY (affirmation_id) REFERENCES affirmation(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "daily_task_user_id_idx" ON "daily_task" ("user_id");
CREATE INDEX IF NOT EXISTS "daily_task_affirmation_id_idx" ON "daily_task" ("affirmation_id");
CREATE INDEX IF NOT EXISTS "daily_task_is_completed_idx" ON "daily_task" ("is_completed");
CREATE INDEX IF NOT EXISTS "daily_task_order_idx" ON "daily_task" ("order");
