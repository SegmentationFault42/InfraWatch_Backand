import type { SystemWithApi } from '../api/types/api-types';
import { apiQueue } from './queue-redis';

export async function scheduleApiSystem(system: SystemWithApi) {
    if (
        !system.monitors ||
        system.monitors.length === 0 ||
        !system.monitors[0]
    ) {
        throw new Error('Sistema não possui monitores API configurados');
    }

    const monitor = system.monitors[0];
    const interval = monitor.interval || 60;

    await apiQueue.add(
        'api-check',
        { systemId: system.id },
        {
            jobId: `api-${system.id}`,
            repeat: { every: interval * 1000 },
            removeOnComplete: true,
        },
    );

    console.log(
        `[ApiScheduler] Sistema ${system.id} agendado a cada ${interval}s`,
    );
}

export async function scheduleAllApiSystems(systems: SystemWithApi[]) {
    for (const sys of systems) {
        await scheduleApiSystem(sys);
    }
}
