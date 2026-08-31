import React, { useState } from 'react';
import './Home.css';
import HeroSection from '../../Components/HeroSection/HeroSection';
import SearchForm from '../../Components/SearchForm/SearchForm';
import CategoryFilterSlider from '../../Components/Home/CategoryFilterSlider';
import OurStorySection from '../../Components/Home/OurStorySection';
import TrustSection from '../../Components/Home/TrustSection';
import TravelerReviewsSection from '../../Components/Home/TravelerReviewsSection';
import TripConfidenceSection from '../../Components/Home/TripConfidenceSection';
import PackageDetailModal from '../../Components/PackageDetailModal/PackageDetailModal';
import { calculateDynamicPrice, formatCurrency } from '../../utils/pricing';

function Home() {
    const [selectedPackage, setSelectedPackage] = useState(null);

    const handleSearchSubmit = (searchParams) => {
        const guestCount = parseInt(searchParams.travelers) || 2;
        const vibe = searchParams.travelers?.includes('Solo') ? 'Solo' :
                     searchParams.travelers?.includes('Family') ? 'Family' :
                     searchParams.travelers?.includes('Group') ? 'Luxury' : 'Couples';

        const priceCalc = calculateDynamicPrice(130, 4, guestCount, vibe);
        const dynamicFormattedPrice = formatCurrency(priceCalc.total);

        setSelectedPackage({
            itemTitle: searchParams.place ? `${searchParams.place} Custom Package` : 'Featured Vacation Package',
            itemDescription: `Curated ${searchParams.type || 'tour'} package for ${searchParams.travelers || '2 Guests'} in ${searchParams.place || 'Zurich'}. Includes 4-star luxury hotel stay, guided city tours, and daily breakfast.`,
            itemPrice: dynamicFormattedPrice,
            itemNights: '4 nights',
            category: vibe
        });
    };

    return (
        <div className='home-page bg-light'>
            {/* Trippoo Hero Section */}
            <HeroSection />

            {/* Overlapping Floating Search Bar */}
            <SearchForm onSearchSubmit={handleSearchSubmit} />

            {/* Category Filter Pills & Destination Cards Slider */}
            <CategoryFilterSlider onSelectPackage={setSelectedPackage} />

            {/* Our Story Section */}
            <OurStorySection />

            {/* Why Travellers Trust Us Section */}
            <TrustSection />

            {/* Traveler Stories & Reviews Section */}
            <TravelerReviewsSection />

            {/* Plan Your Next Trip With Confidence CTA Gallery Banner */}
            <TripConfidenceSection />

            {/* Package Booking Detail Modal */}
            <PackageDetailModal 
                show={!!selectedPackage} 
                onHide={() => setSelectedPackage(null)} 
                packageData={selectedPackage} 
            />
        </div>
    );
}

export default Home;