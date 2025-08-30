"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = verifyJWT;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("../../config/dotenv");
async function verifyJWT(req, res) {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }
    if (!token) {
        token = req.cookies.token;
    }
    if (!token) {
        return res.status(401).send({ error: 'Token não fornecido' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, dotenv_1.ENV.JWT_SECRET);
        req.user = decoded;
    }
    catch (error) {
        return res.status(401).send({ error: 'Token inválido ou expirado' });
    }
}
//# sourceMappingURL=verifyJWT.js.map