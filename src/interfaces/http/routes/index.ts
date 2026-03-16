import { Router } from 'express';
import { supplierController } from './supplierRoutes';
import { materialController } from './materialRoutes';
import { authController } from './authRoutes';
import { quotationRequestController, quotationController } from './quotationRoutes';
import { purchaseOrderController, purchaseReceiptController } from './purchaseOrderRoutes';
import dashboardRoutes from './dashboardRoutes';
import settingsController from './settingsRoutes';
import { authenticate, authorize } from '../../../shared/middleware/auth';

const router = Router();

// ============================================
// RUTAS PÚBLICAS
// ============================================

// Login
router.post('/auth/login', authController.login);

// Registro temporal (para pruebas)
router.post('/auth/register', authController.createUser);

// Usuario actual
router.get('/auth/me', authenticate, authController.getProfile);

// Dashboard
router.use('/dashboard', authenticate, dashboardRoutes);

// ============================================
// RUTAS PROTEGIDAS
// ============================================

// Usuarios (solo ADMIN)
router.get('/users', authenticate, authorize('ADMIN'), authController.getAllUsers);
router.get('/users/:id', authenticate, authorize('ADMIN'), authController.getUserById);
router.post('/users', authenticate, authorize('ADMIN'), authController.createUser);
router.put('/users/:id', authenticate, authorize('ADMIN'), authController.updateUser);
router.delete('/users/:id', authenticate, authorize('ADMIN'), authController.deleteUser);
router.get('/auth/profile', authenticate, authController.getProfile);

// Proveedores
router.get('/suppliers', authenticate, supplierController.getAll);
router.get('/suppliers/:id', authenticate, supplierController.getById);
router.post('/suppliers', authenticate, authorize('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), supplierController.create);
router.put('/suppliers/:id', authenticate, authorize('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), supplierController.update);
router.delete('/suppliers/:id', authenticate, authorize('ADMIN', 'PURCHASE_MANAGER'), supplierController.delete);
router.patch('/suppliers/:id/status', authenticate, authorize('ADMIN', 'PURCHASE_MANAGER'), supplierController.updateStatus);

// Materiales
router.get('/materials', authenticate, materialController.getAll);
router.get('/materials/:id', authenticate, materialController.getById);
router.post('/materials', authenticate, authorize('ADMIN', 'PURCHASE_MANAGER'), materialController.create);
router.put('/materials/:id', authenticate, authorize('ADMIN', 'PURCHASE_MANAGER'), materialController.update);
router.delete('/materials/:id', authenticate, authorize('ADMIN'), materialController.delete);

// Solicitudes de Cotización
router.get('/quotation-requests', authenticate, quotationRequestController.getAll);
router.get('/quotation-requests/:id', authenticate, quotationRequestController.getById);
router.post('/quotation-requests', authenticate, authorize('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT', 'REQUESTER'), quotationRequestController.create);
router.put('/quotation-requests/:id', authenticate, authorize('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), quotationRequestController.update);
router.delete('/quotation-requests/:id', authenticate, authorize('ADMIN', 'PURCHASE_MANAGER'), quotationRequestController.delete);
router.patch('/quotation-requests/:id/status', authenticate, authorize('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), quotationRequestController.updateStatus);
router.post('/quotation-requests/:id/select-quotation', authenticate, authorize('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), quotationRequestController.selectQuotation);

// Cotizaciones
router.get('/quotations', authenticate, quotationController.getAll);
router.get('/quotations/:id', authenticate, quotationController.getById);
router.get('/quotation-requests/:requestId/quotations', authenticate, quotationController.getByRequest);
router.post('/quotations', authenticate, authorize('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), quotationController.create);
router.patch('/quotations/:id/status', authenticate, authorize('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), quotationController.updateStatus);

// Órdenes de Compra
router.get('/purchase-orders', authenticate, purchaseOrderController.getAll);
router.get('/purchase-orders/:id', authenticate, purchaseOrderController.getById);
router.post('/purchase-orders', authenticate, authorize('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), purchaseOrderController.create);
router.put('/purchase-orders/:id', authenticate, authorize('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), purchaseOrderController.update);
router.patch('/purchase-orders/:id/status', authenticate, authorize('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), purchaseOrderController.updateStatus);
router.delete('/purchase-orders/:id', authenticate, authorize('ADMIN', 'PURCHASE_MANAGER'), purchaseOrderController.delete);

// Recepciones
router.get('/receipts', authenticate, authorize('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), purchaseReceiptController.getAll);
router.get('/receipts/:id', authenticate, purchaseReceiptController.getById);
router.get('/purchase-orders/:orderId/receipts', authenticate, purchaseReceiptController.getByOrder);
router.post('/receipts', authenticate, authorize('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), purchaseReceiptController.create);

// Configuración
router.get('/settings', authenticate, authorize('ADMIN'), settingsController.getAll);
router.get('/settings/category/:category', authenticate, authorize('ADMIN'), settingsController.getByCategory);
router.get('/settings/key/:key', authenticate, authorize('ADMIN'), settingsController.getByKey);
router.put('/settings/:key', authenticate, authorize('ADMIN'), settingsController.update);
router.post('/settings/initialize', authenticate, authorize('ADMIN'), settingsController.initialize);

// Configuración específica
router.get('/settings/email', authenticate, authorize('ADMIN'), settingsController.getEmailSettings);
router.get('/settings/validation', authenticate, authorize('ADMIN'), settingsController.getValidationSettings);
router.get('/settings/company', authenticate, authorize('ADMIN'), settingsController.getCompanySettings);
router.post('/settings/test-email', authenticate, authorize('ADMIN'), settingsController.testEmailConnection);

export default router;
