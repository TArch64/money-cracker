CREATE TABLE `budget_categories`
(
  `budgetId`   integer NOT NULL,
  `categoryId` integer NOT NULL,
  `goal`       integer NOT NULL,
  PRIMARY KEY (`budgetId`, `categoryId`),
  FOREIGN KEY (`budgetId`) REFERENCES `budgets` (`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `budgets`
(
  `id`    integer PRIMARY KEY NOT NULL,
  `year`  integer             NOT NULL,
  `month` integer             NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `budgets_year_month_uniq` ON `budgets` (`year`, `month`);--> statement-breakpoint
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
  `value`      integer                                              NOT NULL,
  `date`       text                                                 NOT NULL,
  `dateUnix`   integer GENERATED ALWAYS AS (UNIXEPOCH(date)) STORED NOT NULL,
  `categoryId` integer                                              NOT NULL,
  FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `records_type_idx` ON `records` (`type`);
