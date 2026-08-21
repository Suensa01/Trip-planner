import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const { user } = useAuth();
  const [activeTrip, setActiveTrip] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sync active trip with Supabase API whenever logged-in user changes
  useEffect(() => {
    if (!user) {
      setActiveTrip(null);
      localStorage.removeItem('quest_active_trip');
      return;
    }

    setLoading(true);
    api.getTrips()
      .then((res) => {
        if (res.trip) {
          // Normalize day activities format
          const formattedTrip = formatTripFromApi(res.trip);
          setActiveTrip(formattedTrip);
          localStorage.setItem('quest_active_trip', JSON.stringify(formattedTrip));
        } else {
          setActiveTrip(null);
          localStorage.removeItem('quest_active_trip');
        }
      })
      .catch((err) => {
        console.warn('API trip fetch failed, checking local storage:', err);
        const saved = localStorage.getItem('quest_active_trip');
        if (saved) {
          setActiveTrip(JSON.parse(saved));
        } else {
          setActiveTrip(null);
        }
      })
      .finally(() => setLoading(false));
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const formatTripFromApi = (tripData) => {
    // Group activities by dayNumber
    const daysMap = {};
    if (tripData.activities && Array.isArray(tripData.activities)) {
      tripData.activities.forEach((act) => {
        const dNum = act.dayNumber || 1;
        if (!daysMap[dNum]) {
          daysMap[dNum] = {
            dayNumber: dNum,
            date: `Day ${dNum}`,
            title: `Day ${dNum} Plan`,
            activities: []
          };
        }
        daysMap[dNum].activities.push({
          id: act.id,
          title: act.title,
          type: act.type || 'activity',
          time: act.time || '10:00 AM',
          location: act.location || tripData.destination,
          price: Number(act.price) || 0,
          notes: act.notes || '',
          lat: act.lat || 41.89,
          lng: act.lng || 12.48
        });
      });
    }

    const days = Object.values(daysMap).sort((a, b) => a.dayNumber - b.dayNumber);

    return {
      id: tripData.id,
      title: tripData.title,
      destination: tripData.destination,
      coverImage: tripData.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      startDate: tripData.startDate || '2026-10-01',
      endDate: tripData.endDate || '2026-10-05',
      budgetLimit: tripData.budgetLimit || 2500,
      days: days.length ? days : [
        { dayNumber: 1, date: tripData.startDate || 'Day 1', title: 'Day 1 Arrival & Discovery', activities: [] }
      ],
      expenses: tripData.expenses || [],
      documents: tripData.documents || [],
      comments: [
        { id: 1, author: user?.name || 'You', text: `Created personalized trip: ${tripData.title}`, time: 'Just now' }
      ],
      packingList: [
        { id: 'p-1', text: 'Passport & Travel IDs', category: 'Documents', completed: true },
        { id: 'p-2', text: 'Power Bank & Charger', category: 'Electronics', completed: false },
        { id: 'p-3', text: 'Comfortable Shoes', category: 'Clothing', completed: false }
      ]
    };
  };

  const updateTripState = (updated) => {
    setActiveTrip(updated);
    localStorage.setItem('quest_active_trip', JSON.stringify(updated));
  };

  const createCustomTrip = async (tripDetails) => {
    setLoading(true);
    try {
      const res = await api.createTrip(tripDetails);
      if (res.trip) {
        const newFormatted = formatTripFromApi(res.trip);
        setActiveTrip(newFormatted);
        localStorage.setItem('quest_active_trip', JSON.stringify(newFormatted));
        return newFormatted;
      }
    } catch (err) {
      // Local fallback creation
      const localTrip = {
        id: `trip-${Date.now()}`,
        title: tripDetails.title || 'My Customized Travel Plan',
        destination: tripDetails.destination || 'Paris, France',
        coverImage: tripDetails.coverImage || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
        startDate: tripDetails.startDate || '2026-10-01',
        endDate: tripDetails.endDate || '2026-10-05',
        budgetLimit: Number(tripDetails.budgetLimit) || 3000,
        days: [
          { dayNumber: 1, date: 'Day 1', title: 'Arrival & Hotel Check-in', activities: [] }
        ],
        expenses: [],
        documents: [],
        comments: [{ id: 1, author: user?.name || 'You', text: 'Started new personalized plan.', time: 'Just now' }],
        packingList: [{ id: 'p-1', text: 'Passport', category: 'Documents', completed: true }]
      };
      setActiveTrip(localTrip);
      localStorage.setItem('quest_active_trip', JSON.stringify(localTrip));
      return localTrip;
    } finally {
      setLoading(false);
    }
  };

  const addActivity = async (dayNumber, newActivity) => {
    if (!activeTrip) return;

    try {
      await api.addActivity(activeTrip.id, { dayNumber, ...newActivity });
    } catch (err) {
      console.warn('API add activity failed, saving locally:', err);
    }

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

  const removeActivity = async (dayNumber, activityId) => {
    if (!activeTrip) return;

    try {
      await api.deleteActivity(activeTrip.id, activityId);
    } catch (err) {
      console.warn('API delete activity failed:', err);
    }

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
    if (!activeTrip) return;
    const nextDayNum = activeTrip.days.length + 1;
    const newDay = {
      dayNumber: nextDayNum,
      date: `Day ${nextDayNum}`,
      title: `Day ${nextDayNum} Exploration`,
      activities: []
    };
    updateTripState({ ...activeTrip, days: [...activeTrip.days, newDay] });
  };

  const addComment = (text) => {
    if (!activeTrip) return;
    const newComment = {
      id: Date.now(),
      author: user?.name || 'You',
      text,
      time: 'Just now'
    };
    updateTripState({ ...activeTrip, comments: [...(activeTrip.comments || []), newComment] });
  };

  const addExpense = async (expense) => {
    if (!activeTrip) return;
    try {
      await api.addExpense({ tripId: activeTrip.id, ...expense });
    } catch (err) {
      console.warn('API add expense failed:', err);
    }
    const newExp = { ...expense, id: Date.now() };
    updateTripState({ ...activeTrip, expenses: [...(activeTrip.expenses || []), newExp] });
  };

  const addDocument = async (doc) => {
    if (!activeTrip) return;
    try {
      await api.addDocument({ tripId: activeTrip.id, ...doc });
    } catch (err) {
      console.warn('API add document failed:', err);
    }
    const newDoc = { ...doc, id: `doc-${Date.now()}` };
    updateTripState({ ...activeTrip, documents: [...(activeTrip.documents || []), newDoc] });
  };

  const togglePackingItem = (id) => {
    if (!activeTrip) return;
    const updated = activeTrip.packingList.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    updateTripState({ ...activeTrip, packingList: updated });
  };

  const addPackingItem = (text, category = 'Essentials') => {
    if (!activeTrip) return;
    const newItem = { id: `p-${Date.now()}`, text, category, completed: false };
    updateTripState({ ...activeTrip, packingList: [...(activeTrip.packingList || []), newItem] });
  };

  const cloneTemplate = (template) => {
    createCustomTrip({
      title: template.title,
      destination: template.destination,
      coverImage: template.coverImage,
      days: template.days
    });
  };

  return (
    <TripContext.Provider
      value={{
        activeTrip,
        loading,
        createCustomTrip,
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
