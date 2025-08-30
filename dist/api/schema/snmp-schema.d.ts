export declare const getAllSnmpSystemsSchema: {
    description: string;
    tags: string[];
    response: {
        200: {
            description: string;
            type: string;
            properties: {
                success: {
                    type: string;
                };
                data: {
                    type: string;
                    items: {
                        type: string;
                        properties: {
                            id: {
                                type: string;
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
                            };
                            monitors: {
                                type: string;
                                items: {
                                    type: string;
                                    properties: {
                                        id: {
                                            type: string;
                                        };
                                        type: {
                                            type: string;
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
                        };
                    };
                };
                count: {
                    type: string;
                };
            };
        };
    };
};
export declare const getSnmpSystemByIdSchema: {
    description: string;
    tags: string[];
    params: {
        type: string;
        properties: {
            id: {
                type: string;
                format: string;
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
                };
                data: {
                    type: string;
                    properties: {
                        id: {
                            type: string;
                        };
                        name: {
                            type: string;
                        };
                        host: {
                            type: string;
                        };
                        status: {
                            type: string;
                        };
                        monitors: {
                            type: string;
                        };
                    };
                };
            };
        };
        404: {
            description: string;
            type: string;
            properties: {
                success: {
                    type: string;
                };
                message: {
                    type: string;
                };
            };
        };
    };
};
export declare const testSnmpConnectionSchema: {
    description: string;
    tags: string[];
    params: {
        type: string;
        properties: {
            id: {
                type: string;
                format: string;
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
                };
                message: {
                    type: string;
                };
                data: {
                    type: string;
                    properties: {
                        status: {
                            type: string;
                            enum: string[];
                        };
                        timestamp: {
                            type: string;
                            format: string;
                        };
                        responseTime: {
                            type: string;
                        };
                        values: {
                            type: string;
                        };
                        error: {
                            type: string;
                        };
                    };
                };
            };
        };
        404: {
            description: string;
            type: string;
            properties: {
                success: {
                    type: string;
                };
                message: {
                    type: string;
                };
            };
        };
        429: {
            description: string;
            type: string;
            properties: {
                success: {
                    type: string;
                };
                message: {
                    type: string;
                };
            };
        };
    };
};
export declare const monitorSnmpSystemSchema: {
    description: string;
    tags: string[];
    params: {
        type: string;
        properties: {
            id: {
                type: string;
                format: string;
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
                };
                message: {
                    type: string;
                };
                data: {
                    type: string;
                    properties: {
                        status: {
                            type: string;
                            enum: string[];
                        };
                        timestamp: {
                            type: string;
                            format: string;
                        };
                        responseTime: {
                            type: string;
                        };
                        values: {
                            type: string;
                        };
                    };
                };
            };
        };
    };
};
export declare const monitorAllSnmpSystemsSchema: {
    description: string;
    tags: string[];
    response: {
        200: {
            description: string;
            type: string;
            properties: {
                success: {
                    type: string;
                };
                message: {
                    type: string;
                };
                data: {
                    type: string;
                    properties: {
                        results: {
                            type: string;
                            additionalProperties: {
                                type: string;
                                properties: {
                                    status: {
                                        type: string;
                                    };
                                    timestamp: {
                                        type: string;
                                    };
                                    responseTime: {
                                        type: string;
                                    };
                                    values: {
                                        type: string;
                                    };
                                };
                            };
                        };
                        summary: {
                            type: string;
                            properties: {
                                total: {
                                    type: string;
                                };
                                up: {
                                    type: string;
                                };
                                down: {
                                    type: string;
                                };
                                warning: {
                                    type: string;
                                };
                                uptime_percentage: {
                                    type: string;
                                };
                            };
                        };
                    };
                };
            };
        };
    };
};
export declare const getSnmpDashboardSchema: {
    description: string;
    tags: string[];
    response: {
        200: {
            description: string;
            type: string;
            properties: {
                success: {
                    type: string;
                };
                data: {
                    type: string;
                    properties: {
                        summary: {
                            type: string;
                            properties: {
                                total_systems: {
                                    type: string;
                                };
                                up_systems: {
                                    type: string;
                                };
                                down_systems: {
                                    type: string;
                                };
                                warning_systems: {
                                    type: string;
                                };
                                overall_uptime: {
                                    type: string;
                                };
                            };
                        };
                        systems: {
                            type: string;
                            items: {
                                type: string;
                                properties: {
                                    id: {
                                        type: string;
                                    };
                                    name: {
                                        type: string;
                                    };
                                    host: {
                                        type: string;
                                    };
                                    current_status: {
                                        type: string;
                                        properties: {
                                            status: {
                                                type: string;
                                            };
                                            responseTime: {
                                                type: string;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
    };
};
export declare const getSnmpSystemMetricsSchema: {
    description: string;
    tags: string[];
    params: {
        type: string;
        properties: {
            id: {
                type: string;
                format: string;
            };
        };
        required: string[];
    };
    querystring: {
        type: string;
        properties: {
            from: {
                type: string;
                format: string;
                description: string;
            };
            to: {
                type: string;
                format: string;
                description: string;
            };
            limit: {
                type: string;
                pattern: string;
                description: string;
            };
        };
    };
    response: {
        200: {
            description: string;
            type: string;
            properties: {
                success: {
                    type: string;
                };
                data: {
                    type: string;
                    properties: {
                        metrics: {
                            type: string;
                            items: {
                                type: string;
                                properties: {
                                    time: {
                                        type: string;
                                        format: string;
                                    };
                                    deviceId: {
                                        type: string;
                                    };
                                    cpu: {
                                        type: string[];
                                    };
                                    memory: {
                                        type: string[];
                                    };
                                    status: {
                                        type: string[];
                                    };
                                    temperature: {
                                        type: string[];
                                    };
                                    inOctets: {
                                        type: string[];
                                    };
                                    outOctets: {
                                        type: string[];
                                    };
                                };
                            };
                        };
                        count: {
                            type: string;
                        };
                        period: {
                            type: string;
                            properties: {
                                from: {
                                    type: string;
                                    format: string;
                                };
                                to: {
                                    type: string;
                                    format: string;
                                };
                            };
                        };
                    };
                };
            };
        };
    };
};
export declare const getSnmpSystemStatusSchema: {
    description: string;
    tags: string[];
    params: {
        type: string;
        properties: {
            id: {
                type: string;
                format: string;
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
                };
                data: {
                    type: string;
                    properties: {
                        system: {
                            type: string;
                        };
                        lastCheck: {
                            type: string;
                        };
                        recentMetrics: {
                            type: string;
                        };
                    };
                };
            };
        };
    };
};
//# sourceMappingURL=snmp-schema.d.ts.map