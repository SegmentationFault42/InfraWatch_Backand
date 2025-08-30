import { FastifyRequest, FastifyReply } from 'fastify';
import { SnmpService } from '../services/snmp-service';
export declare class SnmpController {
    private snmpService;
    constructor(snmpService: SnmpService);
    getAllSnmpSystems: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    getSnmpSystemById: (request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply) => Promise<void>;
    getSnmpSystemStatus: (request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply) => Promise<void>;
    testSnmpConnection: (request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply) => Promise<void>;
    monitorSnmpSystem: (request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply) => Promise<void>;
    monitorAllSnmpSystems: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    getSnmpDashboard: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    getSnmpSystemMetrics: (request: FastifyRequest<{
        Params: {
            id: string;
        };
        Querystring: {
            from?: string;
            to?: string;
            limit?: string;
        };
    }>, reply: FastifyReply) => Promise<void>;
    private handleError;
}
//# sourceMappingURL=snmp-controller.d.ts.map