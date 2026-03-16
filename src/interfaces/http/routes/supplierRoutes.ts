import { Request, Response } from 'express';
import { supplierUseCases } from '../../../application/supplier/supplierUseCases';
import { CreateSupplierDTO, UpdateSupplierDTO } from '../../../domain/supplier';

export class SupplierController {
  async getAll(req: Request, res: Response) {
    try {
      const { status } = req.query;
      const suppliers = status 
        ? await supplierUseCases.getSuppliersByStatus(status as string)
        : await supplierUseCases.getAllSuppliers();
      res.json(suppliers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const supplier = await supplierUseCases.getSupplierById(req.params.id);
      if (!supplier) {
        return res.status(404).json({ error: 'Proveedor no encontrado' });
      }
      res.json(supplier);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = req.body as CreateSupplierDTO;
      const supplier = await supplierUseCases.createSupplier(data);
      res.status(201).json(supplier);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const data = req.body as UpdateSupplierDTO;
      const supplier = await supplierUseCases.updateSupplier(req.params.id, data);
      res.json(supplier);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await supplierUseCases.deleteSupplier(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { status } = req.body;
      const supplier = await supplierUseCases.updateSupplierStatus(req.params.id, status);
      res.json(supplier);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export const supplierController = new SupplierController();
