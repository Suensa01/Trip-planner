import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

function RecentHolidayCard(props) {
  return (
    <div className='col-lg-6'>
        <Card className='card-trippoo shadow d-flex flex-sm-row h-100 overflow-hidden border-0'>
            <div 
              className='img-div img-hover col-sm-6'
              style={{
                backgroundImage: props.itemImage ? `url(${props.itemImage})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '180px'
              }}
            ></div>
            <div className='col-sm-6'>
                <Card.Body className='p-4 d-flex flex-column justify-content-between h-100 text-start'>
                    <div>
                        <Card.Title className='text-start text-uppercase fw-bold mb-2'>{props.itemTitle}</Card.Title>
                        <ul className='list-unstyled mb-3'>
                            <li className='text-start text-muted small mb-1'>{props.itemDescription}</li>
                            <li className='text-start fw-medium small mb-1 text-secondary'>
                              <i className="bi bi-clock me-1"></i>{props.itemNights}
                            </li>
                            <li className='price text-start text-coral fs-5'>
                                <strong>{props.itemPrice}</strong> <small className="fs-6 text-muted">/ person</small>
                            </li>
                        </ul>
                    </div>
                    <Button 
                      variant='coral' 
                      className="btn-coral w-100 fw-bold"
                      onClick={() => props.onSelectPackage && props.onSelectPackage(props)}
                    >
                        View & Book
                    </Button>
                </Card.Body>
            </div>
        </Card>
    </div>
  )
}

export default RecentHolidayCard;