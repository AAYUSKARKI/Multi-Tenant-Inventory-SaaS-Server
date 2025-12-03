import { prisma } from "@/common/lib/prisma";
import type { CreateUser } from "./userModel";
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

    async findAll(): Promise<User[]> {
        return prisma.user.findMany(); 
    }
}