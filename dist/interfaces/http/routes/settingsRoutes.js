"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsController = void 0;
const settingsUseCases_1 = require("../../../application/settings/settingsUseCases");
const emailService_1 = require("../../../shared/emailService");
class SettingsController {
    async getAll(req, res) {
        try {
            const settings = await settingsUseCases_1.settingsUseCases.getAllSettings();
            res.json(settings);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getByCategory(req, res) {
        try {
            const { category } = req.params;
            const settings = await settingsUseCases_1.settingsUseCases.getSettingsByCategory(category);
            res.json(settings);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getByKey(req, res) {
        try {
            const { key } = req.params;
            const setting = await settingsUseCases_1.settingsUseCases.getSetting(key);
            if (!setting) {
                return res.status(404).json({ error: 'Configuración no encontrada' });
            }
            res.json(setting);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async update(req, res) {
        try {
            const { key } = req.params;
            const { value, description } = req.body;
            const setting = await settingsUseCases_1.settingsUseCases.updateSetting(key, value, description);
            res.json(setting);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async initialize(req, res) {
        try {
            await settingsUseCases_1.settingsUseCases.initializeSettings();
            res.json({ message: 'Configuraciones inicializadas correctamente' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // Obtener configuración de email
    async getEmailSettings(req, res) {
        try {
            const settings = await settingsUseCases_1.settingsUseCases.getEmailSettings();
            // No devolver la contraseña
            const safeSettings = { ...settings, EMAIL_PASS: settings.EMAIL_PASS ? '••••••••' : '' };
            res.json(safeSettings);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // Obtener configuración de validaciones
    async getValidationSettings(req, res) {
        try {
            const settings = await settingsUseCases_1.settingsUseCases.getValidationSettings();
            res.json(settings);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // Obtener configuración de empresa
    async getCompanySettings(req, res) {
        try {
            const settings = await settingsUseCases_1.settingsUseCases.getCompanySettings();
            res.json(settings);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // Probar conexión de email
    async testEmailConnection(req, res) {
        try {
            const result = await emailService_1.emailService.testConnection();
            res.json({ success: true, message: 'Conexión exitosa' });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.SettingsController = SettingsController;
const settingsController = new SettingsController();
exports.default = settingsController;
//# sourceMappingURL=settingsRoutes.js.map