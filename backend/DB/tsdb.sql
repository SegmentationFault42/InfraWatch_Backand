
CREATE TABLE ping_metrics (
  time TIMESTAMPTZ NOT NULL,
  device_id INT,
  ip INET,
  latency INT,
  status INT,
  packet_loss FLOAT
);
SELECT create_hypertable('ping_metrics', 'time');


CREATE TABLE snmp_metrics (
  time TIMESTAMPTZ NOT NULL,
  device_id INT,
  interface_name TEXT,
  in_octets BIGINT,
  out_octets BIGINT,
  cpu INT,
  memory INT,
  status INT,
  temperature INT
);
SELECT create_hypertable('snmp_metrics', 'time');


CREATE TABLE api_metrics (
  time TIMESTAMPTZ NOT NULL,
  device_id INT,
  endpoint TEXT,
  status_code INT,
  response_time_ms INT,
  payload_size INT
);
SELECT create_hypertable('api_metrics', 'time');


CREATE TABLE mdt_metrics (
  time TIMESTAMPTZ NOT NULL,
  device_id INT NOT NULL,
  interface_name TEXT,       
  cpu DOUBLE PRECISION,      
  memory DOUBLE PRECISION,   
  temperature DOUBLE PRECISION,
  traffic_in BIGINT,      
  traffic_out BIGINT,     
  status INT                
);

SELECT create_hypertable('mdt_metrics', 'time');