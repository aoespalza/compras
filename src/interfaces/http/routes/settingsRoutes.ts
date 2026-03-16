import { Request, Response } from 'express';
import { settingsUseCases } from '../../../application/settings/settingsUseCases';
import { emailService } from '../../../shared/emailService';

export class SettingsController {
  async getAll(req: Request, res: Response) {
    try {
      const settings = await settingsUseCases.getAllSettings();
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByCategory(req: Request, res: Response) {
    try {
      const { category } = req.params;
      const settings = await settingsUseCases.getSettingsByCategory(category);
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByKey(req: Request, res: Response) {
    try {
      const { key } = req.params;
      const setting = await settingsUseCases.getSetting(key);
      if (!setting) {
        return res.status(404).json({ error: 'Configuración no encontrada' });
      }
      res.json(setting);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { key } = req.params;
      const { value, description } = req.body;
      const setting = await settingsUseCases.updateSetting(key, value, description);
      res.json(setting);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async initialize(req: Request, res: Response) {
    try {
      await settingsUseCases.initializeSettings();
      res.json({ message: 'Configuraciones inicializadas correctamente' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Obtener configuración de email
  async getEmailSettings(req: Request, res: Response) {
    try {
      const settings = await settingsUseCases.getEmailSettings();
      // No devolver la contraseña
      const safeSettings = { ...settings, EMAIL_PASS: settings.EMAIL_PASS ? '••••••••' : '' };
      res.json(safeSettings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Obtener configuración de validaciones
  async getValidationSettings(req: Request, res: Response) {
    try {
      const settings = await settingsUseCases.getValidationSettings();
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Obtener configuración de empresa
  async getCompanySettings(req: Request, res: Response) {
    try {
      const settings = await settingsUseCases.getCompanySettings();
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Probar conexión de email
  async testEmailConnection(req: Request, res: Response) {
    try {
      const result = await emailService.testConnection();
      res.json({ success: true, message: 'Conexión exitosa' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

const settingsController = new SettingsController();
export default settingsController;
