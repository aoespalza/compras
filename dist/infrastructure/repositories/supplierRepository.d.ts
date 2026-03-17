import { Supplier, CreateSupplierDTO, UpdateSupplierDTO } from '../../domain/supplier';
export declare class SupplierRepository {
    findAll(): Promise<Supplier[]>;
    findLast(): Promise<Supplier | null>;
    findById(id: string): Promise<Supplier | null>;
    findByCode(code: string): Promise<Supplier | null>;
    findByStatus(status: string): Promise<Supplier[]>;
    create(data: CreateSupplierDTO): Promise<Supplier>;
    update(id: string, data: UpdateSupplierDTO): Promise<Supplier>;
    delete(id: string): Promise<void>;
    updateStatus(id: string, status: string): Promise<Supplier>;
}
export declare const supplierRepository: SupplierRepository;
//# sourceMappingURL=supplierRepository.d.ts.map