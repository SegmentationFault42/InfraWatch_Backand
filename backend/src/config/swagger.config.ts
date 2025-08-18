import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';

export function Swagger(app: FastifyInstance) {
    app.register(swagger, {
        openapi: {
            info: {
                title: 'InfraWatch API',
                description: 'Documentação automática da API do InfraWatch',
                version: '1.0.0',
            },
        },
    });

    app.register(swaggerUI, {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: false,
        },
    });
}
