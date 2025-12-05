import { prisma } from "@/common/lib/prisma";
import type { CreateUser, TenantByEmail, UpdateUser } from "./userModel";
import type { User } from "./userModel";
import { Jwt } from "jsonwebtoken";
import cache from "memory-cache";

export class UserRepository {
    async findByEmailOnTenant(email: string, tenantId: string): Promise<User | null> {
        return prisma.user.findUnique({ where: {
            tenantId_email: {
                email,
                tenantId
            }
        } }); 
    }

    async findTenantByEmail(email: string): Promise<TenantByEmail[] | null> {
        const users = await prisma.user.findMany({
            where: {
                email,
                deletedAt: null
            },
            select: {
                tenant: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            take: 10,
            orderBy: {
                tenant: {
                    name: 'asc'
                }
            }
        });
        
       const tenantByEmail = users.map((user) => ({
            id: user.tenant.id,
            name: user.tenant.name
        }));
        return tenantByEmail;
    }

    async findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { id } }); 
    }

    async create(data: CreateUser): Promise<User> {
        return prisma.user.create({ data }); 
    }

    async updateRefreshToken(userId: string,tenantId: string, refreshToken: string): Promise<void> {
        await prisma.user.update({
            where: {
                id: userId,
                tenantId
            },
            data: {
                refreshToken
            }
        });
    }

    async findAll(tenantId: string): Promise<User[]> {
        return prisma.user.findMany({
            where: {
                tenantId
            }
        }); 
    }

    async update(userId: string, data: UpdateUser, tenantId: string): Promise<User> {
        return prisma.user.update({
            where: {
                id: userId,
                tenantId
            },
            data: data,
        }); 
    }

    async delete(userId: string, tenantId: string): Promise<void> {
        await prisma.user.deleteMany({
            where: {
                id: userId,
                tenantId
            }
        }); 
    }

    async findByIdAndTenant(userId: string, tenantId: string): Promise<User | null> {
        return prisma.user.findFirst({
            where: {
                id: userId,
                tenantId
            }
        }); 
    }
}