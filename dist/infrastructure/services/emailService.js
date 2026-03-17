"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = require("crypto");
const settingsRepository_1 = require("../repositories/settingsRepository");
class EmailService {
    constructor() {
        this.transporter = null;
        this.config = null;
        this.initialized = false;
    }
    async getSettings() {
        try {
            const config = await settingsRepository_1.settingsRepository.getSMTPConfig();
            return config;
        }
        catch {
            return null;
        }
    }
    getCompanySettings() {
        return {
            name: process.env.COMPANY_NAME || 'PROCURA',
            email: process.env.COMPANY_EMAIL || 'noreply@procura.cl'
        };
    }
    async initializeTransporter() {
        if (this.initialized && this.transporter)
            return true;
        const settings = await this.getSettings();
        if (!settings) {
            console.log('[EmailService] SMTP no configurado');
            return false;
        }
        try {
            this.transporter = nodemailer_1.default.createTransport({
                host: settings.host,
                port: settings.port,
                secure: settings.secure,
                auth: {
                    user: settings.auth.user,
                    pass: settings.auth.pass
                },
                connectionTimeout: 10000,
                tls: {
                    rejectUnauthorized: false
                }
            });
            this.config = settings;
            this.initialized = true;
            console.log('[EmailService] Transporter inicializado:', { host: settings.host, port: settings.port, secure: settings.secure });
            return true;
        }
        catch (error) {
            console.error('[EmailService] Error al inicializar transporter:', error);
            return false;
        }
    }
    async send(options) {
        if (!await this.initializeTransporter()) {
            return { success: false, error: 'SMTP no configurado' };
        }
        const company = this.getCompanySettings();
        const to = Array.isArray(options.to) ? options.to.join(', ') : options.to;
        console.log(`[EmailService] Enviando a: ${to}, Subject: ${options.subject}`);
        const mailOptions = {
            from: this.config?.from || `"${company.name}" <${company.email}>`,
            to,
            subject: options.subject,
            html: options.html,
            text: options.text || options.html.replace(/<[^>]*>/g, '')
        };
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log(`[EmailService] ✓ Email enviado exitosamente a ${to}: ${info.messageId}`);
            return { success: true, messageId: info.messageId };
        }
        catch (error) {
            console.error(`[EmailService] ✗ Error al enviar email a ${to}:`, error.message || error);
            return { success: false, error: String(error) };
        }
    }
    async testConnection() {
        if (!await this.initializeTransporter()) {
            return { success: false, message: 'SMTP no configurado' };
        }
        try {
            await this.transporter.verify();
            return { success: true, message: 'Conexión exitosa' };
        }
        catch (error) {
            return { success: false, message: String(error) };
        }
    }
    async isConfigured() {
        const settings = await this.getSettings();
        return settings !== null;
    }
    // Generar hash para verificar email
    static hashEmail(email) {
        return (0, crypto_1.createHash)('sha256').update(email.toLowerCase()).digest('hex').substring(0, 8);
    }
}
exports.emailService = new EmailService();
exports.default = exports.emailService;
//# sourceMappingURL=emailService.js.map