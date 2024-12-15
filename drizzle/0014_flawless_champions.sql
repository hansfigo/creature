ALTER TABLE `transactions` MODIFY COLUMN `transaction_type` enum('premium','standart','basic') NOT NULL DEFAULT 'basic';--> statement-breakpoint
ALTER TABLE `transactions` ADD `is_active` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `user` ADD `active_plan` enum('premium','standart','basic') DEFAULT 'basic' NOT NULL;