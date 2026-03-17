import { PrismaClient, WorkOrder } from '@prisma/client';
import { CreateWorkOrderDTO, UpdateWorkOrderDTO } from '../../domain/workOrder/workOrderEntity';
export declare class WorkOrderRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    findAll(): Promise<WorkOrder[]>;
    findById(id: string): Promise<WorkOrder | null>;
    getLastWorkOrder(): Promise<WorkOrder | null>;
    getLastWorkOrderByProject(projectId: string | null): Promise<WorkOrder | null>;
    generateCode(projectId: string | null): Promise<string>;
    create(data: CreateWorkOrderDTO): Promise<WorkOrder>;
    update(id: string, data: UpdateWorkOrderDTO): Promise<WorkOrder>;
    delete(id: string): Promise<void>;
    updateStatus(id: string, status: string): Promise<WorkOrder>;
}
//# sourceMappingURL=workOrderRepository.d.ts.map