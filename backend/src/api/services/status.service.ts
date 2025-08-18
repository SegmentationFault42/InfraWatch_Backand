class StatusService {
    getStatus() {
        return {
            status: 'ok',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
        };
    }
}

export default new StatusService();
