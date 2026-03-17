import { Request, Response } from 'express';
declare const _default: {
    getAll: (req: Request, res: Response) => Promise<void>;
    getById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    create: (req: Request, res: Response) => Promise<void>;
    update: (req: Request, res: Response) => Promise<void>;
    delete: (req: Request, res: Response) => Promise<void>;
    updateStatus: (req: Request, res: Response) => Promise<void>;
};
export default _default;
//# sourceMappingURL=contractRoutes.d.ts.map