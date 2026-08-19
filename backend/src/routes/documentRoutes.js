const express = require('express');
const prisma = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

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

module.exports = router;
