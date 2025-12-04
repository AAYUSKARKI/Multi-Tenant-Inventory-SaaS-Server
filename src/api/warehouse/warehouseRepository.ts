import { prisma } from "@/common/lib/prisma";
import type { CreateWarehouse, Warehouse } from "./warehouseModel";

export class WarehouseRepository {
    async create(data: CreateWarehouse, tenantId: string): Promise<Warehouse> {
        return prisma.warehouse.create({
            data: { ...data, tenantId: tenantId },
        });
    }

    async findByIdAndTenant(warehouseId: string, tenantId: string): Promise<Warehouse | null> {
        return prisma.warehouse.findFirst({
            where: {
                id: warehouseId,
                tenantId: tenantId,
            },
        });
    }

    async findManyByTenant(tenantId: string): Promise<Warehouse[]> {
        return prisma.warehouse.findMany({
            where: {
                tenantId: tenantId,
            },
        });
    }
}