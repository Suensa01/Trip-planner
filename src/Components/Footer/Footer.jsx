import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="footer-section pt-5 pb-4 text-start">
      <Container>
        <Row className="gy-4 mb-5">
          <Col lg={4} md={6}>
            <div className="mb-3">
              <Link to="/" className="text-decoration-none footer-brand">
                Quest<span className="brand-dot">.</span>
              </Link>
            </div>
            <p className="small text-secondary pe-lg-4 mb-4">
              Inspiration, Planning, And Booking — All In One Travel Experience. Discover extraordinary global destinations with Quest.
            </p>
            <div className="d-flex gap-2">
              <span className="social-icon-btn"><i className="bi bi-globe"></i></span>
              <span className="social-icon-btn"><i className="bi bi-instagram"></i></span>
              <span className="social-icon-btn"><i className="bi bi-twitter-x"></i></span>
              <span className="social-icon-btn"><i className="bi bi-facebook"></i></span>
            </div>
          </Col>

          <Col lg={2} md={3} sm={6}>
            <h6 className="fw-bold mb-3 text-uppercase">Quick Links</h6>
            <ul className="list-unstyled small mb-0 d-flex flex-column gap-2">
              <li><Link to="/" className="text-decoration-none">Home</Link></li>
              <li><Link to="/destinations" className="text-decoration-none">Destinations</Link></li>
              <li><Link to="/holidays" className="text-decoration-none">Summer Holidays</Link></li>
              <li><Link to="/city-breaks" className="text-decoration-none">City Breaks</Link></li>
              <li><Link to="/planner" className="text-decoration-none">Trip Planner</Link></li>
            </ul>
          </Col>

          <Col lg={2} md={3} sm={6}>
            <h6 className="fw-bold mb-3 text-uppercase">Studios & Tools</h6>
            <ul className="list-unstyled small mb-0 d-flex flex-column gap-2">
              <li><Link to="/explore" className="text-decoration-none">AI Trip Generator</Link></li>
              <li><Link to="/booking" className="text-decoration-none">Flight & Hotel Booking</Link></li>
              <li><Link to="/tools" className="text-decoration-none">Budget Tracker</Link></li>
              <li><Link to="/tools" className="text-decoration-none">Ticket Vault</Link></li>
              <li><Link to="/profile" className="text-decoration-none">My Profile</Link></li>
            </ul>
          </Col>

          <Col lg={4} md={12}>
            <h6 className="fw-bold mb-3 text-uppercase">Newsletter</h6>
            <p className="small text-secondary mb-3">
              Subscribe to receive exclusive travel discounts and secret vacation voucher codes.
            </p>
            {subscribed && (
              <Alert variant="danger" className="py-2 small bg-opacity-10 text-coral border-0 mb-3">
                <i className="bi bi-check-circle-fill me-2"></i>Thank you for subscribing to Quest travel updates!
              </Alert>
            )}
            <Form onSubmit={handleNewsletter} className="d-flex gap-2">
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-dark text-light border-secondary rounded-pill px-3"
              />
              <Button variant="coral" type="submit" className="btn-coral px-4 text-nowrap rounded-pill">
                Subscribe
              </Button>
            </Form>
          </Col>
        </Row>

        <hr className="border-secondary opacity-25" />

        <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between pt-2 small text-secondary">
          <p className="mb-2 mb-sm-0 d-flex align-items-center">
            Copyright <i className="bi bi-c-circle mx-1"></i> {new Date().getFullYear()} Quest Travel Planner. All Rights Reserved.
          </p>
          <div className="d-flex gap-3">
            <span className="text-decoration-none text-secondary">Privacy Policy</span>
            <span>•</span>
            <span className="text-decoration-none text-secondary">Terms of Service</span>
            <span>•</span>
            <span className="text-decoration-none text-secondary">Support</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;