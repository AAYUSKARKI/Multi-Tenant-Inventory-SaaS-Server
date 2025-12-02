import { prisma } from "@/common/lib/prisma";
import type { CreateTenant, Tenant } from "./tenantModel";

export class TenantRepository {
    async create(data: CreateTenant): Promise<Tenant> {
        return await prisma.tenant.create({
            data,
        });
    }
}