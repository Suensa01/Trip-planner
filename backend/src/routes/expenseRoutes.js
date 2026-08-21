const express = require('express');
const prisma = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/expenses - Fetch expenses for current user's active trip
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { tripId } = req.query;
    if (!tripId) {
      return res.json({ expenses: [] });
    }

    const expenses = await prisma.expense.findMany({
      where: { tripId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ expenses });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch expenses.' });
  }
});

// POST /api/expenses - Record new expense
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { tripId, title, amount, payer, category, date } = req.body;

    if (!tripId || !title || !amount) {
      return res.status(400).json({ error: 'tripId, title, and amount are required.' });
    }

    const expense = await prisma.expense.create({
      data: {
        tripId,
        title,
        amount: Number(amount),
        payer: payer || req.user.name,
        category: category || 'Food',
        date: date || new Date().toISOString().split('T')[0]
      }
    });

    res.status(201).json({ expense });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record expense.' });
  }
});

// DELETE /api/expenses/:id - Delete an expense
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.expense.delete({ where: { id } });
    res.json({ message: 'Expense deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete expense.' });
  }
});

module.exports = router;
