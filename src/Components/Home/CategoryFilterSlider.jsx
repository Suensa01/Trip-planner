import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useWishlist } from '../../Context/WishlistContext';
import { calculateDynamicPrice, formatCurrency } from '../../utils/pricing';
import './CategoryFilterSlider.css';

const destinationCardsData = [
  {
    id: 'dest-1',
    itemTitle: 'Amalfi Coast Drive',
    country: 'Italy',
    category: 'Couples',
    rating: '4.9',
    reviewsCount: '3.5k',
    duration: '4 Days 3 Nights',
    nights: 3,
    baseNightlyRate: 130,
    itemImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'dest-2',
    itemTitle: 'Bali Tropical Paradise',
    country: 'Indonesia',
    category: 'Solo',
    rating: '4.9',
    reviewsCount: '3.5k',
    duration: '5 Days 4 Nights',
    nights: 4,
    baseNightlyRate: 110,
    itemImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'dest-3',
    itemTitle: 'Dubrovnik Old Town',
    country: 'Croatia',
    category: 'Adventure',
    rating: '4.9',
    reviewsCount: '3.5k',
    duration: '5 Days 4 Nights',
    nights: 4,
    baseNightlyRate: 125,
    itemImage: 'https://images.unsplash.com/photo-1555990537-88775f0a20db?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'dest-4',
    itemTitle: 'Bay of Kotor Fjord',
    country: 'Norway',
    category: 'Family',
    rating: '4.9',
    reviewsCount: '3.2k',
    duration: '3 Days 2 Nights',
    nights: 2,
    baseNightlyRate: 140,
    itemImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
  }
];

function CategoryFilterSlider({ onSelectPackage }) {
  const [selectedFilter, setSelectedFilter] = useState('All Place');
  const { toggleWishlist, isWishlisted } = useWishlist();

  const filteredCards = destinationCardsData.filter(item => {
    if (selectedFilter === 'All Place') return true;
    return item.category === selectedFilter;
  });

  return (
    <div className="category-slider-section">
      <Container>
        {/* Category Pills & Slider Arrows Controls */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div className="d-flex align-items-center gap-2 overflow-auto pb-2">
            {['All Place', 'Couples', 'Family', 'Solo', 'Adventure'].map(category => (
              <Button
                key={category}
                className={`pill-filter-btn ${selectedFilter === category ? 'active' : ''}`}
                onClick={() => setSelectedFilter(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="d-flex align-items-center gap-2">
            <button className="nav-arrow-btn" title="Previous">
              <i className="bi bi-chevron-left"></i>
            </button>
            <button className="nav-arrow-btn" title="Next">
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* Destination Cards Grid */}
        <Row className="g-4 text-start">
          {filteredCards.map((item) => {
            const isSaved = isWishlisted(item);
            // Dynamic price calculation: baseRate * nights * 2 guests * vibeMultiplier
            const dynamicPriceObj = calculateDynamicPrice(item.baseNightlyRate, item.nights, 2, item.category);
            const calculatedPrice = formatCurrency(dynamicPriceObj.total);

            const enrichedItem = {
              ...item,
              itemPrice: calculatedPrice,
              itemNights: `${item.nights} nights`
            };

            return (
              <Col key={item.id} lg={3} md={6}>
                <Card className="destination-portrait-card">
                  <div className="destination-img-wrap">
                    <img src={item.itemImage} alt={item.itemTitle} loading="lazy" decoding="async" />
                    <div className="position-absolute top-0 end-0 m-3">
                      <button
                        type="button"
                        className={`btn btn-sm btn-light rounded-circle shadow-sm ${isSaved ? 'text-danger' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(enrichedItem);
                        }}
                        title={isSaved ? 'Remove Wishlist' : 'Add Wishlist'}
                      >
                        <i className={`bi ${isSaved ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                      </button>
                    </div>
                  </div>

                  <Card.Body className="p-3.5">
                    <div className="d-flex align-items-center gap-1 rating-badge mb-2 d-inline-flex">
                      <i className="bi bi-star-fill"></i>
                      <span>{item.rating}</span>
                      <span className="text-muted small">({item.reviewsCount})</span>
                    </div>

                    <h5 className="fw-bold mb-1 text-dark">{item.itemTitle}</h5>
                    <p className="small text-muted mb-1">
                      <i className="bi bi-geo-alt-fill text-secondary me-1"></i>{item.country}
                    </p>
                    <div className="mb-2">
                      <span className="fw-bold text-success fs-6">{calculatedPrice}</span>
                      <small className="text-muted ms-1">/ 2 Guests</small>
                    </div>

                    <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                      <span className="small text-muted">{item.duration}</span>
                      <Button
                        variant="coral"
                        size="sm"
                        className="btn-coral px-3"
                        onClick={() => onSelectPackage && onSelectPackage(enrichedItem)}
                      >
                        Explore
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}

export default CategoryFilterSlider;
