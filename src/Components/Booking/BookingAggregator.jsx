import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useTrip } from '../../Context/TripContext';
import { useToast } from '../../Context/ToastContext';

const flightMockResults = [
  { id: 'fl-1', airline: 'Emirates Airways', flightNo: 'EK-204', departure: '08:30 AM', arrival: '01:45 PM', duration: '5h 15m', stops: 'Direct', price: '₹38,500', cabin: 'Economy' },
  { id: 'fl-2', airline: 'British Airways', flightNo: 'BA-117', departure: '11:15 AM', arrival: '04:30 PM', duration: '5h 15m', stops: 'Direct', price: '₹42,000', cabin: 'Premium Economy' },
  { id: 'fl-3', airline: 'Lufthansa', flightNo: 'LH-402', departure: '02:00 PM', arrival: '08:10 PM', duration: '6h 10m', stops: '1 Stop (FRA)', price: '₹31,500', cabin: 'Economy' }
];

const hotelMockResults = [
  { id: 'ht-1', name: 'Hotel Artemide Luxury Suites', stars: '5 ★★★★★', location: 'Rome City Center', price: '₹14,500 / night', rating: '9.4 Exceptional', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80' },
  { id: 'ht-2', name: 'Grand Palace Hotel', stars: '4 ★★★★', location: 'Trastevere, Rome', price: '₹10,800 / night', rating: '9.0 Superb', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&q=80' },
  { id: 'ht-3', name: 'Villa Borghese Garden Resort', stars: '5 ★★★★★', location: 'Near Borghese Gardens', price: '₹19,200 / night', rating: '9.7 Outstanding', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80' }
];

const tourMockResults = [
  { id: 'tr-1', name: 'Vatican Museums & Sistine Chapel VIP Fast-Track', provider: 'GetYourGuide Partner', duration: '3.5 Hours', price: '₹6,200', rating: '4.9 ★ (1,420 reviews)', image: 'https://images.unsplash.com/photo-1548625361-18da90e930e4?auto=format&fit=crop&w=600&q=80' },
  { id: 'tr-2', name: 'Colosseum Underground & Arena Floor Tour', provider: 'Viator Premier', duration: '2.5 Hours', price: '₹5,600', rating: '4.8 ★ (2,100 reviews)', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80' }
];

function BookingAggregator() {
  const [activeTab, setActiveTab] = useState('flights');
  const { addActivity, addExpense, addDocument } = useTrip();
  const { showToast } = useToast();

  const handleBookFlight = (flight) => {
    const numericPrice = parseInt(flight.price.replace(/[^0-9]/g, '')) || 38500;
    const ticketCode = `AIR-${flight.flightNo}-${Math.floor(1000 + Math.random() * 9000)}`;

    addActivity(1, {
      title: `Flight: ${flight.airline} (${flight.flightNo})`,
      type: 'flight',
      time: flight.departure,
      location: `Flight to Destination (${flight.stops})`,
      price: numericPrice,
      notes: `Cabin: ${flight.cabin} • Duration: ${flight.duration}`
    });

    addExpense({
      title: `Flight ${flight.airline} (${flight.flightNo})`,
      amount: numericPrice,
      payer: 'You (Alex)',
      category: 'Transport',
      date: new Date().toISOString().split('T')[0]
    });

    addDocument({
      name: `BoardingPass_${flight.flightNo}.pdf`,
      type: 'pdf',
      size: '1.1 MB',
      category: 'Flights',
      code: ticketCode
    });

    showToast('Flight Booked!', `Booked ${flight.airline} flight for ${flight.price}. Ticket code ${ticketCode} added to Vault.`, 'success', 'bi-airplane-fill');
  };

  const handleBookHotel = (hotel) => {
    const numericPrice = parseInt(hotel.price.replace(/[^0-9]/g, '')) || 14500;
    const hotelCode = `HTL-${Math.floor(10000 + Math.random() * 90000)}`;

    addActivity(1, {
      title: `Hotel Stay: ${hotel.name}`,
      type: 'hotel',
      time: '02:00 PM',
      location: hotel.location,
      price: numericPrice,
      notes: `Rating: ${hotel.rating} • ${hotel.stars}`
    });

    addExpense({
      title: `Stay at ${hotel.name}`,
      amount: numericPrice,
      payer: 'You (Alex)',
      category: 'Lodging',
      date: new Date().toISOString().split('T')[0]
    });

    addDocument({
      name: `${hotel.name.replace(/[^a-zA-Z0-9]/g, '_')}_Voucher.pdf`,
      type: 'pdf',
      size: '950 KB',
      category: 'Hotels',
      code: hotelCode
    });

    showToast('Hotel Confirmed!', `Reserved ${hotel.name} for ${hotel.price}. Voucher code ${hotelCode} added to Vault.`, 'success', 'bi-building-fill');
  };

  const handleBookTour = (tour) => {
    const numericPrice = parseInt(tour.price.replace(/[^0-9]/g, '')) || 6200;
    const tourCode = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;

    addActivity(2, {
      title: `Tour: ${tour.name}`,
      type: 'activity',
      time: '10:00 AM',
      location: tour.provider,
      price: numericPrice,
      notes: `Duration: ${tour.duration} • Provider: ${tour.provider}`
    });

    addExpense({
      title: `Excursion: ${tour.name}`,
      amount: numericPrice,
      payer: 'You (Alex)',
      category: 'Activities',
      date: new Date().toISOString().split('T')[0]
    });

    addDocument({
      name: `Tour_Pass_${tourCode}.pdf`,
      type: 'pdf',
      size: '620 KB',
      category: 'Tickets',
      code: tourCode
    });

    showToast('Tour Ticket Confirmed!', `Booked ${tour.name} for ${tour.price}. Inserted into Day 2 Itinerary!`, 'success', 'bi-ticket-perforated-fill');
  };

  return (
    <Card className="shadow border-0 rounded-4 overflow-hidden text-start">
      <Card.Header className="bg-dark text-white p-4">
        <h4 className="fw-bold mb-1">🛫 Booking & Aggregator Hub</h4>
        <p className="mb-0 small text-secondary">
          Compare flights (Skyscanner API), hotels (Booking.com API), and tours (GetYourGuide / Viator).
        </p>
      </Card.Header>
      <Card.Body className="p-4">
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4 fw-bold">
          <Tab eventKey="flights" title="✈️ Flights Search">
            <div className="bg-light p-3 rounded mb-4 border">
              <Form className="row g-3">
                <div className="col-md-3">
                  <Form.Label className="small fw-bold">From</Form.Label>
                  <Form.Control type="text" defaultValue="New York (JFK)" />
                </div>
                <div className="col-md-3">
                  <Form.Label className="small fw-bold">To</Form.Label>
                  <Form.Control type="text" defaultValue="Rome (FCO)" />
                </div>
                <div className="col-md-3">
                  <Form.Label className="small fw-bold">Departure Date</Form.Label>
                  <Form.Control type="date" defaultValue="2026-09-10" />
                </div>
                <div className="col-md-3 d-flex align-items-end">
                  <Button variant="success" className="w-100 fw-bold py-2">🔍 Search Flights</Button>
                </div>
              </Form>
            </div>

            <div className="d-flex flex-column gap-3">
              {flightMockResults.map((fl) => (
                <Card key={fl.id} className="border shadow-sm">
                  <Card.Body className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <div>
                      <Badge bg="success" className="mb-1">{fl.airline}</Badge>
                      <h5 className="fw-bold mb-1">{fl.flightNo} • {fl.departure} → {fl.arrival}</h5>
                      <span className="small text-muted">⏱ {fl.duration} • {fl.stops} • {fl.cabin}</span>
                    </div>
                    <div className="text-md-end">
                      <div className="fs-4 fw-bold text-success mb-2">{fl.price}</div>
                      <Button variant="success" className="fw-bold px-4" onClick={() => handleBookFlight(fl)}>
                        Book & Add To Itinerary
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Tab>

          <Tab eventKey="hotels" title="🏨 Hotels & Resorts">
            <div className="bg-light p-3 rounded mb-4 border">
              <Form className="row g-3">
                <div className="col-md-4">
                  <Form.Label className="small fw-bold">Destination City</Form.Label>
                  <Form.Control type="text" defaultValue="Rome, Italy" />
                </div>
                <div className="col-md-3">
                  <Form.Label className="small fw-bold">Check-in</Form.Label>
                  <Form.Control type="date" defaultValue="2026-09-10" />
                </div>
                <div className="col-md-3">
                  <Form.Label className="small fw-bold">Check-out</Form.Label>
                  <Form.Control type="date" defaultValue="2026-09-15" />
                </div>
                <div className="col-md-2 d-flex align-items-end">
                  <Button variant="success" className="w-100 fw-bold py-2">Find Hotels</Button>
                </div>
              </Form>
            </div>

            <div className="row g-4">
              {hotelMockResults.map((ht) => (
                <div key={ht.id} className="col-md-4">
                  <Card className="h-100 border shadow-sm rounded-3 overflow-hidden">
                    <Card.Img variant="top" src={ht.image} style={{ height: '160px', objectFit: 'cover' }} />
                    <Card.Body className="p-3 d-flex flex-column justify-content-between">
                      <div>
                        <Badge bg="warning" text="dark" className="mb-1">{ht.stars}</Badge>
                        <Card.Title className="fw-bold fs-6 mb-1">{ht.name}</Card.Title>
                        <p className="small text-muted mb-2">📍 {ht.location}</p>
                      </div>
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="small text-success fw-bold">{ht.rating}</span>
                          <span className="fw-bold text-dark">{ht.price}</span>
                        </div>
                        <Button variant="outline-success" className="w-100 fw-bold" onClick={() => handleBookHotel(ht)}>
                          Reserve & Insert
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          </Tab>

          <Tab eventKey="tours" title="🎟️ Tours & Excursions">
            <div className="row g-4 mt-1">
              {tourMockResults.map((tr) => (
                <div key={tr.id} className="col-md-6">
                  <Card className="border shadow-sm rounded-3 overflow-hidden">
                    <div className="row g-0">
                      <div className="col-md-5">
                        <Card.Img src={tr.image} style={{ height: '100%', minHeight: '160px', objectFit: 'cover' }} />
                      </div>
                      <div className="col-md-7 p-3 d-flex flex-column justify-content-between">
                        <div>
                          <Badge bg="info" className="mb-1">{tr.provider}</Badge>
                          <h6 className="fw-bold mb-1">{tr.name}</h6>
                          <small className="text-muted d-block">⏱ Duration: {tr.duration}</small>
                        </div>
                        <div>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="small text-warning fw-bold">{tr.rating}</span>
                            <span className="fw-bold text-success fs-6">{tr.price}</span>
                          </div>
                          <Button variant="success" className="w-100 fw-bold py-1" onClick={() => handleBookTour(tr)}>
                            Book Tour
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  );
}

export default BookingAggregator;
