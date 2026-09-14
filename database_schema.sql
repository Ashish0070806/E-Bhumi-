-- =====================================================
-- E-Bhumi National Land & Citizen Portal Database Schema
-- Database: e_bhumi_db
-- =====================================================

CREATE DATABASE IF NOT EXISTS `e_bhumi_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `e_bhumi_db`;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `citizen_grievances`;
DROP TABLE IF EXISTS `dbt_payments`;
DROP TABLE IF EXISTS `workflow_approvals`;
DROP TABLE IF EXISTS `compensation_valuations`;
DROP TABLE IF EXISTS `survey_landmarks`;
DROP TABLE IF EXISTS `survey_vertices`;
DROP TABLE IF EXISTS `plot_ownership`;
DROP TABLE IF EXISTS `land_plots`;
DROP TABLE IF EXISTS `projects`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------
-- 1. USER ACCOUNTS & ROLE-BASED ACCESS CONTROL (RBAC)
-- -----------------------------------------------------
CREATE TABLE `users` (
    `user_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `phone_number` VARCHAR(20) NULL,
    `aadhaar_no` VARCHAR(20) NULL,
    `role` ENUM('System Admin', 'Field Officer', 'Landowner', 'Public Viewer') NOT NULL,
    `officer_id` VARCHAR(50) UNIQUE DEFAULT NULL,
    `password_hash` VARCHAR(255) NOT NULL DEFAULT 'GovtSecurity@2026',
    `dsc_token_connected` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 2. HIGHWAY & INFRASTRUCTURE PROJECTS
-- -----------------------------------------------------
CREATE TABLE `projects` (
    `project_id` INT AUTO_INCREMENT PRIMARY KEY,
    `project_code` VARCHAR(50) UNIQUE NOT NULL,
    `corridor_name` VARCHAR(255) NOT NULL,
    `sector_route` VARCHAR(255) NOT NULL,
    `section_3a_notice_no` VARCHAR(100) NOT NULL,
    `district` VARCHAR(100) NOT NULL,
    `distance_marker_start` DECIMAL(7,2) NULL,
    `distance_marker_end` DECIMAL(7,2) NULL,
    `target_land_hectares` DECIMAL(10,2) NOT NULL,
    `acquired_hectares` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `approved_compensation_fund` DECIMAL(15,2) NOT NULL,
    `disbursed_compensation` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `project_status` ENUM('Planning', 'Active Survey', 'Legal Approvals', 'Disbursement', 'Completed') DEFAULT 'Active Survey',
    `incharge_officer` VARCHAR(150) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 3. LAND PLOTS & MASTER RECORDS (Khasra Cadastre)
-- -----------------------------------------------------
CREATE TABLE `land_plots` (
    `plot_id` INT AUTO_INCREMENT PRIMARY KEY,
    `project_id` INT NULL,
    `plot_code` VARCHAR(50) UNIQUE NULL,
    `plot_khasra_no` VARCHAR(100) NOT NULL,
    `mouza_village` VARCHAR(100) NOT NULL,
    `tehsil` VARCHAR(100) NOT NULL DEFAULT 'Nagpur Rural',
    `area_hectares` DECIMAL(10,4) NOT NULL,
    `land_classification` ENUM('Multi-Crop Farmland', 'Single-Crop Agricultural', 'Barren / Dry Land', 'Residential', 'Commercial') NOT NULL DEFAULT 'Multi-Crop Farmland',
    `landowner_name` VARCHAR(150) NOT NULL DEFAULT 'Registered Owner',
    `aadhaar_linked` BOOLEAN NOT NULL DEFAULT TRUE,
    `base_circle_rate` DECIMAL(15,2) NOT NULL DEFAULT 2000000.00,
    `multiplier_factor` DECIMAL(4,2) NOT NULL DEFAULT 2.50,
    `calculated_compensation` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `highway_distance_marker` DECIMAL(7,2) NULL,
    `gps_centroid_lat` DECIMAL(10,8) NULL,
    `gps_centroid_lng` DECIMAL(11,8) NULL,
    `acquisition_status` ENUM('Notice Intended', 'JMS Lock', 'Sec 19 Award', 'Under Review', 'Disputed', 'Acquired', 'Disbursed') DEFAULT 'Notice Intended',
    `dbt_status` VARCHAR(100) NOT NULL DEFAULT 'Escrow Ready',
    `dispute_reason` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`project_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 4. PLOT OWNERSHIP MAPPING
-- -----------------------------------------------------
CREATE TABLE `plot_ownership` (
    `plot_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `ownership_percentage` DECIMAL(5,2) DEFAULT 100.00,
    PRIMARY KEY (`plot_id`, `user_id`),
    FOREIGN KEY (`plot_id`) REFERENCES `land_plots`(`plot_id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 5. FIELD SURVEY & DGPS BOUNDARY VERIFICATION
-- -----------------------------------------------------
CREATE TABLE `survey_vertices` (
    `vertex_id` INT AUTO_INCREMENT PRIMARY KEY,
    `plot_id` INT NOT NULL,
    `vertex_sequence` INT NOT NULL,
    `latitude` DECIMAL(10,8) NOT NULL,
    `longitude` DECIMAL(11,8) NOT NULL,
    `elevation_msl` DECIMAL(6,2) NULL,
    `accuracy_cm` VARCHAR(20) DEFAULT '±1.4 cm',
    `captured_by_officer_id` INT NULL,
    `captured_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`plot_id`) REFERENCES `land_plots`(`plot_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `survey_landmarks` (
    `landmark_id` INT AUTO_INCREMENT PRIMARY KEY,
    `plot_id` INT NOT NULL,
    `photo_url` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `captured_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`plot_id`) REFERENCES `land_plots`(`plot_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 6. RFCTLARR ACT 2013 LEGAL COMPENSATION CALCULATOR
-- -----------------------------------------------------
CREATE TABLE `compensation_valuations` (
    `valuation_id` INT AUTO_INCREMENT PRIMARY KEY,
    `plot_id` INT UNIQUE NOT NULL,
    `base_circle_rate_per_ha` DECIMAL(15,2) NOT NULL,
    `multiplier_factor` DECIMAL(3,2) NOT NULL DEFAULT 2.50,
    `computed_market_value` DECIMAL(15,2) NOT NULL,
    `solatium_amount` DECIMAL(15,2) NOT NULL,
    `additional_interest` DECIMAL(15,2) DEFAULT 0.00,
    `assets_valuation` DECIMAL(15,2) DEFAULT 0.00,
    `final_total_compensation` DECIMAL(15,2) NOT NULL,
    `calculated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`plot_id`) REFERENCES `land_plots`(`plot_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 7. WORKFLOWS & DSC APPROVALS
-- -----------------------------------------------------
CREATE TABLE `workflow_approvals` (
    `approval_id` INT AUTO_INCREMENT PRIMARY KEY,
    `plot_id` INT NOT NULL,
    `approval_type` ENUM('Joint Survey Verification', 'Section 19 Declaration', 'Direct Benefit Transfer') NOT NULL,
    `status` ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    `assigned_cala_id` INT NULL,
    `digital_signature_hash` VARCHAR(64) DEFAULT NULL,
    `actioned_at` TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (`plot_id`) REFERENCES `land_plots`(`plot_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 8. DBT PAYMENTS & BANK TRANSFERS
-- -----------------------------------------------------
CREATE TABLE `dbt_payments` (
    `payment_id` INT AUTO_INCREMENT PRIMARY KEY,
    `plot_id` INT NOT NULL,
    `recipient_user_id` INT NULL,
    `recipient_name` VARCHAR(150) NOT NULL,
    `amount_paid` DECIMAL(15,2) NOT NULL,
    `pfms_voucher_no` VARCHAR(100) UNIQUE NOT NULL,
    `bank_transfer_status` ENUM('Initiated', 'Escrow Ready', 'Processing', 'Completed', 'Failed') DEFAULT 'Escrow Ready',
    `transaction_timestamp` TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (`plot_id`) REFERENCES `land_plots`(`plot_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 9. PUBLIC COMPLAINTS & GRIEVANCE REDRESSAL (HELPDESK)
-- -----------------------------------------------------
CREATE TABLE `citizen_grievances` (
    `grievance_id` INT AUTO_INCREMENT PRIMARY KEY,
    `grievance_code` VARCHAR(50) UNIQUE NOT NULL,
    `plot_id` INT DEFAULT NULL,
    `plot_khasra_no` VARCHAR(100) DEFAULT NULL,
    `mouza_village` VARCHAR(100) DEFAULT NULL,
    `complainant_name` VARCHAR(100) NOT NULL,
    `complainant_phone` VARCHAR(20) DEFAULT NULL,
    `complainant_email` VARCHAR(150) DEFAULT NULL,
    `complainant_aadhaar` VARCHAR(20) DEFAULT NULL,
    `appeal_type` ENUM('Boundary Overlap', 'Title Objection', 'Partition Dispute', 'Asset Valuation Review', 'Compensation Delay', 'Demarcation Issue', 'Other') NOT NULL,
    `priority` ENUM('Standard', 'High', 'Urgent') DEFAULT 'Standard',
    `description` TEXT NOT NULL,
    `officer_remarks` TEXT DEFAULT NULL,
    `assigned_officer` VARCHAR(100) DEFAULT 'SLAO-082 Patwari Division',
    `hearing_date` DATE DEFAULT NULL,
    `status` ENUM('Pending Review', 'Assigned to Field Officer', 'Hearing Scheduled', 'Resolved') DEFAULT 'Pending Review',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`plot_id`) REFERENCES `land_plots`(`plot_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- SEED INITIAL DATA
-- -----------------------------------------------------

-- Users
INSERT INTO `users` (`name`, `email`, `phone_number`, `aadhaar_no`, `role`, `officer_id`, `dsc_token_connected`) VALUES
('Dr. Rajeshwar Rao (IAS)', 'rajeshwar.rao.ias@ebhumi.gov.in', '9820011223', '998877665544', 'System Admin', 'LAO-094', TRUE),
('Shri Vikram K. Deshmukh', 'vikram.deshmukh@ebhumi.gov.in', '9820022334', '887766554433', 'Field Officer', 'SLAO-082', FALSE),
('Rameshwar Patil', 'rameshwar.patil@gmail.com', '9820033445', '849210293847', 'Landowner', NULL, FALSE),
('Public Citizen (Guest)', 'citizen.guest@ebhumi.gov.in', '9820044556', NULL, 'Public Viewer', NULL, FALSE);

-- Projects
INSERT INTO `projects` (`project_code`, `corridor_name`, `sector_route`, `section_3a_notice_no`, `district`, `distance_marker_start`, `distance_marker_end`, `target_land_hectares`, `acquired_hectares`, `approved_compensation_fund`, `disbursed_compensation`, `project_status`, `incharge_officer`) VALUES
('PKG-4B', 'NH-44 Express Corridor Expansion — Package 4B', 'Nagpur — Hinganghat Highway Route', 'S.O. 1842(E)', 'Nagpur Rural District', 114.00, 168.00, 1687.00, 1018.58, 620000000.00, 362500000.00, 'Legal Approvals', 'Dr. Rajeshwar Rao (IAS) - Special Land Acquisition Officer'),
('PKG-2A', 'NH-53 Bypass Expansion — Package 2A', 'Nagpur — Bhandara Highway Link', 'S.O. 2045(E)', 'Bhandara & Nagpur East', 42.00, 98.00, 640.00, 412.00, 280000000.00, 178400000.00, 'Active Survey', 'Shri V. K. Deshmukh (SLAO-082)'),
('FEEDER-01', 'Samruddhi Mahamarg Feeder Link — Phase 1', 'Wardha — Butibori Expressway Connector', 'S.O. 1190(E)', 'Wardha & Butibori Rural', 0.00, 34.00, 820.00, 740.00, 410000000.00, 382100000.00, 'Disbursement', 'Smt. Anjali Sharma (CALA / SDM)');

-- Land Plots
INSERT INTO `land_plots` (`project_id`, `plot_code`, `plot_khasra_no`, `mouza_village`, `tehsil`, `area_hectares`, `land_classification`, `landowner_name`, `aadhaar_linked`, `base_circle_rate`, `multiplier_factor`, `calculated_compensation`, `highway_distance_marker`, `gps_centroid_lat`, `gps_centroid_lng`, `acquisition_status`, `dbt_status`, `dispute_reason`) VALUES
(1, 'MH-NGP-4028', '141/2', 'Umred', 'Nagpur Rural', 1.8000, 'Single-Crop Agricultural', 'Devidas G. Nimje', TRUE, 1800000.00, 2.50, 9240000.00, 137.80, 20.89500000, 79.02200000, 'Acquired', 'Paid via Bank Transfer (PFMS)', NULL),
(1, 'MH-NGP-4029', '142/3A', 'Umred', 'Nagpur Rural', 2.8500, 'Multi-Crop Farmland', 'Rameshwar Patil & 2 Others', TRUE, 2000000.00, 2.50, 14250000.00, 138.62, 20.89800000, 79.02550000, 'Sec 19 Award', 'Government Escrow Ready', NULL),
(1, 'MH-NGP-4030', '143/1', 'Bhiwapur', 'Nagpur Rural', 3.1000, 'Barren / Dry Land', 'Smt. Sunita M. Barapatre', TRUE, 1500000.00, 2.50, 11200000.00, 139.40, 20.90100000, 79.02850000, 'JMS Lock', 'Under Officer Review', NULL),
(1, 'MH-NGP-4031', '144/2', 'Bhiwapur', 'Nagpur Rural', 1.4500, 'Multi-Crop Farmland', 'Ganesh K. Thakre & Co-sharer', FALSE, 2200000.00, 2.50, 8620000.00, 142.20, 20.90350000, 79.03200000, 'Disputed', 'Payment on Hold', 'Boundary partition objection filed regarding inheritance of Survey No. 144/2.'),
(1, 'MH-NGP-4032', '145/1B', 'Umred', 'Nagpur Rural', 2.1000, 'Residential', 'Chandrakant Deshmukh', TRUE, 1900000.00, 2.50, 11800000.00, 143.15, 20.89350000, 79.02450000, 'Disbursed', 'Paid via Bank Transfer (PFMS)', NULL),
(1, 'MH-NGP-4033', '146/4', 'Kuhi', 'Nagpur Rural', 1.9500, 'Commercial', 'Vitthalrao S. Gaikwad', TRUE, 2400000.00, 2.50, 13500000.00, 144.80, 20.89550000, 79.02700000, 'Notice Intended', 'Valuation Finalization', NULL),
(1, 'MH-NGP-4034', '148/2', 'Kuhi', 'Nagpur Rural', 2.4000, 'Single-Crop Agricultural', 'Babu Rao Shinde & 4 Family Members', FALSE, 1600000.00, 2.50, 9800000.00, 146.20, 20.89780000, 79.02950000, 'Under Review', 'Initial Notice Stage', NULL);

-- Compensation Valuations
INSERT INTO `compensation_valuations` (`plot_id`, `base_circle_rate_per_ha`, `multiplier_factor`, `computed_market_value`, `solatium_amount`, `additional_interest`, `assets_valuation`, `final_total_compensation`) VALUES
(1, 1800000.00, 2.50, 4500000.00, 4500000.00, 840000.00, 1200000.00, 9240000.00),
(2, 2000000.00, 2.50, 5700000.00, 5700000.00, 1350000.00, 1500000.00, 14250000.00),
(3, 1500000.00, 2.50, 4650000.00, 4650000.00, 950000.00, 950000.00, 11200000.00),
(4, 2200000.00, 2.50, 3190000.00, 3190000.00, 740000.00, 1500000.00, 8620000.00),
(5, 1900000.00, 2.50, 3990000.00, 3990000.00, 1120000.00, 2700000.00, 11800000.00),
(6, 2400000.00, 2.50, 4680000.00, 4680000.00, 1200000.00, 2940000.00, 13500000.00),
(7, 1600000.00, 2.50, 3840000.00, 3840000.00, 880000.00, 1240000.00, 9800000.00);

-- Citizen Grievances
INSERT INTO `citizen_grievances` (`grievance_code`, `plot_id`, `plot_khasra_no`, `mouza_village`, `complainant_name`, `complainant_phone`, `complainant_email`, `appeal_type`, `priority`, `description`, `officer_remarks`, `assigned_officer`, `hearing_date`, `status`) VALUES
('GR-2024-88', 4, '144/2', 'Bhiwapur', 'Ganesh K. Thakre', '9822334455', 'ganesh.thakre@gmail.com', 'Boundary Overlap', 'Urgent', 'Boundary overlap objection lodged regarding partition of Survey No. 144/2. The southern boundary overlaps with Khasra 144/1 by approx 12 meters. Competent authority hearing requested before award disbursement.', 'Notice issued to Sub-Divisional Magistrate. Hearing scheduled for CALA bench.', 'SLAO-082 Patwari Division', '2024-10-24', 'Hearing Scheduled'),
('INQ-2024-12', 6, '146/4', 'Kuhi', 'Vitthalrao S. Gaikwad', '9822445566', 'vitthal.gaikwad@gmail.com', 'Asset Valuation Review', 'Standard', 'Tree asset valuation review request. Over 45 mature Teak and Orange trees were planted on the acquisition strip which were under-counted in the preliminary valuation schedule.', 'Horticulture officer conducted site reinspection on 12 Sep. Tree count updated to 52 trees in ledger.', 'District Horticulture Inspector', NULL, 'Resolved'),
('GR-2024-105', 2, '142/3A', 'Umred', 'Rameshwar Patil', '9820033445', 'rameshwar.patil@gmail.com', 'Compensation Delay', 'High', 'Inquiry regarding expected DBT bank transfer timeline following Section 19 declaration. All bank account and Aadhaar documents submitted to Patwari office.', 'CALA digital signature completed. DBT escrow scheduled for disbursement batch #4.', 'Special Land Acquisition Officer (CALA)', '2024-10-28', 'Assigned to Field Officer'),
('GR-2024-118', 7, '148/2', 'Kuhi', 'Babu Rao Shinde', '9822778899', 'baburao.shinde@gmail.com', 'Title Objection', 'Urgent', 'Co-sharer succession certificate dispute. Property mutation under Section 3A pending in Revenue Court.', 'Referred to revenue court record room for mutation verification.', 'Revenue Tahsildar Umred', NULL, 'Pending Review');
