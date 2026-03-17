"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../../shared/middleware/auth");
const client_1 = __importDefault(require("../../../infrastructure/prisma/client"));
const router = (0, express_1.Router)();
router.get('/stats', auth_1.authenticate, async (req, res) => {
    try {
        const [totalSuppliers, activeSuppliers, totalMaterials, totalQuotationRequests, pendingQuotations, totalPurchaseOrders, pendingOrders, recentOrders,] = await Promise.all([
            client_1.default.supplier.count(),
            client_1.default.supplier.count({ where: { status: 'ACTIVE' } }),
            client_1.default.material.count(),
            client_1.default.quotationRequest.count(),
            client_1.default.quotationRequest.count({ where: { status: { in: ['SENT', 'RECEIVED', 'COMPARING'] } } }),
            client_1.default.purchaseOrder.count(),
            client_1.default.purchaseOrder.count({ where: { status: { in: ['DRAFT', 'SENT', 'CONFIRMED', 'IN_PROGRESS'] } } }),
            client_1.default.purchaseOrder.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { supplier: true },
            }),
        ]);
        res.json({
            totalMaterials,
            totalSuppliers,
            activeSuppliers,
            totalQuotationRequests,
            pendingQuotations,
            totalPurchaseOrders,
            pendingOrders,
        });
    }
    catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
});
exports.default = router;
//# sourceMappingURL=dashboardRoutes.js.map