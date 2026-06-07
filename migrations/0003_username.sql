-- Run with: wrangler d1 execute fifa-2026 --local --file=migrations/0003_username.sql

ALTER TABLE `user` ADD COLUMN `username` text;

CREATE UNIQUE INDEX IF NOT EXISTS `user_username_idx` ON `user` (`username`);
