"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectUseCases = exports.ProjectUseCases = void 0;
const projectRepository_1 = require("../../infrastructure/repositories/projectRepository");
class ProjectUseCases {
    async getAllProjects() {
        return projectRepository_1.projectRepository.findAll();
    }
    async getProjectById(id) {
        const project = await projectRepository_1.projectRepository.findById(id);
        if (!project) {
            throw new Error('Proyecto no encontrado');
        }
        return project;
    }
    async getProjectsByStatus(status) {
        return projectRepository_1.projectRepository.findByStatus(status);
    }
    async createProject(data) {
        // Validar código único
        const existing = await projectRepository_1.projectRepository.findByCode(data.code);
        if (existing) {
            throw new Error(`Ya existe un proyecto con el código ${data.code}`);
        }
        return projectRepository_1.projectRepository.create(data);
    }
    async updateProject(id, data) {
        const project = await projectRepository_1.projectRepository.findById(id);
        if (!project) {
            throw new Error('Proyecto no encontrado');
        }
        return projectRepository_1.projectRepository.update(id, data);
    }
    async deleteProject(id) {
        const project = await projectRepository_1.projectRepository.findById(id);
        if (!project) {
            throw new Error('Proyecto no encontrado');
        }
        // Verificar que no tenga órdenes activas
        const activeOrders = project.purchaseOrders?.filter((o) => !['RECEIVED', 'CANCELLED'].includes(o.status));
        if (activeOrders && activeOrders.length > 0) {
            throw new Error('No se puede eliminar un proyecto con órdenes de compra activas');
        }
        return projectRepository_1.projectRepository.delete(id);
    }
    async updateProjectStatus(id, status) {
        const project = await projectRepository_1.projectRepository.findById(id);
        if (!project) {
            throw new Error('Proyecto no encontrado');
        }
        return projectRepository_1.projectRepository.updateStatus(id, status);
    }
}
exports.ProjectUseCases = ProjectUseCases;
exports.projectUseCases = new ProjectUseCases();
//# sourceMappingURL=projectUseCases.js.map