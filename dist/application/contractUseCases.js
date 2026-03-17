"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractUseCases = void 0;
class ContractUseCases {
    constructor(repository) {
        this.repository = repository;
    }
    async getAll(filters) {
        return this.repository.findAll(filters);
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
}
exports.ContractUseCases = ContractUseCases;
//# sourceMappingURL=contractUseCases.js.map