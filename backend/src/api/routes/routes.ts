import { FastifyInstance } from 'fastify';

import statusRoutes from './status.routes.ts';
import { pingRoutes } from './ping.routes.ts';
import { userRoutes } from './user.routes.ts';
import { SystemRoutes } from './system.routes.ts';
import { auditLogPlugin } from '../middleware/AuditLogMiddleware.ts';

export async function Routes(app: FastifyInstance) {
    await app.register(auditLogPlugin);
    app.register(statusRoutes);
    app.register(pingRoutes);
    app.register(userRoutes);
    app.register(SystemRoutes);
}
