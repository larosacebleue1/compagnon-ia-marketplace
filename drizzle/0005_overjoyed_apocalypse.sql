CREATE TABLE `beta_activity` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`activity_type` varchar(100) NOT NULL,
	`details` text,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `beta_activity_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `beta_feedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`type` enum('bug','suggestion','praise','question') NOT NULL,
	`message` text NOT NULL,
	`screenshot` text,
	`url` varchar(500),
	`user_agent` text,
	`viewport` varchar(50),
	`session_id` varchar(100),
	`status` enum('new','in_progress','resolved','closed') NOT NULL DEFAULT 'new',
	`resolved_at` timestamp,
	`resolved_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `beta_feedback_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `beta_invitations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`invite_code` varchar(32) NOT NULL,
	`invited_by` varchar(255),
	`status` enum('pending','accepted','revoked') NOT NULL DEFAULT 'pending',
	`tier` enum('alpha','beta','early_access') NOT NULL DEFAULT 'beta',
	`source` varchar(50),
	`notes` text,
	`can_invite_others` boolean NOT NULL DEFAULT false,
	`max_invites` int NOT NULL DEFAULT 0,
	`invites_used` int NOT NULL DEFAULT 0,
	`first_login_at` timestamp,
	`last_active_at` timestamp,
	`sessions_count` int NOT NULL DEFAULT 0,
	`feedback_submitted` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`accepted_at` timestamp,
	`expires_at` timestamp,
	CONSTRAINT `beta_invitations_id` PRIMARY KEY(`id`),
	CONSTRAINT `beta_invitations_email_unique` UNIQUE(`email`),
	CONSTRAINT `beta_invitations_invite_code_unique` UNIQUE(`invite_code`)
);
--> statement-breakpoint
CREATE TABLE `beta_rewards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`total_points` int NOT NULL DEFAULT 0,
	`badges` text,
	`rewards_claimed` text,
	`referral_count` int NOT NULL DEFAULT 0,
	`active_referrals` int NOT NULL DEFAULT 0,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `beta_rewards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_permissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`permission_key` varchar(100) NOT NULL,
	`granted_at` timestamp NOT NULL DEFAULT (now()),
	`granted_by` varchar(255),
	`expires_at` timestamp,
	CONSTRAINT `user_permissions_id` PRIMARY KEY(`id`)
);
