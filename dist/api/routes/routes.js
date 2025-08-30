"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = Routes;
const status_routes_1 = __importDefault(require("./status.routes"));
const ping_routes_1 = require("./ping.routes");
const user_routes_1 = require("./user.routes");
const system_routes_1 = require("./system.routes");
const AuditLogMiddleware_1 = require("../middleware/AuditLogMiddleware");
async function Routes(app) {
    await app.register(AuditLogMiddleware_1.auditLogPlugin);
    app.register(status_routes_1.default);
    app.register(ping_routes_1.pingRoutes);
    app.register(user_routes_1.userRoutes);
    app.register(system_routes_1.SystemRoutes);
}
//# sourceMappingURL=routes.js.map