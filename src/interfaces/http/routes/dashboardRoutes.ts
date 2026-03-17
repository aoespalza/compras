import { Router } from 'express';
import { authenticate } from '../../../shared/middleware/auth';
import prisma from '../../../infrastructure/prisma/client';

const router = Router();

router.get('/stats', authenticate, async (req, res) => {
  try {
    const [
      totalSuppliers,
      activeSuppliers,
      totalMaterials,
      totalQuotationRequests,
      pendingQuotations,
      totalPurchaseOrders,
      pendingOrders,
      recentOrders,
    ] = await Promise.all([
      prisma.supplier.count(),
      prisma.supplier.count({ where: { status: 'ACTIVE' } }),
      prisma.material.count(),
      prisma.quotationRequest.count(),
      prisma.quotationRequest.count({ where: { status: { in: ['SENT', 'RECEIVED', 'COMPARING'] } } }),
      prisma.purchaseOrder.count(),
      prisma.purchaseOrder.count({ where: { status: { in: ['DRAFT', 'SENT', 'CONFIRMED', 'IN_PROGRESS'] } } }),
      prisma.purchaseOrder.findMany({
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
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

export default router;
