CREATE TABLE `rules` (
	`req_host` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`dest_host` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`dest_port` SMALLINT(5) UNSIGNED NULL DEFAULT NULL,
	`cache_time` MEDIUMINT(9) UNSIGNED NOT NULL DEFAULT '0',
	`action` TINYINT(4) UNSIGNED NOT NULL,
	`logging` BIT(1) NOT NULL DEFAULT b'0',
	PRIMARY KEY (`req_host`) USING BTREE
)
COLLATE='utf8mb4_general_ci';


CREATE TABLE `logs` (
	`req_host` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`ip_type` TINYINT(1) UNSIGNED NULL DEFAULT NULL,
	`ip` VARCHAR(39) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`timestamp` TIMESTAMP NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
	INDEX `req_host` (`req_host`) USING BTREE,
	CONSTRAINT `logs.req_host` FOREIGN KEY (`req_host`) REFERENCES `rules` (`req_host`) ON UPDATE CASCADE ON DELETE CASCADE
)
COLLATE='utf8mb4_general_ci';


CREATE TABLE `blacklist` (
	`req_host` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`ip` VARCHAR(39) NOT NULL COLLATE 'utf8mb4_general_ci',
	INDEX `req_host` (`req_host`) USING BTREE,
	CONSTRAINT `blacklist.req_host` FOREIGN KEY (`req_host`) REFERENCES `rules` (`req_host`) ON UPDATE CASCADE ON DELETE CASCADE
)
COLLATE='utf8mb4_general_ci';
