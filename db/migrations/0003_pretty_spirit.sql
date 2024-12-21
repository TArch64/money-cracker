DROP INDEX ` categories_type_idx `;--> statement-breakpoint
CREATE UNIQUE INDEX ` categories_name_unique ` ON ` categories ` (` name `);
