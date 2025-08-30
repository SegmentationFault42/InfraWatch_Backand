"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.ENV = {
    PORT: Number(process.env.Port) || 3333,
    JWT_SECRET: process.env.JWT_SECRET || '91bfe63e-8995-4fcc-b93b-91f16ecf1a96',
    NODE_ENV: process.env.NODE_ENV,
    HOST: process.env.HOST || '0.0.0.0',
    COOKIE_SECRET: process.env.COOKIE_SECRET || '085c061f-ce24-411c-bef8-cc6eec4bf686',
};
//# sourceMappingURL=dotenv.js.map