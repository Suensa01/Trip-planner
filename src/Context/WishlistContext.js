import React, { createContext, useContext, useState } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('quest_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleWishlist = (item) => {
    setWishlist((prev) => {
      const exists = prev.some((i) => i.id === item.id || i.itemTitle === item.itemTitle);
      let updated;
      if (exists) {
        updated = prev.filter((i) => (i.id ? i.id !== item.id : i.itemTitle !== item.itemTitle));
      } else {
        updated = [...prev, item];
      }
      localStorage.setItem('quest_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const isWishlisted = (item) => {
    if (!item) return false;
    return wishlist.some((i) => (item.id ? i.id === item.id : i.itemTitle === item.itemTitle));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted, count: wishlist.length }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
