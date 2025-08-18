import { Session } from '@fastify/secure-session';

declare module 'fastify' {
    interface FastifyRequest {
        session: Session;
        data?: Usuario | JwtPayload | Admin;
        user;
    }
}
