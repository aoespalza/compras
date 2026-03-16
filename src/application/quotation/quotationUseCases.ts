import { quotationRequestRepository, quotationRepository } from '../../infrastructure/repositories/quotationRepository';
import { supplierRepository } from '../../infrastructure/repositories/supplierRepository';
import { userRepository } from '../../infrastructure/repositories/userRepository';
import { emailService } from '../../shared/emailService';
import { 
  QuotationRequest, 
  CreateQuotationRequestDTO, 
  UpdateQuotationRequestDTO,
  Quotation,
  CreateQuotationDTO 
} from '../../domain/quotation';

export class QuotationRequestUseCases {
  async getAllQuotationRequests(): Promise<QuotationRequest[]> {
    return quotationRequestRepository.findAll();
  }

  async getQuotationRequestById(id: string): Promise<QuotationRequest | null> {
    return quotationRequestRepository.findById(id);
  }

  async getQuotationRequestsByStatus(status: string): Promise<QuotationRequest[]> {
    return quotationRequestRepository.findByStatus(status);
  }

  async createQuotationRequest(data: CreateQuotationRequestDTO, createdById: string): Promise<QuotationRequest> {
    const request = await quotationRequestRepository.create(data, createdById);
    // Enviar notificación
    const creator = await userRepository.findById(createdById);
    if (creator) {
      emailService.notifyQuotationRequestCreated(request, creator);
    }
    return request;
  }

  async updateQuotationRequest(id: string, data: UpdateQuotationRequestDTO): Promise<QuotationRequest> {
    const quotationRequest = await quotationRequestRepository.findById(id);
    if (!quotationRequest) {
      throw new Error('Solicitud de cotización no encontrada');
    }
    return quotationRequestRepository.update(id, data);
  }

  async deleteQuotationRequest(id: string): Promise<void> {
    const quotationRequest = await quotationRequestRepository.findById(id);
    if (!quotationRequest) {
      throw new Error('Solicitud de cotización no encontrada');
    }
    await quotationRequestRepository.delete(id);
  }

  async updateStatus(id: string, status: string): Promise<QuotationRequest> {
    const quotationRequest = await quotationRequestRepository.findById(id);
    if (!quotationRequest) {
      throw new Error('Solicitud de cotización no encontrada');
    }
    return quotationRequestRepository.updateStatus(id, status);
  }

  async selectQuotation(quotationRequestId: string, quotationId: string): Promise<QuotationRequest> {
    const quotationRequest = await quotationRequestRepository.findById(quotationRequestId);
    if (!quotationRequest) {
      throw new Error('Solicitud de cotización no encontrada');
    }
    
    const quotation = await quotationRepository.findById(quotationId);
    if (!quotation) {
      throw new Error('Cotización no encontrada');
    }
    
    if (quotation.quotationRequestId !== quotationRequestId) {
      throw new Error('La cotización no pertenece a esta solicitud');
    }
    
    return quotationRequestRepository.selectQuotation(quotationRequestId, quotationId);
  }
}

export class QuotationUseCases {
  async getAllQuotations(): Promise<Quotation[]> {
    return quotationRepository.findAll();
  }

  async getQuotationById(id: string): Promise<Quotation | null> {
    return quotationRepository.findById(id);
  }

  async getQuotationsByRequest(quotationRequestId: string): Promise<Quotation[]> {
    return quotationRepository.findByQuotationRequest(quotationRequestId);
  }

  async createQuotation(data: CreateQuotationDTO, receivedById: string): Promise<Quotation> {
    const quotationRequest = await quotationRequestRepository.findById(data.quotationRequestId);
    if (!quotationRequest) {
      throw new Error('Solicitud de cotización no encontrada');
    }
    
    const quotation = await quotationRepository.create(data, receivedById);
    
    // Notificación de cotización recibida
    const supplier = await supplierRepository.findById(data.supplierId);
    if (supplier) {
      emailService.notifyQuotationReceived(quotation, supplier);
    }
    
    return quotation;
  }

  async updateStatus(id: string, status: string): Promise<Quotation> {
    const quotation = await quotationRepository.findById(id);
    if (!quotation) {
      throw new Error('Cotización no encontrada');
    }
    
    const updatedQuotation = await quotationRepository.updateStatus(id, status);
    
    // Notificación de cotización aceptada
    if (status === 'ACCEPTED') {
      const supplier = await supplierRepository.findById(quotation.supplierId);
      if (supplier) {
        emailService.notifyQuotationAccepted(updatedQuotation, supplier);
      }
    }
    
    return updatedQuotation;
  }
}

export const quotationRequestUseCases = new QuotationRequestUseCases();
export const quotationUseCases = new QuotationUseCases();
