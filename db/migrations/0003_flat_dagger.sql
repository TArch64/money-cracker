ALTER TABLE `users`
  ADD `reminder` text DEFAULT 'if_no_records' NOT NULL;--> statement-breakpoint
ALTER TABLE `users`
  ADD `reminder_hour` integer DEFAULT 21 NOT NULL;--> statement-breakpoint
ALTER TABLE `users`
  ADD `reminder_minute` integer DEFAULT 0 NOT NULL;
