CREATE TABLE `transactions` (
	`id` varchar(256) NOT NULL,
	`user_id` varchar(256) NOT NULL,
	`transaction_type` enum('premium','hobby') NOT NULL,
	`amount` int NOT NULL,
	`status` enum('pending','success','failed') NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`valid_until` timestamp,
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;