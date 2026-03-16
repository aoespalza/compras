import { Router, Request, Response } from 'express';
import { supplierRepository } from '../../../infrastructure/repositories/supplierRepository';
import { materialRepository } from '../../../infrastructure/repositories/materialRepository';
import { quotationRepository, quotationRequestRepository } from '../../../infrastructure/repositories/quotationRepository';
import { purchaseOrderRepository } from '../../../infrastructure/repositories/purchaseOrderRepository';

const router = Router();

router.get('/stats', async (req: Request, res: Response) => {
  try {
    const [
      totalSuppliers,
      activeSuppliers,
      totalMaterials,
      totalQuotationRequests,
      pendingQuotations,
      totalPurchaseOrders,
      pendingOrders,
    ] = await Promise.all([
      supplierRepository.count(),
      supplierRepository.countActive(),
      materialRepository.count(),
      quotationRequestRepository.count(),
      quotationRepository.countPendingQuotations(),
      purchaseOrderRepository.count(),
      purchaseOrderRepository.countPending(),
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
