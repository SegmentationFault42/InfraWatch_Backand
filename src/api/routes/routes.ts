import { FastifyInstance } from 'fastify';

import statusRoutes from './status.routes';
import { pingRoutes } from './ping.routes';
import { userRoutes } from './user.routes';
import { SystemRoutes } from './system.routes';
import { auditLogPlugin } from '../middleware/AuditLogMiddleware';

export async function Routes(app: FastifyInstance) {
    await app.register(auditLogPlugin);
    app.register(statusRoutes);
    app.register(pingRoutes);
    app.register(userRoutes);
    app.register(SystemRoutes);
}
