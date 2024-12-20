CREATE TABLE `categories` (
	`id` integer PRIMARY KEY NOT NULL,
	`type` text
);
--> statement-breakpoint
CREATE INDEX `categories_type_idx` ON `categories` (`type`);--> statement-breakpoint
CREATE TABLE `records` (
	`id` integer PRIMARY KEY NOT NULL,
	`type` text,
	`categoryId` integer,
	FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `records_type_idx` ON `records` (`type`);--> statement-breakpoint
DROP TABLE `expense_categories`;