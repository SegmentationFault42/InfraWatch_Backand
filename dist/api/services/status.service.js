"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StatusService {
    getStatus() {
        return {
            status: 'ok',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
        };
    }
}
exports.default = new StatusService();
//# sourceMappingURL=status.service.js.map