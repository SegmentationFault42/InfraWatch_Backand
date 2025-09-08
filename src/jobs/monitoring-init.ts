import { scheduleAllSnmpSystems } from './snmp-scheduler';
import { snmprepository } from '../api/repositories/snmp-repository';
import { pingRepository } from '../api/repositories/pingRepository';
import { scheduleAllPingSystems } from './ping-scheduler';
import { apiRepository } from '../api/repositories/api-repository';
import { scheduleAllApiSystems } from './api-scheduler';

export async function initMonitoring() {
    const systems = await snmprepository.findAllSnmpSystems();
    await scheduleAllSnmpSystems(systems);
    console.log(`[Monitoring] ${systems.length} sistemas SNMP agendados`);

    const pingSystems = await pingRepository.findAllPingSystems();
    await scheduleAllPingSystems(pingSystems);
    console.log(`[Monitoring] ${pingSystems.length} sistemas PING agendados`);

    const apiSystems = await apiRepository.findAllApiSystems();
    await scheduleAllApiSystems(apiSystems);
    console.log(`[Monitoring] ${apiSystems.length} sistemas API agendados`);
}
