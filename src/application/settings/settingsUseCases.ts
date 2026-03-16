import { settingsRepository } from '../../infrastructure/repositories/settingsRepository';

export class SettingsUseCases {
  async getAllSettings(): Promise<any[]> {
    return settingsRepository.findAll();
  }

  async getSettingsByCategory(category: string): Promise<any[]> {
    return settingsRepository.findByCategory(category);
  }

  async getSetting(key: string): Promise<any | null> {
    return settingsRepository.findByKey(key);
  }

  async updateSetting(key: string, value: string, description?: string): Promise<any> {
    const setting = await settingsRepository.findByKey(key);
    if (!setting) {
      throw new Error(`Configuración ${key} no encontrada`);
    }
    return settingsRepository.upsert(key, value, setting.category, description || setting.description);
  }

  async initializeSettings(): Promise<void> {
    await settingsRepository.initializeDefaults();
  }

  // Validaciones
  async getValidationSettings(): Promise<Record<string, string>> {
    const settings = await settingsRepository.findByCategory('validation');
    return settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {});
  }

  // Email
  async getEmailSettings(): Promise<Record<string, string>> {
    const settings = await settingsRepository.findByCategory('email');
    return settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {});
  }

  // Empresa
  async getCompanySettings(): Promise<Record<string, string>> {
    const settings = await settingsRepository.findByCategory('general');
    return settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {});
  }
}

export const settingsUseCases = new SettingsUseCases();
