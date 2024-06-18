ALTER TABLE `models` MODIFY COLUMN `created_at` timestamp;--> statement-breakpoint
ALTER TABLE `models` MODIFY COLUMN `updated_at` timestamp;--> statement-breakpoint
ALTER TABLE `posts` MODIFY COLUMN `created_at` timestamp;--> statement-breakpoint
ALTER TABLE `posts` MODIFY COLUMN `updated_at` timestamp;--> statement-breakpoint
ALTER TABLE `likes` ADD `created_at` timestamp;--> statement-breakpoint
ALTER TABLE `likes` ADD `updated_at` timestamp;--> statement-breakpoint
ALTER TABLE `post_tags` ADD `created_at` timestamp;--> statement-breakpoint
ALTER TABLE `post_tags` ADD `updated_at` timestamp;--> statement-breakpoint
ALTER TABLE `tags` ADD `created_at` timestamp;--> statement-breakpoint
ALTER TABLE `tags` ADD `updated_at` timestamp;--> statement-breakpoint
ALTER TABLE `user` ADD `created_at` timestamp;--> statement-breakpoint
ALTER TABLE `user` ADD `updated_at` timestamp;