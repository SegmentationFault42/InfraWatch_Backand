import { FastifyRequest, FastifyReply } from 'fastify';
import { systemValidation } from '../validations/system.validation';
import { apiService } from '../services/api-service';

export class ApiController {
    async processApiCheck(req: FastifyRequest, res: FastifyReply) {
        try {
            const id = systemValidation.getById.parse(req.params);
            const api = apiService.processApiCheck(id.id);
            res.status(200).send(api);
        } catch (err: any) {
            return res.status(500).send({
                success: false,
                message: 'Erro ao buscar sistema',
                error: err.message,
            });
        }
    }
}

export const apiController = new ApiController();
