"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.materialController = exports.MaterialController = void 0;
const materialUseCases_1 = require("../../../application/material/materialUseCases");
class MaterialController {
    async getAll(req, res) {
        try {
            const { category, active } = req.query;
            if (category) {
                const materials = await materialUseCases_1.materialUseCases.getMaterialsByCategory(category);
                return res.json(materials);
            }
            if (active === 'true') {
                const materials = await materialUseCases_1.materialUseCases.getActiveMaterials();
                return res.json(materials);
            }
            const materials = await materialUseCases_1.materialUseCases.getAllMaterials();
            res.json(materials);
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
            const data = req.body;
            const material = await materialUseCases_1.materialUseCases.createMaterial(data);
            res.status(201).json(material);
        }
        catch (error) {
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