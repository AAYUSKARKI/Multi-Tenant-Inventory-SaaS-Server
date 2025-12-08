import { prisma } from "@/common/lib/prisma";
import type { CreateStock, Stock, StockBalanceResponse, StockQueryParams, StockResponse } from "./stockModel";

export class StockRepository {
    async create(data: CreateStock, tenantId: string): Promise<Stock> {
        return prisma.stockMovement.create({
            data: { ...data, tenantId: tenantId },
        });
    }

    async findByIdAndTenant(stockId: string, tenantId: string): Promise<Stock | null> {
        return prisma.stockMovement.findFirst({
            where: { id: stockId, tenantId: tenantId },
        });
    }

    async getStockBalance(params: StockQueryParams,tenantId: string): Promise<StockBalanceResponse[]> {
  const { itemId, warehouseId, sku, offset = 0, limit = 20 } = params;

  // Common filter
  const where = {
    tenantId,
    deletedAt: null,
    ...(itemId && { itemId }),
    ...(warehouseId && { warehouseId }),
    ...(sku && {
      item: {
        sku: { contains: sku, mode: "insensitive" as const },
      },
    }),
  };

  // IN / OUT queries in parallel
  const [inMovements, outMovements] = await Promise.all([
    prisma.stockMovement.groupBy({
      by: ["itemId", "warehouseId"],
      where: { ...where, type: "IN" },
      _sum: { quantity: true },
      _max: { createdAt: true },
    }),
    prisma.stockMovement.groupBy({
      by: ["itemId", "warehouseId"],
      where: { ...where, type: "OUT" },
      _sum: { quantity: true },
      _max: { createdAt: true },
    }),
  ]);

  // Merge balances
  const balanceMap = new Map<
    string,
    { itemId: string; warehouseId: string; balance: number; lastMovementAt: Date | null }
  >();

  for (const m of inMovements) {
    const key = `${m.itemId}-${m.warehouseId}`;
    balanceMap.set(key, {
      itemId: m.itemId,
      warehouseId: m.warehouseId,
      balance: m._sum.quantity ?? 0,
      lastMovementAt: m._max.createdAt,
    });
  }

  for (const m of outMovements) {
    const key = `${m.itemId}-${m.warehouseId}`;
    const existing = balanceMap.get(key);

    if (existing) {
      existing.balance -= m._sum.quantity ?? 0;

      if (!existing.lastMovementAt || existing.lastMovementAt < m._max.createdAt!) {
        existing.lastMovementAt = m._max.createdAt;
      }
    } else {
      balanceMap.set(key, {
        itemId: m.itemId,
        warehouseId: m.warehouseId,
        balance: -(m._sum.quantity ?? 0),
        lastMovementAt: m._max.createdAt,
      });
    }
  }

  const entries = Array.from(balanceMap.values());

  // Fetch metadata in batches
  const itemIds = entries.map(e => e.itemId);
  const warehouseIds = entries.map(e => e.warehouseId);

  const [items, warehouses] = await Promise.all([
    prisma.item.findMany({
      where: { id: { in: itemIds }, tenantId },
      select: { id: true, sku: true, name: true, description: true },
    }),
    prisma.warehouse.findMany({
      where: { id: { in: warehouseIds }, tenantId },
      select: { id: true, name: true },
    }),
  ]);

  const itemMap = new Map(items.map(i => [i.id, i]));
  const warehouseMap = new Map(warehouses.map(w => [w.id, w]));

  // Final build
  const result = entries.map(entry => {
    const item = itemMap.get(entry.itemId);
    const warehouse = warehouseMap.get(entry.warehouseId);

    return {
      itemId: entry.itemId,
      sku: item?.sku ?? "Unknown",
      itemName: item?.name ?? "Unknown Item",
      itemDescription: item?.description ?? null,
      warehouseId: entry.warehouseId,
      warehouseName: warehouse?.name ?? "Unknown Warehouse",
      balance: entry.balance, // keep real balance
      lastMovementAt: entry.lastMovementAt,
    };
  });

  // ORDER BY balance DESC, itemName
  return result
    .sort((a, b) => b.balance - a.balance || a.itemName.localeCompare(b.itemName))
    .slice(offset, offset + limit);
}



    async findAll(tenantId: string): Promise<Stock[]> {
        return prisma.stockMovement.findMany({ where: { tenantId: tenantId } });
    }

    async update(stockId: string, data: CreateStock, tenantId: string): Promise<Stock> {
        return prisma.stockMovement.update({
            where: { id: stockId, tenantId: tenantId },
            data: data,
        });
    }

    async delete(stockId: string, tenantId: string): Promise<void> {
        await prisma.stockMovement.delete({ where: { id: stockId, tenantId: tenantId } });
    }
}