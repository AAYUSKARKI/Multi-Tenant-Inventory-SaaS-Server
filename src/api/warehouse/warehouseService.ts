import type { CreateWarehouse,Warehouse,WarehouseResponse } from "./warehouseModel";
import { WarehouseRepository } from "./warehouseRepository";
import { TenantRepository } from "../tenant/tenantRepository";
import { ServiceResponse } from "@/common/utils/serviceResponse";
import { StatusCodes } from "http-status-codes";

export class WarehouseService {
    private warehouseRepository: WarehouseRepository;
    private tenantRepository: TenantRepository;

    constructor(
        warehouseRepository: WarehouseRepository = new WarehouseRepository(),
        tenantRepository: TenantRepository = new TenantRepository()
    ) {
        this.warehouseRepository = warehouseRepository;
        this.tenantRepository = tenantRepository;
    }

    async createWarehouse(data: CreateWarehouse, tenantId: string): Promise<ServiceResponse<WarehouseResponse | null>> {
        try {
            const tenant = await this.tenantRepository.findById(tenantId);
            if (!tenant) {
                return ServiceResponse.failure("Tenant not found", null, StatusCodes.NOT_FOUND);
            }
            const warehouse = await this.warehouseRepository.create(data, tenantId);
            return ServiceResponse.success<WarehouseResponse>("Warehouse created successfully", warehouse, StatusCodes.CREATED);
        } catch (error) {
            console.error("Error creating warehouse:", error);
            return ServiceResponse.failure<null>("Failed to create warehouse", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getWarehouses(tenantId: string): Promise<ServiceResponse<Warehouse[]>> {
        try {
            const tenant = await this.tenantRepository.findById(tenantId);
            if (!tenant) {
                return ServiceResponse.failure("Tenant not found", [], StatusCodes.NOT_FOUND);
            }
            const warehouses = await this.warehouseRepository.findManyByTenant(tenantId);
            return ServiceResponse.success<Warehouse[]>("Warehouses retrieved successfully", warehouses, StatusCodes.OK);
        } catch (error) {
            console.error("Error retrieving warehouses:", error);
            return ServiceResponse.failure<Warehouse[]>("Failed to retrieve warehouses", [], StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getWarehouseById(warehouseId: string, tenantId: string): Promise<ServiceResponse<Warehouse | null>> {
        try {
            const tenant = await this.tenantRepository.findById(tenantId);
            if (!tenant) {
                return ServiceResponse.failure("Tenant not found", null, StatusCodes.NOT_FOUND);
            }
            const warehouse = await this.warehouseRepository.findByIdAndTenant(warehouseId, tenantId);
            if (!warehouse) {
                return ServiceResponse.failure("Warehouse not found", null, StatusCodes.NOT_FOUND);
            }
            return ServiceResponse.success<Warehouse>("Warehouse retrieved successfully", warehouse, StatusCodes.OK);
        } catch (error) {
            console.error("Error retrieving warehouse:", error);
            return ServiceResponse.failure<Warehouse | null>("Failed to retrieve warehouse", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export const warehouseService = new WarehouseService();