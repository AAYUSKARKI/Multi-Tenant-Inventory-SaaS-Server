import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { Router } from "express";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { verifyJWT } from "@/common/middleware/verifyJWT";
import { itemController } from "./itemController";
import { CreateItemSchema, ItemResponseSchema, ItemSchema, UpdateItemSchema } from "./itemModel";
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

itemRegistry.registerPath({
    method: "get",
    path: "/api/item",
    summary: "Get all items",
    tags: ["Item"], 
    responses: createApiResponse(ItemSchema.array(), "Items retrieved successfully", StatusCodes.OK),
    security: [{ bearerAuth: [] }],
});

itemRouter.get("/item", verifyJWT, itemController.getItems);

itemRegistry.registerPath({
    method: "get",
    path: "/api/item/{id}",
    summary: "Get an item by ID",
    tags: ["Item"],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the item to retrieve",            
            schema: {
                type: "string",
            },
        },
    ],
    responses: createApiResponse(ItemSchema, "Item retrieved successfully", StatusCodes.OK),
    security: [{ bearerAuth: [] }],
});

itemRouter.get("/item/:id", verifyJWT, itemController.getItemById);

itemRegistry.registerPath({
    method: "put",
    path: "/api/item/{id}",
    summary: "Update an item by ID",
    tags: ["Item"],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the item to update",            
            schema: {
                type: "string",
            },
        },        
    ],  
    request: {
        body: {
            description: "Item object that needs to be updated",
            required: true,
            content: {
                "application/json": {
                    schema: UpdateItemSchema,
                },
            },
        },
    },
    responses: createApiResponse(ItemSchema, "Item updated successfully", StatusCodes.OK),
    security: [{ bearerAuth: [] }],
});

itemRouter.put("/item/:id", verifyJWT, itemController.updateItem);

itemRegistry.registerPath({
    method: "delete",
    path: "/api/item/{id}",
    summary: "Delete an item by ID",
    tags: ["Item"],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the item to delete",            
            schema: {
                type: "string",
            },
        },
    ],
    responses: createApiResponse(ItemSchema, "Item deleted successfully", StatusCodes.OK),
    security: [{ bearerAuth: [] }],
});

itemRouter.delete("/item/:id", verifyJWT, itemController.deleteItem);
