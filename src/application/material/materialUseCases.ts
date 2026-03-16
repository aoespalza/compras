import { materialRepository } from '../../infrastructure/repositories/materialRepository';
import { Material, CreateMaterialDTO, UpdateMaterialDTO } from '../../domain/material';

export class MaterialUseCases {
  async getAllMaterials(): Promise<Material[]> {
    return materialRepository.findAll();
  }

  async getMaterialById(id: string): Promise<Material | null> {
    return materialRepository.findById(id);
  }

  async getMaterialsByCategory(category: string): Promise<Material[]> {
    return materialRepository.findByCategory(category);
  }

  async getActiveMaterials(): Promise<Material[]> {
    return materialRepository.findActive();
  }

  async createMaterial(data: CreateMaterialDTO): Promise<Material> {
    // Check for duplicate name
    const existing = await materialRepository.findByName(data.name);
    if (existing) {
      throw new Error('Ya existe un material con este nombre');
    }
    return materialRepository.create(data);
  }

  async updateMaterial(id: string, data: UpdateMaterialDTO): Promise<Material> {
    const material = await materialRepository.findById(id);
    if (!material) {
      throw new Error('Material no encontrado');
    }
    return materialRepository.update(id, data);
  }

  async deleteMaterial(id: string): Promise<void> {
    const material = await materialRepository.findById(id);
    if (!material) {
      throw new Error('Material no encontrado');
    }
    await materialRepository.delete(id);
  }
}

export const materialUseCases = new MaterialUseCases();
