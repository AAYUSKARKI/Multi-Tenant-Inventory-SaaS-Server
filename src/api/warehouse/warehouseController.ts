import type { Request, RequestHandler, Response } from "express";
import { CreateWarehouseSchema, WarehouseResponse, type Warehouse } from "./warehouseModel";
import { warehouseService } from "./warehouseService";
import { ServiceResponse, handleServiceResponse } from "@/common/utils/serviceResponse";
import { StatusCodes } from "http-status-codes";

class WarehouseController {
    public createWarehouse: RequestHandler = async (req: Request, res: Response) => {
        if (!req.user?.tenantId) {
            return handleServiceResponse(
                ServiceResponse.failure("Unauthorized", null, StatusCodes.UNAUTHORIZED),
                res
            );
        }
        const data = CreateWarehouseSchema.parse(req.body);
        const serviceResponse: ServiceResponse<WarehouseResponse | null> = await warehouseService.createWarehouse(data, req.user.tenantId);
        return handleServiceResponse(serviceResponse, res);
    };

    public getWarehouses: RequestHandler = async (req: Request, res: Response) => {
        if (!req.user?.tenantId) {
            return handleServiceResponse(
                ServiceResponse.failure("Unauthorized", null, StatusCodes.UNAUTHORIZED),
                res
            );
        }
        const serviceResponse: ServiceResponse<Warehouse[]> = await warehouseService.getWarehouses(req.user.tenantId);
        return handleServiceResponse(serviceResponse, res);
    }; 

    public getWarehouseById: RequestHandler = async (req: Request, res: Response) => {
        if (!req.user?.tenantId) {
            return handleServiceResponse(
                ServiceResponse.failure("Unauthorized", null, StatusCodes.UNAUTHORIZED),
                res
            );
        }
        const warehouseId = req.params.id;
        const serviceResponse: ServiceResponse<Warehouse | null> = await warehouseService.getWarehouseById(warehouseId, req.user.tenantId);
        return handleServiceResponse(serviceResponse, res);
    };
}

export const warehouseController = new WarehouseController();