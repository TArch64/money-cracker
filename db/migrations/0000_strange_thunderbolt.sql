CREATE TABLE `categories`
(
  `id`   integer PRIMARY KEY NOT NULL,
  `type` text                NOT NULL,
  `name` text                NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);--> statement-breakpoint
CREATE TABLE `records`
(
  `id`         integer PRIMARY KEY                                  NOT NULL,
  `type`       text                                                 NOT NULL,
  `date`       text                                                 NOT NULL,
  `dateUnix`   integer GENERATED ALWAYS AS (UNIXEPOCH(date)) STORED NOT NULL,
  `categoryId` integer                                              NOT NULL,
  FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `records_type_idx` ON `records` (`type`);
