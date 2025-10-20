-- CreateTable
CREATE TABLE `cached_places` (
    `id` VARCHAR(191) NOT NULL,
    `placeId` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `address` TEXT NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `rating` DOUBLE NULL,
    `user_ratings_total` INTEGER NULL,
    `price_level` INTEGER NULL,
    `types` JSON NOT NULL,
    `photo_reference` VARCHAR(500) NULL,
    `vicinity` VARCHAR(500) NULL,
    `is_open` BOOLEAN NULL,
    `last_updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `cached_places_placeId_key`(`placeId`),
    INDEX `cached_places_latitude_longitude_idx`(`latitude`, `longitude`),
    INDEX `cached_places_placeId_idx`(`placeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `search_logs` (
    `id` VARCHAR(191) NOT NULL,
    `search_address` VARCHAR(500) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `radius` INTEGER NOT NULL,
    `result_count` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `search_logs_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
