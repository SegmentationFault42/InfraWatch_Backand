"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.snmpQueue = void 0;
// jobs/snmp-queue.ts
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const connection = new ioredis_1.default({
    host: process.env.REDIS_HOST || 'localhost',
    port: +(process.env.REDIS_PORT || 6379),
});
exports.snmpQueue = new bullmq_1.Queue('snmp-monitor', { connection });
//# sourceMappingURL=snmp-queue.js.map