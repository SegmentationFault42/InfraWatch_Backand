// jobs/scheduler.ts
import { snmpQueue } from './queue-redis';
import type { SystemWithSnmp } from '../api/types/snmp-types';

export async function scheduleSnmpSystem(system: SystemWithSnmp) {
    if (
        !system.monitors ||
        system.monitors.length === 0 ||
        !system.monitors[0]
    ) {
        throw new Error('Sistema não possui monitores SNMP configurados');
    }
    const monitor = system.monitors[0];
    const interval = monitor.interval || 60;

    await snmpQueue.add(
        'snmp-check',
        { systemId: system.id },
        {
            jobId: `snmp-${system.id}`, 
            repeat: { every: interval * 1000 }, 
            removeOnComplete: true,
        },
    );

    console.log(
        `[Scheduler] Sistema ${system.id} agendado a cada ${interval}s`,
    );
}

export async function scheduleAllSnmpSystems(systems: SystemWithSnmp[]) {
    for (const sys of systems) {
        await scheduleSnmpSystem(sys);
    }
}
