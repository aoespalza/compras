"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseReceiptController = exports.purchaseOrderController = exports.PurchaseReceiptController = exports.PurchaseOrderController = void 0;
const purchaseOrderUseCases_1 = require("../../../application/purchaseOrder/purchaseOrderUseCases");
class PurchaseOrderController {
    async getAll(req, res) {
        try {
            const { status, supplierId, page = '1', limit = '10' } = req.query;
            const pageNum = parseInt(page, 10);
            const limitNum = parseInt(limit, 10);
            let orders;
            if (supplierId) {
                orders = await purchaseOrderUseCases_1.purchaseOrderUseCases.getPurchaseOrdersBySupplier(supplierId);
            }
            else if (status) {
                orders = await purchaseOrderUseCases_1.purchaseOrderUseCases.getPurchaseOrdersByStatus(status);
            }
            else {
                orders = await purchaseOrderUseCases_1.purchaseOrderUseCases.getAllPurchaseOrders();
            }
            const total = orders.length;
            const totalPages = Math.ceil(total / limitNum);
            const startIndex = (pageNum - 1) * limitNum;
            const paginatedData = orders.slice(startIndex, startIndex + limitNum);
            res.json({
                data: paginatedData,
                total,
                page: pageNum,
                limit: limitNum,
                totalPages,
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getById(req, res) {
        try {
            const order = await purchaseOrderUseCases_1.purchaseOrderUseCases.getPurchaseOrderById(req.params.id);
            if (!order) {
                return res.status(404).json({ error: 'Orden de compra no encontrada' });
            }
            res.json(order);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async create(req, res) {
        try {
            const data = req.body;
            const order = await purchaseOrderUseCases_1.purchaseOrderUseCases.createPurchaseOrder(data, req.user.userId);
            res.status(201).json(order);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async update(req, res) {
        try {
            const data = req.body;
            const order = await purchaseOrderUseCases_1.purchaseOrderUseCases.updatePurchaseOrder(req.params.id, data);
            res.json(order);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async updateStatus(req, res) {
        try {
            const { status, notes } = req.body;
            const order = await purchaseOrderUseCases_1.purchaseOrderUseCases.updateStatus(req.params.id, status, req.user.userId, notes);
            res.json(order);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async delete(req, res) {
        try {
            await purchaseOrderUseCases_1.purchaseOrderUseCases.deletePurchaseOrder(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.PurchaseOrderController = PurchaseOrderController;
class PurchaseReceiptController {
    async getAll(req, res) {
        try {
            const { purchaseOrderId, page = '1', limit = '10' } = req.query;
            const pageNum = parseInt(page, 10);
            const limitNum = parseInt(limit, 10);
            let receipts = await purchaseOrderUseCases_1.purchaseReceiptUseCases.getAllReceipts();
            if (purchaseOrderId) {
                receipts = receipts.filter((r) => r.purchaseOrderId === purchaseOrderId);
            }
            const total = receipts.length;
            const totalPages = Math.ceil(total / limitNum);
            const startIndex = (pageNum - 1) * limitNum;
            const paginatedData = receipts.slice(startIndex, startIndex + limitNum);
            res.json({
                data: paginatedData,
                total,
                page: pageNum,
                limit: limitNum,
                totalPages,
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getById(req, res) {
        try {
            const receipt = await purchaseOrderUseCases_1.purchaseReceiptUseCases.getReceiptById(req.params.id);
            if (!receipt) {
                return res.status(404).json({ error: 'Recepción no encontrada' });
            }
            res.json(receipt);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getByOrder(req, res) {
        try {
            const receipts = await purchaseOrderUseCases_1.purchaseReceiptUseCases.getReceiptsByOrder(req.params.orderId);
            res.json(receipts);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async create(req, res) {
        try {
            const data = req.body;
            data.receivedBy = req.user.userId;
            const receipt = await purchaseOrderUseCases_1.purchaseReceiptUseCases.createReceipt(data);
            res.status(201).json(receipt);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.PurchaseReceiptController = PurchaseReceiptController;
exports.purchaseOrderController = new PurchaseOrderController();
exports.purchaseReceiptController = new PurchaseReceiptController();
//# sourceMappingURL=purchaseOrderRoutes.js.map