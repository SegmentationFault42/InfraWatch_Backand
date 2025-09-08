import { Worker } from 'bullmq';
import { pingService } from '../api/services/ping-service';

const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: +(process.env.REDIS_PORT || 6379),
    maxRetriesPerRequest: null,
};

const worker = new Worker(
    'ping-monitor',
    async (job) => {
        const { systemId } = job.data;
        console.log(
            `[PingWorker] Executando monitoramento PING para ${systemId}`,
        );
        await pingService.monitorPingSystem(systemId);
    },
    { connection },
);

worker.on('failed', (job, err) => {
    console.error(`[PingWorker] Job ${job?.id} falhou:`, err);
});
