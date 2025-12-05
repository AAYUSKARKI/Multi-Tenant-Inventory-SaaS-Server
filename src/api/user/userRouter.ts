import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { Router } from "express";
import { verifyJWT } from "@/common/middleware/verifyJWT";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { UserResponseSchema, CreateUserSchema, UserSchema, LoginResponseSchema, LoginUserSchema, UpdateUserSchema, TenantByEmailSchema, EmailSchema } from "./userModel";
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
    path: "/api/user/tenantbyemail",
    summary: "Get tenant by email",
    tags: ["User"],
    request: {
        body: {
            description: "Email of the user to retrieve the tenant",
            required: true,
            content: {
                "application/json": {
                    schema: EmailSchema,
                },
            },
        },
    },
    responses: createApiResponse(TenantByEmailSchema, "Tenant retrieved successfully", StatusCodes.OK),
});

userRouter.post("/user/tenantbyemail", userController.getTenantByEmail);

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

userRouter.get("/user", verifyJWT, userController.getUsers);

userRegistry.registerPath({
    method: "get",
    path: "/api/user/{id}",
    summary: "Get a user by ID",
    tags: ["User"],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the user to retrieve",            
            schema: {
                type: "string",
            },
        },
    ],
    responses: createApiResponse(UserResponseSchema, "User retrieved successfully", StatusCodes.OK),
    security: [{ bearerAuth: [] }],
});

userRouter.get("/user/:id", verifyJWT, userController.getUserById);

userRegistry.registerPath({
    method: "put",
    path: "/api/user/{id}",
    summary: "Update a user by ID",
    tags: ["User"],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the user to update",            
            schema: {
                type: "string",
            },
        },        
    ],  
    request: {
        body: {
            description: "User object that needs to be updated",
            required: true,
            content: {
                "application/json": {
                    schema: UpdateUserSchema,
                },
            },
        },
    },
    responses: createApiResponse(UserResponseSchema, "User updated successfully", StatusCodes.OK),
    security: [{ bearerAuth: [] }],
});

userRouter.put("/user/:id", verifyJWT, userController.updateUser);

userRegistry.registerPath({
    method: "delete",
    path: "/api/user/{id}",
    summary: "Delete a user by ID",
    tags: ["User"],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the user to delete",            
            schema: {
                type: "string",
            },
        },
    ],
    responses: createApiResponse(UserResponseSchema, "User deleted successfully", StatusCodes.OK),
    security: [{ bearerAuth: [] }],
});

userRouter.delete("/user/:id", verifyJWT, userController.deleteUser);

userRegistry.registerPath({
    method: "post",
    path: "/api/user/logout",
    summary: "Log out a user",
    tags: ["User"],
    responses: createApiResponse(UserResponseSchema, "User logged out successfully", StatusCodes.OK),
    security: [{ bearerAuth: [] }],
});

userRouter.post("/user/logout", verifyJWT, userController.logoutUser);