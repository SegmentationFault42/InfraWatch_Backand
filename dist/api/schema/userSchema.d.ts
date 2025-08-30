export declare const LoginSwaggerSchema: {
    description: string;
    tags: string[];
    body: {
        type: string;
        properties: {
            email: {
                type: string;
                format: string;
                description: string;
            };
            password: {
                type: string;
                description: string;
                minLength: number;
            };
        };
        required: string[];
    };
    response: {
        200: {
            description: string;
            type: string;
            properties: {
                success: {
                    type: string;
                    example: boolean;
                };
                message: {
                    type: string;
                    example: string;
                };
                data: {
                    type: string;
                    properties: {
                        token: {
                            type: string;
                            description: string;
                        };
                        user: {
                            type: string;
                            properties: {
                                id: {
                                    type: string;
                                    format: string;
                                };
                                name: {
                                    type: string;
                                };
                                email: {
                                    type: string;
                                    format: string;
                                };
                                role: {
                                    type: string[];
                                    properties: {
                                        id: {
                                            type: string;
                                            format: string;
                                        };
                                        nome: {
                                            type: string;
                                        };
                                        description: {
                                            type: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        400: {
            description: string;
            type: string;
            properties: {
                success: {
                    type: string;
                    example: boolean;
                };
                message: {
                    type: string;
                    example: string;
                };
                errors: {
                    type: string;
                    items: {
                        type: string;
                        properties: {
                            field: {
                                type: string;
                            };
                            message: {
                                type: string;
                            };
                        };
                    };
                };
            };
        };
        401: {
            description: string;
            type: string;
            properties: {
                success: {
                    type: string;
                    example: boolean;
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
        500: {
            description: string;
            type: string;
            properties: {
                success: {
                    type: string;
                    example: boolean;
                };
                message: {
                    type: string;
                    example: string;
                };
            };
        };
    };
};
export declare const CreateUserSwaggerSchema: {
    description: string;
    tags: string[];
    body: {
        type: string;
        properties: {
            name: {
                type: string;
                minLength: number;
                maxLength: number;
                description: string;
            };
            email: {
                type: string;
                format: string;
                description: string;
            };
            password: {
                type: string;
                minLength: number;
                description: string;
            };
            roleId: {
                type: string;
                format: string;
                description: string;
            };
        };
        required: string[];
    };
    response: {
        201: {
            description: string;
            type: string;
            properties: {
                success: {
                    type: string;
                    example: boolean;
                };
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
                        };
                        name: {
                            type: string;
                        };
                        email: {
                            type: string;
                            format: string;
                        };
                        roleId: {
                            type: string[];
                            format: string;
                        };
                        createdAt: {
                            type: string;
                            format: string;
                        };
                        updatedAt: {
                            type: string;
                            format: string;
                        };
                        role: {
                            type: string[];
                            properties: {
                                id: {
                                    type: string;
                                    format: string;
                                };
                                nome: {
                                    type: string;
                                };
                                description: {
                                    type: string[];
                                };
                            };
                        };
                    };
                };
            };
        };
        400: {
            description: string;
            type: string;
            properties: {
                success: {
                    type: string;
                    example: boolean;
                };
                message: {
                    type: string;
                    example: string;
                };
                errors: {
                    type: string;
                    items: {
                        type: string;
                        properties: {
                            field: {
                                type: string;
                            };
                            message: {
                                type: string;
                            };
                        };
                    };
                };
            };
        };
        409: {
            description: string;
            type: string;
            properties: {
                success: {
                    type: string;
                    example: boolean;
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
        500: {
            description: string;
            type: string;
            properties: {
                success: {
                    type: string;
                    example: boolean;
                };
                message: {
                    type: string;
                    example: string;
                };
            };
        };
    };
};
export declare const GetUserSwaggerSchema: {
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
                success: {
                    type: string;
                    example: boolean;
                };
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
                        email: {
                            type: string;
                            format: string;
                        };
                        roleId: {
                            type: string[];
                            format: string;
                        };
                        createdAt: {
                            type: string;
                            format: string;
                        };
                        updatedAt: {
                            type: string;
                            format: string;
                        };
                        role: {
                            type: string[];
                            properties: {
                                id: {
                                    type: string;
                                    format: string;
                                };
                                nome: {
                                    type: string;
                                };
                                description: {
                                    type: string[];
                                };
                            };
                        };
                    };
                };
            };
        };
        400: {
            description: string;
            type: string;
            properties: {
                success: {
                    type: string;
                    example: boolean;
                };
                message: {
                    type: string;
                    example: string;
                };
            };
        };
        404: {
            description: string;
            type: string;
            properties: {
                success: {
                    type: string;
                    example: boolean;
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
        500: {
            description: string;
            type: string;
            properties: {
                success: {
                    type: string;
                    example: boolean;
                };
                message: {
                    type: string;
                    example: string;
                };
            };
        };
    };
};
//# sourceMappingURL=userSchema.d.ts.map