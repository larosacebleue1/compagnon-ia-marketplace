ALTER TABLE `leads` MODIFY COLUMN `status` enum('pending','available','reserved','contacted','quote_sent','quote_signed_standard','quote_signed_express','cooling_off','retracted','confirmed','accepted','paid','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `leads` ADD `chosen_path` enum('standard','express') DEFAULT 'standard';--> statement-breakpoint
ALTER TABLE `leads` ADD `deposit_amount` decimal(10,2);--> statement-breakpoint
ALTER TABLE `leads` ADD `deposit_paid` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `leads` ADD `deposit_paid_at` timestamp;--> statement-breakpoint
ALTER TABLE `leads` ADD `deposit_payment_intent_id` varchar(255);--> statement-breakpoint
ALTER TABLE `leads` ADD `waiver_signed` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `leads` ADD `waiver_signed_at` timestamp;--> statement-breakpoint
ALTER TABLE `leads` ADD `cooling_off_ends_at` timestamp;