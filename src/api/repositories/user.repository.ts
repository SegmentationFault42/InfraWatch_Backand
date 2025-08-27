import { prisma } from '../../config/database.ts';
import { User, Prisma } from '@prisma/client';
import { NotFoundError } from '../errors/base.errors.ts';

type CreateUserData = {
    name: string;
    email: string;
    password: string;
    roleId?: string;
};

type UserWithRole = User & {
    role: {
        id: string;
        nome: string;
        description: string | null;
    } | null;
};

class UserRepository {
    async findByEmail(email: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: { email }
        });
    }

    async findById(id: string): Promise<UserWithRole | null> {
        return await prisma.user.findUnique({
            where: { id },
            include: { role: true }
        });
    }

    async create(data: CreateUserData): Promise<UserWithRole> {
        try {
            return await prisma.user.create({
                data,
                include: { role: true }
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
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

    async findForLogin(email: string): Promise<Pick<User, 'id' | 'email' | 'password'> | null> {
        return await prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, password: true }
        });
    }

    async update(id: string, data: Partial<CreateUserData>): Promise<UserWithRole> {
        return await prisma.user.update({
            where: { id },
            data,
            include: { role: true }
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.user.delete({
            where: { id }
        });
    }

    async findAll(skip?: number, take?: number): Promise<UserWithRole[]> {
        return await prisma.user.findMany({
            skip,
            take,
            include: { role: true },
            orderBy: { createdAt: 'desc' }
        });
    }
}

export const userRepository = new UserRepository();