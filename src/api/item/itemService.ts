import { StatusCodes } from "http-status-codes";
import type { CreateItem, Item, ItemResponse } from "./itemModel";
import { ItemRepository } from "./itemRepository";
import { TenantRepository } from "../tenant/tenantRepository";
import { ServiceResponse } from "@/common/utils/serviceResponse";

export class ItemService {
    private itemRepository: ItemRepository;
    private tenantRepository: TenantRepository;

    constructor(
        itemRepository: ItemRepository = new ItemRepository(),
        tenantRepository: TenantRepository = new TenantRepository()
    ) {
        this.itemRepository = itemRepository;
        this.tenantRepository = tenantRepository;
    }

    async createItem(data: CreateItem, tenantId: string): Promise<ServiceResponse<ItemResponse | null>> {
        try {
            const tenant = await this.tenantRepository.findById(tenantId);
            if (!tenant) {
                return ServiceResponse.failure("Tenant not found", null, StatusCodes.NOT_FOUND);
            }

            const itemExists = await this.itemRepository.findByName(data.name, tenantId);
            if (itemExists) {
                return ServiceResponse.failure("Item with this name already exists", null, StatusCodes.CONFLICT);
            }
            const item = await this.itemRepository.create(data, tenantId);
            return ServiceResponse.success<ItemResponse>("Item created successfully", item, StatusCodes.CREATED);
        } catch (error) {
            console.error("Error creating item:", error);
            return ServiceResponse.failure<null>("Failed to create item", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getItems(tenantId: string): Promise<ServiceResponse<Item[]>> {
        try {
            const tenant = await this.tenantRepository.findById(tenantId);
            if (!tenant) {
                return ServiceResponse.failure("Tenant not found", [], StatusCodes.NOT_FOUND);
            }
            const items = await this.itemRepository.findManyByTenant(tenantId);
            return ServiceResponse.success<Item[]>("Items retrieved successfully", items, StatusCodes.OK);
        } catch (error) {
            console.error("Error retrieving items:", error);
            return ServiceResponse.failure<Item[]>("Failed to retrieve items", [], StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getItemById(itemId: string, tenantId: string): Promise<ServiceResponse<Item | null>> {    
        try {
            const tenant = await this.tenantRepository.findById(tenantId);
            if (!tenant) {
                return ServiceResponse.failure("Tenant not found", null, StatusCodes.NOT_FOUND);
            }
            const item = await this.itemRepository.findByIdAndTenant(itemId, tenantId);
            if (!item) {
                return ServiceResponse.failure("Item not found", null, StatusCodes.NOT_FOUND);
            }
            return ServiceResponse.success<Item>("Item retrieved successfully", item, StatusCodes.OK);
        } catch (error) {
            console.error("Error retrieving item:", error);
            return ServiceResponse.failure<Item | null>("Failed to retrieve item", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async updateItem(itemId: string, data: CreateItem, tenantId: string): Promise<ServiceResponse<Item | null>> {
        try {
            const tenant = await this.tenantRepository.findById(tenantId);
            if (!tenant) {
                return ServiceResponse.failure("Tenant not found", null, StatusCodes.NOT_FOUND);
            }
            const item = await this.itemRepository.findByIdAndTenant(itemId, tenantId);
            if (!item) {
                return ServiceResponse.failure("Item not found", null, StatusCodes.NOT_FOUND);
            }
            const updatedItem = await this.itemRepository.update(itemId, data, tenantId);
            return ServiceResponse.success<Item>("Item updated successfully", updatedItem, StatusCodes.OK);
        } catch (error) {
            console.error("Error updating item:", error);
            return ServiceResponse.failure<Item | null>("Failed to update item", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteItem(itemId: string, tenantId: string): Promise<ServiceResponse<null>> {
        try {
            const tenant = await this.tenantRepository.findById(tenantId);
            if (!tenant) {
                return ServiceResponse.failure("Tenant not found", null, StatusCodes.NOT_FOUND);
            }
            const item = await this.itemRepository.findByIdAndTenant(itemId, tenantId);
            if (!item) {
                return ServiceResponse.failure("Item not found", null, StatusCodes.NOT_FOUND);
            }
            await this.itemRepository.delete(itemId, tenantId);
            return ServiceResponse.success<null>("Item deleted successfully", null, StatusCodes.OK);
        } catch (error) {
            console.error("Error deleting item:", error);
            return ServiceResponse.failure<null>("Failed to delete item", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export const itemService = new ItemService();

        