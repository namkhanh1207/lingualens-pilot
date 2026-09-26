CREATE TABLE `content_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `learning_history` (
	`sequence` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner` text NOT NULL,
	`request` text NOT NULL,
	`session` text NOT NULL,
	`operation` text NOT NULL,
	`question` text NOT NULL,
	`input` text NOT NULL,
	`data` text NOT NULL,
	`response` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `history_owner_session` ON `learning_history` (`owner`,`session`);--> statement-breakpoint
CREATE TABLE `research_identities` (
	`owner` text PRIMARY KEY NOT NULL,
	`participant` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `research_identities_participant_unique` ON `research_identities` (`participant`);--> statement-breakpoint
CREATE TABLE `research_revision` (
	`id` integer PRIMARY KEY NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL
);
