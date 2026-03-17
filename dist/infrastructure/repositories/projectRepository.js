"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRepository = void 0;
const client_1 = __importDefault(require("../prisma/client"));
class ProjectRepository {
    async findAll() {
        return client_1.default.project.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        return client_1.default.project.findUnique({
            where: { id },
        });
    }
    async findByCode(code) {
        return client_1.default.project.findUnique({
            where: { code },
        });
    }
    async findByStatus(status) {
        return client_1.default.project.findMany({
            where: { status: status },
            orderBy: { name: 'asc' },
        });
    }
    async create(data) {
        return client_1.default.project.create({
            data: {
                ...data,
                status: data.status || 'PLANNING',
            },
        });
    }
    async update(id, data) {
        const updateData = { ...data };
        if (data.status) {
            updateData.status = data.status;
        }
        return client_1.default.project.update({
            where: { id },
            data: updateData,
        });
    }
    async delete(id) {
        await client_1.default.project.delete({
            where: { id },
        });
    }
    async updateStatus(id, status) {
        return client_1.default.project.update({
            where: { id },
            data: { status: status },
        });
    }
    async findLast() {
        const last = await client_1.default.project.findFirst({
            orderBy: { createdAt: 'desc' },
        });
        return last;
    }
}
exports.ProjectRepository = ProjectRepository;
//# sourceMappingURL=projectRepository.js.map