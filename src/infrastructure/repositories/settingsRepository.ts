import prisma from '../prisma/client';

export class SettingsRepository {
  async findAll(): Promise<any[]> {
    return prisma.settings.findMany({
      orderBy: [{ category: 'asc' }, { key: 'asc' }],
    });
  }

  async findByKey(key: string): Promise<any | null> {
    return prisma.settings.findUnique({
      where: { key },
    });
  }

  async findByCategory(category: string): Promise<any[]> {
    return prisma.settings.findMany({
      where: { category },
      orderBy: { key: 'asc' },
    });
  }

  async upsert(key: string, value: string, category: string = 'general', description?: string): Promise<any> {
    return prisma.settings.upsert({
      where: { key },
      update: { value, description },
      create: { key, value, category, description },
    });
  }

  async delete(key: string): Promise<void> {
    await prisma.settings.delete({
      where: { key },
    });
  }

  async initializeDefaults(): Promise<void> {
    const defaults = [
      // Configuración de Email
      { key: 'EMAIL_HOST', value: 'smtp.gmail.com', category: 'email', description: 'Servidor SMTP' },
      { key: 'EMAIL_PORT', value: '587', category: 'email', description: 'Puerto SMTP' },
      { key: 'EMAIL_SECURE', value: 'false', category: 'email', description: 'Usar TLS' },
      { key: 'EMAIL_USER', value: '', category: 'email', description: 'Usuario de correo' },
      { key: 'EMAIL_PASS', value: '', category: 'email', description: 'Password de correo' },
      { key: 'EMAIL_FROM', value: 'PROCURA <noreply@empresa.com>', category: 'email', description: 'Remitente por defecto' },
      { key: 'EMAIL_NOTIFICATIONS_ENABLED', value: 'false', category: 'email', description: 'Habilitar notificaciones' },
      
      // Configuración de Validaciones
      { key: 'VALIDATION_SUPPLIER_CODE_AUTO', value: 'true', category: 'validation', description: 'Código automático de proveedores' },
      { key: 'VALIDATION_MATERIAL_CODE_AUTO', value: 'true', category: 'validation', description: 'Código automático de materiales' },
      { key: 'VALIDATION_MIN_SUPPLIER_NAME', value: '3', category: 'validation', description: 'Mínimo caracteres nombre proveedor' },
      { key: 'VALIDATION_REQUIRE_PROJECT_NAME', value: 'false', category: 'validation', description: 'Proyecto obligatorio en OC' },
      { key: 'VALIDATION_DEFAULT_TAX_RATE', value: '19', category: 'validation', description: 'Tasa de impuesto por defecto (%)' },
      { key: 'VALIDATION_MIN_ORDER_AMOUNT', value: '0', category: 'validation', description: 'Monto mínimo de orden' },
      
      // Configuración General
      { key: 'COMPANY_NAME', value: 'Mi Empresa', category: 'general', description: 'Nombre de la empresa' },
      { key: 'COMPANY_RUT', value: '', category: 'general', description: 'RUT de la empresa' },
      { key: 'COMPANY_ADDRESS', value: '', category: 'general', description: 'Dirección de la empresa' },
      { key: 'COMPANY_PHONE', value: '', category: 'general', description: 'Teléfono de la empresa' },
      { key: 'COMPANY_EMAIL', value: '', category: 'general', description: 'Email de la empresa' },
    ];

    for (const setting of defaults) {
      await this.upsert(setting.key, setting.value, setting.category, setting.description);
    }
  }
}

export const settingsRepository = new SettingsRepository();
