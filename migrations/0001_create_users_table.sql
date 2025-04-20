-- Better Auth User Table Schema: https://better-auth.vercel.app/docs/database-schema
-- Migration: 0001_create_users_table
-- Description: Creates the user table for authentication

-- Drop the table if it exists
DROP TABLE IF EXISTS "user";

-- Create the user table
CREATE TABLE "user" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "name" TEXT,
  "email" TEXT UNIQUE,
  "email_verified" INTEGER,
  "image" TEXT,
  "created_at" INTEGER NOT NULL DEFAULT (unixepoch()),
  "updated_at" INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "user_email_idx" ON "user" ("email");
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "user" ("id");
