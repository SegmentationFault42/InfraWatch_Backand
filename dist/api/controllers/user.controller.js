"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const zod_1 = require("zod");
const base_errors_1 = require("../errors/base.errors");
const user_service_1 = require("../services/user.service");
const user_validation_1 = require("../validations/user.validation");
class UserController {
    async createUser(req, res) {
        try {
            const data = user_validation_1.userValidation.createUserSchema.parse(req.body);
            const user = await user_service_1.userService.createUser(data);
            res.status(201).send({
                success: true,
                message: 'Usuário criado com sucesso',
                data: user,
            });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                res.status(400).send({
                    success: false,
                    message: 'Dados inválidos',
                });
            }
            else if (error instanceof base_errors_1.ConflictError) {
                res.status(error.statusCode).send({
                    success: false,
                    message: error.message,
                    code: error.code,
                });
            }
            else {
                res.status(500).send({
                    success: false,
                    message: 'Erro interno do servidor',
                });
            }
        }
    }
    async loginUser(req, res) {
        try {
            const data = user_validation_1.userValidation.loginUserSchema.parse(req.body);
            const loginResult = await user_service_1.userService.loginUser(data.email, data.password);
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
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                res.status(400).send({
                    success: false,
                    message: 'Dados inválidos',
                });
            }
            else if (error instanceof base_errors_1.UnauthorizedError) {
                res.status(error.statusCode).send({
                    success: false,
                    message: error.message,
                });
            }
            else {
                res.status(500).send({
                    success: false,
                    message: 'Erro interno do servidor',
                });
            }
        }
    }
    async getUser(req, res) {
        try {
            const { id } = user_validation_1.userValidation.idSchema.parse(req.params);
            const user = await user_service_1.userService.getUserById(id);
            res.status(200).send({
                success: true,
                data: user,
            });
        }
        catch (error) {
            if (error instanceof base_errors_1.NotFoundError) {
                res.status(error.statusCode).send({
                    success: false,
                    message: error.message,
                });
            }
            else {
                res.status(500).send({
                    success: false,
                    message: 'Erro interno do servidor',
                });
            }
        }
    }
}
exports.userController = new UserController();
//# sourceMappingURL=user.controller.js.map