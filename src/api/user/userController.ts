import type { Request, RequestHandler, Response } from "express";
import { CreateUserSchema,UpdateUserSchema, UserResponse, LoginUserSchema, TenantByEmail, TokenResponse } from "./userModel";
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
    
    public getTenantByEmail: RequestHandler = async (req: Request, res: Response) => {
        const email = req.body.email;
        const serviceResponse: ServiceResponse<TenantByEmail[] | null> = await userService.getTenantByEmail(email);
        return handleServiceResponse(serviceResponse, res);
    }

    public refreshToken: RequestHandler = async (req: Request, res: Response) => {
        if (!req.user?.tenantId) {
            return handleServiceResponse(
                ServiceResponse.failure("Unauthorized", null, StatusCodes.UNAUTHORIZED),
                res
            );
        }
        const { refreshToken } = req.body;
        try {
            const serviceResponse: ServiceResponse<TokenResponse | null> = await userService.refreshToken(req.user.id, req.user.tenantId, refreshToken);
            return handleServiceResponse(serviceResponse, res);
        } catch (error) {
            return handleServiceResponse(
                ServiceResponse.failure("Unauthorized", null, StatusCodes.UNAUTHORIZED),
                res
            );
        }
    }

    public logoutUser: RequestHandler = async (req: Request, res: Response) => {
        if (!req.user?.tenantId) {
            return handleServiceResponse(
                ServiceResponse.failure("Unauthorized", null, StatusCodes.UNAUTHORIZED),
                res
            );
        }

        const accessToken = req.headers.authorization?.replace("Bearer ", "").trim();

        if (!accessToken) {
            return handleServiceResponse(
                ServiceResponse.failure("Unauthorized", null, StatusCodes.UNAUTHORIZED),
                res
            );
        }

        const serviceResponse: ServiceResponse<null> = await userService.logoutUser(req.user.id, req.user.tenantId, accessToken);
        return handleServiceResponse(serviceResponse, res);
    }

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