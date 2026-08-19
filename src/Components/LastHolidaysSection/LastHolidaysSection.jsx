import React from 'react';
import './LastHolidaysSection.css';
import Container from 'react-bootstrap/Container';
import LastHolidaysItems from '../../Assets/LastHolidaysItems';
import LastHolidayCard from './LastHolidayCard';

const updatedItems = LastHolidaysItems.map(item => {
  if (item.id === 1) return { ...item, itemDescription: 'Experience royal palaces, vibrant desert safaris, and rich heritage hotels in Rajasthan.' };
  if (item.id === 2) return { ...item, itemDescription: 'Unwind at pristine golden beaches, historic temples, and scenic coastal backwaters in Odisha.' };
  if (item.id === 3) return { ...item, itemDescription: 'Explore breathtaking snow peaks, serene Dal lake houseboats, and lush alpine valleys in Kashmir.' };
  return item;
});

function LastHolidaysSection({ onSelectPackage }) {
  return (
    <div className='last-holidays-section my-4 my-sm-5'>
        <Container>
            <h2 className='text-uppercase fw-semibold my-4 my-sm-5 pt-lg-4 text-start'>Last Minute Deals & Holidays</h2>
            <div className="row g-4">
                {
                    updatedItems.map((item) => (
                      <LastHolidayCard 
                        key={item.id} 
                        itemImage={item.itemImage} 
                        itemTitle={item.itemTitle} 
                        itemDescription={item.itemDescription}
                        itemPrice={item.itemPrice || '₹12,499'}
                        onSelectPackage={onSelectPackage}
                      />
                    ))
                }
            </div>
        </Container>
    </div>
  )
}

export default LastHolidaysSection;