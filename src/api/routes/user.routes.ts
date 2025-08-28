import { FastifyInstance } from 'fastify';
import { userController } from '../controllers/user.controller';
import {
    CreateUserSwaggerSchema,
    LoginSwaggerSchema,
} from '../schema/userSchema';

export async function userRoutes(fastify: FastifyInstance) {
    fastify.post(
        '/user/create',
        { schema: CreateUserSwaggerSchema },
        userController.createUser,
    );
    fastify.post(
        '/user/login',
        { schema: LoginSwaggerSchema },
        userController.loginUser,
    );
}
