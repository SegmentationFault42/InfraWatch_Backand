import { id } from 'zod/locales';
import { Prisma } from '../../config/database.ts';
import { System } from '@prisma/client';

class SystemRepository {
    async verifySystemIfExists(
        data: Omit<System, 'id' | 'status' | 'created_at' | 'updated_at'>,
    ) {
        return await Prisma.system.findFirst({
            where: {
                OR: [{ url: data.url }],
            },
        });
    }
    async addSystem(
        data: Omit<System, 'id' | 'status' | 'created_at' | 'updated_at'>,
    ) {
        return await Prisma.system.create({
            data,
        });
    }

    async getAllSystems() {
        return await Prisma.system.findMany({
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
    async deleteSystemById(id: string) {
        return await Prisma.system.delete({
            where: {
                id,
            },
        });
    }
    async verifySystem(id: string) {
        return await Prisma.system.findFirst({
            where: {
                id,
            },
        });
    }

    async updateSystemById(id: string, data: Partial<System>) {
        return await Prisma.system.update({
            where: {
                id,
            },
            data: data,
        });
    }
}

export const systemRepository = new SystemRepository();
