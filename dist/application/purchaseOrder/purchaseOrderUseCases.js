"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseReceiptUseCases = exports.purchaseOrderUseCases = exports.PurchaseReceiptUseCases = exports.PurchaseOrderUseCases = void 0;
const purchaseOrderRepository_1 = require("../../infrastructure/repositories/purchaseOrderRepository");
const supplierRepository_1 = require("../../infrastructure/repositories/supplierRepository");
const emailService_1 = require("../../shared/emailService");
class PurchaseOrderUseCases {
    async getAllPurchaseOrders() {
        return purchaseOrderRepository_1.purchaseOrderRepository.findAll();
    }
    async getPurchaseOrderById(id) {
        return purchaseOrderRepository_1.purchaseOrderRepository.findById(id);
    }
    async getPurchaseOrdersByStatus(status) {
        return purchaseOrderRepository_1.purchaseOrderRepository.findByStatus(status);
    }
    async getPurchaseOrdersBySupplier(supplierId) {
        return purchaseOrderRepository_1.purchaseOrderRepository.findBySupplier(supplierId);
    }
    async createPurchaseOrder(data, createdById) {
        const order = await purchaseOrderRepository_1.purchaseOrderRepository.create(data, createdById);
        // Notificación al proveedor
        const supplier = await supplierRepository_1.supplierRepository.findById(data.supplierId);
        if (supplier && supplier.email) {
            emailService_1.emailService.notifyPurchaseOrderCreated(order, supplier);
        }
        return order;
    }
    async updatePurchaseOrder(id, data) {
        const order = await purchaseOrderRepository_1.purchaseOrderRepository.findById(id);
        if (!order) {
            throw new Error('Orden de compra no encontrada');
        }
        return purchaseOrderRepository_1.purchaseOrderRepository.update(id, data);
    }
    async updateStatus(id, status, changedById, notes) {
        const order = await purchaseOrderRepository_1.purchaseOrderRepository.findById(id);
        if (!order) {
            throw new Error('Orden de compra no encontrada');
        }
        const updatedOrder = await purchaseOrderRepository_1.purchaseOrderRepository.updateStatus(id, status, changedById, notes);
        // Notificaciones según el estado
        if (status === 'CONFIRMED') {
            emailService_1.emailService.notifyPurchaseOrderConfirmed(updatedOrder);
        }
        else if (status === 'RECEIVED') {
            emailService_1.emailService.notifyPurchaseOrderReceived(updatedOrder);
        }
        return updatedOrder;
    }
    async deletePurchaseOrder(id) {
        const order = await purchaseOrderRepository_1.purchaseOrderRepository.findById(id);
        if (!order) {
            throw new Error('Orden de compra no encontrada');
        }
        if (order.status !== 'DRAFT') {
            throw new Error('Solo se pueden eliminar órdenes en estado BORRADOR');
        }
        await purchaseOrderRepository_1.purchaseOrderRepository.delete(id);
    }
}
exports.PurchaseOrderUseCases = PurchaseOrderUseCases;
class PurchaseReceiptUseCases {
    async getAllReceipts() {
        return purchaseOrderRepository_1.purchaseReceiptRepository.findAll();
    }
    async getReceiptById(id) {
        return purchaseOrderRepository_1.purchaseReceiptRepository.findById(id);
    }
    async getReceiptsByOrder(purchaseOrderId) {
        return purchaseOrderRepository_1.purchaseReceiptRepository.findByPurchaseOrder(purchaseOrderId);
    }
    async createReceipt(data) {
        const order = await purchaseOrderRepository_1.purchaseOrderRepository.findById(data.purchaseOrderId);
        if (!order) {
            throw new Error('Orden de compra no encontrada');
        }
        if (order.status === 'CANCELLED' || order.status === 'RECEIVED') {
            throw new Error('No se puede recibir materiales de esta orden');
        }
        const receipt = await purchaseOrderRepository_1.purchaseReceiptRepository.create(data);
        // Update items received
        for (const item of data.items) {
            await purchaseOrderRepository_1.purchaseReceiptRepository.updateOrderItemReceived(item.purchaseOrderItemId, item.quantityReceived);
        }
        // Check if order is fully received
        const updatedOrder = await purchaseOrderRepository_1.purchaseOrderRepository.findById(data.purchaseOrderId);
        if (updatedOrder) {
            const allReceived = updatedOrder.items?.every(item => item.status === 'RECEIVED');
            const partiallyReceived = updatedOrder.items?.some(item => item.quantityReceived > 0);
            if (allReceived) {
                await purchaseOrderRepository_1.purchaseOrderRepository.updateStatus(data.purchaseOrderId, 'RECEIVED', data.receivedBy || 'system', 'Recepción completa');
            }
            else if (partiallyReceived) {
                await purchaseOrderRepository_1.purchaseOrderRepository.updateStatus(data.purchaseOrderId, 'PARTIALLY_RECEIVED', data.receivedBy || 'system', 'Recepción parcial');
            }
        }
        return receipt;
    }
}
exports.PurchaseReceiptUseCases = PurchaseReceiptUseCases;
exports.purchaseOrderUseCases = new PurchaseOrderUseCases();
exports.purchaseReceiptUseCases = new PurchaseReceiptUseCases();
//# sourceMappingURL=purchaseOrderUseCases.js.map