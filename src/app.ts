import fastify from 'fastify';
import { ENV } from './config/dotenv';
import { Routes } from './api/routes/routes';
import { Swagger } from './config/swagger.config';
import fastifyCookie from '@fastify/cookie';
import { auditLogPlugin } from './api/middleware/AuditLogMiddleware';
import { initMonitoring } from './jobs/monitoring-init';

export const app = fastify({ logger: false });

Swagger(app);
app.register(auditLogPlugin);
app.register(Routes);
app.register(import('@fastify/rate-limit'), {
    max: 100,
    timeWindow: '1 minute',
});
initMonitoring();
app.register(fastifyCookie, {
    secret: ENV.COOKIE_SECRET,
    hook: 'onRequest',
});
app.listen(
    {
        port: ENV.PORT,
        host: ENV.HOST,
    },
    () => {
        console.log(`Server Running on port: ${ENV.PORT}`);
    },
);
