CREATE TABLE `channelFollows` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`channelId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `channelFollows_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `channels` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`handle` varchar(64) NOT NULL,
	`displayName` varchar(120) NOT NULL,
	`bio` text,
	`avatarUrl` text,
	`bannerUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `channels_id` PRIMARY KEY(`id`),
	CONSTRAINT `channels_handle_unique` UNIQUE(`handle`)
);
--> statement-breakpoint
CREATE TABLE `creatorEarnings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`channelId` int NOT NULL,
	`eligibleRevenueCents` int NOT NULL DEFAULT 0,
	`creatorShareBps` int NOT NULL DEFAULT 6500,
	`creatorAmountCents` int NOT NULL DEFAULT 0,
	`periodStart` timestamp NOT NULL,
	`periodEnd` timestamp NOT NULL,
	`status` enum('estimated','finalized','paid') NOT NULL DEFAULT 'estimated',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `creatorEarnings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `videos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`channelId` int NOT NULL,
	`title` varchar(180) NOT NULL,
	`description` text,
	`thumbnailUrl` text,
	`playbackUrl` text,
	`visibility` enum('draft','unlisted','public') NOT NULL DEFAULT 'draft',
	`durationSeconds` int,
	`viewCount` int NOT NULL DEFAULT 0,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `videos_id` PRIMARY KEY(`id`)
);
