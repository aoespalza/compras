import { quotationRequestRepository, quotationRepository } from '../../infrastructure/repositories/quotationRepository';
import { supplierRepository } from '../../infrastructure/repositories/supplierRepository';
import { settingsRepository } from '../../infrastructure/repositories/settingsRepository';
import { emailService } from '../../infrastructure/services/emailService';
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
    return quotationRequestRepository.create(data, createdById);
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

  async sendToSuppliers(quotationRequestId: string, supplierIds: string[], receivedById?: string): Promise<{ quotationRequest: QuotationRequest; emailsSent: number; errors: string[] }> {
    const quotationRequest = await quotationRequestRepository.findById(quotationRequestId);
    if (!quotationRequest) {
      throw new Error('Solicitud de cotización no encontrada');
    }

    const errors: string[] = [];
    let emailsSent = 0;

    // Obtener configuración de la empresa
    const companySettings = await settingsRepository.findByCategory('company');
    const companyName = companySettings.find(s => s.key === 'company_name')?.value || 'PROCURA';
    const companyEmail = companySettings.find(s => s.key === 'company_email')?.value || 'noreply@procura.cl';

    // Usar el usuario que creó la requisición o el primero disponible
    const createdBy = receivedById || quotationRequest.createdById;

    // Crear una cotización vacía para cada proveedor y enviar email
    for (const supplierId of supplierIds) {
      // Crear cotización vacía
      await quotationRepository.create({
        quotationRequestId,
        supplierId,
        validUntil: undefined,
        subtotal: 0,
        total: 0,
        status: 'PENDING',
        items: []
      } as any, createdBy);

      // Obtener datos del proveedor
      const supplier = await supplierRepository.findById(supplierId);
      if (!supplier) {
        errors.push(`Proveedor ${supplierId} no encontrado`);
        continue;
      }

      const supplierEmail = supplier.email || supplier.contactEmail;
      console.log(`[SEND] Proveedor: ${supplier.name}, Email: ${supplierEmail}`);
      
      if (!supplierEmail) {
        console.log(`[SEND] ERROR: Proveedor ${supplier.name} no tiene email configurado`);
        errors.push(`Proveedor ${supplier.name} no tiene email configurado`);
        continue;
      }

      // Enviar email de solicitud de cotización
      const itemsList = quotationRequest.items?.map((item, idx) => 
        `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${idx + 1}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${item.material?.name || item.description || 'Sin descripción'}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity} ${item.unitOfMeasure}</td>
        </tr>`
      ).join('') || '';

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px;">
          <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Nueva Solicitud de Cotización</h1>
          </div>
          <div style="padding: 20px;">
            <p style="margin-top: 0;">Estimado proveedor,</p>
            <p>Hemos generado una nueva solicitud de cotización y nos gustaría contar con su participación.</p>
            
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h3 style="margin-top: 0; color: #1f2937;">Detalles de la Solicitud</h3>
              <table style="width: 100%; font-size: 14px;">
                <tr>
                  <td style="padding: 4px 0; color: #6b7280;"><strong>Código:</strong></td>
                  <td style="padding: 4px 0;">${quotationRequest.code}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #6b7280;"><strong>Título:</strong></td>
                  <td style="padding: 4px 0;">${quotationRequest.title}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #6b7280;"><strong>Proyecto:</strong></td>
                  <td style="padding: 4px 0;">${quotationRequest.projectName || 'No especificado'}</td>
                </tr>
                ${quotationRequest.requiredDate ? `
                <tr>
                  <td style="padding: 4px 0; color: #6b7280;"><strong>Fecha requerida:</strong></td>
                  <td style="padding: 4px 0;">${new Date(quotationRequest.requiredDate).toLocaleDateString('es-CL')}</td>
                </tr>` : ''}
              </table>
            </div>

            <h3 style="color: #1f2937;">Items Solicitados</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 15px;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">#</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Descripción</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #e5e7eb;">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList || '<tr><td colspan="3" style="padding: 20px; text-align: center; color: #6b7280;">No hay items específicos</td></tr>'}
              </tbody>
            </table>

            <div style="background: #eff6ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p style="margin: 0; color: #1e40af;">
                <strong>Para responder esta solicitud:</strong><br>
                Ingrese al sistema PROCURA y diríjase a la sección de Cotizaciones.<br>
                O contacte a ${companyName} al email ${companyEmail}
              </p>
            </div>

            <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
              Este es un mensaje automático de ${companyName}. Por favor no responda directamente a este email.
            </p>
          </div>
        </div>
      `;

      const emailResult = await emailService.send({
        to: supplierEmail,
        subject: `[${companyName}] Solicitud de Cotización ${quotationRequest.code} - ${quotationRequest.title}`,
        html: emailHtml
      });

      if (emailResult.success) {
        console.log(`[SEND] ✓ Email enviado exitosamente a ${supplierEmail}`);
        emailsSent++;
      } else {
        console.log(`[SEND] ✗ ERROR al enviar a ${supplier.name} (${supplierEmail}): ${emailResult.error}`);
        errors.push(`Error al enviar email a ${supplier.name}: ${emailResult.error}`);
      }
    }

    // Actualizar estado de la solicitud
    await quotationRequestRepository.updateStatus(quotationRequestId, 'SENT');

    const updated = await quotationRequestRepository.findById(quotationRequestId);
    if (!updated) {
      throw new Error('Error al actualizar la solicitud');
    }

    return { quotationRequest: updated, emailsSent, errors };
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
    
    return quotationRepository.create(data, receivedById);
  }

  async updateStatus(id: string, status: string): Promise<Quotation> {
    const quotation = await quotationRepository.findById(id);
    if (!quotation) {
      throw new Error('Cotización no encontrada');
    }
    return quotationRepository.updateStatus(id, status);
  }
}

export const quotationRequestUseCases = new QuotationRequestUseCases();
export const quotationUseCases = new QuotationUseCases();
