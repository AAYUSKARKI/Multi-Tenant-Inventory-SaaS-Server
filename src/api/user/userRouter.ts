import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { Router } from "express";
import { z } from "zod";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { UserResponseSchema, CreateUserSchema, UserSchema, LoginResponseSchema, LoginUserSchema } from "./userModel";
import { userController } from "./userController";
import { StatusCodes } from "http-status-codes";

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = Router();

userRegistry.register("User", UserSchema);

userRegistry.registerComponent("securitySchemes","bearerAuth", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
});

userRegistry.registerPath({
    method: "post",
    path: "/api/user",
    summary: "Create a new user",
    tags: ["User"],
    request: {
        body: {
            description: "User object that needs to be created",
            required: true,
            content: {
                "application/json": {
                    schema: CreateUserSchema,
                },
            },
        },
    },
    responses: createApiResponse(UserResponseSchema, "User created successfully", StatusCodes.CREATED),
});

userRouter.post("/user", userController.createUser);

userRegistry.registerPath({
    method: "post",
    path: "/api/user/login",
    summary: "Log in a user",
    tags: ["User"],
    request: {
        body: {
            description: "User object that needs to be logged in",
            required: true,
            content: {
                "application/json": {
                    schema: LoginUserSchema,
                },
            },
        },
    },
    responses: createApiResponse(LoginResponseSchema, "User logged in successfully", StatusCodes.OK),
});

userRouter.post("/user/login", userController.loginUser);

userRegistry.registerPath({
    method: "get",
    path: "/api/user",
    summary: "Get all users",
    tags: ["User"],
    responses: createApiResponse(UserResponseSchema.array(), "Users retrieved successfully", StatusCodes.OK),
    security: [{ bearerAuth: [] }],
});

userRouter.get("/user", userController.getUsers);
