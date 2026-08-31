import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useWishlist } from '../../Context/WishlistContext';
import { calculateDynamicPrice, formatCurrency } from '../../utils/pricing';

function CityBreakCard(props) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const isSaved = isWishlisted(props);

  const nightsNum = props.itemNights ? (parseInt(props.itemNights) || 4) : 4;
  const rawPrice = props.itemPrice ? (parseInt(props.itemPrice.toString().replace(/[^0-9]/g, '')) || 120) : 120;
  const perNightRate = rawPrice > 300 ? Math.round(rawPrice / nightsNum) : rawPrice;

  const priceCalc = calculateDynamicPrice(perNightRate, nightsNum, 2, props.itemTitle || 'Couples');
  const formattedPrice = formatCurrency(priceCalc.total);

  const enrichedProps = {
    ...props,
    itemPrice: formattedPrice,
    itemNights: `${nightsNum} nights`
  };

  return (
    <div className='col-md-6 col-lg-4'>
        <Card className='card-trippoo shadow h-100 overflow-hidden border-0 position-relative'>
            <div className="position-relative">
                <Card.Img className='img-hover' variant='top' src={props.itemImage} loading="lazy" decoding="async" style={{ height: '200px', objectFit: 'cover' }} />
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
                    <Card.Text className='text-start text-muted small mb-0'>{props.itemSubTitle}</Card.Text>
                    <div className='d-flex justify-content-between align-items-center mt-3 mb-3'>
                        <span className="badge bg-light text-dark border">
                          <i className="bi bi-clock me-1"></i>{nightsNum} Nights
                        </span>
                        <Card.Text className="mb-0 small">
                            from <span className='fw-bold text-coral fs-6'>{formattedPrice}</span> <small className="text-muted">/ 2 Guests</small>
                        </Card.Text>
                    </div>
                </div>
                <Button 
                  variant="coral" 
                  className="btn-coral w-100 fw-bold"
                  onClick={() => props.onSelectPackage && props.onSelectPackage(enrichedProps)}
                >
                  Book Package ({formattedPrice})
                </Button>
            </Card.Body>
        </Card>
    </div>
  );
}

export default CityBreakCard;