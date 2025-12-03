import { StatusCodes } from "http-status-codes";
import type { LoginUser, CreateUser, UserResponse, LoginResponse } from "./userModel";
import { UserRepository } from "./userRepository";
import { TenantRepository } from "../tenant/tenantRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ServiceResponse } from "@/common/utils/serviceResponse";

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
            const userExists = await this.userRepository.findByEmail(data.email);
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
            const user = await this.userRepository.findByEmail(data.email);
            if (!user) {
                return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
            }
            const isPasswordValid = await bcrypt.compare(data.password, user.password);
            if (!isPasswordValid) {
                return ServiceResponse.failure("Invalid password", null, StatusCodes.UNAUTHORIZED);
            }

            const token = jwt.sign({ userId: user.id, tenantId: user.tenantId }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
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
}

export const userService = new UserService();