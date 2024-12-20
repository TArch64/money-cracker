PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_categories` (
	`id` integer PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_categories`("id", "type", "name") SELECT "id", "type", "name" FROM `categories`;--> statement-breakpoint
DROP TABLE `categories`;--> statement-breakpoint
ALTER TABLE `__new_categories` RENAME TO `categories`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `categories_type_idx` ON `categories` (`type`);--> statement-breakpoint
CREATE TABLE `__new_records` (
	`id` integer PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`categoryId` integer NOT NULL,
	FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
INSERT INTO `__new_records`("id", "type", "categoryId") SELECT "id", "type", "categoryId" FROM `records`;--> statement-breakpoint
DROP TABLE `records`;--> statement-breakpoint
ALTER TABLE `__new_records` RENAME TO `records`;--> statement-breakpoint
CREATE INDEX `records_type_idx` ON `records` (`type`);