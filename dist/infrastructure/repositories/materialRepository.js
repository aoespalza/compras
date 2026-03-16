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
    async findByName(name) {
        return client_1.default.material.findFirst({
            where: { name: { equals: name, mode: 'insensitive' } },
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
        const code = await this.generateCode();
        return client_1.default.material.create({
            data: {
                ...data,
                code: data.code || code,
            },
        });
    }
    async generateCode() {
        const count = await client_1.default.material.count();
        return `MAT-${String(count + 1).padStart(5, '0')}`;
    }
    async update(id, data) {
        return client_1.default.material.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        await client_1.default.material.delete({
            where: { id },
        });
    }
    async count() {
        return client_1.default.material.count();
    }
}
exports.MaterialRepository = MaterialRepository;
exports.materialRepository = new MaterialRepository();
//# sourceMappingURL=materialRepository.js.map