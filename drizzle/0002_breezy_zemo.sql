CREATE TABLE `adPlacements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`advertiserId` int NOT NULL,
	`videoId` int NOT NULL,
	`campaignName` varchar(160) NOT NULL,
	`status` enum('draft','requested','approved','active','paused') NOT NULL DEFAULT 'draft',
	`budgetCents` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `adPlacements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `advertiserProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`companyName` varchar(160) NOT NULL,
	`websiteUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `advertiserProfiles_id` PRIMARY KEY(`id`)
);
