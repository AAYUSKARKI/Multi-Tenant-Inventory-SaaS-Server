import type { Request, RequestHandler, Response } from "express";
import { CreateUserSchema,UpdateUserSchema, UserResponse, LoginUserSchema } from "./userModel";
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

    public getUserById: RequestHandler = async (req: Request, res: Response) => {
        if (!req.user?.tenantId) {
            return handleServiceResponse(
                ServiceResponse.failure("Unauthorized", null, StatusCodes.UNAUTHORIZED),
                res
            );
        }
        const userId = req.params.id;
        const serviceResponse: ServiceResponse<UserResponse | null> = await userService.getUserById(userId, req.user.tenantId);
        return handleServiceResponse(serviceResponse, res);
    };

    public updateUser: RequestHandler = async (req: Request, res: Response) => {
        if (!req.user?.tenantId) {
            return handleServiceResponse(
                ServiceResponse.failure("Unauthorized", null, StatusCodes.UNAUTHORIZED),
                res
            );
        }
        const userId = req.params.id;
        const data = UpdateUserSchema.parse(req.body);
        const serviceResponse: ServiceResponse<UserResponse | null> = await userService.updateUser(data, req.user.tenantId, userId);
        return handleServiceResponse(serviceResponse, res);
    };

    public deleteUser: RequestHandler = async (req: Request, res: Response) => {
        if (!req.user?.tenantId) {
            return handleServiceResponse(
                ServiceResponse.failure("Unauthorized", null, StatusCodes.UNAUTHORIZED),
                res
            );
        }
        const userId = req.params.id;
        const serviceResponse: ServiceResponse<null> = await userService.deleteUser(userId, req.user.tenantId);
        return handleServiceResponse(serviceResponse, res);
    };
}

export const userController = new UserController();