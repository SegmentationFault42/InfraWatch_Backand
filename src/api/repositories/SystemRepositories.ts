import { prisma } from '../../config/database';
import { System, Prisma } from '@prisma/client';
import { ErrorFactory } from '../errors/ErrorFactory';
import { CreateSystemInput } from '../types/system.types';

class SystemRepository {
    async verifySystemIfExists(host: string): Promise<System | null> {
        try {
            return await prisma.system.findFirst({
                where: { host }
            });
        } catch (error) {
            console.error('Error verifying system existence:', error);
            throw ErrorFactory.internalServerError({ originalError: error });
        }
    }

    async addSystem(data: CreateSystemInput): Promise<System> {
        try {
            const systemData: Prisma.SystemCreateInput = {
                name: data.name,
                host: data.host,
                alert_email: data.alert_email
            };

            if (data.monitors?.length) {
                systemData.monitors = { create: data.monitors };
            }

            if (data.slaConfig) {
                systemData.SLAConfig = { create: data.slaConfig };
            }

            return await prisma.system.create({
                data: systemData,
                include: {
                    monitors: true,
                    SLAConfig: true
                }
            });
        } catch (error) {
            console.error('Error creating system:', error);
            throw ErrorFactory.systemCreateFailed({ originalError: error });
        }
    }

    async getAllSystems() {
        try {
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
                            interval: true
                        }
                    },
                    status: true,
                    alert_email: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
        } catch (error) {
            console.error('Error fetching all systems:', error);
            throw ErrorFactory.internalServerError({ originalError: error });
        }
    }

    async getSystemById(id: string): Promise<System | null> {
        try {
            return await prisma.system.findUnique({
                where: { id },
                include: {
                    monitors: true,
                    SLAConfig: true
                }
            });
        } catch (error) {
            console.error('Error fetching system by ID:', error);
            throw ErrorFactory.internalServerError({ originalError: error });
        }
    }

    async deleteSystemById(id: string): Promise<void> {
        try {
            await prisma.system.delete({
                where: { id }
            });
        } catch (error) {
            console.error('Error deleting system:', error);
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw ErrorFactory.systemNotFound();
            }
            throw ErrorFactory.systemDeleteFailed();
        }
    }

    async verifySystemExists(id: string): Promise<boolean> {
        try {
            const system = await prisma.system.findFirst({
                where: { id },
                select: { id: true }
            });
            return !!system;
        } catch (error) {
            console.error('Error verifying system:', error);
            throw ErrorFactory.internalServerError({ originalError: error });
        }
    }

    async updateSystemById(id: string, data: Partial<System>): Promise<System> {
        try {
            return await prisma.system.update({
                where: { id },
                data
            });
        } catch (error) {
            console.error('Error updating system:', error);
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw ErrorFactory.systemNotFound();
            }
            throw ErrorFactory.systemUpdateFailed({ originalError: error });
        }
    }
}

export const systemRepository = new SystemRepository();