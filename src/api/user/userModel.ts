import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { Role } from "@/generated/prisma/enums";

extendZodWithOpenApi(z);

export const UserSchema = z.object({
    id: z.string().openapi({ description: "Unique identifier for the user", example: "ckxyz1234567890abcdefg" }),
    tenantId: z.string().openapi({ description: "ID of the tenant to which the user belongs", example: "ckxyz1234567890abcdefg" }),
    tenant: z.string().openapi({ description: "Name of the tenant to which the user belongs", example: "Acme Corporation" }),
    email: z.email().openapi({ description: "Email address of the user", example: "iJY3J@example.com" }),
    password: z.string().openapi({ description: "Password of the user", example: "password123" }),
    fullName: z.string().openapi({ description: "Full name of the user", example: "John Doe" }),
    role: z.enum(Role).openapi({ description: "Role of the user", example: "USER" }),
    createdAt: z.date().openapi({ description: "Timestamp when the user was created", example: "2023-10-01T12:00:00Z" }),
    updatedAt: z.date().openapi({ description: "Timestamp when the user was last updated", example: "2023-10-10T15:30:00Z" }),
})

export const CreateUserSchema = UserSchema.omit({ id: true, createdAt: true, updatedAt: true }).openapi("CreateUser");

export const LoginUserSchema = UserSchema.pick({ email: true, password: true }).openapi("LoginUser");

export const UpdateUserSchema = UserSchema.omit({ id: true, tenantId: true, tenant: true, createdAt: true, updatedAt: true }).openapi("UpdateUser");

export const UserResponseSchema = UserSchema.omit({ password: true }).openapi("UserResponse");

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type LoginUser = z.infer<typeof LoginUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
