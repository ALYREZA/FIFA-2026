-- Run with: wrangler d1 execute fifa-2026 --local --file=migrations/0001_initial.sql

CREATE TABLE IF NOT EXISTS `user` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `email` text NOT NULL UNIQUE,
  `email_verified` integer DEFAULT false NOT NULL,
  `image` text,
  `created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
  `updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
  `phone_number` text UNIQUE,
  `phone_number_verified` integer
);

CREATE TABLE IF NOT EXISTS `session` (
  `id` text PRIMARY KEY NOT NULL,
  `expires_at` integer NOT NULL,
  `token` text NOT NULL UNIQUE,
  `created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
  `updated_at` integer NOT NULL,
  `ip_address` text,
  `user_agent` text,
  `user_id` text NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS `session_userId_idx` ON `session` (`user_id`);

CREATE TABLE IF NOT EXISTS `account` (
  `id` text PRIMARY KEY NOT NULL,
  `account_id` text NOT NULL,
  `provider_id` text NOT NULL,
  `user_id` text NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
  `access_token` text,
  `refresh_token` text,
  `id_token` text,
  `access_token_expires_at` integer,
  `refresh_token_expires_at` integer,
  `scope` text,
  `password` text,
  `created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
  `updated_at` integer NOT NULL
);

CREATE INDEX IF NOT EXISTS `account_userId_idx` ON `account` (`user_id`);

CREATE TABLE IF NOT EXISTS `verification` (
  `id` text PRIMARY KEY NOT NULL,
  `identifier` text NOT NULL,
  `value` text NOT NULL,
  `expires_at` integer NOT NULL,
  `created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
  `updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);

CREATE INDEX IF NOT EXISTS `verification_identifier_idx` ON `verification` (`identifier`);

CREATE TABLE IF NOT EXISTS `tournaments` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `slug` text NOT NULL UNIQUE,
  `starts_at` integer NOT NULL,
  `lock_minutes_before_kickoff` integer DEFAULT 15 NOT NULL,
  `extras_locked_at` integer,
  `scoring_rules` text NOT NULL,
  `created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);

CREATE TABLE IF NOT EXISTS `teams` (
  `id` text PRIMARY KEY NOT NULL,
  `tournament_id` text NOT NULL REFERENCES `tournaments`(`id`) ON DELETE CASCADE,
  `name` text NOT NULL,
  `code` text NOT NULL,
  `flag_emoji` text,
  `group_id` text
);

CREATE TABLE IF NOT EXISTS `stages` (
  `id` text PRIMARY KEY NOT NULL,
  `tournament_id` text NOT NULL REFERENCES `tournaments`(`id`) ON DELETE CASCADE,
  `type` text NOT NULL,
  `name` text NOT NULL,
  `order` integer NOT NULL,
  `unlock_after_order` integer,
  `deadline_at` integer
);

CREATE INDEX IF NOT EXISTS `stages_tournament_idx` ON `stages` (`tournament_id`);

CREATE TABLE IF NOT EXISTS `matches` (
  `id` text PRIMARY KEY NOT NULL,
  `tournament_id` text NOT NULL REFERENCES `tournaments`(`id`) ON DELETE CASCADE,
  `stage_id` text NOT NULL REFERENCES `stages`(`id`) ON DELETE CASCADE,
  `home_team_id` text REFERENCES `teams`(`id`),
  `away_team_id` text REFERENCES `teams`(`id`),
  `group_id` text,
  `kickoff_at` integer NOT NULL,
  `status` text DEFAULT 'scheduled' NOT NULL,
  `home_score` integer,
  `away_score` integer,
  `winner_team_id` text REFERENCES `teams`(`id`),
  `bracket_slot` text,
  `home_source_match_id` text,
  `away_source_match_id` text,
  `winner_advances_to_match_id` text,
  `winner_advances_as` text
);

CREATE INDEX IF NOT EXISTS `matches_tournament_idx` ON `matches` (`tournament_id`);
CREATE INDEX IF NOT EXISTS `matches_stage_idx` ON `matches` (`stage_id`);
CREATE INDEX IF NOT EXISTS `matches_kickoff_idx` ON `matches` (`kickoff_at`);

CREATE TABLE IF NOT EXISTS `match_predictions` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
  `match_id` text NOT NULL REFERENCES `matches`(`id`) ON DELETE CASCADE,
  `home_score` integer NOT NULL,
  `away_score` integer NOT NULL,
  `winner_team_id` text REFERENCES `teams`(`id`),
  `points_earned` integer DEFAULT 0,
  `score_breakdown` text,
  `locked_at` integer,
  `created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
  `updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
  UNIQUE(`user_id`, `match_id`)
);

CREATE INDEX IF NOT EXISTS `match_predictions_user_idx` ON `match_predictions` (`user_id`);

CREATE TABLE IF NOT EXISTS `group_standing_predictions` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
  `tournament_id` text NOT NULL REFERENCES `tournaments`(`id`) ON DELETE CASCADE,
  `group_id` text NOT NULL,
  `team_id` text NOT NULL REFERENCES `teams`(`id`) ON DELETE CASCADE,
  `predicted_position` integer NOT NULL,
  `points_earned` integer DEFAULT 0,
  `created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
  `updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
  UNIQUE(`user_id`, `group_id`, `team_id`)
);

CREATE INDEX IF NOT EXISTS `group_standing_user_idx` ON `group_standing_predictions` (`user_id`);

CREATE TABLE IF NOT EXISTS `tournament_extras_predictions` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
  `tournament_id` text NOT NULL REFERENCES `tournaments`(`id`) ON DELETE CASCADE,
  `champion_team_id` text REFERENCES `teams`(`id`),
  `runner_up_team_id` text REFERENCES `teams`(`id`),
  `top_scorer_name` text,
  `dark_horse_team_id` text REFERENCES `teams`(`id`),
  `points_earned` integer DEFAULT 0,
  `locked_at` integer,
  `created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
  `updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
  UNIQUE(`user_id`, `tournament_id`)
);

CREATE TABLE IF NOT EXISTS `user_scores` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
  `tournament_id` text NOT NULL REFERENCES `tournaments`(`id`) ON DELETE CASCADE,
  `total_points` integer DEFAULT 0 NOT NULL,
  `match_points` integer DEFAULT 0 NOT NULL,
  `standing_points` integer DEFAULT 0 NOT NULL,
  `extras_points` integer DEFAULT 0 NOT NULL,
  `exact_scores` integer DEFAULT 0 NOT NULL,
  `correct_results` integer DEFAULT 0 NOT NULL,
  `last_prediction_at` integer,
  `updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
  UNIQUE(`user_id`, `tournament_id`)
);
