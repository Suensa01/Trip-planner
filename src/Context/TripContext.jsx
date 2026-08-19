import React, { createContext, useContext, useState } from 'react';

const TripContext = createContext();

const initialTrip = {
  id: 'trip-101',
  title: 'Summer Adventure in Rome & Amalfi',
  destination: 'Rome, Italy',
  coverImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
  startDate: '2026-09-10',
  endDate: '2026-09-15',
  travelers: ['You (Alex)', 'Sarah M.', 'David K.'],
  budgetLimit: 2500,
  collaborators: [
    { name: 'Sarah M.', email: 'sarah@example.com', role: 'Editor', status: 'Active' },
    { name: 'David K.', email: 'david@example.com', role: 'Viewer', status: 'Pending' }
  ],
  comments: [
    { id: 1, author: 'Sarah M.', text: 'Should we book the Colosseum skip-the-line tickets in advance?', time: '2 hours ago' },
    { id: 2, author: 'You (Alex)', text: 'Yes! I added it to Day 2 morning itinerary.', time: '1 hour ago' }
  ],
  days: [
    {
      dayNumber: 1,
      date: '2026-09-10',
      title: 'Arrival & Historic Center Stroll',
      activities: [
        { id: 'act-1', title: 'Flight Arrival at Fiumicino Airport', type: 'flight', time: '10:00 AM', location: 'FCO Airport', price: 320, lat: 41.799, lng: 12.246, notes: 'Terminal 3 baggage claim' },
        { id: 'act-2', title: 'Check-in at Hotel Artemide', type: 'hotel', time: '01:30 PM', location: 'Via Nazionale 22, Rome', price: 180, lat: 41.901, lng: 12.493, notes: 'Confirmation #QT-9982' },
        { id: 'act-3', title: 'Trevi Fountain & Gelato Walk', type: 'activity', time: '05:00 PM', location: 'Piazza di Trevi', price: 15, lat: 41.900, lng: 12.483, notes: 'Try Pistachio at San Crispino' }
      ]
    },
    {
      dayNumber: 2,
      date: '2026-09-11',
      title: 'Colosseum & Ancient Rome Wonders',
      activities: [
        { id: 'act-4', title: 'Colosseum & Roman Forum Guided Tour', type: 'activity', time: '09:30 AM', location: 'Piazza del Colosseo', price: 65, lat: 41.890, lng: 12.492, notes: 'Skip the line priority entrance' },
        { id: 'act-5', title: 'Trattoria Lunch at Da Enzo', type: 'food', time: '01:00 PM', location: 'Trastevere, Rome', price: 35, lat: 41.888, lng: 12.476, notes: 'Famous for Cacio e Pepe' },
        { id: 'act-6', title: 'Pantheon Sunset Visit', type: 'activity', time: '06:00 PM', location: 'Piazza della Rotonda', price: 10, lat: 41.898, lng: 12.476, notes: 'Free entry after 6 PM' }
      ]
    },
    {
      dayNumber: 3,
      date: '2026-09-12',
      title: 'Vatican Museums & St. Peters Basilica',
      activities: [
        { id: 'act-7', title: 'Sistine Chapel & Vatican Museums', type: 'activity', time: '09:00 AM', location: 'Vatican City', price: 75, lat: 41.906, lng: 12.453, notes: 'Dress code strictly enforced' },
        { id: 'act-8', title: 'St. Peters Square & Dome Climb', type: 'activity', time: '02:00 PM', location: 'Piazza San Pietro', price: 12, lat: 41.902, lng: 12.457, notes: '551 steps to top view' }
      ]
    }
  ],
  expenses: [
    { id: 101, title: 'Hotel Artemide (3 Nights)', amount: 540, payer: 'You (Alex)', category: 'Lodging', date: '2026-09-10' },
    { id: 102, title: 'Roundtrip Flights Rome', amount: 960, payer: 'You (Alex)', category: 'Transport', date: '2026-09-10' },
    { id: 103, title: 'Vatican VIP Tour Pass', amount: 225, payer: 'Sarah M.', category: 'Activities', date: '2026-09-11' },
    { id: 104, title: 'Trastevere Dinner & Drinks', amount: 140, payer: 'David K.', category: 'Food', date: '2026-09-11' }
  ],
  documents: [
    { id: 'doc-1', name: 'Flight_Confirmation_FCO.pdf', type: 'pdf', size: '1.2 MB', category: 'Flights', code: 'QT-AIR-8821' },
    { id: 'doc-2', name: 'Hotel_Artemide_Voucher.pdf', type: 'pdf', size: '850 KB', category: 'Hotels', code: 'BOOK-HTL-9021' },
    { id: 'doc-3', name: 'Colosseum_Tour_Pass.png', type: 'image', size: '2.1 MB', category: 'Tickets', code: 'QR-COL-3312' }
  ],
  packingList: [
    { id: 'p-1', text: 'Passport & Driver License', category: 'Documents', completed: true },
    { id: 'p-2', text: 'European Power Plug Adapter', category: 'Electronics', completed: true },
    { id: 'p-3', text: 'Comfortable Walking Shoes', category: 'Clothing', completed: false },
    { id: 'p-4', text: 'Sunscreen & Sunglasses', category: 'Essentials', completed: false },
    { id: 'p-5', text: 'Travel Insurance Documents', category: 'Documents', completed: true },
    { id: 'p-6', text: 'Prescription Medicines', category: 'Health', completed: false }
  ]
};

export const TripProvider = ({ children }) => {
  const [activeTrip, setActiveTrip] = useState(() => {
    const saved = localStorage.getItem('quest_active_trip');
    return saved ? JSON.parse(saved) : initialTrip;
  });

  const updateTripState = (updated) => {
    setActiveTrip(updated);
    localStorage.setItem('quest_active_trip', JSON.stringify(updated));
  };

  const addActivity = (dayNumber, newActivity) => {
    const updatedDays = activeTrip.days.map((day) => {
      if (day.dayNumber === dayNumber) {
        return {
          ...day,
          activities: [...day.activities, { ...newActivity, id: `act-${Date.now()}` }]
        };
      }
      return day;
    });
    updateTripState({ ...activeTrip, days: updatedDays });
  };

  const removeActivity = (dayNumber, activityId) => {
    const updatedDays = activeTrip.days.map((day) => {
      if (day.dayNumber === dayNumber) {
        return {
          ...day,
          activities: day.activities.filter((a) => a.id !== activityId)
        };
      }
      return day;
    });
    updateTripState({ ...activeTrip, days: updatedDays });
  };

  const addDay = () => {
    const nextDayNum = activeTrip.days.length + 1;
    const newDay = {
      dayNumber: nextDayNum,
      date: `2026-09-${10 + nextDayNum - 1}`,
      title: `Day ${nextDayNum} Exploration`,
      activities: []
    };
    updateTripState({ ...activeTrip, days: [...activeTrip.days, newDay] });
  };

  const addComment = (text, author = 'You (Alex)') => {
    const newComment = {
      id: Date.now(),
      author,
      text,
      time: 'Just now'
    };
    updateTripState({ ...activeTrip, comments: [...activeTrip.comments, newComment] });
  };

  const addExpense = (expense) => {
    const newExp = { ...expense, id: Date.now() };
    updateTripState({ ...activeTrip, expenses: [...activeTrip.expenses, newExp] });
  };

  const addDocument = (doc) => {
    const newDoc = { ...doc, id: `doc-${Date.now()}` };
    updateTripState({ ...activeTrip, documents: [...activeTrip.documents, newDoc] });
  };

  const togglePackingItem = (id) => {
    const updated = activeTrip.packingList.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    updateTripState({ ...activeTrip, packingList: updated });
  };

  const addPackingItem = (text, category = 'Essentials') => {
    const newItem = { id: `p-${Date.now()}`, text, category, completed: false };
    updateTripState({ ...activeTrip, packingList: [...activeTrip.packingList, newItem] });
  };

  const cloneTemplate = (template) => {
    const clonedTrip = {
      ...initialTrip,
      id: `trip-${Date.now()}`,
      title: template.title,
      destination: template.destination,
      coverImage: template.coverImage || initialTrip.coverImage,
      days: template.days || initialTrip.days
    };
    updateTripState(clonedTrip);
  };

  return (
    <TripContext.Provider
      value={{
        activeTrip,
        addActivity,
        removeActivity,
        addDay,
        addComment,
        addExpense,
        addDocument,
        togglePackingItem,
        addPackingItem,
        cloneTemplate,
        setActiveTrip
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => useContext(TripContext);
