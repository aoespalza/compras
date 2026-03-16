"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsUseCases = exports.SettingsUseCases = void 0;
const settingsRepository_1 = require("../../infrastructure/repositories/settingsRepository");
class SettingsUseCases {
    async getAllSettings() {
        return settingsRepository_1.settingsRepository.findAll();
    }
    async getSettingsByCategory(category) {
        return settingsRepository_1.settingsRepository.findByCategory(category);
    }
    async getSetting(key) {
        return settingsRepository_1.settingsRepository.findByKey(key);
    }
    async updateSetting(key, value, description) {
        const setting = await settingsRepository_1.settingsRepository.findByKey(key);
        if (!setting) {
            throw new Error(`Configuración ${key} no encontrada`);
        }
        return settingsRepository_1.settingsRepository.upsert(key, value, setting.category, description || setting.description);
    }
    async initializeSettings() {
        await settingsRepository_1.settingsRepository.initializeDefaults();
    }
    // Validaciones
    async getValidationSettings() {
        const settings = await settingsRepository_1.settingsRepository.findByCategory('validation');
        return settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {});
    }
    // Email
    async getEmailSettings() {
        const settings = await settingsRepository_1.settingsRepository.findByCategory('email');
        return settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {});
    }
    // Empresa
    async getCompanySettings() {
        const settings = await settingsRepository_1.settingsRepository.findByCategory('general');
        return settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {});
    }
}
exports.SettingsUseCases = SettingsUseCases;
exports.settingsUseCases = new SettingsUseCases();
//# sourceMappingURL=settingsUseCases.js.map