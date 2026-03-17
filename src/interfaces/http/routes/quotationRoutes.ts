import { Request, Response } from 'express';
import { quotationRequestUseCases, quotationUseCases } from '../../../application/quotation/quotationUseCases';
import { CreateQuotationRequestDTO, UpdateQuotationRequestDTO, CreateQuotationDTO } from '../../../domain/quotation';
import { AuthRequest } from '../../../shared/middleware/auth';

export class QuotationRequestController {
  async getAll(req: Request, res: Response) {
    try {
      const { status, page = '1', limit = '10' } = req.query;
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      
      const requests = status 
        ? await quotationRequestUseCases.getQuotationRequestsByStatus(status as string)
        : await quotationRequestUseCases.getAllQuotationRequests();

      const total = requests.length;
      const totalPages = Math.ceil(total / limitNum);
      const startIndex = (pageNum - 1) * limitNum;
      const paginatedData = requests.slice(startIndex, startIndex + limitNum);

      res.json({
        data: paginatedData,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const request = await quotationRequestUseCases.getQuotationRequestById(req.params.id);
      if (!request) {
        return res.status(404).json({ error: 'Solicitud de cotización no encontrada' });
      }
      res.json(request);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      console.log('=== CREATE QUOTATION REQUEST ===');
      console.log('Body:', JSON.stringify(req.body, null, 2));
      console.log('User:', req.user);
      const data = req.body as CreateQuotationRequestDTO;
      const request = await quotationRequestUseCases.createQuotationRequest(data, req.user!.userId);
      res.status(201).json(request);
    } catch (error: any) {
      console.error('Error creating quotation request:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      console.log('=== UPDATE QUOTATION REQUEST ===');
      console.log('ID:', req.params.id);
      console.log('Body:', JSON.stringify(req.body, null, 2));
      const data = req.body as UpdateQuotationRequestDTO;
      const request = await quotationRequestUseCases.updateQuotationRequest(req.params.id, data);
      res.json(request);
    } catch (error: any) {
      console.error('Error updating quotation request:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await quotationRequestUseCases.deleteQuotationRequest(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { status } = req.body;
      const request = await quotationRequestUseCases.updateStatus(req.params.id, status);
      res.json(request);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async selectQuotation(req: Request, res: Response) {
    try {
      const { quotationId } = req.body;
      const request = await quotationRequestUseCases.selectQuotation(req.params.id, quotationId);
      res.json(request);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async sendToSuppliers(req: Request, res: Response) {
    try {
      console.log('=== SEND TO SUPPLIERS ===');
      console.log('ID:', req.params.id);
      console.log('Body:', JSON.stringify(req.body, null, 2));
      const { supplierIds } = req.body;
      
      if (!supplierIds || !Array.isArray(supplierIds) || supplierIds.length === 0) {
        throw new Error('Se requiere un array de supplierIds');
      }
      
      const request = await quotationRequestUseCases.sendToSuppliers(req.params.id, supplierIds);
      res.json(request);
    } catch (error: any) {
      console.error('Error sending to suppliers:', error);
      res.status(400).json({ error: error.message });
    }
  }
}

export class QuotationController {
  async getAll(req: Request, res: Response) {
    try {
      const { quotationRequestId, supplierId, status, page = '1', limit = '10' } = req.query;
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      
      let quotations = await quotationUseCases.getAllQuotations();

      // Filter by params
      if (quotationRequestId) {
        quotations = quotations.filter((q: any) => q.quotationRequestId === quotationRequestId);
      }
      if (supplierId) {
        quotations = quotations.filter((q: any) => q.supplierId === supplierId);
      }
      if (status) {
        quotations = quotations.filter((q: any) => q.status === status);
      }

      const total = quotations.length;
      const totalPages = Math.ceil(total / limitNum);
      const startIndex = (pageNum - 1) * limitNum;
      const paginatedData = quotations.slice(startIndex, startIndex + limitNum);

      res.json({
        data: paginatedData,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const quotation = await quotationUseCases.getQuotationById(req.params.id);
      if (!quotation) {
        return res.status(404).json({ error: 'Cotización no encontrada' });
      }
      res.json(quotation);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByRequest(req: Request, res: Response) {
    try {
      const quotations = await quotationUseCases.getQuotationsByRequest(req.params.requestId);
      res.json(quotations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const data = req.body as CreateQuotationDTO;
      const quotation = await quotationUseCases.createQuotation(data, req.user!.userId);
      res.status(201).json(quotation);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { status } = req.body;
      const quotation = await quotationUseCases.updateStatus(req.params.id, status);
      res.json(quotation);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export const quotationRequestController = new QuotationRequestController();
export const quotationController = new QuotationController();
