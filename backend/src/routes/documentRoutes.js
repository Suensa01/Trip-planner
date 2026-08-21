const express = require('express');
const prisma = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/documents - Fetch documents for current user's active trip
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { tripId } = req.query;
    if (!tripId) {
      return res.json({ documents: [] });
    }

    const documents = await prisma.document.findMany({
      where: { tripId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ documents });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch documents.' });
  }
});

// POST /api/documents - Upload document voucher
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { tripId, name, type, size, category, code } = req.body;

    if (!tripId || !name) {
      return res.status(400).json({ error: 'tripId and document name are required.' });
    }

    const document = await prisma.document.create({
      data: {
        tripId,
        name,
        type: type || 'pdf',
        size: size || '1.2 MB',
        category: category || 'Tickets',
        code: code || `QT-DOC-${Math.floor(1000 + Math.random() * 9000)}`
      }
    });

    res.status(201).json({ document });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload document.' });
  }
});

// DELETE /api/documents/:id - Delete a document
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.document.delete({ where: { id } });
    res.json({ message: 'Document deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete document.' });
  }
});

module.exports = router;
