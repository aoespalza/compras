export interface EmailConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
    from?: string;
}
export interface EmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
}
declare class EmailService {
    private transporter;
    private config;
    private initialized;
    private getSettings;
    private getCompanySettings;
    private initializeTransporter;
    send(options: EmailOptions): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    testConnection(): Promise<{
        success: boolean;
        message: string;
    }>;
    isConfigured(): Promise<boolean>;
    static hashEmail(email: string): string;
}
export declare const emailService: EmailService;
export default emailService;
//# sourceMappingURL=emailService.d.ts.map