-- CreateEnum
CREATE TYPE "SCHEMA"."status" AS ENUM ('up', 'down', 'warning', 'unknown');

-- CreateEnum
CREATE TYPE "SCHEMA"."MonitorType" AS ENUM ('PING', 'API', 'SNMP', 'WEBHOOK');

-- CreateEnum
CREATE TYPE "SCHEMA"."severity" AS ENUM ('critical', 'warning', 'info');

-- CreateEnum
CREATE TYPE "SCHEMA"."alert_status" AS ENUM ('pending', 'resolved', 'canceled');

-- CreateTable
CREATE TABLE "SCHEMA"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SCHEMA"."Role" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SCHEMA"."System" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "status" "SCHEMA"."status" NOT NULL DEFAULT 'unknown',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "System_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SCHEMA"."Monitor" (
    "id" TEXT NOT NULL,
    "type" "SCHEMA"."MonitorType" NOT NULL,
    "config" JSONB NOT NULL,
    "interval" INTEGER,
    "systemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Monitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SCHEMA"."SlaReport" (
    "id" TEXT NOT NULL,
    "systemId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "uptimePct" DOUBLE PRECISION NOT NULL,
    "downtime" INTEGER NOT NULL,
    "incidents" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SlaReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SCHEMA"."alerts" (
    "id" TEXT NOT NULL,
    "systemId" TEXT NOT NULL,
    "severity" "SCHEMA"."severity" NOT NULL,
    "status" "SCHEMA"."alert_status" NOT NULL DEFAULT 'pending',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SCHEMA"."audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "object_type" TEXT,
    "object_id" TEXT,
    "details" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "SCHEMA"."User"("email");

-- AddForeignKey
ALTER TABLE "SCHEMA"."User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "SCHEMA"."Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SCHEMA"."Monitor" ADD CONSTRAINT "Monitor_systemId_fkey" FOREIGN KEY ("systemId") REFERENCES "SCHEMA"."System"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SCHEMA"."SlaReport" ADD CONSTRAINT "SlaReport_systemId_fkey" FOREIGN KEY ("systemId") REFERENCES "SCHEMA"."System"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SCHEMA"."alerts" ADD CONSTRAINT "alerts_systemId_fkey" FOREIGN KEY ("systemId") REFERENCES "SCHEMA"."System"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SCHEMA"."audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "SCHEMA"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
