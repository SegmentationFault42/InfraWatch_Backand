import { userValidation } from '../validations/user.validation.ts';
import { FastifyRequest, FastifyReply } from 'fastify';
import { userService } from '../services/user.service.ts';
import { z } from 'zod';

class UserController {
    async createUser(req: FastifyRequest, res: FastifyReply) {
        try {
            const data = userValidation.createUserSchema.parse(req.body);
            await userService.createUser(data);
            res.status(201).send({ message: 'Usuario criado com sucesso' });
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                res.status(400).send({ error: 'Validação falhou' });
            } else {
                console.log(err.message);
                res.status(500).send({ error: 'Erro interno no servidor.' });
            }
        }
    }

    async loginUser(req: FastifyRequest, res: FastifyReply) {
        try {
            const data = userValidation.loginUser.parse(req.body);
            const TokenOrStatus = await userService.loginUser(
                data.email,
                data.password,
            );
            res.status(200).send({ TokenOrStatus });
        } catch (error: any) {
            if (
                error.message === 'Usuário Inexistente' ||
                error.message === 'Senha inválida'
            ) {
                res.status(400).send({ message: 'Credenciais inválidas' });
            } else {
                res.status(500).send({ message: error.message });
            }
        }
    }
}

export const userController = new UserController();
