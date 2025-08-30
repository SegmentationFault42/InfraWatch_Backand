export declare const pingRouteSchema: {
    description: string;
    tags: string[];
    params: {
        type: string;
        properties: {
            host: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    response: {
        200: {
            description: string;
            type: string;
            items: {
                type: string;
                properties: {
                    target: {
                        type: string;
                    };
                    reachable: {
                        type: string;
                    };
                    retriesUsed: {
                        type: string;
                    };
                    averageLatency: {
                        type: string[];
                    };
                };
            };
        };
        400: {
            description: string;
            type: string;
            properties: {
                error: {
                    type: string;
                };
            };
        };
        504: {
            description: string;
            type: string;
            properties: {
                error: {
                    type: string;
                };
            };
        };
    };
};
//# sourceMappingURL=ping.schema.d.ts.map