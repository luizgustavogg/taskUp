/*
  Warnings:

  - You are about to drop the column `Status` on the `tarefa` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tarefa` DROP COLUMN `Status`,
    ADD COLUMN `prazo` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'Pendente';
