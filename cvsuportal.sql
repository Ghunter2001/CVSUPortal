-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 20, 2024 at 06:52 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cvsuportal`
--

-- --------------------------------------------------------

--
-- Table structure for table `acadyear`
--

CREATE TABLE `acadyear` (
  `ayID` int(11) NOT NULL,
  `aycode` varchar(50) NOT NULL,
  `ayfrom` varchar(10) NOT NULL,
  `ayto` varchar(10) NOT NULL,
  `sem` varchar(10) NOT NULL,
  `status` varchar(10) NOT NULL DEFAULT 'OPEN'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `acadyear`
--

INSERT INTO `acadyear` (`ayID`, `aycode`, `ayfrom`, `ayto`, `sem`, `status`) VALUES
(69, '202420251st Sem', '2024', '2025', '1st Sem', 'OPEN'),
(72, '202520261st Sem', '2025', '2026', '1st Sem', 'CLOSE');

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `role` varchar(10) NOT NULL,
  `username` varchar(20) NOT NULL,
  `pass` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `role`, `username`, `pass`) VALUES
(1, 'admin', 'admin', '123');

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE `course` (
  `courseCode` varchar(50) NOT NULL,
  `description` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`courseCode`, `description`) VALUES
('BSIT', 'Bachelor of Science in Information Technology'),
('BSCS', 'Bachelor of Science in Computer Science'),
('BSHM', 'Bachelor of Science in Hospitality Management'),
('BSC', 'Bachelor Of Science In Criminology');

-- --------------------------------------------------------

--
-- Table structure for table `details_students`
--

CREATE TABLE `details_students` (
  `E_ID` int(11) NOT NULL,
  `role` varchar(10) NOT NULL DEFAULT 'student',
  `lname` varchar(50) NOT NULL,
  `fname` varchar(50) NOT NULL,
  `mname` varchar(50) NOT NULL,
  `bdate` varchar(50) NOT NULL,
  `Sex` varchar(50) NOT NULL,
  `cp` varchar(11) NOT NULL,
  `address` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(25) NOT NULL,
  `Status` varchar(10) NOT NULL DEFAULT 'ACTIVE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `details_students`
--

INSERT INTO `details_students` (`E_ID`, `role`, `lname`, `fname`, `mname`, `bdate`, `Sex`, `cp`, `address`, `email`, `password`, `Status`) VALUES
(1, 'SHS', 'Jon David', 'Solano', 'Gabion', '9/20/2023', 'Male', '2147483647', 'Bacoor Cavite', 'Gabion@gmail.com', '', 'ACTIVE'),
(2, 'SHS', 'Stephen', 'Aguilar', 'Ganzo', '9/12/2023', 'Male', '2147483647', 'Bacoor City', 'Ganzo@gmail.com', '', 'ACTIVE'),
(5, 'SHS', 'Sander', 'Aguilar', 'Ganzo', '9/4/2023', 'Male', '2147483647', 'dasdadasd', 'asdasddasdadsadadasdsdsdasdsa', '', 'ACTIVE'),
(6, 'SHS', 'Luis', 'Cana', 'Orencia', '9/4/2023', 'Male', '2147483647', 'asdsadasdsa', 'asdasdadasdsadsa', '', 'ACTIVE'),
(7, 'SHS', 'tertetree', 'gfdgdgd', 'fgfdgfg', '9/20/2023', 'Male', '214423234', 'fsdfsdfsf', 'sfsdfs', '', 'ACTIVE'),
(8, 'student', 'Ganzo', 'Stephen', 'Aguilar', '2024-04-05', 'Male', '2147483647', 'San Nicolas 3', 'admin1@gmail.com', '123', 'ACTIVE'),
(9, 'student', 'Ganzo', 'Sander', 'Aguilar', '2024-04-10', 'Male', '09987654321', 'San Nicolas 3', 'admin2@gmail.com', '123', 'ACTIVE'),
(10, 'student', 'Ganzo', 'Steven John', 'Aguilar', '2024-04-03', 'Male', '09123498765', 'San Nicolas 3', 'admin3@gmail.com', '123', 'ACTIVE');

-- --------------------------------------------------------

--
-- Table structure for table `details_teachers`
--

CREATE TABLE `details_teachers` (
  `T_ID` varchar(11) NOT NULL,
  `FirstName` varchar(15) NOT NULL,
  `LastName` varchar(15) NOT NULL,
  `MiddleName` varchar(15) NOT NULL,
  `Sex` varchar(10) NOT NULL,
  `Address` varchar(50) NOT NULL,
  `Email` int(11) NOT NULL,
  `BirthDate` varchar(30) NOT NULL,
  `ContactNumber` int(11) NOT NULL,
  `role` varchar(10) NOT NULL DEFAULT 'Faculty'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `details_teachers`
--

INSERT INTO `details_teachers` (`T_ID`, `FirstName`, `LastName`, `MiddleName`, `Sex`, `Address`, `Email`, `BirthDate`, `ContactNumber`, `role`) VALUES
('123456783', 'AC Bryan', 'Garcia', 'Agila', 'Male', 'Bacoor', 0, '9/8/2023', 2147483647, 'Faculty'),
('123456789', 'Joe Luis', 'Orencia', 'Cana', 'Male', 'Bacoor', 0, '9/4/2023', 2147483647, 'Faculty');

-- --------------------------------------------------------

--
-- Table structure for table `enrolledstudents`
--

CREATE TABLE `enrolledstudents` (
  `student_number` varchar(10) NOT NULL,
  `course` varchar(10) NOT NULL,
  `sec` varchar(10) NOT NULL,
  `yrlvl` varchar(10) NOT NULL,
  `lname` varchar(25) NOT NULL,
  `fname` varchar(25) NOT NULL,
  `mname` varchar(25) NOT NULL,
  `cp` varchar(11) NOT NULL,
  `sex` varchar(10) NOT NULL,
  `birthdate` varchar(10) NOT NULL,
  `email` varchar(50) NOT NULL,
  `address` varchar(100) NOT NULL,
  `password` varchar(25) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'ENROLLED',
  `role` varchar(10) NOT NULL DEFAULT 'Student'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enrolledstudents`
--

INSERT INTO `enrolledstudents` (`student_number`, `course`, `sec`, `yrlvl`, `lname`, `fname`, `mname`, `cp`, `sex`, `birthdate`, `email`, `address`, `password`, `status`, `role`) VALUES
('202110769', 'BSIT', '5', '3rd', 'Ganzo', 'Stephen', 'Aguilar', '09946456131', 'Male', '06-21-2001', 'bc.stephen.ganzo@cvsu.edu.ph', 'San Nicolas 3 Bacoor Cavite', '123', 'ENROLLED', 'Student');

-- --------------------------------------------------------

--
-- Table structure for table `faculty`
--

CREATE TABLE `faculty` (
  `id` int(11) NOT NULL,
  `role` varchar(25) NOT NULL,
  `username` varchar(50) NOT NULL,
  `pass` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `schedule`
--

CREATE TABLE `schedule` (
  `scheduleID` varchar(10) NOT NULL,
  `teacherID` varchar(10) NOT NULL,
  `studentID` varchar(10) NOT NULL,
  `subject` varchar(10) NOT NULL,
  `day` varchar(10) NOT NULL,
  `time` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `section`
--

CREATE TABLE `section` (
  `secID` int(100) NOT NULL,
  `yrlvl` varchar(10) NOT NULL,
  `sem` varchar(10) NOT NULL,
  `sec` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `section`
--

INSERT INTO `section` (`secID`, `yrlvl`, `sem`, `sec`) VALUES
(18, '1st Year', '1st Sem', '1'),
(19, '1st Year', '1st Sem', '2'),
(21, '1st Year', '2nd Sem', '1'),
(22, '1st Year', '2nd Sem', '2'),
(23, '2nd Year', '1st Sem', '4'),
(24, '2nd Year', '1st Sem', '5'),
(25, '2nd Year', '2nd Sem', '4'),
(26, '2nd Year', '2nd Sem', '5'),
(27, '3rd Year', '1st Sem', '6'),
(28, '3rd Year', '2nd Sem', '6'),
(29, '3rd Year', '1st Sem', '7'),
(30, '3rd Year', '2nd Sem', '7'),
(31, '4th Year', '1st Sem', '5'),
(32, '4th Year', '2nd Sem', '7');

-- --------------------------------------------------------

--
-- Table structure for table `subject`
--

CREATE TABLE `subject` (
  `sub_ID` int(100) NOT NULL,
  `course` varchar(25) NOT NULL,
  `subcode` varchar(20) NOT NULL,
  `description` varchar(50) NOT NULL,
  `yrlvl` varchar(10) NOT NULL,
  `sem` varchar(25) NOT NULL,
  `unitLec` varchar(10) NOT NULL,
  `unitLab` varchar(10) NOT NULL,
  `prerequisite` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subject`
--

INSERT INTO `subject` (`sub_ID`, `course`, `subcode`, `description`, `yrlvl`, `sem`, `unitLec`, `unitLab`, `prerequisite`) VALUES
(21, 'BSIT', 'COSC 50', 'Discrete Structure', '1st Year', '1st Sem', '3', '0', '---'),
(22, 'BSIT', 'DCIT 21', 'Introduction To Computing', '1st Year', '1st Sem', '2', '1', '---'),
(23, 'BSIT', 'GNED 11', 'Kontekstwalisadong Komunikasyon Sa Filipino', '1st Year', '1st Sem', '3', '0', '---'),
(24, 'BSIT', 'GNED 05', 'Purposive Communication', '1st Year', '1st Sem', '3', '0', '---'),
(25, 'BSIT', 'GNED 02', 'Ethics', '1st Year', '1st Sem', '3', '0', '---'),
(26, 'BSIT', 'DCIT 22', 'Computer Programming', '1st Year', '1st Sem', '1', '2', '---'),
(27, 'BSIT', 'FITT 1', 'Movement Enhancement', '1st Year', '1st Sem', '2', '1', '---'),
(28, 'BSIT', 'NSTP 1', 'National Service Training Program 1', '1st Year', '1st Sem', '3', '1', '---'),
(29, 'BSIT', 'ORNT 1', 'Institutional Orientation', '1st Year', '1st Sem', '1', '1', '---'),
(30, 'BSIT', 'DCIT 23', 'Computer Programming 2', '1st Year', '2nd Sem', '1', '2', 'DCIT 22');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_teachersched`
--

CREATE TABLE `tbl_teachersched` (
  `adID` int(11) NOT NULL,
  `ay` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `strand` varchar(50) NOT NULL,
  `grlvl` int(10) NOT NULL,
  `sect` varchar(50) NOT NULL,
  `teacherID` int(10) NOT NULL,
  `teacherName` varchar(50) NOT NULL,
  `subcode` varchar(50) NOT NULL,
  `desct` varchar(50) NOT NULL,
  `units` int(10) NOT NULL,
  `days` varchar(50) NOT NULL,
  `time` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_teachersched`
--

INSERT INTO `tbl_teachersched` (`adID`, `ay`, `type`, `strand`, `grlvl`, `sect`, `teacherID`, `teacherName`, `subcode`, `desct`, `units`, `days`, `time`) VALUES
(22, '2021-2022 2nd Sem', 'SHS', 'GAS', 11, 'Apple', 123456, 'Garcia, AC Bryan Agila', 'ITEC 80', 'Introduction to Human Computer Interaction', 2, 'T-Th-S', '03:33-03:33'),
(23, '2022-2023 1st Sem', 'SHS', 'HUMSS', 12, 'Grapes', 123456, 'Garcia, AC Bryan Agila', 'ITEC 80', 'Introduction to Human Computer Interaction', 2, '', '04:44-04:44'),
(24, '2022-2023 1st Sem', 'SHS', 'GAS', 11, 'Narra', 123456, 'Orencia, Joe Luis Cana', 'ITEC 80', 'Introduction to Human Computer Interaction', 2, 'M-F-S', '10:00-10:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `acadyear`
--
ALTER TABLE `acadyear`
  ADD PRIMARY KEY (`ayID`);

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `details_students`
--
ALTER TABLE `details_students`
  ADD PRIMARY KEY (`E_ID`);

--
-- Indexes for table `details_teachers`
--
ALTER TABLE `details_teachers`
  ADD PRIMARY KEY (`T_ID`);

--
-- Indexes for table `enrolledstudents`
--
ALTER TABLE `enrolledstudents`
  ADD PRIMARY KEY (`student_number`);

--
-- Indexes for table `section`
--
ALTER TABLE `section`
  ADD PRIMARY KEY (`secID`);

--
-- Indexes for table `subject`
--
ALTER TABLE `subject`
  ADD PRIMARY KEY (`sub_ID`);

--
-- Indexes for table `tbl_teachersched`
--
ALTER TABLE `tbl_teachersched`
  ADD PRIMARY KEY (`adID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `acadyear`
--
ALTER TABLE `acadyear`
  MODIFY `ayID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `details_students`
--
ALTER TABLE `details_students`
  MODIFY `E_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `section`
--
ALTER TABLE `section`
  MODIFY `secID` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `subject`
--
ALTER TABLE `subject`
  MODIFY `sub_ID` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `tbl_teachersched`
--
ALTER TABLE `tbl_teachersched`
  MODIFY `adID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
