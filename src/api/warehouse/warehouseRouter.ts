import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { Router } from "express";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { verifyJWT } from "@/common/middleware/verifyJWT";
import { warehouseController } from "./warehouseController";
import { CreateWarehouseSchema, WarehouseResponseSchema, WarehouseSchema } from "./warehouseModel";
import { StatusCodes } from "http-status-codes";

export const warehouseRegistry = new OpenAPIRegistry();
export const warehouseRouter: Router = Router();

warehouseRegistry.register("Warehouse", WarehouseSchema);

warehouseRegistry.registerComponent("securitySchemes","bearerAuth", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
});

warehouseRegistry.registerPath({
    method: "post",
    path: "/api/warehouse",
    summary: "Create a new warehouse",
    tags: ["Warehouse"],
    request: {
        body: {
            description: "Warehouse object that needs to be created",
            required: true,
            content: {
                "application/json": {
                    schema: CreateWarehouseSchema,
                },
            },
        },
    },
    responses: createApiResponse(WarehouseResponseSchema,"Warehouse created successfully", StatusCodes.CREATED),
    security: [{ bearerAuth: [] }],
});

warehouseRouter.post("/warehouse", verifyJWT, warehouseController.createWarehouse);

warehouseRegistry.registerPath({
    method: "get",
    path: "/api/warehouse",
    summary: "Get all warehouses",
    tags: ["Warehouse"],
    responses: createApiResponse(WarehouseResponseSchema.array(), "Warehouses retrieved successfully", StatusCodes.OK),
    security: [{ bearerAuth: [] }],
});

warehouseRouter.get("/warehouse", verifyJWT, warehouseController.getWarehouses);