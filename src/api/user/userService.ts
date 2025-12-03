import { StatusCodes } from "http-status-codes";
import type { User, CreateUser, UserResponse } from "./userModel";
import { UserRepository } from "./userRepository";
import { TenantRepository } from "../tenant/tenantRepository";
import bcrypt from "bcrypt";
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
}

export const userService = new UserService();