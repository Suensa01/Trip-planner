import React from 'react';
import './NeedInspirationSection.css';
import Container from 'react-bootstrap/Container';

function NeedInspirationSection() {
  return (
    <div className='need-inspiration-section py-5 position-relative'>
        <div className='bg-shape position-absolute'></div>
        <Container>
            <div className="row">
                <div className='col-md-5 z-2 text-start'>
                    <h2 className='text-light text-capitalize fw-semibold'>Need Travel Inspiration?</h2>
                    <p className='text-light opacity-90'>
                      Unsure where your next adventure should take you? Our certified travel consultants are available 24/7 to design your custom holiday package.
                    </p>
                    <div className='d-flex align-items-center mt-3'>
                        <h5 className='text-light text-capitalize fw-semibold text-nowrap mb-0'>Call Us 24/7:</h5>
                        <a href="tel:18005557837" className='text-success bg-white px-3 py-1 rounded mx-2 text-decoration-none h5 fw-bold mb-0'>
                          📞 +1 (800) 555-QUEST
                        </a>
                    </div>
                </div>
            </div>
        </Container>
    </div>
  )
}

export default NeedInspirationSection;