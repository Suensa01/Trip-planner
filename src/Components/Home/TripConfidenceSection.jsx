import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import './TripConfidenceSection.css';

const galleryPhotos = [
  { id: 1, title: 'Burj Al Arab, Dubai', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80' },
  { id: 2, title: 'Santorini, Greece', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80' },
  { id: 3, title: 'Mediterranean Cruise', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80' },
  { id: 4, title: 'Eiffel Tower, Paris', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80' },
  { id: 5, title: 'Colosseum, Rome', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80' }
];

function TripConfidenceSection() {
  return (
    <div className="confidence-section text-center">
      <Container>
        <div className="max-w-600 mx-auto mb-4">
          <h2 className="display-5 fw-bold mb-3">
            Plan Your Next Trip With<br />Confidence And Ease
          </h2>
          <p className="text-muted small mb-4">
            Join Thousands Of Travelers Who've Explored The World With Confidence And Comfort.
          </p>
          <Button variant="coral" className="btn-coral px-5 py-3 fs-6">
            <Link to="/holidays" className="text-decoration-none text-light">Book Your Seat</Link>
          </Button>
        </div>

        {/* 5-Photo Destination Gallery Strip */}
        <Row className="g-3 mt-4">
          {galleryPhotos.map((photo) => (
            <Col key={photo.id} className="col-6 col-md">
              <img src={photo.image} alt={photo.title} className="gallery-thumbnail" title={photo.title} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default TripConfidenceSection;
