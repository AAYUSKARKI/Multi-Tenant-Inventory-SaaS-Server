import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { Router } from "express";
import { tenantController } from "./tenantController";
import { TenantSchema } from "./tenantModel";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { StatusCodes } from "http-status-codes";

export const tenantRegistry = new OpenAPIRegistry();
export const tenantRouter: Router = Router();

tenantRegistry.register("Tenant", TenantSchema);

tenantRegistry.registerComponent("securitySchemes","bearerAuth", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
});

tenantRegistry.registerPath({
    method: "post",
    path: "/api/tenant",
    summary: "Create a new tenant",
    tags: ["Tenant"],
    request: {
        body: {
            description: "Tenant object that needs to be created",
            required: true,
            content: {
                "application/json": {
                    schema: TenantSchema.omit({ id: true, createdAt: true, updatedAt: true }),
                },
            },
        },
    },
    responses: createApiResponse(TenantSchema, "Tenant created successfully", StatusCodes.CREATED),
});

tenantRouter.post("/tenant", tenantController.createTenant);

tenantRegistry.registerPath({
    method: "get",
    path: "/api/tenant",
    summary: "Get all tenants",
    tags: ["Tenant"],
    responses: createApiResponse(TenantSchema.array(), "Tenants retrieved successfully", StatusCodes.OK),
    security: [{ bearerAuth: [] }],
});

tenantRouter.get("/tenant", tenantController.getTenants);

tenantRegistry.registerPath({
    method: "get",
    path: "/api/tenant/{id}",
    summary: "Get a tenant by ID",
    tags: ["Tenant"],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the tenant to retrieve",            
            schema: {
                type: "string",
            },
        },
    ],
    responses: createApiResponse(TenantSchema, "Tenant retrieved successfully", StatusCodes.OK),
    security: [{ bearerAuth: [] }],
});

tenantRouter.get("/tenant/:id", tenantController.getTenantById);

tenantRegistry.registerPath({
    method: "delete",
    path: "/api/tenant/{id}",
    summary: "Delete a tenant by ID",
    tags: ["Tenant"],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the tenant to delete",            
            schema: {
                type: "string",
            },
        },
    ],
    responses: createApiResponse(TenantSchema, "Tenant deleted successfully", StatusCodes.OK),
    security: [{ bearerAuth: [] }],
});

tenantRouter.delete("/tenant/:id", tenantController.deleteTenant);

tenantRegistry.registerPath({
    method: "put",
    path: "/api/tenant/{id}",
    summary: "Update a tenant by ID",
    tags: ["Tenant"],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the tenant to update",            
            schema: {
                type: "string",
            },
        },
    ],
    request: {
        body: {
            description: "Tenant object that needs to be updated",
            required: true,
            content: {
                "application/json": {
                    schema: TenantSchema.omit({ id: true, createdAt: true, updatedAt: true }),
                },
            },
        },
    },
    responses: createApiResponse(TenantSchema, "Tenant updated successfully", StatusCodes.OK),
    security: [{ bearerAuth: [] }],
});

tenantRouter.put("/tenant/:id", tenantController.updateTenant);
            
        
