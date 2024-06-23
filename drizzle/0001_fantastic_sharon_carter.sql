ALTER TABLE `likes` DROP FOREIGN KEY `likes_user_fk`; 

ALTER TABLE `likes` DROP INDEX `likes_user_id_unique`;

ALTER TABLE `likes` ADD CONSTRAINT `likes_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
