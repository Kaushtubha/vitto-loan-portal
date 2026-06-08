-- Enable UUID extension if not enabled (often enabled by default on Neon/Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create LoanStatus Enum
CREATE TYPE "LoanStatus" AS ENUM ('pending', 'approved', 'rejected');

-- Create applications table
CREATE TABLE "applications" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "applicant_name" VARCHAR(255) NOT NULL,
    "mobile_number" VARCHAR(15) NOT NULL,
    "loan_amount" DECIMAL(12, 2) NOT NULL,
    "loan_purpose" TEXT NOT NULL,
    "preferred_language" VARCHAR(50) NOT NULL,
    "status" "LoanStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
