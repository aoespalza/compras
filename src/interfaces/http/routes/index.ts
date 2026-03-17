import { Router } from 'express';
import { supplierController } from './supplierRoutes';
import { materialController } from './materialRoutes';
import { authController } from './authRoutes';
import { quotationRequestController, quotationController } from './quotationRoutes';
import { purchaseOrderController, purchaseReceiptController } from './purchaseOrderRoutes';
import workOrderController from './workOrderRoutes';
import projectController from './projectRoutes';
import contractController from './contractRoutes';
import dashboardRoutes from './dashboardRoutes';
import settingsRoutes from './settingsRoutes';
import uploadRoutes from './uploadRoutes';
import { authenticate, authorize } from '../../../shared/middleware/auth';

const router = Router();

// ============================================
// RUTAS PÚBLICAS
// ============================================

// Login
router.post('/auth/login', authController.login);
router.get('/auth/me', authenticate, authController.getProfile);

// Dashboard
router.use('/dashboard', dashboardRoutes);

// Upload
router.use('/upload', uploadRoutes);

// Settings
router.use('/settings', settingsRoutes);

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
router.post('/quotation-requests/:id/send', authenticate, authorize('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), quotationRequestController.sendToSuppliers);

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

// Órdenes de Trabajo
router.get('/work-orders', authenticate, workOrderController.getAll);
router.get('/work-orders/:id', authenticate, workOrderController.getById);
router.post('/work-orders', authenticate, authorize('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), workOrderController.create);
router.put('/work-orders/:id', authenticate, authorize('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), workOrderController.update);
router.delete('/work-orders/:id', authenticate, authorize('ADMIN', 'PURCHASE_MANAGER'), workOrderController.delete);
router.patch('/work-orders/:id/status', authenticate, authorize('ADMIN', 'PURCHASE_MANAGER'), workOrderController.updateStatus);

// Proyectos
router.get('/projects', authenticate, projectController.getAll);
router.get('/projects/:id', authenticate, projectController.getById);
router.post('/projects', authenticate, authorize('ADMIN', 'PURCHASE_MANAGER'), projectController.create);
router.put('/projects/:id', authenticate, authorize('ADMIN', 'PURCHASE_MANAGER'), projectController.update);
router.delete('/projects/:id', authenticate, authorize('ADMIN'), projectController.delete);
router.patch('/projects/:id/status', authenticate, authorize('ADMIN', 'PURCHASE_MANAGER'), projectController.updateStatus);

// Contratos
router.get('/contracts', authenticate, contractController.getAll);
router.get('/contracts/:id', authenticate, contractController.getById);
router.post('/contracts', authenticate, authorize('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), contractController.create);
router.put('/contracts/:id', authenticate, authorize('ADMIN', 'PURCHASE_MANAGER', 'PURCHASE_AGENT'), contractController.update);
router.delete('/contracts/:id', authenticate, authorize('ADMIN', 'PURCHASE_MANAGER'), contractController.delete);
router.patch('/contracts/:id/status', authenticate, authorize('ADMIN', 'PURCHASE_MANAGER'), contractController.updateStatus);

// Settings - usar el router de settingsRoutes
router.use('/settings', settingsRoutes);

export default router;
