import { StatusCodes } from "http-status-codes";
import type { LoginUser,UpdateUser, CreateUser, UserResponse, LoginResponse, TenantByEmail } from "./userModel";
import { UserRepository } from "./userRepository";
import { TenantRepository } from "../tenant/tenantRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ServiceResponse } from "@/common/utils/serviceResponse";
import cache from "memory-cache";

export class UserService {
    private userRepository: UserRepository;
    private tenantRepository: TenantRepository;

    constructor(
        userRepository: UserRepository = new UserRepository(),
        tenantRepository: TenantRepository = new TenantRepository()
    ) {
        this.userRepository = userRepository;
        this.tenantRepository = tenantRepository;
    }

    async createUser(data: CreateUser): Promise<ServiceResponse<UserResponse | null>> {
        try {
            const tenant = await this.tenantRepository.findById(data.tenantId);
            if (!tenant) {
                return ServiceResponse.failure("Tenant not found", null, StatusCodes.BAD_REQUEST);
            }
            const userExists = await this.userRepository.findByEmailOnTenant(data.email, data.tenantId);
            if (userExists) {
                return ServiceResponse.failure("User with this email already exists", null, StatusCodes.CONFLICT);
            }
            const hashedPassword = await bcrypt.hash(data.password, 10);
            const user = await this.userRepository.create({ ...data, password: hashedPassword });
            const userResponse: UserResponse = {
                id: user.id,
                tenantId: user.tenantId,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
            return ServiceResponse.success("User created successfully", userResponse, StatusCodes.CREATED);
        } catch (error) {
            console.error("Error creating user:", error);
            return ServiceResponse.failure("Failed to create user", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async loginUser(data: LoginUser): Promise<ServiceResponse<LoginResponse | null>> {
        try {
            const user = await this.userRepository.findByEmailOnTenant(data.email, data.tenantId);
            if (!user) {
                return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
            }
            const isPasswordValid = await bcrypt.compare(data.password, user.password);
            if (!isPasswordValid) {
                return ServiceResponse.failure("Invalid password", null, StatusCodes.UNAUTHORIZED);
            }

            const token = jwt.sign({ userId: user.id, tenantId: user.tenantId }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

            await this.userRepository.updateRefreshToken(user.id,user.tenantId,token);

            const loginResponse: LoginResponse = {
                token,
                id: user.id,
                tenantId: user.tenantId,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
            return ServiceResponse.success("User logged in successfully", loginResponse, StatusCodes.OK);
        } catch (error) {
            console.error("Error logging in user:", error);
            return ServiceResponse.failure("Failed to log in user", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getUsers(tenantId: string): Promise<ServiceResponse<UserResponse[]>> {
        try {
            const users = await this.userRepository.findAll(tenantId);
            const userResponses: UserResponse[] = users.map(user => ({
                id: user.id,
                tenantId: user.tenantId,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }));
            return ServiceResponse.success("Users retrieved successfully", userResponses, StatusCodes.OK);
        } catch (error) {
            console.error("Error retrieving users:", error);
            return ServiceResponse.failure("Failed to retrieve users", [], StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getUserById(userId: string, tenantId: string): Promise<ServiceResponse<UserResponse | null>> {
        try {
            const user = await this.userRepository.findByIdAndTenant(userId, tenantId);
            if (!user) {
                return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
            }
            const userResponse: UserResponse = {
                id: user.id,
                tenantId: user.tenantId,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
            return ServiceResponse.success<UserResponse>("User retrieved successfully", userResponse, StatusCodes.OK);
        } catch (error) {
            console.error("Error retrieving user:", error);
            return ServiceResponse.failure<null>("Failed to retrieve user", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getTenantByEmail(email: string): Promise<ServiceResponse<TenantByEmail[] | null>> {
        try {
            const user = await this.userRepository.findTenantByEmail(email);
            if (!user) {
                return ServiceResponse.failure("Tenant not found for this email", null, StatusCodes.NOT_FOUND);
            }
           
            return ServiceResponse.success<TenantByEmail[]>("Tenant retrieved successfully for this email", user, StatusCodes.OK);
        } catch (error) {
            console.error("Error retrieving user:", error);
            return ServiceResponse.failure<null>("Failed to retrieve tenant for this email", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async updateUser(data: UpdateUser, tenantId: string, userId: string): Promise<ServiceResponse<UserResponse | null>> {
        try {
            const user = await this.userRepository.findByIdAndTenant(userId, tenantId);
            if (!user) {
                return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
            }
            const updatedUser = await this.userRepository.update(userId, data, tenantId);
            const userResponse: UserResponse = {
                id: updatedUser.id,
                tenantId: updatedUser.tenantId,
                email: updatedUser.email,
                fullName: updatedUser.fullName,
                role: updatedUser.role,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt
            }
            return ServiceResponse.success<UserResponse>("User updated successfully", userResponse, StatusCodes.OK);
        } catch (error) {
            console.error("Error updating user:", error);
            return ServiceResponse.failure<null>("Failed to update user", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteUser(userId: string, tenantId: string): Promise<ServiceResponse<null>> {
        try {
            const user = await this.userRepository.findByIdAndTenant(userId, tenantId);  
            if (!user) {
                return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
            }
            await this.userRepository.delete(userId, tenantId);
            return ServiceResponse.success<null>("User deleted successfully", null, StatusCodes.OK);
        } catch (error) {
            console.error("Error deleting user:", error);
            return ServiceResponse.failure<null>("Failed to delete user", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async logoutUser(userId: string, tenantId: string, accessToken: string): Promise<ServiceResponse<null>> {
        try {
            await this.userRepository.updateRefreshToken(userId, tenantId, "");  

            const decodedToken = jwt.decode(accessToken) as { exp?: number };

            if (decodedToken?.exp) {
                const currentTimeInSeconds = Math.floor(Date.now() / 1000);
                const timeToLive = decodedToken.exp - currentTimeInSeconds;
                cache.put(accessToken,true, timeToLive * 1000);
            }
            return ServiceResponse.success<null>("User logged out successfully", null, StatusCodes.OK);
        } catch (error) {
            console.error("Error logging out user:", error);
            return ServiceResponse.failure<null>("Failed to log out user", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export const userService = new UserService();