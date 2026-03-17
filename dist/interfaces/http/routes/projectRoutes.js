"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const projectUseCases_1 = require("../../../application/projectUseCases");
const projectRepository_1 = require("../../../infrastructure/repositories/projectRepository");
const repository = new projectRepository_1.ProjectRepository();
const useCases = new projectUseCases_1.ProjectUseCases(repository);
class ProjectController {
    async getAll(req, res) {
        try {
            const { status } = req.query;
            let projects;
            if (status) {
                projects = await useCases.getByStatus(status);
            }
            else {
                projects = await useCases.getAll();
            }
            res.json({
                data: projects,
                total: projects.length,
                page: 1,
                limit: 10,
                totalPages: Math.ceil(projects.length / 10)
            });
        }
        catch (error) {
            console.error('Error fetching projects:', error);
            res.status(500).json({ error: 'Error al obtener proyectos' });
        }
    }
    async getById(req, res) {
        try {
            const project = await useCases.getById(req.params.id);
            res.json(project);
        }
        catch (error) {
            console.error('Error fetching project:', error);
            res.status(404).json({ error: error.message || 'Proyecto no encontrado' });
        }
    }
    async create(req, res) {
        try {
            const code = await useCases.generateCode();
            const project = await useCases.create({ ...req.body, code });
            res.status(201).json(project);
        }
        catch (error) {
            console.error('Error creating project:', error);
            res.status(400).json({ error: error.message || 'Error al crear proyecto' });
        }
    }
    async update(req, res) {
        try {
            const project = await useCases.update(req.params.id, req.body);
            res.json(project);
        }
        catch (error) {
            console.error('Error updating project:', error);
            res.status(404).json({ error: error.message || 'Proyecto no encontrado' });
        }
    }
    async delete(req, res) {
        try {
            await useCases.delete(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            console.error('Error deleting project:', error);
            res.status(404).json({ error: error.message || 'Proyecto no encontrado' });
        }
    }
    async updateStatus(req, res) {
        try {
            const { status } = req.body;
            const project = await useCases.updateStatus(req.params.id, status);
            res.json(project);
        }
        catch (error) {
            console.error('Error updating project status:', error);
            res.status(404).json({ error: error.message || 'Proyecto no encontrado' });
        }
    }
}
exports.ProjectController = ProjectController;
exports.default = new ProjectController();
//# sourceMappingURL=projectRoutes.js.map