import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import './TravelerReviewsSection.css';

const reviewsData = [
  {
    id: 1,
    quote: '"Great Value For Money With High-Quality Service. The Team Was Responsive And Helpful Whenever I Had Questions."',
    author: 'Emma Jain',
    location: 'UK',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    quote: '"Booking Our Honeymoon Via Trippoo Was The Best Decision! Seamless Flight Bookings And Exclusive Resort Perks."',
    author: 'Liam & Sophia',
    location: 'Australia',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'
  }
];

function TravelerReviewsSection() {
  return (
    <div className="reviews-section text-start">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h2 className="display-6 fw-bold mb-0">Traveler Stories & Reviews</h2>
          <div className="d-flex gap-2">
            <button className="nav-arrow-btn" title="Previous Review">
              <i className="bi bi-chevron-left"></i>
            </button>
            <button className="nav-arrow-btn" title="Next Review">
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>

        <Row className="g-4">
          {reviewsData.map((item) => (
            <Col key={item.id} lg={6}>
              <Card className="review-card">
                <Row className="align-items-center g-3">
                  <Col sm={5}>
                    <img src={item.avatar} alt={item.author} className="review-avatar-img" />
                  </Col>
                  <Col sm={7}>
                    <div className="ps-sm-2">
                      <div className="text-warning mb-2">
                        <i className="bi bi-star-fill me-1"></i>
                        <i className="bi bi-star-fill me-1"></i>
                        <i className="bi bi-star-fill me-1"></i>
                        <i className="bi bi-star-fill me-1"></i>
                        <i className="bi bi-star-fill"></i>
                      </div>
                      <p className="review-quote mb-3">{item.quote}</p>
                      <div>
                        <strong className="d-block text-dark fw-bold">{item.author}</strong>
                        <small className="text-muted">{item.location}</small>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default TravelerReviewsSection;
