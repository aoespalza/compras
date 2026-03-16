import { Request, Response } from 'express';
import { AuthRequest } from '../../../shared/middleware/auth';
export declare class PurchaseOrderController {
    getAll(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    create(req: AuthRequest, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    updateStatus(req: AuthRequest, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
}
export declare class PurchaseReceiptController {
    getAll(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getByOrder(req: Request, res: Response): Promise<void>;
    create(req: AuthRequest, res: Response): Promise<void>;
}
export declare const purchaseOrderController: PurchaseOrderController;
export declare const purchaseReceiptController: PurchaseReceiptController;
//# sourceMappingURL=purchaseOrderRoutes.d.ts.map