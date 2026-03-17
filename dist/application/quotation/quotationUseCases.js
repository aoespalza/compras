"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quotationUseCases = exports.quotationRequestUseCases = exports.QuotationUseCases = exports.QuotationRequestUseCases = void 0;
const quotationRepository_1 = require("../../infrastructure/repositories/quotationRepository");
const supplierRepository_1 = require("../../infrastructure/repositories/supplierRepository");
const settingsRepository_1 = require("../../infrastructure/repositories/settingsRepository");
const emailService_1 = require("../../infrastructure/services/emailService");
class QuotationRequestUseCases {
    async getAllQuotationRequests() {
        return quotationRepository_1.quotationRequestRepository.findAll();
    }
    async getQuotationRequestById(id) {
        return quotationRepository_1.quotationRequestRepository.findById(id);
    }
    async getQuotationRequestsByStatus(status) {
        return quotationRepository_1.quotationRequestRepository.findByStatus(status);
    }
    async createQuotationRequest(data, createdById) {
        return quotationRepository_1.quotationRequestRepository.create(data, createdById);
    }
    async updateQuotationRequest(id, data) {
        const quotationRequest = await quotationRepository_1.quotationRequestRepository.findById(id);
        if (!quotationRequest) {
            throw new Error('Solicitud de cotización no encontrada');
        }
        return quotationRepository_1.quotationRequestRepository.update(id, data);
    }
    async deleteQuotationRequest(id) {
        const quotationRequest = await quotationRepository_1.quotationRequestRepository.findById(id);
        if (!quotationRequest) {
            throw new Error('Solicitud de cotización no encontrada');
        }
        await quotationRepository_1.quotationRequestRepository.delete(id);
    }
    async updateStatus(id, status) {
        const quotationRequest = await quotationRepository_1.quotationRequestRepository.findById(id);
        if (!quotationRequest) {
            throw new Error('Solicitud de cotización no encontrada');
        }
        return quotationRepository_1.quotationRequestRepository.updateStatus(id, status);
    }
    async selectQuotation(quotationRequestId, quotationId) {
        const quotationRequest = await quotationRepository_1.quotationRequestRepository.findById(quotationRequestId);
        if (!quotationRequest) {
            throw new Error('Solicitud de cotización no encontrada');
        }
        const quotation = await quotationRepository_1.quotationRepository.findById(quotationId);
        if (!quotation) {
            throw new Error('Cotización no encontrada');
        }
        if (quotation.quotationRequestId !== quotationRequestId) {
            throw new Error('La cotización no pertenece a esta solicitud');
        }
        return quotationRepository_1.quotationRequestRepository.selectQuotation(quotationRequestId, quotationId);
    }
    async sendToSuppliers(quotationRequestId, supplierIds, receivedById) {
        const quotationRequest = await quotationRepository_1.quotationRequestRepository.findById(quotationRequestId);
        if (!quotationRequest) {
            throw new Error('Solicitud de cotización no encontrada');
        }
        const errors = [];
        let emailsSent = 0;
        // Obtener configuración de la empresa
        const companySettings = await settingsRepository_1.settingsRepository.findByCategory('company');
        const companyName = companySettings.find(s => s.key === 'company_name')?.value || 'PROCURA';
        const companyEmail = companySettings.find(s => s.key === 'company_email')?.value || 'noreply@procura.cl';
        // Usar el usuario que creó la requisición o el primero disponible
        const createdBy = receivedById || quotationRequest.createdById;
        // Crear una cotización vacía para cada proveedor y enviar email
        for (const supplierId of supplierIds) {
            // Crear cotización vacía
            await quotationRepository_1.quotationRepository.create({
                quotationRequestId,
                supplierId,
                validUntil: undefined,
                subtotal: 0,
                total: 0,
                status: 'PENDING',
                items: []
            }, createdBy);
            // Obtener datos del proveedor
            const supplier = await supplierRepository_1.supplierRepository.findById(supplierId);
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
            const itemsList = quotationRequest.items?.map((item, idx) => `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${idx + 1}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${item.material?.name || item.description || 'Sin descripción'}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity} ${item.unitOfMeasure}</td>
        </tr>`).join('') || '';
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
            const emailResult = await emailService_1.emailService.send({
                to: supplierEmail,
                subject: `[${companyName}] Solicitud de Cotización ${quotationRequest.code} - ${quotationRequest.title}`,
                html: emailHtml
            });
            if (emailResult.success) {
                console.log(`[SEND] ✓ Email enviado exitosamente a ${supplierEmail}`);
                emailsSent++;
            }
            else {
                console.log(`[SEND] ✗ ERROR al enviar a ${supplier.name} (${supplierEmail}): ${emailResult.error}`);
                errors.push(`Error al enviar email a ${supplier.name}: ${emailResult.error}`);
            }
        }
        // Actualizar estado de la solicitud
        await quotationRepository_1.quotationRequestRepository.updateStatus(quotationRequestId, 'SENT');
        const updated = await quotationRepository_1.quotationRequestRepository.findById(quotationRequestId);
        if (!updated) {
            throw new Error('Error al actualizar la solicitud');
        }
        return { quotationRequest: updated, emailsSent, errors };
    }
}
exports.QuotationRequestUseCases = QuotationRequestUseCases;
class QuotationUseCases {
    async getAllQuotations() {
        return quotationRepository_1.quotationRepository.findAll();
    }
    async getQuotationById(id) {
        return quotationRepository_1.quotationRepository.findById(id);
    }
    async getQuotationsByRequest(quotationRequestId) {
        return quotationRepository_1.quotationRepository.findByQuotationRequest(quotationRequestId);
    }
    async createQuotation(data, receivedById) {
        const quotationRequest = await quotationRepository_1.quotationRequestRepository.findById(data.quotationRequestId);
        if (!quotationRequest) {
            throw new Error('Solicitud de cotización no encontrada');
        }
        return quotationRepository_1.quotationRepository.create(data, receivedById);
    }
    async updateStatus(id, status) {
        const quotation = await quotationRepository_1.quotationRepository.findById(id);
        if (!quotation) {
            throw new Error('Cotización no encontrada');
        }
        return quotationRepository_1.quotationRepository.updateStatus(id, status);
    }
}
exports.QuotationUseCases = QuotationUseCases;
exports.quotationRequestUseCases = new QuotationRequestUseCases();
exports.quotationUseCases = new QuotationUseCases();
//# sourceMappingURL=quotationUseCases.js.map