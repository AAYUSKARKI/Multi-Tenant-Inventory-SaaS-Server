import { StatusCodes } from "http-status-codes";
import type { CreateTenant, Tenant } from "./tenantModel";
import { ServiceResponse } from "@/common/utils/serviceResponse";
import { TenantRepository } from "./tenantRepository";

export class TenantService {
    private tenantRepository: TenantRepository;

    constructor(repository: TenantRepository = new TenantRepository()) {
        this.tenantRepository = repository;
    }

    async createTenant(data: CreateTenant): Promise<ServiceResponse<Tenant | null>> {
        try {
            const tenant = await this.tenantRepository.create(data);
            return ServiceResponse.success("Tenant created successfully", tenant, StatusCodes.CREATED);
        }
        catch (error) {
            console.error("Error creating tenant:", error);
            return ServiceResponse.failure("Failed to create tenant", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export const tenantService = new TenantService();