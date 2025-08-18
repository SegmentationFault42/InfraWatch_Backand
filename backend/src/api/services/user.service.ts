import { userRepository } from '../repositories/user.repository.ts';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { ENV } from '../../config/dotenv.ts';

class UserService {
    async createUser(
        data: Omit<
            User,
            'id' | 'role' | 'updated_at' | 'created_at' | 'profile_image_url'
        >,
    ) {
        const userExists = await userRepository.verifyUser(data);

        if (userExists) {
            throw new Error('Esses dados já existem.');
        }

        try {
            const senhaHash = await bcrypt.hash(data.password, 10);
            data.password = senhaHash;
            return await userRepository.create(data);
        } catch (error) {
            console.log(error);
            throw new Error('Falha ao criar usuário.');
        }
    }
    async loginUser(email: string, password: string) {
        const user = await userRepository.loginUser(email);
        if (!user) throw new Error('Usuário Inexistente');
        const senhaValida = await bcrypt.compare(password, user.password);
        if (!senhaValida) {
            throw new Error('Senha inválida');
        }
        const tokenadmin = jwt.sign(
            { id: user.id, email: user.email },
            ENV.JWT_SECRET,
            { expiresIn: '15min' },
        );
        return tokenadmin;
    }
}

export const userService = new UserService();
