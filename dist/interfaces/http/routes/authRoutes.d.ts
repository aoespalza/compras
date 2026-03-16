import { Request, Response } from 'express';
import { AuthRequest } from '../../../shared/middleware/auth';
export declare class AuthController {
    login(req: Request, res: Response): Promise<void>;
    getAllUsers(req: Request, res: Response): Promise<void>;
    getUserById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    createUser(req: AuthRequest, res: Response): Promise<void>;
    updateUser(req: AuthRequest, res: Response): Promise<void>;
    deleteUser(req: AuthRequest, res: Response): Promise<void>;
    getProfile(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const authController: AuthController;
//# sourceMappingURL=authRoutes.d.ts.map