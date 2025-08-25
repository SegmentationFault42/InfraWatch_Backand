import { userRepository } from '../repositories/user.repository.ts';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { ENV } from '../../config/dotenv.ts';

class UserService {
    async createUser(data: {email: string;senha: string;first_name: string;last_name: string;role?: string;}) {
        const userExists = await userRepository.verifyUser(data.email);
        if (userExists) {
            throw new Error('E-mail já cadastrado.');
        }

        try {
            const senhaHash = await bcrypt.hash(data.senha, 10);

            return await userRepository.create({
                name: `${data.first_name} ${data.last_name}`,
                email: data.email,
                password: senhaHash,
                role: data.role
                ? { connect: { nome: data.role } }
                : undefined,
            }); 
        } catch (error) {
            console.log(error);
            throw new Error('Falha ao criar usuário.');
        }
    }
    async loginUser(email: string, password: string) {
        const user = await userRepository.loginUser(email);
        if (!user) throw new Error('Usuário Inexistente');
        const senhaValida = await bcrypt.compare(password, user.senha);
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
