import { prisma } from '../../config/database';
import { User, Prisma } from '@prisma/client';
import { NotFoundError } from '../errors/base.errors';

type CreateUserData = {
    name: string;
    email: string;
    password: string;
};

class UserRepository {
    async findByEmail(email: string) {
        return await prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string) {
        return await prisma.user.findUnique({
            where: { id },
        });
    }

    async create(data: CreateUserData) {
        try {
            return await prisma.user.create({
                data,
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

    async findForLogin(
        email: string,
    ): Promise<Pick<User, 'id' | 'email' | 'password'> | null> {
        return await prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, password: true },
        });
    }

    async update(id: string, data: Partial<CreateUserData>) {
        return await prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                name: true,
                email: true,
            },
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.user.delete({
            where: { id },
        });
    }
    async getAllUser() {
        return await prisma.user.findMany({});
    }
}

export const userRepository = new UserRepository();
