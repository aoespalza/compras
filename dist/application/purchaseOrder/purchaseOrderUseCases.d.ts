import { PurchaseOrder, CreatePurchaseOrderDTO, UpdatePurchaseOrderDTO, PurchaseReceipt, CreatePurchaseReceiptDTO } from '../../domain/purchaseOrder';
export declare class PurchaseOrderUseCases {
    getAllPurchaseOrders(): Promise<PurchaseOrder[]>;
    getPurchaseOrderById(id: string): Promise<PurchaseOrder | null>;
    getPurchaseOrdersByStatus(status: string): Promise<PurchaseOrder[]>;
    getPurchaseOrdersBySupplier(supplierId: string): Promise<PurchaseOrder[]>;
    createPurchaseOrder(data: CreatePurchaseOrderDTO, createdById: string): Promise<PurchaseOrder>;
    updatePurchaseOrder(id: string, data: UpdatePurchaseOrderDTO): Promise<PurchaseOrder>;
    updateStatus(id: string, status: string, changedById: string, notes?: string): Promise<PurchaseOrder>;
    deletePurchaseOrder(id: string): Promise<void>;
}
export declare class PurchaseReceiptUseCases {
    getAllReceipts(): Promise<PurchaseReceipt[]>;
    getReceiptById(id: string): Promise<PurchaseReceipt | null>;
    getReceiptsByOrder(purchaseOrderId: string): Promise<PurchaseReceipt[]>;
    createReceipt(data: CreatePurchaseReceiptDTO): Promise<PurchaseReceipt>;
}
export declare const purchaseOrderUseCases: PurchaseOrderUseCases;
export declare const purchaseReceiptUseCases: PurchaseReceiptUseCases;
//# sourceMappingURL=purchaseOrderUseCases.d.ts.map