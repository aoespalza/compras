import { purchaseOrderRepository, purchaseReceiptRepository } from '../../infrastructure/repositories/purchaseOrderRepository';
import { 
  PurchaseOrder, 
  CreatePurchaseOrderDTO, 
  UpdatePurchaseOrderDTO,
  PurchaseReceipt,
  CreatePurchaseReceiptDTO 
} from '../../domain/purchaseOrder';

export class PurchaseOrderUseCases {
  async getAllPurchaseOrders(): Promise<PurchaseOrder[]> {
    return purchaseOrderRepository.findAll();
  }

  async getPurchaseOrderById(id: string): Promise<PurchaseOrder | null> {
    return purchaseOrderRepository.findById(id);
  }

  async getPurchaseOrdersByStatus(status: string): Promise<PurchaseOrder[]> {
    return purchaseOrderRepository.findByStatus(status);
  }

  async getPurchaseOrdersBySupplier(supplierId: string): Promise<PurchaseOrder[]> {
    return purchaseOrderRepository.findBySupplier(supplierId);
  }

  async createPurchaseOrder(data: CreatePurchaseOrderDTO, createdById: string): Promise<PurchaseOrder> {
    return purchaseOrderRepository.create(data, createdById);
  }

  async updatePurchaseOrder(id: string, data: UpdatePurchaseOrderDTO): Promise<PurchaseOrder> {
    const order = await purchaseOrderRepository.findById(id);
    if (!order) {
      throw new Error('Orden de compra no encontrada');
    }
    return purchaseOrderRepository.update(id, data);
  }

  async updateStatus(id: string, status: string, changedById: string, notes?: string): Promise<PurchaseOrder> {
    const order = await purchaseOrderRepository.findById(id);
    if (!order) {
      throw new Error('Orden de compra no encontrada');
    }
    return purchaseOrderRepository.updateStatus(id, status, changedById, notes);
  }

  async deletePurchaseOrder(id: string): Promise<void> {
    const order = await purchaseOrderRepository.findById(id);
    if (!order) {
      throw new Error('Orden de compra no encontrada');
    }
    if (order.status !== 'DRAFT') {
      throw new Error('Solo se pueden eliminar órdenes en estado BORRADOR');
    }
    await purchaseOrderRepository.delete(id);
  }
}

export class PurchaseReceiptUseCases {
  async getAllReceipts(): Promise<PurchaseReceipt[]> {
    return purchaseReceiptRepository.findAll();
  }

  async getReceiptById(id: string): Promise<PurchaseReceipt | null> {
    return purchaseReceiptRepository.findById(id);
  }

  async getReceiptsByOrder(purchaseOrderId: string): Promise<PurchaseReceipt[]> {
    return purchaseReceiptRepository.findByPurchaseOrder(purchaseOrderId);
  }

  async createReceipt(data: CreatePurchaseReceiptDTO): Promise<PurchaseReceipt> {
    const order = await purchaseOrderRepository.findById(data.purchaseOrderId);
    if (!order) {
      throw new Error('Orden de compra no encontrada');
    }
    
    if (order.status === 'CANCELLED' || order.status === 'RECEIVED') {
      throw new Error('No se puede recibir materiales de esta orden');
    }

    const receipt = await purchaseReceiptRepository.create(data);
    
    // Update items received
    for (const item of data.items) {
      await purchaseReceiptRepository.updateOrderItemReceived(item.purchaseOrderItemId, item.quantityReceived);
    }

    // Check if order is fully received
    const updatedOrder = await purchaseOrderRepository.findById(data.purchaseOrderId);
    if (updatedOrder) {
      const allReceived = updatedOrder.items?.every(item => item.status === 'RECEIVED');
      const partiallyReceived = updatedOrder.items?.some(item => item.quantityReceived > 0);
      
      if (allReceived) {
        await purchaseOrderRepository.updateStatus(data.purchaseOrderId, 'RECEIVED', data.receivedBy || 'system', 'Recepción completa');
      } else if (partiallyReceived) {
        await purchaseOrderRepository.updateStatus(data.purchaseOrderId, 'PARTIALLY_RECEIVED', data.receivedBy || 'system', 'Recepción parcial');
      }
    }

    return receipt;
  }
}

export const purchaseOrderUseCases = new PurchaseOrderUseCases();
export const purchaseReceiptUseCases = new PurchaseReceiptUseCases();
