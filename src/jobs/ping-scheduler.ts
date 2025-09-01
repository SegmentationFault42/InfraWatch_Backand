import { pingQueue } from './queue-redis';
import type { SystemWithPing } from '../api/types/ping-types';

export async function schedulePingSystem(system: SystemWithPing) {
  if (!system.monitors || system.monitors.length === 0 || !system.monitors[0]) {
    throw new Error('Sistema não possui monitores PING configurados');
  }

  const monitor = system.monitors[0];
  const interval = monitor.interval || 60;

  await pingQueue.add(
    'ping-check',
    { systemId: system.id },
    {
      jobId: `ping-${system.id}`,
      repeat: { every: interval * 1000 }, 
      removeOnComplete: true,
    }
  );

  console.log(`[PingScheduler] Sistema ${system.id} agendado a cada ${interval}s`);
}

export async function scheduleAllPingSystems(systems: SystemWithPing[]) {
  for (const sys of systems) {
    await schedulePingSystem(sys);
  }
}
