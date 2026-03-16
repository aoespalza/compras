import { Material, CreateMaterialDTO, UpdateMaterialDTO } from '../../domain/material';
export declare class MaterialRepository {
    findAll(): Promise<Material[]>;
    findById(id: string): Promise<Material | null>;
    findByCode(code: string): Promise<Material | null>;
    findByName(name: string): Promise<Material | null>;
    findByCategory(category: string): Promise<Material[]>;
    findActive(): Promise<Material[]>;
    create(data: CreateMaterialDTO): Promise<Material>;
    private generateCode;
    update(id: string, data: UpdateMaterialDTO): Promise<Material>;
    delete(id: string): Promise<void>;
    count(): Promise<number>;
}
export declare const materialRepository: MaterialRepository;
//# sourceMappingURL=materialRepository.d.ts.map