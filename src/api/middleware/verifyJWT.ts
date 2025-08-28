import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { ENV } from '../../config/dotenv';

export async function verifyJWT(req: FastifyRequest, res: FastifyReply) {
    let token: string | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }
    if (!token) {
        token = req.cookies.token;
    }
    if (!token) {
        return res.status(401).send({ error: 'Token não fornecido' });
    }
    try {
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        (req as any).user = decoded;
    } catch (error: any) {
        return res.status(401).send({ error: 'Token inválido ou expirado' });
    }
}
