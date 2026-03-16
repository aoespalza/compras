"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supplierRepository_1 = require("../../../infrastructure/repositories/supplierRepository");
const materialRepository_1 = require("../../../infrastructure/repositories/materialRepository");
const quotationRepository_1 = require("../../../infrastructure/repositories/quotationRepository");
const purchaseOrderRepository_1 = require("../../../infrastructure/repositories/purchaseOrderRepository");
const router = (0, express_1.Router)();
router.get('/stats', async (req, res) => {
    try {
        const [totalSuppliers, activeSuppliers, totalMaterials, totalQuotationRequests, pendingQuotations, totalPurchaseOrders, pendingOrders,] = await Promise.all([
            supplierRepository_1.supplierRepository.count(),
            supplierRepository_1.supplierRepository.countActive(),
            materialRepository_1.materialRepository.count(),
            quotationRepository_1.quotationRequestRepository.count(),
            quotationRepository_1.quotationRepository.countPendingQuotations(),
            purchaseOrderRepository_1.purchaseOrderRepository.count(),
            purchaseOrderRepository_1.purchaseOrderRepository.countPending(),
        ]);
        res.json({
            totalSuppliers,
            activeSuppliers,
            totalMaterials,
            totalQuotationRequests,
            pendingQuotations,
            totalPurchaseOrders,
            pendingOrders,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=dashboardRoutes.js.map