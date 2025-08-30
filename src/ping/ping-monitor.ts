// src/monitors/ping-monitor.ts
import { exec } from 'child_process';
import { promisify } from 'util';
import { PingConfig, PingResult } from '../api/types/ping-types';

const execAsync = promisify(exec);

export class PingMonitor {
  private config: PingConfig;

  constructor(config: PingConfig) {
    this.config = config;
  }

  async check(): Promise<PingResult> {
    const startTime = Date.now();
    
    try {
      const result = await this.executePing();
      const responseTime = Date.now() - startTime;
      
      return {
        status: result.packetLoss > 50 ? 'warning' : result.packetLoss > 0 ? 'warning' : 'up',
        timestamp: new Date(),
        responseTime: result.avgTime || responseTime,
        packetLoss: result.packetLoss,
        host: this.config.host,
      };
    } catch (error) {
      return {
        status: 'down',
        timestamp: new Date(),
        responseTime: Date.now() - startTime,
        packetLoss: 100,
        error: error instanceof Error ? error.message : 'Unknown ping error',
        host: this.config.host,
      };
    }
  }

  private async executePing(): Promise<{ avgTime: number; packetLoss: number }> {
    const isWindows = process.platform === 'win32';
    
    let command: string;
    if (isWindows) {
      command = `ping -n ${this.config.retries} -l ${this.config.packetSize} -w ${this.config.timeout} ${this.config.host}`;
    } else {
      command = `ping -c ${this.config.retries} -s ${this.config.packetSize} -W ${Math.ceil(this.config.timeout / 1000)} ${this.config.host}`;
    }

    const { stdout, stderr } = await execAsync(command);
    
    if (stderr) {
      throw new Error(`Ping failed: ${stderr}`);
    }

    return this.parsePingOutput(stdout, isWindows);
  }

  private parsePingOutput(output: string, isWindows: boolean): { avgTime: number; packetLoss: number } {
    if (isWindows) {
      return this.parseWindowsPingOutput(output);
    } else {
      return this.parseLinuxPingOutput(output);
    }
  }

  private parseWindowsPingOutput(output: string): { avgTime: number; packetLoss: number } {
    const lines = output.split('\n');
    let packetLoss = 0;
    let avgTime = 0;

    const lossLine = lines.find(line => line.includes('Lost'));
    if (lossLine) {
      const lossMatch = lossLine.match(/\((\d+)%\s+loss\)/);
      if (lossMatch) {
        packetLoss = parseInt(lossMatch[1]);
      }
    }

    // Extract average time
    const timeLine = lines.find(line => line.includes('Average'));
    if (timeLine) {
      const timeMatch = timeLine.match(/Average\s+=\s+(\d+)ms/);
      if (timeMatch) {
        avgTime = parseInt(timeMatch[1]);
      }
    }

    return { avgTime, packetLoss };
  }

  private parseLinuxPingOutput(output: string): { avgTime: number; packetLoss: number } {
    const lines = output.split('\n');
    let packetLoss = 0;
    let avgTime = 0;

    // Extract packet loss
    const lossLine = lines.find(line => line.includes('packet loss'));
    if (lossLine) {
      const lossMatch = lossLine.match(/(\d+)%\s+packet\s+loss/);
      if (lossMatch) {
        packetLoss = parseInt(lossMatch[1]);
      }
    }

    // Extract average time
    const timeLine = lines.find(line => line.includes('rtt'));
    if (timeLine) {
      const timeMatch = timeLine.match(/=\s+[\d.]+\/([\d.]+)\//);
      if (timeMatch) {
        avgTime = parseFloat(timeMatch[1]);
      }
    }

    return { avgTime, packetLoss };
  }
}