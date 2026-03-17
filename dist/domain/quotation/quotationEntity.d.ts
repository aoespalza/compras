export type QuotationRequestStatus = 'DRAFT' | 'SENT' | 'RECEIVED' | 'COMPARING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type QuotationStatus = 'PENDING' | 'RECEIVED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
export interface QuotationRequestItem {
    id: string;
    quotationRequestId: string;
    materialId?: string | null;
    description: string;
    quantity: number;
    unitOfMeasure: string;
    observations?: string | null;
    createdAt: Date;
    updatedAt: Date;
    material?: {
        id: string;
        code: string;
        name: string;
        description?: string | null;
    } | null;
}
export interface QuotationRequest {
    id: string;
    code: string;
    title: string;
    description?: string | null;
    projectName?: string | null;
    priority?: string | null;
    requiredDate?: Date | null;
    deliveryAddress?: string | null;
    status: QuotationRequestStatus;
    createdById: string;
    selectedQuotationId?: string | null;
    createdAt: Date;
    updatedAt: Date;
    items?: QuotationRequestItem[];
}
export interface CreateQuotationRequestDTO {
    title: string;
    description?: string;
    projectName?: string;
    priority?: string;
    requiredDate?: Date;
    deliveryAddress?: string;
    items: Array<{
        materialId?: string;
        description: string;
        quantity: number;
        unitOfMeasure: string;
        observations?: string;
    }>;
}
export interface UpdateQuotationRequestDTO {
    title?: string;
    description?: string;
    projectName?: string;
    priority?: string;
    requiredDate?: Date;
    deliveryAddress?: string;
    status?: QuotationRequestStatus;
    selectedQuotationId?: string;
}
export interface QuotationItem {
    id: string;
    quotationId: string;
    quotationRequestItemId: string;
    unitPrice: number;
    quantity: number;
    discount: number;
    total: number;
    deliveryTime?: string | null;
    availability?: string | null;
    brand?: string | null;
    observations?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface Quotation {
    id: string;
    code: string;
    quotationRequestId: string;
    supplierId: string;
    quotationDate: Date;
    validUntil?: Date | null;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    status: QuotationStatus;
    notes?: string | null;
    paymentTerms?: string | null;
    deliveryTime?: string | null;
    receivedById?: string | null;
    createdAt: Date;
    updatedAt: Date;
    items?: QuotationItem[];
}
export interface CreateQuotationDTO {
    quotationRequestId: string;
    supplierId: string;
    validUntil?: Date;
    items: Array<{
        quotationRequestItemId: string;
        unitPrice: number;
        quantity: number;
        discount?: number;
        deliveryTime?: string;
        availability?: string;
        brand?: string;
        observations?: string;
    }>;
    notes?: string;
    paymentTerms?: string;
    deliveryTime?: string;
}
//# sourceMappingURL=quotationEntity.d.ts.map