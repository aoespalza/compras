"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUseCases = exports.AuthUseCases = void 0;
const userRepository_1 = require("../../infrastructure/repositories/userRepository");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'procura-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
class AuthUseCases {
    async login(username, password) {
        const user = await userRepository_1.userRepository.verifyPassword(username, password);
        if (!user) {
            throw new Error('Credenciales inválidas');
        }
        if (!user.isActive) {
            throw new Error('Usuario inactivo');
        }
        const payload = {
            userId: user.id,
            username: user.username,
            role: user.role,
        };
        const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '24h' });
        return { user, token };
    }
    async getAllUsers() {
        return userRepository_1.userRepository.findAll();
    }
    async getUserById(id) {
        return userRepository_1.userRepository.findById(id);
    }
    async createUser(data) {
        const existing = await userRepository_1.userRepository.findByUsername(data.username);
        if (existing) {
            throw new Error('Ya existe un usuario con este nombre de usuario');
        }
        if (data.email) {
            const existingEmail = await userRepository_1.userRepository.findByEmail(data.email);
            if (existingEmail) {
                throw new Error('Ya existe un usuario con este correo electrónico');
            }
        }
        return userRepository_1.userRepository.create(data);
    }
    async updateUser(id, data) {
        const user = await userRepository_1.userRepository.findById(id);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        return userRepository_1.userRepository.update(id, data);
    }
    async deleteUser(id) {
        const user = await userRepository_1.userRepository.findById(id);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        await userRepository_1.userRepository.delete(id);
    }
    async verifyToken(token) {
        try {
            const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            return payload;
        }
        catch {
            throw new Error('Token inválido');
        }
    }
}
exports.AuthUseCases = AuthUseCases;
exports.authUseCases = new AuthUseCases();
//# sourceMappingURL=authUseCases.js.map