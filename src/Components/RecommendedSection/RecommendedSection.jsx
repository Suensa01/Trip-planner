import React from 'react';
import './RecommendedSection.css';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

function RecommendedSection(props) {
  return (
    <div className='recommended-section'>
        <Container className='position-relative py-5 rounded'>
            <div className='bg-shape position-absolute'>
            </div>
            <div className='row justify-content-end'>
                <div className='col-md-6 col-lg-4 z-2 text-start'>
                    <h3 className='text-light text-capitalize fw-semibold'>{props.itemRecommendedTitle}</h3>
                    <p className='text-light small opacity-90'>
                      Handpicked resort stays with exclusive dining credit, private beach access, and zero cancellation fees for all summer bookings.
                    </p>
                    <Button 
                      variant='success' 
                      className='fw-bold px-4 text-uppercase'
                      onClick={() => props.onSelectPackage && props.onSelectPackage({
                        itemTitle: props.itemRecommendedTitle || 'Handpicked Vacation Resort',
                        itemDescription: 'Luxury resort package with private pool, sea view, and complimentary spa treatment.',
                        itemPrice: '₹19,999',
                        itemNights: '5 nights'
                      })}
                    >
                      Book Special Offer
                    </Button>
                </div>
            </div>
        </Container>
    </div>
  )
}

export default RecommendedSection;