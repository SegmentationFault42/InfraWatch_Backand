CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Tabela ping_metrics (sem PRIMARY KEY SERIAL)
CREATE TABLE ping_metrics (
  time TIMESTAMPTZ NOT NULL,
  device_id TEXT,
  ip INET,
  latency INT,
  status INT,
  packet_loss FLOAT
);

SELECT create_hypertable('ping_metrics', 'time');

-- Tabela snmp_metrics
CREATE TABLE snmp_metrics (
  time TIMESTAMPTZ NOT NULL,
  device_id TEXT,
  interface_name TEXT,
  in_octets BIGINT,
  out_octets BIGINT,
  cpu INT,
  memory INT,
  status INT,
  temperature INT
);

SELECT create_hypertable('snmp_metrics', 'time');

-- Tabela api_metrics
CREATE TABLE api_metrics (
  time TIMESTAMPTZ NOT NULL,
  device_id TEXT,
  endpoint TEXT,
  status_code INT,
  response_time_ms INT,
  payload_size INT
);

SELECT create_hypertable('api_metrics', 'time');

-- Tabela mdt_metrics
CREATE TABLE mdt_metrics (
  time TIMESTAMPTZ NOT NULL,
  device_id TEXT NOT NULL,
  interface_name TEXT,       
  cpu DOUBLE PRECISION,      
  memory DOUBLE PRECISION,   
  temperature DOUBLE PRECISION,
  traffic_in BIGINT,      
  traffic_out BIGINT,     
  status INT                
);

SELECT create_hypertable('mdt_metrics', 'time');

-- Índices para performance
CREATE INDEX idx_ping_metrics_device_time ON ping_metrics(device_id, time DESC);
CREATE INDEX idx_snmp_metrics_device_time ON snmp_metrics(device_id, time DESC);
CREATE INDEX idx_api_metrics_device_time ON api_metrics(device_id, time DESC);
CREATE INDEX idx_mdt_metrics_device_time ON mdt_metrics(device_id, time DESC);

-- Políticas de retenção
SELECT add_retention_policy('ping_metrics', INTERVAL '90 days');
SELECT add_retention_policy('snmp_metrics', INTERVAL '90 days');
SELECT add_retention_policy('api_metrics', INTERVAL '90 days');
SELECT add_retention_policy('mdt_metrics', INTERVAL '90 days');