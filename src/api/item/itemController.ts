import type { Request, RequestHandler, Response } from "express";
import { CreateItemSchema, ItemResponse, UpdateItemSchema } from "./itemModel";
import { itemService } from "./itemService";
import { ServiceResponse, handleServiceResponse } from "@/common/utils/serviceResponse";
import { StatusCodes } from "http-status-codes";

class UserController {
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

    public getItems: RequestHandler = async (req: Request, res: Response) => {
        if (!req.user?.tenantId) {
            return handleServiceResponse(
                ServiceResponse.failure("Unauthorized", null, StatusCodes.UNAUTHORIZED),
                res
            );
        }
        const serviceResponse: ServiceResponse<ItemResponse[]> = await itemService.getItems(req.user.tenantId);
        return handleServiceResponse(serviceResponse, res);
    };

    public getItemById: RequestHandler = async (req: Request, res: Response) => {
        if (!req.user?.tenantId) {
            return handleServiceResponse(
                ServiceResponse.failure("Unauthorized", null, StatusCodes.UNAUTHORIZED),
                res
            );
        }
        const itemId = req.params.id;
        const serviceResponse: ServiceResponse<ItemResponse | null> = await itemService.getItemById(itemId, req.user.tenantId);
        return handleServiceResponse(serviceResponse, res);
    };

    public updateItem: RequestHandler = async (req: Request, res: Response) => {
        if (!req.user?.tenantId) {
            return handleServiceResponse(
                ServiceResponse.failure("Unauthorized", null, StatusCodes.UNAUTHORIZED),
                res
            );
        }
        const itemId = req.params.id;
        const data = UpdateItemSchema.parse(req.body);
        const serviceResponse: ServiceResponse<ItemResponse | null> = await itemService.updateItem(itemId, data, req.user.tenantId);
        return handleServiceResponse(serviceResponse, res);
    };  
    public deleteItem: RequestHandler = async (req: Request, res: Response) => {
        if (!req.user?.tenantId) {
            return handleServiceResponse(
                ServiceResponse.failure("Unauthorized", null, StatusCodes.UNAUTHORIZED),
                res
            );
        }
        const itemId = req.params.id;
        const serviceResponse: ServiceResponse<null> = await itemService.deleteItem(itemId, req.user.tenantId);
        return handleServiceResponse(serviceResponse, res);
    };
}

export const itemController = new UserController();