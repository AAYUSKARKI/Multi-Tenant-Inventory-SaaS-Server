import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { Router } from "express";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { verifyJWT } from "@/common/middleware/verifyJWT";
import { warehouseController } from "./warehouseController";
import { CreateWarehouseSchema, WarehouseResponseSchema, WarehouseSchema, UpdateWarehouseSchema } from "./warehouseModel";
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

warehouseRegistry.registerPath({
    method: "get",
    path: "/api/warehouse/{id}",
    summary: "Get a warehouse by ID",
    tags: ["Warehouse"],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the warehouse to retrieve",            
            schema: {
                type: "string",
            },
        },
    ],
    responses: createApiResponse(WarehouseResponseSchema, "Warehouse retrieved successfully", StatusCodes.OK),
    security: [{ bearerAuth: [] }],
});

warehouseRouter.get("/warehouse/:id", verifyJWT, warehouseController.getWarehouseById);
    
warehouseRegistry.registerPath({
    method: "put",
    path: "/api/warehouse/{id}",
    summary: "Update a warehouse by ID",
    tags: ["Warehouse"],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the warehouse to update",            
            schema: {
                type: "string",
            },
        },
    ],
    request: {
        body: {
            description: "Warehouse object that needs to be updated",
            required: true,
            content: {
                "application/json": {
                    schema: UpdateWarehouseSchema,
                },
            },
        },
    },
    responses: createApiResponse(WarehouseResponseSchema, "Warehouse updated successfully", StatusCodes.OK),
    security: [{ bearerAuth: [] }],
});

warehouseRouter.put("/warehouse/:id", verifyJWT, warehouseController.updateWarehouse);  

warehouseRegistry.registerPath({
    method: "delete",
    path: "/api/warehouse/{id}",
    summary: "Delete a warehouse by ID",
    tags: ["Warehouse"],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the warehouse to delete",            
            schema: {
                type: "string",
            },
        },
    ],
    responses: createApiResponse(WarehouseResponseSchema, "Warehouse deleted successfully", StatusCodes.OK),
    security: [{ bearerAuth: [] }],
});

warehouseRouter.delete("/warehouse/:id", verifyJWT, warehouseController.deleteWarehouse);