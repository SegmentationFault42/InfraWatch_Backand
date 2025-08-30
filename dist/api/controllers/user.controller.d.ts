import { FastifyRequest, FastifyReply } from 'fastify';
declare class UserController {
    createUser(req: FastifyRequest, res: FastifyReply): Promise<void>;
    loginUser(req: FastifyRequest, res: FastifyReply): Promise<void>;
    getUser(req: FastifyRequest, res: FastifyReply): Promise<void>;
}
export declare const userController: UserController;
export {};
//# sourceMappingURL=user.controller.d.ts.map