import React from 'react';
import Container from 'react-bootstrap/Container';
import BookingAggregator from '../../Components/Booking/BookingAggregator';

function BookingPage() {
  return (
    <div className="booking-page pb-5" style={{ paddingTop: '90px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Container>
        <BookingAggregator />
      </Container>
    </div>
  );
}

export default BookingPage;
