"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supplierRoutes_1 = require("./supplierRoutes");
const materialRoutes_1 = require("./materialRoutes");
const authRoutes_1 = require("./authRoutes");
const quotationRoutes_1 = require("./quotationRoutes");
const purchaseOrderRoutes_1 = require("./purchaseOrderRoutes");
const workOrderRoutes_1 = __importDefault(require("./workOrderRoutes"));
const projectRoutes_1 = __importDefault(require("./projectRoutes"));
const contractRoutes_1 = __importDefault(require("./contractRoutes"));
const dashboardRoutes_1 = __importDefault(require("./dashboardRoutes"));
const settingsRoutes_1 = __importDefault(require("./settingsRoutes"));
const uploadRoutes_1 = __importDefault(require("./uploadRoutes"));
const auth_1 = require("../../../shared/middleware/auth");
const router = (0, express_1.Router)();
// ============================================
// RUTAS PÚBLICAS
// ============================================
// Login
router.post('/auth/login', authRoutes_1.authController.login);
router.get('/auth/me', auth_1.authenticate, authRoutes_1.authController.getProfile);
// Dashboard
router.use('/dashboard', dashboardRoutes_1.default);
// Upload
router.use('/upload', uploadRoutes_1.default);
// Settings
router.use('/settings', settingsRoutes_1.default);
// ============================================
// RUTAS PROTEGIDAS
// ============================================
// Usuarios (solo ADMIN)
router.get('/users', auth_1.authenticate, (0, auth_1.authorize)('ADMIN'), authRoutes_1.authController.getAllUsers);
router.get('/users/:id', auth_1.authenticate, (0, auth_1.authorize)('ADMIN'), authRoutes_1.authController.getUserById);
router.post('/users', auth_1.authenticate, (0, auth_1.authorize)('ADMIN'), authRoutes_1.authController.createUser);
router.put('/users/:id', auth_1.authenticate, (0, auth_1.authorize)('ADMIN'), authRoutes_1.authController.updateUser);
router.delete('/users/:id', auth_1.authenticate, (0, auth_1.authorize)('ADMIN'), authRoutes_1.authController.deleteUser);
router.get('/auth/profile', auth_1.authenticate, authRoutes_1.authController.getProfile);
// Proveedores
router.get('/suppliers', auth_1.authenticate, supplierRoutes_1.supplierController.getAll);
router.get('/suppliers/:id', auth_1.authenticate, supplierRoutes_1.supplierController.getById);
router.post('/suppliers', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), supplierRoutes_1.supplierController.create);
router.put('/suppliers/:id', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), supplierRoutes_1.supplierController.update);
router.delete('/suppliers/:id', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'PURCHASE_MANAGER'), supplierRoutes_1.supplierController.delete);
router.patch('/suppliers/:id/status', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'PURCHASE_MANAGER'), supplierRoutes_1.supplierController.updateStatus);
// Materiales
router.get('/materials', auth_1.authenticate, materialRoutes_1.materialController.getAll);
router.get('/materials/:id', auth_1.authenticate, materialRoutes_1.materialController.getById);
router.post('/materials', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'PURCHASE_MANAGER'), materialRoutes_1.materialController.create);
router.put('/materials/:id', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'PURCHASE_MANAGER'), materialRoutes_1.materialController.update);
router.delete('/materials/:id', auth_1.authenticate, (0, auth_1.authorize)('ADMIN'), materialRoutes_1.materialController.delete);
// Solicitudes de Cotización
router.get('/quotation-requests', auth_1.authenticate, quotationRoutes_1.quotationRequestController.getAll);
router.get('/quotation-requests/:id', auth_1.authenticate, quotationRoutes_1.quotationRequestController.getById);
router.post('/quotation-requests', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT', 'REQUESTER'), quotationRoutes_1.quotationRequestController.create);
router.put('/quotation-requests/:id', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), quotationRoutes_1.quotationRequestController.update);
router.delete('/quotation-requests/:id', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'PURCHASE_MANAGER'), quotationRoutes_1.quotationRequestController.delete);
router.patch('/quotation-requests/:id/status', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), quotationRoutes_1.quotationRequestController.updateStatus);
router.post('/quotation-requests/:id/select-quotation', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), quotationRoutes_1.quotationRequestController.selectQuotation);
router.post('/quotation-requests/:id/send', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), quotationRoutes_1.quotationRequestController.sendToSuppliers);
// Cotizaciones
router.get('/quotations', auth_1.authenticate, quotationRoutes_1.quotationController.getAll);
router.get('/quotations/:id', auth_1.authenticate, quotationRoutes_1.quotationController.getById);
router.get('/quotation-requests/:requestId/quotations', auth_1.authenticate, quotationRoutes_1.quotationController.getByRequest);
router.post('/quotations', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), quotationRoutes_1.quotationController.create);
router.patch('/quotations/:id/status', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), quotationRoutes_1.quotationController.updateStatus);
// Órdenes de Compra
router.get('/purchase-orders', auth_1.authenticate, purchaseOrderRoutes_1.purchaseOrderController.getAll);
router.get('/purchase-orders/:id', auth_1.authenticate, purchaseOrderRoutes_1.purchaseOrderController.getById);
router.post('/purchase-orders', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), purchaseOrderRoutes_1.purchaseOrderController.create);
router.put('/purchase-orders/:id', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), purchaseOrderRoutes_1.purchaseOrderController.update);
router.patch('/purchase-orders/:id/status', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), purchaseOrderRoutes_1.purchaseOrderController.updateStatus);
router.delete('/purchase-orders/:id', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'PURCHASE_MANAGER'), purchaseOrderRoutes_1.purchaseOrderController.delete);
// Recepciones
router.get('/receipts', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), purchaseOrderRoutes_1.purchaseReceiptController.getAll);
router.get('/receipts/:id', auth_1.authenticate, purchaseOrderRoutes_1.purchaseReceiptController.getById);
router.get('/purchase-orders/:orderId/receipts', auth_1.authenticate, purchaseOrderRoutes_1.purchaseReceiptController.getByOrder);
router.post('/receipts', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), purchaseOrderRoutes_1.purchaseReceiptController.create);
// Órdenes de Trabajo
router.get('/work-orders', auth_1.authenticate, workOrderRoutes_1.default.getAll);
router.get('/work-orders/:id', auth_1.authenticate, workOrderRoutes_1.default.getById);
router.post('/work-orders', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), workOrderRoutes_1.default.create);
router.put('/work-orders/:id', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), workOrderRoutes_1.default.update);
router.delete('/work-orders/:id', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'PURCHASE_MANAGER'), workOrderRoutes_1.default.delete);
router.patch('/work-orders/:id/status', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'PURCHASE_MANAGER'), workOrderRoutes_1.default.updateStatus);
// Proyectos
router.get('/projects', auth_1.authenticate, projectRoutes_1.default.getAll);
router.get('/projects/:id', auth_1.authenticate, projectRoutes_1.default.getById);
router.post('/projects', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'PURCHASE_MANAGER'), projectRoutes_1.default.create);
router.put('/projects/:id', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'PURCHASE_MANAGER'), projectRoutes_1.default.update);
router.delete('/projects/:id', auth_1.authenticate, (0, auth_1.authorize)('ADMIN'), projectRoutes_1.default.delete);
router.patch('/projects/:id/status', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'PURCHASE_MANAGER'), projectRoutes_1.default.updateStatus);
// Contratos
router.get('/contracts', auth_1.authenticate, contractRoutes_1.default.getAll);
router.get('/contracts/:id', auth_1.authenticate, contractRoutes_1.default.getById);
router.post('/contracts', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), contractRoutes_1.default.create);
router.put('/contracts/:id', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), contractRoutes_1.default.update);
router.delete('/contracts/:id', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'PURCHASE_MANAGER'), contractRoutes_1.default.delete);
router.patch('/contracts/:id/status', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'PURCHASE_MANAGER'), contractRoutes_1.default.updateStatus);
// Settings - usar el router de settingsRoutes
router.use('/settings', settingsRoutes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map