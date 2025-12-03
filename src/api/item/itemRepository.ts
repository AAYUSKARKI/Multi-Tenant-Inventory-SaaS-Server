import { prisma } from "@/common/lib/prisma";
import type { CreateItem, Item } from "./itemModel";

export class ItemRepository {
    async create(data: CreateItem,tenantId: string): Promise<Item> {
        const item = await prisma.item.create({ 
            data: { ...data, tenantId: tenantId }
         });
        return item;
    }

    async findByName(name: string, tenantId: string): Promise<Item | null> {
        const item = await prisma.item.findFirst({ where: { name: name, tenantId: tenantId } });
        return item;
    }
    
}