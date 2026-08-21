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

// POST /api/trips - Create new trip or clone template
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, destination, coverImage, days } = req.body;

    const newTrip = await prisma.trip.create({
      data: {
        userId: req.user.id,
        title: title || 'New Travel Plan',
        destination: destination || 'Rome, Italy',
        coverImage: coverImage || 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
        budgetLimit: 2500,
        startDate: '2026-10-01',
        endDate: '2026-10-05'
      }
    });

    if (days && Array.isArray(days)) {
      for (const day of days) {
        if (day.activities && Array.isArray(day.activities)) {
          for (const act of day.activities) {
            await prisma.activity.create({
              data: {
                tripId: newTrip.id,
                dayNumber: day.dayNumber || 1,
                title: act.title,
                type: act.type || 'activity',
                time: act.time || '10:00 AM',
                location: act.location || destination,
                price: Number(act.price) || 0,
                notes: act.notes || ''
              }
            });
          }
        }
      }
    }

    const fullTrip = await prisma.trip.findUnique({
      where: { id: newTrip.id },
      include: { activities: true, expenses: true, documents: true }
    });

    res.status(201).json({ trip: fullTrip });
  } catch (err) {
    console.error('Create Trip Error:', err);
    res.status(500).json({ error: 'Failed to create trip.' });
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
