import { FastifyInstance } from 'fastify';
import { SnmpController } from '../controllers/snmp-controller';
import {
    getAllSnmpSystemsSchema,
    getSnmpSystemByIdSchema,
    getSnmpSystemStatusSchema,
    getSnmpSystemMetricsSchema,
    testSnmpConnectionSchema,
    monitorSnmpSystemSchema,
    monitorAllSnmpSystemsSchema,
    getSnmpDashboardSchema,
} from '../schema/snmp-schema';

export async function snmpRoutes(
    fastify: FastifyInstance,
    { snmpController }: { snmpController: SnmpController },
) {
    // SNMP Systems - Read only (sistemas já existem)
    fastify.get(
        '/systems',
        {
            schema: getAllSnmpSystemsSchema,
        },
        snmpController.getAllSnmpSystems,
    );

    fastify.get(
        '/systems/:id',
        {
            schema: getSnmpSystemByIdSchema,
        },
        snmpController.getSnmpSystemById,
    );

    fastify.get(
        '/systems/:id/status',
        {
            schema: getSnmpSystemStatusSchema,
        },
        snmpController.getSnmpSystemStatus,
    );

    fastify.get(
        '/systems/:id/metrics',
        {
            schema: getSnmpSystemMetricsSchema,
        },
        snmpController.getSnmpSystemMetrics,
    );

    // SNMP Monitoring Operations
    fastify.post(
        '/systems/:id/test',
        {
            schema: testSnmpConnectionSchema,
            config: {
                rateLimit: {
                    max: 5,
                    timeWindow: '1 minute',
                },
            },
        },
        snmpController.testSnmpConnection,
    );

    fastify.post(
        '/systems/:id/monitor',
        {
            schema: monitorSnmpSystemSchema,
            config: {
                rateLimit: {
                    max: 10,
                    timeWindow: '1 minute',
                },
            },
        },
        snmpController.monitorSnmpSystem,
    );

    fastify.post(
        '/monitor-all',
        {
            schema: monitorAllSnmpSystemsSchema,
            config: {
                rateLimit: {
                    max: 2,
                    timeWindow: '1 minute',
                },
            },
        },
        snmpController.monitorAllSnmpSystems,
    );

    // SNMP Dashboard
    fastify.get(
        '/dashboard',
        {
            schema: getSnmpDashboardSchema,
        },
        snmpController.getSnmpDashboard,
    );
}
