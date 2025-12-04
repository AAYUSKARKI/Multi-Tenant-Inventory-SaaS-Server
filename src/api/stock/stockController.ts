import type { Request, RequestHandler, Response } from "express";
import { CreateStockSchema,StockResponse } from "./stockModel";
import { ServiceResponse, handleServiceResponse } from "@/common/utils/serviceResponse";
import { StatusCodes } from "http-status-codes";
import { stockService } from "./stockService";

class StockController {
    public createStock: RequestHandler = async (req: Request, res: Response) => {
        if (!req.user?.tenantId) {
            return handleServiceResponse(
                ServiceResponse.failure("Unauthorized", null, StatusCodes.UNAUTHORIZED),
                res
            );
        }
        const data = CreateStockSchema.parse(req.body);
        const serviceResponse: ServiceResponse<StockResponse | null> = await stockService.createStock(data, req.user.tenantId);
        return handleServiceResponse(serviceResponse, res);
    }
}

export const stockController = new StockController();