import React from 'react';
import './HeroSection.css';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <div className='trippoo-hero-section'>
        <Container className="text-center position-relative z-2">
            <h1 className='trippoo-hero-title mb-3'>
              Your Journey Starts<br />Before You Go
            </h1>
            <p className='trippoo-hero-subtitle mb-4'>
              Inspiration, Planning, And Booking — All In One Travel Experience.
            </p>
            <Button variant="light" className="btn-pill-light px-5 py-3 fs-6 shadow">
                <Link to="/holidays" className="text-decoration-none text-dark">View Package</Link>
            </Button>
        </Container>
    </div>
  )
}

export default HeroSection;