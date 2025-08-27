import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ENV } from '../../config/dotenv.ts';
import { ConflictError, NotFoundError, UnauthorizedError } from "../errors/base.errors.ts"
import { userRepository } from '../repositories/user.repository.ts';
import { roleRepository } from '../repositories/role.repository.ts';

type CreateUserData = {
    name: string;
    email: string;
    password: string;
    roleId?: string;
};

type LoginResponse = {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: {
            id: string;
            nome: string;
            description: string | null;
        } | null;
    };
};

class UserService {
    async createUser(data: CreateUserData) {
        const existingUser = await userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new ConflictError('Usuário já existe com este email');
        }

        let roleId = data.roleId;
        if (!roleId) {
            const defaultRole = await roleRepository.getDefaultViewerRole();
            roleId = defaultRole.id;
        } else {
            const role = await roleRepository.findById(roleId);
            if (!role) {
                throw new NotFoundError('Role');
            }
        }

        const hashedPassword = await bcrypt.hash(data.password, 12);
        const newUser = await userRepository.create({
            ...data,
            password: hashedPassword,
            roleId
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
                roleId: fullUser.role?.id 
            },
            ENV.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return {
            token,
            user: {
                id: fullUser.id,
                name: fullUser.name,
                email: fullUser.email,
                role: fullUser.role
            }
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
}

export const userService = new UserService();