"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const status_service_1 = __importDefault(require("../services/status.service"));
class StatusController {
    async getStatus(request, reply) {
        const data = status_service_1.default.getStatus();
        return reply.send(data);
    }
}
exports.default = new StatusController();
//# sourceMappingURL=status.controller.js.map