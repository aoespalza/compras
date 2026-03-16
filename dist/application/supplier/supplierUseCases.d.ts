import { Supplier, CreateSupplierDTO, UpdateSupplierDTO } from '../../domain/supplier';
export declare class SupplierUseCases {
    getAllSuppliers(): Promise<Supplier[]>;
    getSupplierById(id: string): Promise<Supplier | null>;
    getSuppliersByStatus(status: string): Promise<Supplier[]>;
    createSupplier(data: CreateSupplierDTO): Promise<Supplier>;
    updateSupplier(id: string, data: UpdateSupplierDTO): Promise<Supplier>;
    deleteSupplier(id: string): Promise<void>;
    updateSupplierStatus(id: string, status: string): Promise<Supplier>;
}
export declare const supplierUseCases: SupplierUseCases;
//# sourceMappingURL=supplierUseCases.d.ts.map