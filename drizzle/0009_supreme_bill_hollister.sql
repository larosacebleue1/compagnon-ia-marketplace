ALTER TABLE `leads` ADD `access_token` varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE `leads` ADD CONSTRAINT `leads_access_token_unique` UNIQUE(`access_token`);