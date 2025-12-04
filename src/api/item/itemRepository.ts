import { prisma } from "@/common/lib/prisma";
import type { CreateItem, Item, UpdateItem } from "./itemModel";

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

    async findByIdAndTenant(itemId: string, tenantId: string): Promise<Item | null> {
        const item = await prisma.item.findFirst({ where: { id: itemId, tenantId: tenantId } });
        return item;
    }
    
    async findManyByTenant(tenantId: string): Promise<Item[]> {
        const items = await prisma.item.findMany({ where: { tenantId: tenantId } });
        return items;
    }

    async update(itemId: string, data: UpdateItem, tenantId: string): Promise<Item> {
        const item = await prisma.item.update({
            where: { id: itemId, tenantId: tenantId },
            data: data,
        });
        return item;
    }

    async delete(itemId: string, tenantId: string): Promise<void> {
        await prisma.item.deleteMany({ where: { id: itemId, tenantId: tenantId } });
    }

}