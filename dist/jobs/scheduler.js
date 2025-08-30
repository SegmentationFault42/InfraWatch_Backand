"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleSnmpSystem = scheduleSnmpSystem;
exports.scheduleAllSnmpSystems = scheduleAllSnmpSystems;
// jobs/scheduler.ts
const snmp_queue_1 = require("./snmp-queue");
async function scheduleSnmpSystem(system) {
    if (!system.monitors ||
        system.monitors.length === 0 ||
        !system.monitors[0]) {
        throw new Error('Sistema não possui monitores SNMP configurados');
    }
    const monitor = system.monitors[0];
    const interval = monitor.interval || 60;
    await snmp_queue_1.snmpQueue.add('snmp-check', { systemId: system.id }, {
        jobId: `snmp-${system.id}`,
        repeat: { every: interval * 1000 },
        removeOnComplete: true,
    });
    console.log(`[Scheduler] Sistema ${system.id} agendado a cada ${interval}s`);
}
async function scheduleAllSnmpSystems(systems) {
    for (const sys of systems) {
        await scheduleSnmpSystem(sys);
    }
}
//# sourceMappingURL=scheduler.js.map