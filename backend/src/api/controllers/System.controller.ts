import { systemService } from '../services/Sytem.Service.ts';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { systemValidation } from '../validations/system.validation.ts';

class SystemController {
    async addSystem(req: FastifyRequest, res: FastifyReply) {
        try {
            const data = systemValidation.createSystemSchema.parse(req.body);
            await systemService.addSystem(data);
            res.status(201).send({ message: 'Sistema adicionado com sucesso' });
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                res.status(400).send({ error: 'A validação falhou' });
            } else if (err.message == 'Esse sistema já está cadastrado.') {
                res.status(400).send({
                    error: 'Esse sistema já está cadastrado.',
                });
            } else {
                console.log(err.message);
                res.status(500).send({ error: 'Erro interno no servidor.' });
            }
        }
    }
    async getAllSystems(req: FastifyRequest, res: FastifyReply) {
        try {
            const data = await systemService.getAllSystems();
            res.status(200).send(data);
        } catch (err: any) {
            console.log(err);
        }
    }

    async deleteSystemById(req: FastifyRequest, res: FastifyReply) {
        try{
        const Param = systemValidation.getByDelete.parse(req.params);
        const data = systemService.deleteSystemById(Param.id);
        res.status(200).send(data)
        }
        catch(err: any)
        {
             if (err instanceof z.ZodError) 
                res.status(400).send({ error: 'A validação falhou' });
            else if (err.message === `Falha ao eliminar Sistema.\n Tente Novamente`)
                res.status(400).send({message: err.message})
            else
                 res.status(500).send({ error: 'Erro interno no servidor.' });
        }
    }
}

export const systemController = new SystemController();
