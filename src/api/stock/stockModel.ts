import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { MovementType } from "@/generated/prisma/enums";

extendZodWithOpenApi(z);

export const StockSchema = z.object({
    id: z.string().openapi({ description: "Unique identifier for the stock movement", example: "ckxyz1234567890abcdefg" }),
    tenantId: z.string().openapi({ description: "ID of the tenant to which the stock movement belongs", example: "ckxyz1234567890abcdefg" }),
    itemId: z.string().openapi({ description: "Unique identifier for the item", example: "ckxyz1234567890abcdefg" }),
    warehouseId: z.string().openapi({ description: "Unique identifier for the warehouse", example: "ckxyz1234567890abcdefg" }),
    quantity: z.number().openapi({ description: "Quantity of the item in the warehouse", example: 10 }),
    type: z.enum(MovementType).openapi({ description: "Type of the stock movement", example: "IN" }),
    createdAt: z.date().openapi({ description: "Timestamp when the stock movement was created", example: "2023-10-01T12:00:00Z" }),
    updatedAt: z.date().openapi({ description: "Timestamp when the stock movement was last updated", example: "2023-10-10T15:30:00Z" }),
})

export const CreateStockSchema = StockSchema.omit({ id: true, tenantId: true, createdAt: true, updatedAt: true }).openapi("CreateStock");

export const UpdateStockSchema = StockSchema.omit({ id: true, tenantId: true, createdAt: true, updatedAt: true }).openapi("UpdateStock");

export const StockResponseSchema = StockSchema.omit({ tenantId: true }).openapi("StockResponse");

export type Stock = z.infer<typeof StockSchema>;
export type CreateStock = z.infer<typeof CreateStockSchema>;
export type UpdateStock = z.infer<typeof UpdateStockSchema>;
export type StockResponse = z.infer<typeof StockResponseSchema>;
