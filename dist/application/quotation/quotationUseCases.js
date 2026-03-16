"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quotationUseCases = exports.quotationRequestUseCases = exports.QuotationUseCases = exports.QuotationRequestUseCases = void 0;
const quotationRepository_1 = require("../../infrastructure/repositories/quotationRepository");
const supplierRepository_1 = require("../../infrastructure/repositories/supplierRepository");
const userRepository_1 = require("../../infrastructure/repositories/userRepository");
const emailService_1 = require("../../shared/emailService");
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
        const request = await quotationRepository_1.quotationRequestRepository.create(data, createdById);
        // Enviar notificación
        const creator = await userRepository_1.userRepository.findById(createdById);
        if (creator) {
            emailService_1.emailService.notifyQuotationRequestCreated(request, creator);
        }
        return request;
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
        const quotation = await quotationRepository_1.quotationRepository.create(data, receivedById);
        // Notificación de cotización recibida
        const supplier = await supplierRepository_1.supplierRepository.findById(data.supplierId);
        if (supplier) {
            emailService_1.emailService.notifyQuotationReceived(quotation, supplier);
        }
        return quotation;
    }
    async updateStatus(id, status) {
        const quotation = await quotationRepository_1.quotationRepository.findById(id);
        if (!quotation) {
            throw new Error('Cotización no encontrada');
        }
        const updatedQuotation = await quotationRepository_1.quotationRepository.updateStatus(id, status);
        // Notificación de cotización aceptada
        if (status === 'ACCEPTED') {
            const supplier = await supplierRepository_1.supplierRepository.findById(quotation.supplierId);
            if (supplier) {
                emailService_1.emailService.notifyQuotationAccepted(updatedQuotation, supplier);
            }
        }
        return updatedQuotation;
    }
}
exports.QuotationUseCases = QuotationUseCases;
exports.quotationRequestUseCases = new QuotationRequestUseCases();
exports.quotationUseCases = new QuotationUseCases();
//# sourceMappingURL=quotationUseCases.js.map