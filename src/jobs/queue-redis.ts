import { Queue } from 'bullmq';

const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: +(process.env.REDIS_PORT || 6379),
    maxRetriesPerRequest: null,
};

export const snmpQueue = new Queue('snmp-monitor', { connection });
export const pingQueue = new Queue('ping-monitor', { connection });
export const apiQueue = new Queue('api-monitor', { connection });
