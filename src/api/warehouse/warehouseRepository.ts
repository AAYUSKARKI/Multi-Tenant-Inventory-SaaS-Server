import { prisma } from "@/common/lib/prisma";
import type { CreateWarehouse, Warehouse } from "./warehouseModel";

export class WarehouseRepository {
    async create(data: CreateWarehouse, tenantId: string): Promise<Warehouse> {
        return prisma.warehouse.create({
            data: { ...data, tenantId: tenantId },
        });
    }
}