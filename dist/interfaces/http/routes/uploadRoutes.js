"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../../shared/middleware/auth");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const router = (0, express_1.Router)();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = '/tmp/uploads/rut';
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        cb(null, `rut-${(0, uuid_1.v4)()}${ext}`);
    }
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Solo se permiten archivos PDF'));
        }
    }
});
// Upload RUT file
router.post('/upload-rut', auth_1.authenticate, upload.single('rutFile'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se ha proporcionado ningún archivo' });
        }
        res.json({
            message: 'Archivo subido correctamente',
            filename: req.file.filename,
            path: req.file.path,
            originalName: req.file.originalname
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get RUT file
router.get('/rut/:filename', auth_1.authenticate, (req, res) => {
    try {
        const filePath = path_1.default.join('/tmp/uploads/rut', req.params.filename);
        if (!fs_1.default.existsSync(filePath)) {
            return res.status(404).json({ error: 'Archivo no encontrado' });
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${req.params.filename}"`);
        fs_1.default.createReadStream(filePath).pipe(res);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=uploadRoutes.js.map