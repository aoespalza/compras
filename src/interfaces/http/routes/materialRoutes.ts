import { Request, Response } from 'express';
import { materialUseCases } from '../../../application/material/materialUseCases';
import { CreateMaterialDTO, UpdateMaterialDTO } from '../../../domain/material';

export class MaterialController {
  async getAll(req: Request, res: Response) {
    try {
      const { category, active } = req.query;
      
      if (category) {
        const materials = await materialUseCases.getMaterialsByCategory(category as string);
        return res.json(materials);
      }
      
      if (active === 'true') {
        const materials = await materialUseCases.getActiveMaterials();
        return res.json(materials);
      }
      
      const materials = await materialUseCases.getAllMaterials();
      res.json(materials);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const material = await materialUseCases.getMaterialById(req.params.id);
      if (!material) {
        return res.status(404).json({ error: 'Material no encontrado' });
      }
      res.json(material);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = req.body as CreateMaterialDTO;
      const material = await materialUseCases.createMaterial(data);
      res.status(201).json(material);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const data = req.body as UpdateMaterialDTO;
      const material = await materialUseCases.updateMaterial(req.params.id, data);
      res.json(material);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await materialUseCases.deleteMaterial(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export const materialController = new MaterialController();
