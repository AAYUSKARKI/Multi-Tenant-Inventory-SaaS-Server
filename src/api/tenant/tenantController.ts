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
}
export const tenantController = new TenantController();