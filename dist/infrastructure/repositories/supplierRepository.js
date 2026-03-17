"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierRepository = exports.SupplierRepository = void 0;
const client_1 = __importDefault(require("../prisma/client"));
class SupplierRepository {
    async findAll() {
        return client_1.default.supplier.findMany({
            orderBy: { name: 'asc' },
        });
    }
    async findLast() {
        const last = await client_1.default.supplier.findFirst({
            orderBy: { createdAt: 'desc' },
        });
        return last;
    }
    async findById(id) {
        return client_1.default.supplier.findUnique({
            where: { id },
        });
    }
    async findByCode(code) {
        return client_1.default.supplier.findUnique({
            where: { code },
        });
    }
    async findByStatus(status) {
        return client_1.default.supplier.findMany({
            where: { status: status },
            orderBy: { name: 'asc' },
        });
    }
    async create(data) {
        return client_1.default.supplier.create({
            data: {
                ...data,
                categories: data.categories || [],
            },
        });
    }
    async update(id, data) {
        return client_1.default.supplier.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        await client_1.default.supplier.delete({
            where: { id },
        });
    }
    async updateStatus(id, status) {
        return client_1.default.supplier.update({
            where: { id },
            data: { status: status },
        });
    }
}
exports.SupplierRepository = SupplierRepository;
exports.supplierRepository = new SupplierRepository();
//# sourceMappingURL=supplierRepository.js.map