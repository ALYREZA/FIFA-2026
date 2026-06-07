CREATE TABLE IF NOT EXISTS `podium_predictions` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
  `tournament_id` text NOT NULL REFERENCES `tournaments`(`id`) ON DELETE CASCADE,
  `first_place_team_id` text NOT NULL REFERENCES `teams`(`id`),
  `second_place_team_id` text NOT NULL REFERENCES `teams`(`id`),
  `third_place_team_id` text NOT NULL REFERENCES `teams`(`id`),
  `coins_spent` integer NOT NULL,
  `points_earned` integer DEFAULT 0,
  `locked_at` integer NOT NULL,
  `created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
  UNIQUE(`user_id`, `tournament_id`)
);

CREATE INDEX IF NOT EXISTS `podium_predictions_user_idx` ON `podium_predictions` (`user_id`);

ALTER TABLE `actual_tournament_extras` ADD COLUMN `third_place_team_id` text REFERENCES `teams`(`id`);

ALTER TABLE `user_scores` ADD COLUMN `coin_balance` integer DEFAULT 1000 NOT NULL;
ALTER TABLE `user_scores` ADD COLUMN `podium_points` integer DEFAULT 0 NOT NULL;
