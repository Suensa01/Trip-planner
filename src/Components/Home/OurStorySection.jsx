import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './OurStorySection.css';

function OurStorySection() {
  return (
    <div className="our-story-section text-start">
      <Container>
        <Row className="align-items-center gy-5">
          {/* Left Side: Asymmetrical Polaroid Photos & Badge */}
          <Col lg={6}>
            <div className="position-relative ps-md-4">
              <img 
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80" 
                alt="Travelers Adventure" 
                className="polaroid-img-large"
              />
              <img 
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80" 
                alt="Coastal Resort" 
                className="polaroid-img-small d-none d-sm-block"
              />
              <div className="story-badge-card">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <i className="bi bi-star-fill text-warning"></i>
                  <strong className="small text-dark">Exceptional Quality</strong>
                </div>
                <p className="mb-0 text-muted" style={{ fontSize: '11px' }}>
                  We are committed to providing exceptional service and making every journey seamless and memorable.
                </p>
              </div>
            </div>
          </Col>

          {/* Right Side: Heading & Narrative */}
          <Col lg={6}>
            <div className="ps-lg-4">
              <div className="d-flex gap-2 mb-3">
                <span className="story-tag-pill">Travel</span>
                <span className="story-tag-pill">Best Place</span>
                <span className="story-tag-pill">Tourism</span>
              </div>

              <h2 className="display-6 fw-bold mb-3">
                Our Story: Driven By Wanderlust, Powered By Experience
              </h2>

              <h5 className="fw-bold text-dark mb-3">
                We Believe That Travel Is More Than Just Visiting A New Place — It's About Creating Lasting Memories
              </h5>

              <p className="text-muted mb-4">
                Whether you are seeking hidden gems across your home country or exploring world-class global destinations, Trippoo combines intelligent planning, curated deals, and round-the-clock support to bring your travel aspirations to life.
              </p>

              <Button variant="coral" className="btn-coral px-4 py-2.5">
                Read More <i className="bi bi-arrow-right ms-2"></i>
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default OurStorySection;
