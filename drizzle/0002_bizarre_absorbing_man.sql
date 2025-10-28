CREATE TABLE `backup_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`timestamp` timestamp NOT NULL,
	`type` enum('hourly','daily','monthly') NOT NULL,
	`size` int NOT NULL,
	`tables` text NOT NULL,
	`status` enum('success','failed') NOT NULL,
	`error` text,
	`url` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `backup_logs_id` PRIMARY KEY(`id`)
);
