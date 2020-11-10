CREATE DATABASE IF NOT EXISTS `mafia`;
USE `mafia`;

CREATE TABLE IF NOT EXISTS `config` (
  `pos` varchar(255) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `rank` int(255) NOT NULL DEFAULT 0,
  `punishment` varchar(50) NOT NULL DEFAULT '[]',
  `name` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `pos` varchar(255) NOT NULL DEFAULT '[-1776.0165708959103,-5.778889179229736,-3.8237279057502747]',
  `skin` int(11) NOT NULL DEFAULT 0,
  `money` int(11) NOT NULL DEFAULT 0,
  `bank` int(11) NOT NULL DEFAULT 0,
  `job` varchar(50) NOT NULL DEFAULT 'unemployed',
  `jobRank` int(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `vehicles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `plate` varchar(6) NOT NULL,
  `model` int(11) DEFAULT NULL,
  `heading` int(255) DEFAULT NULL,
  `pos` varchar(255) DEFAULT NULL,
  `owner` int(255) DEFAULT NULL,
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `vehicle_shop` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `model` int(11) NOT NULL DEFAULT 0,
  `price` int(11) NOT NULL DEFAULT 0,
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;

INSERT INTO `vehicle_shop` (`id`, `model`, `price`) VALUES
	(1, 4, 1000),
	(2, 7, 1000),
	(3, 14, 1000),
	(4, 19, 1000),
	(5, 25, 1000),
	(6, 43, 1000),
	(7, 27, 1000),
	(8, 75, 1000),
	(9, 115, 1000);
