import { Request, Response } from 'express';
export declare class ProjectController {
    getAll(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<void>;
    create(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
    updateStatus(req: Request, res: Response): Promise<void>;
}
declare const _default: ProjectController;
export default _default;
//# sourceMappingURL=projectRoutes.d.ts.map