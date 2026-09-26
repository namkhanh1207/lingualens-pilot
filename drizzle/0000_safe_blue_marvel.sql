CREATE TABLE `comments` (
	`id` text PRIMARY KEY NOT NULL,
	`post` text NOT NULL,
	`owner` text NOT NULL,
	`name` text NOT NULL,
	`body` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_comments_post` ON `comments` (`post`);--> statement-breakpoint
CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`session` text NOT NULL,
	`type` text NOT NULL,
	`data` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_events_owner` ON `events` (`owner`);--> statement-breakpoint
CREATE INDEX `idx_events_session` ON `events` (`session`);--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`name` text NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`hidden` integer DEFAULT 0 NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `records` (
	`id` text NOT NULL,
	`owner` text NOT NULL,
	`kind` text NOT NULL,
	`data` text NOT NULL,
	`updated` text NOT NULL,
	PRIMARY KEY(`owner`, `kind`, `id`)
);
--> statement-breakpoint
CREATE INDEX `idx_records_owner_kind` ON `records` (`owner`,`kind`);--> statement-breakpoint
CREATE TABLE `usage` (
	`owner` text NOT NULL,
	`day` text NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`owner`, `day`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`cefr` text DEFAULT 'B1' NOT NULL,
	`goal` text DEFAULT 'Reading' NOT NULL,
	`research` integer DEFAULT 0 NOT NULL,
	`ai_consent` integer DEFAULT 0 NOT NULL,
	`created` text NOT NULL
);
