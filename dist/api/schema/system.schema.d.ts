export declare const CreateSystemSwaggerSchema: {
    description: string;
    tags: string[];
    body: {
        type: string;
        properties: {
            name: {
                type: string;
                description: string;
                minLength: number;
            };
            host: {
                type: string;
                description: string;
                minLength: number;
            };
            alert_email: {
                type: string;
                format: string;
                description: string;
            };
            monitors: {
                type: string;
                description: string;
                items: {
                    type: string;
                    properties: {
                        type: {
                            type: string;
                            enum: string[];
                            description: string;
                        };
                        config: {
                            type: string;
                            description: string;
                            additionalProperties: boolean;
                        };
                        interval: {
                            type: string;
                            minimum: number;
                            description: string;
                        };
                    };
                    required: string[];
                };
                nullable: boolean;
            };
            slaConfig: {
                type: string;
                description: string;
                properties: {
                    uptimeTarget: {
                        type: string;
                        minimum: number;
                        maximum: number;
                        description: string;
                    };
                    maxDowntime: {
                        type: string;
                        minimum: number;
                        description: string;
                    };
                    responseTimeTarget: {
                        type: string;
                        minimum: number;
                        description: string;
                    };
                    monitoringWindow: {
                        type: string;
                        description: string;
                        enum: string[];
                    };
                };
                required: string[];
                nullable: boolean;
            };
        };
        required: string[];
        additionalProperties: boolean;
    };
    response: {
        201: {
            description: string;
            type: string;
            properties: {
                message: {
                    type: string;
                    example: string;
                };
                data: {
                    type: string;
                    properties: {
                        id: {
                            type: string;
                            format: string;
                            description: string;
                        };
                        name: {
                            type: string;
                            description: string;
                        };
                        host: {
                            type: string;
                            description: string;
                        };
                        alert_email: {
                            type: string;
                            format: string;
                            description: string;
                        };
                        status: {
                            type: string;
                            enum: string[];
                            description: string;
                        };
                        monitors: {
                            type: string;
                            items: {
                                type: string;
                                properties: {
                                    id: {
                                        type: string;
                                        format: string;
                                    };
                                    type: {
                                        type: string;
                                        enum: string[];
                                    };
                                    config: {
                                        type: string;
                                    };
                                    interval: {
                                        type: string;
                                    };
                                };
                            };
                        };
                        SLAConfig: {
                            type: string;
                            items: {
                                type: string;
                                properties: {
                                    id: {
                                        type: string;
                                        format: string;
                                    };
                                    uptimeTarget: {
                                        type: string;
                                    };
                                    maxDowntime: {
                                        type: string;
                                    };
                                    responseTimeTarget: {
                                        type: string;
                                    };
                                    monitoringWindow: {
                                        type: string;
                                    };
                                };
                            };
                        };
                        createdAt: {
                            type: string;
                            format: string;
                            description: string;
                        };
                        updatedAt: {
                            type: string;
                            format: string;
                            description: string;
                        };
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
                    examples: string[];
                };
                details: {
                    type: string;
                    items: {
                        type: string;
                        properties: {
                            code: {
                                type: string;
                            };
                            expected: {
                                type: string;
                            };
                            received: {
                                type: string;
                            };
                            path: {
                                type: string;
                                items: {
                                    type: string;
                                };
                            };
                            message: {
                                type: string;
                            };
                        };
                    };
                    description: string;
                };
                code: {
                    type: string;
                    description: string;
                };
            };
        };
        500: {
            description: string;
            type: string;
            properties: {
                error: {
                    type: string;
                    example: string;
                };
                message: {
                    type: string;
                    example: string;
                };
                code: {
                    type: string;
                    example: string;
                };
            };
        };
    };
};
export declare const GetAllSystemsSwaggerSchema: {
    description: string;
    tags: string[];
    response: {
        200: {
            description: string;
            type: string;
            properties: {
                data: {
                    type: string;
                    items: {
                        type: string;
                        properties: {
                            id: {
                                type: string;
                                format: string;
                            };
                            name: {
                                type: string;
                            };
                            host: {
                                type: string;
                            };
                            status: {
                                type: string;
                                enum: string[];
                            };
                            alert_email: {
                                type: string;
                                format: string;
                            };
                            monitors: {
                                type: string;
                                items: {
                                    type: string;
                                    properties: {
                                        id: {
                                            type: string;
                                            format: string;
                                        };
                                        type: {
                                            type: string;
                                            enum: string[];
                                        };
                                        config: {
                                            type: string;
                                        };
                                        interval: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                            createdAt: {
                                type: string;
                                format: string;
                            };
                            updatedAt: {
                                type: string;
                                format: string;
                            };
                        };
                    };
                };
                count: {
                    type: string;
                    description: string;
                };
            };
        };
        500: {
            description: string;
            type: string;
            properties: {
                error: {
                    type: string;
                };
                code: {
                    type: string;
                };
            };
        };
    };
};
export declare const GetSystemByIdSwaggerSchema: {
    description: string;
    tags: string[];
    params: {
        type: string;
        properties: {
            id: {
                type: string;
                format: string;
                description: string;
            };
        };
        required: string[];
    };
    response: {
        200: {
            description: string;
            type: string;
            properties: {
                data: {
                    type: string;
                    properties: {
                        id: {
                            type: string;
                            format: string;
                        };
                        name: {
                            type: string;
                        };
                        host: {
                            type: string;
                        };
                        alert_email: {
                            type: string;
                            format: string;
                        };
                        status: {
                            type: string;
                            enum: string[];
                        };
                        monitors: {
                            type: string;
                            items: {
                                type: string;
                            };
                        };
                        SLAConfig: {
                            type: string;
                            items: {
                                type: string;
                            };
                        };
                        createdAt: {
                            type: string;
                            format: string;
                        };
                        updatedAt: {
                            type: string;
                            format: string;
                        };
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
                    example: string;
                };
                details: {
                    type: string;
                    items: {
                        type: string;
                    };
                };
            };
        };
        404: {
            description: string;
            type: string;
            properties: {
                error: {
                    type: string;
                    example: string;
                };
                code: {
                    type: string;
                    example: string;
                };
            };
        };
        500: {
            description: string;
            type: string;
            properties: {
                error: {
                    type: string;
                };
                code: {
                    type: string;
                };
            };
        };
    };
};
export declare const UpdateSystemSwaggerSchema: {
    description: string;
    tags: string[];
    params: {
        type: string;
        properties: {
            id: {
                type: string;
                format: string;
                description: string;
            };
        };
        required: string[];
    };
    body: {
        type: string;
        properties: {
            name: {
                type: string;
                minLength: number;
                description: string;
            };
            host: {
                type: string;
                minLength: number;
                description: string;
            };
            alert_email: {
                type: string;
                format: string;
                description: string;
            };
            status: {
                type: string;
                enum: string[];
                description: string;
            };
        };
        additionalProperties: boolean;
    };
    response: {
        200: {
            description: string;
            type: string;
            properties: {
                message: {
                    type: string;
                    example: string;
                };
                data: {
                    type: string;
                    description: string;
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
                details: {
                    type: string;
                };
            };
        };
        404: {
            description: string;
            type: string;
            properties: {
                error: {
                    type: string;
                };
                code: {
                    type: string;
                };
            };
        };
        500: {
            description: string;
            type: string;
            properties: {
                error: {
                    type: string;
                };
                code: {
                    type: string;
                };
            };
        };
    };
};
export declare const DeleteSystemSwaggerSchema: {
    description: string;
    tags: string[];
    params: {
        type: string;
        properties: {
            id: {
                type: string;
                format: string;
                description: string;
            };
        };
        required: string[];
    };
    response: {
        200: {
            description: string;
            type: string;
            properties: {
                message: {
                    type: string;
                    example: string;
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
        404: {
            description: string;
            type: string;
            properties: {
                error: {
                    type: string;
                };
                code: {
                    type: string;
                };
            };
        };
        500: {
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
//# sourceMappingURL=system.schema.d.ts.map