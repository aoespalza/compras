"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkOrderController = void 0;
const workOrderUseCases_1 = require("../../../application/workOrderUseCases");
const workOrderRepository_1 = require("../../../infrastructure/repositories/workOrderRepository");
const client_1 = __importDefault(require("../../../infrastructure/prisma/client"));
const repository = new workOrderRepository_1.WorkOrderRepository(client_1.default);
const useCases = new workOrderUseCases_1.WorkOrderUseCases(repository);
class WorkOrderController {
    async getAll(req, res) {
        try {
            const workOrders = await useCases.getAll();
            const formatted = workOrders.map((wo) => ({
                ...wo,
                supplierName: wo.supplier?.name,
                projectName: wo.project?.name
            }));
            res.json(formatted);
        }
        catch (error) {
            console.error('Error fetching work orders:', error);
            res.status(500).json({ error: 'Error al obtener órdenes de trabajo' });
        }
    }
    async getById(req, res) {
        try {
            const workOrder = await useCases.getById(req.params.id);
            if (!workOrder) {
                return res.status(404).json({ error: 'Orden de trabajo no encontrada' });
            }
            res.json({
                ...workOrder,
                supplierName: workOrder.supplier?.name,
                projectName: workOrder.project?.name
            });
        }
        catch (error) {
            console.error('Error fetching work order:', error);
            res.status(500).json({ error: 'Error al obtener orden de trabajo' });
        }
    }
    async create(req, res) {
        try {
            const workOrder = await useCases.create(req.body);
            res.status(201).json({
                ...workOrder,
                supplierName: workOrder.supplier?.name,
                projectName: workOrder.project?.name
            });
        }
        catch (error) {
            console.error('Error creating work order:', error);
            res.status(500).json({ error: 'Error al crear orden de trabajo' });
        }
    }
    async update(req, res) {
        try {
            const workOrder = await useCases.update(req.params.id, req.body);
            res.json({
                ...workOrder,
                supplierName: workOrder.supplier?.name,
                projectName: workOrder.project?.name
            });
        }
        catch (error) {
            console.error('Error updating work order:', error);
            res.status(500).json({ error: 'Error al actualizar orden de trabajo' });
        }
    }
    async delete(req, res) {
        try {
            await useCases.delete(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            console.error('Error deleting work order:', error);
            res.status(500).json({ error: 'Error al eliminar orden de trabajo' });
        }
    }
    async updateStatus(req, res) {
        try {
            const { status } = req.body;
            const workOrder = await useCases.updateStatus(req.params.id, status);
            res.json({
                ...workOrder,
                supplierName: workOrder.supplier?.name
            });
        }
        catch (error) {
            console.error('Error updating work order status:', error);
            res.status(500).json({ error: 'Error al actualizar estado' });
        }
    }
}
exports.WorkOrderController = WorkOrderController;
exports.default = new WorkOrderController();
//# sourceMappingURL=workOrderRoutes.js.map