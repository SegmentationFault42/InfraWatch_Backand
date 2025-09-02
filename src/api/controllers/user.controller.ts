import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import {
    ConflictError,
    NotFoundError,
    UnauthorizedError,
} from '../errors/base.errors';
import { userService } from '../services/user.service';
import { userValidation } from '../validations/user.validation';

class UserController {
    async createUser(req: FastifyRequest, res: FastifyReply) {
        try {
            const data = userValidation.createUserSchema.parse(req.body);
            const user = await userService.createUser(data);

            res.status(201).send({
                success: true,
                message: 'Usuário criado com sucesso',
                data: user,
            });
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                res.status(400).send({
                    success: false,
                    message: 'Dados inválidos',
                });
            } else if (error instanceof ConflictError) {
                res.status(error.statusCode).send({
                    success: false,
                    message: error.message,
                    code: error.code,
                });
            } else {
                res.status(500).send({
                    success: false,
                    message: 'Erro interno do servidor',
                });
            }
        }
    }

    async loginUser(req: FastifyRequest, res: FastifyReply) {
        try {
            const data = userValidation.loginUserSchema.parse(req.body);
            const loginResult = await userService.loginUser(
                data.email,
                data.password,
            );

            res.setCookie('token', loginResult.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60,
            });

            res.status(200).send({
                success: true,
                message: 'Login realizado com sucesso',
                data: {
                    token: loginResult.token,
                    user: loginResult.user,
                },
            });
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                res.status(400).send({
                    success: false,
                    message: 'Dados inválidos',
                });
            } else if (error instanceof UnauthorizedError) {
                res.status(error.statusCode).send({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).send({
                    success: false,
                    message: 'Erro interno do servidor',
                });
            }
        }
    }

    async getUserById(req: FastifyRequest, res: FastifyReply) {
        try {
            const { id } = userValidation.id.parse(req.params);
            const user = await userService.getUserById(id);

            res.status(200).send({
                success: true,
                data: user,
            });
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                res.status(error.statusCode).send({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).send({
                    success: false,
                    message: 'Erro interno do servidor',
                });
            }
        }
    }
    async getAllUser(req: FastifyRequest, res: FastifyReply) {
        try {
            const users = await userService.getAllUser();
            res.status(200).send(users);
        } catch (err: any) {
            res.status(500).send({
                success: false,
                message: 'Erro interno do servidor',
            });
        }
    }

    async update(req: FastifyRequest, res: FastifyReply) {
        try {
            const { id } = userValidation.id.parse(req.params);
            const validatedData = userValidation.updateUserSchema.parse(
                req.body,
            );

            const updatedUser = await userService.update(id, validatedData);

            return res.code(200).send({
                success: true,
                message: 'Utilizador atualizado com sucesso',
                data: updatedUser,
            });
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return res.code(400).send({
                    success: false,
                    message: 'Dados inválidos',
                    errors: error.errors,
                });
            }

            return res.code(400).send({
                success: false,
                message: error.message,
            });
        }
    }
    async delete(req: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = await userValidation.id.parse(req.params);

            await userService.delete(id);

            return reply.code(200).send({
                success: true,
                message: 'Utilizador eliminado com sucesso',
            });
        } catch (error: any) {
            return reply.code(400).send({
                success: false,
                message: error.message,
            });
        }
    }
}

export const userController = new UserController();
