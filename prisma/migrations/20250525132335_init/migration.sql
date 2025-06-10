/*
  Warnings:

  - The values [PENDING,ACTIVE,USED,EXPIRED,CANCELLED] on the enum `TiketStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `expired_at` on the `Tiket` table. All the data in the column will be lost.
  - You are about to drop the column `used_at` on the `Tiket` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TiketStatus_new" AS ENUM ('AVAILABLE', 'SOLD');
ALTER TABLE "Tiket" ALTER COLUMN "status" TYPE "TiketStatus_new" USING ("status"::text::"TiketStatus_new");
ALTER TYPE "TiketStatus" RENAME TO "TiketStatus_old";
ALTER TYPE "TiketStatus_new" RENAME TO "TiketStatus";
DROP TYPE "TiketStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Tiket" DROP COLUMN "expired_at",
DROP COLUMN "used_at";
