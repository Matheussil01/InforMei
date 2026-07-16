CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20),
	`address` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('boleto','nf','recibo','outro') NOT NULL,
	`value` decimal(12,2),
	`issueDate` datetime,
	`dueDate` datetime,
	`fileUrl` text,
	`fileKey` text,
	`status` enum('pendente','pago','vencido') NOT NULL DEFAULT 'pendente',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`type` enum('boleto','saldo','faturamento','geral') NOT NULL,
	`read` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`description` text NOT NULL,
	`type` enum('ganho','despesa') NOT NULL,
	`value` decimal(12,2) NOT NULL,
	`date` datetime NOT NULL,
	`category` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `openId` varchar(64);--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `email` varchar(320) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `loginMethod` varchar(64) DEFAULT 'email';--> statement-breakpoint
ALTER TABLE `users` ADD `password` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `nomeEmpresa` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `cnpj` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_cnpj_unique` UNIQUE(`cnpj`);