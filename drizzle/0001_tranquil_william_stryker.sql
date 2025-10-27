CREATE TABLE `actions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`conversationId` int,
	`actionType` enum('invoice','order','email','search','document','other') NOT NULL,
	`status` enum('pending','approved','completed','failed','cancelled') NOT NULL DEFAULT 'pending',
	`inputData` text,
	`outputData` text,
	`requiresApproval` boolean NOT NULL DEFAULT true,
	`approvedAt` timestamp,
	`executedAt` timestamp,
	`error` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `actions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255),
	`profession` varchar(100),
	`currentTask` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversationId` int NOT NULL,
	`role` enum('user','assistant','system') NOT NULL,
	`content` text NOT NULL,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `permissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`permissionType` enum('email','documents','pc_control','devices','purchases') NOT NULL,
	`enabled` boolean NOT NULL DEFAULT false,
	`scope` text,
	`grantedAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	CONSTRAINT `permissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `professionProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`category` varchar(100),
	`knowledgeBase` text,
	`vocabulary` text,
	`commonTasks` text,
	`integrations` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `professionProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `professionProfiles_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `profession` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `professionDetected` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionTier` enum('basic','premium','enterprise') DEFAULT 'basic' NOT NULL;