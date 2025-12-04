import { prisma } from "@/common/lib/prisma";
import type { CreateStock, Stock } from "./stockModel";

export class StockRepository {
    async create(data: CreateStock, tenantId: string): Promise<Stock> {
        return prisma.stockMovement.create({
            data: { ...data, tenantId: tenantId },
        });
    }
}