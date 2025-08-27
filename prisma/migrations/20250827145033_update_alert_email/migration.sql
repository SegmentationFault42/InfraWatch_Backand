/*
  Warnings:

  - Made the column `alert_email` on table `System` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."System" ALTER COLUMN "alert_email" SET NOT NULL;
