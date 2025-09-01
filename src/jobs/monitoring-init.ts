// monitoring-init.ts
import { scheduleAllSnmpSystems } from './snmp-scheduler';
import { snmprepository } from '../api/repositories/snmp-repository';
import prisma, { timeseries } from '../config/database';
import { pingRepository } from '../api/repositories/pingRepository';
import { scheduleAllPingSystems } from './ping-scheduler';

export async function initMonitoring() {
  const systems = await snmprepository.findAllSnmpSystems();
  await scheduleAllSnmpSystems(systems);
  console.log(`[Monitoring] ${systems.length} sistemas SNMP agendados`);

  const pingSystems = await pingRepository.findAllPingSystems();
  await scheduleAllPingSystems(pingSystems);
  console.log(`[Monitoring] ${pingSystems.length} sistemas PING agendados`);
}
