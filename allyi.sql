-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Feb 04, 2017 at 01:58 PM
-- Server version: 10.1.13-MariaDB
-- PHP Version: 5.5.37

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `allyi`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_master`
--

CREATE TABLE `admin_master` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(500) NOT NULL,
  `password` varchar(255) NOT NULL,
  `exchange_rate` varchar(255) NOT NULL,
  `forget_token` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `admin_master`
--

INSERT INTO `admin_master` (`id`, `username`, `email`, `password`, `exchange_rate`, `forget_token`, `status`) VALUES
(1, 'admin', 'sbamniya23@gmail.com', '21232f297a57a5a743894a0e4a801fc3', '2.5', '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `client_id` varchar(20) NOT NULL,
  `vendor_id` bigint(20) NOT NULL,
  `oauth_key` varchar(20) NOT NULL,
  `logout_url` text NOT NULL,
  `redirecturi` text NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`client_id`, `vendor_id`, `oauth_key`, `logout_url`, `redirecturi`, `status`) VALUES
('CLI-ffd196742274c6', 1000007, '', '', '', 0),
('CLI-ffd196742274c8', 1000009, 'fbd69f7221', 'http://kayass.com/logout', 'http://localhost/kayass/user-registration/', 1),
('CLI-ffd196742275c0', 1000011, 'f8d49f7222', 'http;//devkayass.com/logout-url/', '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `code`
--

CREATE TABLE `code` (
  `id` int(11) NOT NULL,
  `value` varchar(50) NOT NULL,
  `client_id` varchar(40) NOT NULL,
  `redirect_uri` text NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `code`
--

INSERT INTO `code` (`id`, `value`, `client_id`, `redirect_uri`, `user_id`, `status`) VALUES
(1, 'v7XvOmDLj77Y0K9p', 'CLI-ffd196742274c8', 'http://localhost/kayass/user-registration/', 1000016, 0),
(2, '6f8TP7aSV4X2Lfrh', 'CLI-ffd196742274c8', 'http://localhost/kayass/user-registration/', 1000007, 0),
(3, 'VGkXa5vWTfGHJaaN', 'CLI-ffd196742274c8', 'http://localhost/kayass/user-registration/', 1000006, 0);

-- --------------------------------------------------------

--
-- Table structure for table `exchange_request`
--

CREATE TABLE `exchange_request` (
  `id` int(11) NOT NULL,
  `vendor_id` int(11) NOT NULL,
  `hours` varchar(255) NOT NULL,
  `current_exchange_rate` varchar(255) NOT NULL COMMENT 'Exchange Rate at Vendor Applied',
  `status` int(11) NOT NULL COMMENT '0-Requested, 1-Approved '
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `ongoing_trips`
--

CREATE TABLE `ongoing_trips` (
  `id` bigint(20) NOT NULL,
  `owner_id` bigint(20) NOT NULL,
  `new_user_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_date` date NOT NULL,
  `end_time` time NOT NULL,
  `amount` varchar(25) NOT NULL,
  `vehicle_id` int(11) NOT NULL,
  `requester_id` bigint(20) NOT NULL,
  `status` int(11) NOT NULL COMMENT '0-Cancelled, 1- ongoing, 2-completed'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ongoing_trips`
--

INSERT INTO `ongoing_trips` (`id`, `owner_id`, `new_user_id`, `start_date`, `start_time`, `end_date`, `end_time`, `amount`, `vehicle_id`, `requester_id`, `status`) VALUES
(1, 1000001, 0, '2016-12-01', '06:00:00', '2016-12-09', '02:20:00', '1220', 150, 1000000, 2),
(2, 1000001, 0, '2016-12-07', '16:22:00', '0000-00-00', '00:00:00', '', 0, 1000000, 1),
(3, 1000001, 0, '2016-12-08', '02:20:00', '2016-12-07', '02:15:00', '120', 0, 1000000, 2),
(4, 1000004, 0, '2016-12-01', '02:25:00', '2016-12-10', '17:25:00', '120', 0, 1000000, 2),
(5, 1000007, 0, '2016-12-08', '01:05:00', '2016-12-08', '18:30:00', '12', 0, 1000006, 2),
(6, 1000007, 0, '2016-12-08', '12:30:00', '2016-12-08', '18:30:00', '120', 0, 1000006, 2),
(7, 1000007, 0, '2016-12-01', '05:25:00', '2016-12-08', '04:22:00', '120', 0, 1000006, 2),
(8, 1000007, 0, '2016-12-08', '05:25:00', '2016-12-08', '02:12:00', '120', 12121, 1000006, 2),
(9, 1000007, 0, '2016-12-08', '05:25:00', '2016-12-15', '03:20:00', '120', 1222, 1000006, 2),
(10, 1000007, 0, '2016-12-07', '05:25:00', '2016-12-30', '16:20:00', '120', 0, 1000006, 2);

-- --------------------------------------------------------

--
-- Table structure for table `recharges`
--

CREATE TABLE `recharges` (
  `id` bigint(20) NOT NULL,
  `debit_id` bigint(20) NOT NULL,
  `chennel` varchar(52) NOT NULL COMMENT 'Online, Offline',
  `time` time NOT NULL COMMENT 'value of recharge',
  `amount` varchar(11) NOT NULL COMMENT 'balance get by user',
  `credit_id` bigint(20) NOT NULL COMMENT '0-offline, 1-online'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `recharges`
--

INSERT INTO `recharges` (`id`, `debit_id`, `chennel`, `time`, `amount`, `credit_id`) VALUES
(1, 1000000, 'Online', '480:20:00', '1220', 1000001),
(2, 1000000, 'Online', '360:00:00', '120', 1000004),
(3, 1000000, 'Online', '00:05:00', '120', 1000001),
(4, 1000006, 'Online', '72:13:00', '120', 1000007),
(5, 1000006, 'Offline', '504:55:00', '120', 1000007),
(6, 1000006, 'Online', '240:55:00', '120', 1000007);

-- --------------------------------------------------------

--
-- Table structure for table `tokenschema`
--

CREATE TABLE `tokenschema` (
  `clientid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `value` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user_master`
--

CREATE TABLE `user_master` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `lisence_file` varchar(255) NOT NULL,
  `license_number` varchar(500) NOT NULL,
  `mobile_number` varchar(250) NOT NULL,
  `balance` varchar(255) NOT NULL,
  `dob` date NOT NULL,
  `multiplier` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `di_number` varchar(255) NOT NULL,
  `pin` varchar(255) NOT NULL,
  `forget_token` text NOT NULL,
  `user_type` int(11) NOT NULL COMMENT '1-user 2-Vendor',
  `status` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_master`
--

INSERT INTO `user_master` (`id`, `name`, `email`, `password`, `lisence_file`, `license_number`, `mobile_number`, `balance`, `dob`, `multiplier`, `url`, `di_number`, `pin`, `forget_token`, `user_type`, `status`) VALUES
(1000006, 'Sonu Bamniya', 'sbamniya23@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', '', '', '7047473532', '00:22:26', '2016-12-07', '', '', '', '12345', '', 1, 'Y'),
(1000007, 'Sonu Bamniya', 'sbamniya23@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', '1481204905311-like.png', '', '8878220874', '00:38:19', '0000-00-00', '2.5', '', '', '452010', '', 2, 'Y'),
(1000009, 'kayass', 'kayass.deltabee@gmail.com', 'b13f3784dcc24614cc22cb39e80940e9', '1483477781097-3-lafange-part-11-kayass-a-thought-by-kalika-prasad.jpg', '', '9827041964', '09:36:50', '0000-00-00', '1', 'http://www.kayass.com', '', '452010', '', 2, 'Y'),
(1000011, 'Kyassdev', 'kalikawebbuddy@gmail.com', '6cc2395ed5d0714ef2500de380128f7c', '1483762129084-deltabee_logo1.png', '', '9098888187', '00:00:00', '0000-00-00', '1', '', '', '452010', '', 2, 'Y'),
(1000012, 'kalika', 'kalika.mongoosetech@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', '', '', '9827041964', '00:00:00', '2010-01-13', '', '', '', '452010', '', 1, 'Y'),
(1000013, 'Neha Raghuwanshi', 'neharaghuwanshi@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', '', '', '9098888187', '00:00:00', '2017-01-20', '', '', '', '12345', '', 1, 'Y'),
(1000015, 'Dinesh', 'dinesh@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', '', '', '8785214560', '00:00:00', '1996-01-05', '', '', '', '12345', '', 1, 'Y'),
(1000016, 'Akshay Kumar', 'akshay@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', '', '', '98522163220', '00:00:00', '1996-01-12', '', '', '', '12345', '', 1, 'Y'),
(1000017, 'Priyanshi Agraval', '', '', '', '', '9898989898', '', '0000-00-00', '', '', '', '12345', '', 1, 'Y'),
(1000018, 'Dinesh Jadhav', '', '', '', '', '7387797998', '', '0000-00-00', '', '', '', 'dinesh', '', 1, 'Y'),
(1000019, 'Pritesh Kulkarni', '', '', '', '', '9898989899', '', '0000-00-00', '', '', '', '12345', '', 1, 'Y');

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `id` int(11) NOT NULL,
  `trip_id` int(11) NOT NULL,
  `vendor_id` int(11) NOT NULL,
  `reg_number` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` int(11) NOT NULL COMMENT '0-Idle, 1-In-use, -1- Deactivate'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `video_history`
--

CREATE TABLE `video_history` (
  `id` int(11) NOT NULL,
  `client_session` text NOT NULL,
  `client_id` int(11) NOT NULL,
  `vendor_id` int(11) NOT NULL,
  `video_url` text NOT NULL,
  `start_time` text NOT NULL,
  `end_time` text NOT NULL,
  `view_time` text NOT NULL,
  `cuurent_multiplier` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `video_history`
--

INSERT INTO `video_history` (`id`, `client_session`, `client_id`, `vendor_id`, `video_url`, `start_time`, `end_time`, `view_time`, `cuurent_multiplier`) VALUES
(1, 'kalika-uJ1Jdc-1001-W6XS9S', 1001, 1000001, 'http://localhost/kayass/user-registration/?code=kyuhU1A48ckMpac6', '1485756811832', '1485756818010', '5', ''),
(2, 'kalika-8LodCF-1000006-NW0T1O', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=QtV3QzNHcNjMjpWd', '1485849482317', '1485849507851', '10', ''),
(3, 'kalika-ti5UzW-1000006-JZOsfw', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=QtV3QzNHcNjMjpWd', '1485849744204', '1485849754482', '8', ''),
(4, 'kalika-8o4QLR-1000006-aR9aVq', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=QtV3QzNHcNjMjpWd', '1485850400765', '1485850406436', '6', ''),
(5, 'kalika-GoYNmi-1000006-6yhqg6', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=QtV3QzNHcNjMjpWd', '1485850446922', '1485850468926', '9', ''),
(6, 'kalika-1ly65f-1000006-pIueZ6', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=QtV3QzNHcNjMjpWd', '1485850604123', '1485850622785', '16', ''),
(7, 'kalika-ULeazR-1000006-eQsfvp', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=QtV3QzNHcNjMjpWd', '1485850741225', '1485850759125', '16', ''),
(8, 'kalika-1qGeMA-1000006-6uG9cR', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=QtV3QzNHcNjMjpWd', '1485850827670', '1485850890979', '61', ''),
(9, 'kalika-hir9RH-1000006-TgsShO', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=QtV3QzNHcNjMjpWd', '1485851099501', '1485851122507', '22', ''),
(10, 'kalika-xIE3gE-1000006-oB545h', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=QtV3QzNHcNjMjpWd', '1485851344120', '1485851388246', '41', ''),
(11, 'kalika-nyvwLx-1000006-Ud8slL', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=QtV3QzNHcNjMjpWd', '1485851723700', '1485851745118', '20', ''),
(12, 'kalika-hih3iV-1000006-548uaH', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=QtV3QzNHcNjMjpWd', '1485851808610', '1485851815748', '6', ''),
(13, 'kalika-qAYRxm-1000006-oRbmOd', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=QtV3QzNHcNjMjpWd', '1485851864983', '1485851881916', '9', ''),
(14, 'kalika-Pqmgnh-1000006-KZyCbv', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=QtV3QzNHcNjMjpWd', '1485852023840', '1485852142183', '111', ''),
(15, 'kalika-OuGRpJ-1000006-UZUx8S', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=QtV3QzNHcNjMjpWd', '1485852262705', '1485852289104', '25', ''),
(16, 'kalika-Hkogdn-1000006-OjJ3qp', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=QtV3QzNHcNjMjpWd', '1485852432785', '1485852470439', '37', ''),
(17, 'kalika-fQg8vO-1000006-3ezp8R', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=QtV3QzNHcNjMjpWd', '1485852841781', '1485852860623', '17', ''),
(18, 'kalika-LF8DSq-1000006-beL8Ti', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=QtV3QzNHcNjMjpWd', '1485853102057', '1485853128667', '25', ''),
(19, 'kalika-H7iA3d-1000006-Q1nJWL', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=QtV3QzNHcNjMjpWd', '1485853364174', '1485853395498', '28', ''),
(20, 'kalika-UETyDW-1000006-4LRJU3', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=QtV3QzNHcNjMjpWd', '1485853471047', '1485853499832', '27', ''),
(21, 'kalika-IMQapy-1000006-9daLw4', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=qVx5kB3P0n3pWLAW', '1485858240400', '1485858359619', '110', ''),
(22, 'kalika-G4AFmD-1000006-tc9Xgv', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=qVx5kB3P0n3pWLAW', '1485858509378', '1485858518882', '10', ''),
(23, 'kalika-6lTvtP-1000006-FdDqAv', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=qVx5kB3P0n3pWLAW', '1485858785697', '1485858838271', '53', ''),
(24, 'kalika-WjkbXD-1001-wO177p', 1001, 1000007, 'http://localhost/kayass/user-registration/?code=MT055lc3GWdSzJIw', '1486031476802', '1486031570308', '72', ''),
(25, 'kalika-pVSNkM-1001-pU6p8k', 1001, 1000007, 'http://localhost/kayass/user-registration/?code=MT055lc3GWdSzJIw', '1486031584494', '1486031599150', '12', ''),
(26, 'kalika-Jy3aeu-1001-eAlt2G', 1001, 1000007, 'http://localhost/kayass/user-registration/?code=MT055lc3GWdSzJIw', '1486031621459', '1486031635309', '14', ''),
(27, 'kalika-qPlfF4-1001-S3BFiG', 1001, 1000007, 'http://localhost/kayass/user-registration/?code=MT055lc3GWdSzJIw', '1486031653962', '1486031914099', '110', ''),
(28, 'kalika-CmfhM3-1001-NbkLsI', 1001, 1000007, 'http://localhost/kayass/user-registration/?code=6aZ9QiiEQWASFt69', '1486033696976', '1486033714328', '18', ''),
(29, 'kalika-y64lQl-1001-SAdSea', 1001, 1000007, 'http://localhost/kayass/user-registration/?code=6aZ9QiiEQWASFt69', '1486033656940', '1486033721314', '32', ''),
(30, 'kalika-AlI5s0-1001-KUNw2F', 1001, 1000007, 'http://localhost/kayass/user-registration/?code=6aZ9QiiEQWASFt69', '1486033735967', '1486034335703', '110', ''),
(31, 'kalika-wcwExJ-1001-cKtBDy', 1001, 1000007, 'http://localhost/kayass/user-registration/?code=6aZ9QiiEQWASFt69', '1486034853752', '1486034898298', '44', ''),
(32, 'kalika-GbGyUl-1001-IlxmUH', 1001, 1000007, 'http://localhost/kayass/user-registration/?code=6aZ9QiiEQWASFt69', '1486034914976', '1486035517257', '111', ''),
(33, 'kalika-ERkCXu-1001-z3RFeE', 1001, 1000007, 'http://localhost/kayass/user-registration/?code=6aZ9QiiEQWASFt69', '1486036032908', '1486036143750', '110', ''),
(34, 'kalika-itSzBC-1001-P34yjl', 1001, 1000007, 'http://localhost/kayass/user-registration/?code=uRSg8DsI9ASjCC1m', '1486036925978', '1486037648159', '103', ''),
(35, 'kalika-wTtVOr-1001-JiP20v', 1001, 1000007, 'http://localhost/kayass/user-registration/?code=3NuxKx9mXIpBoRcm', '1486041674770', '1486041674805', '1', ''),
(36, 'kalika-wTtVOr-1001-JiP20v', 1001, 1000007, 'http://localhost/kayass/user-registration/?code=3NuxKx9mXIpBoRcm', '1486042694764', '1486042695774', '2', ''),
(37, 'kalika-1qLnri-1001-hzNXQG', 1001, 1000007, 'http://localhost/kayass/user-registration/?code=3NuxKx9mXIpBoRcm', '1486045348575', '1486045356062', '6', ''),
(38, 'kalika-c6ATrw-1000006-LlIhk8', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=v7XvOmDLj77Y0K9p', '1486107805244', '1486107826658', '22', ''),
(39, 'kalika-dsOBlk-1000006-83OLf4', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=v7XvOmDLj77Y0K9p', '1486108786282', '1486108804720', '12', ''),
(40, 'kalika-1gnVHo-1000006-QJk9t0', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=v7XvOmDLj77Y0K9p', '1486114736255', '1486114753192', '11', ''),
(41, 'kalika-cUScgH-1000006-SRiBJk', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=v7XvOmDLj77Y0K9p', '1486114960986', '1486114973813', '5', ''),
(42, 'kalika-7wzd9L-1000006-vG9QQK', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=v7XvOmDLj77Y0K9p', '1486115296991', '1486115317512', '21', '1'),
(43, 'kalika-11nWPO-1000006-RdpzZH', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=v7XvOmDLj77Y0K9p', '1486115398966', '1486115414588', '11', '1'),
(44, 'kalika-6LFMws-1000006-1SU3GN', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=v7XvOmDLj77Y0K9p', '1486115675093', '1486115683763', '7', '2.5'),
(45, 'kalika-eZMqXc-1000006-7cvLWZ', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=meL706dZNp8kvZfy', '1486200472313', '1486200503640', '27', '2.5'),
(46, 'kalika-S2SVYS-1000006-124HC5', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=meL706dZNp8kvZfy', '1486200530168', '1486200547450', '13', '2.5'),
(47, 'kalika-83OPml-1000006-9ufVu6', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=meL706dZNp8kvZfy', '1486200561979', '1486200570984', '5', '2.5'),
(48, 'kalika-OWQaUq-1000006-l83bTP', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=meL706dZNp8kvZfy', '1486200589560', '1486200601480', '6', '2.5'),
(49, 'kalika-1QbGb9-1000006-GYl6uj', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=meL706dZNp8kvZfy', '1486200650990', '1486200723942', '70', '2.5'),
(50, 'kalika-xoNgRr-1000006-HSyK09', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=meL706dZNp8kvZfy', '1486201508072', '1486201542148', '32', '2.5'),
(51, 'kalika-9IoQ7O-1000006-ZS9aMa', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=wrvkCz7wFycNUeow', '1486201643187', '1486201748926', '104', '2.5'),
(52, 'kalika-wksXls-1000006-goicwu', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=BaBiI3hi2NgSLGVs', '1486201868001', '1486203858399', '142', '2.5'),
(53, 'kalika-4DqC2q-1000006-XNS76E', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=BaBiI3hi2NgSLGVs', '1486204119211', '1486204130655', '9', '2.5'),
(54, 'kalika-e6vPvW-1000006-cHB9gf', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=kn6pXHcP4mBzwosD', '1486204633041', '1486204638354', '4', '2.5'),
(55, 'kalika-DIMTVI-1000006-CsSH0O', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=BkAlVJ59Tg19xi0Q', '1486204684073', '1486204698156', '9', '2.5'),
(56, 'kalika-LmK7X7-1000006-Sk84fJ', 1000006, 1000007, 'http://localhost/kayass/user-registration/?code=3WF4MxBuIKiHbQZ3', '1486205476259', '1486205491537', '13', '2.5'),
(57, 'kalika-NYMNux-1000006-QYRbSu', 1000006, 1000009, 'http://localhost/kayass/user-registration/?code=ztS80fuNNFTZmk3T', '1486207852440', '1486207894637', '38', '1'),
(58, 'kalika-LBHSer-1000006-FMAIPV', 1000006, 1000009, 'http://localhost/kayass/user-registration/?code=KbXHc2WHOe8zvuCL', '1486207969058', '1486207978904', '8', '1'),
(59, 'kalika-2YhGTS-1000006-rXQkLm', 1000006, 1000009, 'http://localhost/kayass/user-registration/?code=ZpVW5our4ahCKOOA', '1486207966070', '1486207979623', '10', '1'),
(60, 'kalika-wBCU3X-1000006-KKC02A', 1000006, 1000009, 'http://localhost/kayass/user-registration/?code=oJEwKJ1oOYg9c2JA', '1486208952458', '1486209153533', '143', '1'),
(61, 'Sonu Bamniya-Kvuxot-1000006-qaYJ8j', 1000006, 1000009, 'http://localhost/kayass/user-registration/video-3.php', '1486209662272', '1486209709014', '40', '1'),
(62, 'Sonu Bamniya-J8mFS8-1000006-tMMqeO', 1000006, 1000009, 'http://localhost/kayass/user-registration/?code=BPDCPnDS6JvxhCxE', '1486209613721', '1486209733421', '114', '1'),
(63, 'Sonu Bamniya-9TlcxM-1000006-vRBSBY', 1000006, 1000009, 'http://localhost/kayass/user-registration/video-2.php', '1486209640337', '1486209756459', '109', '1'),
(64, 'Sonu Bamniya-N5rNus-1000006-NoE38t', 1000006, 1000009, 'http://localhost/kayass/user-registration/video-4.php', '1486209694203', '1486209766919', '70', '1'),
(65, 'Sonu Bamniya-ZhHWXS-1000006-kegTRj', 1000006, 1000009, 'http://localhost/kayass/user-registration/?code=xAqQn6zC8UQkEjrl', '1486209847336', '1486210009763', '143', '1'),
(66, 'Sonu Bamniya-NvbCk3-1000006-rpeSUY', 1000006, 1000009, 'http://localhost/kayass/user-registration/video-2.php', '1486210064920', '1486210075874', '11', '1');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_master`
--
ALTER TABLE `admin_master`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`client_id`);

--
-- Indexes for table `code`
--
ALTER TABLE `code`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `exchange_request`
--
ALTER TABLE `exchange_request`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ongoing_trips`
--
ALTER TABLE `ongoing_trips`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `recharges`
--
ALTER TABLE `recharges`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_master`
--
ALTER TABLE `user_master`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `video_history`
--
ALTER TABLE `video_history`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_master`
--
ALTER TABLE `admin_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `code`
--
ALTER TABLE `code`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `exchange_request`
--
ALTER TABLE `exchange_request`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `ongoing_trips`
--
ALTER TABLE `ongoing_trips`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `recharges`
--
ALTER TABLE `recharges`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `user_master`
--
ALTER TABLE `user_master`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1000020;
--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `video_history`
--
ALTER TABLE `video_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
