import { QuotationRequest, CreateQuotationRequestDTO, UpdateQuotationRequestDTO, Quotation, CreateQuotationDTO } from '../../domain/quotation';
export declare class QuotationRequestUseCases {
    getAllQuotationRequests(): Promise<QuotationRequest[]>;
    getQuotationRequestById(id: string): Promise<QuotationRequest | null>;
    getQuotationRequestsByStatus(status: string): Promise<QuotationRequest[]>;
    createQuotationRequest(data: CreateQuotationRequestDTO, createdById: string): Promise<QuotationRequest>;
    updateQuotationRequest(id: string, data: UpdateQuotationRequestDTO): Promise<QuotationRequest>;
    deleteQuotationRequest(id: string): Promise<void>;
    updateStatus(id: string, status: string): Promise<QuotationRequest>;
    selectQuotation(quotationRequestId: string, quotationId: string): Promise<QuotationRequest>;
}
export declare class QuotationUseCases {
    getAllQuotations(): Promise<Quotation[]>;
    getQuotationById(id: string): Promise<Quotation | null>;
    getQuotationsByRequest(quotationRequestId: string): Promise<Quotation[]>;
    createQuotation(data: CreateQuotationDTO, receivedById: string): Promise<Quotation>;
    updateStatus(id: string, status: string): Promise<Quotation>;
}
export declare const quotationRequestUseCases: QuotationRequestUseCases;
export declare const quotationUseCases: QuotationUseCases;
//# sourceMappingURL=quotationUseCases.d.ts.map