const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');

// GET all projects
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const [rows] = await db.query('SELECT * FROM projects ORDER BY featured DESC, created_at DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single project
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const [rows] = await db.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ success: false, error: 'Project not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create project
router.post('/', async (req, res) => {
  try {
    const { title, description, tech_stack, github_url, live_url, category, featured } = req.body;
    if (!title) return res.status(400).json({ success: false, error: 'Title is required' });
    const db = getDB();
    const [result] = await db.query(
      'INSERT INTO projects (title, description, tech_stack, github_url, live_url, category, featured) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, description, tech_stack, github_url, live_url, category, featured ? 1 : 0]
    );
    res.status(201).json({ success: true, id: result.insertId, message: 'Project created' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update project
router.put('/:id', async (req, res) => {
  try {
    const { title, description, tech_stack, github_url, live_url, category, featured } = req.body;
    const db = getDB();
    await db.query(
      'UPDATE projects SET title=?, description=?, tech_stack=?, github_url=?, live_url=?, category=?, featured=? WHERE id=?',
      [title, description, tech_stack, github_url, live_url, category, featured ? 1 : 0, req.params.id]
    );
    res.json({ success: true, message: 'Project updated' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE project
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    await db.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
