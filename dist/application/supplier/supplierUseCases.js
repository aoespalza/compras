"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierUseCases = exports.SupplierUseCases = void 0;
const supplierRepository_1 = require("../../infrastructure/repositories/supplierRepository");
class SupplierUseCases {
    async getAllSuppliers() {
        return supplierRepository_1.supplierRepository.findAll();
    }
    async getSupplierById(id) {
        return supplierRepository_1.supplierRepository.findById(id);
    }
    async getSuppliersByStatus(status) {
        return supplierRepository_1.supplierRepository.findByStatus(status);
    }
    async createSupplier(data) {
        // Check for duplicate name
        const existing = await supplierRepository_1.supplierRepository.findByName(data.name);
        if (existing) {
            throw new Error('Ya existe un proveedor con este nombre');
        }
        return supplierRepository_1.supplierRepository.create(data);
    }
    async updateSupplier(id, data) {
        const supplier = await supplierRepository_1.supplierRepository.findById(id);
        if (!supplier) {
            throw new Error('Proveedor no encontrado');
        }
        return supplierRepository_1.supplierRepository.update(id, data);
    }
    async deleteSupplier(id) {
        const supplier = await supplierRepository_1.supplierRepository.findById(id);
        if (!supplier) {
            throw new Error('Proveedor no encontrado');
        }
        await supplierRepository_1.supplierRepository.delete(id);
    }
    async updateSupplierStatus(id, status) {
        const supplier = await supplierRepository_1.supplierRepository.findById(id);
        if (!supplier) {
            throw new Error('Proveedor no encontrado');
        }
        return supplierRepository_1.supplierRepository.updateStatus(id, status);
    }
}
exports.SupplierUseCases = SupplierUseCases;
exports.supplierUseCases = new SupplierUseCases();
//# sourceMappingURL=supplierUseCases.js.map