// jobs/snmp-queue.ts
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis({
    host: process.env.REDIS_HOST || 'localhost',
    port: +(process.env.REDIS_PORT || 6379),
});

export const snmpQueue = new Queue('snmp-monitor', { connection });
export const pingQueue = new Queue('ping-monitor', { connection });
export const apiQueue = new Queue('api-monitor', { connection });
