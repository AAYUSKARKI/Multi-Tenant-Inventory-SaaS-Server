import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const TenantSchema = z.object({
    id: z.string().openapi({ description: "Unique identifier for the tenant", example: "ckxyz1234567890abcdefg" }),
    name: z.string().min(1).max(100).openapi({ description: "Name of the tenant", example: "Acme Corporation" }),
    createdAt: z.date().openapi({ description: "Timestamp when the tenant was created", example: "2023-10-01T12:00:00Z" }),
    updatedAt: z.date().openapi({ description: "Timestamp when the tenant was last updated", example: "2023-10-10T15:30:00Z" }),
}).openapi("Tenant");

export const CreateTenantSchema = TenantSchema.omit({ id: true, createdAt: true, updatedAt: true }).openapi("CreateTenant");

export type Tenant = z.infer<typeof TenantSchema>;
export type CreateTenant = z.infer<typeof CreateTenantSchema>;
