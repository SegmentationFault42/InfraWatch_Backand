"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = statusRoutes;
const status_controller_1 = __importDefault(require("../controllers/status.controller"));
const status_schema_1 = require("../schema/status.schema");
async function statusRoutes(fastify) {
    fastify.get('/status', { schema: status_schema_1.getStatusSchema }, status_controller_1.default.getStatus);
}
//# sourceMappingURL=status.routes.js.map