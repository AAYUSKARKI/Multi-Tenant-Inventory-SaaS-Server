import { prisma } from "@/common/lib/prisma";
import type { CreateStock, Stock } from "./stockModel";

export class StockRepository {
    async create(data: CreateStock, tenantId: string): Promise<Stock> {
        return prisma.stockMovement.create({
            data: { ...data, tenantId: tenantId },
        });
    }

    async findByIdAndTenant(stockId: string, tenantId: string): Promise<Stock | null> {
        return prisma.stockMovement.findFirst({
            where: { id: stockId, tenantId: tenantId },
        });
    }

    async findAll(tenantId: string): Promise<Stock[]> {
        return prisma.stockMovement.findMany({ where: { tenantId: tenantId } });
    }

    async update(stockId: string, data: CreateStock, tenantId: string): Promise<Stock> {
        return prisma.stockMovement.update({
            where: { id: stockId, tenantId: tenantId },
            data: data,
        });
    }

    async delete(stockId: string, tenantId: string): Promise<void> {
        await prisma.stockMovement.delete({ where: { id: stockId, tenantId: tenantId } });
    }
}