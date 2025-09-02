import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ENV } from '../../config/dotenv';
import {
    ConflictError,
    NotFoundError,
    UnauthorizedError,
} from '../errors/base.errors';
import { userRepository } from '../repositories/user.repository';

type CreateUserData = {
    name: string;
    email: string;
    password: string;
    role: string;
};

type LoginResponse = {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
};

class UserService {
    async createUser(data: CreateUserData) {
        const existingUser = await userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new ConflictError('Usuário já existe com este email');
        }
        const hashedPassword = await bcrypt.hash(data.password, 12);
        const newUser = await userRepository.create({
            ...data,
            password: hashedPassword,
        });

        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }

    async loginUser(email: string, password: string): Promise<LoginResponse> {
        const user = await userRepository.findForLogin(email);
        if (!user) {
            throw new UnauthorizedError('Credenciais inválidas');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new UnauthorizedError('Credenciais inválidas');
        }

        const fullUser = await userRepository.findById(user.id);
        if (!fullUser) {
            throw new NotFoundError('Usuário');
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            ENV.JWT_SECRET,
            { expiresIn: '24h' },
        );

        return {
            token,
            user: {
                id: fullUser.id,
                name: fullUser.name,
                email: fullUser.email,
            },
        };
    }

    async getUserById(id: string) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new NotFoundError('Usuário');
        }

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async getAllUser() {
        const users = await userRepository.getAllUser();
        if (users.length <= 0) return 'Nenhum usuário encontado';
        return users;
    }

    async update(id: string, data: Partial<CreateUserData>) {
        const existingUser = await userRepository.findById(id);
        if (!existingUser) {
            throw new Error('Utilizador não encontrado');
        }
        if (data.email && data.email !== existingUser.email) {
            const emailExists = await userRepository.findByEmail(data.email);
            if (emailExists) {
                throw new Error('Email já está em uso');
            }
        }
        if (data.password) {
            const hashedPassword = await bcrypt.hash(data.password, 12);
            data.password = hashedPassword;
        }

        return await userRepository.update(id, data);
    }

    async delete(id: string) {
        if (!id) {
            throw new Error('ID do utilizador é obrigatório');
        }

        const user = await userRepository.findById(id);
        if (!user) {
            throw new Error('Utilizador não encontrado');
        }

        if (user.roleId === 'ADMIN') {
            throw new Error('Utilizadores admin não podem ser eliminados');
        }
        return await userRepository.delete(id);
    }
}

export const userService = new UserService();
