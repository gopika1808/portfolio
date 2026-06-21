// db.js - Database configuration
// Supports MySQL (production) with in-memory fallback for local dev

let db;
let usingMock = false;

// In-memory mock store for local development (no MySQL needed)
const mockProjects = [
  {
    id: 1,
    title: 'Expense Tracker',
    description: 'A dynamic web application to track daily expenses and income. Features category-wise breakdown, monthly summaries, and interactive charts. Built using DOM manipulation and array-based data handling.',
    tech_stack: 'HTML, CSS, JavaScript',
    github_url: 'https://github.com/gopika/expense-tracker',
    live_url: '',
    category: 'Frontend',
    featured: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Bus Reservation System',
    description: 'A full-featured bus ticket booking system with seat selection, passenger management, and booking history. Implements JDBC connectivity with MySQL for persistent data storage and OOP design patterns in Java.',
    tech_stack: 'Java, MySQL, JDBC',
    github_url: 'https://github.com/gopika/bus-reservation',
    live_url: '',
    category: 'Backend',
    featured: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Personal Portfolio',
    description: 'This full-stack portfolio website built with Node.js/Express backend, MySQL database, and vanilla HTML/CSS/JS frontend. Includes REST API, contact form, and dynamic project rendering.',
    tech_stack: 'Node.js, Express, MySQL, HTML, CSS, JavaScript',
    github_url: 'https://github.com/gopika/portfolio',
    live_url: '',
    category: 'Full Stack',
    featured: 1,
    created_at: new Date().toISOString()
  }
];

const mockContacts = [];

async function initDB() {
  // Try MySQL first
  if (process.env.DB_HOST) {
    try {
      const mysql = require('mysql2/promise');
      const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'portfolio_db',
        waitForConnections: true,
        connectionLimit: 10
      });

      // Test connection
      await pool.query('SELECT 1');

      // Create tables if not exist
      await pool.query(`
        CREATE TABLE IF NOT EXISTS projects (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(200) NOT NULL,
          description TEXT,
          tech_stack VARCHAR(300),
          github_url VARCHAR(300),
          live_url VARCHAR(300),
          category VARCHAR(100),
          featured TINYINT(1) DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS contacts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(150) NOT NULL,
          email VARCHAR(150) NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      console.log('✅ Connected to MySQL database');
      db = pool;
      usingMock = false;
      return pool;
    } catch (err) {
      console.warn('⚠️  MySQL not available, using in-memory store:', err.message);
    }
  }

  // Fallback: in-memory mock DB
  console.log('📦 Using in-memory data store (set DB_HOST env var for MySQL)');
  usingMock = true;

  db = {
    async query(sql, params) {
      const s = sql.trim().toUpperCase();

      if (s.startsWith('SELECT') && s.includes('PROJECTS')) {
        if (s.includes('WHERE ID')) {
          const id = parseInt(params[0]);
          return [[mockProjects.find(p => p.id === id)]];
        }
        return [mockProjects];
      }

      if (s.startsWith('INSERT INTO PROJECTS')) {
        const [title, description, tech_stack, github_url, live_url, category, featured] = params;
        const newP = { id: Date.now(), title, description, tech_stack, github_url, live_url, category, featured, created_at: new Date().toISOString() };
        mockProjects.push(newP);
        return [{ insertId: newP.id }];
      }

      if (s.startsWith('UPDATE PROJECTS')) {
        const id = params[params.length - 1];
        const idx = mockProjects.findIndex(p => p.id === parseInt(id));
        if (idx >= 0) {
          mockProjects[idx] = { ...mockProjects[idx], title: params[0], description: params[1], tech_stack: params[2], github_url: params[3], live_url: params[4], category: params[5], featured: params[6] };
        }
        return [{ affectedRows: 1 }];
      }

      if (s.startsWith('DELETE FROM PROJECTS')) {
        const id = parseInt(params[0]);
        const idx = mockProjects.findIndex(p => p.id === id);
        if (idx >= 0) mockProjects.splice(idx, 1);
        return [{ affectedRows: 1 }];
      }

      if (s.startsWith('INSERT INTO CONTACTS')) {
        const [name, email, message] = params;
        mockContacts.push({ id: Date.now(), name, email, message, created_at: new Date().toISOString() });
        return [{ insertId: mockContacts.length }];
      }

      return [[]];
    }
  };

  return db;
}

function getDB() {
  return db;
}

module.exports = { initDB, getDB };
