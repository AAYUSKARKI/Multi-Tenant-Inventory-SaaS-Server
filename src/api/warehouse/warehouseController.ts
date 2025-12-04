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
}

export const warehouseController = new WarehouseController();