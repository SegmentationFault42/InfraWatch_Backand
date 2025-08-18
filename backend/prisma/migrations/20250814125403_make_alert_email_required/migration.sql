/*
  Warnings:

  - Made the column `alert_email` on table `systems` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `systems` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by` on table `systems` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `systems` DROP FOREIGN KEY `systems_created_by_fkey`;

-- DropIndex
DROP INDEX `systems_created_by_fkey` ON `systems`;

-- AlterTable
ALTER TABLE `systems` MODIFY `alert_email` VARCHAR(191) NOT NULL,
    MODIFY `description` VARCHAR(191) NOT NULL,
    MODIFY `created_by` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `systems` ADD CONSTRAINT `systems_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
