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
            const tenantExists = await this.tenantRepository.findByName(data.name);
            if (tenantExists) {
                return ServiceResponse.failure("Tenant with this name already exists", null, StatusCodes.CONFLICT);
            }
            const tenant = await this.tenantRepository.create(data);
            return ServiceResponse.success("Tenant created successfully", tenant, StatusCodes.CREATED);
        }
        catch (error) {
            console.error("Error creating tenant:", error);
            return ServiceResponse.failure("Failed to create tenant", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getTenants(): Promise<ServiceResponse<Tenant[]>> {
        try {
            const tenants = await this.tenantRepository.findAll();
            return ServiceResponse.success("Tenants retrieved successfully", tenants, StatusCodes.OK);
        }
        catch (error) {
            console.error("Error retrieving tenants:", error);
            return ServiceResponse.failure("Failed to retrieve tenants", [], StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getTenantById(tenantId: string): Promise<ServiceResponse<Tenant | null>> {
        try {
            const tenant = await this.tenantRepository.findById(tenantId);
            if (!tenant) {
                return ServiceResponse.failure("Tenant not found", null, StatusCodes.NOT_FOUND);
            }
            return ServiceResponse.success("Tenant retrieved successfully", tenant, StatusCodes.OK);
        }
        catch (error) {
            console.error("Error retrieving tenant:", error);
            return ServiceResponse.failure("Failed to retrieve tenant", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteTenant(tenantId: string): Promise<ServiceResponse<null>> {
        try {
            const tenant = await this.tenantRepository.findById(tenantId);
            if (!tenant) {
                return ServiceResponse.failure("Tenant not found", null, StatusCodes.NOT_FOUND);
            }
            await this.tenantRepository.delete(tenantId);
            return ServiceResponse.success("Tenant deleted successfully", null, StatusCodes.OK);
        }
        catch (error) {
            console.error("Error deleting tenant:", error);
            return ServiceResponse.failure("Failed to delete tenant", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async updateTenant(tenantId: string, data: CreateTenant): Promise<ServiceResponse<Tenant | null>> {        
        try {
            const tenant = await this.tenantRepository.findById(tenantId);
            if (!tenant) {
                return ServiceResponse.failure("Tenant not found", null, StatusCodes.NOT_FOUND);
            }
            const updatedTenant = await this.tenantRepository.update(tenantId, data);
            return ServiceResponse.success("Tenant updated successfully", updatedTenant, StatusCodes.OK);
        }
        catch (error) {
            console.error("Error updating tenant:", error);
            return ServiceResponse.failure("Failed to update tenant", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export const tenantService = new TenantService();