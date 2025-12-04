import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { Router } from "express";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { verifyJWT } from "@/common/middleware/verifyJWT";
import { itemController } from "./itemController";
import { CreateItemSchema, ItemResponseSchema, ItemSchema } from "./itemModel";
import { StatusCodes } from "http-status-codes";

export const itemRegistry = new OpenAPIRegistry();
export const itemRouter: Router = Router();

itemRegistry.register("Item", ItemSchema);

itemRegistry.registerComponent("securitySchemes","bearerAuth", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
});

itemRegistry.registerPath({
    method: "post",
    path: "/api/item",
    summary: "Create a new item",
    tags: ["Item"],
    request: {
        body: {
            description: "Item object that needs to be created",
            required: true,
            content: {
                "application/json": {
                    schema: CreateItemSchema,
                },
            },
        },
    },
    responses: createApiResponse(ItemResponseSchema, "Item created successfully", StatusCodes.CREATED),
    security: [{ bearerAuth: [] }],
});

itemRouter.post("/item", verifyJWT, itemController.createItem);
