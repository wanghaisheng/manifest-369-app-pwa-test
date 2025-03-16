-- Better Auth Verification Token Table Schema
-- Migration: 0003_create_verification_token_table
-- Description: Creates the verification token table for email verification

-- Drop the table if it exists
DROP TABLE IF EXISTS "verification_token";

-- Create the verification token table
CREATE TABLE "verification_token" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expires_at" INTEGER NOT NULL,
  PRIMARY KEY ("identifier", "token")
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "verification_token_expires_at_idx" ON "verification_token" ("expires_at");
