-- Add column for exercise type 
ALTER TABLE `Exercise` ADD COLUMN `exerciseType` VARCHAR(191) DEFAULT NULL COMMENT 'Type of exercise (e.g., strength, cardio)';
