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
}

export const itemService = new ItemService();

        