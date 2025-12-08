import type { Request, RequestHandler, Response } from "express";
import { CreateStockSchema,StockBalanceResponse,StockResponse,UpdateStockSchema } from "./stockModel";
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

    public getStocks: RequestHandler = async (req: Request, res: Response) => {
        if (!req.user?.tenantId) {
            return handleServiceResponse(
                ServiceResponse.failure("Unauthorized", null, StatusCodes.UNAUTHORIZED),
                res
            );
        }
        const serviceResponse: ServiceResponse<StockResponse[]> = await stockService.getStocks(req.user.tenantId);
        return handleServiceResponse(serviceResponse, res);
    }

    public getStockById: RequestHandler = async (req: Request, res: Response) => {
        if (!req.user?.tenantId) {
            return handleServiceResponse(
                ServiceResponse.failure("Unauthorized", null, StatusCodes.UNAUTHORIZED),
                res
            );
        }
        const stockId = req.params.id;
        const serviceResponse: ServiceResponse<StockResponse | null> = await stockService.getStockById(stockId, req.user.tenantId);
        return handleServiceResponse(serviceResponse, res);
    }

    public getStockBalance: RequestHandler = async (req: Request, res: Response) => {
        if (!req.user?.tenantId) {
            return handleServiceResponse(
                ServiceResponse.failure("Unauthorized", null, StatusCodes.UNAUTHORIZED),
                res
            );
        }

        const { itemId, warehouseId, sku, offset = "0", limit = "10" } = req.query;

        const itemId_ = itemId && itemId !== "" ? String(itemId) : undefined;
        const warehouseId_ = warehouseId && warehouseId !== "" ? String(warehouseId) : undefined;
        const sku_ = sku && sku !== "" ? String(sku) : undefined;
        const offsetNumber = Number(offset);
        const limitNumber = Number(limit);
        const base_url=String(process.env.BASE_URL);
        const serviceResponse: ServiceResponse<StockBalanceResponse[]> = await stockService.getStockBalance({
            itemId: itemId_,
            warehouseId: warehouseId_,
            sku: sku_,
            offset: offsetNumber,
            limit: limitNumber
        }, req.user.tenantId);
        return handleServiceResponse(serviceResponse, res);
    }

    public updateStock: RequestHandler = async (req: Request, res: Response) => {
        if (!req.user?.tenantId) {
            return handleServiceResponse(
                ServiceResponse.failure("Unauthorized", null, StatusCodes.UNAUTHORIZED),
                res
            );
        }
        const stockId = req.params.id;
        const data = UpdateStockSchema.parse(req.body);
        const serviceResponse: ServiceResponse<StockResponse | null> = await stockService.updateStock(stockId, data, req.user.tenantId);
        return handleServiceResponse(serviceResponse, res);
    }

    public deleteStock: RequestHandler = async (req: Request, res: Response) => {
        if (!req.user?.tenantId) {
            return handleServiceResponse(
                ServiceResponse.failure("Unauthorized", null, StatusCodes.UNAUTHORIZED),
                res
            );
        }
        const stockId = req.params.id;
        const serviceResponse: ServiceResponse<StockResponse | null> = await stockService.deleteStock(stockId, req.user.tenantId);
        return handleServiceResponse(serviceResponse, res);
    }
}

export const stockController = new StockController();