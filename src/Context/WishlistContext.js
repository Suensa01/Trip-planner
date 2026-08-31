import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();

  const getStorageKey = React.useCallback(() => {
    if (!user) return 'quest_wishlist_guest';
    const identifier = user.email ? user.email.trim().toLowerCase() : user.id;
    return identifier ? `quest_wishlist_${identifier}` : 'quest_wishlist_guest';
  }, [user]);

  const [wishlist, setWishlist] = useState(() => {
    const key = getStorageKey();
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });

  // Re-hydrate wishlist whenever authenticated user changes & migrate guest items
  useEffect(() => {
    const key = getStorageKey();
    const saved = localStorage.getItem(key);
    if (saved) {
      setWishlist(JSON.parse(saved));
    } else if (user) {
      // Migrate guest wishlist if user has none
      const guestSaved = localStorage.getItem('quest_wishlist_guest');
      if (guestSaved) {
        const parsedGuest = JSON.parse(guestSaved);
        setWishlist(parsedGuest);
        localStorage.setItem(key, JSON.stringify(parsedGuest));
      } else {
        setWishlist([]);
      }
    } else {
      setWishlist([]);
    }
  }, [getStorageKey, user]);

  const toggleWishlist = (item) => {
    if (!item) return;
    setWishlist((prev) => {
      const exists = prev.some((i) => (item.id && i.id === item.id) || (item.itemTitle && i.itemTitle === item.itemTitle));
      let updated;
      if (exists) {
        updated = prev.filter((i) => (item.id ? i.id !== item.id : i.itemTitle !== item.itemTitle));
      } else {
        updated = [...prev, item];
      }
      localStorage.setItem(getStorageKey(), JSON.stringify(updated));
      return updated;
    });
  };

  const isWishlisted = (item) => {
    if (!item) return false;
    return wishlist.some((i) => (item.id && i.id === item.id) || (item.itemTitle && i.itemTitle === item.itemTitle));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted, count: wishlist.length }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext) || { wishlist: [], toggleWishlist: () => {}, isWishlisted: () => false, count: 0 };
