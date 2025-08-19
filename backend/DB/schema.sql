-- ========================
-- BANCO DE DADOS: Monitoramento e SLA
-- MySQL 8+
-- ========================

-- Tabela: sessions
CREATE TABLE `sessions` (
  `sid` VARCHAR(255) NOT NULL,
  `sess` JSON NOT NULL,
  `expire` DATETIME NOT NULL,
  PRIMARY KEY (`sid`),
  INDEX `IDX_session_expire` (`expire`)
) ENGINE=InnoDB;

-- Tabela: users
CREATE TABLE `users` (
  `id` VARCHAR(36) NOT NULL,
  `email` VARCHAR(255) UNIQUE,
  `first_name` VARCHAR(255),
  `last_name` VARCHAR(255),
  `profile_image_url` VARCHAR(255),
  `role` VARCHAR(50) NOT NULL DEFAULT 'viewer',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Tabela: systems
CREATE TABLE `systems` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `url` TEXT NOT NULL,
  `monitor_type` ENUM('http', 'https', 'ping', 'tcp') NOT NULL,
  `check_interval` INT NOT NULL DEFAULT 60,
  `timeout` INT NOT NULL DEFAULT 30,
  `status` ENUM('up', 'down', 'warning', 'unknown') NOT NULL DEFAULT 'unknown',
  `is_enabled` BOOLEAN NOT NULL DEFAULT TRUE,
  `alert_email` VARCHAR(255),
  `description` TEXT,
  `created_by` VARCHAR(36),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`)
) ENGINE=InnoDB;

-- Tabela: status_logs
CREATE TABLE `status_logs` (
  `id` VARCHAR(36) NOT NULL,
  `system_id` VARCHAR(36) NOT NULL,
  `status` ENUM('up', 'down', 'warning', 'unknown') NOT NULL,
  `response_time` INT,
  `status_code` INT,
  `error_message` TEXT,
  `checked_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`system_id`) REFERENCES `systems`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabela: alerts
CREATE TABLE `alerts` (
  `id` VARCHAR(36) NOT NULL,
  `system_id` VARCHAR(36) NOT NULL,
  `severity` ENUM('critical', 'warning', 'info') NOT NULL,
  `status` ENUM('active', 'resolved', 'acknowledged') NOT NULL DEFAULT 'active',
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `acknowledged_by` VARCHAR(36),
  `acknowledged_at` DATETIME,
  `resolved_at` DATETIME,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`system_id`) REFERENCES `systems`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`acknowledged_by`) REFERENCES `users`(`id`)
) ENGINE=InnoDB;

-- Tabela: sla_configs
CREATE TABLE `sla_configs` (
  `id` VARCHAR(36) NOT NULL,
  `system_id` VARCHAR(36) NOT NULL UNIQUE,
  `uptime_target` FLOAT NOT NULL DEFAULT 99.9,
  `response_time_target` INT NOT NULL DEFAULT 1000,
  `alert_on_sla_violation` BOOLEAN NOT NULL DEFAULT TRUE,
  `alert_threshold_minutes` INT NOT NULL DEFAULT 5,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`system_id`) REFERENCES `systems`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabela: sla_reports
CREATE TABLE `sla_reports` (
  `id` VARCHAR(36) NOT NULL,
  `system_id` VARCHAR(36) NOT NULL,
  `month` INT NOT NULL,
  `year` INT NOT NULL,
  `total_checks` INT NOT NULL DEFAULT 0,
  `successful_checks` INT NOT NULL DEFAULT 0,
  `uptime_percentage` FLOAT NOT NULL DEFAULT 0,
  `average_response_time` FLOAT,
  `total_downtime` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`system_id`) REFERENCES `systems`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- contacts — contatos para notificação
CREATE TABLE `contacts` (
  `id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NULL, -- se for contacto associado a user
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255),
  `phone` VARCHAR(50),
  `channel` ENUM('email','sms','telegram','whatsapp','slack','other') NOT NULL,
  `meta` JSON NULL, -- dados específicos do canal (ex: webhook url, chat id)
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES users(id)
) ENGINE=InnoDB;

-- notification_channels — canais (por sistema ou global)
CREATE TABLE `notification_channels` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `type` ENUM('email','webhook','slack','telegram','sms') NOT NULL,
  `config` JSON NOT NULL, -- credenciais, url, tokens, etc.
  `is_enabled` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_by` VARCHAR(36),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`created_by`) REFERENCES users(id)
) ENGINE=InnoDB;

-- notification_rules — regras ligando sistema → canal
CREATE TABLE `notification_rules` (
  `id` VARCHAR(36) NOT NULL,
  `system_id` VARCHAR(36) NULL, -- null = regra global
  `channel_id` VARCHAR(36) NOT NULL,
  `min_severity` ENUM('info','warning','critical') NOT NULL DEFAULT 'warning',
  `repeat_minutes` INT NOT NULL DEFAULT 15,
  `only_when_enabled` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`system_id`) REFERENCES systems(id) ON DELETE CASCADE,
  FOREIGN KEY (`channel_id`) REFERENCES notification_channels(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- escalation_policies & steps
CREATE TABLE `escalation_policies` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `escalation_steps` (
  `id` VARCHAR(36) NOT NULL,
  `policy_id` VARCHAR(36) NOT NULL,
  `step_order` INT NOT NULL,
  `delay_minutes` INT NOT NULL DEFAULT 0,
  `contact_id` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`policy_id`) REFERENCES escalation_policies(id) ON DELETE CASCADE,
  FOREIGN KEY (`contact_id`) REFERENCES contacts(id) ON DELETE CASCADE
) ENGINE=InnoDB;
 
CREATE TABLE `maintenance_windows` (
  `id` VARCHAR(36) NOT NULL,
  `system_id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(255),
  `start_at` DATETIME NOT NULL,
  `end_at` DATETIME NOT NULL,
  `created_by` VARCHAR(36),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`system_id`) REFERENCES systems(id) ON DELETE CASCADE,
  FOREIGN KEY (`created_by`) REFERENCES users(id)
) ENGINE=InnoDB;

-- incidents + incident_events
CREATE TABLE `incidents` (
  `id` VARCHAR(36) NOT NULL,
  `system_id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(255),
  `status` ENUM('open','investigating','resolved','closed') NOT NULL DEFAULT 'open',
  `started_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `ended_at` DATETIME NULL,
  `created_by` VARCHAR(36),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`system_id`) REFERENCES systems(id) ON DELETE CASCADE,
  FOREIGN KEY (`created_by`) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE `incident_events` (
  `id` VARCHAR(36) NOT NULL,
  `incident_id` VARCHAR(36) NOT NULL,
  `event_type` VARCHAR(100), -- e.g. alert, note, status_change
  `message` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `created_by` VARCHAR(36),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`incident_id`) REFERENCES incidents(id) ON DELETE CASCADE,
  FOREIGN KEY (`created_by`) REFERENCES users(id)
) ENGINE=InnoDB;

-- api_keys (para integrações e agentes)
CREATE TABLE `api_keys` (
  `id` VARCHAR(36) NOT NULL,
  `key` VARCHAR(128) NOT NULL,
  `description` VARCHAR(255),
  `user_id` VARCHAR(36),
  `scopes` JSON,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `revoked_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_api_keys_key` (`key`),
  FOREIGN KEY (`user_id`) REFERENCES users(id)
) ENGINE=InnoDB;

-- tags e relacionamentos (para filtrar/agrupas sistemas)
CREATE TABLE `tags` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_tags_name` (`name`)
) ENGINE=InnoDB;

CREATE TABLE `system_tags` (
  `system_id` VARCHAR(36) NOT NULL,
  `tag_id` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`system_id`,`tag_id`),
  FOREIGN KEY (`system_id`) REFERENCES systems(id) ON DELETE CASCADE,
  FOREIGN KEY (`tag_id`) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- audit_logs
CREATE TABLE `audit_logs` (
  `id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NULL,
  `action` VARCHAR(255) NOT NULL,
  `object_type` VARCHAR(100),
  `object_id` VARCHAR(36),
  `details` JSON,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES users(id)
) ENGINE=InnoDB;

-- índice em users.email (já tem UNIQUE) e campo deleted_at para soft delete
ALTER TABLE `users`
  ADD COLUMN `deleted_at` DATETIME NULL,
  ADD INDEX `IDX_users_role` (`role`);
  
-- adicionar created_by/updated_by a systems (seu schema já tem created_by; adicionar updated_by e deleted_at)
ALTER TABLE `systems`
  ADD COLUMN `updated_by` VARCHAR(36) NULL,
  ADD COLUMN `deleted_at` DATETIME NULL,
  ADD INDEX `IDX_systems_status` (`status`);
  
-- índices extras
CREATE INDEX IDX_status_logs_checked_at ON status_logs(checked_at);
CREATE INDEX IDX_alerts_status ON alerts(status);