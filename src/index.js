import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import { WishlistProvider } from './Context/WishlistContext';
import { TripProvider } from './Context/TripContext';
import { ToastProvider } from './Context/ToastContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <TripProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </TripProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
