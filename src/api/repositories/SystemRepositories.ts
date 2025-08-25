import { prisma } from '../../config/database.ts';
import { systems } from '@prisma/client';

class SystemRepository {
    async verifySystemIfExists(
        data: Omit<systems, 'id' | 'status' | 'created_at' | 'updated_at'>,
    ) {
        return await prisma.systems.findFirst({
            where: {
                OR: [{ url: data.url }],
            },
        });
    }
    async addSystem(
        data: Omit<systems, 'id' | 'status' | 'created_at' | 'updated_at'>,
    ) {
        return await prisma.systems.create({
            data,
        });
    }

    async getAllSystems() {
        return await prisma.systems.findMany({
            select: {
                id: true,
                name: true,
                url: true,
                monitor_type: true,
                check_interval: true,
                timeout: true,
                status: true,
                is_enabled: true,
                alert_email: true,
                description: true,
            },
        });
    }
    async getSystemBydId(id: string) {
        return await prisma.systems.findUnique({
            where: {
                id,
            },
        });
    }
    async deleteSystemById(id: string) {
        return await prisma.systems.delete({
            where: {
                id,
            },
        });
    }
    async verifySystem(id: string) {
        return await prisma.systems.findFirst({
            where: {
                id,
            },
        });
    }

    async updateSystemById(id: string, data: Partial<systems>) {
        return await prisma.systems.update({
            where: {
                id,
            },
            data: data,
        });
    }
}

export const systemRepository = new SystemRepository();
