import type { Request, RequestHandler, Response } from "express";
import { CreateTenantSchema, type Tenant } from "./tenantModel";
import { tenantService } from "./tenantService";
import { ServiceResponse, handleServiceResponse } from "@/common/utils/serviceResponse";

class TenantController {
    public createTenant: RequestHandler = async (req: Request, res: Response) => {
        const data = CreateTenantSchema.parse(req.body);
        const serviceResponse: ServiceResponse<Tenant | null> = await tenantService.createTenant(data);
        return handleServiceResponse(serviceResponse, res);
    }

    public getTenants: RequestHandler = async (req: Request, res: Response) => {
        const serviceResponse: ServiceResponse<Tenant[]> = await tenantService.getTenants();
        return handleServiceResponse(serviceResponse, res);
    }

    public getTenantById: RequestHandler = async (req: Request, res: Response) => {
        const tenantId = req.params.id;
        const serviceResponse: ServiceResponse<Tenant | null> = await tenantService.getTenantById(tenantId);
        return handleServiceResponse(serviceResponse, res);
    }

    public deleteTenant: RequestHandler = async (req: Request, res: Response) => {
        const tenantId = req.params.id;
        const serviceResponse: ServiceResponse<null> = await tenantService.deleteTenant(tenantId);
        return handleServiceResponse(serviceResponse, res);
    }

    public updateTenant: RequestHandler = async (req: Request, res: Response) => {
        const tenantId = req.params.id;
        const data = CreateTenantSchema.parse(req.body);
        const serviceResponse: ServiceResponse<Tenant | null> = await tenantService.updateTenant(tenantId, data);
        return handleServiceResponse(serviceResponse, res);
    }
}
export const tenantController = new TenantController();