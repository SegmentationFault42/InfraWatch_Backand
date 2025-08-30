// src/types/webhook-types.ts
export interface WebhookConfig {
  webhookUrl: string; // URL única para receber dados
  secret?: string; // Para validação de autenticidade
  expectedFields?: string[]; // Campos obrigatórios no payload
}

export interface WebhookMonitor {
  id?: string;
  type: 'WEBHOOK';
  config: WebhookConfig;
  enabled?: boolean;
}

export interface IncomingWebhookData {
  systemId: string;
  timestamp: Date;
  status?: 'up' | 'down' | 'warning' | 'unknown';
  message?: string;
  data?: Record<string, any>;
  source?: string;
  receivedAt: Date;
}

export interface SystemWithWebhook {
  id: string;
  name: string;
  host: string;
  status: 'up' | 'down' | 'warning' | 'unknown';
  alert_email?: string;
  monitors: WebhookMonitor[];
  lastWebhookReceived?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebhookMetrics {
  time: Date;
  systemId: string;
  status?: number; // 1=up, 0=down, 2=warning, -1=unknown
  message?: string;
  source?: string;
  eventType: string; // 'status_change', 'alert', 'info', etc.
}