import type { CreateStock,StockResponse } from "./stockModel";
import { StockRepository } from "./stockRepository";
import { TenantRepository } from "../tenant/tenantRepository";
import { WarehouseRepository } from "../warehouse/warehouseRepository";
import { ItemRepository } from "../item/itemRepository";
import { ServiceResponse } from "@/common/utils/serviceResponse";
import { StatusCodes } from "http-status-codes";

export class StockService {
    private stockRepository: StockRepository;
    private tenantRepository: TenantRepository;
    private warehouseRepository: WarehouseRepository;
    private itemRepository: ItemRepository;

    constructor(
        stockRepository: StockRepository = new StockRepository(),
        tenantRepository: TenantRepository = new TenantRepository(),
        warehouseRepository: WarehouseRepository = new WarehouseRepository(),
        itemRepository: ItemRepository = new ItemRepository()
    ) {
        this.stockRepository = stockRepository;
        this.tenantRepository = tenantRepository;
        this.warehouseRepository = warehouseRepository;
        this.itemRepository = itemRepository;
    }

    async createStock(data: CreateStock, tenantId: string): Promise<ServiceResponse<StockResponse | null>> {
        try {
            const tenant = await this.tenantRepository.findById(tenantId);
            if (!tenant) {
                return ServiceResponse.failure("Tenant not found", null, StatusCodes.NOT_FOUND);
            }
            
            const warehouse = await this.warehouseRepository.findByIdAndTenant(data.warehouseId, tenantId);
            if (!warehouse) {
                return ServiceResponse.failure("Warehouse not found", null, StatusCodes.NOT_FOUND);
            }

            const item = await this.itemRepository.findByIdAndTenant(data.itemId, tenantId);
            if (!item) {
                return ServiceResponse.failure("Item not found", null, StatusCodes.NOT_FOUND);
            }
            
            const stock = await this.stockRepository.create(data, tenantId);
            return ServiceResponse.success<StockResponse>("Stock created successfully", stock, StatusCodes.CREATED);
        } catch (error) {
            console.error("Error creating stock:", error);
            return ServiceResponse.failure<null>("Failed to create stock", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export const stockService = new StockService();