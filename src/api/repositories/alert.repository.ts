import prisma from '../../config/database';

class AlertRepository {
    async createAlertForSNMP(systemId: string, title: string, message: string) {
        return await prisma.alerts.create({
            data: {
                systemId,
                title,
                message,
                severity: 'critical',
            },
        });
    }
    async createAlertForPING(systemId: string, title: string, message: string) {
        return await prisma.alerts.create({
            data: {
                systemId,
                title,
                message,
                severity: 'critical',
            },
        });
    }
    async createAlertForAPI(systemId: string, title: string, message: string) {
        return await prisma.alerts.create({
            data: {
                systemId,
                title,
                message,
                severity: 'critical',
            },
        });
    }
}

export const alertRepository = new AlertRepository();
