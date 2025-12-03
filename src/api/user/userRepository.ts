import { prisma } from "@/common/lib/prisma";
import type { CreateUser } from "./userModel";
import type { User } from "./userModel";

export class UserRepository {
    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { email } }); 
    }

    async create(data: CreateUser): Promise<User> {
        return prisma.user.create({ data }); 
    }
}