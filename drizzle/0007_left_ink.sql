CREATE TABLE `followers` (
	`id` varchar(256) NOT NULL,
	`follower_id` varchar(256) NOT NULL,
	`followed_id` varchar(256) NOT NULL,
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `followers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `followers` ADD CONSTRAINT `followers_follower_id_user_id_fk` FOREIGN KEY (`follower_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `followers` ADD CONSTRAINT `followers_followed_id_user_id_fk` FOREIGN KEY (`followed_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;