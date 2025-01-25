CREATE TABLE `users`
(
  `id`    integer PRIMARY KEY                            DEFAULT 1         NOT NULL,
  `intro` TEXT CHECK (intro IN ('pending', 'completed')) DEFAULT 'pending' NOT NULL
);
