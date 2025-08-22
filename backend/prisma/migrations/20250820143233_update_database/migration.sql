/*
  Warnings:

  - Made the column `alert_email` on table `systems` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `systems` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `senha` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `first_name` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `last_name` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "SCHEMA"."systems" ALTER COLUMN "alert_email" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "SCHEMA"."users" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "senha" SET NOT NULL,
ALTER COLUMN "first_name" SET NOT NULL,
ALTER COLUMN "last_name" SET NOT NULL;
