-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: irontrack
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Affiliate`
--

DROP TABLE IF EXISTS `Affiliate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Affiliate` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `trainingType` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ownerId` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ownerId` (`ownerId`),
  CONSTRAINT `Affiliate_ibfk_1` FOREIGN KEY (`ownerId`) REFERENCES `User` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Affiliate`
--

LOCK TABLES `Affiliate` WRITE;
/*!40000 ALTER TABLE `Affiliate` DISABLE KEYS */;
INSERT INTO `Affiliate` VALUES (1,'CrossFit Box','123 Fitness St.','CrossFit',1),(2,'Yoga Center','456 Relax Ave.','Yoga',2);
/*!40000 ALTER TABLE `Affiliate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AffiliateTrainer`
--

DROP TABLE IF EXISTS `AffiliateTrainer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AffiliateTrainer` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `affiliateId` int unsigned NOT NULL,
  `trainerId` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `affiliateId` (`affiliateId`,`trainerId`),
  KEY `trainerId` (`trainerId`),
  CONSTRAINT `AffiliateTrainer_ibfk_1` FOREIGN KEY (`affiliateId`) REFERENCES `Affiliate` (`id`) ON DELETE CASCADE,
  CONSTRAINT `AffiliateTrainer_ibfk_2` FOREIGN KEY (`trainerId`) REFERENCES `User` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AffiliateTrainer`
--

LOCK TABLES `AffiliateTrainer` WRITE;
/*!40000 ALTER TABLE `AffiliateTrainer` DISABLE KEYS */;
INSERT INTO `AffiliateTrainer` VALUES (3,1,1),(4,2,2);
/*!40000 ALTER TABLE `AffiliateTrainer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ClassAttendee`
--

DROP TABLE IF EXISTS `ClassAttendee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ClassAttendee` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `classId` int unsigned NOT NULL,
  `userId` int unsigned NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `classId` (`classId`,`userId`),
  KEY `userId` (`userId`),
  CONSTRAINT `ClassAttendee_ibfk_1` FOREIGN KEY (`classId`) REFERENCES `ClassSchedule` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ClassAttendee_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ClassAttendee`
--

LOCK TABLES `ClassAttendee` WRITE;
/*!40000 ALTER TABLE `ClassAttendee` DISABLE KEYS */;
INSERT INTO `ClassAttendee` VALUES (1,1,2,'2024-12-18 19:07:32'),(2,2,1,'2024-12-18 19:07:32');
/*!40000 ALTER TABLE `ClassAttendee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ClassSchedule`
--

DROP TABLE IF EXISTS `ClassSchedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ClassSchedule` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `trainingName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `time` datetime NOT NULL,
  `trainer` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `memberCapacity` int NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `repeatWeekly` tinyint(1) DEFAULT '0',
  `ownerId` int unsigned NOT NULL,
  `seriesId` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ownerId` (`ownerId`),
  CONSTRAINT `ClassSchedule_ibfk_1` FOREIGN KEY (`ownerId`) REFERENCES `User` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ClassSchedule`
--

LOCK TABLES `ClassSchedule` WRITE;
/*!40000 ALTER TABLE `ClassSchedule` DISABLE KEYS */;
INSERT INTO `ClassSchedule` VALUES (1,'Morning Yoga','2023-12-18 08:00:00','Alice',20,'Main Studio',1,1,NULL),(2,'Evening Crossfit','2023-12-18 18:00:00','Bob',15,'Gym A',0,2,NULL);
/*!40000 ALTER TABLE `ClassSchedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Exercise`
--

DROP TABLE IF EXISTS `Exercise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Exercise` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `exerciseData` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `trainingId` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `trainingId` (`trainingId`),
  CONSTRAINT `Exercise_ibfk_1` FOREIGN KEY (`trainingId`) REFERENCES `Training` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Exercise`
--

LOCK TABLES `Exercise` WRITE;
/*!40000 ALTER TABLE `Exercise` DISABLE KEYS */;
INSERT INTO `Exercise` VALUES (1,'Deadlift: 200kg',1),(2,'Run: 5km',2);
/*!40000 ALTER TABLE `Exercise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Plan`
--

DROP TABLE IF EXISTS `Plan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Plan` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `validityDays` int NOT NULL,
  `price` float NOT NULL,
  `additionalData` text COLLATE utf8mb4_unicode_ci,
  `ownerId` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ownerId` (`ownerId`),
  CONSTRAINT `Plan_ibfk_1` FOREIGN KEY (`ownerId`) REFERENCES `User` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Plan`
--

LOCK TABLES `Plan` WRITE;
/*!40000 ALTER TABLE `Plan` DISABLE KEYS */;
/*!40000 ALTER TABLE `Plan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Record`
--

DROP TABLE IF EXISTS `Record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Record` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `score` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `weight` float DEFAULT NULL,
  `time` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userId` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `Record_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Record`
--

LOCK TABLES `Record` WRITE;
/*!40000 ALTER TABLE `Record` DISABLE KEYS */;
INSERT INTO `Record` VALUES (1,'Weightlifting','Deadlift','2023-12-01 00:00:00','200kg',200,NULL,1),(2,'Running','5k Run','2023-12-02 00:00:00','25:30',NULL,'25:30',2),(3,'snatch','Deadlift','2023-12-01 00:00:00','100kg',200,NULL,1),(4,'Running','3k Run','2023-12-02 00:00:00','15:00',NULL,'15:30',2),(5,'Running','2k Run','2023-12-02 00:00:00','10:00',NULL,'10:00',1),(6,'Running','3k Run','2023-12-02 00:00:00','05:00',NULL,'05:00',2);
/*!40000 ALTER TABLE `Record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Training`
--

DROP TABLE IF EXISTS `Training`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Training` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `wodName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wodType` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `score` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userId` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `Training_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Training`
--

LOCK TABLES `Training` WRITE;
/*!40000 ALTER TABLE `Training` DISABLE KEYS */;
INSERT INTO `Training` VALUES (1,'Strength','Deadlift Max','For Time','2023-12-01 00:00:00','200kg',1),(2,'Cardio','5k Run','AMRAP','2023-12-02 00:00:00','25:30',2);
/*!40000 ALTER TABLE `Training` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fullName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dateOfBirth` datetime DEFAULT NULL,
  `sex` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isAffiliateOwner` tinyint(1) DEFAULT NULL,
  `monthlyGoal` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'Mari','password123','Mari Maasikas','1990-01-01 00:00:00','Woman','john@example.com',1,5),(2,'mati','securepass','Mati Tuli','1985-06-15 00:00:00','Man','jane@example.com',0,8);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `defaultWOD`
--

DROP TABLE IF EXISTS `defaultWOD`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `defaultWOD` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `defaultWOD`
--

LOCK TABLES `defaultWOD` WRITE;
/*!40000 ALTER TABLE `defaultWOD` DISABLE KEYS */;
/*!40000 ALTER TABLE `defaultWOD` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-18 21:19:52
