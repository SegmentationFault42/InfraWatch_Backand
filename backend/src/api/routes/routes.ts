import { FastifyInstance } from 'fastify';

import statusRoutes from './status.routes.ts';
import { pingRoutes } from './ping.routes.ts';
import { userRoutes } from './user.routes.ts';
import { SystemRoutes } from './system.routes.ts';

export function Routes(app: FastifyInstance) {
    app.register(statusRoutes);
    app.register(pingRoutes);
    app.register(userRoutes);
    app.register(SystemRoutes);
}
