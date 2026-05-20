-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        11.2.2-MariaDB - mariadb.org binary distribution
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- newone4 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `newone4` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `newone4`;

-- 테이블 newone4.product 구조 내보내기
CREATE TABLE IF NOT EXISTS `product` (
  `p_num` int(11) NOT NULL AUTO_INCREMENT,
  `product_code` varchar(50) NOT NULL DEFAULT '0',
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `is_display` tinyint(1) DEFAULT 0,
  `is_sale` tinyint(1) DEFAULT 0,
  `has_options` tinyint(1) DEFAULT 0,
  `stock` int(11) DEFAULT 0,
  `is_unlimited_stock` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`p_num`),
  KEY `product_code` (`product_code`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 newone4.product:~4 rows (대략적) 내보내기
INSERT INTO `product` (`p_num`, `product_code`, `name`, `description`, `price`, `is_display`, `is_sale`, `has_options`, `stock`, `is_unlimited_stock`, `created_at`, `updated_at`) VALUES
	(4, '20260209133428398', 'ㅅㄷㄴㅅ', '', NULL, 0, 0, 0, 0, 1, '2026-02-09 13:34:28', '2026-02-09 13:34:28'),
	(5, '20260209134040209', '테스트', '', NULL, 0, 0, 1, 20, 1, '2026-02-09 13:40:41', '2026-02-09 13:40:41'),
	(6, '20260209165809589', 'ㅅㄷㄴㅅㅁㄴㅇㅁㄴ121', '<p>ㅁㄴㅇㅁㄴㅇ</p><p>ㅁㄴㅇ</p><p>ㅁㄴㅇㅁㄴㅇ</p><p>가나다라 마바사 아자차파타하</p><p>아야어여우유으이</p><p>에예애얘</p><p>asdasd</p>', 10000, 1, 1, 1, 40, 0, '2026-02-09 16:58:10', '2026-05-06 10:05:55'),
	(7, '20260506111049033', '다이나믹 듀오(dynamic dou) - 죽일놈', '<p>너는 뛰처나간 차문을 부슬듯이 문 닫으면서</p><p>난 머리를 쳐 박고 훔숨 쉬어 핸들을 안으면서</p><p>이런 광경이 너무 익숙해 이젠</p><p>웬만한 싸움에도 상처도 잘 안나 이제</p><p>명품 쇼핑할 때 처럼 너무 깐깐히 니 기준은</p><p>한 번 화내면 뒤끝 장난 아냐</p><p>적어도 2주는 가니까</p><p>난 성격이 너무 물러서</p><p>넌 항상 말해 남자니까 뒤로 좀 물러서</p><p>부담돼 니가 내게 결혼을 보체는 것도</p><p>난 달인처럼 대화 화제를 돌리는 법도</p><p>많이 늘었어</p><p>넌 항상 추격하고 나는 도망쳐</p><p>솔직히 말할께 난 아직 준비안됐어</p><p>지쳤어 조금 널 향한 사랑은 도금이</p><p>벗겨진 반지처럼 빛이 바랬어</p><p>오늘은 이별을 말해야 될 것 같아</p><p>지겹거든 너랑 다툴 때마다 항상 하는말</p><p></p><p>내가 죽일놈이지 뭐</p><p>우리가 어긋날 때면</p>', 12000, 1, 1, 0, 0, 1, '2026-05-06 11:10:50', '2026-05-12 11:16:28');

-- 테이블 newone4.product_category 구조 내보내기
CREATE TABLE IF NOT EXISTS `product_category` (
  `c_num` int(11) NOT NULL AUTO_INCREMENT,
  `category_code` varchar(50) NOT NULL DEFAULT '0' COMMENT '카테고리 고유 ID',
  `parent_code` varchar(50) DEFAULT NULL COMMENT '상위 카테고리 ID (최상위인 경우 NULL)',
  `name` varchar(100) NOT NULL COMMENT '카테고리명',
  `is_visible` tinyint(1) DEFAULT 1 COMMENT '노출 여부',
  `sort_order` int(11) DEFAULT 0 COMMENT '정렬 순서',
  `image_pc` varchar(255) DEFAULT NULL COMMENT 'PC용 이미지 URL',
  `image_tablet` varchar(255) DEFAULT NULL COMMENT '태블릿용 이미지 URL',
  `image_mobile` varchar(255) DEFAULT NULL COMMENT '모바일용 이미지 URL',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`c_num`) USING BTREE,
  KEY `id` (`category_code`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 newone4.product_category:~7 rows (대략적) 내보내기
INSERT INTO `product_category` (`c_num`, `category_code`, `parent_code`, `name`, `is_visible`, `sort_order`, `image_pc`, `image_tablet`, `image_mobile`, `created_at`, `updated_at`) VALUES
	(1, '260204171512', NULL, 'test', 1, 2, NULL, NULL, NULL, '2026-02-04 08:15:12', '2026-05-12 04:33:22'),
	(5, '260204173548', NULL, 'test2', 0, 4, NULL, NULL, NULL, '2026-02-04 08:35:48', '2026-02-04 08:53:50'),
	(6, '260204174620', NULL, '새 카테고리', 0, 3, NULL, NULL, NULL, '2026-02-04 08:46:20', '2026-05-12 04:33:22'),
	(7, '260204174709', '260204171512', '새 카테고리1', 1, 1, NULL, NULL, NULL, '2026-02-04 08:47:09', '2026-05-12 04:34:16'),
	(8, '260204174829', NULL, '123123', 1, 5, NULL, NULL, NULL, '2026-02-04 08:48:29', '2026-02-04 08:53:52'),
	(16, '260512125627', '260204174829', '새 카테고리', 1, 1, NULL, NULL, NULL, '2026-05-12 03:56:27', '2026-05-12 03:59:22'),
	(17, '260512133407', '260204171512', '새 카테고리2', 1, 2, NULL, NULL, NULL, '2026-05-12 04:34:07', '2026-05-12 04:34:13');

-- 테이블 newone4.product_category_connect 구조 내보내기
CREATE TABLE IF NOT EXISTS `product_category_connect` (
  `pcn_num` int(11) NOT NULL AUTO_INCREMENT,
  `product_code` varchar(50) NOT NULL DEFAULT '0',
  `category_code` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`pcn_num`),
  KEY `FK_product_category_connect_product` (`product_code`),
  KEY `FK_product_category_connect_product_category` (`category_code`),
  CONSTRAINT `FK_product_category_connect_product` FOREIGN KEY (`product_code`) REFERENCES `product` (`product_code`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_product_category_connect_product_category` FOREIGN KEY (`category_code`) REFERENCES `product_category` (`category_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='제품과 카테고리 연결';

-- 테이블 데이터 newone4.product_category_connect:~4 rows (대략적) 내보내기
INSERT INTO `product_category_connect` (`pcn_num`, `product_code`, `category_code`) VALUES
	(1, '20260209133428398', '260204171512'),
	(2, '20260209134040209', '260204171512'),
	(16, '20260209165809589', '260204171512'),
	(19, '20260506111049033', '260204171512');

-- 테이블 newone4.product_image 구조 내보내기
CREATE TABLE IF NOT EXISTS `product_image` (
  `i_num` int(11) NOT NULL AUTO_INCREMENT,
  `product_code` varchar(50) DEFAULT '0',
  `url` varchar(255) DEFAULT '0',
  `is_main` tinyint(4) NOT NULL DEFAULT 0,
  `sort_order` int(11) DEFAULT 0,
  PRIMARY KEY (`i_num`),
  KEY `FK_product_image_product` (`product_code`),
  CONSTRAINT `FK_product_image_product` FOREIGN KEY (`product_code`) REFERENCES `product` (`product_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 newone4.product_image:~5 rows (대략적) 내보내기
INSERT INTO `product_image` (`i_num`, `product_code`, `url`, `is_main`, `sort_order`) VALUES
	(15, '20260209165809589', '/uploads/2026/02/09/product/20260209165809589/1770623889549-o9z5kytsu.webp', 1, NULL),
	(16, '20260209165809589', '/uploads/2026/02/09/product/20260209165809589/1770623889702-2ahs0n5th.webp', 0, 1),
	(17, '20260209165809589', '/uploads/2026/02/09/product/20260209165809589/1770623889822-p04dqrw1p.webp', 0, 2),
	(18, '20260209165809589', '/uploads/2026/02/09/product/20260209165809589/1770623889952-k68ee4qzz.webp', 0, 3),
	(19, '20260506111049033', '/uploads/2026/05/06/product/20260506111049033/1778033449931-glar5v2x6.webp', 1, NULL);

-- 테이블 newone4.product_inquiry 구조 내보내기
CREATE TABLE IF NOT EXISTS `product_inquiry` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_code` varchar(50) NOT NULL DEFAULT '0',
  `product_inquiry_code` varchar(50) NOT NULL DEFAULT '0',
  `user_code` varchar(50) NOT NULL DEFAULT '0',
  `type` enum('PRODUCT','DELIVERY','ACC') NOT NULL DEFAULT 'PRODUCT',
  `content` text NOT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `is_secret` tinyint(4) NOT NULL DEFAULT 0,
  `status` enum('PENDING','ANSWERED') NOT NULL DEFAULT 'PENDING',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `FK_product_inquiry_product` (`product_code`),
  KEY `product_inquiry_code` (`product_inquiry_code`),
  CONSTRAINT `FK_product_inquiry_product` FOREIGN KEY (`product_code`) REFERENCES `product` (`product_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 newone4.product_inquiry:~1 rows (대략적) 내보내기
INSERT INTO `product_inquiry` (`id`, `product_code`, `product_inquiry_code`, `user_code`, `type`, `content`, `images`, `is_secret`, `status`, `created_at`, `updated_at`) VALUES
	(3, '20260209165809589', '202603061210549377', 'jeo7334Wt202601', 'ACC', '<p>ㅁㄴㅇㄻㄴㄹㅇ</p><p>ㅁㄴㅇㄹ</p><p>ㅁㄴㄴㅇㄹ</p><p>ㅁㄴㅇㄹ</p><p>ㅁㄴㅇㄹ</p><p>ㅁㄴㅇㄻㄴㅇ</p>', NULL, 0, 'PENDING', '2026-03-06 12:10:54', '2026-03-06 12:10:54');

-- 테이블 newone4.product_inquiry_answer 구조 내보내기
CREATE TABLE IF NOT EXISTS `product_inquiry_answer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `answer_code` varchar(50) NOT NULL DEFAULT '0',
  `product_inquiry_code` varchar(50) NOT NULL DEFAULT '0',
  `answer` text NOT NULL,
  `user_code` varchar(50) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `FK_product_inquiry_answer_product_inquiry` (`product_inquiry_code`),
  CONSTRAINT `FK_product_inquiry_answer_product_inquiry` FOREIGN KEY (`product_inquiry_code`) REFERENCES `product_inquiry` (`product_inquiry_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 newone4.product_inquiry_answer:~0 rows (대략적) 내보내기

-- 테이블 newone4.product_option 구조 내보내기
CREATE TABLE IF NOT EXISTS `product_option` (
  `option_num` int(11) NOT NULL AUTO_INCREMENT,
  `product_code` varchar(50) NOT NULL DEFAULT '0',
  `product_option_code` varchar(50) NOT NULL DEFAULT '0',
  `name` varchar(50) NOT NULL DEFAULT '0',
  `value` varchar(50) NOT NULL DEFAULT '0',
  `stock` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`option_num`),
  KEY `FK_product_option_product` (`product_code`),
  KEY `product_option_code` (`product_option_code`),
  CONSTRAINT `FK_product_option_product` FOREIGN KEY (`product_code`) REFERENCES `product` (`product_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 newone4.product_option:~4 rows (대략적) 내보내기
INSERT INTO `product_option` (`option_num`, `product_code`, `product_option_code`, `name`, `value`, `stock`) VALUES
	(9, '20260209165809589', 'opt20260209165809589', '컬러', '블루', '10'),
	(10, '20260209165809589', 'opt20260209165809015', '컬러', '레드', '10'),
	(11, '20260209165809589', 'opt20260209165809142', '컬러', '블랙', '10'),
	(12, '20260209165809589', 'opt20260209165809180', '컬러', '퍼플', '10');

-- 테이블 newone4.product_order 구조 내보내기
CREATE TABLE IF NOT EXISTS `product_order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_code` varchar(50) NOT NULL DEFAULT '0',
  `user_code` varchar(50) NOT NULL DEFAULT '0',
  `address_code` varchar(50) NOT NULL DEFAULT '0',
  `total_product_price` double NOT NULL DEFAULT 0 COMMENT '제품 금액 총합(할인 적용 후)',
  `delivery_price` double NOT NULL DEFAULT 0 COMMENT '배송비',
  `used_mileage` double NOT NULL DEFAULT 0 COMMENT '마일리지 사용',
  `actual_payment_amount` double NOT NULL DEFAULT 0 COMMENT '실제 결제 비용',
  `status` enum('PENDING','PAID','PROCESSING','SHIPPING','DELIVERED','COMPLETED','CANCEL','CLAIM') NOT NULL DEFAULT 'PENDING',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `order_code` (`order_code`),
  KEY `FK_product_order_user` (`user_code`),
  KEY `FK_product_order_user_address` (`address_code`),
  CONSTRAINT `FK_product_order_user` FOREIGN KEY (`user_code`) REFERENCES `user` (`user_code`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_product_order_user_address` FOREIGN KEY (`address_code`) REFERENCES `user_address` (`address_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 newone4.product_order:~3 rows (대략적) 내보내기
INSERT INTO `product_order` (`id`, `order_code`, `user_code`, `address_code`, `total_product_price`, `delivery_price`, `used_mileage`, `actual_payment_amount`, `status`, `created_at`) VALUES
	(7, '202605151407488202', 'jeo7334Wt202601', '202604081121299155', 75000, 0, 0, 75000, 'PENDING', '2026-05-15 05:07:48'),
	(8, '202605180929164816', 'jeo7334Wt202601', '202604081121299155', 9000, 3500, 0, 12500, 'PROCESSING', '2026-05-18 00:29:16'),
	(9, '202605181007243694', 'jeo7334Wt202601', '202604081121299155', 75000, 0, 0, 75000, 'COMPLETED', '2026-05-18 01:07:24');

-- 테이블 newone4.product_order_basket 구조 내보내기
CREATE TABLE IF NOT EXISTS `product_order_basket` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_basket_code` varchar(50) NOT NULL,
  `user_code` varchar(50) NOT NULL,
  `product_code` varchar(50) NOT NULL,
  `product_option_code` varchar(50) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `order_basket_code` (`order_basket_code`),
  KEY `FK_product_order_basket_user` (`user_code`),
  KEY `FK_product_order_basket_product` (`product_code`),
  KEY `FK_product_order_basket_product_option` (`product_option_code`),
  CONSTRAINT `FK_product_order_basket_product` FOREIGN KEY (`product_code`) REFERENCES `product` (`product_code`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_product_order_basket_product_option` FOREIGN KEY (`product_option_code`) REFERENCES `product_option` (`product_option_code`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_product_order_basket_user` FOREIGN KEY (`user_code`) REFERENCES `user` (`user_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 newone4.product_order_basket:~3 rows (대략적) 내보내기
INSERT INTO `product_order_basket` (`id`, `order_basket_code`, `user_code`, `product_code`, `product_option_code`, `quantity`, `created_at`, `updated_at`) VALUES
	(4, '202605081337218659', 'jeo7334Wt202601', '20260209165809589', 'opt20260209165809589', 5, '2026-05-08 04:37:21', '2026-05-11 02:18:08'),
	(10, '202605081512545832', 'jeo7334Wt202601', '20260506111049033', NULL, 1, '2026-05-08 06:12:54', '2026-05-08 06:12:54'),
	(11, '202605111650532077', 'jeo7334Wt202601', '20260209165809589', 'opt20260209165809142', 1, '2026-05-11 07:50:53', '2026-05-11 07:50:53'),
	(12, '202605121117118678', 'jeo7334Wt202601', '20260209165809589', 'opt20260209165809180', 1, '2026-05-12 02:17:11', '2026-05-12 02:17:11');

-- 테이블 newone4.product_order_claim 구조 내보내기
CREATE TABLE IF NOT EXISTS `product_order_claim` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_claim_code` varchar(50) NOT NULL DEFAULT '0',
  `order_code` varchar(50) NOT NULL DEFAULT '0',
  `order_item_code` varchar(50) NOT NULL DEFAULT '0',
  `user_code` varchar(50) NOT NULL DEFAULT '0',
  `claim_type` enum('CANCEL','RETURN','EXCHANGE') NOT NULL DEFAULT 'CANCEL',
  `claim_status` enum('REQUESTED','PROCESSING','COMPLETED','REJECTED') NOT NULL DEFAULT 'REQUESTED',
  `claim_quantity` int(11) NOT NULL,
  `fault_party` enum('BUYER','SELLER') NOT NULL DEFAULT 'BUYER',
  `reason_category` enum('MIND','DEFECTIVE','WRONG','MISSING','DELAYED','OUT','OTHER') NOT NULL DEFAULT 'MIND',
  `reason_detail` text NOT NULL,
  `target_product_amount` double NOT NULL DEFAULT 0,
  `deducted_delivery_fee` double NOT NULL DEFAULT 0,
  `total_refund_amount` double NOT NULL DEFAULT 0,
  `refund_method` enum('ORIGINAL_PAYMENT','MILEAGE_ONLY') NOT NULL DEFAULT 'ORIGINAL_PAYMENT',
  `refund_mileage` double NOT NULL DEFAULT 0,
  `refund_cash` double NOT NULL DEFAULT 0,
  `return_tracking_number` varchar(100) NOT NULL DEFAULT '0' COMMENT '구매자에게로부터 교환, 반품으로 판매자에게 돌아오는 송장번호',
  `return_tacking_company` varchar(100) NOT NULL DEFAULT '0' COMMENT '구매자에게로부터 교환, 반품으로 판매자에게 돌아오는 택배사',
  `exchange_tracking_number` varchar(100) NOT NULL DEFAULT '0' COMMENT '판매자가 구매자에게 클래임으로 인해 재발송한 송장번호',
  `exchange_tacking_company` varchar(100) NOT NULL DEFAULT '0' COMMENT '판매자가 구매자에게 클래임으로 인해 재발송한 택배사',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_claim_code` (`order_claim_code`),
  KEY `FK_product_order_claim_product_order` (`order_code`),
  KEY `FK_product_order_claim_product_order_item` (`order_item_code`),
  KEY `FK_product_order_claim_user` (`user_code`),
  CONSTRAINT `FK_product_order_claim_product_order` FOREIGN KEY (`order_code`) REFERENCES `product_order` (`order_code`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_product_order_claim_product_order_item` FOREIGN KEY (`order_item_code`) REFERENCES `product_order_item` (`order_item_code`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_product_order_claim_user` FOREIGN KEY (`user_code`) REFERENCES `user` (`user_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 newone4.product_order_claim:~0 rows (대략적) 내보내기

-- 테이블 newone4.product_order_delivery 구조 내보내기
CREATE TABLE IF NOT EXISTS `product_order_delivery` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `delivery_code` varchar(50) NOT NULL DEFAULT '0',
  `order_code` varchar(50) NOT NULL DEFAULT '0',
  `order_item_code` varchar(50) NOT NULL DEFAULT '0',
  `post_company` varchar(255) NOT NULL DEFAULT '0',
  `post_number` varchar(255) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `delivery_code` (`delivery_code`),
  KEY `FK_product_order_delivery_product_order` (`order_code`),
  KEY `FK_product_order_delivery_product_order_item` (`order_item_code`),
  CONSTRAINT `FK_product_order_delivery_product_order` FOREIGN KEY (`order_code`) REFERENCES `product_order` (`order_code`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_product_order_delivery_product_order_item` FOREIGN KEY (`order_item_code`) REFERENCES `product_order_item` (`order_item_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 newone4.product_order_delivery:~5 rows (대략적) 내보내기
INSERT INTO `product_order_delivery` (`id`, `delivery_code`, `order_code`, `order_item_code`, `post_company`, `post_number`, `created_at`) VALUES
	(11, '202605191728058504', '202605181007243694', '202605181007241781', '한진택배', '698033969812', '2026-05-20 11:54:54'),
	(12, '202605191728050302', '202605181007243694', '202605181007245917', '한진택배', '698033969812', '2026-05-20 11:54:54'),
	(13, '202605191728057591', '202605181007243694', '202605181007243203', '한진택배', '698033969812', '2026-05-20 11:54:54'),
	(14, '202605191728056892', '202605181007243694', '202605181007244287', '한진택배', '698033969812', '2026-05-20 11:54:54'),
	(15, '202605191728053650', '202605180929164816', '202605180929167660', 'CJ 대한통운', '153154314', '2026-05-20 11:54:54');

-- 테이블 newone4.product_order_item 구조 내보내기
CREATE TABLE IF NOT EXISTS `product_order_item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_item_code` varchar(50) NOT NULL DEFAULT '0',
  `order_code` varchar(50) NOT NULL DEFAULT '0',
  `product_code` varchar(50) NOT NULL,
  `product_option_code` varchar(50) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `discount_type` enum('FIXED','PERCENT') DEFAULT 'FIXED',
  `discount_value` double DEFAULT 1,
  `price` double NOT NULL,
  `status` enum('PROCESSING','SHIPPING','DELIVERED','COMPLETED','CANCELED','EXCHANGE','RETURN') NOT NULL DEFAULT 'PROCESSING',
  `delivery_number` varchar(255) DEFAULT NULL,
  `delivery_company` varchar(255) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `product_option_label` varchar(255) DEFAULT NULL,
  `product_option_value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_item_code` (`order_item_code`),
  KEY `FK_product_order_item_product_order` (`order_code`),
  KEY `FK_product_order_item_product` (`product_code`),
  KEY `FK_product_order_item_product_option` (`product_option_code`),
  CONSTRAINT `FK_product_order_item_product` FOREIGN KEY (`product_code`) REFERENCES `product` (`product_code`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_product_order_item_product_option` FOREIGN KEY (`product_option_code`) REFERENCES `product_option` (`product_option_code`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_product_order_item_product_order` FOREIGN KEY (`order_code`) REFERENCES `product_order` (`order_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 newone4.product_order_item:~9 rows (대략적) 내보내기
INSERT INTO `product_order_item` (`id`, `order_item_code`, `order_code`, `product_code`, `product_option_code`, `quantity`, `discount_type`, `discount_value`, `price`, `status`, `delivery_number`, `delivery_company`, `product_name`, `product_option_label`, `product_option_value`) VALUES
	(25, '202605151407483464', '202605151407488202', '20260209165809589', 'opt20260209165809589', 5, 'FIXED', 1000, 45000, 'PROCESSING', NULL, NULL, 'ㅅㄷㄴㅅㅁㄴㅇㅁㄴ121', '컬러', '블루'),
	(26, '202605151407485046', '202605151407488202', '20260506111049033', NULL, 1, NULL, NULL, 12000, 'PROCESSING', NULL, NULL, '다이나믹 듀오(dynamic dou) - 죽일놈', '컬러', NULL),
	(27, '202605151407485943', '202605151407488202', '20260209165809589', 'opt20260209165809142', 1, 'FIXED', 1000, 9000, 'PROCESSING', NULL, NULL, 'ㅅㄷㄴㅅㅁㄴㅇㅁㄴ121', '컬러', '블랙'),
	(28, '202605151407488126', '202605151407488202', '20260209165809589', 'opt20260209165809180', 1, 'FIXED', 1000, 9000, 'PROCESSING', NULL, NULL, 'ㅅㄷㄴㅅㅁㄴㅇㅁㄴ121', '컬러', '퍼플'),
	(29, '202605180929167660', '202605180929164816', '20260209165809589', 'opt20260209165809589', 1, 'FIXED', 1000, 9000, 'PROCESSING', NULL, NULL, 'ㅅㄷㄴㅅㅁㄴㅇㅁㄴ121', '컬러', '블루'),
	(30, '202605181007241781', '202605181007243694', '20260209165809589', 'opt20260209165809589', 5, 'FIXED', 1000, 45000, 'PROCESSING', NULL, NULL, 'ㅅㄷㄴㅅㅁㄴㅇㅁㄴ121', '컬러', '블루'),
	(31, '202605181007245917', '202605181007243694', '20260506111049033', NULL, 1, NULL, NULL, 12000, 'PROCESSING', NULL, NULL, '다이나믹 듀오(dynamic dou) - 죽일놈', '컬러', NULL),
	(32, '202605181007243203', '202605181007243694', '20260209165809589', 'opt20260209165809142', 1, 'FIXED', 1000, 9000, 'PROCESSING', NULL, NULL, 'ㅅㄷㄴㅅㅁㄴㅇㅁㄴ121', '컬러', '블랙'),
	(33, '202605181007244287', '202605181007243694', '20260209165809589', 'opt20260209165809180', 1, 'FIXED', 1000, 9000, 'PROCESSING', NULL, NULL, 'ㅅㄷㄴㅅㅁㄴㅇㅁㄴ121', '컬러', '퍼플');

-- 테이블 newone4.product_order_payment 구조 내보내기
CREATE TABLE IF NOT EXISTS `product_order_payment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `payment_code` varchar(50) NOT NULL DEFAULT '0' COMMENT 'orderId를 대체',
  `order_code` varchar(50) NOT NULL DEFAULT '0',
  `payment_type` enum('CARD','BANK','ESCROW') NOT NULL DEFAULT 'CARD',
  `deposit_name` varchar(255) DEFAULT NULL,
  `payment_deadline` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `payment_code` (`payment_code`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 newone4.product_order_payment:~3 rows (대략적) 내보내기
INSERT INTO `product_order_payment` (`id`, `payment_code`, `order_code`, `payment_type`, `deposit_name`, `payment_deadline`) VALUES
	(7, '202605151407481535', '202605151407488202', 'BANK', 'asdf', '2026-05-20 23:59:59'),
	(8, '202605180929164124', '202605180929164816', 'BANK', 'asdf', '2026-05-23 23:59:59'),
	(9, '202605181007249103', '202605181007243694', 'BANK', 'ㅁㄴㅇㅇㅁㄴㄹ', '2026-05-23 23:59:59');

-- 테이블 newone4.product_promotion 구조 내보내기
CREATE TABLE IF NOT EXISTS `product_promotion` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '프로모션 ID',
  `name` varchar(255) NOT NULL COMMENT '프로모션명',
  `product_promotion_code` varchar(50) DEFAULT NULL COMMENT '프로모션 코드',
  `discount_type` enum('percentage','fixed') NOT NULL DEFAULT 'percentage' COMMENT '할인 유형 (비율/고정금액)',
  `discount_value` decimal(10,2) NOT NULL COMMENT '할인 값 (비율 또는 금액)',
  `start_date` datetime NOT NULL COMMENT '시작 일시',
  `end_date` datetime NOT NULL COMMENT '종료 일시',
  `description` text DEFAULT NULL COMMENT '프로모션 설명',
  `is_active` tinyint(1) DEFAULT 1 COMMENT '활성화 여부',
  `created_at` datetime DEFAULT current_timestamp() COMMENT '생성 일시',
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정 일시',
  PRIMARY KEY (`id`),
  KEY `product_promotion_code` (`product_promotion_code`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 newone4.product_promotion:~1 rows (대략적) 내보내기
INSERT INTO `product_promotion` (`id`, `name`, `product_promotion_code`, `discount_type`, `discount_value`, `start_date`, `end_date`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
	(5, '테스트', '202605111029548025', 'fixed', 1000.00, '2026-05-11 00:00:00', '2026-05-19 00:00:00', '테스트', 1, '2026-05-11 10:29:54', '2026-05-11 10:29:54');

-- 테이블 newone4.product_promotion_target 구조 내보내기
CREATE TABLE IF NOT EXISTS `product_promotion_target` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '타겟 ID',
  `product_promotion_code` varchar(50) DEFAULT NULL,
  `target_type` enum('all','category','product') NOT NULL COMMENT '타겟 유형 (전체/카테고리/상품)',
  `target_code` varchar(50) DEFAULT NULL COMMENT '타겟 대상 ID (카테고리 ID 또는 상품 ID)',
  `created_at` datetime DEFAULT current_timestamp() COMMENT '생성 일시',
  PRIMARY KEY (`id`),
  KEY `FK_product_promotion_target_product_promotion` (`product_promotion_code`),
  CONSTRAINT `FK_product_promotion_target_product_promotion` FOREIGN KEY (`product_promotion_code`) REFERENCES `product_promotion` (`product_promotion_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 newone4.product_promotion_target:~3 rows (대략적) 내보내기
INSERT INTO `product_promotion_target` (`id`, `product_promotion_code`, `target_type`, `target_code`, `created_at`) VALUES
	(5, '202605111029548025', 'product', '20260209165809589', '2026-05-11 10:29:54'),
	(6, NULL, 'product', '20260209165809589', '2026-05-11 10:48:29'),
	(7, NULL, 'product', '20260506111049033', '2026-05-11 10:48:29');

-- 테이블 newone4.product_review 구조 내보내기
CREATE TABLE IF NOT EXISTS `product_review` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_code` varchar(50) NOT NULL DEFAULT '0',
  `review_code` varchar(50) NOT NULL DEFAULT '0',
  `user_code` varchar(50) DEFAULT NULL,
  `order_code` varchar(50) DEFAULT NULL,
  `rating` double NOT NULL DEFAULT 0,
  `content` text NOT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `review_code` (`review_code`),
  KEY `FK_product_review_product` (`product_code`),
  KEY `FK_product_review_user` (`user_code`),
  KEY `FK_product_review_product_order` (`order_code`),
  CONSTRAINT `FK_product_review_product` FOREIGN KEY (`product_code`) REFERENCES `product` (`product_code`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_product_review_product_order` FOREIGN KEY (`order_code`) REFERENCES `product_order` (`order_code`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_product_review_user` FOREIGN KEY (`user_code`) REFERENCES `user` (`user_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 newone4.product_review:~1 rows (대략적) 내보내기
INSERT INTO `product_review` (`id`, `product_code`, `review_code`, `user_code`, `order_code`, `rating`, `content`, `images`, `created_at`, `updated_at`) VALUES
	(12, '20260209165809589', '202603061206361803', 'jeo7334Wt202601', NULL, 3, '<p>ㄴㅁㄹㅇㅁㄴㅇㄻㄴㅇㄹ</p><p>ㅁㄴㅇㄻㄴㅇ</p><p>ㄻㄴㅇㄹ</p><p>ㅁㄴㅇㄹ</p><p>ㄴㅁㅇㄹ</p><p>ㅁㄴㅇㄹ</p><p>ㅁㄴㅇㄻㄴㅇ</p>', NULL, '2026-03-06 12:06:36', '2026-03-06 12:06:36');

-- 테이블 newone4.refresh_tokens 구조 내보내기
CREATE TABLE IF NOT EXISTS `refresh_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_code` varchar(50) NOT NULL DEFAULT '0',
  `token` text NOT NULL,
  `expiresAt` datetime NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_code` (`user_code`),
  CONSTRAINT `FK_refresh_tokens_user` FOREIGN KEY (`user_code`) REFERENCES `user` (`user_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 newone4.refresh_tokens:~5 rows (대략적) 내보내기
INSERT INTO `refresh_tokens` (`id`, `user_code`, `token`, `expiresAt`, `createdAt`) VALUES
	(4, 'jeo7334Wt202601', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfY29kZSI6ImplbzczMzRXdDIwMjYwMSIsImVtYWlsIjoiamVvbmdrZXkzMzE3QG5hdmVyLmNvbSIsIm5hbWUiOiLrr7zsoJXquLAiLCJwYXNzd29yZCI6IiQyYiQxMCROcFhnMTZlMkdCVGdHRllyS1RoUHp1a1JnYXROeWVzUnFZVVROODJIVFJMNkJ4elJaLm9WcSIsIm1hcmtldGluZ0FncmVlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjpbMV19LCJwcm9maWxlIjpudWxsLCJyb2xlIjoiVVNFUiIsInN0YXR1cyI6IkFDVElWRSJ9LCJpYXQiOjE3Njk2NTk1NjIsImV4cCI6MTc3MDI2NDM2Mn0.X66tl8mDal9shwAnjwXDHq-K-c2Jqvtq4ZuVIxkVVqA', '2026-02-05 13:06:02', '2026-01-29 13:06:02'),
	(31, 'jeo7334Wt202601', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfY29kZSI6ImplbzczMzRXdDIwMjYwMSIsInJvbGUiOiJVU0VSIiwicHJvZmlsZSI6bnVsbH0sImlhdCI6MTc3MjYwNjg1OSwiZXhwIjoxNzczMjExNjU5fQ.GB5v_jpXDuka80imLH-uBCRVFEz6vmn5xL6dZLVCV2E', '2026-03-11 15:47:39', '2026-03-04 15:47:39'),
	(36, 'jeo7334Wt202601', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfY29kZSI6ImplbzczMzRXdDIwMjYwMSIsInJvbGUiOiJVU0VSIiwic3RhdHVzIjoiQUNUSVZFIiwicHJvZmlsZSI6bnVsbCwibmFtZSI6IuuvvOygleq4sCIsImVtYWlsIjoiamVvbmdrZXkzMzE3QG5hdmVyLmNvbSJ9LCJpYXQiOjE3NzUxODI1NzMsImV4cCI6MTc3NTc4NzM3M30.UMiGbf12FM5pQPGyHhgduI7fk4nd9NpxfauuXio8bPA', '2026-04-10 11:16:13', '2026-04-03 11:16:13'),
	(37, 'jeo7334Wt202601', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfY29kZSI6ImplbzczMzRXdDIwMjYwMSIsInJvbGUiOiJVU0VSIiwic3RhdHVzIjoiQUNUSVZFIiwicHJvZmlsZSI6bnVsbCwibmFtZSI6IuuvvOygleq4sCIsImVtYWlsIjoiamVvbmdrZXkzMzE3QG5hdmVyLmNvbSJ9LCJpYXQiOjE3NzU3ODg0OTAsImV4cCI6MTc3NjM5MzI5MH0.xX2hfBKLwBSv2SzWzx7t1KHAhpsP6KLXGOIoV4fBY-M', '2026-04-17 11:34:50', '2026-04-10 11:34:50'),
	(38, 'jeo7334Wt202601', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfY29kZSI6ImplbzczMzRXdDIwMjYwMSIsInJvbGUiOiJVU0VSIiwic3RhdHVzIjoiQUNUSVZFIiwicHJvZmlsZSI6bnVsbCwibmFtZSI6IuuvvOygleq4sCIsImVtYWlsIjoiamVvbmdrZXkzMzE3QG5hdmVyLmNvbSJ9LCJpYXQiOjE3NzYzOTkwOTYsImV4cCI6MTc3NzAwMzg5Nn0.OJU9HJi3dfwtDEEU5Ba57TZOnhAFJ8EDJHutK7Hlj8k', '2026-04-24 13:11:36', '2026-04-17 13:11:36'),
	(41, 'jeo7334Wt202601', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2NvZGUiOiJqZW83MzM0V3QyMDI2MDEiLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdGF0dXMiOiJBQ1RJVkUiLCJwcm9maWxlIjpudWxsLCJuYW1lIjoi66-87KCV6riwIiwiZW1haWwiOiJqZW9uZ2tleTMzMTdAbmF2ZXIuY29tIiwiaWF0IjoxNzc4MDM1NTE2LCJleHAiOjE3Nzg2NDAzMTZ9.ySEO2eJBDJXoidFJ9Ud2Q892xfMXRY7lng339fbjPww', '2026-05-13 11:45:16', '2026-05-06 11:45:16'),
	(42, 'jeo7334Wt202601', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2NvZGUiOiJqZW83MzM0V3QyMDI2MDEiLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdGF0dXMiOiJBQ1RJVkUiLCJwcm9maWxlIjpudWxsLCJuYW1lIjoi66-87KCV6riwIiwiZW1haWwiOiJqZW9uZ2tleTMzMTdAbmF2ZXIuY29tIiwiaWF0IjoxNzc4NjUzNDY3LCJleHAiOjE3NzkyNTgyNjd9.aKfY84EPTFGZyndA7dWqhPmiSmo8HylOehjYfuzNdK8', '2026-05-20 15:24:27', '2026-05-13 15:24:27');

-- 테이블 newone4.review_campaign 구조 내보내기
CREATE TABLE IF NOT EXISTS `review_campaign` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `campaign_code` varchar(50) NOT NULL DEFAULT '0',
  `product_name` varchar(255) NOT NULL DEFAULT '0',
  `title` varchar(50) NOT NULL DEFAULT '0',
  `short_description` varchar(50) NOT NULL DEFAULT '0',
  `is_display` tinyint(4) NOT NULL DEFAULT 0,
  `user_code` varchar(50) NOT NULL COMMENT '관리자 계정',
  `campaign_category_code` varchar(50) NOT NULL DEFAULT '0',
  `campaign_type` enum('DELIVERY','VISIT','REPORTER','PURCHASE') NOT NULL DEFAULT 'DELIVERY',
  `state` enum('DRAFT','PENDING','SCHEDULED','RECRUITING','CLOSED','SELECTING','REVIEWING','COMPLETED') NOT NULL DEFAULT 'DRAFT' COMMENT 'draft=임시저장, pending=대기, scheduled=준비중, recruiting=모집중, closed=종료, selecting=선정중, reviewing=작성중, completed=완료',
  `max_applicants` int(11) NOT NULL DEFAULT 0,
  `main_image` varchar(255) NOT NULL DEFAULT '0',
  `detail_images` text DEFAULT NULL,
  `content` text NOT NULL,
  `start_application_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `end_application_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `reviewer_selection_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `start_write_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `end_write_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `FK_review_campaign_user` (`user_code`),
  KEY `campaign_code` (`campaign_code`),
  KEY `FK_review_campaign_review_campaign_category` (`campaign_category_code`) USING BTREE,
  CONSTRAINT `FK_review_campaign_user` FOREIGN KEY (`user_code`) REFERENCES `user` (`user_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 newone4.review_campaign:~4 rows (대략적) 내보내기
INSERT INTO `review_campaign` (`id`, `campaign_code`, `product_name`, `title`, `short_description`, `is_display`, `user_code`, `campaign_category_code`, `campaign_type`, `state`, `max_applicants`, `main_image`, `detail_images`, `content`, `start_application_date`, `end_application_date`, `reviewer_selection_date`, `start_write_date`, `end_write_date`, `created_at`, `updated_at`) VALUES
	(11, '202603251523561942', '와바미 파데', '와바미 뷰티', '와바미에서 만든 뷰티 브랜드!!', 1, 'jeo7334Wt202601', '20260402141854001', 'DELIVERY', 'COMPLETED', 10, '/uploads/2026/03/25/review/20260325152356099/1774419836258-zxsqcl4be.webp', '["/uploads/2026/03/27/review/20260327144427556_d0/1774590267260-yniyp0wrg.webp","/uploads/2026/03/27/review/20260327143905099_d1/1774589945886-pqqagjgoe.webp","/uploads/2026/03/27/review/20260327143905099_d0/1774589945778-iuy4g4waf.webp","/uploads/2026/03/27/review/20260327143905099_d2/1774589946601-sw4g6bafx.webp"]', '이것 저것 그것 베이비', '2026-02-26 00:00:00', '2026-04-20 00:00:00', '2026-04-21 00:00:00', '2026-04-22 00:00:00', '2026-04-26 00:00:00', '2026-03-25 15:23:56', '2026-04-22 12:04:27'),
	(12, '202604231037085673', '와바미 닥터버니 티모시 베이직', '와바미 토끼사료 닥터 버니', '캠페인 테스트', 1, 'jeo7334Wt202601', '20260402141854001', 'DELIVERY', 'RECRUITING', 5, '/uploads/2026/04/23/review/20260423103708876/1776908228828-pkvk84bbc.webp', '["/uploads/2026/04/23/review/20260423103708876_d0/1776908229020-ar09x4mea.webp","/uploads/2026/04/23/review/20260423103708876_d1/1776908229796-n9c5fkpvj.webp","/uploads/2026/04/23/review/20260423103708876_d2/1776908230511-ygi1hx21i.webp"]', '이건 테스트임', '2026-04-23 00:00:00', '2026-05-18 00:00:00', '2026-05-19 00:00:00', '2026-05-19 00:00:00', '2026-05-24 00:00:00', '2026-04-23 10:37:11', '2026-05-11 16:35:37'),
	(14, '202605121348356767', '제품명 테스트', '테스트2', 'ㅁㅇㄹ우ㅏ', 1, 'jeo7334Wt202601', '20260402142217001', 'VISIT', 'RECRUITING', 10, '/uploads/2026/05/12/review/20260512135111209/1778561471360-fpwth31r7.webp', '["/uploads/2026/05/12/review/20260512135540197_d0/1778561740411-henle2u1t.webp","/uploads/2026/05/12/review/20260512140252078_d0/1778562172308-gzmpx16kn.webp"]', 'ㅁㄴㅇㄹㄴㅁㅇㄻㄴㅇㄹㄴㅁㅇㄹ\r\n\r\nㅁㄴㅇㄻㄴㅇㄹ\r\nㅁㄴㅇㄹ\r\nㅁㄴㅇㄹ\r\nㅁㄴㅇㄹ\r\nㅁㄴㅇㄹ\r\nㅁㄴㅇㄹ\r\nㅁㄴㅇㄻ', '2026-05-12 00:00:00', '2026-05-20 00:00:00', '2026-05-21 00:00:00', '2026-05-21 00:00:00', '2026-05-25 00:00:00', '2026-05-12 13:48:35', '2026-05-12 14:14:12'),
	(15, '202605121412250150', 'ㅁㄴㅇㅁㄴㅇ', 'loading test', '', 1, 'jeo7334Wt202601', '', 'VISIT', 'DRAFT', 0, '', NULL, '', '2026-05-12 00:00:00', '2026-05-20 00:00:00', '2026-05-21 00:00:00', '2026-05-21 00:00:00', '2026-06-01 00:00:00', '2026-05-12 14:12:25', '2026-05-12 14:12:25');

-- 테이블 newone4.review_campaign_application 구조 내보내기
CREATE TABLE IF NOT EXISTS `review_campaign_application` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `campaign_application_code` varchar(50) NOT NULL DEFAULT '0',
  `campaign_code` varchar(50) NOT NULL DEFAULT '0',
  `user_code` varchar(50) NOT NULL DEFAULT '0',
  `address_code` varchar(50) NOT NULL,
  `status` enum('APPLIED','SELECTED','REJECTED','CANCELLED','SUBMITTED','RETURNED','COMPLETED') NOT NULL DEFAULT 'APPLIED',
  `applied_at` datetime NOT NULL DEFAULT current_timestamp(),
  `selected_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `FK_review_campaign_application_review_campaign` (`campaign_code`),
  KEY `FK_review_campaign_application_user` (`user_code`),
  KEY `address_code` (`address_code`),
  KEY `campaign_application_code` (`campaign_application_code`),
  CONSTRAINT `FK_review_campaign_application_review_campaign` FOREIGN KEY (`campaign_code`) REFERENCES `review_campaign` (`campaign_code`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_review_campaign_application_user` FOREIGN KEY (`user_code`) REFERENCES `user` (`user_code`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_review_campaign_application_user_address` FOREIGN KEY (`address_code`) REFERENCES `user_address` (`address_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 newone4.review_campaign_application:~4 rows (대략적) 내보내기
INSERT INTO `review_campaign_application` (`id`, `campaign_application_code`, `campaign_code`, `user_code`, `address_code`, `status`, `applied_at`, `selected_at`, `created_at`, `updated_at`) VALUES
	(10, '202604211541539460', '202603251523561942', 'jeo7334Wt202601', '202604081121299155', 'COMPLETED', '2026-04-21 15:41:53', NULL, '2026-04-21 15:41:53', '2026-04-22 11:32:16'),
	(11, '202604231037379557', '202604231037085673', 'jeo7334Wt202601', '202604081121299155', 'CANCELLED', '2026-04-23 10:37:37', NULL, '2026-04-23 10:37:37', '2026-04-27 15:37:02'),
	(14, '202605121031155241', '202604231037085673', 'jeo7334Wt202601', '202604081121299155', 'CANCELLED', '2026-05-12 10:31:15', NULL, '2026-05-12 10:31:15', '2026-05-12 10:45:34'),
	(15, '202605121112386489', '202604231037085673', 'jeo7334Wt202601', '202604211324085275', 'CANCELLED', '2026-05-12 11:12:38', NULL, '2026-05-12 11:12:38', '2026-05-12 11:12:56');

-- 테이블 newone4.review_campaign_application_channel 구조 내보내기
CREATE TABLE IF NOT EXISTS `review_campaign_application_channel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `campaign_application_channel_code` varchar(50) NOT NULL DEFAULT '0',
  `campaign_application_code` varchar(50) NOT NULL DEFAULT '0',
  `review_channel_code` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_campaign_application_code` (`campaign_application_code`),
  KEY `FK_review_campaign_application_channel_user_review_channel` (`review_channel_code`),
  CONSTRAINT `FK_campaign_application_code` FOREIGN KEY (`campaign_application_code`) REFERENCES `review_campaign_application` (`campaign_application_code`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_review_campaign_application_channel_user_review_channel` FOREIGN KEY (`review_channel_code`) REFERENCES `user_review_channel` (`review_channel_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 newone4.review_campaign_application_channel:~4 rows (대략적) 내보내기
INSERT INTO `review_campaign_application_channel` (`id`, `campaign_application_channel_code`, `campaign_application_code`, `review_channel_code`) VALUES
	(3, '202604211541532951', '202604211541539460', '202604101108336720'),
	(4, '202604231037384646', '202604231037379557', '202604091524092907'),
	(7, '202605121031161263', '202605121031155241', '202604281407109012'),
	(8, '202605121112400853', '202605121112386489', '202604281407109012');

-- 테이블 newone4.review_campaign_application_delivery 구조 내보내기
CREATE TABLE IF NOT EXISTS `review_campaign_application_delivery` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `campaign_application_code` varchar(50) NOT NULL DEFAULT '0',
  `campaign_application_delivery_code` varchar(50) NOT NULL DEFAULT '0',
  `courier` varchar(255) NOT NULL DEFAULT '0' COMMENT '택배사',
  `tracking_number` varchar(255) NOT NULL DEFAULT '0' COMMENT '송장번호',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `FK_review_campaign_application_delivery` (`campaign_application_code`),
  KEY `campaign_application_delivery_code` (`campaign_application_delivery_code`),
  CONSTRAINT `FK_review_campaign_application_delivery` FOREIGN KEY (`campaign_application_code`) REFERENCES `review_campaign_application` (`campaign_application_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 newone4.review_campaign_application_delivery:~1 rows (대략적) 내보내기
INSERT INTO `review_campaign_application_delivery` (`id`, `campaign_application_code`, `campaign_application_delivery_code`, `courier`, `tracking_number`, `created_at`, `updated_at`) VALUES
	(2, '202604211541539460', '202604211544492113', 'CJ대한통운', '3432523532523', '2026-04-21 06:44:49', '2026-04-21 06:44:49');

-- 테이블 newone4.review_campaign_application_reward_option 구조 내보내기
CREATE TABLE IF NOT EXISTS `review_campaign_application_reward_option` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `campaign_application_reward_option_code` varchar(50) NOT NULL DEFAULT '0',
  `campaign_application_code` varchar(50) NOT NULL DEFAULT '0',
  `reward_option_code` varchar(50) NOT NULL DEFAULT '0',
  `reward_option_value` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_review_campaign_application_option` (`campaign_application_code`),
  KEY `FK_review_campaign_application_op_reward_option` (`reward_option_code`),
  KEY `campaign_application_reward_option_code` (`campaign_application_reward_option_code`),
  CONSTRAINT `FK_review_campaign_application_op_reward_option` FOREIGN KEY (`reward_option_code`) REFERENCES `review_campaign_reward_option` (`reward_option_code`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_review_campaign_application_option` FOREIGN KEY (`campaign_application_code`) REFERENCES `review_campaign_application` (`campaign_application_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 newone4.review_campaign_application_reward_option:~1 rows (대략적) 내보내기
INSERT INTO `review_campaign_application_reward_option` (`id`, `campaign_application_reward_option_code`, `campaign_application_code`, `reward_option_code`, `reward_option_value`) VALUES
	(6, '202604211541534177', '202604211541539460', '202604211322287031', '21호');

-- 테이블 newone4.review_campaign_category 구조 내보내기
CREATE TABLE IF NOT EXISTS `review_campaign_category` (
  `c_num` int(11) NOT NULL AUTO_INCREMENT,
  `parent_code` varchar(50) DEFAULT NULL,
  `category_code` varchar(50) NOT NULL DEFAULT '0',
  `type` enum('DELIVERY','VISIT','REPORTER','PURCHASE') NOT NULL DEFAULT 'DELIVERY',
  `name` varchar(100) NOT NULL DEFAULT '0',
  `is_visible` tinyint(4) NOT NULL DEFAULT 0,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`c_num`) USING BTREE,
  UNIQUE KEY `id` (`category_code`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 newone4.review_campaign_category:~17 rows (대략적) 내보내기
INSERT INTO `review_campaign_category` (`c_num`, `parent_code`, `category_code`, `type`, `name`, `is_visible`, `sort_order`, `created_at`, `updated_at`) VALUES
	(3, NULL, '20260402131737001', 'DELIVERY', '제품', 1, 1, '2026-04-02 01:57:15', '2026-04-02 04:19:13'),
	(4, NULL, '20260402131902001', 'VISIT', '지역', 1, 2, '2026-04-02 04:19:02', '2026-04-02 04:19:10'),
	(5, NULL, '20260402132114001', 'REPORTER', '기자단', 1, 3, '2026-04-02 04:21:41', '2026-04-02 04:22:04'),
	(6, NULL, '20260402132158001', 'PURCHASE', '구매평', 1, 4, '2026-04-02 04:21:58', '2026-04-02 04:22:30'),
	(7, '20260402131737001', '20260402141854001', 'DELIVERY', '뷰티', 1, 1, '2026-04-02 05:18:54', '2026-04-02 05:19:05'),
	(8, '20260402131737001', '20260402141919001', 'DELIVERY', '식품', 1, 2, '2026-04-02 05:19:19', '2026-04-02 06:19:25'),
	(9, '20260402131737001', '20260402141939001', 'DELIVERY', '생활용품', 1, 3, '2026-04-02 05:19:39', '2026-04-02 06:19:26'),
	(10, '20260402131737001', '20260402141952001', 'DELIVERY', '육아', 1, 4, '2026-04-02 05:19:52', '2026-04-02 06:19:27'),
	(11, '20260402131737001', '20260402142017001', 'DELIVERY', '차량·캠핑', 1, 5, '2026-04-02 05:20:17', '2026-04-02 06:19:27'),
	(12, '20260402131737001', '20260402142030001', 'DELIVERY', '반려동물', 1, 6, '2026-04-02 05:20:30', '2026-04-02 06:19:28'),
	(13, '20260402131737001', '20260402142050001', 'DELIVERY', 'IT·가전제품', 1, 7, '2026-04-02 05:20:50', '2026-04-02 06:19:29'),
	(14, '20260402131737001', '20260402142102001', 'DELIVERY', '기타', 1, 8, '2026-04-02 05:21:02', '2026-04-02 06:19:30'),
	(15, '20260402131902001', '20260402142145001', 'VISIT', '맛집·카페', 1, 1, '2026-04-02 05:21:45', '2026-04-02 05:22:03'),
	(16, '20260402131902001', '20260402142217001', 'VISIT', '뷰티·건강·미용', 1, 2, '2026-04-02 05:22:17', '2026-04-02 06:19:31'),
	(20, '20260402131902001', '20260402142233001', 'VISIT', '여행·숙박·레저', 1, 3, '2026-04-02 05:22:33', '2026-04-02 06:19:32'),
	(21, '20260402131902001', '20260402142320001', 'VISIT', '문화', 1, 4, '2026-04-02 05:23:20', '2026-04-02 06:19:32'),
	(22, '20260402131902001', '20260402142336001', 'VISIT', '기타', 1, 5, '2026-04-02 05:23:36', '2026-04-02 06:19:33');

-- 테이블 newone4.review_campaign_channel 구조 내보내기
CREATE TABLE IF NOT EXISTS `review_campaign_channel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `campaign_code` varchar(50) NOT NULL DEFAULT '0',
  `channel_code` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK__review_campaign` (`campaign_code`),
  KEY `FK_review_campaign_channel_review_campaign_channel_view` (`channel_code`),
  CONSTRAINT `FK__review_campaign` FOREIGN KEY (`campaign_code`) REFERENCES `review_campaign` (`campaign_code`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_review_campaign_channel_review_campaign_channel_view` FOREIGN KEY (`channel_code`) REFERENCES `review_campaign_channel_view` (`channel_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 newone4.review_campaign_channel:~3 rows (대략적) 내보내기
INSERT INTO `review_campaign_channel` (`id`, `campaign_code`, `channel_code`) VALUES
	(52, '202603251523561942', '202603171602001'),
	(56, '202604231037085673', '202603171603001'),
	(79, '202605121348356767', '202603171602001');

-- 테이블 newone4.review_campaign_channel_view 구조 내보내기
CREATE TABLE IF NOT EXISTS `review_campaign_channel_view` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `channel_code` varchar(50) NOT NULL DEFAULT '0',
  `unselectable_with` varchar(500) NOT NULL DEFAULT '0',
  `name` varchar(50) NOT NULL DEFAULT '0',
  `icon` varchar(50) NOT NULL DEFAULT '0',
  `isLink` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `channel_code` (`channel_code`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 newone4.review_campaign_channel_view:~7 rows (대략적) 내보내기
INSERT INTO `review_campaign_channel_view` (`id`, `channel_code`, `unselectable_with`, `name`, `icon`, `isLink`, `created_at`, `updated_at`) VALUES
	(1, '202603171602001', '202603171603001,202603171603002,202603171604001', '네이버 블로그', 'naver.svg', 1, '2026-03-17 16:02:58', '2026-04-10 10:38:53'),
	(2, '202603171603001', '202603171602001,202603171603002,202603171604001', '인스타그램', 'instagram.svg', 1, '2026-03-17 16:03:31', '2026-05-12 14:06:05'),
	(3, '202603171603002', '202603171603001,202603171602001,202603171604001', '유튜브', 'youtube.svg', 1, '2026-03-17 16:04:12', '2026-04-10 10:38:58'),
	(4, '202603171604001', '202603171602001,202603171603002,202603171604002', '인스타그램 릴스', 'instagram_reels.svg', 1, '2026-03-17 16:04:29', '2026-04-10 10:39:00'),
	(5, '202603171604002', '202603171602001,202603171603001,202603171604001', '유튜브 쇼츠', 'youtube_shorts.svg', 1, '2026-03-17 16:04:51', '2026-04-10 10:39:03'),
	(6, '202603171605001', '0', '스마트스토어 구매평', '0', 0, '2026-03-17 16:05:17', '2026-03-17 16:05:17'),
	(7, '202603171605002', '0', '쿠팡 리뷰', '0', 0, '2026-03-17 16:05:33', '2026-03-17 16:05:39');

-- 테이블 newone4.review_campaign_feedback 구조 내보내기
CREATE TABLE IF NOT EXISTS `review_campaign_feedback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `campaign_feedback_code` varchar(50) NOT NULL DEFAULT '0',
  `campaign_application_code` varchar(50) NOT NULL DEFAULT '0',
  `request_content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `FK_review_campaign_post_feedback_review_campaign_application` (`campaign_application_code`),
  KEY `campaign_post_feedback_code` (`campaign_feedback_code`) USING BTREE,
  CONSTRAINT `FK_review_campaign_post_feedback_review_campaign_application` FOREIGN KEY (`campaign_application_code`) REFERENCES `review_campaign_application` (`campaign_application_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 newone4.review_campaign_feedback:~2 rows (대략적) 내보내기
INSERT INTO `review_campaign_feedback` (`id`, `campaign_feedback_code`, `campaign_application_code`, `request_content`, `created_at`, `updated_at`) VALUES
	(5, '202604211545348866', '202604211541539460', '이거 수정 해요', '2026-04-21 06:45:34', '2026-04-21 06:45:34'),
	(6, '202604211546014547', '202604211541539460', '이거 안되어 있음', '2026-04-21 06:46:01', '2026-04-21 06:46:01');

-- 테이블 newone4.review_campaign_mission 구조 내보내기
CREATE TABLE IF NOT EXISTS `review_campaign_mission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `campaign_code` varchar(50) NOT NULL DEFAULT '0',
  `title_guide` text NOT NULL,
  `content_guide` text NOT NULL,
  `hashtags` text NOT NULL,
  `mandatory_keyword` varchar(125) NOT NULL DEFAULT '',
  `optional_keyword` varchar(125) NOT NULL DEFAULT '',
  `min_photo_count` int(11) NOT NULL DEFAULT 0,
  `min_text_length` int(11) NOT NULL DEFAULT 1000,
  PRIMARY KEY (`id`),
  KEY `FK_review_campaign_mission_review_campaign` (`campaign_code`),
  CONSTRAINT `FK_review_campaign_mission_review_campaign` FOREIGN KEY (`campaign_code`) REFERENCES `review_campaign` (`campaign_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 newone4.review_campaign_mission:~4 rows (대략적) 내보내기
INSERT INTO `review_campaign_mission` (`id`, `campaign_code`, `title_guide`, `content_guide`, `hashtags`, `mandatory_keyword`, `optional_keyword`, `min_photo_count`, `min_text_length`) VALUES
	(7, '202603251523561942', '이것 저것 그것 베이비', '1. 이것에 대해 작성해주세요\n2. 링크 연결', '와바미뷰티,뷰러,파데', '와바미뷰티,뷰러,파데', '필수템', 10, 1000),
	(8, '202604231037085673', '', '1. 제품 이미지 및 반려동물이 먹는 이미지 포함 최소 5장 이상\n2. 이미지에 반려동물이 잘 먹는 이미지 2장 이상 필수 포함\n3. 긍정적인 후기 작성', '와바미,닥터버니,티모시,티모시사료,토끼사료', '', '', 5, 500),
	(10, '202605121348356767', 'ㅁㄴㅇㄹ', 'ㅁㄴㅇㄻㄴㅇㄹ', 'ㅁㄴㄹ,ㅇㄹ,ㄹ,ㄹㅁㄴㅇㄹ,ㅁㄴㅇㄹ', '', '', 10, 1000),
	(11, '202605121412250150', '', '', '', '', '', 10, 1000);

-- 테이블 newone4.review_campaign_post 구조 내보내기
CREATE TABLE IF NOT EXISTS `review_campaign_post` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `campaign_post_code` varchar(50) NOT NULL DEFAULT '0',
  `campaign_application_code` varchar(50) NOT NULL DEFAULT '0',
  `user_code` varchar(50) NOT NULL DEFAULT '0',
  `post_url` text NOT NULL,
  `status` enum('SUBMITTED','RETURNED','RESUBMITTED','COMPLETED') NOT NULL DEFAULT 'SUBMITTED',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `resubmited_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `FK_review_campaign_post_user` (`user_code`),
  KEY `FK_review_campaign_post_review_campaign_application` (`campaign_application_code`) USING BTREE,
  KEY `review_campaign_post_code` (`campaign_post_code`) USING BTREE,
  CONSTRAINT `FK_review_campaign_post_review_campaign_application` FOREIGN KEY (`campaign_application_code`) REFERENCES `review_campaign_application` (`campaign_application_code`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_review_campaign_post_user` FOREIGN KEY (`user_code`) REFERENCES `user` (`user_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 newone4.review_campaign_post:~0 rows (대략적) 내보내기
INSERT INTO `review_campaign_post` (`id`, `campaign_post_code`, `campaign_application_code`, `user_code`, `post_url`, `status`, `created_at`, `resubmited_at`, `updated_at`) VALUES
	(6, '202604211545087000', '202604211541539460', 'jeo7334Wt202601', 'https://chakra-ui.com/docs/components/accordion', 'COMPLETED', '2026-04-21 06:45:08', '2026-04-21 06:45:08', '2026-04-21 06:46:21');

-- 테이블 newone4.review_campaign_reward 구조 내보내기
CREATE TABLE IF NOT EXISTS `review_campaign_reward` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reward_code` varchar(50) NOT NULL DEFAULT '0',
  `campaign_code` varchar(50) NOT NULL DEFAULT '0',
  `reward_type` enum('PRODUCT','POINT','COUPON') NOT NULL DEFAULT 'PRODUCT',
  `name` varchar(50) NOT NULL,
  `description` varchar(50) NOT NULL COMMENT '설명',
  `value` double NOT NULL DEFAULT 0 COMMENT '금액 또는 포인트',
  `quantity` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `FK_review_campaign_reward_review_campaign` (`campaign_code`),
  KEY `reward_code` (`reward_code`),
  CONSTRAINT `FK_review_campaign_reward_review_campaign` FOREIGN KEY (`campaign_code`) REFERENCES `review_campaign` (`campaign_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 newone4.review_campaign_reward:~4 rows (대략적) 내보내기
INSERT INTO `review_campaign_reward` (`id`, `reward_code`, `campaign_code`, `reward_type`, `name`, `description`, `value`, `quantity`) VALUES
	(45, '202604211322287549', '202603251523561942', 'PRODUCT', '와바미 파데 50g', '와바미 파데 21호, 23호 중 택 1', 0, 1),
	(48, '202605111635370766', '202604231037085673', 'PRODUCT', '와바미 닥터버니 티모시 베이직 1kg', '티모시가 주 성분으로 만든 토끼 사료', 0, 1),
	(64, '202605121412280799', '202605121412250150', 'PRODUCT', '', '', 0, 0),
	(66, '202605121414128051', '202605121348356767', 'PRODUCT', 'ㅁㄴㅇㄹ', 'ㅁㅇㄹ', 0, 1);

-- 테이블 newone4.review_campaign_reward_option 구조 내보내기
CREATE TABLE IF NOT EXISTS `review_campaign_reward_option` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reward_code` varchar(50) NOT NULL DEFAULT '0',
  `reward_option_code` varchar(50) NOT NULL DEFAULT '0',
  `option_name` varchar(100) NOT NULL DEFAULT '0',
  `option_value` varchar(100) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `reward_option_code` (`reward_option_code`),
  KEY `FK_review_campaign_reward_option_review_campaign_reward` (`reward_code`),
  CONSTRAINT `FK_review_campaign_reward_option_review_campaign_reward` FOREIGN KEY (`reward_code`) REFERENCES `review_campaign_reward` (`reward_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 newone4.review_campaign_reward_option:~2 rows (대략적) 내보내기
INSERT INTO `review_campaign_reward_option` (`id`, `reward_code`, `reward_option_code`, `option_name`, `option_value`, `created_at`, `updated_at`) VALUES
	(12, '202604211322287549', '202604211322287031', '색상', '21호,23호', '2026-04-21 13:22:28', '2026-04-21 13:22:28'),
	(16, '202605121414128051', '202605121414122783', 'ㅁㄴㅇㄹ', 'ㅁㅇㄹ,ㅁㄴㅇㄹ,ㅁㄴㅇㄹ', '2026-05-12 14:14:12', '2026-05-12 14:14:12');

-- 테이블 newone4.user 구조 내보내기
CREATE TABLE IF NOT EXISTS `user` (
  `user_code` varchar(50) NOT NULL,
  `email` varchar(150) NOT NULL,
  `name` varchar(50) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `profile` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('USER','ADMIN','SELLER','SUPER_ADMIN') NOT NULL DEFAULT 'USER',
  `status` enum('ACTIVE','BLOCK','WITHDRAW') NOT NULL DEFAULT 'ACTIVE',
  `marketingAgree` bit(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  `last_login_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 newone4.user:~1 rows (대략적) 내보내기
INSERT INTO `user` (`user_code`, `email`, `name`, `phone`, `profile`, `password`, `role`, `status`, `marketingAgree`, `created_at`, `deleted_at`, `last_login_at`) VALUES
	('jeo7334Wt202601', 'jeongkey3317@naver.com', '민정기', '01065513317', NULL, '$2b$10$Bxmg/Gd9ihF1Ttt6E1M7kuk6DH9185reVTNA4iT3ZacFnn/dqu3R6', 'SUPER_ADMIN', 'ACTIVE', b'1', '2026-01-29 12:27:25', NULL, '2026-05-13 15:24:27');

-- 테이블 newone4.user_address 구조 내보내기
CREATE TABLE IF NOT EXISTS `user_address` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `address_code` varchar(50) NOT NULL,
  `user_code` varchar(50) NOT NULL,
  `name` varchar(126) DEFAULT NULL,
  `postcode` varchar(126) DEFAULT NULL,
  `address` varchar(126) DEFAULT NULL,
  `detailAddress` varchar(126) DEFAULT NULL,
  `phone` varchar(126) DEFAULT NULL,
  `post_request` text DEFAULT NULL,
  `isDefault` tinyint(1) DEFAULT 0,
  `deleted` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `FK_user_address_user` (`user_code`),
  KEY `address_code` (`address_code`),
  CONSTRAINT `FK_user_address_user` FOREIGN KEY (`user_code`) REFERENCES `user` (`user_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 newone4.user_address:~2 rows (대략적) 내보내기
INSERT INTO `user_address` (`id`, `address_code`, `user_code`, `name`, `postcode`, `address`, `detailAddress`, `phone`, `post_request`, `isDefault`, `deleted`, `created_at`, `updated_at`) VALUES
	(1, '202604081121299155', 'jeo7334Wt202601', '민정기', '21069', '인천 계양구 오조산로57번길 15(계산동, 명동빌딩)', '721호', '010-6551-3317', NULL, 1, 0, '2026-04-08 11:21:29', '2026-04-09 15:50:32'),
	(2, '202604211324085275', 'jeo7334Wt202601', '민정기', '21035', '인천 계양구 장제로 878(병방동, 학마을서해.영남아파트)', '111동 1102호', '010-6551-3317', NULL, 0, 0, '2026-04-21 13:24:08', '2026-04-21 13:26:43');

-- 테이블 newone4.user_review_channel 구조 내보내기
CREATE TABLE IF NOT EXISTS `user_review_channel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `review_channel_code` varchar(50) NOT NULL,
  `channel_code` varchar(50) NOT NULL,
  `user_code` varchar(50) NOT NULL,
  `channel_url` varchar(255) NOT NULL,
  `meta_image` varchar(1000) DEFAULT NULL,
  `meta_title` text DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `follower_count` int(11) DEFAULT NULL,
  `deleted` tinyint(4) NOT NULL DEFAULT 0,
  `certifed` enum('UNAPPROVED','REVIEWING','APPROVED','REJECTED') DEFAULT 'REVIEWING',
  `reject_descript` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `FK_user_review_channel_review_campaign_channel_view` (`channel_code`),
  KEY `FK_user_review_channel_user` (`user_code`),
  KEY `review_channel_code` (`review_channel_code`),
  CONSTRAINT `FK_user_review_channel_review_campaign_channel_view` FOREIGN KEY (`channel_code`) REFERENCES `review_campaign_channel_view` (`channel_code`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_user_review_channel_user` FOREIGN KEY (`user_code`) REFERENCES `user` (`user_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 newone4.user_review_channel:~6 rows (대략적) 내보내기
INSERT INTO `user_review_channel` (`id`, `review_channel_code`, `channel_code`, `user_code`, `channel_url`, `meta_image`, `meta_title`, `meta_description`, `follower_count`, `deleted`, `certifed`, `reject_descript`, `created_at`, `updated_at`) VALUES
	(1, '202604091503088261', '202603171602001', 'jeo7334Wt202601', 'https://blog.naver.com/jeongkey3317', NULL, NULL, NULL, NULL, 1, 'REVIEWING', NULL, '2026-04-09 06:03:08', '2026-04-10 02:07:20'),
	(2, '202604091524092907', '202603171603001', 'jeo7334Wt202601', 'https://www.instagram.com/jeongkey_moa', 'https://scontent-icn2-1.cdninstagram.com/v/t51.2885-19/74889142_802324103538046_8304126774971727872_n.jpg?stp=dst-jpg_s100x100_tt6&_nc_cat=104&ccb=7-5&_nc_sid=bf7eb4&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=-S46ZV0yk2IQ7kNvwH-eQGD&_nc_oc=AdrZmw78I_DNqw7UFKCuR8zDKxeXxed5hjX7z8SQzcCDXuyuzVjxN42_C3Jzmvorqm4&_nc_zt=24&_nc_ht=scontent-icn2-1.cdninstagram.com&_nc_ss=7c689&oh=00_Af0IcB1cNRC9MygIx_9BT9oBLuQ4-SSUj47Nfuv3i0NTQg&oe=69F48C59', 'jeongkey (@jeongkey_moa)', '63 Followers, 75 Following, 24 Posts - See Instagram photos and videos from jeongkey (@jeongkey_moa)', 63, 1, 'REVIEWING', NULL, '2026-04-09 06:24:09', '2026-04-27 06:37:02'),
	(3, '202604101108336720', '202603171602001', 'jeo7334Wt202601', 'https://blog.naver.com/jeongkey3317', 'https://blogpfthumb-phinf.pstatic.net/20210503_171/jeongkey3317_1620019703837UAq6n_JPEG/profileImage.jpg?type=f204_204', 'Jeonkey\'s LAB : 네이버 블로그', '100% 주관적 시점', NULL, 0, 'REVIEWING', NULL, '2026-04-10 02:08:33', '2026-04-17 01:36:32'),
	(4, '202604131023015944', '202603171602001', 'jeo7334Wt202601', 'https://blog.naver.com/jeongnim33', 'https://ssl.pstatic.net/static/blog/icon/og_270x270.png', 'jeongnim33 : 네이버 블로그', '당신의 모든 기록을 담는 공간', NULL, 1, 'REVIEWING', NULL, '2026-04-13 01:23:01', '2026-04-27 05:55:34'),
	(5, '202604281407109012', '202603171603001', 'jeo7334Wt202601', 'https://www.instagram.com/jeongkey_moa', 'https://scontent-icn2-1.cdninstagram.com/v/t51.2885-19/74889142_802324103538046_8304126774971727872_n.jpg?stp=dst-jpg_s100x100_tt6&_nc_cat=104&ccb=7-5&_nc_sid=bf7eb4&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=CYpxz3T4BFYQ7kNvwF5Lnuf&_nc_oc=AdpIf258jiEQG5Qh6Xw_IimBCqzJDRAakrM4iwVG_Ds-hz10N9a_jeIsmCd08oxAvb8&_nc_zt=24&_nc_ht=scontent-icn2-1.cdninstagram.com&_nc_ss=7c689&oh=00_Af5V_QDjkcHVqyi2grALiokN7pkBz0hBWD1HJhXw6PfBBA&oe=6A0852D9', 'jeongkey (@jeongkey_moa)', '63 Followers, 76 Following, 24 Posts - See Instagram photos and videos from jeongkey (@jeongkey_moa)', 63, 0, 'REVIEWING', NULL, '2026-04-28 05:07:10', '2026-05-12 01:14:56'),
	(6, '202605121114238207', '202603171603001', 'jeo7334Wt202601', 'https://www.instagram.com/incheonutd', 'https://scontent-icn2-1.cdninstagram.com/v/t51.82787-19/632410063_18509333083079854_5486903995777115729_n.jpg?stp=dst-jpg_s100x100_tt6&_nc_cat=111&ccb=7-5&_nc_sid=bf7eb4&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=DPugCUTnvTwQ7kNvwGAI1vk&_nc_oc=AdoK7JZzl2GTAaDb3OH9HPPlGuaV2DJKhj8MvE9vhXfngEaKoWGFLDYp7ShdkxFXWj0&_nc_zt=24&_nc_ht=scontent-icn2-1.cdninstagram.com&_nc_gid=fOaBDfq-DJTIgEscmTAb8w&_nc_ss=7c689&oh=00_Af5d_hijLmWsU4-WGjlysAdK3avZX3g9-9Q2V8rY8zlt8g&oe=6A08739F', '인천유나이티드 프로축구단 (@incheonutd)', '57K Followers, 85 Following, 13K Posts - See Instagram photos and videos from 인천유나이티드 프로축구단 (@incheonutd)', 57000, 1, 'REVIEWING', NULL, '2026-05-12 02:14:23', '2026-05-12 02:14:31');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
