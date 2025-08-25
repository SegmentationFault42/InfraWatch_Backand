import { prisma } from '../../config/database.ts';
import { User } from '@prisma/client';

class UserRepository {
    async verifyUser(
        email: string
    ) {
        return await prisma.users.findFirst({
            where: {
                OR: [{ email: email }],
            },
        });
    }

    async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'auditLogs' | 'role'>) {
    return await prisma.user.create({
      data,
    });
  }

    async loginUser(email: string) {
        return await prisma.users.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
            },
        });
    }
}

export const userRepository = new UserRepository();
