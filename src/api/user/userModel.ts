import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { Role } from "@/generated/prisma/enums";

extendZodWithOpenApi(z);

export const UserSchema = z.object({
    id: z.string().openapi({ description: "Unique identifier for the user", example: "ckxyz1234567890abcdefg" }),
    tenantId: z.string().openapi({ description: "ID of the tenant to which the user belongs", example: "ckxyz1234567890abcdefg" }),
    email: z.email().openapi({ description: "Email address of the user", example: "iJY3J@example.com" }),
    password: z.string().openapi({ description: "Password of the user", example: "password123" }),
    fullName: z.string().openapi({ description: "Full name of the user", example: "John Doe" }),
    role: z.enum(Role).openapi({ description: "Role of the user", example: "USER" }),
    createdAt: z.date().openapi({ description: "Timestamp when the user was created", example: "2023-10-01T12:00:00Z" }),
    updatedAt: z.date().openapi({ description: "Timestamp when the user was last updated", example: "2023-10-10T15:30:00Z" }),
})

export const UserWithTenantSchema = UserSchema.extend({ 
     tenant: z.object({
        id: z.string().openapi({ description: "Unique identifier for the tenant", example: "ckxyz1234567890abcdefg" }),
        name: z.string().openapi({ description: "Name of the tenant", example: "Acme Corporation" }),   
        createdAt: z.date().openapi({ description: "Timestamp when the tenant was created", example: "2023-10-01T12:00:00Z" }),
        updatedAt: z.date().openapi({ description: "Timestamp when the tenant was last updated", example: "2023-10-10T15:30:00Z" }),
    }).openapi({
        description: "Tenant to which the user belongs",
        example: {
            id: "ckxyz1234567890abcdefg",
            name: "Acme Corporation",
            createdAt: "2023-10-01T12:00:00Z",
            updatedAt: "2023-10-10T15:30:00Z",
        },
    }),
}).openapi("UserWithTenant");

export const CreateUserSchema = UserSchema.omit({ id: true, createdAt: true, updatedAt: true }).openapi("CreateUser");

export const LoginUserSchema = UserSchema.pick({ email: true, password: true }).openapi("LoginUser");

export const UpdateUserSchema = UserSchema.omit({ id: true, tenantId: true, createdAt: true, updatedAt: true }).openapi("UpdateUser");

export const UserResponseSchema = UserSchema.omit({ password: true }).openapi("UserResponse");

export const LoginResponseSchema = z.object({
  token: z.string().openapi({ description: "JWT access token", example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" }),
  id: z.string().openapi({ description: "Unique identifier for the user", example: "ckxyz1234567890abcdefg" }),
  email: z.email().openapi({ description: "Email address of the user", example: "iJY3J@example.com" }),
  fullName: z.string().openapi({ description: "Full name of the user", example: "John Doe" }),
  role: z.enum(Role).openapi({ description: "Role of the user", example: "USER" }),
  tenantId: z.string().openapi({ description: "ID of the tenant to which the user belongs", example: "ckxyz1234567890abcdefg" }),
  createdAt: z.date().openapi({ description: "Timestamp when the user was created", example: "2023-10-01T12:00:00Z" }),
  updatedAt: z.date().openapi({ description: "Timestamp when the user was last updated", example: "2023-10-10T15:30:00Z" }),
}).openapi("LoginResponse")

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type LoginUser = z.infer<typeof LoginUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type UserWithTenant = z.infer<typeof UserWithTenantSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
