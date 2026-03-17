import { PurchaseOrder, CreatePurchaseOrderDTO, UpdatePurchaseOrderDTO, PurchaseReceipt, CreatePurchaseReceiptDTO } from '../../domain/purchaseOrder';
export declare class PurchaseOrderRepository {
    findAll(): Promise<PurchaseOrder[]>;
    findById(id: string): Promise<PurchaseOrder | null>;
    findByStatus(status: string): Promise<PurchaseOrder[]>;
    findBySupplier(supplierId: string): Promise<PurchaseOrder[]>;
    create(data: CreatePurchaseOrderDTO, createdById: string): Promise<PurchaseOrder>;
    update(id: string, data: UpdatePurchaseOrderDTO): Promise<PurchaseOrder>;
    updateStatus(id: string, status: string, changedById: string, notes?: string): Promise<PurchaseOrder>;
    delete(id: string): Promise<void>;
    private generateCode;
}
export declare class PurchaseReceiptRepository {
    findAll(): Promise<PurchaseReceipt[]>;
    findById(id: string): Promise<PurchaseReceipt | null>;
    findByPurchaseOrder(purchaseOrderId: string): Promise<PurchaseReceipt[]>;
    create(data: CreatePurchaseReceiptDTO): Promise<PurchaseReceipt>;
    updateOrderItemReceived(itemId: string, quantityReceived: number): Promise<void>;
}
export declare const purchaseOrderRepository: PurchaseOrderRepository;
export declare const purchaseReceiptRepository: PurchaseReceiptRepository;
//# sourceMappingURL=purchaseOrderRepository.d.ts.map