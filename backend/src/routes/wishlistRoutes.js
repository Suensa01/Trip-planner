const express = require('express');
const prisma = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/wishlist - Fetch user wishlist items
router.get('/', authenticateToken, async (req, res) => {
  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId: req.user.id }
    });
    res.json({ wishlist });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch wishlist.' });
  }
});

// POST /api/wishlist/toggle - Add or remove item from wishlist
router.post('/toggle', authenticateToken, async (req, res) => {
  try {
    const { itemTitle, itemPrice, itemImage, itemDescription } = req.body;

    const existing = await prisma.wishlist.findFirst({
      where: { userId: req.user.id, itemTitle }
    });

    if (existing) {
      await prisma.wishlist.delete({ where: { id: existing.id } });
      const updated = await prisma.wishlist.findMany({ where: { userId: req.user.id } });
      return res.json({ message: 'Removed from wishlist', wishlist: updated, isSaved: false });
    } else {
      await prisma.wishlist.create({
        data: {
          userId: req.user.id,
          itemTitle,
          itemPrice,
          itemImage,
          itemDescription
        }
      });
      const updated = await prisma.wishlist.findMany({ where: { userId: req.user.id } });
      return res.json({ message: 'Added to wishlist', wishlist: updated, isSaved: true });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle wishlist item.' });
  }
});

module.exports = router;
