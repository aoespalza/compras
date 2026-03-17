"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quotationRepository = exports.quotationRequestRepository = exports.QuotationRepository = exports.QuotationRequestRepository = void 0;
const client_1 = __importDefault(require("../prisma/client"));
class QuotationRequestRepository {
    async findAll() {
        return client_1.default.quotationRequest.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: {
                        material: true
                    }
                },
                quotations: {
                    include: {
                        supplier: true,
                    },
                },
            },
        });
    }
    async findById(id) {
        return client_1.default.quotationRequest.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        material: true
                    }
                },
                quotations: {
                    include: {
                        supplier: true,
                        items: true,
                    },
                },
            },
        });
    }
    async findByStatus(status) {
        return client_1.default.quotationRequest.findMany({
            where: { status: status },
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: {
                        material: true
                    }
                },
            },
        });
    }
    async create(data, createdById) {
        const code = await this.generateCode();
        return client_1.default.quotationRequest.create({
            data: {
                code,
                title: data.title,
                description: data.description,
                projectName: data.projectName,
                priority: data.priority,
                requiredDate: data.requiredDate ? new Date(data.requiredDate) : null,
                deliveryAddress: data.deliveryAddress,
                createdById,
                items: {
                    create: data.items.map(item => ({
                        materialId: item.materialId,
                        description: item.description,
                        quantity: item.quantity,
                        unitOfMeasure: item.unitOfMeasure,
                        observations: item.observations,
                    })),
                },
            },
            include: { items: true },
        });
    }
    async update(id, data) {
        // Separar los items del resto de datos
        const { items, ...quotationRequestData } = data;
        // Actualizar datos principales
        await client_1.default.quotationRequest.update({
            where: { id },
            data: {
                ...quotationRequestData,
                requiredDate: quotationRequestData.requiredDate ? new Date(quotationRequestData.requiredDate) : undefined
            },
        });
        // Si hay items nuevos, actualizar
        if (items && Array.isArray(items)) {
            // Eliminar items existentes
            await client_1.default.quotationRequestItem.deleteMany({
                where: { quotationRequestId: id }
            });
            // Crear nuevos items
            if (items.length > 0) {
                await client_1.default.quotationRequestItem.createMany({
                    data: items.map((item) => ({
                        quotationRequestId: id,
                        materialId: item.materialId,
                        description: item.description,
                        quantity: item.quantity,
                        unitOfMeasure: item.unitOfMeasure,
                        observations: item.observations,
                    }))
                });
            }
        }
        // Retornar con items actualizados
        return client_1.default.quotationRequest.findUnique({
            where: { id },
            include: { items: true },
        });
    }
    async delete(id) {
        await client_1.default.quotationRequest.delete({
            where: { id },
        });
    }
    async updateStatus(id, status) {
        return client_1.default.quotationRequest.update({
            where: { id },
            data: { status: status },
            include: { items: true },
        });
    }
    async selectQuotation(quotationRequestId, quotationId) {
        return client_1.default.quotationRequest.update({
            where: { id: quotationRequestId },
            data: {
                selectedQuotationId: quotationId,
                status: 'APPROVED',
            },
            include: { items: true },
        });
    }
    async generateCode() {
        const count = await client_1.default.quotationRequest.count();
        const year = new Date().getFullYear();
        return `SC-${year}-${String(count + 1).padStart(4, '0')}`;
    }
}
exports.QuotationRequestRepository = QuotationRequestRepository;
class QuotationRepository {
    async findAll() {
        return client_1.default.quotation.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                supplier: true,
                items: true,
            },
        });
    }
    async findById(id) {
        return client_1.default.quotation.findUnique({
            where: { id },
            include: {
                supplier: true,
                items: true,
            },
        });
    }
    async findByQuotationRequest(quotationRequestId) {
        return client_1.default.quotation.findMany({
            where: { quotationRequestId },
            include: {
                supplier: true,
                items: true,
            },
        });
    }
    async create(data, receivedById) {
        const code = await this.generateCode();
        let subtotal = 0;
        const itemsData = data.items.map(item => {
            const total = item.unitPrice * item.quantity - (item.discount || 0);
            subtotal += total;
            return {
                quotationRequestItemId: item.quotationRequestItemId,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                discount: item.discount || 0,
                total,
                deliveryTime: item.deliveryTime,
                availability: item.availability,
                brand: item.brand,
                observations: item.observations,
            };
        });
        const tax = subtotal * 0.19;
        const total = subtotal + tax;
        return client_1.default.quotation.create({
            data: {
                code,
                quotationRequestId: data.quotationRequestId,
                supplierId: data.supplierId,
                validUntil: data.validUntil,
                subtotal,
                discount: 0,
                tax,
                total,
                notes: data.notes,
                paymentTerms: data.paymentTerms,
                deliveryTime: data.deliveryTime,
                receivedById,
                items: {
                    create: itemsData,
                },
            },
            include: { items: true },
        });
    }
    async updateStatus(id, status) {
        return client_1.default.quotation.update({
            where: { id },
            data: { status: status },
            include: { items: true },
        });
    }
    async generateCode() {
        const count = await client_1.default.quotation.count();
        const year = new Date().getFullYear();
        return `COT-${year}-${String(count + 1).padStart(4, '0')}`;
    }
}
exports.QuotationRepository = QuotationRepository;
exports.quotationRequestRepository = new QuotationRequestRepository();
exports.quotationRepository = new QuotationRepository();
//# sourceMappingURL=quotationRepository.js.map