"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class SettingsRepository {
    async findByKey(key) {
        const result = await prisma.$queryRaw `SELECT * FROM "Setting" WHERE key = ${key}`;
        return result[0] || null;
    }
    async findByCategory(category) {
        return prisma.$queryRaw `SELECT * FROM "Setting" WHERE category = ${category}`;
    }
    async findAll() {
        return prisma.$queryRaw `SELECT * FROM "Setting"`;
    }
    async upsert(data) {
        const existing = await this.findByKey(data.key);
        if (existing) {
            await prisma.$executeRaw `UPDATE "Setting" SET value = ${data.value}, "updatedAt" = NOW() WHERE key = ${data.key}`;
        }
        else {
            await prisma.$executeRaw `INSERT INTO "Setting" (id, key, value, category, "isSecret", "createdAt", "updatedAt") 
        VALUES (gen_random_uuid(), ${data.key}, ${data.value}, ${data.category || 'general'}, ${data.isSecret || false}, NOW(), NOW())`;
        }
        return (await this.findByKey(data.key));
    }
    async delete(key) {
        await prisma.$executeRaw `DELETE FROM "Setting" WHERE key = ${key}`;
    }
    async deleteByCategory(category) {
        await prisma.$executeRaw `DELETE FROM "Setting" WHERE category = ${category}`;
    }
    async getSMTPConfig() {
        const settings = await this.findByCategory('smtp');
        if (settings.length === 0)
            return null;
        const config = {};
        for (const s of settings) {
            if (s.key === 'smtp_host')
                config.host = s.value;
            else if (s.key === 'smtp_port')
                config.port = parseInt(s.value);
            else if (s.key === 'smtp_secure')
                config.secure = s.value === 'true';
            else if (s.key === 'smtp_user')
                config.auth = { ...config.auth, user: s.value };
            else if (s.key === 'smtp_pass')
                config.auth = { ...config.auth, pass: s.value };
            else if (s.key === 'smtp_from')
                config.from = s.value;
        }
        if (!config.host || !config.auth?.user || !config.auth?.pass)
            return null;
        console.log('[EmailService] SMTP Config loaded:', {
            host: config.host,
            port: config.port,
            secure: config.secure,
            user: config.auth.user,
            passLength: config.auth.pass?.length
        });
        return config;
    }
}
exports.settingsRepository = new SettingsRepository();
exports.default = exports.settingsRepository;
//# sourceMappingURL=settingsRepository.js.map