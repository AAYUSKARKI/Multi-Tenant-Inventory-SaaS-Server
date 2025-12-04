import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { Router } from "express";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { verifyJWT } from "@/common/middleware/verifyJWT";
import { stockController } from "./stockController";
import { CreateStockSchema, StockResponseSchema, StockSchema, UpdateStockSchema } from "./stockModel";
import { StatusCodes } from "http-status-codes";

export const stockRegistry = new OpenAPIRegistry();
export const stockRouter: Router = Router();

stockRegistry.register("Stock", StockSchema);

stockRegistry.registerComponent("securitySchemes","bearerAuth", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
});

stockRegistry.registerPath({
    method: "post",
    path: "/api/stock",
    summary: "Create a new stock",
    tags: ["Stock"],
    request: {
        body: {
            description: "Stock object that needs to be created",
            required: true,
            content: {
                "application/json": {
                    schema: CreateStockSchema,
                },
            },
        },
    },
    responses: createApiResponse(StockResponseSchema,"Stock created successfully", StatusCodes.CREATED),
    security: [{ bearerAuth: [] }],
});

stockRouter.post("/stock", verifyJWT, stockController.createStock);

stockRegistry.registerPath({
    method: "get",
    path: "/api/stock",
    summary: "Get all stocks",
    tags: ["Stock"],
    responses: createApiResponse(StockSchema.array(), "Stocks retrieved successfully", StatusCodes.OK),
    security: [{ bearerAuth: [] }],
});

stockRouter.get("/stock", verifyJWT, stockController.getStocks);

stockRegistry.registerPath({
    method: "get",
    path: "/api/stock/{id}",
    summary: "Get a stock by ID",
    tags: ["Stock"],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the stock to retrieve",            
            schema: {
                type: "string",
            },
        },
    ],
    responses: createApiResponse(StockSchema, "Stock retrieved successfully", StatusCodes.OK),
    security: [{ bearerAuth: [] }],
});

stockRouter.get("/stock/:id", verifyJWT, stockController.getStockById);

stockRegistry.registerPath({
    method: "put",
    path: "/api/stock/{id}",
    summary: "Update a stock by ID",
    tags: ["Stock"],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the stock to update",            
            schema: {
                type: "string",
            },
        },        
    ],  
    request: {
        body: {
            description: "Stock object that needs to be updated",
            required: true,
            content: {
                "application/json": {
                    schema: UpdateStockSchema,
                },
            },
        },
    },
    responses: createApiResponse(StockSchema, "Stock updated successfully", StatusCodes.OK),
    security: [{ bearerAuth: [] }],
});

stockRouter.put("/stock/:id", verifyJWT, stockController.updateStock);

stockRegistry.registerPath({
    method: "delete",
    path: "/api/stock/{id}",
    summary: "Delete a stock by ID",
    tags: ["Stock"],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the stock to delete",            
            schema: {
                type: "string",
            },
        },
    ],
    responses: createApiResponse(StockSchema, "Stock deleted successfully", StatusCodes.OK),
    security: [{ bearerAuth: [] }],
});

stockRouter.delete("/stock/:id", verifyJWT, stockController.deleteStock);