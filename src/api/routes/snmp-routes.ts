import { FastifyInstance } from 'fastify';
import { snmpcontroller } from '../controllers/snmp-controller';
import {
    testSnmpConnectionSchema,
    monitorSnmpSystemSchema,
    monitorAllSnmpSystemsSchema,
} from '../schema/snmp-schema';

export async function snmpRoutes(fastify: FastifyInstance) {
    // SNMP Monitoring Operations
    fastify.post(
        '/systems/snmp/:id/test',
        {
            schema: testSnmpConnectionSchema,
            config: {
                rateLimit: { max: 5, timeWindow: '1 minute' },
            },
        },
        snmpcontroller.testSnmpConnection,
    );

    fastify.post(
        '/systems/snmp/:id/',
        {
            schema: monitorSnmpSystemSchema,
            config: {
                rateLimit: { max: 10, timeWindow: '1 minute' },
            },
        },
        snmpcontroller.monitorSnmpSystem,
    );
    fastify.post(
        '/systems/snmp/monitor-all',
        {
            schema: monitorAllSnmpSystemsSchema,
            config: {
                rateLimit: { max: 2, timeWindow: '1 minute' },
            },
        },
        snmpcontroller.monitorAllSnmpSystems,
    );
}
