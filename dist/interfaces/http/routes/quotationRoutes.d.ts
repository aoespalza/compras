import { Request, Response } from 'express';
import { AuthRequest } from '../../../shared/middleware/auth';
export declare class QuotationRequestController {
    getAll(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    create(req: AuthRequest, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
    updateStatus(req: Request, res: Response): Promise<void>;
    selectQuotation(req: Request, res: Response): Promise<void>;
    sendToSuppliers(req: Request, res: Response): Promise<void>;
}
export declare class QuotationController {
    getAll(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getByRequest(req: Request, res: Response): Promise<void>;
    create(req: AuthRequest, res: Response): Promise<void>;
    updateStatus(req: Request, res: Response): Promise<void>;
}
export declare const quotationRequestController: QuotationRequestController;
export declare const quotationController: QuotationController;
//# sourceMappingURL=quotationRoutes.d.ts.map