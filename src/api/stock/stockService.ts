import type { CreateStock,StockResponse, UpdateStock } from "./stockModel";
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

    async getStocks(tenantId: string): Promise<ServiceResponse<StockResponse[]>> {
        try {
            const tenant = await this.tenantRepository.findById(tenantId);
            if (!tenant) {
                return ServiceResponse.failure("Tenant not found", [], StatusCodes.NOT_FOUND);
            }
            const stocks = await this.stockRepository.findAll(tenantId);
            return ServiceResponse.success<StockResponse[]>("Stocks retrieved successfully", stocks, StatusCodes.OK);
        } catch (error) {
            console.error("Error retrieving stocks:", error);
            return ServiceResponse.failure<StockResponse[]>("Failed to retrieve stocks", [], StatusCodes.INTERNAL_SERVER_ERROR);
        }
    } 

    async getStockById(stockId: string, tenantId: string): Promise<ServiceResponse<StockResponse | null>> {
        try {
            const tenant = await this.tenantRepository.findById(tenantId);
            if (!tenant) {
                return ServiceResponse.failure("Tenant not found", null, StatusCodes.NOT_FOUND);
            }
            const stock = await this.stockRepository.findByIdAndTenant(stockId, tenantId);
            if (!stock) {
                return ServiceResponse.failure("Stock not found", null, StatusCodes.NOT_FOUND);
            }
            return ServiceResponse.success<StockResponse>("Stock retrieved successfully", stock, StatusCodes.OK);
        } catch (error) {
            console.error("Error retrieving stock:", error);
            return ServiceResponse.failure<StockResponse | null>("Failed to retrieve stock", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async updateStock(stockId: string, data: UpdateStock, tenantId: string): Promise<ServiceResponse<StockResponse | null>> {
        try {
            const tenant = await this.tenantRepository.findById(tenantId);
            if (!tenant) {
                return ServiceResponse.failure("Tenant not found", null, StatusCodes.NOT_FOUND);
            }
            const stock = await this.stockRepository.findByIdAndTenant(stockId, tenantId);
            if (!stock) {
                return ServiceResponse.failure("Stock not found", null, StatusCodes.NOT_FOUND);
            }
            const updatedStock = await this.stockRepository.update(stockId, data, tenantId);
            return ServiceResponse.success<StockResponse>("Stock updated successfully", updatedStock, StatusCodes.OK);
        } catch (error) {
            console.error("Error updating stock:", error);
            return ServiceResponse.failure<StockResponse | null>("Failed to update stock", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteStock(stockId: string, tenantId: string): Promise<ServiceResponse<null>> {
        try {
            const tenant = await this.tenantRepository.findById(tenantId);
            if (!tenant) {
                return ServiceResponse.failure("Tenant not found", null, StatusCodes.NOT_FOUND);
            }
            const stock = await this.stockRepository.findByIdAndTenant(stockId, tenantId);
            if (!stock) {
                return ServiceResponse.failure("Stock not found", null, StatusCodes.NOT_FOUND);
            }
            await this.stockRepository.delete(stockId, tenantId);
            return ServiceResponse.success<null>("Stock deleted successfully", null, StatusCodes.OK);
        } catch (error) {
            console.error("Error deleting stock:", error);
            return ServiceResponse.failure<null>("Failed to delete stock", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export const stockService = new StockService();