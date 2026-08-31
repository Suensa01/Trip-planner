import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import AITripGenerator from '../../Components/Explore/AITripGenerator';
import CuratedTemplates from '../../Components/Explore/CuratedTemplates';
import { useTrip } from '../../Context/TripContext';
import './Explore.css';

const categoryItems = [
  { id: 'cat-1', title: 'The Colosseum & Forum', category: 'Museums & Ruins', city: 'Rome', rating: '4.9', price: '₹5,500', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-2', title: 'Louvre Art Museum', category: 'Museums & Ruins', city: 'Paris', rating: '4.8', price: '₹2,100', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-3', title: 'Trastevere Food & Wine Walk', category: 'Dining & Drinks', city: 'Rome', rating: '4.9', price: '₹4,500', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-4', title: 'Bagan Sunset Ballooning', category: 'Adventure & Parks', city: 'Bagan', rating: '5.0', price: '₹18,500', image: 'https://images.unsplash.com/photo-1508672019048-805479767513?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-5', title: 'Eiffel Tower Night Lights Tour', category: 'Nightlife & Views', city: 'Paris', rating: '4.9', price: '₹3,400', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-6', title: 'Amber Fort Elephant Sanctuary', category: 'Adventure & Parks', city: 'Jaipur', rating: '4.7', price: '₹2,800', image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=600&q=80' }
];

function Explore() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addActivity } = useTrip();

  const filteredPlaces = categoryItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToDay1 = (place) => {
    addActivity(1, {
      title: place.title,
      type: 'activity',
      time: '02:00 PM',
      location: `${place.city} Center`,
      price: parseInt(place.price.replace(/[^0-9]/g, '')) || 2500,
      notes: `Added from Discovery Engine (${place.rating} ★)`
    });
    alert(`✓ Added "${place.title}" to Day 1 of your Active Itinerary!`);
  };

  return (
    <div className="explore-page pb-5 text-start">
      <Container>
        {/* Header Title */}
        <div className="text-start mb-4 pt-3">
          <h2 className="fw-bold text-dark mb-1">
            <i className="bi bi-search text-coral me-2"></i>Travel Discovery & Inspiration Hub
          </h2>
          <p className="text-muted">Generate Quest AI trip recommendations, clone curated guides, and search top-rated places.</p>
        </div>

        {/* AI Trip Generator Section */}
        <div className="mb-5">
          <AITripGenerator />
        </div>

        {/* Curated Templates Section */}
        <CuratedTemplates />

        {/* Multi-Category Search Engine */}
        <div className="mt-5 pt-4 border-top text-start">
          <h3 className="fw-bold text-dark mb-1">
            <i className="bi bi-globe-americas me-2 text-coral"></i>Search Places & Activities
          </h3>
          <p className="text-muted mb-4">Filter by category, rating, or search city destinations.</p>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <Form.Control
                type="text"
                placeholder="Search by activity name or city (e.g. Rome, Paris, Food)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-2.5 bg-white shadow-sm rounded-pill px-4"
              />
            </div>
            <div className="col-md-6 d-flex gap-2 overflow-auto pb-2">
              {['All', 'Museums & Ruins', 'Dining & Drinks', 'Adventure & Parks', 'Nightlife & Views'].map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'coral' : 'outline-secondary'}
                  className={`fw-bold px-3 py-2 text-nowrap rounded-pill ${selectedCategory === cat ? 'btn-coral' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          <div className="row g-4">
            {filteredPlaces.map((place) => (
              <div key={place.id} className="col-md-6 col-lg-4">
                <Card className="card-trippoo shadow-sm border-0 rounded-4 overflow-hidden h-100">
                  <div className="position-relative">
                    <Card.Img variant="top" src={place.image} loading="lazy" decoding="async" style={{ height: '180px', objectFit: 'cover' }} />
                    <Badge bg="light" text="dark" className="position-absolute top-0 end-0 m-2 fw-bold shadow-sm">
                      <i className="bi bi-star-fill text-warning me-1"></i>{place.rating}
                    </Badge>
                  </div>
                  <Card.Body className="p-3.5 d-flex flex-column justify-content-between">
                    <div>
                      <Badge bg="coral" className="btn-coral mb-2">{place.category}</Badge>
                      <Card.Title className="fw-bold fs-6 mb-1">{place.title}</Card.Title>
                      <p className="small text-muted mb-2">
                        <i className="bi bi-geo-alt-fill me-1 text-danger"></i>{place.city}
                      </p>
                    </div>
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="small text-muted">Price per person:</span>
                        <span className="fw-bold text-coral fs-6">{place.price}</span>
                      </div>
                      <Button variant="coral" className="btn-coral w-100 fw-bold" onClick={() => handleAddToDay1(place)}>
                        + Add To My Itinerary
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Explore;
