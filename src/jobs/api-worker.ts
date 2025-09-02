import { Worker } from 'bullmq';

import IORedis from 'ioredis';
import { apiMonitoring } from '../api-monitoring/api-monitoring';

const connection = new IORedis({
    host: process.env.REDIS_HOST || 'localhost',
    port: +(process.env.REDIS_PORT || 6379),
});

export const apiWorker = new Worker(
    'api-monitor',
    async (job) => {
        const { systemId } = job.data;

        try {
            await apiMonitoring.executeApiCheck(systemId);
        } catch (error: any) {
            console.error(
                `[ApiWorker] Erro ao processar job para sistema ${systemId}:`,
                error.message,
            );
            throw error;
        }
    },
    { connection },
);

apiWorker.on('completed', (job) => {
    console.log(
        `[ApiWorker] Job ${job.id} completado para sistema ${job.data.systemId}`,
    );
});

apiWorker.on('failed', (job, err) => {
    console.error(`[ApiWorker] Job ${job?.id} falhou:`, err.message);
});
