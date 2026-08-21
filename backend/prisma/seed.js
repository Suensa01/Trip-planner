const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed into Supabase PostgreSQL...');

  // Password hashes
  const adminPasswordHash = await bcrypt.hash('Admin123!', 10);
  const userPasswordHash = await bcrypt.hash('User123!', 10);

  // 1. Create Super Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@quest.com' },
    update: { role: 'ADMIN' },
    create: {
      name: 'Super Admin',
      email: 'admin@quest.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      avatar: 'https://ui-avatars.com/api/?name=Super+Admin&background=dc3545&color=fff'
    }
  });
  console.log('✅ Super Admin created:', admin.email);

  // 2. Create Traveler 1: Alex Rivera (Paris Escape)
  const alex = await prisma.user.upsert({
    where: { email: 'alex@example.com' },
    update: {},
    create: {
      name: 'Alex Rivera',
      email: 'alex@example.com',
      passwordHash: userPasswordHash,
      role: 'TRAVELER',
      avatar: 'https://ui-avatars.com/api/?name=Alex+Rivera&background=0d6efd&color=fff'
    }
  });

  // Create personalized trip for Alex
  const alexTrip = await prisma.trip.create({
    data: {
      userId: alex.id,
      title: 'Romantic Paris Getaway & Seine Cruise',
      destination: 'Paris, France',
      coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      budgetLimit: 3200,
      startDate: '2026-09-15',
      endDate: '2026-09-20',
      activities: {
        create: [
          { dayNumber: 1, title: 'Arrival at Charles de Gaulle (CDG)', type: 'flight', time: '09:00 AM', location: 'Paris CDG Airport', price: 450, notes: 'Terminal 2E' },
          { dayNumber: 1, title: 'Check-in at Hotel Le Meurice', type: 'hotel', time: '01:00 PM', location: '228 Rue de Rivoli, Paris', price: 380, notes: 'Confirmation #PAR-9921' },
          { dayNumber: 2, title: 'Eiffel Tower Summit Tour & Champagne', type: 'activity', time: '10:30 AM', location: 'Champ de Mars', price: 85, notes: 'Priority Access' },
          { dayNumber: 3, title: 'Louvre Museum Mona Lisa Tour', type: 'activity', time: '02:00 PM', location: 'Rue de Rivoli', price: 60, notes: 'Gallery Wing A' }
        ]
      },
      expenses: {
        create: [
          { title: 'Luxury Hotel Le Meurice (4 Nights)', amount: 1520, payer: 'Alex Rivera', category: 'Lodging', date: '2026-09-15' },
          { title: 'Air France Business Flight', amount: 900, payer: 'Alex Rivera', category: 'Transport', date: '2026-09-15' },
          { title: 'Gourmet Bistro Dinner', amount: 140, payer: 'Alex Rivera', category: 'Food', date: '2026-09-16' }
        ]
      },
      documents: {
        create: [
          { name: 'Air_France_Flight_CDG.pdf', type: 'pdf', size: '1.4 MB', category: 'Flights', code: 'AF-PAR-7721' },
          { name: 'Le_Meurice_Voucher.pdf', type: 'pdf', size: '920 KB', category: 'Hotels', code: 'HTL-PAR-1092' }
        ]
      }
    }
  });
  console.log('✅ Fabricated Traveler Alex Rivera seeded with personalized trip:', alexTrip.title);

  // 3. Create Traveler 2: Maya Lin (Tokyo Tech & Culture)
  const maya = await prisma.user.upsert({
    where: { email: 'maya@example.com' },
    update: {},
    create: {
      name: 'Maya Lin',
      email: 'maya@example.com',
      passwordHash: userPasswordHash,
      role: 'TRAVELER',
      avatar: 'https://ui-avatars.com/api/?name=Maya+Lin&background=198754&color=fff'
    }
  });

  const mayaTrip = await prisma.trip.create({
    data: {
      userId: maya.id,
      title: 'Tokyo Neon Lights & Mt. Fuji Excursion',
      destination: 'Tokyo, Japan',
      coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
      budgetLimit: 4500,
      startDate: '2026-10-10',
      endDate: '2026-10-17',
      activities: {
        create: [
          { dayNumber: 1, title: 'Arrival at Narita Airport (NRT)', type: 'flight', time: '03:00 PM', location: 'Tokyo NRT Airport', price: 650, notes: 'JR Pass Pick up' },
          { dayNumber: 1, title: 'Check-in at Shibuya Sky Hotel', type: 'hotel', time: '05:30 PM', location: 'Shibuya Crossing, Tokyo', price: 210, notes: 'High floor city view' },
          { dayNumber: 2, title: 'Akihabara Tech & Anime Exploration', type: 'activity', time: '11:00 AM', location: 'Akihabara Electric Town', price: 120, notes: 'Gundam Cafe Visit' },
          { dayNumber: 3, title: 'Day Trip to Mt. Fuji & Lake Kawaguchiko', type: 'activity', time: '08:00 AM', location: 'Mt Fuji Fifth Station', price: 150, notes: 'Bullet train express' }
        ]
      },
      expenses: {
        create: [
          { title: 'Shibuya Sky Hotel (6 Nights)', amount: 1260, payer: 'Maya Lin', category: 'Lodging', date: '2026-10-10' },
          { title: 'Japan Rail Pass 7-Day', amount: 350, payer: 'Maya Lin', category: 'Transport', date: '2026-10-10' },
          { title: 'Sushi Omakase Experience', amount: 180, payer: 'Maya Lin', category: 'Food', date: '2026-10-11' }
        ]
      },
      documents: {
        create: [
          { name: 'ANA_Flight_Ticket_NRT.pdf', type: 'pdf', size: '1.8 MB', category: 'Flights', code: 'ANA-TYO-8821' },
          { name: 'JR_Express_Pass.pdf', type: 'pdf', size: '750 KB', category: 'Tickets', code: 'JRPASS-9901' }
        ]
      }
    }
  });
  console.log('✅ Fabricated Traveler Maya Lin seeded with personalized trip:', mayaTrip.title);

  console.log('🎉 Seeding complete! Database ready with Super Admin & Fabricated User Data.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
