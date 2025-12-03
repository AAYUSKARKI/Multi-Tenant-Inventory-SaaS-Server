import type { Request, RequestHandler, Response } from "express";
import { CreateUserSchema, UserResponse, LoginUserSchema } from "./userModel";
import { userService } from "./userService";
import { ServiceResponse, handleServiceResponse } from "@/common/utils/serviceResponse";
import { StatusCodes } from "http-status-codes";

class UserController {
    public createUser: RequestHandler = async (req: Request, res: Response) => {
        const data = CreateUserSchema.parse(req.body);
        const serviceResponse: ServiceResponse<UserResponse | null> = await userService.createUser(data);
        return handleServiceResponse(serviceResponse, res);
    };

    public loginUser: RequestHandler = async (req: Request, res: Response) => {
        const data = LoginUserSchema.parse(req.body);
        const serviceResponse: ServiceResponse<UserResponse | null> = await userService.loginUser(data);
        return handleServiceResponse(serviceResponse, res);
    };

    public getUsers: RequestHandler = async (req: Request, res: Response) => {
        if (!req.user?.tenantId) {
            return handleServiceResponse(
                ServiceResponse.failure("Unauthorized", null, StatusCodes.UNAUTHORIZED),
                res
            );
        }
        const serviceResponse: ServiceResponse<UserResponse[]> = await userService.getUsers(req.user.tenantId);
        return handleServiceResponse(serviceResponse, res);
    };
}

export const userController = new UserController();