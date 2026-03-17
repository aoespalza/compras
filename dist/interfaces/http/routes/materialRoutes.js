"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.materialController = exports.MaterialController = void 0;
const materialUseCases_1 = require("../../../application/material/materialUseCases");
class MaterialController {
    async getAll(req, res) {
        try {
            const { category, active, page = '1', limit = '10', search = '' } = req.query;
            const pageNum = parseInt(page, 10);
            const limitNum = parseInt(limit, 10);
            let materials;
            if (category) {
                materials = await materialUseCases_1.materialUseCases.getMaterialsByCategory(category);
            }
            else if (active === 'true') {
                materials = await materialUseCases_1.materialUseCases.getActiveMaterials();
            }
            else {
                materials = await materialUseCases_1.materialUseCases.getAllMaterials();
            }
            // Filter by search if provided
            if (search) {
                const searchLower = search.toLowerCase();
                materials = materials.filter((m) => m.name?.toLowerCase().includes(searchLower) ||
                    m.code?.toLowerCase().includes(searchLower));
            }
            const total = materials.length;
            const totalPages = Math.ceil(total / limitNum);
            const startIndex = (pageNum - 1) * limitNum;
            const paginatedData = materials.slice(startIndex, startIndex + limitNum);
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
            const material = await materialUseCases_1.materialUseCases.getMaterialById(req.params.id);
            if (!material) {
                return res.status(404).json({ error: 'Material no encontrado' });
            }
            res.json(material);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async create(req, res) {
        try {
            console.log('=== CREATE MATERIAL ===');
            console.log('Body:', JSON.stringify(req.body, null, 2));
            const data = req.body;
            const material = await materialUseCases_1.materialUseCases.createMaterial(data);
            res.status(201).json(material);
        }
        catch (error) {
            console.error('Error creating material:', error);
            res.status(400).json({ error: error.message });
        }
    }
    async update(req, res) {
        try {
            const data = req.body;
            const material = await materialUseCases_1.materialUseCases.updateMaterial(req.params.id, data);
            res.json(material);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async delete(req, res) {
        try {
            await materialUseCases_1.materialUseCases.deleteMaterial(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.MaterialController = MaterialController;
exports.materialController = new MaterialController();
//# sourceMappingURL=materialRoutes.js.map