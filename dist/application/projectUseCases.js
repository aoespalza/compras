"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectUseCases = void 0;
class ProjectUseCases {
    constructor(repository) {
        this.repository = repository;
    }
    async getAll() {
        return this.repository.findAll();
    }
    async getById(id) {
        const project = await this.repository.findById(id);
        if (!project) {
            throw new Error('Proyecto no encontrado');
        }
        return project;
    }
    async getByStatus(status) {
        return this.repository.findByStatus(status);
    }
    async create(data) {
        // Validar código único
        const existing = await this.repository.findByCode(data.code);
        if (existing) {
            throw new Error('Ya existe un proyecto con este código');
        }
        return this.repository.create(data);
    }
    async update(id, data) {
        const existing = await this.repository.findById(id);
        if (!existing) {
            throw new Error('Proyecto no encontrado');
        }
        return this.repository.update(id, data);
    }
    async delete(id) {
        const existing = await this.repository.findById(id);
        if (!existing) {
            throw new Error('Proyecto no encontrado');
        }
        return this.repository.delete(id);
    }
    async updateStatus(id, status) {
        const existing = await this.repository.findById(id);
        if (!existing) {
            throw new Error('Proyecto no encontrado');
        }
        return this.repository.updateStatus(id, status);
    }
    async generateCode() {
        const last = await this.repository.findLast();
        const year = new Date().getFullYear();
        if (!last) {
            return `PRY-${year}-0001`;
        }
        const lastCode = last.code;
        const lastNumber = parseInt(lastCode.split('-')[2] || '0');
        const newNumber = lastNumber + 1;
        return `PRY-${year}-${newNumber.toString().padStart(4, '0')}`;
    }
}
exports.ProjectUseCases = ProjectUseCases;
//# sourceMappingURL=projectUseCases.js.map