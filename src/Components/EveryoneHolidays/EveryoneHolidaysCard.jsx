import React from 'react';
import Card from 'react-bootstrap/Card';
import ChevronRight from '../../Assets/Icons/chevron-right.svg';
import { calculateDynamicPrice, formatCurrency } from '../../utils/pricing';

function EveryoneHolidaysCard(props) {
  const rawPrice = props.itemPrice ? (parseInt(props.itemPrice.toString().replace(/[^0-9]/g, '')) || 450) : 450;
  const perNightRate = rawPrice > 250 ? Math.round(rawPrice / 4) : rawPrice;

  const priceCalc = calculateDynamicPrice(perNightRate, 4, 2, props.itemTitle || 'Default');
  const formattedPrice = formatCurrency(priceCalc.total);

  const enrichedProps = {
    ...props,
    itemPrice: formattedPrice,
    itemNights: '4 nights'
  };

  return (
    <div className='col-md-6 col-xl-4' onClick={() => props.onSelectPackage && props.onSelectPackage(enrichedProps)} style={{ cursor: 'pointer' }}>
        <Card className='card-trippoo shadow d-flex flex-sm-row overflow-hidden border-0 h-100'>
            <div className='image-div img-hover col-sm-6 d-flex align-items-center justify-content-center px-4 py-5'>
                <h5 className='text-capitalize text-light fw-bold text-center mb-0'>{props.itemTitle}</h5>
            </div>
            <div className='col-sm-6 d-flex align-items-center justify-content-between p-2'>
                <Card.Body className='p-3 text-start'>
                    <p className='mb-1 text-capitalize text-muted small'>{props.itemSubTitle}</p>
                    <p className='price my-1 fw-bold text-success fs-5'>{formattedPrice}</p>
                    <p className='mb-0 small text-muted'>per package (2 guests)</p>
                </Card.Body>
                <img src={ChevronRight} className='me-3' alt="chevron-right" style={{ width: '16px' }} />
            </div>
        </Card>
    </div>
  );
}

export default EveryoneHolidaysCard;