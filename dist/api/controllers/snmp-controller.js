"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnmpController = void 0;
const snmp_errors_1 = require("../errors/snmp-errors");
class SnmpController {
    snmpService;
    constructor(snmpService) {
        this.snmpService = snmpService;
    }
    // GET /snmp/systems
    getAllSnmpSystems = async (request, reply) => {
        try {
            const systems = await this.snmpService.getAllSnmpSystems();
            reply.send({
                success: true,
                data: systems,
                count: systems.length,
            });
        }
        catch (error) {
            this.handleError(reply, error);
        }
    };
    // GET /snmp/systems/:id
    getSnmpSystemById = async (request, reply) => {
        try {
            const { id } = request.params;
            const system = await this.snmpService.getSnmpSystemById(id);
            reply.send({
                success: true,
                data: system,
            });
        }
        catch (error) {
            this.handleError(reply, error);
        }
    };
    // GET /snmp/systems/:id/status
    getSnmpSystemStatus = async (request, reply) => {
        try {
            const { id } = request.params;
            const status = await this.snmpService.getSystemStatus(id);
            reply.send({
                success: true,
                data: status,
            });
        }
        catch (error) {
            this.handleError(reply, error);
        }
    };
    // POST /snmp/systems/:id/test
    testSnmpConnection = async (request, reply) => {
        try {
            const { id } = request.params;
            const result = await this.snmpService.testSnmpConnection(id);
            reply.send({
                success: true,
                message: 'Teste SNMP executado com sucesso',
                data: result,
            });
        }
        catch (error) {
            this.handleError(reply, error);
        }
    };
    // POST /snmp/systems/:id/monitor
    monitorSnmpSystem = async (request, reply) => {
        try {
            const { id } = request.params;
            const result = await this.snmpService.monitorSnmpSystem(id);
            reply.send({
                success: true,
                message: 'Monitoramento SNMP executado com sucesso',
                data: result,
            });
        }
        catch (error) {
            this.handleError(reply, error);
        }
    };
    // POST /snmp/monitor-all
    monitorAllSnmpSystems = async (request, reply) => {
        try {
            const results = await this.snmpService.monitorAllSnmpSystems();
            const total = Object.keys(results).length;
            const up = Object.values(results).filter((r) => r.status === 'up').length;
            const down = Object.values(results).filter((r) => r.status === 'down').length;
            const warning = Object.values(results).filter((r) => r.status === 'warning').length;
            reply.send({
                success: true,
                message: `Monitoramento geral executado: ${up}/${total} sistemas ativos`,
                data: {
                    results,
                    summary: {
                        total,
                        up,
                        down,
                        warning,
                        uptime_percentage: total > 0 ? Math.round((up / total) * 100) : 0,
                    },
                },
            });
        }
        catch (error) {
            this.handleError(reply, error);
        }
    };
    // GET /snmp/dashboard
    getSnmpDashboard = async (request, reply) => {
        try {
            const dashboard = await this.snmpService.getSnmpDashboard();
            reply.send({
                success: true,
                data: dashboard,
            });
        }
        catch (error) {
            this.handleError(reply, error);
        }
    };
    // GET /snmp/systems/:id/metrics
    getSnmpSystemMetrics = async (request, reply) => {
        try {
            const { id } = request.params;
            const { from, to, limit } = request.query;
            let metrics;
            if (from || to) {
                // Buscar por período
                const fromDate = from
                    ? new Date(from)
                    : new Date(Date.now() - 24 * 60 * 60 * 1000);
                const toDate = to ? new Date(to) : new Date();
                metrics = await this.snmpService.getSystemMetrics(id, fromDate, toDate);
            }
            else {
                // Buscar últimas métricas
                const limitNum = limit ? parseInt(limit) : 50;
                metrics = await this.snmpService.getSystemLastMetrics(id, limitNum);
            }
            reply.send({
                success: true,
                data: {
                    metrics,
                    count: metrics.length,
                    period: from || to
                        ? {
                            from: from
                                ? new Date(from)
                                : new Date(Date.now() - 24 * 60 * 60 * 1000),
                            to: to ? new Date(to) : new Date(),
                        }
                        : undefined,
                },
            });
        }
        catch (error) {
            this.handleError(reply, error);
        }
    };
    handleError(reply, error) {
        console.error('SNMP Controller Error:', error);
        if (error instanceof snmp_errors_1.SnmpError) {
            reply.status(400).send({
                success: false,
                message: error.message,
                code: error.code,
            });
            return;
        }
        if (error.message.includes('não encontrado')) {
            reply.status(404).send({
                success: false,
                message: error.message,
            });
            return;
        }
        reply.status(500).send({
            success: false,
            message: 'Erro interno do servidor SNMP',
        });
    }
}
exports.SnmpController = SnmpController;
//# sourceMappingURL=snmp-controller.js.map