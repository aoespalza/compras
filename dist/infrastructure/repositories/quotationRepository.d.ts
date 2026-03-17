import { QuotationRequest, CreateQuotationRequestDTO, UpdateQuotationRequestDTO, Quotation, CreateQuotationDTO } from '../../domain/quotation';
export declare class QuotationRequestRepository {
    findAll(): Promise<QuotationRequest[]>;
    findById(id: string): Promise<QuotationRequest | null>;
    findByStatus(status: string): Promise<QuotationRequest[]>;
    create(data: CreateQuotationRequestDTO, createdById: string): Promise<QuotationRequest>;
    update(id: string, data: UpdateQuotationRequestDTO): Promise<QuotationRequest>;
    delete(id: string): Promise<void>;
    updateStatus(id: string, status: string): Promise<QuotationRequest>;
    selectQuotation(quotationRequestId: string, quotationId: string): Promise<QuotationRequest>;
    private generateCode;
}
export declare class QuotationRepository {
    findAll(): Promise<Quotation[]>;
    findById(id: string): Promise<Quotation | null>;
    findByQuotationRequest(quotationRequestId: string): Promise<Quotation[]>;
    create(data: CreateQuotationDTO, receivedById: string): Promise<Quotation>;
    updateStatus(id: string, status: string): Promise<Quotation>;
    private generateCode;
}
export declare const quotationRequestRepository: QuotationRequestRepository;
export declare const quotationRepository: QuotationRepository;
//# sourceMappingURL=quotationRepository.d.ts.map