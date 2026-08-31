import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const TripContext = createContext();

const calculateDayDate = (startDateStr, dayNumber) => {
  if (!startDateStr) return `Day ${dayNumber}`;
  const start = new Date(startDateStr);
  if (isNaN(start.getTime())) return `Day ${dayNumber}`;
  start.setDate(start.getDate() + (dayNumber - 1));
  return start.toISOString().split('T')[0];
};

export const TripProvider = ({ children }) => {
  const { user } = useAuth();
  const [activeTrip, setActiveTrip] = useState(null);
  const [loading, setLoading] = useState(false);

  const getTripStorageKey = (userObj) => {
    if (!userObj) return 'quest_active_trip_guest';
    if (typeof userObj === 'string') return `quest_active_trip_${userObj}`;
    const identifier = userObj.email ? userObj.email.trim().toLowerCase() : userObj.id;
    return identifier ? `quest_active_trip_${identifier}` : 'quest_active_trip_guest';
  };

  // Sync active trip with Supabase API or user-scoped storage whenever logged-in user changes
  useEffect(() => {
    const userKey = getTripStorageKey(user);

    if (!user) {
      const guestSaved = localStorage.getItem('quest_active_trip_guest');
      setActiveTrip(guestSaved ? JSON.parse(guestSaved) : null);
      return;
    }

    setLoading(true);
    api.getTrips()
      .then((res) => {
        if (res && res.trip) {
          const formattedTrip = formatTripFromApi(res.trip);
          setActiveTrip(formattedTrip);
          localStorage.setItem(userKey, JSON.stringify(formattedTrip));
        } else {
          const saved = localStorage.getItem(userKey);
          if (saved) {
            setActiveTrip(JSON.parse(saved));
          } else {
            // Migrate guest trip to user if guest trip exists
            const guestSaved = localStorage.getItem('quest_active_trip_guest');
            if (guestSaved) {
              const parsedGuest = JSON.parse(guestSaved);
              setActiveTrip(parsedGuest);
              localStorage.setItem(userKey, JSON.stringify(parsedGuest));
            } else {
              setActiveTrip(null);
            }
          }
        }
      })
      .catch((err) => {
        console.warn('API trip fetch failed, checking local storage:', err);
        const saved = localStorage.getItem(userKey);
        if (saved) {
          setActiveTrip(JSON.parse(saved));
        } else {
          const guestSaved = localStorage.getItem('quest_active_trip_guest');
          if (guestSaved) {
            const parsedGuest = JSON.parse(guestSaved);
            setActiveTrip(parsedGuest);
            localStorage.setItem(userKey, JSON.stringify(parsedGuest));
          } else {
            setActiveTrip(null);
          }
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.email]);

  const formatTripFromApi = (tripData) => {
    const startDate = tripData.startDate || '';
    const endDate = tripData.endDate || '';
    const budgetLimit = Number(tripData.budgetLimit) || 0;

    // Group activities by dayNumber
    const daysMap = {};
    if (tripData.activities && Array.isArray(tripData.activities)) {
      tripData.activities.forEach((act) => {
        const dNum = act.dayNumber || 1;
        if (!daysMap[dNum]) {
          daysMap[dNum] = {
            dayNumber: dNum,
            date: calculateDayDate(startDate, dNum),
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
      startDate: startDate || 'Flexible Dates',
      endDate: endDate || 'Flexible Dates',
      budgetLimit: budgetLimit,
      days: days.length ? days : [
        { dayNumber: 1, date: calculateDayDate(startDate, 1), title: 'Day 1 Arrival & Discovery', activities: [] }
      ],
      expenses: tripData.expenses || [],
      documents: tripData.documents || [],
      collaborators: tripData.collaborators || [],
      comments: tripData.comments || [
        { id: 1, author: user?.name || 'You', text: `Created trip: ${tripData.title}`, time: 'Just now' }
      ],
      packingList: tripData.packingList || [
        { id: 'p-1', text: 'Passport & Travel IDs', category: 'Documents', completed: true },
        { id: 'p-2', text: 'Power Bank & Charger', category: 'Electronics', completed: false },
        { id: 'p-3', text: 'Comfortable Shoes', category: 'Clothing', completed: false }
      ]
    };
  };

  const updateTripState = (updated) => {
    setActiveTrip(updated);
    localStorage.setItem(getTripStorageKey(user), JSON.stringify(updated));
  };

  const createCustomTrip = async (tripDetails) => {
    setLoading(true);
    try {
      let computedTotalCost = 0;
      let preparedExpenses = [];
      const preparedDays = tripDetails.days && Array.isArray(tripDetails.days) && tripDetails.days.length > 0 
        ? tripDetails.days 
        : [
            { dayNumber: 1, date: calculateDayDate(tripDetails.startDate, 1), title: 'Day 1 Arrival & Hotel Check-in', activities: [] }
          ];

      preparedDays.forEach(day => {
        (day.activities || []).forEach(act => {
          const priceVal = Number(act.price) || 0;
          computedTotalCost += priceVal;
          if (priceVal > 0) {
            preparedExpenses.push({
              id: `exp-${Date.now()}-${Math.random()}`,
              activityId: act.id,
              title: act.title,
              amount: priceVal,
              payer: user?.name || 'You',
              category: act.type === 'hotel' ? 'Lodging' : act.type === 'food' ? 'Food' : 'Activities',
              date: new Date().toISOString().split('T')[0]
            });
          }
        });
      });

      const budgetVal = Number(tripDetails.budgetLimit) || (computedTotalCost > 0 ? computedTotalCost + 300 : 0);

      const payload = {
        title: tripDetails.title,
        destination: tripDetails.destination,
        startDate: tripDetails.startDate,
        endDate: tripDetails.endDate,
        budgetLimit: budgetVal,
        coverImage: tripDetails.coverImage
      };

      let newTripObj = null;
      try {
        const res = await api.createTrip(payload);
        if (res && res.trip) {
          newTripObj = formatTripFromApi(res.trip);
        }
      } catch (err) {
        console.warn('API create trip failed, relying on rich client trip object:', err);
      }

      const finalTrip = {
        id: newTripObj?.id || `trip-${Date.now()}`,
        title: tripDetails.title || 'My Customized Travel Plan',
        destination: tripDetails.destination || 'Paris, France',
        coverImage: tripDetails.coverImage || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
        startDate: tripDetails.startDate || 'Flexible Dates',
        endDate: tripDetails.endDate || 'Flexible Dates',
        budgetLimit: budgetVal,
        days: preparedDays,
        expenses: preparedExpenses,
        documents: [],
        collaborators: [],
        comments: [{ id: 1, author: user?.name || 'You', text: `Loaded personalized plan: ${tripDetails.title}`, time: 'Just now' }],
        packingList: [
          { id: 'p-1', text: 'Passport', category: 'Documents', completed: true },
          { id: 'p-2', text: 'Travel Insurance', category: 'Documents', completed: false }
        ]
      };

      setActiveTrip(finalTrip);
      localStorage.setItem(getTripStorageKey(user), JSON.stringify(finalTrip));
      return finalTrip;
    } finally {
      setLoading(false);
    }
  };

  const updateBudgetLimit = async (newLimit) => {
    if (!activeTrip) return;
    const limitNum = Number(newLimit) || 0;
    try {
      await api.updateTrip(activeTrip.id, { budgetLimit: limitNum });
    } catch (err) {
      console.warn('Failed to update trip budget limit on backend:', err);
    }
    updateTripState({ ...activeTrip, budgetLimit: limitNum });
  };

  const addActivity = async (dayNumber, newActivity) => {
    if (!activeTrip) return;

    const actId = `act-${Date.now()}`;
    const activityObj = { ...newActivity, id: actId };

    try {
      await api.addActivity(activeTrip.id, { dayNumber, ...newActivity });
    } catch (err) {
      console.warn('API add activity failed, saving locally:', err);
    }

    let updatedExpenses = activeTrip.expenses || [];
    if (newActivity.price && Number(newActivity.price) > 0) {
      const expCategory = newActivity.type === 'flight' || newActivity.type === 'hotel' ? 'Transport' : 
                          newActivity.type === 'food' ? 'Food' : 'Activities';
      const expenseObj = {
        id: `exp-${Date.now()}`,
        activityId: actId,
        title: newActivity.title,
        amount: Number(newActivity.price),
        payer: user?.name || 'You',
        category: expCategory,
        date: new Date().toISOString().split('T')[0]
      };

      try {
        await api.addExpense({ tripId: activeTrip.id, ...expenseObj });
      } catch (e) {
        console.warn('API add expense for activity failed:', e);
      }

      updatedExpenses = [...updatedExpenses, expenseObj];
    }

    const updatedDays = activeTrip.days.map((day) => {
      if (day.dayNumber === dayNumber) {
        return {
          ...day,
          activities: [...day.activities, activityObj]
        };
      }
      return day;
    });

    updateTripState({ ...activeTrip, days: updatedDays, expenses: updatedExpenses });
  };

  const removeActivity = async (dayNumber, activityId) => {
    if (!activeTrip) return;

    let targetTitle = '';
    activeTrip.days.forEach(day => {
      const found = day.activities.find(a => a.id === activityId);
      if (found) targetTitle = found.title;
    });

    try {
      await api.deleteActivity(activeTrip.id, activityId);
    } catch (err) {
      console.warn('API delete activity failed:', err);
    }

    let updatedExpenses = activeTrip.expenses || [];
    const matchingExp = updatedExpenses.find(e => e.activityId === activityId || (targetTitle && e.title === targetTitle));
    if (matchingExp) {
      try {
        await api.deleteExpense(matchingExp.id);
      } catch (e) {
        console.warn('API delete expense for activity failed:', e);
      }
      updatedExpenses = updatedExpenses.filter(e => e.id !== matchingExp.id);
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

    updateTripState({ ...activeTrip, days: updatedDays, expenses: updatedExpenses });
  };

  const removeExpense = async (expenseId) => {
    if (!activeTrip) return;
    try {
      await api.deleteExpense(expenseId);
    } catch (err) {
      console.warn('API delete expense failed:', err);
    }
    const updatedExpenses = (activeTrip.expenses || []).filter(e => e.id !== expenseId);
    updateTripState({ ...activeTrip, expenses: updatedExpenses });
  };

  const addDay = () => {
    if (!activeTrip) return;
    const nextDayNum = activeTrip.days.length + 1;
    const newDay = {
      dayNumber: nextDayNum,
      date: calculateDayDate(activeTrip.startDate, nextDayNum),
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

  const addCollaborator = (email, role = 'Editor') => {
    if (!activeTrip) return;
    const newCollab = {
      id: `collab-${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      role: role,
      status: 'Active'
    };
    const updatedCollaborators = [...(activeTrip.collaborators || []), newCollab];
    updateTripState({ ...activeTrip, collaborators: updatedCollaborators });
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
    return createCustomTrip({
      title: template.title,
      destination: template.destination,
      coverImage: template.image || template.coverImage,
      days: template.days,
      budgetLimit: template.budgetLimit || 0
    });
  };

  return (
    <TripContext.Provider
      value={{
        activeTrip,
        loading,
        createCustomTrip,
        updateBudgetLimit,
        addActivity,
        removeActivity,
        addDay,
        addComment,
        addCollaborator,
        addExpense,
        removeExpense,
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
