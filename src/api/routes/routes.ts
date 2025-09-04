import { FastifyInstance } from 'fastify';

import statusRoutes from './status.routes';
import { pingRoutes } from './ping-routes';
import { userRoutes } from './user.routes';
import { SystemRoutes } from './system.routes';
import { auditLogPlugin } from '../middleware/AuditLogMiddleware';
import { snmpRoutes } from './snmp-routes';
import { apiRoutes } from './api-routes';
import { slaRoutes } from './sla.routes';
import { dashboardRoutes } from './dashboard.routes';

export async function Routes(app: FastifyInstance) {
    await app.register(auditLogPlugin);
    app.register(statusRoutes);
    app.register(pingRoutes);
    app.register(userRoutes);
    app.register(SystemRoutes);
    app.register(snmpRoutes);
    app.register(apiRoutes);
    app.register(slaRoutes);
    app.register(dashboardRoutes)
}
