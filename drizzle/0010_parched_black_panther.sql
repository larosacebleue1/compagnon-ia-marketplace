ALTER TABLE `providers` MODIFY COLUMN `provider_status` enum('pending','documents_incomplete','under_review','active','suspended','rejected') NOT NULL DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `providers` ADD `forme_juridique` varchar(50);--> statement-breakpoint
ALTER TABLE `providers` ADD `capital` decimal(12,2);--> statement-breakpoint
ALTER TABLE `providers` ADD `date_creation` date;--> statement-breakpoint
ALTER TABLE `providers` ADD `effectif` int;--> statement-breakpoint
ALTER TABLE `providers` ADD `ca_annuel` decimal(12,2);--> statement-breakpoint
ALTER TABLE `providers` ADD `numero_tva` varchar(20);--> statement-breakpoint
ALTER TABLE `providers` ADD `site_web` varchar(255);--> statement-breakpoint
ALTER TABLE `providers` ADD `annees_experience` int;--> statement-breakpoint
ALTER TABLE `providers` ADD `document_kbis` varchar(500);--> statement-breakpoint
ALTER TABLE `providers` ADD `document_assurance_decennale` varchar(500);--> statement-breakpoint
ALTER TABLE `providers` ADD `document_assurance_rc` varchar(500);--> statement-breakpoint
ALTER TABLE `providers` ADD `document_certifications` varchar(500);--> statement-breakpoint
ALTER TABLE `providers` ADD `document_urssaf` varchar(500);--> statement-breakpoint
ALTER TABLE `providers` ADD `description` text;--> statement-breakpoint
ALTER TABLE `providers` ADD `specialites` text;--> statement-breakpoint
ALTER TABLE `providers` ADD `references` text;--> statement-breakpoint
ALTER TABLE `providers` ADD `charte_signed_at` timestamp;--> statement-breakpoint
ALTER TABLE `providers` ADD `charte_ip_address` varchar(50);--> statement-breakpoint
ALTER TABLE `providers` ADD `rejection_reason` text;