"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.materialUseCases = exports.MaterialUseCases = void 0;
const materialRepository_1 = require("../../infrastructure/repositories/materialRepository");
class MaterialUseCases {
    async getAllMaterials() {
        return materialRepository_1.materialRepository.findAll();
    }
    async getMaterialById(id) {
        return materialRepository_1.materialRepository.findById(id);
    }
    async getMaterialsByCategory(category) {
        return materialRepository_1.materialRepository.findByCategory(category);
    }
    async getActiveMaterials() {
        return materialRepository_1.materialRepository.findActive();
    }
    async createMaterial(data) {
        // Generar código automático si no se proporciona
        if (!data.code) {
            data.code = await materialRepository_1.materialRepository.generateCode();
        }
        else {
            const existing = await materialRepository_1.materialRepository.findByCode(data.code);
            if (existing) {
                throw new Error('Ya existe un material con este código');
            }
        }
        return materialRepository_1.materialRepository.create(data);
    }
    async updateMaterial(id, data) {
        const material = await materialRepository_1.materialRepository.findById(id);
        if (!material) {
            throw new Error('Material no encontrado');
        }
        return materialRepository_1.materialRepository.update(id, data);
    }
    async deleteMaterial(id) {
        const material = await materialRepository_1.materialRepository.findById(id);
        if (!material) {
            throw new Error('Material no encontrado');
        }
        await materialRepository_1.materialRepository.delete(id);
    }
}
exports.MaterialUseCases = MaterialUseCases;
exports.materialUseCases = new MaterialUseCases();
//# sourceMappingURL=materialUseCases.js.map