# 🚀 Gopika — Full Stack Portfolio

A complete full-stack personal portfolio built with **Node.js + Express** (backend), **MySQL** (database), and **HTML/CSS/JavaScript** (frontend). Deployable on **Vercel** (frontend+API) or **Heroku/Railway** (full server).

---

## 📁 Project Structure

```
portfolio/
├── backend/
│   ├── server.js          ← Express app entry point
│   ├── config/
│   │   └── db.js          ← MySQL connection + in-memory fallback
│   └── routes/
│       ├── projects.js    ← CRUD API for projects
│       └── contact.js     ← Contact form API
├── frontend/
│   ├── index.html         ← Main single-page HTML
│   ├── css/style.css      ← Full stylesheet
│   └── js/main.js         ← Frontend JS (API calls, rendering)
├── database/
│   └── schema.sql         ← MySQL schema + seed data
├── package.json
├── vercel.json            ← Vercel deployment config
├── .env.example           ← Environment variable template
└── .gitignore
```

---

## ⚡ Quick Start (Local)

### 1. Clone or download the project

```bash
git clone https://github.com/<your-username>/portfolio.git
cd portfolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your MySQL credentials (or leave DB_HOST blank for in-memory mode)
```

### 4. Set up MySQL (optional — skip for in-memory demo mode)

```bash
mysql -u root -p < database/schema.sql
```

### 5. Run the server

```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm start
```

Open **http://localhost:3000** in your browser. ✅

> 💡 **No MySQL? No problem.** The app automatically uses an in-memory data store if `DB_HOST` is not set, so you can run and demo it instantly.

---

## 🌐 REST API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/projects` | Get all projects |
| GET | `/api/projects/:id` | Get single project |
| POST | `/api/projects` | Add new project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| POST | `/api/contact` | Submit contact message |
| GET | `/api/health` | Health check |

### Example — Add a project

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Todo App",
    "description": "A task manager with CRUD operations.",
    "tech_stack": "React, Node.js, MySQL",
    "github_url": "https://github.com/gopika/todo-app",
    "live_url": "https://todo.gopika.dev",
    "category": "Full Stack",
    "featured": true
  }'
```

---

## 🗄️ Database Schema

```sql
-- Projects
CREATE TABLE projects (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(200)  NOT NULL,
  description TEXT,
  tech_stack  VARCHAR(300),
  github_url  VARCHAR(300),
  live_url    VARCHAR(300),
  category    VARCHAR(100),       -- 'Frontend' | 'Backend' | 'Full Stack'
  featured    TINYINT(1) DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact messages
CREATE TABLE contacts (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(150) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  message    TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📤 Upload to GitHub

```bash
# Inside the portfolio folder
git init
git add .
git commit -m "Initial commit: Full stack portfolio"

# Create a repo on GitHub, then:
git remote add origin https://github.com/<your-username>/portfolio.git
git branch -M main
git push -u origin main
```

---

## 🚀 Deploy to Vercel (Free — Recommended)

1. Push your code to GitHub (above)
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your GitHub repo
3. Add Environment Variables in the Vercel dashboard:
   - `DB_HOST` → your MySQL host (e.g., from PlanetScale or Railway)
   - `DB_USER`, `DB_PASSWORD`, `DB_NAME`
4. Click **Deploy** ✅

> **Free MySQL options:** [PlanetScale](https://planetscale.com) (free tier), [Railway](https://railway.app), or [Aiven](https://aiven.io)

---

## 🚀 Deploy to Railway (Full Stack — Easy)

1. Go to [railway.app](https://railway.app) → **New Project**
2. **Add MySQL** service → copy the connection string
3. **Add GitHub repo** → set environment variables
4. Railway auto-deploys on every git push ✅

---

## 🛠️ Customising Your Portfolio

### Update your info
Edit `frontend/index.html`:
- Change name, tagline, CGPA, college name
- Update `href` links for GitHub, LinkedIn, Email

### Add a new project via API
```bash
curl -X POST https://your-deployed-url/api/projects \
  -H "Content-Type: application/json" \
  -d '{"title":"New Project","description":"...","tech_stack":"React","category":"Frontend","featured":true}'
```

### Add a new project via SQL
```sql
INSERT INTO projects (title, description, tech_stack, github_url, category, featured)
VALUES ('My App', 'Description here', 'HTML, CSS, JS', 'https://github.com/...', 'Frontend', 1);
```

---

## 🧰 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MySQL (with in-memory fallback) |
| Deploy | Vercel / Railway / Heroku |
| Version Control | Git + GitHub |

---

## 📝 License
MIT © Gopika
