import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const WarehouseSchema = z.object({
    id: z.string().openapi({ description: "Unique identifier for the warehouse", example: "ckxyz1234567890abcdefg" }),
    tenantId: z.string().openapi({ description: "ID of the tenant to which the warehouse belongs", example: "ckxyz1234567890abcdefg" }),
    name: z.string().openapi({ description: "Name of the warehouse", example: "Warehouse A" }),
    createdAt: z.date().openapi({ description: "Timestamp when the warehouse was created", example: "2023-10-01T12:00:00Z" }),
    updatedAt: z.date().openapi({ description: "Timestamp when the warehouse was last updated", example: "2023-10-10T15:30:00Z" }),
})

export const CreateWarehouseSchema = WarehouseSchema.omit({ id: true, tenantId: true, createdAt: true, updatedAt: true }).openapi("CreateWarehouse");

export const UpdateWarehouseSchema = WarehouseSchema.omit({ id: true, tenantId: true, createdAt: true, updatedAt: true }).openapi("UpdateWarehouse");

export const WarehouseResponseSchema = WarehouseSchema.omit({ tenantId: true }).openapi("WarehouseResponse");

export type Warehouse = z.infer<typeof WarehouseSchema>;
export type CreateWarehouse = z.infer<typeof CreateWarehouseSchema>;
export type UpdateWarehouse = z.infer<typeof UpdateWarehouseSchema>;
export type WarehouseResponse = z.infer<typeof WarehouseResponseSchema>;