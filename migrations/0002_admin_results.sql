CREATE TABLE IF NOT EXISTS `actual_group_standings` (
  `id` text PRIMARY KEY NOT NULL,
  `tournament_id` text NOT NULL REFERENCES `tournaments`(`id`) ON DELETE CASCADE,
  `group_id` text NOT NULL,
  `team_id` text NOT NULL REFERENCES `teams`(`id`) ON DELETE CASCADE,
  `actual_position` integer NOT NULL,
  `updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
  UNIQUE(`tournament_id`, `group_id`, `team_id`)
);

CREATE TABLE IF NOT EXISTS `actual_tournament_extras` (
  `id` text PRIMARY KEY NOT NULL,
  `tournament_id` text NOT NULL UNIQUE REFERENCES `tournaments`(`id`) ON DELETE CASCADE,
  `champion_team_id` text REFERENCES `teams`(`id`),
  `runner_up_team_id` text REFERENCES `teams`(`id`),
  `top_scorer_name` text,
  `dark_horse_team_id` text REFERENCES `teams`(`id`),
  `updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
