-- CreateEnum
CREATE TYPE "SCHEMA"."monitor_type" AS ENUM ('http', 'https', 'ping', 'tcp');

-- CreateEnum
CREATE TYPE "SCHEMA"."status" AS ENUM ('up', 'down', 'warning', 'unknown');

-- CreateEnum
CREATE TYPE "SCHEMA"."severity" AS ENUM ('critical', 'warning', 'info');

-- CreateEnum
CREATE TYPE "SCHEMA"."alert_status" AS ENUM ('active', 'resolved', 'acknowledged');

-- CreateTable
CREATE TABLE "SCHEMA"."sessions" (
    "sid" VARCHAR(255) NOT NULL,
    "sess" JSONB NOT NULL,
    "expire" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("sid")
);

-- CreateTable
CREATE TABLE "SCHEMA"."users" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255),
    "senha" VARCHAR(255),
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(255),
    "profile_image_url" VARCHAR(255),
    "role" VARCHAR(50) NOT NULL DEFAULT 'viewer',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SCHEMA"."systems" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "url" TEXT NOT NULL,
    "monitor_type" "SCHEMA"."monitor_type" NOT NULL,
    "check_interval" INTEGER NOT NULL DEFAULT 60,
    "timeout" INTEGER NOT NULL DEFAULT 30,
    "status" "SCHEMA"."status" NOT NULL DEFAULT 'unknown',
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "alert_email" VARCHAR(255),
    "description" TEXT,
    "created_by" TEXT,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "systems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SCHEMA"."status_logs" (
    "id" TEXT NOT NULL,
    "system_id" TEXT NOT NULL,
    "status" "SCHEMA"."status" NOT NULL,
    "response_time" INTEGER,
    "status_code" INTEGER,
    "error_message" TEXT,
    "checked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "status_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SCHEMA"."alerts" (
    "id" TEXT NOT NULL,
    "system_id" TEXT NOT NULL,
    "severity" "SCHEMA"."severity" NOT NULL,
    "status" "SCHEMA"."alert_status" NOT NULL DEFAULT 'active',
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "acknowledged_by" TEXT,
    "acknowledged_at" TIMESTAMP(3),
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SCHEMA"."sla_configs" (
    "id" TEXT NOT NULL,
    "system_id" TEXT NOT NULL,
    "uptime_target" DOUBLE PRECISION NOT NULL DEFAULT 99.9,
    "response_time_target" INTEGER NOT NULL DEFAULT 1000,
    "alert_on_sla_violation" BOOLEAN NOT NULL DEFAULT true,
    "alert_threshold_minutes" INTEGER NOT NULL DEFAULT 5,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sla_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SCHEMA"."sla_reports" (
    "id" TEXT NOT NULL,
    "system_id" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "total_checks" INTEGER NOT NULL DEFAULT 0,
    "successful_checks" INTEGER NOT NULL DEFAULT 0,
    "uptime_percentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "average_response_time" DOUBLE PRECISION,
    "total_downtime" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sla_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SCHEMA"."audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "action" VARCHAR(255) NOT NULL,
    "object_type" VARCHAR(100),
    "object_id" TEXT,
    "details" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IDX_session_expire" ON "SCHEMA"."sessions"("expire");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "SCHEMA"."users"("email");

-- CreateIndex
CREATE INDEX "IDX_status_logs_checked_at" ON "SCHEMA"."status_logs"("checked_at");

-- CreateIndex
CREATE INDEX "IDX_alerts_status" ON "SCHEMA"."alerts"("status");

-- CreateIndex
CREATE UNIQUE INDEX "sla_configs_system_id_key" ON "SCHEMA"."sla_configs"("system_id");

-- CreateIndex
CREATE INDEX "IDX_sla_reports_created_at" ON "SCHEMA"."sla_reports"("created_at");

-- AddForeignKey
ALTER TABLE "SCHEMA"."systems" ADD CONSTRAINT "systems_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "SCHEMA"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SCHEMA"."systems" ADD CONSTRAINT "systems_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "SCHEMA"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SCHEMA"."status_logs" ADD CONSTRAINT "status_logs_system_id_fkey" FOREIGN KEY ("system_id") REFERENCES "SCHEMA"."systems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SCHEMA"."alerts" ADD CONSTRAINT "alerts_system_id_fkey" FOREIGN KEY ("system_id") REFERENCES "SCHEMA"."systems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SCHEMA"."alerts" ADD CONSTRAINT "alerts_acknowledged_by_fkey" FOREIGN KEY ("acknowledged_by") REFERENCES "SCHEMA"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SCHEMA"."sla_configs" ADD CONSTRAINT "sla_configs_system_id_fkey" FOREIGN KEY ("system_id") REFERENCES "SCHEMA"."systems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SCHEMA"."sla_reports" ADD CONSTRAINT "sla_reports_system_id_fkey" FOREIGN KEY ("system_id") REFERENCES "SCHEMA"."systems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SCHEMA"."audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "SCHEMA"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
