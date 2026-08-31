import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useWishlist } from '../../Context/WishlistContext';
import { calculateDynamicPrice, formatCurrency } from '../../utils/pricing';

function LastHolidayCard(props) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const isSaved = isWishlisted(props);

  const priceCalc = calculateDynamicPrice(125, 4, 2, props.itemTitle || 'Luxury');
  const formattedPrice = formatCurrency(priceCalc.total);

  const enrichedProps = {
    ...props,
    itemPrice: formattedPrice,
    itemNights: '4 nights'
  };

  return (
    <div className='col-lg-4'>
        <Card className='card-trippoo shadow h-100 overflow-hidden border-0 position-relative'>
            <div className="position-relative">
                <Card.Img className='img-hover' variant='top' src={props.itemImage} loading="lazy" decoding="async" style={{ height: '220px', objectFit: 'cover' }} />
                <button
                  type="button"
                  className={`btn btn-sm btn-light position-absolute top-0 end-0 m-2 rounded-circle shadow-sm ${isSaved ? 'text-danger' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(enrichedProps);
                  }}
                  title={isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <i className={`bi ${isSaved ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i>
                </button>
            </div>
            <Card.Body className='p-4 d-flex flex-column justify-content-between text-start'>
                <div>
                    <Card.Title className='text-start text-uppercase fw-bold mb-1'>{props.itemTitle}</Card.Title>
                    <Card.Text className='text-start text-muted small mb-2'>{props.itemDescription}</Card.Text>
                    <div className="d-flex justify-content-between align-items-center mb-3 pt-2 border-top">
                      <span className="small text-muted">4 Nights / 2 Guests</span>
                      <span className="fw-bold text-success fs-6">{formattedPrice}</span>
                    </div>
                </div>
                <Button 
                  variant="coral" 
                  className='btn-coral fw-bold w-100'
                  onClick={() => props.onSelectPackage && props.onSelectPackage(enrichedProps)}
                >
                  Book Now ({formattedPrice})
                </Button>
            </Card.Body>
        </Card>
    </div>
  );
}

export default LastHolidayCard;