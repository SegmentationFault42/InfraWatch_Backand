/*
  Warnings:

  - A unique constraint covering the columns `[systemId]` on the table `SLAConfig` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SLAConfig_systemId_key" ON "public"."SLAConfig"("systemId");
