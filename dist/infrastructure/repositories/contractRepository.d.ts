import { PrismaClient, Contract } from '@prisma/client';
import { CreateContractDTO, UpdateContractDTO, ContractFilters } from '../../domain/contract/contractEntity';
export declare class ContractRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    findAll(filters?: ContractFilters): Promise<Contract[]>;
    findById(id: string): Promise<Contract | null>;
    getLastContract(): Promise<Contract | null>;
    generateCode(): Promise<string>;
    create(data: CreateContractDTO): Promise<Contract>;
    update(id: string, data: UpdateContractDTO): Promise<Contract>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=contractRepository.d.ts.map