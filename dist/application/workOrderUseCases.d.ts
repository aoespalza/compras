import { WorkOrderRepository } from '../infrastructure/repositories/workOrderRepository';
import { WorkOrder, CreateWorkOrderDTO, UpdateWorkOrderDTO } from '../domain/workOrder/workOrderEntity';
export declare class WorkOrderUseCases {
    private repository;
    constructor(repository: WorkOrderRepository);
    getAll(): Promise<WorkOrder[]>;
    getById(id: string): Promise<WorkOrder | null>;
    create(data: CreateWorkOrderDTO): Promise<WorkOrder>;
    update(id: string, data: UpdateWorkOrderDTO): Promise<WorkOrder>;
    delete(id: string): Promise<void>;
    updateStatus(id: string, status: string): Promise<WorkOrder>;
}
//# sourceMappingURL=workOrderUseCases.d.ts.map