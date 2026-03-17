"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.materialRepository = exports.MaterialRepository = void 0;
const client_1 = __importDefault(require("../prisma/client"));
class MaterialRepository {
    async findAll() {
        return client_1.default.material.findMany({
            orderBy: { name: 'asc' },
        });
    }
    async findById(id) {
        return client_1.default.material.findUnique({
            where: { id },
        });
    }
    async findByCode(code) {
        return client_1.default.material.findUnique({
            where: { code },
        });
    }
    async findByCategory(category) {
        return client_1.default.material.findMany({
            where: { category: category },
            orderBy: { name: 'asc' },
        });
    }
    async findActive() {
        return client_1.default.material.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        });
    }
    async create(data) {
        return client_1.default.material.create({
            data: {
                code: data.code,
                name: data.name,
                description: data.description,
                category: data.category,
                unitOfMeasure: data.unitOfMeasure,
                defaultUnitPrice: data.defaultUnitPrice,
                minStock: data.minStock,
                isActive: true,
            },
        });
    }
    async update(id, data) {
        return client_1.default.material.update({
            where: { id },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.description !== undefined && { description: data.description }),
                ...(data.category !== undefined && { category: data.category }),
                ...(data.unitOfMeasure !== undefined && { unitOfMeasure: data.unitOfMeasure }),
                ...(data.defaultUnitPrice !== undefined && { defaultUnitPrice: data.defaultUnitPrice }),
                ...(data.minStock !== undefined && { minStock: data.minStock }),
                ...(data.isActive !== undefined && { isActive: data.isActive }),
            },
        });
    }
    async delete(id) {
        await client_1.default.material.delete({
            where: { id },
        });
    }
    async generateCode() {
        const count = await client_1.default.material.count();
        const year = new Date().getFullYear();
        return `MAT-${year}-${String(count + 1).padStart(4, '0')}`;
    }
}
exports.MaterialRepository = MaterialRepository;
exports.materialRepository = new MaterialRepository();
//# sourceMappingURL=materialRepository.js.map