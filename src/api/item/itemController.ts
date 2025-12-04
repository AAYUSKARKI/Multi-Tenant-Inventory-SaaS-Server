import type { Request, RequestHandler, Response } from "express";
import { CreateItemSchema, ItemResponse } from "./itemModel";
import { itemService } from "./itemService";
import { ServiceResponse, handleServiceResponse } from "@/common/utils/serviceResponse";
import { StatusCodes } from "http-status-codes";

class ItemController {
    public createItem: RequestHandler = async (req: Request, res: Response) => {
        if (!req.user?.tenantId) {
            return handleServiceResponse(
                ServiceResponse.failure("Unauthorized", null, StatusCodes.UNAUTHORIZED),
                res
            );
        }
        const data = CreateItemSchema.parse(req.body);
        const serviceResponse: ServiceResponse<ItemResponse | null> = await itemService.createItem(data, req.user.tenantId);
        return handleServiceResponse(serviceResponse, res);
    };
}

export const itemController = new ItemController();