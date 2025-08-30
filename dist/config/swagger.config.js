"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swagger = Swagger;
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
function Swagger(app) {
    app.register(swagger_1.default, {
        openapi: {
            info: {
                title: 'InfraWatch API',
                description: 'Documentação automática da API do InfraWatch',
                version: '1.0.0',
            },
        },
    });
    app.register(swagger_ui_1.default, {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: false,
        },
    });
}
//# sourceMappingURL=swagger.config.js.map