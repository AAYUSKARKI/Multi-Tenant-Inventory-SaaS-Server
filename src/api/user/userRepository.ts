import { prisma } from "@/common/lib/prisma";
import type { CreateUser, UpdateUser } from "./userModel";
import type { User } from "./userModel";

export class UserRepository {
    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { email } }); 
    }

    async findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { id } }); 
    }

    async create(data: CreateUser): Promise<User> {
        return prisma.user.create({ data }); 
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