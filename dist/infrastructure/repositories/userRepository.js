"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = exports.UserRepository = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserRepository {
    async findAll() {
        const users = await client_1.default.user.findMany({
            orderBy: { username: 'asc' },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                name: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return users;
    }
    async findById(id) {
        const user = await client_1.default.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                name: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return user;
    }
    async findByUsername(username) {
        return client_1.default.user.findUnique({
            where: { username },
        });
    }
    async findByEmail(email) {
        const user = await client_1.default.user.findFirst({
            where: { email },
        });
        return user;
    }
    async create(data) {
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
        const user = await client_1.default.user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                name: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return user;
    }
    async update(id, data) {
        const updateData = { ...data };
        if (data.password) {
            updateData.password = await bcryptjs_1.default.hash(data.password, 10);
        }
        const user = await client_1.default.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                name: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return user;
    }
    async delete(id) {
        await client_1.default.user.delete({
            where: { id },
        });
    }
    async verifyPassword(username, password) {
        const user = await client_1.default.user.findUnique({
            where: { username },
        });
        if (!user)
            return null;
        const isValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isValid)
            return null;
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
exports.UserRepository = UserRepository;
exports.userRepository = new UserRepository();
//# sourceMappingURL=userRepository.js.map