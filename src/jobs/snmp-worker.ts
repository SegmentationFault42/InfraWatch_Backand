import { Worker } from 'bullmq';
import { snmpservice } from '../api/services/snmp-service';

const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: +(process.env.REDIS_PORT || 6379),
    maxRetriesPerRequest: null,
};

const worker = new Worker(
    'snmp-monitor',
    async (job) => {
        const { systemId } = job.data;
        console.log(`[Worker] Executando monitoramento SNMP para ${systemId}`);
        await snmpservice.monitorSnmpSystem(systemId);
    },
    { connection },
);

worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id} falhou:`, err);
});
