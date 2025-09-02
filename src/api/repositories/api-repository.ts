import prisma, { timeseries } from '../../config/database';
import { SystemWithApi } from '../types/api-types';

class APIRespository {
    async findAllApiSystems(): Promise<SystemWithApi[]> {
        return await prisma.system.findMany({
            where: {
                monitors: {
                    some: {
                        type: 'API',
                    },
                },
            },
            include: {
                monitors: {
                    where: {
                        type: 'API',
                    },
                },
            },
        });
    }

    async findSystemById(systemId: string): Promise<SystemWithApi | null> {
        return await prisma.system.findUnique({
            where: { id: systemId },
            include: {
                monitors: {
                    where: {
                        type: 'API',
                    },
                },
            },
        });
    }

    async updateSystemStatus(
        systemId: string,
        status: 'up' | 'down' | 'warning' | 'unknown',
    ) {
        return await prisma.system.update({
            where: { id: systemId },
            data: {
                status,
                updatedAt: new Date(),
            },
        });
    }

    async saveMetrics(data: {
        deviceId: string;
        endpoint?: string;
        statusCode?: number;
        responseTimeMs?: number;
        payloadSize?: number;
    }) {
        return await timeseries.apiMetrics.create({
            data: {
                time: new Date(),
                deviceId: data.deviceId,
                endpoint: data.endpoint,
                statusCode: data.statusCode,
                responseTimeMs: data.responseTimeMs,
                payloadSize: data.payloadSize,
            },
        });
    }
}

export const apiRepository = new APIRespository();
