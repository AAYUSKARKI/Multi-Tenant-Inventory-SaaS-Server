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
