export declare const getStatusSchema: {
    description: string;
    tags: string[];
    summary: string;
    response: {
        200: {
            description: string;
            type: string;
            properties: {
                status: {
                    type: string;
                    example: string;
                };
                uptime: {
                    type: string;
                    example: number;
                };
                timestamp: {
                    type: string;
                    format: string;
                };
            };
        };
    };
};
//# sourceMappingURL=status.schema.d.ts.map