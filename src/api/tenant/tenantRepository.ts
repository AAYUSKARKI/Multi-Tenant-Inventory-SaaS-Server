import { prisma } from "@/common/lib/prisma";
import type { CreateTenant, Tenant } from "./tenantModel";

export class TenantRepository {
    async create(data: CreateTenant): Promise<Tenant> {
        return await prisma.tenant.create({
            data,
        });
    }

    async findByName(name: string): Promise<Tenant | null> {
        return await prisma.tenant.findUnique({
            where: { name },
        });
    }

    async findAll(): Promise<Tenant[]> {
        return await prisma.tenant.findMany();
    }

    async findById(id: string): Promise<Tenant | null> {
        return await prisma.tenant.findUnique({
            where: { id },
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.tenant.delete({
            where: { id },
        });
    }

    async update(id: string, data: CreateTenant): Promise<Tenant> {
        return await prisma.tenant.update({
            where: { id },
            data,
        });
    }
}