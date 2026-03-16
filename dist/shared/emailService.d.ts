export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}
export declare class EmailService {
    private getFrom;
    sendEmail(options: EmailOptions): Promise<void>;
    testConnection(): Promise<boolean>;
    notifyQuotationRequestCreated(request: any, creator: any): Promise<void>;
    notifyQuotationReceived(quotation: any, supplier: any): Promise<void>;
    notifyQuotationAccepted(quotation: any, supplier: any): Promise<void>;
    notifyPurchaseOrderCreated(order: any, supplier: any): Promise<void>;
    notifyPurchaseOrderConfirmed(order: any): Promise<void>;
    notifyPurchaseOrderReceived(order: any): Promise<void>;
}
export declare const emailService: EmailService;
//# sourceMappingURL=emailService.d.ts.map