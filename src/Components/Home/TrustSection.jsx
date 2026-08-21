import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import './TrustSection.css';

function TrustSection() {
  return (
    <div className="trust-section">
      <Container>
        <div className="text-center max-w-600 mx-auto mb-5">
          <h2 className="display-6 fw-bold mb-2">Why Travellers Trust Us</h2>
          <p className="text-muted">
            We Believe Every Journey Holds Incredible Potential. We're Dedicated To Crafting Your Perfect Experience.
          </p>
        </div>

        <Row className="g-4 text-start">
          <Col md={4}>
            <Card className="trust-card h-100">
              <div className="trust-number-badge">01</div>
              <h5 className="fw-bold text-dark mb-2">Trusted Experience</h5>
              <p className="small text-muted mb-0">
                We've crafted unforgettable travel experiences that cater to every preference, ensuring safety, reliability, and top-tier service.
              </p>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="trust-card h-100">
              <div className="trust-number-badge">02</div>
              <h5 className="fw-bold text-dark mb-2">Best Price Guarantee</h5>
              <p className="small text-muted mb-0">
                Save more with our competitive prices, special discounts, and exclusive seasonal offers direct from resort partners.
              </p>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="trust-card h-100">
              <div className="trust-number-badge">03</div>
              <h5 className="fw-bold text-dark mb-2">Customer Satisfaction</h5>
              <p className="small text-muted mb-0">
                Our glowing reviews and loyal repeat clients speak for our dedication to delivering 24/7 support wherever you travel.
              </p>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default TrustSection;
