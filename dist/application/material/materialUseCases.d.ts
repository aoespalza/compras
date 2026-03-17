import { Material, CreateMaterialDTO, UpdateMaterialDTO } from '../../domain/material';
export declare class MaterialUseCases {
    getAllMaterials(): Promise<Material[]>;
    getMaterialById(id: string): Promise<Material | null>;
    getMaterialsByCategory(category: string): Promise<Material[]>;
    getActiveMaterials(): Promise<Material[]>;
    createMaterial(data: CreateMaterialDTO): Promise<Material>;
    updateMaterial(id: string, data: UpdateMaterialDTO): Promise<Material>;
    deleteMaterial(id: string): Promise<void>;
}
export declare const materialUseCases: MaterialUseCases;
//# sourceMappingURL=materialUseCases.d.ts.map