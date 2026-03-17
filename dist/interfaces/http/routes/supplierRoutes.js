"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierController = exports.SupplierController = void 0;
const supplierUseCases_1 = require("../../../application/supplier/supplierUseCases");
class SupplierController {
    async getAll(req, res) {
        try {
            const { status, page = '1', limit = '10', search = '' } = req.query;
            const pageNum = parseInt(page, 10);
            const limitNum = parseInt(limit, 10);
            let suppliers;
            if (status) {
                suppliers = await supplierUseCases_1.supplierUseCases.getSuppliersByStatus(status);
            }
            else {
                suppliers = await supplierUseCases_1.supplierUseCases.getAllSuppliers();
            }
            // Filter by search if provided
            if (search) {
                const searchLower = search.toLowerCase();
                suppliers = suppliers.filter((s) => s.name?.toLowerCase().includes(searchLower) ||
                    s.code?.toLowerCase().includes(searchLower));
            }
            const total = suppliers.length;
            const totalPages = Math.ceil(total / limitNum);
            const startIndex = (pageNum - 1) * limitNum;
            const paginatedData = suppliers.slice(startIndex, startIndex + limitNum);
            res.json({
                data: paginatedData,
                total,
                page: pageNum,
                limit: limitNum,
                totalPages,
            });
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
            // Generate automatic code if not provided
            if (!data.code) {
                const lastSupplier = await supplierUseCases_1.supplierUseCases.getLastSupplier();
                const nextNumber = lastSupplier ? parseInt(lastSupplier.code.replace('PROV-', '')) + 1 : 1;
                data.code = `PROV-${String(nextNumber).padStart(4, '0')}`;
            }
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