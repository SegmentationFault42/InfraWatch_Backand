-- CreateTable
CREATE TABLE `Sessions` (
    `sid` VARCHAR(191) NOT NULL,
    `sess` JSON NOT NULL,
    `expire` DATETIME(3) NOT NULL,

    INDEX `IDX_session_expire`(`expire`),
    PRIMARY KEY (`sid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `profile_image_url` VARCHAR(191) NULL,
    `role` ENUM('admin', 'operator', 'viewer') NOT NULL DEFAULT 'viewer',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NULL,
    `method` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `ip` VARCHAR(191) NOT NULL,
    `status_code` INTEGER NOT NULL,
    `duration_ms` INTEGER NOT NULL,
    `params` VARCHAR(191) NULL,
    `query` VARCHAR(191) NULL,
    `body` VARCHAR(191) NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `systems` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `monitor_type` ENUM('http', 'https', 'ping', 'tcp') NOT NULL,
    `check_interval` INTEGER NOT NULL DEFAULT 60,
    `timeout` INTEGER NOT NULL DEFAULT 30,
    `status` ENUM('up', 'down', 'warning', 'unknown') NOT NULL DEFAULT 'unknown',
    `is_enabled` BOOLEAN NOT NULL DEFAULT true,
    `alert_email` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `created_by` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `status_logs` (
    `id` VARCHAR(191) NOT NULL,
    `system_id` VARCHAR(191) NOT NULL,
    `status` ENUM('up', 'down', 'warning', 'unknown') NOT NULL,
    `response_time` INTEGER NULL,
    `status_code` INTEGER NULL,
    `error_message` VARCHAR(191) NULL,
    `checked_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alerts` (
    `id` VARCHAR(191) NOT NULL,
    `system_id` VARCHAR(191) NOT NULL,
    `severity` ENUM('critical', 'warning', 'info') NOT NULL,
    `status` ENUM('active', 'resolved', 'acknowledged') NOT NULL DEFAULT 'active',
    `title` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `acknowledged_by` VARCHAR(191) NULL,
    `acknowledged_at` DATETIME(3) NULL,
    `resolved_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sla_configs` (
    `id` VARCHAR(191) NOT NULL,
    `system_id` VARCHAR(191) NOT NULL,
    `uptime_target` DOUBLE NOT NULL DEFAULT 99.9,
    `response_time_target` INTEGER NOT NULL DEFAULT 1000,
    `alert_on_sla_violation` BOOLEAN NOT NULL DEFAULT true,
    `alert_threshold_minutes` INTEGER NOT NULL DEFAULT 5,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `sla_configs_system_id_key`(`system_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sla_reports` (
    `id` VARCHAR(191) NOT NULL,
    `system_id` VARCHAR(191) NOT NULL,
    `month` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `total_checks` INTEGER NOT NULL DEFAULT 0,
    `successful_checks` INTEGER NOT NULL DEFAULT 0,
    `uptime_percentage` DOUBLE NOT NULL DEFAULT 0,
    `average_response_time` DOUBLE NULL,
    `total_downtime` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `systems` ADD CONSTRAINT `systems_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `status_logs` ADD CONSTRAINT `status_logs_system_id_fkey` FOREIGN KEY (`system_id`) REFERENCES `systems`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alerts` ADD CONSTRAINT `alerts_system_id_fkey` FOREIGN KEY (`system_id`) REFERENCES `systems`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alerts` ADD CONSTRAINT `alerts_acknowledged_by_fkey` FOREIGN KEY (`acknowledged_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sla_configs` ADD CONSTRAINT `sla_configs_system_id_fkey` FOREIGN KEY (`system_id`) REFERENCES `systems`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sla_reports` ADD CONSTRAINT `sla_reports_system_id_fkey` FOREIGN KEY (`system_id`) REFERENCES `systems`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
