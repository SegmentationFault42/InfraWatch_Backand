// monitoring-init.ts
import { scheduleAllSnmpSystems } from './scheduler';
import { snmprepository } from '../api/repositories/snmp-repository';
import prisma, { timeseries } from '../config/database';

export async function initMonitoring() {
  const systems = await snmprepository.findAllSnmpSystems();
  await scheduleAllSnmpSystems(systems);

  console.log(`[Monitoring] ${systems.length} sistemas SNMP agendados`);
}
