"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.snmpRoutes = snmpRoutes;
const snmp_schema_1 = require("../schema/snmp-schema");
async function snmpRoutes(fastify, { snmpController }) {
    // SNMP Systems - Read only (sistemas já existem)
    fastify.get('/systems', {
        schema: snmp_schema_1.getAllSnmpSystemsSchema,
    }, snmpController.getAllSnmpSystems);
    fastify.get('/systems/:id', {
        schema: snmp_schema_1.getSnmpSystemByIdSchema,
    }, snmpController.getSnmpSystemById);
    fastify.get('/systems/:id/status', {
        schema: snmp_schema_1.getSnmpSystemStatusSchema,
    }, snmpController.getSnmpSystemStatus);
    fastify.get('/systems/:id/metrics', {
        schema: snmp_schema_1.getSnmpSystemMetricsSchema,
    }, snmpController.getSnmpSystemMetrics);
    // SNMP Monitoring Operations
    fastify.post('/systems/:id/test', {
        schema: snmp_schema_1.testSnmpConnectionSchema,
        config: {
            rateLimit: {
                max: 5,
                timeWindow: '1 minute',
            },
        },
    }, snmpController.testSnmpConnection);
    fastify.post('/systems/:id/monitor', {
        schema: snmp_schema_1.monitorSnmpSystemSchema,
        config: {
            rateLimit: {
                max: 10,
                timeWindow: '1 minute',
            },
        },
    }, snmpController.monitorSnmpSystem);
    fastify.post('/monitor-all', {
        schema: snmp_schema_1.monitorAllSnmpSystemsSchema,
        config: {
            rateLimit: {
                max: 2,
                timeWindow: '1 minute',
            },
        },
    }, snmpController.monitorAllSnmpSystems);
    // SNMP Dashboard
    fastify.get('/dashboard', {
        schema: snmp_schema_1.getSnmpDashboardSchema,
    }, snmpController.getSnmpDashboard);
}
//# sourceMappingURL=snmp-routes.js.map