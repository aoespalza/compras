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
    async findByName(name) {
        return client_1.default.supplier.findFirst({
            where: { name: { equals: name, mode: 'insensitive' } },
        });
    }
    async findByStatus(status) {
        return client_1.default.supplier.findMany({
            where: { status: status },
            orderBy: { name: 'asc' },
        });
    }
    async create(data) {
        const code = await this.generateCode();
        return client_1.default.supplier.create({
            data: {
                ...data,
                code: data.code || code,
                categories: data.categories || [],
            },
        });
    }
    async generateCode() {
        const count = await client_1.default.supplier.count();
        const year = new Date().getFullYear();
        return `PROV-${year}-${String(count + 1).padStart(4, '0')}`;
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
    async count() {
        return client_1.default.supplier.count();
    }
    async countActive() {
        return client_1.default.supplier.count({
            where: { status: 'ACTIVE' },
        });
    }
}
exports.SupplierRepository = SupplierRepository;
exports.supplierRepository = new SupplierRepository();
//# sourceMappingURL=supplierRepository.js.map