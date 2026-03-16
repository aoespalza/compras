"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseReceiptRepository = exports.purchaseOrderRepository = exports.PurchaseReceiptRepository = exports.PurchaseOrderRepository = void 0;
const client_1 = __importDefault(require("../prisma/client"));
class PurchaseOrderRepository {
    async findAll() {
        return client_1.default.purchaseOrder.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                supplier: true,
                items: true,
                statusHistory: {
                    orderBy: { changedAt: 'desc' },
                },
            },
        });
    }
    async findById(id) {
        return client_1.default.purchaseOrder.findUnique({
            where: { id },
            include: {
                supplier: true,
                items: true,
                statusHistory: {
                    orderBy: { changedAt: 'desc' },
                },
            },
        });
    }
    async findByStatus(status) {
        return client_1.default.purchaseOrder.findMany({
            where: { status: status },
            orderBy: { createdAt: 'desc' },
            include: { supplier: true, items: true },
        });
    }
    async findBySupplier(supplierId) {
        return client_1.default.purchaseOrder.findMany({
            where: { supplierId },
            orderBy: { createdAt: 'desc' },
            include: { items: true },
        });
    }
    async create(data, createdById) {
        const code = await this.generateCode();
        let subtotal = 0;
        const itemsData = data.items.map(item => {
            const total = item.unitPrice * item.quantity - (item.discount || 0);
            subtotal += total;
            return {
                materialId: item.materialId,
                description: item.description,
                quantity: item.quantity,
                unitOfMeasure: item.unitOfMeasure,
                unitPrice: item.unitPrice,
                discount: item.discount || 0,
                total,
            };
        });
        const tax = subtotal * 0.19;
        const total = subtotal + tax;
        return client_1.default.purchaseOrder.create({
            data: {
                code,
                supplierId: data.supplierId,
                projectName: data.projectName,
                description: data.description,
                deliveryAddress: data.deliveryAddress,
                requiredDate: data.requiredDate ? new Date(data.requiredDate) : null,
                expectedDelivery: data.expectedDelivery ? new Date(data.expectedDelivery) : null,
                paymentTerms: data.paymentTerms,
                deliveryTerms: data.deliveryTerms,
                subtotal,
                discount: 0,
                tax,
                total,
                createdById,
                items: {
                    create: itemsData,
                },
                statusHistory: {
                    create: {
                        status: 'DRAFT',
                        changedById: createdById,
                        notes: 'Orden de compra creada',
                    },
                },
            },
            include: { items: true },
        });
    }
    async update(id, data) {
        return client_1.default.purchaseOrder.update({
            where: { id },
            data: {
                ...data,
                requiredDate: data.requiredDate ? new Date(data.requiredDate) : undefined,
                expectedDelivery: data.expectedDelivery ? new Date(data.expectedDelivery) : undefined,
            },
            include: { items: true },
        });
    }
    async updateStatus(id, status, changedById, notes) {
        const updateData = { status: status };
        if (status === 'CONFIRMED') {
            updateData.confirmationDate = new Date();
        }
        else if (status === 'RECEIVED') {
            updateData.receivedDate = new Date();
        }
        return client_1.default.purchaseOrder.update({
            where: { id },
            data: {
                ...updateData,
                statusHistory: {
                    create: {
                        status: status,
                        changedById,
                        notes,
                    },
                },
            },
            include: { items: true },
        });
    }
    async delete(id) {
        await client_1.default.purchaseOrder.delete({
            where: { id },
        });
    }
    async generateCode() {
        const count = await client_1.default.purchaseOrder.count();
        const year = new Date().getFullYear();
        return `OC-${year}-${String(count + 1).padStart(4, '0')}`;
    }
    async count() {
        return client_1.default.purchaseOrder.count();
    }
    async countPending() {
        return client_1.default.purchaseOrder.count({
            where: { status: { in: ['DRAFT', 'SENT', 'CONFIRMED', 'IN_PROGRESS'] } },
        });
    }
}
exports.PurchaseOrderRepository = PurchaseOrderRepository;
class PurchaseReceiptRepository {
    async findAll() {
        return client_1.default.purchaseReceipt.findMany({
            orderBy: { receiptDate: 'desc' },
            include: {
                items: true,
            },
        });
    }
    async findById(id) {
        return client_1.default.purchaseReceipt.findUnique({
            where: { id },
            include: {
                items: true,
            },
        });
    }
    async findByPurchaseOrder(purchaseOrderId) {
        return client_1.default.purchaseReceipt.findMany({
            where: { purchaseOrderId },
            include: { items: true },
        });
    }
    async create(data) {
        return client_1.default.purchaseReceipt.create({
            data: {
                purchaseOrderId: data.purchaseOrderId,
                receiptDate: data.receiptDate || new Date(),
                receivedBy: data.receivedBy,
                observations: data.observations,
                items: {
                    create: data.items.map(item => ({
                        purchaseOrderItemId: item.purchaseOrderItemId,
                        quantityReceived: item.quantityReceived,
                    })),
                },
            },
            include: { items: true },
        });
    }
    async updateOrderItemReceived(itemId, quantityReceived) {
        const item = await client_1.default.purchaseOrderItem.findUnique({
            where: { id: itemId },
        });
        if (!item)
            return;
        const newQuantityReceived = item.quantityReceived + quantityReceived;
        let status = 'PARTIALLY_RECEIVED';
        if (newQuantityReceived >= item.quantity) {
            status = 'RECEIVED';
        }
        await client_1.default.purchaseOrderItem.update({
            where: { id: itemId },
            data: {
                quantityReceived: newQuantityReceived,
                status,
            },
        });
    }
}
exports.PurchaseReceiptRepository = PurchaseReceiptRepository;
exports.purchaseOrderRepository = new PurchaseOrderRepository();
exports.purchaseReceiptRepository = new PurchaseReceiptRepository();
//# sourceMappingURL=purchaseOrderRepository.js.map