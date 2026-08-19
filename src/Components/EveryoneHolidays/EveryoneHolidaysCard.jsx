import React from 'react';
import Card from 'react-bootstrap/Card';
import ChevronRight from '../../Assets/Icons/chevron-right.svg';

function EveryoneHolidaysCard(props) {
  return (
    <div className='col-md-6 col-xl-4' onClick={() => props.onSelectPackage && props.onSelectPackage(props)} style={{ cursor: 'pointer' }}>
        <Card className='shadow d-flex flex-sm-row overflow-hidden border-0 h-100'>
            <div className='image-div img-hover col-sm-6 d-flex align-items-center justify-content-center px-4 py-5'>
                <h5 className='text-capitalize text-light fw-bold text-center mb-0'>{props.itemTitle}</h5>
            </div>
            <div className='col-sm-6 d-flex align-items-center justify-content-between p-2'>
                <Card.Body className='p-3 text-start'>
                    <p className='mb-1 text-capitalize text-muted small'>{props.itemSubTitle}</p>
                    <p className='price my-1 fw-bold text-success fs-5'>{props.itemPrice}</p>
                    <p className='mb-0 small text-muted'>per person</p>
                </Card.Body>
                <img src={ChevronRight} className='me-3' alt="chevron-right" style={{ width: '16px' }} />
            </div>
        </Card>
    </div>
  )
}

export default EveryoneHolidaysCard;