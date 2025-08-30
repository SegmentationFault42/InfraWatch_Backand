"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogRepository = void 0;
const database_1 = require("../../config/database");
class AuditLogRepository {
    async createLog(data) {
        return database_1.prisma.audit_logs.create({ data });
    }
}
exports.auditLogRepository = new AuditLogRepository();
//# sourceMappingURL=auditLogRepository.js.map