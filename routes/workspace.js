// routes/workspace.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// GET all workspaces (accessible to both hosts and guests)
router.get('/', async (req, res) => {
  // Your code to retrieve and return all workspaces
});

// POST a new workspace (accessible only to hosts)
router.post('/', authMiddleware, async (req, res) => {
  // Check if the user is a host
  if (req.user.role !== 'host') {
    return res.status(403).json({ msg: 'Access forbidden, user is not a host' });
  }

  // Your code to create a new workspace
});

// GET a specific workspace by ID (accessible to both hosts and guests)
router.get('/:id', async (req, res) => {
  // Your code to retrieve and return a specific workspace
});

// PUT update a workspace by ID (accessible only to hosts)
router.put('/:id', authMiddleware, async (req, res) => {
  // Check if the user is a host
  if (req.user.role !== 'host') {
    return res.status(403).json({ msg: 'Access forbidden, user is not a host' });
  }

  // Your code to update a workspace
});

// DELETE a workspace by ID (accessible only to hosts)
router.delete('/:id', authMiddleware, async (req, res) => {
  // Check if the user is a host
  if (req.user.role !== 'host') {
    return res.status(403).json({ msg: 'Access forbidden, user is not a host' });
  }

  // Your code to delete a workspace
});

module.exports = router;
