import React, { useState } from 'react';
import './Holidays.css';
import SecondHeroSection from '../../Components/SecondHeroSection/SecondHeroSection';
import EveryoneHolidays from '../../Components/EveryoneHolidays/EveryoneHolidays';
import NeedInspirationSection from '../../Components/NeedInspiration/NeedInspirationSection';
import NextHoliday from '../../Components/NextHoliday/NextHoliday';
import HolidayPlanSection from '../../Components/HolidayPlanSection/HolidayPlanSection';
import RecommendedSection from '../../Components/RecommendedSection/RecommendedSection';
import PackageDetailModal from '../../Components/PackageDetailModal/PackageDetailModal';

function Holidays() {
    const [selectedPackage, setSelectedPackage] = useState(null);

    return (
        <div className='holidays-page'>
            <SecondHeroSection secondHeroTitle='Your Perfect Holiday Destination' />
            <EveryoneHolidays onSelectPackage={setSelectedPackage} />
            <NeedInspirationSection />
            <NextHoliday onSelectPackage={setSelectedPackage} />
            <HolidayPlanSection itemHolidayPlanTitle='Plan your summer holidays' />
            <div className='mt-4 mt-sm-5'>
                <RecommendedSection itemRecommendedTitle='Recommended for you' onSelectPackage={setSelectedPackage} />
            </div>

            <PackageDetailModal 
                show={!!selectedPackage} 
                onHide={() => setSelectedPackage(null)} 
                packageData={selectedPackage} 
            />
        </div>
    )
}

export default Holidays;