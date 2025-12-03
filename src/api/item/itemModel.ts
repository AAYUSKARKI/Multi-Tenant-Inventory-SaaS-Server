import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const ItemSchema = z.object({
    id: z.string().openapi({ description: "Unique identifier for the item", example: "ckxyz1234567890abcdefg" }),
    tenantId: z.string().openapi({ description: "ID of the tenant to which the item belongs", example: "ckxyz1234567890abcdefg" }),
    name: z.string().openapi({ description: "Name of the item", example: "Laptop" }),
    sku: z.string().openapi({ description: "Unique identifier for the item", example: "ckxyz1234567890abcdefg" }),
    createdAt: z.date().openapi({ description: "Timestamp when the item was created", example: "2023-10-01T12:00:00Z" }),
    updatedAt: z.date().openapi({ description: "Timestamp when the item was last updated", example: "2023-10-10T15:30:00Z" }),
})

export const CreateItemSchema = ItemSchema.omit({ id: true, tenantId: true, createdAt: true, updatedAt: true }).openapi("CreateItem");

export const UpdateItemSchema = ItemSchema.omit({ id: true, tenantId: true, createdAt: true, updatedAt: true }).openapi("UpdateItem");

export const ItemResponseSchema = ItemSchema.omit({ tenantId: true }).openapi("ItemResponse");

export type Item = z.infer<typeof ItemSchema>
export type CreateItem = z.infer<typeof CreateItemSchema>
export type UpdateItem = z.infer<typeof UpdateItemSchema>
export type ItemResponse = z.infer<typeof ItemResponseSchema>