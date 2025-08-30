"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnmpRepository = void 0;
class SnmpRepository {
    prisma;
    timeseries;
    constructor(prisma, timeseries) {
        this.prisma = prisma;
        this.timeseries = timeseries;
    }
    // ... resto do código ...
    async findSnmpSystemById(id) {
        const system = await this.prisma.system.findUnique({
            where: { id },
            include: {
                monitors: {
                    where: { type: 'SNMP' },
                },
            },
        });
        // ✅ Verificar se sistema existe E tem monitores SNMP
        if (!system || system.monitors.length === 0)
            return null;
        return {
            ...system,
            monitors: system.monitors.map((monitor) => ({
                id: monitor.id,
                type: 'SNMP',
                config: monitor.config, // ✅ Cast explícito
                interval: monitor.interval || 120,
            })),
        };
    }
    async findAllSnmpSystems() {
        const systems = await this.prisma.system.findMany({
            include: {
                monitors: {
                    where: { type: 'SNMP' },
                },
            },
        });
        return systems
            .filter((system) => system.monitors.length > 0)
            .map((system) => ({
            ...system,
            monitors: system.monitors.map((monitor) => ({
                id: monitor.id,
                type: 'SNMP',
                config: monitor.config, // ✅ Cast explícito
                interval: monitor.interval || 120,
            })),
        }));
    }
    async saveMetrics(metrics) {
        await this.timeseries.snmpMetrics.create({
            data: {
                time: metrics.time,
                deviceId: metrics.deviceId,
                interfaceName: metrics.interfaceName,
                inOctets: metrics.inOctets,
                outOctets: metrics.outOctets,
                cpu: metrics.cpu,
                memory: metrics.memory,
                status: metrics.status,
                temperature: metrics.temperature,
            },
        });
    }
    async updateSystemStatus(systemId, status) {
        await this.prisma.system.update({
            where: { id: systemId },
            data: { status, updatedAt: new Date() },
        });
    }
    async getMetricsHistory(deviceId, from, to) {
        const metrics = await this.timeseries.snmpMetrics.findMany({
            where: {
                deviceId,
                time: {
                    gte: from,
                    lte: to,
                },
            },
            orderBy: { time: 'desc' },
            take: 1000,
        });
        return metrics.map((m) => ({
            time: m.time,
            deviceId: m.deviceId,
            interfaceName: m.interfaceName || undefined,
            inOctets: m.inOctets || undefined,
            outOctets: m.outOctets || undefined,
            cpu: m.cpu || undefined,
            memory: m.memory || undefined,
            status: m.status || undefined,
            temperature: m.temperature || undefined,
        }));
    }
    async getLastMetrics(deviceId, limit = 10) {
        const metrics = await this.timeseries.snmpMetrics.findMany({
            where: { deviceId },
            orderBy: { time: 'desc' },
            take: limit,
        });
        return metrics.map((m) => ({
            time: m.time,
            deviceId: m.deviceId,
            interfaceName: m.interfaceName || undefined,
            inOctets: m.inOctets || undefined,
            outOctets: m.outOctets || undefined,
            cpu: m.cpu || undefined,
            memory: m.memory || undefined,
            status: m.status || undefined,
            temperature: m.temperature || undefined,
        }));
    }
}
exports.SnmpRepository = SnmpRepository;
//# sourceMappingURL=snmp-repository.js.map