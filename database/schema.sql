-- ============================================
-- Portfolio Database Schema
-- Run this once to set up your MySQL database
-- ============================================

CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(200)  NOT NULL,
  description TEXT,
  tech_stack  VARCHAR(300),
  github_url  VARCHAR(300),
  live_url    VARCHAR(300),
  category    VARCHAR(100),
  featured    TINYINT(1)    DEFAULT 0,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contacts (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(150) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  message    TEXT         NOT NULL,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- Seed sample projects
INSERT INTO projects (title, description, tech_stack, github_url, live_url, category, featured) VALUES
(
  'Expense Tracker',
  'A dynamic web application to track daily expenses and income. Features category-wise breakdown, monthly summaries, and interactive charts. Built using DOM manipulation and array-based data handling.',
  'HTML, CSS, JavaScript',
  'https://github.com/gopika/expense-tracker',
  '',
  'Frontend',
  1
),
(
  'Bus Reservation System',
  'A full-featured bus ticket booking system with seat selection, passenger management, and booking history. Implements JDBC connectivity with MySQL for persistent data storage and OOP design patterns in Java.',
  'Java, MySQL, JDBC',
  'https://github.com/gopika/bus-reservation',
  '',
  'Backend',
  1
),
(
  'Personal Portfolio',
  'This full-stack portfolio website built with Node.js/Express backend, MySQL database, and vanilla HTML/CSS/JS frontend. Includes REST API, contact form, and dynamic project rendering.',
  'Node.js, Express, MySQL, HTML, CSS, JavaScript',
  'https://github.com/gopika/portfolio',
  '',
  'Full Stack',
  1
);
