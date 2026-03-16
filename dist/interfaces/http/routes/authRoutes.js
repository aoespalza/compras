"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const authUseCases_1 = require("../../../application/auth/authUseCases");
class AuthController {
    async login(req, res) {
        try {
            const { username, password } = req.body;
            const result = await authUseCases_1.authUseCases.login(username, password);
            res.json(result);
        }
        catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
    async getAllUsers(req, res) {
        try {
            const users = await authUseCases_1.authUseCases.getAllUsers();
            res.json(users);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getUserById(req, res) {
        try {
            const user = await authUseCases_1.authUseCases.getUserById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.json(user);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async createUser(req, res) {
        try {
            const data = req.body;
            const user = await authUseCases_1.authUseCases.createUser(data);
            res.status(201).json(user);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async updateUser(req, res) {
        try {
            const data = req.body;
            const user = await authUseCases_1.authUseCases.updateUser(req.params.id, data);
            res.json(user);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async deleteUser(req, res) {
        try {
            await authUseCases_1.authUseCases.deleteUser(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getProfile(req, res) {
        try {
            const user = await authUseCases_1.authUseCases.getUserById(req.user.userId);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.json(user);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
//# sourceMappingURL=authRoutes.js.map