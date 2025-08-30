// src/monitors/api-monitor.ts
import axios, { AxiosResponse } from 'axios';
import type { ApiConfig, ApiResult } from '../types/api-types';

export class ApiMonitor {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  async check(): Promise<ApiResult> {
    const startTime = Date.now();
    
    try {
      const response = await this.executeApiRequest();
      const responseTime = Date.now() - startTime;
      const payloadSize = this.calculatePayloadSize(response.data);
      
      const isSuccess = this.isSuccessResponse(response);
      
      return {
        status: isSuccess ? 'up' : 'warning',
        timestamp: new Date(),
        responseTime,
        statusCode: response.status,
        endpoint: this.config.url,
        responseBody: response.data,
        payloadSize,
      };
    } catch (error) {
      return {
        status: 'down',
        timestamp: new Date(),
        responseTime: Date.now() - startTime,
        statusCode: axios.isAxiosError(error) ? error.response?.status : undefined,
        error: error instanceof Error ? error.message : 'Unknown API error',
        endpoint: this.config.url,
      };
    }
  }

  private async executeApiRequest(): Promise<AxiosResponse> {
    const axiosConfig = {
      method: this.config.method,
      url: this.config.url,
      timeout: this.config.timeout,
      headers: this.config.headers || {},
      validateStatus: () => true, // Don't throw on HTTP error codes
    };

    if (['POST', 'PUT'].includes(this.config.method) && this.config.body) {
      return await axios({
        ...axiosConfig,
        data: this.config.body,
      });
    } else {
      return await axios(axiosConfig);
    }
  }

  private isSuccessResponse(response: AxiosResponse): boolean {
    // Check status code
    if (response.status !== this.config.expectedStatus) {
      return false;
    }

    // Check expected response if configured
    if (this.config.expectedResponse) {
      return this.matchesExpectedResponse(response.data, this.config.expectedResponse);
    }

    return true;
  }

  private matchesExpectedResponse(actual: any, expected: Record<string, any>): boolean {
    for (const key in expected) {
      if (actual[key] !== expected[key]) {
        return false;
      }
    }
    return true;
  }

  private calculatePayloadSize(data: any): number {
    if (!data) return 0;
    
    try {
      return JSON.stringify(data).length;
    } catch {
      return data.toString().length || 0;
    }
  }
}