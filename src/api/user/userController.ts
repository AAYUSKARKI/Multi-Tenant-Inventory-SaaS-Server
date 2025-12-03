import type { Request, RequestHandler, Response } from "express";
import { CreateUserSchema, UserResponse, type User } from "./userModel";
import { userService } from "./userService";
import { ServiceResponse, handleServiceResponse } from "@/common/utils/serviceResponse";

class UserController {
    public createUser: RequestHandler = async (req: Request, res: Response) => {
        const data = CreateUserSchema.parse(req.body);
        const serviceResponse: ServiceResponse<UserResponse | null> = await userService.createUser(data);
        return handleServiceResponse(serviceResponse, res);
    };
}

export const userController = new UserController();