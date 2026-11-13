-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 13, 2026 at 02:48 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `humain_hub`
--

-- --------------------------------------------------------

--
-- Table structure for table `features`
--

CREATE TABLE `features` (
  `feature_id` int(11) NOT NULL,
  `feature_name` varchar(100) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `features`
--

INSERT INTO `features` (`feature_id`, `feature_name`, `category`, `description`) VALUES
(1, 'Agentic RAG', 'Fabric Intelligence', 'Answers questions from your company data and shows where each answer came from.'),
(2, 'Fabric BI', 'Fabric Intelligence', 'Build dashboards yourself, or describe what you need and let AI build it.'),
(3, 'Audit logs', 'Fabric Foundation', 'Keeps a tamper-proof record of who accessed or changed your data.'),
(4, 'Document understanding', 'Fabric Intelligence', 'Pulls the key information out of your documents.'),
(5, 'Data quality', 'Fabric Foundation', 'Runs continuous checks on your data and alerts you when something fails.'),
(6, 'Native Arabic understanding', 'Fabric Intelligence', 'Understands Arabic dialects and regional context in questions and answers.'),
(7, 'Ingestion Agent', 'Fabric Intelligence', 'Connects databases, APIs, files and streams without hand-written pipelines.'),
(8, 'Fabric Ops Agent', 'Fabric Intelligence', 'Monitors your systems, spots issues early and explains them in plain language.'),
(9, 'Data lineage', 'Fabric Foundation', 'Traces data from its source to where it is used and shows what a change affects.'),
(10, 'PII classification', 'Fabric Foundation', 'Finds and labels personal data automatically.'),
(11, 'Migration Agent', 'Fabric Intelligence', 'Moves data from old systems in supervised, checked steps.'),
(12, 'AI readiness assessment', 'Fabric Consult', 'HUMAIN experts identify which AI use cases are worth doing first.');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `message_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `org_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`message_id`, `user_id`, `org_id`, `message`, `created_at`) VALUES
(1, 5, 1, 'Hello Layan! Welcome to HUMAIN Fabric. How can I help you?', '2026-09-24 09:15:00'),
(2, 1, 1, 'Hi Dr. Ruba. I would like an update on our Agentic RAG request.', '2026-09-24 11:30:00'),
(3, 5, 1, 'Your request is currently under review. We will update you as soon as possible.', '2026-09-25 14:45:00'),
(4, 6, 2, 'Hi Dr. Ruba, can we add two more people from our IT team to the hub?', '2026-09-27 10:05:00'),
(5, 5, 2, 'Sure Danah, send me their names and emails and I will add them today.', '2026-09-27 12:20:00'),
(6, 8, 4, 'Hi Ruba, our ERP connection keeps failing. Can someone help us this week?', '2026-09-28 10:15:00');

-- --------------------------------------------------------

--
-- Table structure for table `organizations`
--

CREATE TABLE `organizations` (
  `org_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `sector` varchar(50) DEFAULT NULL,
  `plan` varchar(20) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `go_live_date` date DEFAULT NULL,
  `fabric_users` int(11) DEFAULT 0,
  `data_sources` int(11) DEFAULT 0,
  `manager_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `organizations`
--

INSERT INTO `organizations` (`org_id`, `name`, `sector`, `plan`, `city`, `go_live_date`, `fabric_users`, `data_sources`, `manager_id`) VALUES
(1, 'Najd Bank', 'Financial Services', 'Growth', 'Riyadh', '2026-11-01', 64, 3, 5),
(2, 'Riyadh Health', 'Healthcare and Life Sciences', 'Growth', 'Riyadh', '2026-08-01', 120, 4, 5),
(3, 'Gulf Retail', 'Retail and Consumer', 'Starter', 'Jeddah', '2026-07-15', 35, 2, 5),
(4, 'Desert Logistics', 'Energy and Industrial', 'Growth', 'Dammam', '2026-12-01', 20, 1, 5),
(5, 'Red Sea Energy', 'Energy and Industrial', 'Enterprise', 'Jeddah', '2027-01-15', 0, 0, 5);

-- --------------------------------------------------------

--
-- Table structure for table `org_features`
--

CREATE TABLE `org_features` (
  `org_id` int(11) NOT NULL,
  `feature_id` int(11) NOT NULL,
  `status` varchar(20) DEFAULT NULL,
  `usage_this_month` int(11) DEFAULT NULL,
  `unit` varchar(20) DEFAULT NULL,
  `plan_limit` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `org_features`
--

INSERT INTO `org_features` (`org_id`, `feature_id`, `status`, `usage_this_month`, `unit`, `plan_limit`) VALUES
(1, 2, 'Low use', 10300, 'views', 100000),
(1, 3, 'Active', 22600, 'events', 40000),
(1, 4, 'Active', 59000, 'pages', 80000),
(1, 6, 'Active', 36500, 'messages', 50000),
(2, 2, 'Active', 42000, 'views', 100000),
(2, 6, 'Active', 38000, 'messages', 50000),
(3, 5, 'Active', 8200, 'checks', 20000),
(4, 4, 'Low use', 3100, 'pages', 80000);

-- --------------------------------------------------------

--
-- Table structure for table `requests`
--

CREATE TABLE `requests` (
  `request_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `org_id` int(11) NOT NULL,
  `feature_id` int(11) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `use_for` text DEFAULT NULL,
  `expected_users` varchar(10) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `priority` varchar(10) DEFAULT 'Normal',
  `status` varchar(20) NOT NULL DEFAULT 'Pending',
  `note` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `requests`
--

INSERT INTO `requests` (`request_id`, `user_id`, `org_id`, `feature_id`, `title`, `use_for`, `expected_users`, `start_date`, `priority`, `status`, `note`, `created_at`) VALUES
(1012, 4, 1, 3, 'Audit logs', 'Track who opens customer records for compliance.', '1-10', '2026-09-01', 'Urgent', 'Done', 'Live since 1 Sep', '2026-08-22 08:10:00'),
(1019, 2, 1, 8, 'Fabric Ops Agent', 'Get early alerts when our data systems have issues.', '1-10', '2026-10-01', 'Normal', 'Declined', 'Available after go-live', '2026-08-30 16:20:00'),
(1027, 3, 1, 12, 'AI readiness assessment', 'Find which AI use cases our analysts should start with.', '11-50', '2026-09-15', 'Normal', 'Done', 'Held 15 Sep', '2026-09-06 11:45:00'),
(1031, 2, 1, NULL, 'Extra data source: CRM', 'Connect our CRM so customer data is in Fabric.', '11-50', '2026-10-01', 'Normal', 'In progress', 'Connector being set up', '2026-09-11 09:00:00'),
(1039, 1, 1, NULL, 'Plan upgrade: Growth', 'More users and higher limits for go-live.', '51-200', '2026-10-01', 'Urgent', 'Approved', 'Live from 1 Oct', '2026-09-20 14:15:00'),
(1042, 1, 1, 1, 'Agentic RAG', 'Let staff ask questions about our policies and get answers with sources.', '51-200', '2026-11-01', 'Normal', 'Pending', 'Ruba is reviewing it', '2026-09-24 10:30:00'),
(1043, 6, 2, 4, 'Document understanding', 'Read patient forms and medical reports automatically.', '11-50', '2026-10-15', 'Normal', 'Pending', 'Waiting for review', '2026-09-25 09:40:00'),
(1044, 7, 3, 1, 'Agentic RAG', 'Let store managers ask questions about sales data.', '11-50', '2026-10-20', 'Normal', 'Pending', 'Waiting for review', '2026-09-26 13:10:00'),
(1045, 8, 4, 7, 'Ingestion Agent', 'Connect our ERP and fleet tracking data to Fabric.', '1-10', '2026-10-01', 'Urgent', 'In progress', 'Connecting the first source', '2026-09-23 11:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `setup_steps`
--

CREATE TABLE `setup_steps` (
  `step_id` int(11) NOT NULL,
  `org_id` int(11) NOT NULL,
  `step_number` int(11) NOT NULL,
  `step_name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `responsible_party` varchar(100) DEFAULT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'Not started',
  `completed_at` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `setup_steps`
--

INSERT INTO `setup_steps` (`step_id`, `org_id`, `step_number`, `step_name`, `description`, `responsible_party`, `status`, `completed_at`) VALUES
(1, 1, 1, 'Sign the service agreement', 'Signed by both sides', 'HUMAIN + you', 'Done', '2026-09-02'),
(2, 1, 2, 'Invite your team', '3 teammates invited', 'You', 'Done', '2026-09-05'),
(3, 1, 3, 'Connect your data', '3 sources connected', 'You', 'Done', '2026-09-12'),
(4, 1, 4, 'Set up your access rules', '2 of 5 roles defined', 'You', 'In progress', NULL),
(5, 1, 5, 'Pick your first AI use case', 'Unlocks after access rules; you choose it from the catalog', 'You + HUMAIN', 'Not started', NULL),
(6, 2, 1, 'Sign the service agreement', 'Signed by both sides', 'HUMAIN + you', 'Done', '2026-06-01'),
(7, 2, 2, 'Invite your team', 'Team invited', 'You', 'Done', '2026-06-08'),
(8, 2, 3, 'Connect your data', '4 sources connected', 'You', 'Done', '2026-06-25'),
(9, 2, 4, 'Set up your access rules', 'All roles defined', 'You', 'Done', '2026-07-10'),
(10, 2, 5, 'Pick your first AI use case', 'Use case chosen', 'You + HUMAIN', 'Done', '2026-07-20'),
(11, 3, 1, 'Sign the service agreement', 'Signed by both sides', 'HUMAIN + you', 'Done', '2026-05-10'),
(12, 3, 2, 'Invite your team', 'Team invited', 'You', 'Done', '2026-05-15'),
(13, 3, 3, 'Connect your data', '2 sources connected', 'You', 'Done', '2026-06-01'),
(14, 3, 4, 'Set up your access rules', 'All roles defined', 'You', 'Done', '2026-06-20'),
(15, 3, 5, 'Pick your first AI use case', 'Use case chosen', 'You + HUMAIN', 'Done', '2026-07-01'),
(16, 4, 1, 'Sign the service agreement', 'Signed by both sides', 'HUMAIN + you', 'Done', '2026-09-01'),
(17, 4, 2, 'Invite your team', 'Team invited', 'You', 'Done', '2026-09-10'),
(18, 4, 3, 'Connect your data', '1 of 3 sources connected', 'You', 'In progress', NULL),
(19, 4, 4, 'Set up your access rules', 'Unlocks after your data is connected', 'You', 'Not started', NULL),
(20, 4, 5, 'Pick your first AI use case', 'Unlocks after access rules', 'You + HUMAIN', 'Not started', NULL),
(21, 5, 1, 'Sign the service agreement', 'Signed by both sides', 'HUMAIN + you', 'Done', '2026-09-20'),
(22, 5, 2, 'Invite your team', 'Invitations sent', 'You', 'In progress', NULL),
(23, 5, 3, 'Connect your data', 'Unlocks after your team joins', 'You', 'Not started', NULL),
(24, 5, 4, 'Set up your access rules', 'Unlocks after your data is connected', 'You', 'Not started', NULL),
(25, 5, 5, 'Pick your first AI use case', 'Unlocks after access rules', 'You + HUMAIN', 'Not started', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `suggestions`
--

CREATE TABLE `suggestions` (
  `suggestion_id` int(11) NOT NULL,
  `org_id` int(11) NOT NULL,
  `type` varchar(20) DEFAULT NULL,
  `title` varchar(150) NOT NULL,
  `details` text NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `link_page` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `feature_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `suggestions`
--

INSERT INTO `suggestions` (`suggestion_id`, `org_id`, `type`, `title`, `details`, `reason`, `link_page`, `created_at`, `feature_id`) VALUES
(6, 1, 'Upgrade', 'Your usage is growing', 'Native Arabic understanding messages grew 42% this month. At this rate you will reach your plan limit around 20 Oct.', 'Usage grew more than 30% and over 70% of the limit is used.', 'support.html', '2026-09-25 23:00:00', NULL),
(7, 1, 'New feature', 'Banks like you also use Data quality', '7 of 10 banking clients on HUMAIN Fabric use it with the same data sources you connected.', 'More than half of the clients in your sector use it.', 'catalog.html', '2026-09-25 23:00:00', 5),
(8, 1, 'Setup', 'Finish your access rules', 'This step has been open for 9 days. Your first AI use case unlocks after it.', 'A checklist step has been open for more than 7 days.', 'setup.html', '2026-09-25 23:00:00', NULL),
(9, 1, 'Tip', 'Fabric BI is barely used', 'Only 10,300 views this month. A 30-minute session could help your analysts get more from it.', 'A feature stayed under 15% of its limit for 30 days.', 'support.html', '2026-09-25 23:00:00', NULL),
(10, 2, 'New feature', 'Healthcare clients also use Document understanding', 'Read patient forms and medical reports in Arabic and English automatically.', 'More than half of the clients in your sector use it.', 'catalog.html', '2026-09-25 23:00:00', 4);

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `ticket_id` int(11) NOT NULL,
  `org_id` int(11) NOT NULL,
  `subject` varchar(150) NOT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'Open',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`ticket_id`, `org_id`, `subject`, `status`, `created_at`) VALUES
(201, 1, 'Login problem', 'Resolved', '2026-09-18 00:00:00'),
(202, 1, 'Data connection issue', 'In progress', '2026-09-22 00:00:00'),
(203, 1, 'Access permissions', 'Open', '2026-09-25 00:00:00'),
(204, 2, 'Dashboard not loading', 'Resolved', '2026-09-20 10:00:00'),
(205, 4, 'Cannot connect ERP data source', 'Open', '2026-09-26 09:30:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `org_id` int(11) DEFAULT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `job_title` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` varchar(20) NOT NULL,
  `last_active` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `org_id`, `full_name`, `email`, `password`, `job_title`, `phone`, `role`, `last_active`) VALUES
(1, 1, 'Layan Alahmed', 'layan@najdbank.com', 'Test1234', 'Data team lead', '0550000000', 'Admin', '2026-11-13'),
(2, 1, 'Noura Almajed', 'noura@najdbank.com', 'Test1234', 'Risk analyst', '0550000002', 'Member', '2026-11-08'),
(3, 1, 'Latifa Albabtain', 'latifa@najdbank.com', 'Test1234', 'Business analyst', '0550000003', 'Member', '2026-11-09'),
(4, 1, 'Aljawharah Babanji', 'aljawharah@najdbank.com', 'Test1234', 'Compliance officer', '0550000004', 'Member', '2026-11-08'),
(5, NULL, 'Dr. Ruba Awawdeh', 'ruba@humain.com', 'Test1234', 'Account manager', '0550000005', 'Staff', '2026-11-12'),
(6, 2, 'Danah Almansour', 'danah@riyadhhealth.com', 'Test1234', 'IT manager', '0550000006', 'Admin', '2026-11-13'),
(7, 3, 'Sarah Albalawi', 'sarah@gulfretail.com', 'Test1234', 'Data manager', '0550000007', 'Admin', '2026-09-22'),
(8, 4, 'Khalid Alharbi', 'khalid@desertlogistics.com', 'Test1234', 'Operations manager', '0550000008', 'Admin', '2026-11-05'),
(9, 5, 'Reem Alzahrani', 'reem@redseaenergy.com', 'Test1234', 'Digital lead', '0550000009', 'Admin', '2026-11-13');

-- --------------------------------------------------------

--
-- Table structure for table `weekly_usage`
--

CREATE TABLE `weekly_usage` (
  `org_id` int(11) NOT NULL,
  `week_start` date NOT NULL,
  `usage_count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `weekly_usage`
--

INSERT INTO `weekly_usage` (`org_id`, `week_start`, `usage_count`) VALUES
(1, '2026-08-31', 20000),
(1, '2026-09-07', 35000),
(1, '2026-09-14', 28000),
(1, '2026-09-21', 45400),
(2, '2026-08-31', 18500),
(2, '2026-09-07', 19600),
(2, '2026-09-14', 20400),
(2, '2026-09-21', 21500),
(3, '2026-08-31', 1900),
(3, '2026-09-07', 2000),
(3, '2026-09-14', 2100),
(3, '2026-09-21', 2200),
(4, '2026-08-31', 600),
(4, '2026-09-07', 700),
(4, '2026-09-14', 850),
(4, '2026-09-21', 950);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `features`
--
ALTER TABLE `features`
  ADD PRIMARY KEY (`feature_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `org_id` (`org_id`);

--
-- Indexes for table `organizations`
--
ALTER TABLE `organizations`
  ADD PRIMARY KEY (`org_id`),
  ADD KEY `manager_id` (`manager_id`);

--
-- Indexes for table `org_features`
--
ALTER TABLE `org_features`
  ADD PRIMARY KEY (`org_id`,`feature_id`),
  ADD KEY `feature_id` (`feature_id`);

--
-- Indexes for table `requests`
--
ALTER TABLE `requests`
  ADD PRIMARY KEY (`request_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `org_id` (`org_id`),
  ADD KEY `feature_id` (`feature_id`);

--
-- Indexes for table `setup_steps`
--
ALTER TABLE `setup_steps`
  ADD PRIMARY KEY (`step_id`),
  ADD UNIQUE KEY `org_id` (`org_id`,`step_number`);

--
-- Indexes for table `suggestions`
--
ALTER TABLE `suggestions`
  ADD PRIMARY KEY (`suggestion_id`),
  ADD KEY `org_id` (`org_id`),
  ADD KEY `feature_id` (`feature_id`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`ticket_id`),
  ADD KEY `org_id` (`org_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `org_id` (`org_id`);

--
-- Indexes for table `weekly_usage`
--
ALTER TABLE `weekly_usage`
  ADD PRIMARY KEY (`org_id`,`week_start`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `features`
--
ALTER TABLE `features`
  MODIFY `feature_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `organizations`
--
ALTER TABLE `organizations`
  MODIFY `org_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `requests`
--
ALTER TABLE `requests`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1046;

--
-- AUTO_INCREMENT for table `setup_steps`
--
ALTER TABLE `setup_steps`
  MODIFY `step_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `suggestions`
--
ALTER TABLE `suggestions`
  MODIFY `suggestion_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `ticket_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=206;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`org_id`) REFERENCES `organizations` (`org_id`);

--
-- Constraints for table `organizations`
--
ALTER TABLE `organizations`
  ADD CONSTRAINT `organizations_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `org_features`
--
ALTER TABLE `org_features`
  ADD CONSTRAINT `org_features_ibfk_1` FOREIGN KEY (`org_id`) REFERENCES `organizations` (`org_id`),
  ADD CONSTRAINT `org_features_ibfk_2` FOREIGN KEY (`feature_id`) REFERENCES `features` (`feature_id`);

--
-- Constraints for table `requests`
--
ALTER TABLE `requests`
  ADD CONSTRAINT `requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `requests_ibfk_2` FOREIGN KEY (`org_id`) REFERENCES `organizations` (`org_id`),
  ADD CONSTRAINT `requests_ibfk_3` FOREIGN KEY (`feature_id`) REFERENCES `features` (`feature_id`);

--
-- Constraints for table `setup_steps`
--
ALTER TABLE `setup_steps`
  ADD CONSTRAINT `setup_steps_ibfk_1` FOREIGN KEY (`org_id`) REFERENCES `organizations` (`org_id`);

--
-- Constraints for table `suggestions`
--
ALTER TABLE `suggestions`
  ADD CONSTRAINT `suggestions_ibfk_1` FOREIGN KEY (`org_id`) REFERENCES `organizations` (`org_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `suggestions_ibfk_2` FOREIGN KEY (`feature_id`) REFERENCES `features` (`feature_id`);

--
-- Constraints for table `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`org_id`) REFERENCES `organizations` (`org_id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`org_id`) REFERENCES `organizations` (`org_id`);

--
-- Constraints for table `weekly_usage`
--
ALTER TABLE `weekly_usage`
  ADD CONSTRAINT `weekly_usage_ibfk_1` FOREIGN KEY (`org_id`) REFERENCES `organizations` (`org_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
