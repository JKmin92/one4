-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: newone4
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `popup`
--

DROP TABLE IF EXISTS `popup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `popup` (
  `popup_code` varchar(50) NOT NULL,
  `title` varchar(100) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `link_url` varchar(255) DEFAULT NULL,
  `is_new_tab` tinyint(1) DEFAULT '0',
  `is_visible` tinyint(1) DEFAULT '1',
  `is_always_visible` tinyint(1) DEFAULT '1',
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `target_service` enum('ALL','SHOP','REVIEW') DEFAULT 'ALL',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`popup_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `popup`
--

LOCK TABLES `popup` WRITE;
/*!40000 ALTER TABLE `popup` DISABLE KEYS */;
INSERT INTO `popup` VALUES ('202607070553009246','test','/uploads/popup/1783403579600_957.webp',NULL,0,1,1,NULL,NULL,'ALL','2026-07-07 05:53:00');
/*!40000 ALTER TABLE `popup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `p_num` int NOT NULL AUTO_INCREMENT,
  `product_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `price` int DEFAULT NULL,
  `is_display` tinyint(1) DEFAULT '0',
  `is_sale` tinyint(1) DEFAULT '0',
  `has_options` tinyint(1) DEFAULT '0',
  `stock` int DEFAULT '0',
  `is_unlimited_stock` tinyint(1) DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`p_num`),
  KEY `product_code` (`product_code`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (4,'20260209133428398','ㅅㄷㄴㅅ','',NULL,0,0,0,0,1,'2026-02-09 13:34:28','2026-02-09 13:34:28'),(5,'20260209134040209','테스트','',NULL,0,0,1,20,1,'2026-02-09 13:40:41','2026-02-09 13:40:41'),(6,'20260209165809589','ㅅㄷㄴㅅㅁㄴㅇㅁㄴ121','<p>ㅁㄴㅇㅁㄴㅇ</p><p>ㅁㄴㅇ</p><p>ㅁㄴㅇㅁㄴㅇ</p><p>가나다라 마바사 아자차파타하</p><p>아야어여우유으이</p><p>에예애얘</p><p>asdasd</p>',10000,1,1,1,40,0,'2026-02-09 16:58:10','2026-05-06 10:05:55'),(7,'20260506111049033','다이나믹 듀오(dynamic dou) - 죽일놈','<p>너는 뛰처나간 차문을 부슬듯이 문 닫으면서</p><p>난 머리를 쳐 박고 훔숨 쉬어 핸들을 안으면서</p><p>이런 광경이 너무 익숙해 이젠</p><p>웬만한 싸움에도 상처도 잘 안나 이제</p><p>명품 쇼핑할 때 처럼 너무 깐깐히 니 기준은</p><p>한 번 화내면 뒤끝 장난 아냐</p><p>적어도 2주는 가니까</p><p>난 성격이 너무 물러서</p><p>넌 항상 말해 남자니까 뒤로 좀 물러서</p><p>부담돼 니가 내게 결혼을 보체는 것도</p><p>난 달인처럼 대화 화제를 돌리는 법도</p><p>많이 늘었어</p><p>넌 항상 추격하고 나는 도망쳐</p><p>솔직히 말할께 난 아직 준비안됐어</p><p>지쳤어 조금 널 향한 사랑은 도금이</p><p>벗겨진 반지처럼 빛이 바랬어</p><p>오늘은 이별을 말해야 될 것 같아</p><p>지겹거든 너랑 다툴 때마다 항상 하는말</p><p></p><p>내가 죽일놈이지 뭐</p><p>우리가 어긋날 때면</p>',12000,1,1,0,0,1,'2026-05-06 11:10:50','2026-05-12 11:16:28');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_category`
--

DROP TABLE IF EXISTS `product_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_category` (
  `c_num` int NOT NULL AUTO_INCREMENT,
  `category_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0' COMMENT '카테고리 고유 ID',
  `parent_code` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '상위 카테고리 ID (최상위인 경우 NULL)',
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL COMMENT '카테고리명',
  `is_visible` tinyint(1) DEFAULT '1' COMMENT '노출 여부',
  `sort_order` int DEFAULT '0' COMMENT '정렬 순서',
  `image_pc` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'PC용 이미지 URL',
  `image_tablet` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '태블릿용 이미지 URL',
  `image_mobile` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '모바일용 이미지 URL',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`c_num`) USING BTREE,
  KEY `id` (`category_code`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_category`
--

LOCK TABLES `product_category` WRITE;
/*!40000 ALTER TABLE `product_category` DISABLE KEYS */;
INSERT INTO `product_category` VALUES (1,'260204171512',NULL,'test',1,2,NULL,NULL,NULL,'2026-02-04 08:15:12','2026-05-12 04:33:22'),(5,'260204173548',NULL,'test2',0,4,NULL,NULL,NULL,'2026-02-04 08:35:48','2026-02-04 08:53:50'),(6,'260204174620',NULL,'새 카테고리',0,3,NULL,NULL,NULL,'2026-02-04 08:46:20','2026-05-12 04:33:22'),(7,'260204174709','260204171512','새 카테고리1',1,1,NULL,NULL,NULL,'2026-02-04 08:47:09','2026-05-12 04:34:16'),(8,'260204174829',NULL,'123123',1,5,NULL,NULL,NULL,'2026-02-04 08:48:29','2026-02-04 08:53:52'),(16,'260512125627','260204174829','새 카테고리',1,1,NULL,NULL,NULL,'2026-05-12 03:56:27','2026-05-12 03:59:22'),(17,'260512133407','260204171512','새 카테고리2',1,2,NULL,NULL,NULL,'2026-05-12 04:34:07','2026-05-12 04:34:13');
/*!40000 ALTER TABLE `product_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_category_connect`
--

DROP TABLE IF EXISTS `product_category_connect`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_category_connect` (
  `pcn_num` int NOT NULL AUTO_INCREMENT,
  `product_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `category_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`pcn_num`),
  KEY `FK_product_category_connect_product` (`product_code`),
  KEY `FK_product_category_connect_product_category` (`category_code`),
  CONSTRAINT `FK_product_category_connect_product` FOREIGN KEY (`product_code`) REFERENCES `product` (`product_code`),
  CONSTRAINT `FK_product_category_connect_product_category` FOREIGN KEY (`category_code`) REFERENCES `product_category` (`category_code`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='제품과 카테고리 연결';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_category_connect`
--

LOCK TABLES `product_category_connect` WRITE;
/*!40000 ALTER TABLE `product_category_connect` DISABLE KEYS */;
INSERT INTO `product_category_connect` VALUES (1,'20260209133428398','260204171512'),(2,'20260209134040209','260204171512'),(16,'20260209165809589','260204171512'),(19,'20260506111049033','260204171512');
/*!40000 ALTER TABLE `product_category_connect` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_image`
--

DROP TABLE IF EXISTS `product_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_image` (
  `i_num` int NOT NULL AUTO_INCREMENT,
  `product_code` varchar(50) COLLATE utf8mb4_general_ci DEFAULT '0',
  `url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT '0',
  `is_main` tinyint NOT NULL DEFAULT '0',
  `sort_order` int DEFAULT '0',
  PRIMARY KEY (`i_num`),
  KEY `FK_product_image_product` (`product_code`),
  CONSTRAINT `FK_product_image_product` FOREIGN KEY (`product_code`) REFERENCES `product` (`product_code`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_image`
--

LOCK TABLES `product_image` WRITE;
/*!40000 ALTER TABLE `product_image` DISABLE KEYS */;
INSERT INTO `product_image` VALUES (15,'20260209165809589','/uploads/2026/02/09/product/20260209165809589/1770623889549-o9z5kytsu.webp',1,NULL),(16,'20260209165809589','/uploads/2026/02/09/product/20260209165809589/1770623889702-2ahs0n5th.webp',0,1),(17,'20260209165809589','/uploads/2026/02/09/product/20260209165809589/1770623889822-p04dqrw1p.webp',0,2),(18,'20260209165809589','/uploads/2026/02/09/product/20260209165809589/1770623889952-k68ee4qzz.webp',0,3),(19,'20260506111049033','/uploads/2026/05/06/product/20260506111049033/1778033449931-glar5v2x6.webp',1,NULL);
/*!40000 ALTER TABLE `product_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_inquiry`
--

DROP TABLE IF EXISTS `product_inquiry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_inquiry` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `product_inquiry_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `user_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `type` enum('PRODUCT','DELIVERY','ACC') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'PRODUCT',
  `content` text COLLATE utf8mb4_general_ci NOT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `is_secret` tinyint NOT NULL DEFAULT '0',
  `status` enum('PENDING','ANSWERED') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'PENDING',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_product_inquiry_product` (`product_code`),
  KEY `product_inquiry_code` (`product_inquiry_code`),
  CONSTRAINT `FK_product_inquiry_product` FOREIGN KEY (`product_code`) REFERENCES `product` (`product_code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_inquiry`
--

LOCK TABLES `product_inquiry` WRITE;
/*!40000 ALTER TABLE `product_inquiry` DISABLE KEYS */;
INSERT INTO `product_inquiry` VALUES (3,'20260209165809589','202603061210549377','jeo7334Wt202601','ACC','<p>ㅁㄴㅇㄻㄴㄹㅇ</p><p>ㅁㄴㅇㄹ</p><p>ㅁㄴㄴㅇㄹ</p><p>ㅁㄴㅇㄹ</p><p>ㅁㄴㅇㄹ</p><p>ㅁㄴㅇㄻㄴㅇ</p>',NULL,0,'PENDING','2026-03-06 12:10:54','2026-03-06 12:10:54');
/*!40000 ALTER TABLE `product_inquiry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_inquiry_answer`
--

DROP TABLE IF EXISTS `product_inquiry_answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_inquiry_answer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `answer_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `product_inquiry_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `answer` text COLLATE utf8mb4_general_ci NOT NULL,
  `user_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_product_inquiry_answer_product_inquiry` (`product_inquiry_code`),
  CONSTRAINT `FK_product_inquiry_answer_product_inquiry` FOREIGN KEY (`product_inquiry_code`) REFERENCES `product_inquiry` (`product_inquiry_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_inquiry_answer`
--

LOCK TABLES `product_inquiry_answer` WRITE;
/*!40000 ALTER TABLE `product_inquiry_answer` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_inquiry_answer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_option`
--

DROP TABLE IF EXISTS `product_option`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_option` (
  `option_num` int NOT NULL AUTO_INCREMENT,
  `product_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `product_option_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `value` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `stock` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`option_num`),
  KEY `FK_product_option_product` (`product_code`),
  KEY `product_option_code` (`product_option_code`),
  CONSTRAINT `FK_product_option_product` FOREIGN KEY (`product_code`) REFERENCES `product` (`product_code`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_option`
--

LOCK TABLES `product_option` WRITE;
/*!40000 ALTER TABLE `product_option` DISABLE KEYS */;
INSERT INTO `product_option` VALUES (9,'20260209165809589','opt20260209165809589','컬러','블루','10'),(10,'20260209165809589','opt20260209165809015','컬러','레드','10'),(11,'20260209165809589','opt20260209165809142','컬러','블랙','10'),(12,'20260209165809589','opt20260209165809180','컬러','퍼플','10');
/*!40000 ALTER TABLE `product_option` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_order`
--

DROP TABLE IF EXISTS `product_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `user_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `total_product_price` double NOT NULL DEFAULT '0' COMMENT '제품 금액 총합(할인 적용 후)',
  `delivery_price` double NOT NULL DEFAULT '0' COMMENT '배송비',
  `used_mileage` double NOT NULL DEFAULT '0' COMMENT '마일리지 사용',
  `actual_payment_amount` double NOT NULL DEFAULT '0' COMMENT '실제 결제 비용',
  `status` enum('PENDING','PAID','PROCESSING','SHIPPING','DELIVERED','COMPLETED','CANCEL','CLAIM') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'PENDING',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `paided_at` timestamp NULL DEFAULT NULL,
  `processed_at` timestamp NULL DEFAULT NULL,
  `shipped_at` timestamp NULL DEFAULT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `canceled_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_code` (`order_code`),
  KEY `FK_product_order_user` (`user_code`),
  CONSTRAINT `FK_product_order_user` FOREIGN KEY (`user_code`) REFERENCES `user` (`user_code`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_order`
--

LOCK TABLES `product_order` WRITE;
/*!40000 ALTER TABLE `product_order` DISABLE KEYS */;
INSERT INTO `product_order` VALUES (7,'202605151407488202','jeo7334Wt202601',75000,0,0,75000,'COMPLETED','2026-05-15 05:07:48','2026-06-17 05:22:52','2026-06-17 05:22:52',NULL,'2026-06-17 05:22:52','2026-06-25 03:06:21','2026-06-17 05:22:52'),(8,'202605180929164816','jeo7334Wt202601',9000,3500,0,12500,'DELIVERED','2026-05-18 00:29:16','2026-06-17 05:22:52','2026-07-01 01:29:55','2026-07-01 01:30:00','2026-07-07 01:58:41','2026-06-17 05:22:52','2026-06-17 05:22:52'),(9,'202605181007243694','jeo7334Wt202601',75000,0,0,75000,'CLAIM','2026-05-18 01:07:24','2026-06-17 05:22:52','2026-06-17 05:22:52',NULL,'2026-06-17 05:22:52','2026-06-17 05:22:52','2026-06-17 05:22:52'),(13,'202606151054113857','jeo7507NL202606',12000,3500,0,15500,'CANCEL','2026-06-15 01:54:11','2026-06-17 05:22:52','2026-06-17 05:22:52',NULL,'2026-06-17 05:22:52','2026-06-17 05:22:52','2026-06-19 03:00:16'),(14,'202606301459181273','jeo7507NL202606',10000,3500,0,13500,'DELIVERED','2026-06-30 05:59:18','2026-06-30 06:23:11','2026-07-01 01:29:55','2026-07-01 01:30:00','2026-07-07 01:58:41',NULL,NULL);
/*!40000 ALTER TABLE `product_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_order_address`
--

DROP TABLE IF EXISTS `product_order_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_order_address` (
  `order_address_code` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `order_code` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postcode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `detailAddress` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`order_address_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_order_address`
--

LOCK TABLES `product_order_address` WRITE;
/*!40000 ALTER TABLE `product_order_address` DISABLE KEYS */;
INSERT INTO `product_order_address` VALUES ('202606301440411210','202605180929164816','민정기','21069','인천 계양구 오조산로57번길 15(계산동, 명동빌딩)','721호','010-6551-3317'),('202606301440411346','202605181007243694','민정기','21069','인천 계양구 오조산로57번길 15(계산동, 명동빌딩)','721호','010-6551-3317'),('202606301440416362','202605151407488202','민정기','21069','인천 계양구 오조산로57번길 15(계산동, 명동빌딩)','721호','010-6551-3317'),('202606301440418215','202606151054113857','민정기','21035','인천 계양구 장제로 878(병방동, 학마을서해.영남아파트)','111-1102','010-6551-3317'),('202606301459181268','202606301459181273','민정기','21069','인천 계양구 오조산로57번길 15 (계산동)','721호','010-6551-3317');
/*!40000 ALTER TABLE `product_order_address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_order_basket`
--

DROP TABLE IF EXISTS `product_order_basket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_order_basket` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_basket_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `user_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `product_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `product_option_code` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `quantity` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_basket_code` (`order_basket_code`),
  KEY `FK_product_order_basket_user` (`user_code`),
  KEY `FK_product_order_basket_product` (`product_code`),
  KEY `FK_product_order_basket_product_option` (`product_option_code`),
  CONSTRAINT `FK_product_order_basket_product` FOREIGN KEY (`product_code`) REFERENCES `product` (`product_code`),
  CONSTRAINT `FK_product_order_basket_product_option` FOREIGN KEY (`product_option_code`) REFERENCES `product_option` (`product_option_code`),
  CONSTRAINT `FK_product_order_basket_user` FOREIGN KEY (`user_code`) REFERENCES `user` (`user_code`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_order_basket`
--

LOCK TABLES `product_order_basket` WRITE;
/*!40000 ALTER TABLE `product_order_basket` DISABLE KEYS */;
INSERT INTO `product_order_basket` VALUES (4,'202605081337218659','jeo7334Wt202601','20260209165809589','opt20260209165809589',5,'2026-05-08 04:37:21','2026-05-11 02:18:08'),(10,'202605081512545832','jeo7334Wt202601','20260506111049033',NULL,1,'2026-05-08 06:12:54','2026-05-08 06:12:54'),(11,'202605111650532077','jeo7334Wt202601','20260209165809589','opt20260209165809142',1,'2026-05-11 07:50:53','2026-05-11 07:50:53'),(12,'202605121117118678','jeo7334Wt202601','20260209165809589','opt20260209165809180',1,'2026-05-12 02:17:11','2026-05-12 02:17:11'),(18,'202606251454361994','jeo7507NL202606','20260506111049033',NULL,2,'2026-06-25 05:54:36','2026-06-26 04:37:18');
/*!40000 ALTER TABLE `product_order_basket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_order_claim`
--

DROP TABLE IF EXISTS `product_order_claim`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_order_claim` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_claim_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `order_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `user_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `claim_type` enum('CANCEL','RETURN','EXCHANGE','REFUND') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'CANCEL',
  `claim_status` enum('REQUESTED','PROCESSING','COMPLETED','REJECTED') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'REQUESTED',
  `detail_status` enum('RETURN_REQUEST','RETURN_SHIPPING','RETURN_RECEIVED','RETURN_HOLD','RESEND_HOLD','RESEND_SHIPPING','RESEND_COMPLETED','REFUND') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fault_party` enum('BUYER','SELLER') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'SELLER',
  `reason_category` enum('MIND','DEFECTIVE','WRONG','OPTION','DELAYED','OUT','OTHER') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'MIND' COMMENT 'mind-단순변심, defective-상품불량, wrong-주문상품과다름, option-옵션변경, delayed-배송지연, other-기타',
  `reason_detail` text COLLATE utf8mb4_general_ci NOT NULL,
  `total_product_amount` double NOT NULL DEFAULT '0',
  `deducted_delivery_fee` double NOT NULL DEFAULT '0',
  `refund_charge_amount` double NOT NULL DEFAULT '0',
  `total_refund_amount` double NOT NULL DEFAULT '0',
  `refund_method` enum('BANK','PG','KAKAO','NAVER','MILEAGE') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `refund_mileage` double NOT NULL DEFAULT '0',
  `refund_cash` double NOT NULL DEFAULT '0',
  `refund_bank` varchar(50) COLLATE utf8mb4_general_ci DEFAULT '0',
  `refund_account_number` varchar(50) COLLATE utf8mb4_general_ci DEFAULT '0',
  `refund_account_holder` varchar(50) COLLATE utf8mb4_general_ci DEFAULT '0',
  `return_tracking_number` varchar(100) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0' COMMENT '구매자에게로부터 교환, 반품으로 판매자에게 돌아오는 송장번호',
  `return_tacking_company` varchar(100) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0' COMMENT '구매자에게로부터 교환, 반품으로 판매자에게 돌아오는 택배사',
  `exchange_tracking_number` varchar(100) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0' COMMENT '판매자가 구매자에게 클래임으로 인해 재발송한 송장번호',
  `exchange_tacking_company` varchar(100) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0' COMMENT '판매자가 구매자에게 클래임으로 인해 재발송한 택배사',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `processed_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `rejected_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_claim_code` (`order_claim_code`),
  KEY `FK_product_order_claim_product_order` (`order_code`),
  KEY `FK_product_order_claim_user` (`user_code`),
  CONSTRAINT `FK_product_order_claim_product_order` FOREIGN KEY (`order_code`) REFERENCES `product_order` (`order_code`),
  CONSTRAINT `FK_product_order_claim_user` FOREIGN KEY (`user_code`) REFERENCES `user` (`user_code`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_order_claim`
--

LOCK TABLES `product_order_claim` WRITE;
/*!40000 ALTER TABLE `product_order_claim` DISABLE KEYS */;
INSERT INTO `product_order_claim` VALUES (2,'202606081324462439','202605181007243694','jeo7334Wt202601','REFUND','COMPLETED','REFUND','SELLER','DEFECTIVE','이거 문제 있어요!!\n자꾸 안됨!!',27000,0,0,27000,'BANK',0,0,'카카오뱅크','123123123','민정기','0','0','0','0','2026-06-08 04:24:46','2026-06-08 08:39:20','2026-06-08 05:26:42','2026-06-08 08:39:20','2026-06-08 05:26:27');
/*!40000 ALTER TABLE `product_order_claim` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_order_claim_item`
--

DROP TABLE IF EXISTS `product_order_claim_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_order_claim_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_claim_item_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `order_claim_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `order_item_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `delivery_code` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `product_amount` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_claim_item_code` (`order_claim_item_code`),
  KEY `FK_product_order_claim_item_product_order_claim` (`order_claim_code`),
  KEY `FK_product_order_claim_item_product_order_item` (`order_item_code`),
  KEY `FK_product_order_claim_item_product_order_delivery` (`delivery_code`),
  CONSTRAINT `FK_product_order_claim_item_product_order_claim` FOREIGN KEY (`order_claim_code`) REFERENCES `product_order_claim` (`order_claim_code`),
  CONSTRAINT `FK_product_order_claim_item_product_order_delivery` FOREIGN KEY (`delivery_code`) REFERENCES `product_order_delivery` (`delivery_code`),
  CONSTRAINT `FK_product_order_claim_item_product_order_item` FOREIGN KEY (`order_item_code`) REFERENCES `product_order_item` (`order_item_code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_order_claim_item`
--

LOCK TABLES `product_order_claim_item` WRITE;
/*!40000 ALTER TABLE `product_order_claim_item` DISABLE KEYS */;
INSERT INTO `product_order_claim_item` VALUES (2,'202606081324465485','202606081324462439','202605181007241781','202605191728058504',2,18000),(3,'202606081324469511','202606081324462439','202605181007243203','202605191728057591',1,9000);
/*!40000 ALTER TABLE `product_order_claim_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_order_delivery`
--

DROP TABLE IF EXISTS `product_order_delivery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_order_delivery` (
  `id` int NOT NULL AUTO_INCREMENT,
  `delivery_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `order_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `order_item_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `post_company` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `post_number` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `delivery_code` (`delivery_code`),
  KEY `FK_product_order_delivery_product_order` (`order_code`),
  KEY `FK_product_order_delivery_product_order_item` (`order_item_code`),
  CONSTRAINT `FK_product_order_delivery_product_order` FOREIGN KEY (`order_code`) REFERENCES `product_order` (`order_code`),
  CONSTRAINT `FK_product_order_delivery_product_order_item` FOREIGN KEY (`order_item_code`) REFERENCES `product_order_item` (`order_item_code`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_order_delivery`
--

LOCK TABLES `product_order_delivery` WRITE;
/*!40000 ALTER TABLE `product_order_delivery` DISABLE KEYS */;
INSERT INTO `product_order_delivery` VALUES (11,'202605191728058504','202605181007243694','202605181007241781','CJ 대한통운','132454891','2026-05-20 11:54:54'),(12,'202605191728050302','202605181007243694','202605181007245917','CJ 대한통운','132454891','2026-05-20 11:54:54'),(13,'202605191728057591','202605181007243694','202605181007243203','CJ 대한통운','132454891','2026-05-20 11:54:54'),(14,'202605191728056892','202605181007243694','202605181007244287','CJ 대한통운','132454891','2026-05-20 11:54:54'),(15,'202605191728053650','202605180929164816','202605180929167660','CJ 대한통운','153154314','2026-05-20 11:54:54'),(16,'202605211416553278','202605151407488202','202605151407483464','한진택배','12312312321312','2026-05-21 14:16:55'),(17,'202605211416558124','202605151407488202','202605151407485046','한진택배','12312312321312','2026-05-21 14:16:55'),(18,'202605211416557265','202605151407488202','202605151407485943','한진택배','12312312321312','2026-05-21 14:16:55'),(19,'202605211416550609','202605151407488202','202605151407488126','한진택배','12312312321312','2026-05-21 14:16:55'),(20,'202607011021381775','202606301459181273','202606301459182575','한진택배','1253123512','2026-07-01 10:21:38');
/*!40000 ALTER TABLE `product_order_delivery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_order_item`
--

DROP TABLE IF EXISTS `product_order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_order_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_item_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `order_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `product_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `product_option_code` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `discount_type` enum('FIXED','PERCENT') COLLATE utf8mb4_general_ci DEFAULT 'FIXED',
  `discount_value` double DEFAULT '1',
  `each_price` double NOT NULL DEFAULT '1',
  `price` double NOT NULL,
  `final_price` double NOT NULL,
  `status` enum('PENDING','PAID','PROCESSING','SHIPPING','DELIVERED','COMPLETED','CANCEL','RETURN','EXCHANGE','REFUND') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'PENDING',
  `product_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `product_option_label` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `product_option_value` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_item_code` (`order_item_code`),
  KEY `FK_product_order_item_product_order` (`order_code`),
  KEY `FK_product_order_item_product` (`product_code`),
  KEY `FK_product_order_item_product_option` (`product_option_code`),
  CONSTRAINT `FK_product_order_item_product` FOREIGN KEY (`product_code`) REFERENCES `product` (`product_code`),
  CONSTRAINT `FK_product_order_item_product_option` FOREIGN KEY (`product_option_code`) REFERENCES `product_option` (`product_option_code`),
  CONSTRAINT `FK_product_order_item_product_order` FOREIGN KEY (`order_code`) REFERENCES `product_order` (`order_code`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_order_item`
--

LOCK TABLES `product_order_item` WRITE;
/*!40000 ALTER TABLE `product_order_item` DISABLE KEYS */;
INSERT INTO `product_order_item` VALUES (25,'202605151407483464','202605151407488202','20260209165809589','opt20260209165809589',5,'FIXED',1000,9000,50000,45000,'COMPLETED','ㅅㄷㄴㅅㅁㄴㅇㅁㄴ121','컬러','블루'),(26,'202605151407485046','202605151407488202','20260506111049033',NULL,1,NULL,NULL,12000,12000,12000,'COMPLETED','다이나믹 듀오(dynamic dou) - 죽일놈','컬러',NULL),(27,'202605151407485943','202605151407488202','20260209165809589','opt20260209165809142',1,'FIXED',1000,9000,10000,9000,'COMPLETED','ㅅㄷㄴㅅㅁㄴㅇㅁㄴ121','컬러','블랙'),(28,'202605151407488126','202605151407488202','20260209165809589','opt20260209165809180',1,'FIXED',1000,9000,10000,9000,'COMPLETED','ㅅㄷㄴㅅㅁㄴㅇㅁㄴ121','컬러','퍼플'),(29,'202605180929167660','202605180929164816','20260209165809589','opt20260209165809589',1,'FIXED',1000,9000,10000,9000,'DELIVERED','ㅅㄷㄴㅅㅁㄴㅇㅁㄴ121','컬러','블루'),(30,'202605181007241781','202605181007243694','20260209165809589','opt20260209165809589',5,'FIXED',1000,9000,50000,45000,'RETURN','ㅅㄷㄴㅅㅁㄴㅇㅁㄴ121','컬러','블루'),(31,'202605181007245917','202605181007243694','20260506111049033',NULL,1,NULL,NULL,12000,12000,12000,'REFUND','다이나믹 듀오(dynamic dou) - 죽일놈','컬러',NULL),(32,'202605181007243203','202605181007243694','20260209165809589','opt20260209165809142',1,'FIXED',1000,9000,10000,9000,'RETURN','ㅅㄷㄴㅅㅁㄴㅇㅁㄴ121','컬러','블랙'),(33,'202605181007244287','202605181007243694','20260209165809589','opt20260209165809180',1,'FIXED',1000,9000,10000,9000,'COMPLETED','ㅅㄷㄴㅅㅁㄴㅇㅁㄴ121','컬러','퍼플'),(35,'202606151054114771','202606151054113857','20260506111049033',NULL,1,NULL,NULL,12000,12000,12000,'CANCEL','다이나믹 듀오(dynamic dou) - 죽일놈',NULL,NULL),(36,'202606301459182575','202606301459181273','20260209165809589','opt20260209165809015',1,NULL,NULL,10000,10000,10000,'DELIVERED','ㅅㄷㄴㅅㅁㄴㅇㅁㄴ121','컬러','레드');
/*!40000 ALTER TABLE `product_order_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_order_payment`
--

DROP TABLE IF EXISTS `product_order_payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_order_payment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `payment_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0' COMMENT 'orderId를 대체',
  `order_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `payment_type` enum('CARD','BANK','ESCROW') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'CARD',
  `deposit_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payment_deadline` datetime DEFAULT NULL,
  `paid_check_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `payment_code` (`payment_code`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_order_payment`
--

LOCK TABLES `product_order_payment` WRITE;
/*!40000 ALTER TABLE `product_order_payment` DISABLE KEYS */;
INSERT INTO `product_order_payment` VALUES (7,'202605151407481535','202605151407488202','BANK','asdf','2026-05-20 23:59:59','2026-05-21 14:06:16'),(8,'202605180929164124','202605180929164816','BANK','asdf','2026-05-23 23:59:59',NULL),(9,'202605181007249103','202605181007243694','BANK','ㅁㄴㅇㅇㅁㄴㄹ','2026-05-23 23:59:59','2026-05-26 16:44:23'),(10,'202606151054116557','202606151054113857','BANK','테스트입니다','2026-06-20 23:59:59',NULL),(11,'202606301459186873','202606301459181273','BANK','민정기','2026-07-05 23:59:59','2026-06-30 15:23:11');
/*!40000 ALTER TABLE `product_order_payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_promotion`
--

DROP TABLE IF EXISTS `product_promotion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_promotion` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '프로모션 ID',
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL COMMENT '프로모션명',
  `product_promotion_code` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '프로모션 코드',
  `discount_type` enum('percentage','fixed') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'percentage' COMMENT '할인 유형 (비율/고정금액)',
  `discount_value` decimal(10,2) NOT NULL COMMENT '할인 값 (비율 또는 금액)',
  `start_date` datetime NOT NULL COMMENT '시작 일시',
  `end_date` datetime NOT NULL COMMENT '종료 일시',
  `description` text COLLATE utf8mb4_general_ci COMMENT '프로모션 설명',
  `is_active` tinyint(1) DEFAULT '1' COMMENT '활성화 여부',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 일시',
  PRIMARY KEY (`id`),
  KEY `product_promotion_code` (`product_promotion_code`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_promotion`
--

LOCK TABLES `product_promotion` WRITE;
/*!40000 ALTER TABLE `product_promotion` DISABLE KEYS */;
INSERT INTO `product_promotion` VALUES (5,'테스트','202605111029548025','fixed',1000.00,'2026-05-11 00:00:00','2026-05-19 00:00:00','테스트',1,'2026-05-11 10:29:54','2026-05-11 10:29:54');
/*!40000 ALTER TABLE `product_promotion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_promotion_target`
--

DROP TABLE IF EXISTS `product_promotion_target`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_promotion_target` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '타겟 ID',
  `product_promotion_code` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `target_type` enum('all','category','product') COLLATE utf8mb4_general_ci NOT NULL COMMENT '타겟 유형 (전체/카테고리/상품)',
  `target_code` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '타겟 대상 ID (카테고리 ID 또는 상품 ID)',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
  PRIMARY KEY (`id`),
  KEY `FK_product_promotion_target_product_promotion` (`product_promotion_code`),
  CONSTRAINT `FK_product_promotion_target_product_promotion` FOREIGN KEY (`product_promotion_code`) REFERENCES `product_promotion` (`product_promotion_code`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_promotion_target`
--

LOCK TABLES `product_promotion_target` WRITE;
/*!40000 ALTER TABLE `product_promotion_target` DISABLE KEYS */;
INSERT INTO `product_promotion_target` VALUES (5,'202605111029548025','product','20260209165809589','2026-05-11 10:29:54'),(6,NULL,'product','20260209165809589','2026-05-11 10:48:29'),(7,NULL,'product','20260506111049033','2026-05-11 10:48:29');
/*!40000 ALTER TABLE `product_promotion_target` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_review`
--

DROP TABLE IF EXISTS `product_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_review` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `review_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `user_code` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `order_code` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rating` double NOT NULL DEFAULT '0',
  `content` text COLLATE utf8mb4_general_ci NOT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `review_code` (`review_code`),
  KEY `FK_product_review_product` (`product_code`),
  KEY `FK_product_review_user` (`user_code`),
  KEY `FK_product_review_product_order` (`order_code`),
  CONSTRAINT `FK_product_review_product` FOREIGN KEY (`product_code`) REFERENCES `product` (`product_code`),
  CONSTRAINT `FK_product_review_product_order` FOREIGN KEY (`order_code`) REFERENCES `product_order` (`order_code`),
  CONSTRAINT `FK_product_review_user` FOREIGN KEY (`user_code`) REFERENCES `user` (`user_code`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_review`
--

LOCK TABLES `product_review` WRITE;
/*!40000 ALTER TABLE `product_review` DISABLE KEYS */;
INSERT INTO `product_review` VALUES (12,'20260209165809589','202603061206361803','jeo7334Wt202601',NULL,3,'<p>ㄴㅁㄹㅇㅁㄴㅇㄻㄴㅇㄹ</p><p>ㅁㄴㅇㄻㄴㅇ</p><p>ㄻㄴㅇㄹ</p><p>ㅁㄴㅇㄹ</p><p>ㄴㅁㅇㄹ</p><p>ㅁㄴㅇㄹ</p><p>ㅁㄴㅇㄻㄴㅇ</p>',NULL,'2026-03-06 12:06:36','2026-03-06 12:06:36');
/*!40000 ALTER TABLE `product_review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `token` text COLLATE utf8mb4_general_ci NOT NULL,
  `expiresAt` datetime NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_code` (`user_code`),
  CONSTRAINT `FK_refresh_tokens_user` FOREIGN KEY (`user_code`) REFERENCES `user` (`user_code`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (4,'jeo7334Wt202601','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfY29kZSI6ImplbzczMzRXdDIwMjYwMSIsImVtYWlsIjoiamVvbmdrZXkzMzE3QG5hdmVyLmNvbSIsIm5hbWUiOiLrr7zsoJXquLAiLCJwYXNzd29yZCI6IiQyYiQxMCROcFhnMTZlMkdCVGdHRllyS1RoUHp1a1JnYXROeWVzUnFZVVROODJIVFJMNkJ4elJaLm9WcSIsIm1hcmtldGluZ0FncmVlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjpbMV19LCJwcm9maWxlIjpudWxsLCJyb2xlIjoiVVNFUiIsInN0YXR1cyI6IkFDVElWRSJ9LCJpYXQiOjE3Njk2NTk1NjIsImV4cCI6MTc3MDI2NDM2Mn0.X66tl8mDal9shwAnjwXDHq-K-c2Jqvtq4ZuVIxkVVqA','2026-02-05 13:06:02','2026-01-29 13:06:02'),(31,'jeo7334Wt202601','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfY29kZSI6ImplbzczMzRXdDIwMjYwMSIsInJvbGUiOiJVU0VSIiwicHJvZmlsZSI6bnVsbH0sImlhdCI6MTc3MjYwNjg1OSwiZXhwIjoxNzczMjExNjU5fQ.GB5v_jpXDuka80imLH-uBCRVFEz6vmn5xL6dZLVCV2E','2026-03-11 15:47:39','2026-03-04 15:47:39'),(36,'jeo7334Wt202601','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfY29kZSI6ImplbzczMzRXdDIwMjYwMSIsInJvbGUiOiJVU0VSIiwic3RhdHVzIjoiQUNUSVZFIiwicHJvZmlsZSI6bnVsbCwibmFtZSI6IuuvvOygleq4sCIsImVtYWlsIjoiamVvbmdrZXkzMzE3QG5hdmVyLmNvbSJ9LCJpYXQiOjE3NzUxODI1NzMsImV4cCI6MTc3NTc4NzM3M30.UMiGbf12FM5pQPGyHhgduI7fk4nd9NpxfauuXio8bPA','2026-04-10 11:16:13','2026-04-03 11:16:13'),(37,'jeo7334Wt202601','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfY29kZSI6ImplbzczMzRXdDIwMjYwMSIsInJvbGUiOiJVU0VSIiwic3RhdHVzIjoiQUNUSVZFIiwicHJvZmlsZSI6bnVsbCwibmFtZSI6IuuvvOygleq4sCIsImVtYWlsIjoiamVvbmdrZXkzMzE3QG5hdmVyLmNvbSJ9LCJpYXQiOjE3NzU3ODg0OTAsImV4cCI6MTc3NjM5MzI5MH0.xX2hfBKLwBSv2SzWzx7t1KHAhpsP6KLXGOIoV4fBY-M','2026-04-17 11:34:50','2026-04-10 11:34:50'),(38,'jeo7334Wt202601','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfY29kZSI6ImplbzczMzRXdDIwMjYwMSIsInJvbGUiOiJVU0VSIiwic3RhdHVzIjoiQUNUSVZFIiwicHJvZmlsZSI6bnVsbCwibmFtZSI6IuuvvOygleq4sCIsImVtYWlsIjoiamVvbmdrZXkzMzE3QG5hdmVyLmNvbSJ9LCJpYXQiOjE3NzYzOTkwOTYsImV4cCI6MTc3NzAwMzg5Nn0.OJU9HJi3dfwtDEEU5Ba57TZOnhAFJ8EDJHutK7Hlj8k','2026-04-24 13:11:36','2026-04-17 13:11:36'),(41,'jeo7334Wt202601','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2NvZGUiOiJqZW83MzM0V3QyMDI2MDEiLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdGF0dXMiOiJBQ1RJVkUiLCJwcm9maWxlIjpudWxsLCJuYW1lIjoi66-87KCV6riwIiwiZW1haWwiOiJqZW9uZ2tleTMzMTdAbmF2ZXIuY29tIiwiaWF0IjoxNzc4MDM1NTE2LCJleHAiOjE3Nzg2NDAzMTZ9.ySEO2eJBDJXoidFJ9Ud2Q892xfMXRY7lng339fbjPww','2026-05-13 11:45:16','2026-05-06 11:45:16'),(42,'jeo7334Wt202601','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2NvZGUiOiJqZW83MzM0V3QyMDI2MDEiLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdGF0dXMiOiJBQ1RJVkUiLCJwcm9maWxlIjpudWxsLCJuYW1lIjoi66-87KCV6riwIiwiZW1haWwiOiJqZW9uZ2tleTMzMTdAbmF2ZXIuY29tIiwiaWF0IjoxNzc4NjUzNDY3LCJleHAiOjE3NzkyNTgyNjd9.aKfY84EPTFGZyndA7dWqhPmiSmo8HylOehjYfuzNdK8','2026-05-20 15:24:27','2026-05-13 15:24:27'),(43,'jeo7334Wt202601','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2NvZGUiOiJqZW83MzM0V3QyMDI2MDEiLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdGF0dXMiOiJBQ1RJVkUiLCJwcm9maWxlIjpudWxsLCJuYW1lIjoi66-87KCV6riwIiwiZW1haWwiOiJqZW9uZ2tleTMzMTdAbmF2ZXIuY29tIiwiaWF0IjoxNzc5MzI1NjU0LCJleHAiOjE3Nzk5MzA0NTR9._rVkNE9HHpr5MbwmSgVKbWqba5LkrTrEn49lj2vd1n8','2026-05-28 10:07:34','2026-05-21 10:07:34'),(44,'jeo7334Wt202601','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2NvZGUiOiJqZW83MzM0V3QyMDI2MDEiLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdGF0dXMiOiJBQ1RJVkUiLCJwcm9maWxlIjpudWxsLCJuYW1lIjoi66-87KCV6riwIiwiZW1haWwiOiJqZW9uZ2tleTMzMTdAbmF2ZXIuY29tIiwiaWF0IjoxNzc5OTQ5MDM5LCJleHAiOjE3ODA1NTM4Mzl9.k3UzgxmLN3CVPN-EW5f59h5A9EpnDx26lMe8yIWYgUk','2026-06-04 15:17:19','2026-05-28 15:17:19'),(49,'jeo7507NL202606','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2NvZGUiOiJqZW83NTA3TkwyMDI2MDYiLCJuYW1lIjoi66-87KCV6riwIiwiZW1haWwiOiJqZW9uZ2tleTMzMTdAZ21haWwuY29tIiwicGhvbmUiOiIwMTA2NTUxMzMxNyIsImlhdCI6MTc4MTA2MzI0OSwiZXhwIjoxNzgxNjY4MDQ5fQ.qdRb3iOJUzSOz7ch3z580Mix_3XiSKO_3_9Ynzr0T0I','2026-06-17 12:47:29','2026-06-10 12:47:29'),(51,'jeo7507NL202606','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2NvZGUiOiJqZW83NTA3TkwyMDI2MDYiLCJyb2xlIjoiVVNFUiIsInN0YXR1cyI6IkFDVElWRSIsInByb2ZpbGUiOm51bGwsIm5hbWUiOiLrr7zsoJXquLAiLCJlbWFpbCI6Implb25na2V5MzMxN0BnbWFpbC5jb20iLCJpYXQiOjE3ODE2NzIzMDMsImV4cCI6MTc4MjI3NzEwM30.dNGJ6-UZtslCu3IU5jraAy5bjXToA7gENaUMlZm9KOI','2026-06-24 13:58:23','2026-06-17 13:58:23'),(55,'jeo7507NL202606','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2NvZGUiOiJqZW83NTA3TkwyMDI2MDYiLCJyb2xlIjoiVVNFUiIsInN0YXR1cyI6IkFDVElWRSIsInByb2ZpbGUiOm51bGwsIm5hbWUiOiLrr7zsoJXquLAiLCJlbWFpbCI6Implb25na2V5MzMxN0BnbWFpbC5jb20iLCJpYXQiOjE3ODIzNjYxNzUsImV4cCI6MTc4Mjk3MDk3NX0.Cmx1tXMME8TaAoubF-wEdvhTZj_OgYeIP93URW7UG5M','2026-07-02 14:42:55','2026-06-25 14:42:55'),(56,'jeo7507NL202606','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2NvZGUiOiJqZW83NTA3TkwyMDI2MDYiLCJyb2xlIjoiVVNFUiIsInN0YXR1cyI6IkFDVElWRSIsInByb2ZpbGUiOiIvcHVibGljL2plbzc1MDdOTDIwMjYwNi9wcm9maWxlLzE3ODIzNzI4NzU3NTIud2VicCIsIm5hbWUiOiLrr7zsoJXquLAiLCJlbWFpbCI6Implb25na2V5MzMxN0BnbWFpbC5jb20iLCJwaG9uZSI6IjAxMDY1NTEzMzE3IiwiaWF0IjoxNzgyMzcyODc1LCJleHAiOjE3ODI5Nzc2NzV9.l-VVzFUiL47j5EmywrnJTAlk2EA3yI80U192fHSp4pE','2026-07-02 16:34:35','2026-06-25 16:34:35'),(57,'jeo7507NL202606','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2NvZGUiOiJqZW83NTA3TkwyMDI2MDYiLCJyb2xlIjoiVVNFUiIsInN0YXR1cyI6IkFDVElWRSIsInByb2ZpbGUiOiIvdXBsb2Fkcy9qZW83NTA3TkwyMDI2MDYvcHJvZmlsZS8xNzgyMzczNzIyMTAxLndlYnAiLCJuYW1lIjoi66-87KCV6riwIiwiZW1haWwiOiJqZW9uZ2tleTMzMTdAZ21haWwuY29tIiwicGhvbmUiOiIwMTA2NTUxMzMxNyIsImlhdCI6MTc4MjM3MzcyMiwiZXhwIjoxNzgyOTc4NTIyfQ.wkH_YXVraSjLPrYFqTa0pFTHFl4EBvX5Gm6SdPqT36Y','2026-07-02 16:48:42','2026-06-25 16:48:42'),(58,'jeo7507NL202606','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2NvZGUiOiJqZW83NTA3TkwyMDI2MDYiLCJyb2xlIjoiVVNFUiIsInN0YXR1cyI6IkFDVElWRSIsInByb2ZpbGUiOiIvdXBsb2Fkcy9qZW83NTA3TkwyMDI2MDYvcHJvZmlsZS8xNzgyMzczNzIyMTAxLndlYnAiLCJuYW1lIjoi66-87KCV6riwIiwiZW1haWwiOiJqZW9uZ2tleTMzMTdAZ21haWwuY29tIiwicGhvbmUiOiIwMTA2NTUxMzMxNyIsImlhdCI6MTc4MjM3NDYyOCwiZXhwIjoxNzgyOTc5NDI4fQ.Cle3t9VNEuGSpLMxVMjS2JOu3athkxrG7oag-cSR5GA','2026-07-02 17:03:48','2026-06-25 17:03:48'),(59,'jeo7507NL202606','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2NvZGUiOiJqZW83NTA3TkwyMDI2MDYiLCJyb2xlIjoiVVNFUiIsInN0YXR1cyI6IkFDVElWRSIsInByb2ZpbGUiOm51bGwsIm5hbWUiOiLrr7zsoJXquLAiLCJlbWFpbCI6Implb25na2V5MzMxN0BnbWFpbC5jb20iLCJwaG9uZSI6IjAxMDY1NTEzMzE3IiwiaWF0IjoxNzgyMzc1MDM0LCJleHAiOjE3ODI5Nzk4MzR9.TbwIcnDnH0ohM51KPNx0PBbmI-i29TkuDyVpc4_gPzg','2026-07-02 17:10:34','2026-06-25 17:10:34'),(62,'jeo7507NL202606','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2NvZGUiOiJqZW83NTA3TkwyMDI2MDYiLCJyb2xlIjoiVVNFUiIsInN0YXR1cyI6IkFDVElWRSIsInByb2ZpbGUiOiIvdXBsb2Fkcy9qZW83NTA3TkwyMDI2MDYvcHJvZmlsZS8xNzgyMzc1MDQxNTEzLndlYnAiLCJuYW1lIjoi66-87KCV6riwIiwiZW1haWwiOiJqZW9uZ2tleTMzMTdAZ21haWwuY29tIiwiaWF0IjoxNzgyNzkzNTg5LCJleHAiOjE3ODMzOTgzODl9.BYbDIhZg1d3xT4YXW1lscS4iDjP2R0qOjfgfrBQerDI','2026-07-07 13:26:29','2026-06-30 13:26:29'),(63,'jeo7507NL202606','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2NvZGUiOiJqZW83NTA3TkwyMDI2MDYiLCJyb2xlIjoiVVNFUiIsInN0YXR1cyI6IkFDVElWRSIsInByb2ZpbGUiOiIvdXBsb2Fkcy9qZW83NTA3TkwyMDI2MDYvcHJvZmlsZS8xNzgyMzc1MDQxNTEzLndlYnAiLCJuYW1lIjoi66-87KCV6riwIiwiZW1haWwiOiJqZW9uZ2tleTMzMTdAZ21haWwuY29tIiwiaWF0IjoxNzgyNzkzNjIyLCJleHAiOjE3ODMzOTg0MjJ9.rG0y93sEZubXXK79klH4i3TpeoYmROiT7jGPZACuQ5w','2026-07-07 13:27:02','2026-06-30 13:27:02'),(64,'jeo7507NL202606','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2NvZGUiOiJqZW83NTA3TkwyMDI2MDYiLCJyb2xlIjoiVVNFUiIsInN0YXR1cyI6IkFDVElWRSIsInByb2ZpbGUiOiIvdXBsb2Fkcy9qZW83NTA3TkwyMDI2MDYvcHJvZmlsZS8xNzgyMzc1MDQxNTEzLndlYnAiLCJuYW1lIjoi66-87KCV6riwIiwiZW1haWwiOiJqZW9uZ2tleTMzMTdAZ21haWwuY29tIiwiaWF0IjoxNzgyNzkzNzc2LCJleHAiOjE3ODMzOTg1NzZ9.ZvhqEvzf_e24p_dxl67MKzSAS7dA-0L_McRRhNPzMsI','2026-07-07 13:29:36','2026-06-30 13:29:36'),(67,'jeo7507NL202606','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2NvZGUiOiJqZW83NTA3TkwyMDI2MDYiLCJyb2xlIjoiVVNFUiIsInN0YXR1cyI6IkFDVElWRSIsInByb2ZpbGUiOiIvdXBsb2Fkcy9qZW83NTA3TkwyMDI2MDYvcHJvZmlsZS8xNzgyMzc1MDQxNTEzLndlYnAiLCJuYW1lIjoi66-87KCV6riwIiwiZW1haWwiOiJqZW9uZ2tleTMzMTdAZ21haWwuY29tIiwiaWF0IjoxNzgzMDQ2MjQ5LCJleHAiOjE3ODM2NTEwNDl9.XRAmDrrdkU7aX8ENRmQuMt509L-EfayITsHmbtqczNI','2026-07-10 11:37:29','2026-07-03 11:37:29'),(68,'jeo7507NL202606','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2NvZGUiOiJqZW83NTA3TkwyMDI2MDYiLCJyb2xlIjoiVVNFUiIsInN0YXR1cyI6IkFDVElWRSIsInByb2ZpbGUiOiIvdXBsb2Fkcy9qZW83NTA3TkwyMDI2MDYvcHJvZmlsZS8xNzgyMzc1MDQxNTEzLndlYnAiLCJuYW1lIjoi66-87KCV6riwIiwiZW1haWwiOiJqZW9uZ2tleTMzMTdAZ21haWwuY29tIiwicGhvbmUiOiIwMTAtNjU1MS0zMzE3IiwiaWF0IjoxNzgzMDQ2MzM3LCJleHAiOjE3ODM2NTExMzd9.BbHwyH9YsfwKrXnBA-3zxweKqb6GYUwBRxP7dlhX94E','2026-07-10 11:38:57','2026-07-03 11:38:57'),(69,'jeo7507NL202606','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2NvZGUiOiJqZW83NTA3TkwyMDI2MDYiLCJyb2xlIjoiVVNFUiIsInN0YXR1cyI6IkFDVElWRSIsInByb2ZpbGUiOiIvdXBsb2Fkcy9qZW83NTA3TkwyMDI2MDYvcHJvZmlsZS8xNzgyMzc1MDQxNTEzLndlYnAiLCJuYW1lIjoi66-87KCV6riwIiwiZW1haWwiOiJqZW9uZ2tleTMzMTdAZ21haWwuY29tIiwicGhvbmUiOiIwMTAtNjU1MS0zMzE3IiwiaWF0IjoxNzgzMDQ2MzQzLCJleHAiOjE3ODM2NTExNDN9.KgfQV8_3lMFlUwMkfNgcbT3l1il42g8kQkguTh5z-SI','2026-07-10 11:39:03','2026-07-03 11:39:03'),(70,'jeo7507NL202606','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2NvZGUiOiJqZW83NTA3TkwyMDI2MDYiLCJyb2xlIjoiVVNFUiIsInN0YXR1cyI6IkFDVElWRSIsInByb2ZpbGUiOiIvdXBsb2Fkcy9qZW83NTA3TkwyMDI2MDYvcHJvZmlsZS8xNzgyMzc1MDQxNTEzLndlYnAiLCJuYW1lIjoi66-87KCV6riwIiwiZW1haWwiOiJqZW9uZ2tleTMzMTdAZ21haWwuY29tIiwiaWF0IjoxNzgzMDY2NTkwLCJleHAiOjE3ODM2NzEzOTB9.QY2iaOAus2fpZSaEU9lq44HDqtTfyYbDR3TM58NWFlU','2026-07-10 08:16:30','2026-07-03 08:16:30'),(71,'jeo7334Wt202601','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2NvZGUiOiJqZW83MzM0V3QyMDI2MDEiLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdGF0dXMiOiJBQ1RJVkUiLCJwcm9maWxlIjpudWxsLCJuYW1lIjoi66-87KCV6riwIiwiZW1haWwiOiJqZW9uZ2tleTMzMTdAbmF2ZXIuY29tIiwiaWF0IjoxNzgzMzg5NTIxLCJleHAiOjE3ODM5OTQzMjF9.U9A3KMqYhnEUzFDAFeorAydWkv4FqZUzm1FFJtLMUBo','2026-07-14 01:58:42','2026-07-07 01:58:41');
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review_banner`
--

DROP TABLE IF EXISTS `review_banner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review_banner` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_pc` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_mobile` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_tablet` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_always` tinyint(1) DEFAULT '0',
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `sort_order` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review_banner`
--

LOCK TABLES `review_banner` WRITE;
/*!40000 ALTER TABLE `review_banner` DISABLE KEYS */;
INSERT INTO `review_banner` VALUES (3,'test3','/uploads/2026/06/29/review/display/banner/1782717804489_988.webp',NULL,NULL,NULL,1,NULL,NULL,1,0,'2026-06-29 16:23:24'),(4,'test2','/uploads/2026/06/29/review/display/banner/1782718040106_933.webp',NULL,NULL,NULL,1,NULL,NULL,1,2,'2026-06-29 16:27:20'),(5,'test1','/uploads/2026/06/29/review/display/banner/1782718046207_70.webp',NULL,NULL,NULL,1,NULL,NULL,1,1,'2026-06-29 16:27:26');
/*!40000 ALTER TABLE `review_banner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review_campaign`
--

DROP TABLE IF EXISTS `review_campaign`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review_campaign` (
  `id` int NOT NULL AUTO_INCREMENT,
  `campaign_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `product_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `title` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `short_description` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `is_display` tinyint NOT NULL DEFAULT '0',
  `user_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL COMMENT '관리자 계정',
  `campaign_category_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `campaign_type` enum('DELIVERY','VISIT','REPORTER','PURCHASE') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'DELIVERY',
  `state` enum('DRAFT','PENDING','SCHEDULED','RECRUITING','CLOSED','SELECTING','REVIEWING','COMPLETED') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'DRAFT' COMMENT 'draft=임시저장, pending=대기, scheduled=준비중, recruiting=모집중, closed=종료, selecting=선정중, reviewing=작성중, completed=완료',
  `max_applicants` int NOT NULL DEFAULT '0',
  `main_image` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `detail_images` text COLLATE utf8mb4_general_ci,
  `content` text COLLATE utf8mb4_general_ci NOT NULL,
  `start_application_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `end_application_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `reviewer_selection_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `start_write_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `end_write_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_review_campaign_user` (`user_code`),
  KEY `campaign_code` (`campaign_code`),
  KEY `FK_review_campaign_review_campaign_category` (`campaign_category_code`) USING BTREE,
  CONSTRAINT `FK_review_campaign_user` FOREIGN KEY (`user_code`) REFERENCES `user` (`user_code`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review_campaign`
--

LOCK TABLES `review_campaign` WRITE;
/*!40000 ALTER TABLE `review_campaign` DISABLE KEYS */;
INSERT INTO `review_campaign` VALUES (11,'202603251523561942','와바미 파데','와바미 뷰티','와바미에서 만든 뷰티 브랜드!!',1,'jeo7334Wt202601','20260402141854001','DELIVERY','COMPLETED',10,'/uploads/2026/03/25/review/20260325152356099/1774419836258-zxsqcl4be.webp','[\"/uploads/2026/03/27/review/20260327144427556_d0/1774590267260-yniyp0wrg.webp\",\"/uploads/2026/03/27/review/20260327143905099_d1/1774589945886-pqqagjgoe.webp\",\"/uploads/2026/03/27/review/20260327143905099_d0/1774589945778-iuy4g4waf.webp\",\"/uploads/2026/03/27/review/20260327143905099_d2/1774589946601-sw4g6bafx.webp\"]','이것 저것 그것 베이비','2026-02-26 00:00:00','2026-04-20 00:00:00','2026-04-21 00:00:00','2026-04-22 00:00:00','2026-04-26 00:00:00','2026-03-25 15:23:56','2026-04-22 12:04:27'),(12,'202604231037085673','와바미 닥터버니 티모시 베이직','와바미 토끼사료 닥터 버니','캠페인 테스트',1,'jeo7334Wt202601','20260402141854001','DELIVERY','COMPLETED',5,'/uploads/2026/04/23/review/20260423103708876/1776908228828-pkvk84bbc.webp','[\"/uploads/2026/04/23/review/20260423103708876_d0/1776908229020-ar09x4mea.webp\",\"/uploads/2026/04/23/review/20260423103708876_d1/1776908229796-n9c5fkpvj.webp\",\"/uploads/2026/04/23/review/20260423103708876_d2/1776908230511-ygi1hx21i.webp\"]','이건 테스트임','2026-06-15 00:00:00','2026-06-23 00:00:00','2026-06-24 00:00:00','2026-06-24 00:00:00','2026-07-08 00:00:00','2026-04-23 10:37:11','2026-06-26 13:49:07'),(14,'202605121348356767','제품명 테스트','테스트2','ㅁㅇㄹ우ㅏ',1,'jeo7334Wt202601','20260402142217001','VISIT','RECRUITING',10,'/uploads/2026/05/12/review/20260512135111209/1778561471360-fpwth31r7.webp','[\"/uploads/2026/05/12/review/20260512135540197_d0/1778561740411-henle2u1t.webp\",\"/uploads/2026/05/12/review/20260512140252078_d0/1778562172308-gzmpx16kn.webp\"]','ㅁㄴㅇㄹㄴㅁㅇㄻㄴㅇㄹㄴㅁㅇㄹ\r\n\r\nㅁㄴㅇㄻㄴㅇㄹ\r\nㅁㄴㅇㄹ\r\nㅁㄴㅇㄹ\r\nㅁㄴㅇㄹ\r\nㅁㄴㅇㄹ\r\nㅁㄴㅇㄹ\r\nㅁㄴㅇㄻ','2026-07-08 00:00:00','2026-07-15 00:00:00','2026-07-16 00:00:00','2026-07-20 00:00:00','2026-07-29 00:00:00','2026-05-12 13:48:35','2026-07-08 06:17:39'),(15,'202605121412250150','ㅁㄴㅇㅁㄴㅇ','loading test','',1,'jeo7334Wt202601','','VISIT','DRAFT',0,'',NULL,'','2026-05-12 00:00:00','2026-05-20 00:00:00','2026-05-21 00:00:00','2026-05-21 00:00:00','2026-06-01 00:00:00','2026-05-12 14:12:25','2026-05-12 14:12:25');
/*!40000 ALTER TABLE `review_campaign` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review_campaign_application`
--

DROP TABLE IF EXISTS `review_campaign_application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review_campaign_application` (
  `id` int NOT NULL AUTO_INCREMENT,
  `campaign_application_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `campaign_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `user_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `status` enum('APPLIED','SELECTED','REJECTED','CANCELLED','SUBMITTED','RETURNED','COMPLETED') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'APPLIED',
  `applied_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `selected_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_review_campaign_application_review_campaign` (`campaign_code`),
  KEY `FK_review_campaign_application_user` (`user_code`),
  KEY `campaign_application_code` (`campaign_application_code`),
  CONSTRAINT `FK_review_campaign_application_review_campaign` FOREIGN KEY (`campaign_code`) REFERENCES `review_campaign` (`campaign_code`),
  CONSTRAINT `FK_review_campaign_application_user` FOREIGN KEY (`user_code`) REFERENCES `user` (`user_code`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review_campaign_application`
--

LOCK TABLES `review_campaign_application` WRITE;
/*!40000 ALTER TABLE `review_campaign_application` DISABLE KEYS */;
INSERT INTO `review_campaign_application` VALUES (10,'202604211541539460','202603251523561942','jeo7334Wt202601','COMPLETED','2026-04-21 15:41:53',NULL,'2026-04-21 15:41:53','2026-04-22 11:32:16'),(11,'202604231037379557','202604231037085673','jeo7334Wt202601','CANCELLED','2026-04-23 10:37:37',NULL,'2026-04-23 10:37:37','2026-04-27 15:37:02'),(14,'202605121031155241','202604231037085673','jeo7334Wt202601','CANCELLED','2026-05-12 10:31:15',NULL,'2026-05-12 10:31:15','2026-05-12 10:45:34'),(15,'202605121112386489','202604231037085673','jeo7334Wt202601','CANCELLED','2026-05-12 11:12:38',NULL,'2026-05-12 11:12:38','2026-05-12 11:12:56'),(16,'202606151558319596','202604231037085673','jeo7507NL202606','REJECTED','2026-06-15 15:58:31',NULL,'2026-06-15 15:58:31','2026-07-02 11:29:01');
/*!40000 ALTER TABLE `review_campaign_application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review_campaign_application_address`
--

DROP TABLE IF EXISTS `review_campaign_application_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review_campaign_application_address` (
  `application_address_code` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `campaign_application_code` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postcode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `detailAddress` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`application_address_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review_campaign_application_address`
--

LOCK TABLES `review_campaign_application_address` WRITE;
/*!40000 ALTER TABLE `review_campaign_application_address` DISABLE KEYS */;
INSERT INTO `review_campaign_application_address` VALUES ('202606301440410168','202605121112386489','민정기','21035','인천 계양구 장제로 878(병방동, 학마을서해.영남아파트)','111동 1102호','010-6551-3317'),('202606301440411164','202604211541539460','민정기','21069','인천 계양구 오조산로57번길 15(계산동, 명동빌딩)','721호','010-6551-3317'),('202606301440412580','202606151558319596','민정기','21035','인천 계양구 장제로 878(병방동, 학마을서해.영남아파트)','111-1102','010-6551-3317'),('202606301440413459','202605121031155241','민정기','21069','인천 계양구 오조산로57번길 15(계산동, 명동빌딩)','721호','010-6551-3317'),('202606301440416375','202604231037379557','민정기','21069','인천 계양구 오조산로57번길 15(계산동, 명동빌딩)','721호','010-6551-3317');
/*!40000 ALTER TABLE `review_campaign_application_address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review_campaign_application_channel`
--

DROP TABLE IF EXISTS `review_campaign_application_channel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review_campaign_application_channel` (
  `id` int NOT NULL AUTO_INCREMENT,
  `campaign_application_channel_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `campaign_application_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `review_channel_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_campaign_application_code` (`campaign_application_code`),
  KEY `FK_review_campaign_application_channel_user_review_channel` (`review_channel_code`),
  CONSTRAINT `FK_campaign_application_code` FOREIGN KEY (`campaign_application_code`) REFERENCES `review_campaign_application` (`campaign_application_code`),
  CONSTRAINT `FK_review_campaign_application_channel_user_review_channel` FOREIGN KEY (`review_channel_code`) REFERENCES `user_review_channel` (`review_channel_code`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review_campaign_application_channel`
--

LOCK TABLES `review_campaign_application_channel` WRITE;
/*!40000 ALTER TABLE `review_campaign_application_channel` DISABLE KEYS */;
INSERT INTO `review_campaign_application_channel` VALUES (3,'202604211541532951','202604211541539460','202604101108336720'),(4,'202604231037384646','202604231037379557','202604091524092907'),(7,'202605121031161263','202605121031155241','202604281407109012'),(8,'202605121112400853','202605121112386489','202604281407109012'),(9,'202606151558314044','202606151558319596','202606111054202320');
/*!40000 ALTER TABLE `review_campaign_application_channel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review_campaign_application_delivery`
--

DROP TABLE IF EXISTS `review_campaign_application_delivery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review_campaign_application_delivery` (
  `id` int NOT NULL AUTO_INCREMENT,
  `campaign_application_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `campaign_application_delivery_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `courier` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0' COMMENT '택배사',
  `tracking_number` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0' COMMENT '송장번호',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_review_campaign_application_delivery` (`campaign_application_code`),
  KEY `campaign_application_delivery_code` (`campaign_application_delivery_code`),
  CONSTRAINT `FK_review_campaign_application_delivery` FOREIGN KEY (`campaign_application_code`) REFERENCES `review_campaign_application` (`campaign_application_code`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review_campaign_application_delivery`
--

LOCK TABLES `review_campaign_application_delivery` WRITE;
/*!40000 ALTER TABLE `review_campaign_application_delivery` DISABLE KEYS */;
INSERT INTO `review_campaign_application_delivery` VALUES (2,'202604211541539460','202604211544492113','CJ대한통운','3432523532523','2026-04-21 06:44:49','2026-04-21 06:44:49');
/*!40000 ALTER TABLE `review_campaign_application_delivery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review_campaign_application_reward_option`
--

DROP TABLE IF EXISTS `review_campaign_application_reward_option`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review_campaign_application_reward_option` (
  `id` int NOT NULL AUTO_INCREMENT,
  `campaign_application_reward_option_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `campaign_application_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `reward_option_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `reward_option_value` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_review_campaign_application_option` (`campaign_application_code`),
  KEY `FK_review_campaign_application_op_reward_option` (`reward_option_code`),
  KEY `campaign_application_reward_option_code` (`campaign_application_reward_option_code`),
  CONSTRAINT `FK_review_campaign_application_op_reward_option` FOREIGN KEY (`reward_option_code`) REFERENCES `review_campaign_reward_option` (`reward_option_code`),
  CONSTRAINT `FK_review_campaign_application_option` FOREIGN KEY (`campaign_application_code`) REFERENCES `review_campaign_application` (`campaign_application_code`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review_campaign_application_reward_option`
--

LOCK TABLES `review_campaign_application_reward_option` WRITE;
/*!40000 ALTER TABLE `review_campaign_application_reward_option` DISABLE KEYS */;
INSERT INTO `review_campaign_application_reward_option` VALUES (6,'202604211541534177','202604211541539460','202604211322287031','21호');
/*!40000 ALTER TABLE `review_campaign_application_reward_option` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review_campaign_category`
--

DROP TABLE IF EXISTS `review_campaign_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review_campaign_category` (
  `c_num` int NOT NULL AUTO_INCREMENT,
  `parent_code` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `category_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `type` enum('DELIVERY','VISIT','REPORTER','PURCHASE') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'DELIVERY',
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `is_visible` tinyint NOT NULL DEFAULT '0',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`c_num`) USING BTREE,
  UNIQUE KEY `id` (`category_code`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review_campaign_category`
--

LOCK TABLES `review_campaign_category` WRITE;
/*!40000 ALTER TABLE `review_campaign_category` DISABLE KEYS */;
INSERT INTO `review_campaign_category` VALUES (3,NULL,'20260402131737001','DELIVERY','제품',1,1,'2026-04-02 01:57:15','2026-04-02 04:19:13'),(4,NULL,'20260402131902001','VISIT','지역',1,2,'2026-04-02 04:19:02','2026-04-02 04:19:10'),(5,NULL,'20260402132114001','REPORTER','기자단',1,3,'2026-04-02 04:21:41','2026-04-02 04:22:04'),(6,NULL,'20260402132158001','PURCHASE','구매평',1,4,'2026-04-02 04:21:58','2026-04-02 04:22:30'),(7,'20260402131737001','20260402141854001','DELIVERY','뷰티',1,1,'2026-04-02 05:18:54','2026-04-02 05:19:05'),(8,'20260402131737001','20260402141919001','DELIVERY','식품',1,2,'2026-04-02 05:19:19','2026-04-02 06:19:25'),(9,'20260402131737001','20260402141939001','DELIVERY','생활용품',1,3,'2026-04-02 05:19:39','2026-04-02 06:19:26'),(10,'20260402131737001','20260402141952001','DELIVERY','육아',1,4,'2026-04-02 05:19:52','2026-04-02 06:19:27'),(11,'20260402131737001','20260402142017001','DELIVERY','차량·캠핑',1,5,'2026-04-02 05:20:17','2026-04-02 06:19:27'),(12,'20260402131737001','20260402142030001','DELIVERY','반려동물',1,6,'2026-04-02 05:20:30','2026-04-02 06:19:28'),(13,'20260402131737001','20260402142050001','DELIVERY','IT·가전제품',1,7,'2026-04-02 05:20:50','2026-04-02 06:19:29'),(14,'20260402131737001','20260402142102001','DELIVERY','기타',1,8,'2026-04-02 05:21:02','2026-04-02 06:19:30'),(15,'20260402131902001','20260402142145001','VISIT','맛집·카페',1,1,'2026-04-02 05:21:45','2026-04-02 05:22:03'),(16,'20260402131902001','20260402142217001','VISIT','뷰티·건강·미용',1,2,'2026-04-02 05:22:17','2026-04-02 06:19:31'),(20,'20260402131902001','20260402142233001','VISIT','여행·숙박·레저',1,3,'2026-04-02 05:22:33','2026-04-02 06:19:32'),(21,'20260402131902001','20260402142320001','VISIT','문화',1,4,'2026-04-02 05:23:20','2026-04-02 06:19:32'),(22,'20260402131902001','20260402142336001','VISIT','기타',1,5,'2026-04-02 05:23:36','2026-04-02 06:19:33');
/*!40000 ALTER TABLE `review_campaign_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review_campaign_channel`
--

DROP TABLE IF EXISTS `review_campaign_channel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review_campaign_channel` (
  `id` int NOT NULL AUTO_INCREMENT,
  `campaign_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `channel_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK__review_campaign` (`campaign_code`),
  KEY `FK_review_campaign_channel_review_campaign_channel_view` (`channel_code`),
  CONSTRAINT `FK__review_campaign` FOREIGN KEY (`campaign_code`) REFERENCES `review_campaign` (`campaign_code`),
  CONSTRAINT `FK_review_campaign_channel_review_campaign_channel_view` FOREIGN KEY (`channel_code`) REFERENCES `review_campaign_channel_view` (`channel_code`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review_campaign_channel`
--

LOCK TABLES `review_campaign_channel` WRITE;
/*!40000 ALTER TABLE `review_campaign_channel` DISABLE KEYS */;
INSERT INTO `review_campaign_channel` VALUES (52,'202603251523561942','202603171602001'),(80,'202604231037085673','202603171602001'),(81,'202605121348356767','202603171602001');
/*!40000 ALTER TABLE `review_campaign_channel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review_campaign_channel_view`
--

DROP TABLE IF EXISTS `review_campaign_channel_view`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review_campaign_channel_view` (
  `id` int NOT NULL AUTO_INCREMENT,
  `channel_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `unselectable_with` varchar(500) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `icon` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `isLink` tinyint NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `channel_code` (`channel_code`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review_campaign_channel_view`
--

LOCK TABLES `review_campaign_channel_view` WRITE;
/*!40000 ALTER TABLE `review_campaign_channel_view` DISABLE KEYS */;
INSERT INTO `review_campaign_channel_view` VALUES (1,'202603171602001','202603171603001,202603171603002,202603171604001','네이버 블로그','naver.svg',1,'2026-03-17 16:02:58','2026-04-10 10:38:53'),(2,'202603171603001','202603171602001,202603171603002,202603171604001','인스타그램','instagram.svg',1,'2026-03-17 16:03:31','2026-05-12 14:06:05'),(3,'202603171603002','202603171603001,202603171602001,202603171604001','유튜브','youtube.svg',1,'2026-03-17 16:04:12','2026-04-10 10:38:58'),(4,'202603171604001','202603171602001,202603171603002,202603171604002','인스타그램 릴스','instagram_reels.svg',1,'2026-03-17 16:04:29','2026-04-10 10:39:00'),(5,'202603171604002','202603171602001,202603171603001,202603171604001','유튜브 쇼츠','youtube_shorts.svg',1,'2026-03-17 16:04:51','2026-04-10 10:39:03'),(6,'202603171605001','0','스마트스토어 구매평','0',0,'2026-03-17 16:05:17','2026-03-17 16:05:17'),(7,'202603171605002','0','쿠팡 리뷰','0',0,'2026-03-17 16:05:33','2026-03-17 16:05:39');
/*!40000 ALTER TABLE `review_campaign_channel_view` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review_campaign_feedback`
--

DROP TABLE IF EXISTS `review_campaign_feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review_campaign_feedback` (
  `id` int NOT NULL AUTO_INCREMENT,
  `campaign_feedback_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `campaign_application_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `request_content` text COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_review_campaign_post_feedback_review_campaign_application` (`campaign_application_code`),
  KEY `campaign_post_feedback_code` (`campaign_feedback_code`) USING BTREE,
  CONSTRAINT `FK_review_campaign_post_feedback_review_campaign_application` FOREIGN KEY (`campaign_application_code`) REFERENCES `review_campaign_application` (`campaign_application_code`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review_campaign_feedback`
--

LOCK TABLES `review_campaign_feedback` WRITE;
/*!40000 ALTER TABLE `review_campaign_feedback` DISABLE KEYS */;
INSERT INTO `review_campaign_feedback` VALUES (5,'202604211545348866','202604211541539460','이거 수정 해요','2026-04-21 06:45:34','2026-04-21 06:45:34'),(6,'202604211546014547','202604211541539460','이거 안되어 있음','2026-04-21 06:46:01','2026-04-21 06:46:01');
/*!40000 ALTER TABLE `review_campaign_feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review_campaign_mission`
--

DROP TABLE IF EXISTS `review_campaign_mission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review_campaign_mission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `campaign_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `title_guide` text COLLATE utf8mb4_general_ci NOT NULL,
  `content_guide` text COLLATE utf8mb4_general_ci NOT NULL,
  `hashtags` text COLLATE utf8mb4_general_ci NOT NULL,
  `mandatory_keyword` varchar(125) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `optional_keyword` varchar(125) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `min_photo_count` int NOT NULL DEFAULT '0',
  `min_text_length` int NOT NULL DEFAULT '1000',
  PRIMARY KEY (`id`),
  KEY `FK_review_campaign_mission_review_campaign` (`campaign_code`),
  CONSTRAINT `FK_review_campaign_mission_review_campaign` FOREIGN KEY (`campaign_code`) REFERENCES `review_campaign` (`campaign_code`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review_campaign_mission`
--

LOCK TABLES `review_campaign_mission` WRITE;
/*!40000 ALTER TABLE `review_campaign_mission` DISABLE KEYS */;
INSERT INTO `review_campaign_mission` VALUES (7,'202603251523561942','이것 저것 그것 베이비','1. 이것에 대해 작성해주세요\n2. 링크 연결','와바미뷰티,뷰러,파데','와바미뷰티,뷰러,파데','필수템',10,1000),(8,'202604231037085673','필수키워드 + 제품명을 조합한 제목으로 만들어주세요.\n선택키워드는 선택사항으로 반드시 넣어야 하는 키워드는 아닙니다.','1. 제품 이미지 및 반려동물이 먹는 이미지 포함 최소 5장 이상\n2. 이미지에 반려동물이 잘 먹는 이미지 2장 이상 필수 포함\n3. 긍정적인 후기 작성','와바미,닥터버니,티모시,티모시사료,토끼사료','','',5,500),(10,'202605121348356767','ㅁㄴㅇㄹ','ㅁㄴㅇㄻㄴㅇㄹ','ㅁㄴㄹ,ㅇㄹ,ㄹ,ㄹㅁㄴㅇㄹ,ㅁㄴㅇㄹ','','',10,1000),(11,'202605121412250150','','','','','',10,1000);
/*!40000 ALTER TABLE `review_campaign_mission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review_campaign_post`
--

DROP TABLE IF EXISTS `review_campaign_post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review_campaign_post` (
  `id` int NOT NULL AUTO_INCREMENT,
  `campaign_post_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `campaign_application_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `user_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `post_url` text COLLATE utf8mb4_general_ci NOT NULL,
  `status` enum('SUBMITTED','RETURNED','RESUBMITTED','COMPLETED') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'SUBMITTED',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `resubmited_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_review_campaign_post_user` (`user_code`),
  KEY `FK_review_campaign_post_review_campaign_application` (`campaign_application_code`) USING BTREE,
  KEY `review_campaign_post_code` (`campaign_post_code`) USING BTREE,
  CONSTRAINT `FK_review_campaign_post_review_campaign_application` FOREIGN KEY (`campaign_application_code`) REFERENCES `review_campaign_application` (`campaign_application_code`),
  CONSTRAINT `FK_review_campaign_post_user` FOREIGN KEY (`user_code`) REFERENCES `user` (`user_code`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review_campaign_post`
--

LOCK TABLES `review_campaign_post` WRITE;
/*!40000 ALTER TABLE `review_campaign_post` DISABLE KEYS */;
INSERT INTO `review_campaign_post` VALUES (6,'202604211545087000','202604211541539460','jeo7334Wt202601','https://chakra-ui.com/docs/components/accordion','COMPLETED','2026-04-21 06:45:08','2026-04-21 06:45:08','2026-04-21 06:46:21');
/*!40000 ALTER TABLE `review_campaign_post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review_campaign_reward`
--

DROP TABLE IF EXISTS `review_campaign_reward`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review_campaign_reward` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reward_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `campaign_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `reward_type` enum('PRODUCT','POINT','COUPON') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'PRODUCT',
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(50) COLLATE utf8mb4_general_ci NOT NULL COMMENT '설명',
  `value` double NOT NULL DEFAULT '0' COMMENT '금액 또는 포인트',
  `quantity` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_review_campaign_reward_review_campaign` (`campaign_code`),
  KEY `reward_code` (`reward_code`),
  CONSTRAINT `FK_review_campaign_reward_review_campaign` FOREIGN KEY (`campaign_code`) REFERENCES `review_campaign` (`campaign_code`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review_campaign_reward`
--

LOCK TABLES `review_campaign_reward` WRITE;
/*!40000 ALTER TABLE `review_campaign_reward` DISABLE KEYS */;
INSERT INTO `review_campaign_reward` VALUES (45,'202604211322287549','202603251523561942','PRODUCT','와바미 파데 50g','와바미 파데 21호, 23호 중 택 1',0,1),(64,'202605121412280799','202605121412250150','PRODUCT','','',0,0),(67,'202606151556254815','202604231037085673','PRODUCT','와바미 닥터버니 티모시 베이직 1kg','티모시가 주 성분으로 만든 토끼 사료',0,1),(68,'202607080617383799','202605121348356767','PRODUCT','ㅁㄴㅇㄹ','ㅁㅇㄹ',0,1);
/*!40000 ALTER TABLE `review_campaign_reward` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review_campaign_reward_option`
--

DROP TABLE IF EXISTS `review_campaign_reward_option`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review_campaign_reward_option` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reward_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `reward_option_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `option_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `option_value` varchar(100) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `reward_option_code` (`reward_option_code`),
  KEY `FK_review_campaign_reward_option_review_campaign_reward` (`reward_code`),
  CONSTRAINT `FK_review_campaign_reward_option_review_campaign_reward` FOREIGN KEY (`reward_code`) REFERENCES `review_campaign_reward` (`reward_code`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review_campaign_reward_option`
--

LOCK TABLES `review_campaign_reward_option` WRITE;
/*!40000 ALTER TABLE `review_campaign_reward_option` DISABLE KEYS */;
INSERT INTO `review_campaign_reward_option` VALUES (12,'202604211322287549','202604211322287031','색상','21호,23호','2026-04-21 13:22:28','2026-04-21 13:22:28'),(17,'202607080617383799','202607080617381733','ㅁㄴㅇㄹ','ㅁㅇㄹ,ㅁㄴㅇㄹ,ㅁㄴㅇㄹ','2026-07-08 06:17:38','2026-07-08 06:17:38');
/*!40000 ALTER TABLE `review_campaign_reward_option` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review_campaign_view_log`
--

DROP TABLE IF EXISTS `review_campaign_view_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review_campaign_view_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `campaign_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `viewed_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_user_campaign` (`user_code`,`campaign_code`),
  KEY `fk_rcvl_campaign` (`campaign_code`),
  CONSTRAINT `fk_rcvl_campaign` FOREIGN KEY (`campaign_code`) REFERENCES `review_campaign` (`campaign_code`) ON DELETE CASCADE,
  CONSTRAINT `fk_rcvl_user` FOREIGN KEY (`user_code`) REFERENCES `user` (`user_code`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review_campaign_view_log`
--

LOCK TABLES `review_campaign_view_log` WRITE;
/*!40000 ALTER TABLE `review_campaign_view_log` DISABLE KEYS */;
INSERT INTO `review_campaign_view_log` VALUES (1,'jeo7334Wt202601','202605121348356767','2026-07-08 06:49:29');
/*!40000 ALTER TABLE `review_campaign_view_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review_notice`
--

DROP TABLE IF EXISTS `review_notice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review_notice` (
  `notice_code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `view_count` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`notice_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review_notice`
--

LOCK TABLES `review_notice` WRITE;
/*!40000 ALTER TABLE `review_notice` DISABLE KEYS */;
INSERT INTO `review_notice` VALUES ('NTC202606301135103269','test','<p>asdasd</p><img src=\"/uploads/2026/06/30/review/notice/editor/1782786933625-si9tnc9cb.webp\"><p></p>',1,15,'2026-06-30 11:35:10','2026-07-07 04:54:20');
/*!40000 ALTER TABLE `review_notice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_account`
--

DROP TABLE IF EXISTS `shop_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_account` (
  `id` int NOT NULL AUTO_INCREMENT,
  `account_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `bank` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `account_number` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `account_holder` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `is_active` bit(1) NOT NULL DEFAULT b'0',
  `order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `account_code` (`account_code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_account`
--

LOCK TABLES `shop_account` WRITE;
/*!40000 ALTER TABLE `shop_account` DISABLE KEYS */;
INSERT INTO `shop_account` VALUES (3,'202606091612052257','국민은행','123123-123-6785678','에이민',_binary '',1),(4,'202606091612559602','신한은행','123123-123-12321312','에이민',_binary '',2);
/*!40000 ALTER TABLE `shop_account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_delivery_setting`
--

DROP TABLE IF EXISTS `shop_delivery_setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_delivery_setting` (
  `id` int NOT NULL AUTO_INCREMENT,
  `day_delivery_time` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `day_delivery_impassable` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `delivery_method` enum('FREE','FIXED','PRICE') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'FREE',
  `basic_delivery_price` int NOT NULL DEFAULT '0',
  `order_standard` int NOT NULL DEFAULT '0',
  `island_price` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_delivery_setting`
--

LOCK TABLES `shop_delivery_setting` WRITE;
/*!40000 ALTER TABLE `shop_delivery_setting` DISABLE KEYS */;
INSERT INTO `shop_delivery_setting` VALUES (1,'12','\"[\\\"weekends\\\",\\\"holidays\\\",\\\"accHolidays\\\"]\"','PRICE',3500,50000,NULL);
/*!40000 ALTER TABLE `shop_delivery_setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_order_setting`
--

DROP TABLE IF EXISTS `shop_order_setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_order_setting` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bank_auto_cancel_days` int NOT NULL DEFAULT '0' COMMENT '주문 후 bank_auto_cancel_days 일 후 자동 취소',
  `order_auto_complete_days` int NOT NULL COMMENT '배송 완료 후 order_auto_complete_days 일 후 자동 완료',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_order_setting`
--

LOCK TABLES `shop_order_setting` WRITE;
/*!40000 ALTER TABLE `shop_order_setting` DISABLE KEYS */;
INSERT INTO `shop_order_setting` VALUES (1,3,7);
/*!40000 ALTER TABLE `shop_order_setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `profile` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('USER','ADMIN','SELLER','SUPER_ADMIN') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'USER',
  `status` enum('ACTIVE','BLOCK','WITHDRAW') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'ACTIVE',
  `marketingAgree` bit(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  `last_login_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('jeo7334Wt202601','jeongkey3317@naver.com','민정기','010-6551-3317',NULL,'$2b$10$Bxmg/Gd9ihF1Ttt6E1M7kuk6DH9185reVTNA4iT3ZacFnn/dqu3R6','SUPER_ADMIN','ACTIVE',_binary '','2026-01-29 12:27:25',NULL,'2026-07-08 07:32:42'),('jeo7507NL202606','jeongkey3317@gmail.com','민정기','010-6551-3317','/uploads/jeo7507NL202606/profile/1782375041513.webp','$2b$10$1a3Zqa2xK5HsUa0Nq.tNuukJOPL/H2UR8RR5a1Op9gycUov2yCOc6','USER','ACTIVE',_binary '','2026-06-10 12:47:29',NULL,'2026-07-03 08:23:38');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_account`
--

DROP TABLE IF EXISTS `user_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_account` (
  `account_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `holder` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `number` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `bank` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `is_basic` bit(1) NOT NULL DEFAULT b'0',
  `deleted` bit(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`account_code`),
  KEY `user_code` (`user_code`),
  CONSTRAINT `FK_user_account_user` FOREIGN KEY (`user_code`) REFERENCES `user` (`user_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_account`
--

LOCK TABLES `user_account` WRITE;
/*!40000 ALTER TABLE `user_account` DISABLE KEYS */;
INSERT INTO `user_account` VALUES ('202606221544150177','jeo7507NL202606','민정기','01065513317','기업은행',_binary '\0',_binary '','2026-06-22 06:44:15'),('202606231659141688','jeo7507NL202606','123123a','23123123','신한은행',_binary '\0',_binary '\0','2026-06-23 07:59:14'),('202606241128114586','jeo7507NL202606','민정기','01065513317','기업은행',_binary '',_binary '\0','2026-06-24 02:28:11'),('202606291046434236','jeo7507NL202606','ㅁㄴㅇㄻㄴㅇㄹ','ㄴㅁㅇㄻㄴㅇㄹ','신한은행',_binary '\0',_binary '','2026-06-29 01:46:43'),('202606291046550028','jeo7507NL202606','ㅁㄴㅇㅎㅁㄴㅇㅎ','ㅁㄴㅇㅎㅁㄴㅇㅎ','KEB하나은행',_binary '\0',_binary '','2026-06-29 01:46:55');
/*!40000 ALTER TABLE `user_account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_address`
--

DROP TABLE IF EXISTS `user_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_address` (
  `id` int NOT NULL AUTO_INCREMENT,
  `address_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `user_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(126) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postcode` varchar(126) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` varchar(126) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `detailAddress` varchar(126) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(126) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `post_request` text COLLATE utf8mb4_general_ci,
  `isDefault` tinyint(1) DEFAULT '0',
  `deleted` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_user_address_user` (`user_code`),
  KEY `address_code` (`address_code`),
  CONSTRAINT `FK_user_address_user` FOREIGN KEY (`user_code`) REFERENCES `user` (`user_code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_address`
--

LOCK TABLES `user_address` WRITE;
/*!40000 ALTER TABLE `user_address` DISABLE KEYS */;
INSERT INTO `user_address` VALUES (1,'202604081121299155','jeo7334Wt202601','민정기','21069','인천 계양구 오조산로57번길 15(계산동, 명동빌딩)','721호','010-6551-3317',NULL,1,0,'2026-04-08 11:21:29','2026-04-09 15:50:32'),(2,'202604211324085275','jeo7334Wt202601','민정기','21035','인천 계양구 장제로 878(병방동, 학마을서해.영남아파트)','111동 1102호','010-6551-3317',NULL,0,0,'2026-04-21 13:24:08','2026-04-21 13:26:43'),(3,'202606151049245747','jeo7507NL202606','민정기','21035','인천 계양구 장제로 878(병방동, 학마을서해.영남아파트)','111-1102','010-6551-3317',NULL,0,0,'2026-06-15 10:49:24','2026-06-30 14:54:16'),(4,'202606151050124334','jeo7507NL202606','민정기','21035','인천 계양구 장제로 878(병방동, 학마을서해.영남아파트)','111-1102','010-6551-3317',NULL,1,0,'2026-06-15 10:50:12','2026-06-30 14:58:31');
/*!40000 ALTER TABLE `user_address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_notification`
--

DROP TABLE IF EXISTS `user_notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_notification` (
  `notification_code` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `user_code` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `type` enum('SHOP','REVIEW','NOTICE','EVENT') COLLATE utf8mb4_general_ci NOT NULL,
  `message` text COLLATE utf8mb4_general_ci NOT NULL,
  `link` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_code`),
  KEY `user_code` (`user_code`),
  CONSTRAINT `user_notification_ibfk_1` FOREIGN KEY (`user_code`) REFERENCES `user` (`user_code`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_notification`
--

LOCK TABLES `user_notification` WRITE;
/*!40000 ALTER TABLE `user_notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_point`
--

DROP TABLE IF EXISTS `user_point`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_point` (
  `point_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `user_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `current_point` int NOT NULL DEFAULT '0',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`point_code`),
  KEY `user_code` (`user_code`),
  CONSTRAINT `FK_user_point_user` FOREIGN KEY (`user_code`) REFERENCES `user` (`user_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_point`
--

LOCK TABLES `user_point` WRITE;
/*!40000 ALTER TABLE `user_point` DISABLE KEYS */;
INSERT INTO `user_point` VALUES ('202606231153021123','jeo7334Wt202601',0,'2026-06-23 02:53:46'),('20260623120024311574','jeo7507NL202606',30000,'2026-06-24 05:08:26');
/*!40000 ALTER TABLE `user_point` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_point_history`
--

DROP TABLE IF EXISTS `user_point_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_point_history` (
  `history_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `user_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `amount` int NOT NULL DEFAULT '0',
  `balance` int NOT NULL DEFAULT '0' COMMENT '지급 또는 차감 이후 최종 잔액',
  `type` enum('EARN','PAYOUT','PAYOUT_CANCEL','MINUS') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'EARN' COMMENT 'EARN - 지급, PAYOUT - 출금, PAYOUT_CANCEL - 출금 반려로 인한 복구',
  `payout_code` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `descript` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`history_code`),
  KEY `user_code` (`user_code`),
  KEY `payout_cde` (`payout_code`) USING BTREE,
  CONSTRAINT `FK_user_point_history_user` FOREIGN KEY (`user_code`) REFERENCES `user` (`user_code`),
  CONSTRAINT `FK_user_point_history_user_point_payout` FOREIGN KEY (`payout_code`) REFERENCES `user_point_payout` (`payout_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_point_history`
--

LOCK TABLES `user_point_history` WRITE;
/*!40000 ALTER TABLE `user_point_history` DISABLE KEYS */;
INSERT INTO `user_point_history` VALUES ('202606231629441778','jeo7507NL202606',10000,10000,'EARN',NULL,'test','2026-06-23 07:29:44'),('202606231630492118','jeo7507NL202606',10000,20000,'EARN',NULL,'test2','2026-06-23 07:30:49'),('202606231631079568','jeo7507NL202606',10000,30000,'EARN',NULL,'test3','2026-06-23 07:31:07'),('202606231659491290','jeo7507NL202606',10000,40000,'EARN',NULL,'test','2026-06-23 07:59:49'),('202606241408263896','jeo7507NL202606',10000,30000,'PAYOUT','202606241408267240','출금 요청','2026-06-24 05:08:26');
/*!40000 ALTER TABLE `user_point_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_point_payout`
--

DROP TABLE IF EXISTS `user_point_payout`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_point_payout` (
  `payout_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `user_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `amount` int NOT NULL DEFAULT '0' COMMENT '출금 신청 금액',
  `account_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `status` enum('REQUEST','COMPLETED','REJECTED') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'REQUEST',
  `reject_description` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `processed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`payout_code`),
  KEY `user_code` (`user_code`),
  KEY `account_code` (`account_code`),
  CONSTRAINT `FK_user_point_payout_user` FOREIGN KEY (`user_code`) REFERENCES `user` (`user_code`),
  CONSTRAINT `FK_user_point_payout_user_account` FOREIGN KEY (`account_code`) REFERENCES `user_account` (`account_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_point_payout`
--

LOCK TABLES `user_point_payout` WRITE;
/*!40000 ALTER TABLE `user_point_payout` DISABLE KEYS */;
INSERT INTO `user_point_payout` VALUES ('202606241408267240','jeo7507NL202606',10000,'202606241128114586','COMPLETED','','2026-06-24 05:08:26','2026-06-24 07:52:26');
/*!40000 ALTER TABLE `user_point_payout` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_recently_viewed`
--

DROP TABLE IF EXISTS `user_recently_viewed`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_recently_viewed` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_code` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `product_code` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `viewed_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `dwell_time_seconds` int DEFAULT '0',
  `time_to_cart_seconds` int DEFAULT NULL,
  `time_to_buy_seconds` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_user_product` (`user_code`,`product_code`),
  KEY `FK_user_recently_viewed_product` (`product_code`),
  KEY `user_code` (`user_code`),
  CONSTRAINT `FK_user_recently_viewed_product` FOREIGN KEY (`product_code`) REFERENCES `product` (`product_code`),
  CONSTRAINT `FK_user_recently_viewed_user` FOREIGN KEY (`user_code`) REFERENCES `user` (`user_code`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_recently_viewed`
--

LOCK TABLES `user_recently_viewed` WRITE;
/*!40000 ALTER TABLE `user_recently_viewed` DISABLE KEYS */;
INSERT INTO `user_recently_viewed` VALUES (7,'jeo7507NL202606','20260506111049033','2026-06-29 14:00:58',7,5,NULL),(9,'jeo7507NL202606','20260209165809589','2026-07-02 13:23:55',6,NULL,3);
/*!40000 ALTER TABLE `user_recently_viewed` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_review_channel`
--

DROP TABLE IF EXISTS `user_review_channel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_review_channel` (
  `id` int NOT NULL AUTO_INCREMENT,
  `review_channel_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `channel_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `user_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `channel_url` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `meta_image` varchar(1000) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `meta_title` text COLLATE utf8mb4_general_ci,
  `meta_description` text COLLATE utf8mb4_general_ci,
  `follower_count` int DEFAULT NULL,
  `deleted` tinyint NOT NULL DEFAULT '0',
  `certifed` enum('UNAPPROVED','REVIEWING','APPROVED','REJECTED') COLLATE utf8mb4_general_ci DEFAULT 'REVIEWING',
  `reject_descript` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_user_review_channel_review_campaign_channel_view` (`channel_code`),
  KEY `FK_user_review_channel_user` (`user_code`),
  KEY `review_channel_code` (`review_channel_code`),
  CONSTRAINT `FK_user_review_channel_review_campaign_channel_view` FOREIGN KEY (`channel_code`) REFERENCES `review_campaign_channel_view` (`channel_code`),
  CONSTRAINT `FK_user_review_channel_user` FOREIGN KEY (`user_code`) REFERENCES `user` (`user_code`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_review_channel`
--

LOCK TABLES `user_review_channel` WRITE;
/*!40000 ALTER TABLE `user_review_channel` DISABLE KEYS */;
INSERT INTO `user_review_channel` VALUES (1,'202604091503088261','202603171602001','jeo7334Wt202601','https://blog.naver.com/jeongkey3317',NULL,NULL,NULL,NULL,1,'REVIEWING',NULL,'2026-04-09 06:03:08','2026-04-10 02:07:20'),(2,'202604091524092907','202603171603001','jeo7334Wt202601','https://www.instagram.com/jeongkey_moa','https://scontent-icn2-1.cdninstagram.com/v/t51.2885-19/74889142_802324103538046_8304126774971727872_n.jpg?stp=dst-jpg_s100x100_tt6&_nc_cat=104&ccb=7-5&_nc_sid=bf7eb4&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=-S46ZV0yk2IQ7kNvwH-eQGD&_nc_oc=AdrZmw78I_DNqw7UFKCuR8zDKxeXxed5hjX7z8SQzcCDXuyuzVjxN42_C3Jzmvorqm4&_nc_zt=24&_nc_ht=scontent-icn2-1.cdninstagram.com&_nc_ss=7c689&oh=00_Af0IcB1cNRC9MygIx_9BT9oBLuQ4-SSUj47Nfuv3i0NTQg&oe=69F48C59','jeongkey (@jeongkey_moa)','63 Followers, 75 Following, 24 Posts - See Instagram photos and videos from jeongkey (@jeongkey_moa)',63,1,'REVIEWING',NULL,'2026-04-09 06:24:09','2026-04-27 06:37:02'),(3,'202604101108336720','202603171602001','jeo7334Wt202601','https://blog.naver.com/jeongkey3317','https://blogpfthumb-phinf.pstatic.net/20210503_171/jeongkey3317_1620019703837UAq6n_JPEG/profileImage.jpg?type=f204_204','Jeonkey\'s LAB : 네이버 블로그','100% 주관적 시점',NULL,0,'REVIEWING',NULL,'2026-04-10 02:08:33','2026-04-17 01:36:32'),(4,'202604131023015944','202603171602001','jeo7334Wt202601','https://blog.naver.com/jeongnim33','https://ssl.pstatic.net/static/blog/icon/og_270x270.png','jeongnim33 : 네이버 블로그','당신의 모든 기록을 담는 공간',NULL,1,'REVIEWING',NULL,'2026-04-13 01:23:01','2026-04-27 05:55:34'),(5,'202604281407109012','202603171603001','jeo7334Wt202601','https://www.instagram.com/jeongkey_moa','https://scontent-icn2-1.cdninstagram.com/v/t51.2885-19/74889142_802324103538046_8304126774971727872_n.jpg?stp=dst-jpg_s100x100_tt6&_nc_cat=104&ccb=7-5&_nc_sid=bf7eb4&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=CYpxz3T4BFYQ7kNvwF5Lnuf&_nc_oc=AdpIf258jiEQG5Qh6Xw_IimBCqzJDRAakrM4iwVG_Ds-hz10N9a_jeIsmCd08oxAvb8&_nc_zt=24&_nc_ht=scontent-icn2-1.cdninstagram.com&_nc_ss=7c689&oh=00_Af5V_QDjkcHVqyi2grALiokN7pkBz0hBWD1HJhXw6PfBBA&oe=6A0852D9','jeongkey (@jeongkey_moa)','63 Followers, 76 Following, 24 Posts - See Instagram photos and videos from jeongkey (@jeongkey_moa)',63,0,'REVIEWING',NULL,'2026-04-28 05:07:10','2026-05-12 01:14:56'),(6,'202605121114238207','202603171603001','jeo7334Wt202601','https://www.instagram.com/incheonutd','https://scontent-icn2-1.cdninstagram.com/v/t51.82787-19/632410063_18509333083079854_5486903995777115729_n.jpg?stp=dst-jpg_s100x100_tt6&_nc_cat=111&ccb=7-5&_nc_sid=bf7eb4&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=DPugCUTnvTwQ7kNvwGAI1vk&_nc_oc=AdoK7JZzl2GTAaDb3OH9HPPlGuaV2DJKhj8MvE9vhXfngEaKoWGFLDYp7ShdkxFXWj0&_nc_zt=24&_nc_ht=scontent-icn2-1.cdninstagram.com&_nc_gid=fOaBDfq-DJTIgEscmTAb8w&_nc_ss=7c689&oh=00_Af5d_hijLmWsU4-WGjlysAdK3avZX3g9-9Q2V8rY8zlt8g&oe=6A08739F','인천유나이티드 프로축구단 (@incheonutd)','57K Followers, 85 Following, 13K Posts - See Instagram photos and videos from 인천유나이티드 프로축구단 (@incheonutd)',57000,1,'REVIEWING',NULL,'2026-05-12 02:14:23','2026-05-12 02:14:31'),(7,'202606111054202320','202603171602001','jeo7507NL202606','https://blog.naver.com/jeongkey3317','https://blogpfthumb-phinf.pstatic.net/20210503_171/jeongkey3317_1620019703837UAq6n_JPEG/profileImage.jpg?type=f204_204','Jeonkey\'s LAB : 네이버 블로그','100% 주관적 시점',NULL,0,'REVIEWING',NULL,'2026-06-11 01:54:20','2026-06-11 01:54:20');
/*!40000 ALTER TABLE `user_review_channel` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-08  7:37:19
