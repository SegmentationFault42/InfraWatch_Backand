import fastify from 'fastify';
import { ENV } from './config/dotenv.js';
import { Routes } from './api/routes/routes.js';
import { Swagger } from './config/swagger.config.js';
import fastifyCookie from '@fastify/cookie';

export const app = fastify({ logger: false });

Swagger(app);
app.register(Routes);
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
