"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const fastify_1 = __importDefault(require("fastify"));
const dotenv_1 = require("./config/dotenv");
const routes_1 = require("./api/routes/routes");
const swagger_config_1 = require("./config/swagger.config");
const cookie_1 = __importDefault(require("@fastify/cookie"));
const AuditLogMiddleware_1 = require("./api/middleware/AuditLogMiddleware");
const monitoring_init_1 = require("./jobs/monitoring-init");
exports.app = (0, fastify_1.default)({ logger: false });
(0, swagger_config_1.Swagger)(exports.app);
exports.app.register(AuditLogMiddleware_1.auditLogPlugin);
exports.app.register(routes_1.Routes);
exports.app.register(Promise.resolve().then(() => __importStar(require('@fastify/rate-limit'))), {
    max: 100,
    timeWindow: '1 minute',
});
(0, monitoring_init_1.initMonitoring)();
exports.app.register(cookie_1.default, {
    secret: dotenv_1.ENV.COOKIE_SECRET,
    hook: 'onRequest',
});
exports.app.listen({
    port: dotenv_1.ENV.PORT,
    host: dotenv_1.ENV.HOST,
}, () => {
    console.log(`Server Running on port: ${dotenv_1.ENV.PORT}`);
});
//# sourceMappingURL=app.js.map