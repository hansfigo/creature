ALTER TABLE `post_tags` DROP FOREIGN KEY `post_tags_user_id_user_id_fk`;
--> statement-breakpoint
ALTER TABLE `post_tags` DROP COLUMN `user_id`;