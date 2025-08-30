"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// jobs/snmp-worker.ts
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const snmp_service_1 = require("../api/services/snmp-service");
const snmp_repository_1 = require("../api/repositories/snmp-repository");
const database_1 = __importStar(require("../config/database"));
const connection = new ioredis_1.default({
    host: process.env.REDIS_HOST || 'localhost',
    port: +(process.env.REDIS_PORT || 6379),
});
const repository = new snmp_repository_1.SnmpRepository(database_1.default, database_1.timeseries);
const snmpService = new snmp_service_1.SnmpService(repository);
const worker = new bullmq_1.Worker('snmp-monitor', async (job) => {
    const { systemId } = job.data;
    console.log(`[Worker] Executando monitoramento SNMP para ${systemId}`);
    await snmpService.monitorSnmpSystem(systemId);
}, { connection });
worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id} falhou:`, err);
});
//# sourceMappingURL=snmp-worker.js.map