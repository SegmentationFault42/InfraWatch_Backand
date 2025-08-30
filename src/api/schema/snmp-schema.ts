export const getAllSnmpSystemsSchema = {
    description: 'Get all systems with SNMP monitoring configured',
    tags: ['snmp'],
    response: {
        200: {
            description: 'List of SNMP systems',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            host: { type: 'string' },
                            status: {
                                type: 'string',
                                enum: ['up', 'down', 'warning', 'unknown'],
                            },
                            alert_email: { type: 'string' },
                            monitors: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'string' },
                                        type: { type: 'string' },
                                        config: { type: 'object' },
                                        interval: { type: 'number' },
                                    },
                                },
                            },
                        },
                    },
                },
                count: { type: 'number' },
            },
        },
    },
};

export const getSnmpSystemByIdSchema = {
    description: 'Get specific SNMP system details',
    tags: ['snmp'],
    params: {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid' },
        },
        required: ['id'],
    },
    response: {
        200: {
            description: 'SNMP system details',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        host: { type: 'string' },
                        status: { type: 'string' },
                        monitors: { type: 'array' },
                    },
                },
            },
        },
        404: {
            description: 'SNMP system not found',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
        },
    },
};

export const testSnmpConnectionSchema = {
    description: 'Test SNMP connection to a specific system',
    tags: ['snmp'],
    params: {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid' },
        },
        required: ['id'],
    },
    response: {
        200: {
            description: 'SNMP test results',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                data: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            enum: ['up', 'down', 'warning'],
                        },
                        timestamp: { type: 'string', format: 'date-time' },
                        responseTime: { type: 'number' },
                        values: { type: 'object' },
                        error: { type: 'string' },
                    },
                },
            },
        },
        404: {
            description: 'SNMP system not found',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
        },
        429: {
            description: 'Rate limit exceeded',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
        },
    },
};

export const monitorSnmpSystemSchema = {
    description:
        'Execute SNMP monitoring for a specific system and save metrics',
    tags: ['snmp'],
    params: {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid' },
        },
        required: ['id'],
    },
    response: {
        200: {
            description: 'SNMP monitoring results',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                data: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            enum: ['up', 'down', 'warning'],
                        },
                        timestamp: { type: 'string', format: 'date-time' },
                        responseTime: { type: 'number' },
                        values: { type: 'object' },
                    },
                },
            },
        },
    },
};

export const monitorAllSnmpSystemsSchema = {
    description: 'Execute SNMP monitoring for all configured systems',
    tags: ['snmp'],
    response: {
        200: {
            description: 'Bulk SNMP monitoring results',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                data: {
                    type: 'object',
                    properties: {
                        results: {
                            type: 'object',
                            additionalProperties: {
                                type: 'object',
                                properties: {
                                    status: { type: 'string' },
                                    timestamp: { type: 'string' },
                                    responseTime: { type: 'number' },
                                    values: { type: 'object' },
                                },
                            },
                        },
                        summary: {
                            type: 'object',
                            properties: {
                                total: { type: 'number' },
                                up: { type: 'number' },
                                down: { type: 'number' },
                                warning: { type: 'number' },
                                uptime_percentage: { type: 'number' },
                            },
                        },
                    },
                },
            },
        },
    },
};

export const getSnmpDashboardSchema = {
    description: 'Get SNMP monitoring dashboard with systems overview',
    tags: ['snmp', 'dashboard'],
    response: {
        200: {
            description: 'SNMP dashboard data',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        summary: {
                            type: 'object',
                            properties: {
                                total_systems: { type: 'number' },
                                up_systems: { type: 'number' },
                                down_systems: { type: 'number' },
                                warning_systems: { type: 'number' },
                                overall_uptime: { type: 'number' },
                            },
                        },
                        systems: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    name: { type: 'string' },
                                    host: { type: 'string' },
                                    current_status: {
                                        type: 'object',
                                        properties: {
                                            status: { type: 'string' },
                                            responseTime: { type: 'number' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};

export const getSnmpSystemMetricsSchema = {
    description: 'Get historical SNMP metrics for a specific system',
    tags: ['snmp', 'metrics'],
    params: {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid' },
        },
        required: ['id'],
    },
    querystring: {
        type: 'object',
        properties: {
            from: {
                type: 'string',
                format: 'date-time',
                description: 'Start date for metrics',
            },
            to: {
                type: 'string',
                format: 'date-time',
                description: 'End date for metrics',
            },
            limit: {
                type: 'string',
                pattern: '^[0-9]+$',
                description:
                    'Limit number of recent metrics (if no date range)',
            },
        },
    },
    response: {
        200: {
            description: 'SNMP metrics data',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        metrics: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    time: {
                                        type: 'string',
                                        format: 'date-time',
                                    },
                                    deviceId: { type: 'string' },
                                    cpu: { type: ['number', 'null'] },
                                    memory: { type: ['number', 'null'] },
                                    status: { type: ['number', 'null'] },
                                    temperature: { type: ['number', 'null'] },
                                    inOctets: { type: ['string', 'null'] },
                                    outOctets: { type: ['string', 'null'] },
                                },
                            },
                        },
                        count: { type: 'number' },
                        period: {
                            type: 'object',
                            properties: {
                                from: { type: 'string', format: 'date-time' },
                                to: { type: 'string', format: 'date-time' },
                            },
                        },
                    },
                },
            },
        },
    },
};

export const getSnmpSystemStatusSchema = {
    description: 'Get comprehensive status for a specific SNMP system',
    tags: ['snmp'],
    params: {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid' },
        },
        required: ['id'],
    },
    response: {
        200: {
            description: 'Comprehensive system status',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        system: { type: 'object' },
                        lastCheck: { type: 'object' },
                        recentMetrics: { type: 'array' },
                    },
                },
            },
        },
    },
};
