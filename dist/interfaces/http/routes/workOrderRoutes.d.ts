import { Request, Response } from 'express';
export declare class WorkOrderController {
    getAll(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    create(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
    updateStatus(req: Request, res: Response): Promise<void>;
}
declare const _default: WorkOrderController;
export default _default;
//# sourceMappingURL=workOrderRoutes.d.ts.map