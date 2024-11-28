-- /*!999999\- enable the sandbox mode */
-- MariaDB dump 10.19  Distrib 10.11.8-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: irontrack
-- ------------------------------------------------------
-- Server version	10.11.8-MariaDB-0ubuntu0.24.04.1

-- /*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
-- /*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
-- /*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
-- /*!40101 SET NAMES utf8mb4 */;
-- /*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
-- /*!40103 SET TIME_ZONE='+00:00' */;
-- /*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
-- /*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
-- /*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
-- /*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET FOREIGN_KEY_CHECKS = 0;

-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
-- /*!40101 SET @saved_cs_client     = @@character_set_client */;
-- /*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User` (
                        `id` int unsigned NOT NULL AUTO_INCREMENT ,
                        `username` varchar(191) NOT NULL,
                        `password` varchar(191) NOT NULL,
                        `fullName` varchar(191) DEFAULT NULL,
                        `dateOfBirth` datetime DEFAULT NULL,
                        `sex` CHAR(1) DEFAULT NULL,
                        PRIMARY KEY (`id`),
                        UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- /*!40101 SET character_set_client = @saved_cs_client */;
-- /*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

-- /*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
-- /*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
-- /*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
-- /*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
-- /*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
-- /*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
-- /*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

--
-- Table structure for table `Training`
--

DROP TABLE IF EXISTS `Training`;
-- /*!40101 SET @saved_cs_client     = @@character_set_client */;
-- /*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Training` (
                            `id` int unsigned NOT NULL AUTO_INCREMENT,
                            `type` varchar(191) NOT NULL,
                            `wodName` varchar(191) DEFAULT NULL,
                            `wodType` varchar(191) DEFAULT NULL,
                            `date` datetime DEFAULT NULL,
                            `score` varchar(100) DEFAULT NULL,
                            `userId` int unsigned NOT NULL,
                            PRIMARY KEY (`id`),
                            KEY `userId` (`userId`),
                            CONSTRAINT `Training_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- /*!40101 SET character_set_client = @saved_cs_client */;

--


--
-- Table structure for table `Exercise`
--

DROP TABLE IF EXISTS `Exercise`;
-- /*!40101 SET @saved_cs_client     = @@character_set_client */;
-- /*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Exercise` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `exerciseData` text NOT NULL,
  `trainingId` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `trainingId` (`trainingId`),
  CONSTRAINT `Exercise_ibfk_1` FOREIGN KEY (`trainingId`) REFERENCES `Training` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- /*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Record`
--

DROP TABLE IF EXISTS `Record`;
-- /*!40101 SET @saved_cs_client     = @@character_set_client */;
-- /*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Record` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(100) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `score` varchar(100) DEFAULT NULL,
  `weight` float DEFAULT NULL,
  `time` varchar(50) DEFAULT NULL,
  `userId` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `Record_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- /*!40101 SET character_set_client = @saved_cs_client */;


SET FOREIGN_KEY_CHECKS = 1;


-- Dump completed on 2024-11-28 10:29:47
