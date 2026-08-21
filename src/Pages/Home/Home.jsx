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

function Home() {
    const [selectedPackage, setSelectedPackage] = useState(null);

    const handleSearchSubmit = (searchParams) => {
        setSelectedPackage({
            itemTitle: searchParams.place ? `${searchParams.place} Custom Package` : 'Featured Vacation Package',
            itemDescription: `Curated ${searchParams.type || 'tour'} package for ${searchParams.travelers || '2 Guests'} in ${searchParams.place || 'Zurich'}. Includes 4-star hotel stay, guided tours, and breakfast.`,
            itemPrice: '$850',
            itemNights: '4 nights'
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