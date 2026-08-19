import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import { WishlistProvider } from './Context/WishlistContext';
import { TripProvider } from './Context/TripContext';

test('renders Quest brand logo in navigation', () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <TripProvider>
            <App />
          </TripProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  );
  const brandElements = screen.getAllByText(/Quest/i);
  expect(brandElements.length).toBeGreaterThan(0);
});

