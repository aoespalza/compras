"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkOrderUseCases = void 0;
class WorkOrderUseCases {
    constructor(repository) {
        this.repository = repository;
    }
    async getAll() {
        return this.repository.findAll();
    }
    async getById(id) {
        return this.repository.findById(id);
    }
    async create(data) {
        return this.repository.create(data);
    }
    async update(id, data) {
        return this.repository.update(id, data);
    }
    async delete(id) {
        return this.repository.delete(id);
    }
    async updateStatus(id, status) {
        return this.repository.updateStatus(id, status);
    }
}
exports.WorkOrderUseCases = WorkOrderUseCases;
//# sourceMappingURL=workOrderUseCases.js.map