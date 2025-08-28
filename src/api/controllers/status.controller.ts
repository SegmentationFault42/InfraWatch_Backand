import { FastifyReply, FastifyRequest } from 'fastify';
import statusService from '../services/status.service';

class StatusController {
    async getStatus(request: FastifyRequest, reply: FastifyReply) {
        const data = statusService.getStatus();
        return reply.send(data);
    }
}

export default new StatusController();
