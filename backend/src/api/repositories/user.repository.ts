import { prisma } from '../../config/database.ts';
import { users } from '@prisma/client';

class UserRepository {
    async verifyUser(
        data: Omit<
            users,
            'id' | 'role' | 'updated_at' | 'created_at' | 'profile_image_url'
        >,
    ) {
        return await prisma.users.findFirst({
            where: {
                OR: [{ email: data.email }],
            },
        });
    }

    async create(
        data: Omit<
            users,
            'id' | 'role' | 'updated_at' | 'created_at' | 'profile_image_url'
        >,
    ) {
        return await prisma.users.create({
            data: data,
        });
    }

    async loginUser(email: string) {
        return await prisma.users.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                senha: true,
            },
        });
    }
}

export const userRepository = new UserRepository();
