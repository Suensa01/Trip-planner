const express = require('express');
const prisma = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/trips - Fetch active trip or all trips for current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    let trip = await prisma.trip.findFirst({
      where: { userId: req.user.id },
      include: {
        activities: { orderBy: { dayNumber: 'asc' } },
        expenses: true,
        documents: true
      }
    });

    // If user has no trip yet, create initial default trip for user
    if (!trip) {
      trip = await prisma.trip.create({
        data: {
          userId: req.user.id,
          title: 'Summer Adventure in Rome & Amalfi',
          destination: 'Rome, Italy',
          coverImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
          budgetLimit: 2500,
          startDate: '2026-09-10',
          endDate: '2026-09-15',
          activities: {
            create: [
              { dayNumber: 1, title: 'Flight Arrival at Fiumicino Airport', type: 'flight', time: '10:00 AM', location: 'FCO Airport', price: 320, notes: 'Terminal 3' },
              { dayNumber: 1, title: 'Check-in at Hotel Artemide', type: 'hotel', time: '01:30 PM', location: 'Via Nazionale 22, Rome', price: 180, notes: 'Confirmation #QT-9982' },
              { dayNumber: 2, title: 'Colosseum Guided Tour', type: 'activity', time: '09:30 AM', location: 'Piazza del Colosseo', price: 65, notes: 'Skip line tickets' }
            ]
          },
          expenses: {
            create: [
              { title: 'Hotel Artemide (3 Nights)', amount: 540, payer: req.user.name, category: 'Lodging', date: '2026-09-10' },
              { title: 'Roundtrip Flights', amount: 960, payer: req.user.name, category: 'Transport', date: '2026-09-10' }
            ]
          },
          documents: {
            create: [
              { name: 'Flight_Confirmation_FCO.pdf', type: 'pdf', size: '1.2 MB', category: 'Flights', code: 'QT-AIR-8821' },
              { name: 'Hotel_Artemide_Voucher.pdf', type: 'pdf', size: '850 KB', category: 'Hotels', code: 'BOOK-HTL-9021' }
            ]
          }
        },
        include: {
          activities: true,
          expenses: true,
          documents: true
        }
      });
    }

    res.json({ trip });
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
