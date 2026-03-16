"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierController = exports.SupplierController = void 0;
const supplierUseCases_1 = require("../../../application/supplier/supplierUseCases");
class SupplierController {
    async getAll(req, res) {
        try {
            const { status } = req.query;
            const suppliers = status
                ? await supplierUseCases_1.supplierUseCases.getSuppliersByStatus(status)
                : await supplierUseCases_1.supplierUseCases.getAllSuppliers();
            res.json(suppliers);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getById(req, res) {
        try {
            const supplier = await supplierUseCases_1.supplierUseCases.getSupplierById(req.params.id);
            if (!supplier) {
                return res.status(404).json({ error: 'Proveedor no encontrado' });
            }
            res.json(supplier);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async create(req, res) {
        try {
            const data = req.body;
            const supplier = await supplierUseCases_1.supplierUseCases.createSupplier(data);
            res.status(201).json(supplier);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async update(req, res) {
        try {
            const data = req.body;
            const supplier = await supplierUseCases_1.supplierUseCases.updateSupplier(req.params.id, data);
            res.json(supplier);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async delete(req, res) {
        try {
            await supplierUseCases_1.supplierUseCases.deleteSupplier(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async updateStatus(req, res) {
        try {
            const { status } = req.body;
            const supplier = await supplierUseCases_1.supplierUseCases.updateSupplierStatus(req.params.id, status);
            res.json(supplier);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.SupplierController = SupplierController;
exports.supplierController = new SupplierController();
//# sourceMappingURL=supplierRoutes.js.map