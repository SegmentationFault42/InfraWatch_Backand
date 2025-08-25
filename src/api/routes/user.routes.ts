import { FastifyInstance } from 'fastify';
import { userController } from '../controllers/user.controller.ts';
import {
    CreateUserSwaggerSchema,
    LoginSchemaSwagger,
} from '../schema/userSchema.ts';

export async function userRoutes(fastify: FastifyInstance) {
    fastify.post(
        '/user/create',
        { schema: CreateUserSwaggerSchema },
        userController.createUser,
    );
    fastify.post(
        '/user/login',
        { schema: LoginSchemaSwagger },
        userController.loginUser,
    );
}
