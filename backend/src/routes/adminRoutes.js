const express = require('express');
const prisma = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Enforce authentication & ADMIN role for all routes in this router
router.use(authenticateToken);
router.use(requireRole('ADMIN'));

// GET /api/admin/users - List all platform users with roles
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        _count: { select: { trips: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch platform users.' });
  }
});

// PUT /api/admin/users/:id/role - Change user role (TRAVELER <-> ADMIN)
router.put('/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['ADMIN', 'TRAVELER'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be ADMIN or TRAVELER.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: `Admin updated user ${updatedUser.email} role to ${role}`
      }
    });

    res.json({ message: `Role updated to ${role} successfully.`, user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user role.' });
  }
});

// DELETE /api/admin/users/:id - Delete user account
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({ error: 'You cannot delete your own admin account.' });
    }

    await prisma.user.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: `Admin deleted user ${id}`
      }
    });

    res.json({ message: 'User account deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user.' });
  }
});

// GET /api/admin/stats - Get platform metrics & analytics
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalTrips = await prisma.trip.count();
    const totalActivities = await prisma.activity.count();
    const totalExpenses = await prisma.expense.aggregate({ _sum: { amount: true } });

    res.json({
      stats: {
        totalUsers,
        totalTrips,
        totalActivities,
        totalExpenses: totalExpenses._sum.amount || 0
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch platform metrics.' });
  }
});

module.exports = router;
