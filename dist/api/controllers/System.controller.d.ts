import { FastifyRequest, FastifyReply } from 'fastify';
declare class SystemController {
    addSystem(req: FastifyRequest, res: FastifyReply): Promise<never>;
    getAllSystems(req: FastifyRequest, res: FastifyReply): Promise<never>;
    getSystemById(req: FastifyRequest, res: FastifyReply): Promise<never>;
    deleteSystemById(req: FastifyRequest, res: FastifyReply): Promise<never>;
    updateSystemById(req: FastifyRequest, res: FastifyReply): Promise<never>;
    private handleError;
}
export declare const systemController: SystemController;
export {};
//# sourceMappingURL=System.controller.d.ts.map