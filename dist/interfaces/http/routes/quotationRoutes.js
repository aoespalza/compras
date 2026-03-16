"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quotationController = exports.quotationRequestController = exports.QuotationController = exports.QuotationRequestController = void 0;
const quotationUseCases_1 = require("../../../application/quotation/quotationUseCases");
class QuotationRequestController {
    async getAll(req, res) {
        try {
            const { status } = req.query;
            const requests = status
                ? await quotationUseCases_1.quotationRequestUseCases.getQuotationRequestsByStatus(status)
                : await quotationUseCases_1.quotationRequestUseCases.getAllQuotationRequests();
            res.json(requests);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getById(req, res) {
        try {
            const request = await quotationUseCases_1.quotationRequestUseCases.getQuotationRequestById(req.params.id);
            if (!request) {
                return res.status(404).json({ error: 'Solicitud de cotización no encontrada' });
            }
            res.json(request);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async create(req, res) {
        try {
            const data = req.body;
            const request = await quotationUseCases_1.quotationRequestUseCases.createQuotationRequest(data, req.user.userId);
            res.status(201).json(request);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async update(req, res) {
        try {
            const data = req.body;
            const request = await quotationUseCases_1.quotationRequestUseCases.updateQuotationRequest(req.params.id, data);
            res.json(request);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async delete(req, res) {
        try {
            await quotationUseCases_1.quotationRequestUseCases.deleteQuotationRequest(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async updateStatus(req, res) {
        try {
            const { status } = req.body;
            const request = await quotationUseCases_1.quotationRequestUseCases.updateStatus(req.params.id, status);
            res.json(request);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async selectQuotation(req, res) {
        try {
            const { quotationId } = req.body;
            const request = await quotationUseCases_1.quotationRequestUseCases.selectQuotation(req.params.id, quotationId);
            res.json(request);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.QuotationRequestController = QuotationRequestController;
class QuotationController {
    async getAll(req, res) {
        try {
            const quotations = await quotationUseCases_1.quotationUseCases.getAllQuotations();
            res.json(quotations);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getById(req, res) {
        try {
            const quotation = await quotationUseCases_1.quotationUseCases.getQuotationById(req.params.id);
            if (!quotation) {
                return res.status(404).json({ error: 'Cotización no encontrada' });
            }
            res.json(quotation);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getByRequest(req, res) {
        try {
            const quotations = await quotationUseCases_1.quotationUseCases.getQuotationsByRequest(req.params.requestId);
            res.json(quotations);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async create(req, res) {
        try {
            const data = req.body;
            const quotation = await quotationUseCases_1.quotationUseCases.createQuotation(data, req.user.userId);
            res.status(201).json(quotation);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async updateStatus(req, res) {
        try {
            const { status } = req.body;
            const quotation = await quotationUseCases_1.quotationUseCases.updateStatus(req.params.id, status);
            res.json(quotation);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.QuotationController = QuotationController;
exports.quotationRequestController = new QuotationRequestController();
exports.quotationController = new QuotationController();
//# sourceMappingURL=quotationRoutes.js.map