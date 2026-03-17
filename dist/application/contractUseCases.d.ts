import { ContractRepository } from '../infrastructure/repositories/contractRepository';
import { CreateContractDTO, UpdateContractDTO, ContractFilters } from '../domain/contract/contractEntity';
export declare class ContractUseCases {
    private repository;
    constructor(repository: ContractRepository);
    getAll(filters?: ContractFilters): Promise<any[]>;
    getById(id: string): Promise<any | null>;
    create(data: CreateContractDTO): Promise<any>;
    update(id: string, data: UpdateContractDTO): Promise<any>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=contractUseCases.d.ts.map