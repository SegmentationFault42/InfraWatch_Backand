"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const database_1 = require("../../config/database");
const client_1 = require("@prisma/client");
class UserRepository {
    async findByEmail(email) {
        return await database_1.prisma.user.findUnique({
            where: { email },
        });
    }
    async findById(id) {
        return await database_1.prisma.user.findUnique({
            where: { id },
            include: { role: true },
        });
    }
    async create(data) {
        try {
            return await database_1.prisma.user.create({
                data,
                include: { role: true },
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new Error('Email já está em uso');
                }
                if (error.code === 'P2003') {
                    throw new Error('Role especificada não existe');
                }
            }
            throw error;
        }
    }
    async findForLogin(email) {
        return await database_1.prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, password: true },
        });
    }
    async update(id, data) {
        return await database_1.prisma.user.update({
            where: { id },
            data,
            include: { role: true },
        });
    }
    async delete(id) {
        await database_1.prisma.user.delete({
            where: { id },
        });
    }
    async findAll(skip, take) {
        return await database_1.prisma.user.findMany({
            skip,
            take,
            include: { role: true },
            orderBy: { createdAt: 'desc' },
        });
    }
}
exports.userRepository = new UserRepository();
//# sourceMappingURL=user.repository.js.map