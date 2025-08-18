import { Prisma } from '../../config/database.ts';
import { User } from '@prisma/client';

class UserRepository {
    async verifyUser(
        data: Omit<
            User,
            'id' | 'role' | 'updated_at' | 'created_at' | 'profile_image_url'
        >,
    ) {
        return await Prisma.user.findFirst({
            where: {
                OR: [{ email: data.email }],
            },
        });
    }

    async create(
        data: Omit<
            User,
            'id' | 'role' | 'updated_at' | 'created_at' | 'profile_image_url'
        >,
    ) {
        return await Prisma.user.create({
            data: data,
        });
    }

    async loginUser(email: string) {
        return await Prisma.user.findUnique({
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
