import { Request, Response } from 'express';
import { purchaseOrderUseCases, purchaseReceiptUseCases } from '../../../application/purchaseOrder/purchaseOrderUseCases';
import { CreatePurchaseOrderDTO, UpdatePurchaseOrderDTO, CreatePurchaseReceiptDTO } from '../../../domain/purchaseOrder';
import { AuthRequest } from '../../../shared/middleware/auth';

export class PurchaseOrderController {
  async getAll(req: Request, res: Response) {
    try {
      const { status, supplierId } = req.query;
      
      if (supplierId) {
        const orders = await purchaseOrderUseCases.getPurchaseOrdersBySupplier(supplierId as string);
        return res.json(orders);
      }
      
      if (status) {
        const orders = await purchaseOrderUseCases.getPurchaseOrdersByStatus(status as string);
        return res.json(orders);
      }
      
      const orders = await purchaseOrderUseCases.getAllPurchaseOrders();
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const order = await purchaseOrderUseCases.getPurchaseOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: 'Orden de compra no encontrada' });
      }
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const data = req.body as CreatePurchaseOrderDTO;
      const order = await purchaseOrderUseCases.createPurchaseOrder(data, req.user!.userId);
      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const data = req.body as UpdatePurchaseOrderDTO;
      const order = await purchaseOrderUseCases.updatePurchaseOrder(req.params.id, data);
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateStatus(req: AuthRequest, res: Response) {
    try {
      const { status, notes } = req.body;
      const order = await purchaseOrderUseCases.updateStatus(req.params.id, status, req.user!.userId, notes);
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await purchaseOrderUseCases.deletePurchaseOrder(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export class PurchaseReceiptController {
  async getAll(req: Request, res: Response) {
    try {
      const receipts = await purchaseReceiptUseCases.getAllReceipts();
      res.json(receipts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const receipt = await purchaseReceiptUseCases.getReceiptById(req.params.id);
      if (!receipt) {
        return res.status(404).json({ error: 'Recepción no encontrada' });
      }
      res.json(receipt);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByOrder(req: Request, res: Response) {
    try {
      const receipts = await purchaseReceiptUseCases.getReceiptsByOrder(req.params.orderId);
      res.json(receipts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const data = req.body as CreatePurchaseReceiptDTO;
      data.receivedBy = req.user!.userId;
      const receipt = await purchaseReceiptUseCases.createReceipt(data);
      res.status(201).json(receipt);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export const purchaseOrderController = new PurchaseOrderController();
export const purchaseReceiptController = new PurchaseReceiptController();
