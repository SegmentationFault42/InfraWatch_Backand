"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemRepository = void 0;
const database_1 = require("../../config/database");
const client_1 = require("@prisma/client");
const ErrorFactory_1 = require("../errors/ErrorFactory");
class SystemRepository {
    async verifySystemIfExists(host) {
        try {
            return await database_1.prisma.system.findFirst({
                where: { host },
            });
        }
        catch (error) {
            console.error('Error verifying system existence:', error);
            throw ErrorFactory_1.ErrorFactory.internalServerError({ originalError: error });
        }
    }
    async addSystem(data) {
        try {
            const systemData = {
                name: data.name,
                host: data.host,
                alert_email: data.alert_email,
            };
            if (data.monitors?.length) {
                systemData.monitors = { create: data.monitors };
            }
            if (data.slaConfig) {
                systemData.SLAConfig = { create: data.slaConfig };
            }
            return await database_1.prisma.system.create({
                data: systemData,
                include: {
                    monitors: true,
                    SLAConfig: true,
                },
            });
        }
        catch (error) {
            console.error('Error creating system:', error);
            throw ErrorFactory_1.ErrorFactory.systemCreateFailed({ originalError: error });
        }
    }
    async getAllSystems() {
        try {
            return await database_1.prisma.system.findMany({
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
                        },
                    },
                    status: true,
                    alert_email: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
        }
        catch (error) {
            console.error('Error fetching all systems:', error);
            throw ErrorFactory_1.ErrorFactory.internalServerError({ originalError: error });
        }
    }
    async getSystemById(id) {
        try {
            return await database_1.prisma.system.findUnique({
                where: { id },
                include: {
                    monitors: true,
                    SLAConfig: true,
                },
            });
        }
        catch (error) {
            console.error('Error fetching system by ID:', error);
            throw ErrorFactory_1.ErrorFactory.internalServerError({ originalError: error });
        }
    }
    async deleteSystemById(id) {
        try {
            await database_1.prisma.system.delete({
                where: { id },
            });
        }
        catch (error) {
            console.error('Error deleting system:', error);
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2025') {
                throw ErrorFactory_1.ErrorFactory.systemNotFound();
            }
            throw ErrorFactory_1.ErrorFactory.systemDeleteFailed();
        }
    }
    async verifySystemExists(id) {
        try {
            const system = await database_1.prisma.system.findFirst({
                where: { id },
                select: { id: true },
            });
            return !!system;
        }
        catch (error) {
            console.error('Error verifying system:', error);
            throw ErrorFactory_1.ErrorFactory.internalServerError({ originalError: error });
        }
    }
    async updateSystemById(id, data) {
        try {
            return await database_1.prisma.system.update({
                where: { id },
                data,
            });
        }
        catch (error) {
            console.error('Error updating system:', error);
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2025') {
                throw ErrorFactory_1.ErrorFactory.systemNotFound();
            }
            throw ErrorFactory_1.ErrorFactory.systemUpdateFailed({ originalError: error });
        }
    }
}
exports.systemRepository = new SystemRepository();
//# sourceMappingURL=SystemRepositories.js.map