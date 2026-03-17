// Domain Entity: Purchase Order
export type PurchaseOrderStatus = 
  | 'DRAFT'
  | 'SENT'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'PARTIALLY_RECEIVED'
  | 'RECEIVED'
  | 'CANCELLED';

export type PurchaseOrderItemStatus = 
  | 'PENDING'
  | 'PARTIALLY_RECEIVED'
  | 'RECEIVED';

export interface PurchaseOrderItem {
  id: string;
  purchaseOrderId: string;
  materialId?: string | null;
  description: string;
  quantity: number;
  unitOfMeasure: string;
  unitPrice: number;
  discount: number;
  total: number;
  quantityReceived: number;
  status: PurchaseOrderItemStatus;
  quotationItemId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseOrderStatusHistory {
  id: string;
  purchaseOrderId: string;
  status: PurchaseOrderStatus;
  changedById: string;
  changedAt: Date;
  notes?: string | null;
}

export interface PurchaseOrder {
  id: string;
  code: string;
  supplierId: string;
  projectName?: string | null;
  description?: string | null;
  deliveryAddress?: string | null;
  requiredDate?: Date | null;
  orderDate: Date;
  confirmationDate?: Date | null;
  expectedDelivery?: Date | null;
  receivedDate?: Date | null;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: PurchaseOrderStatus;
  paymentTerms?: string | null;
  deliveryTerms?: string | null;
  createdById: string;
  approvedById?: string | null;
  createdAt: Date;
  updatedAt: Date;
  items?: PurchaseOrderItem[];
  statusHistory?: PurchaseOrderStatusHistory[];
}

export interface CreatePurchaseOrderDTO {
  supplierId: string;
  projectName?: string;
  description?: string;
  deliveryAddress?: string;
  requiredDate?: Date;
  expectedDelivery?: Date;
  paymentTerms?: string;
  deliveryTerms?: string;
  items: Array<{
    materialId?: string;
    description: string;
    quantity: number;
    unitOfMeasure: string;
    unitPrice: number;
    discount?: number;
  }>;
}

export interface UpdatePurchaseOrderDTO {
  supplierId?: string;
  projectName?: string;
  description?: string;
  deliveryAddress?: string;
  requiredDate?: Date;
  expectedDelivery?: Date;
  paymentTerms?: string;
  deliveryTerms?: string;
  status?: PurchaseOrderStatus;
}

// Receipt
export interface PurchaseReceiptItem {
  id: string;
  receiptId: string;
  purchaseOrderItemId: string;
  quantityReceived: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseReceipt {
  id: string;
  purchaseOrderId: string;
  receiptDate: Date;
  receivedBy?: string | null;
  observations?: string | null;
  createdAt: Date;
  updatedAt: Date;
  items?: PurchaseReceiptItem[];
}

export interface CreatePurchaseReceiptDTO {
  purchaseOrderId: string;
  receiptDate?: Date;
  receivedBy?: string;
  observations?: string;
  items: Array<{
    purchaseOrderItemId: string;
    quantityReceived: number;
  }>;
}
