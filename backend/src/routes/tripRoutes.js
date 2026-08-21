const express = require('express');
const prisma = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/trips - Fetch active trip or all trips for current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const trip = await prisma.trip.findFirst({
      where: { userId: req.user.id },
      include: {
        activities: { orderBy: { dayNumber: 'asc' } },
        expenses: true,
        documents: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ trip: trip || null });
  } catch (err) {
    console.error('Fetch Trips Error:', err);
    res.status(500).json({ error: 'Failed to fetch trip data.' });
  }
});

// POST /api/trips - Create new custom trip
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, destination, coverImage, budgetLimit, startDate, endDate } = req.body;

    const newTrip = await prisma.trip.create({
      data: {
        userId: req.user.id,
        title: title || 'My Custom Travel Plan',
        destination: destination || 'Paris, France',
        coverImage: coverImage || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
        budgetLimit: Number(budgetLimit) || 0,
        startDate: startDate || '2026-10-01',
        endDate: endDate || '2026-10-05'
      },
      include: {
        activities: true,
        expenses: true,
        documents: true
      }
    });

    res.status(201).json({ trip: newTrip });
  } catch (err) {
    console.error('Create Trip Error:', err);
    res.status(500).json({ error: 'Failed to create trip.' });
  }
});

// PUT /api/trips/:id - Update trip details (budgetLimit, title, destination)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { budgetLimit, title, destination } = req.body;

    const updatedTrip = await prisma.trip.update({
      where: { id },
      data: {
        ...(budgetLimit !== undefined && { budgetLimit: Number(budgetLimit) }),
        ...(title && { title }),
        ...(destination && { destination })
      }
    });

    res.json({ trip: updatedTrip });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update trip details.' });
  }
});

// POST /api/trips/:tripId/activities - Add activity to day
router.post('/:tripId/activities', authenticateToken, async (req, res) => {
  try {
    const { tripId } = req.params;
    const { dayNumber, title, type, time, location, price, notes, lat, lng } = req.body;

    const activity = await prisma.activity.create({
      data: {
        tripId,
        dayNumber: Number(dayNumber) || 1,
        title,
        type: type || 'activity',
        time: time || '10:00 AM',
        location: location || 'City Center',
        price: Number(price) || 0,
        notes: notes || '',
        lat: lat || 41.89,
        lng: lng || 12.48
      }
    });

    res.status(201).json({ activity });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add activity.' });
  }
});

// DELETE /api/trips/:tripId/activities/:actId - Remove activity
router.delete('/:tripId/activities/:actId', authenticateToken, async (req, res) => {
  try {
    const { actId } = req.params;
    await prisma.activity.delete({ where: { id: actId } });
    res.json({ message: 'Activity removed.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete activity.' });
  }
});

module.exports = router;
