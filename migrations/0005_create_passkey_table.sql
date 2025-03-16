-- Better Auth Passkey Table Schema
-- Migration: 0005_create_passkey_table
-- Description: Creates the passkey table for passwordless authentication

-- Drop the table if it exists
DROP TABLE IF EXISTS "passkey";

-- Create the passkey table
CREATE TABLE "passkey" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "user_id" TEXT NOT NULL,
  "name" TEXT,
  "public_key" TEXT NOT NULL,
  "counter" INTEGER NOT NULL,
  "transports" TEXT,
  "created_at" INTEGER NOT NULL DEFAULT (unixepoch()),
  "updated_at" INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "passkey_user_id_idx" ON "passkey" ("user_id");
