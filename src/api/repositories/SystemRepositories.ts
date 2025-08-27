import { prisma } from '../../config/database.ts';
import { System } from '@prisma/client';

class SystemRepository {
    async verifySystemIfExists(
        data: Omit<System, 'id' | 'status' | 'created_at' | 'updated_at'>,
    ) {
        return await prisma.system.findFirst({
            where: {
                OR: [{ host: data.host }],
            },
        });
    }
    async addSystem(
        data: Omit<System, 'id' | 'status' | 'created_at' | 'updated_at'>,
    ) {
        return await prisma.system.create({
            data: {
                name: data.name,
                host: data.host,
                alert_email: data.alert_email,
                monitors: create{

                },
            }
        });
    }

    async getAllSystems() {
        return await prisma.system.findMany({
            select: {
                id: true,
                name: true,
                host: true,
                monitors: {
                    select: {
                        id: true,
                        type: true,
                        config: true,
                        interval: true,
                    }
                },
                status: true,
                alert_email: true,
            },
        });
    }
    async getSystemBydId(id: string) {
        return await prisma.system.findUnique({
            where: {
                id,
            },
        });
    }
    async deleteSystemById(id: string) {
        return await prisma.system.delete({
            where: {
                id,
            },
        });
    }
    async verifySystem(id: string) {
        return await prisma.system.findFirst({
            where: {
                id,
            },
        });
    }

    async updateSystemById(id: string, data: Partial<System>) {
        return await prisma.system.update({
            where: {
                id,
            },
            data: data,
        });
    }
}

export const systemRepository = new SystemRepository();
