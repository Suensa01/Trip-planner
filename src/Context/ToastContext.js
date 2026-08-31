import React, { createContext, useContext, useState } from 'react';
import ToastNotification from '../Components/Common/ToastNotification';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ show: false, title: '', message: '', variant: 'success', icon: 'bi-check-circle-fill' });

  const showToast = (title, message, variant = 'success', icon = 'bi-check-circle-fill') => {
    setToast({
      show: true,
      title,
      message,
      variant,
      icon
    });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastNotification toast={toast} onClose={hideToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext) || { showToast: () => {}, hideToast: () => {} };

