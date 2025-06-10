/*
  Warnings:

  - The values [BOOKED,CANCELLED] on the enum `TiketStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `invoice_id` on the `Pembayaran` table. All the data in the column will be lost.

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
ALTER TABLE "Pembayaran" DROP COLUMN "invoice_id";
