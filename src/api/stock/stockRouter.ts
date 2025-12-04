import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { Router } from "express";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { verifyJWT } from "@/common/middleware/verifyJWT";
import { stockController } from "./stockController";
import { CreateStockSchema, StockResponseSchema, StockSchema } from "./stockModel";
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