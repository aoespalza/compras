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
const dashboardRoutes_1 = __importDefault(require("./dashboardRoutes"));
const settingsRoutes_1 = __importDefault(require("./settingsRoutes"));
const auth_1 = require("../../../shared/middleware/auth");
const router = (0, express_1.Router)();
// ============================================
// RUTAS PÚBLICAS
// ============================================
// Login
router.post('/auth/login', authRoutes_1.authController.login);
// Registro temporal (para pruebas)
router.post('/auth/register', authRoutes_1.authController.createUser);
// Usuario actual
router.get('/auth/me', auth_1.authenticate, authRoutes_1.authController.getProfile);
// Dashboard
router.use('/dashboard', auth_1.authenticate, dashboardRoutes_1.default);
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
// Configuración
router.get('/settings', auth_1.authenticate, (0, auth_1.authorize)('ADMIN'), settingsRoutes_1.default.getAll);
router.get('/settings/category/:category', auth_1.authenticate, (0, auth_1.authorize)('ADMIN'), settingsRoutes_1.default.getByCategory);
router.get('/settings/key/:key', auth_1.authenticate, (0, auth_1.authorize)('ADMIN'), settingsRoutes_1.default.getByKey);
router.put('/settings/:key', auth_1.authenticate, (0, auth_1.authorize)('ADMIN'), settingsRoutes_1.default.update);
router.post('/settings/initialize', auth_1.authenticate, (0, auth_1.authorize)('ADMIN'), settingsRoutes_1.default.initialize);
// Configuración específica
router.get('/settings/email', auth_1.authenticate, (0, auth_1.authorize)('ADMIN'), settingsRoutes_1.default.getEmailSettings);
router.get('/settings/validation', auth_1.authenticate, (0, auth_1.authorize)('ADMIN'), settingsRoutes_1.default.getValidationSettings);
router.get('/settings/company', auth_1.authenticate, (0, auth_1.authorize)('ADMIN'), settingsRoutes_1.default.getCompanySettings);
router.post('/settings/test-email', auth_1.authenticate, (0, auth_1.authorize)('ADMIN'), settingsRoutes_1.default.testEmailConnection);
exports.default = router;
//# sourceMappingURL=index.js.map