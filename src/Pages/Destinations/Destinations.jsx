import React, { useState } from 'react';
import './Destinations.css';
import SecondHeroSection from '../../Components/SecondHeroSection/SecondHeroSection';
import EuropeDestinationsSection from '../../Components/DestinationsSection/EuropeDestinationsSection';
import HolidayPlanSection from '../../Components/HolidayPlanSection/HolidayPlanSection';
import AsiaDestinationsSection from '../../Components/DestinationsSection/AsiaDestinationsSection';
import NeedInspirationsSection from '../../Components/NeedInspiration/NeedInspirationSection';
import AfricaDestinationsSection from '../../Components/DestinationsSection/AfricaDestinationsSection';
import RecommendedSection from '../../Components/RecommendedSection/RecommendedSection';
import PackageDetailModal from '../../Components/PackageDetailModal/PackageDetailModal';

function Destinations() {
  const [selectedPackage, setSelectedPackage] = useState(null);

  return (
    <div className='destinations-page'>
      <SecondHeroSection secondHeroTitle='CONTINENTAL DESTINATIONS' />
      <EuropeDestinationsSection onSelectPackage={setSelectedPackage} />
      <HolidayPlanSection itemHolidayPlanTitle='Find your perfect summer holiday' />
      <AsiaDestinationsSection onSelectPackage={setSelectedPackage} />
      <NeedInspirationsSection />
      <AfricaDestinationsSection onSelectPackage={setSelectedPackage} />
      <div className='mt-4 mt-sm-5'>
        <RecommendedSection itemRecommendedTitle='Your dream holiday' onSelectPackage={setSelectedPackage} />
      </div>

      <PackageDetailModal 
        show={!!selectedPackage} 
        onHide={() => setSelectedPackage(null)} 
        packageData={selectedPackage} 
      />
    </div>
  )
}

export default Destinations;