import React, { useState } from 'react';
import './CityBreaks.css';
import SecondHeroSection from '../../Components/SecondHeroSection/SecondHeroSection';
import AmsterdamCityBreaksSection from '../../Components/CityBreaksSection/AmsterdamCityBreaksSection';
import HolidayPlanSection from '../../Components/HolidayPlanSection/HolidayPlanSection';
import LondonCityBreaksSection from '../../Components/CityBreaksSection/LondonCityBreaksSection';
import RecommendedSection from '../../Components/RecommendedSection/RecommendedSection';
import ParisCityBreaksSection from '../../Components/CityBreaksSection/ParisCityBreaksSection';
import NeedInspirationSection from '../../Components/NeedInspiration/NeedInspirationSection';
import PackageDetailModal from '../../Components/PackageDetailModal/PackageDetailModal';

function CityBreaks() {
  const [selectedPackage, setSelectedPackage] = useState(null);

  return (
    <div className='city-breaks-page'>
      <SecondHeroSection secondHeroTitle='Unforgettable City Breaks' />
      <AmsterdamCityBreaksSection onSelectPackage={setSelectedPackage} />
      <HolidayPlanSection itemHolidayPlanTitle='Find your perfect summer holiday' />
      <LondonCityBreaksSection onSelectPackage={setSelectedPackage} />
      <div className='my-4 my-sm-5'>
        <RecommendedSection itemRecommendedTitle='Your dream holiday' onSelectPackage={setSelectedPackage} />
      </div>
      <ParisCityBreaksSection onSelectPackage={setSelectedPackage} />
      <NeedInspirationSection />

      <PackageDetailModal 
        show={!!selectedPackage} 
        onHide={() => setSelectedPackage(null)} 
        packageData={selectedPackage} 
      />
    </div>
  )
}

export default CityBreaks;