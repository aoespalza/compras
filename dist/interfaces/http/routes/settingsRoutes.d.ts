import { Request, Response } from 'express';
export declare class SettingsController {
    getAll(req: Request, res: Response): Promise<void>;
    getByCategory(req: Request, res: Response): Promise<void>;
    getByKey(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request, res: Response): Promise<void>;
    initialize(req: Request, res: Response): Promise<void>;
    getEmailSettings(req: Request, res: Response): Promise<void>;
    getValidationSettings(req: Request, res: Response): Promise<void>;
    getCompanySettings(req: Request, res: Response): Promise<void>;
    testEmailConnection(req: Request, res: Response): Promise<void>;
}
declare const settingsController: SettingsController;
export default settingsController;
//# sourceMappingURL=settingsRoutes.d.ts.map