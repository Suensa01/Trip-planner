import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useWishlist } from '../../Context/WishlistContext';

function LastHolidayCard(props) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const isSaved = isWishlisted(props);

  return (
    <div className='col-lg-4'>
        <Card className='card-trippoo shadow h-100 overflow-hidden border-0 position-relative'>
            <div className="position-relative">
                <Card.Img className='img-hover' variant='top' src={props.itemImage} style={{ height: '220px', objectFit: 'cover' }} />
                <button
                  type="button"
                  className={`btn btn-sm btn-light position-absolute top-0 end-0 m-2 rounded-circle shadow-sm ${isSaved ? 'text-danger' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(props);
                  }}
                  title={isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <i className={`bi ${isSaved ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i>
                </button>
            </div>
            <Card.Body className='p-4 d-flex flex-column justify-content-between text-start'>
                <div>
                    <Card.Title className='text-start text-uppercase fw-bold mb-2'>{props.itemTitle}</Card.Title>
                    <Card.Text className='text-start text-muted small mb-3'>{props.itemDescription}</Card.Text>
                </div>
                <Button 
                  variant="coral" 
                  className='btn-coral fw-bold w-100'
                  onClick={() => props.onSelectPackage && props.onSelectPackage(props)}
                >
                  Book Now
                </Button>
            </Card.Body>
        </Card>
    </div>
  )
}

export default LastHolidayCard;