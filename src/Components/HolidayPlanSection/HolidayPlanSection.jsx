import React from 'react';
import './HolidayPlanSection.css';
import Container from 'react-bootstrap/Container';
import GreenBtn from '../GreenBtn/GreenBtn';

function HolidayPlanSection(props) {
  return (
    <div className='holiday-plan-section py-5'>
        <Container className='h-100 d-flex flex-column align-items-start justify-content-end'>
            <h3 className='text-start text-light text-capitalize fw-semibold'>{props.itemHolidayPlanTitle}</h3>
            <p className='text-start text-light max-w-500 opacity-90'>
              Customized travel itineraries designed for families, couples, and solo wanderers. Lock in early-bird summer savings with zero deposit required.
            </p>
            <GreenBtn btnTitle='Check Summer Deals' btnLink='/holidays' />
        </Container>
    </div>
  )
}

export default HolidayPlanSection;