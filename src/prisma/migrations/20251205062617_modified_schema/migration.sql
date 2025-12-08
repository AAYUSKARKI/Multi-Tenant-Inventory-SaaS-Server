/*
  Warnings:

  - A unique constraint covering the columns `[tenantId,email]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "stock_movements" DROP CONSTRAINT "stock_movements_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "warehouses" DROP CONSTRAINT "warehouses_tenantId_fkey";

-- DropIndex
DROP INDEX "items_sku_key";

-- DropIndex
DROP INDEX "items_tenantId_sku_idx";

-- DropIndex
DROP INDEX "stock_movements_tenantId_itemId_idx";

-- DropIndex
DROP INDEX "tenants_name_idx";

-- DropIndex
DROP INDEX "users_email_key";

-- DropIndex
DROP INDEX "users_tenantId_email_idx";

-- DropIndex
DROP INDEX "warehouses_tenantId_name_idx";

-- AlterTable
ALTER TABLE "items" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "stock_movements" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "reference" TEXT;

-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "refreshToken" TEXT;

-- AlterTable
ALTER TABLE "warehouses" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "description" TEXT;

-- CreateIndex
CREATE INDEX "stock_movements_tenantId_itemId_warehouseId_idx" ON "stock_movements"("tenantId", "itemId", "warehouseId");

-- CreateIndex
CREATE INDEX "stock_movements_tenantId_type_idx" ON "stock_movements"("tenantId", "type");

-- CreateIndex
CREATE INDEX "stock_movements_tenantId_createdAt_idx" ON "stock_movements"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "stock_movements_tenantId_itemId_type_idx" ON "stock_movements"("tenantId", "itemId", "type");

-- CreateIndex
CREATE INDEX "stock_movements_tenantId_warehouseId_type_idx" ON "stock_movements"("tenantId", "warehouseId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "users_tenantId_email_key" ON "users"("tenantId", "email");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
