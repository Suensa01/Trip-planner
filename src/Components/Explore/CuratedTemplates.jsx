import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import { useTrip } from '../../Context/TripContext';
import { useToast } from '../../Context/ToastContext';
import { useNavigate } from 'react-router-dom';

const templatesList = [
  {
    id: 'tmpl-1',
    title: '3 Days Classic Rome Highlights',
    destination: 'Rome, Italy',
    vibe: 'Culture & History',
    daysCount: 3,
    price: '₹54,000',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    days: [
      {
        dayNumber: 1,
        date: '2026-09-10',
        title: 'Historic Center Stroll',
        activities: [
          { id: 't1-1', title: 'Piazza Navona & Pantheon Tour', type: 'activity', time: '10:00 AM', location: 'Piazza Navona, Rome', price: 2100, lat: 41.8992, lng: 12.4731 },
          { id: 't1-2', title: 'Trevi Fountain Evening Gelato', type: 'food', time: '06:00 PM', location: 'Piazza di Trevi, Rome', price: 1200, lat: 41.9009, lng: 12.4833 }
        ]
      },
      {
        dayNumber: 2,
        date: '2026-09-11',
        title: 'Colosseum Wonders',
        activities: [
          { id: 't1-3', title: 'Colosseum Skip-the-Line Arena Access', type: 'activity', time: '09:00 AM', location: 'Piazza del Colosseo, Rome', price: 5500, lat: 41.8902, lng: 12.4922 },
          { id: 't1-4', title: 'Roman Forum & Palatine Hill Guided Tour', type: 'activity', time: '02:00 PM', location: 'Via dei Fori Imperiali, Rome', price: 3400, lat: 41.8925, lng: 12.4853 }
        ]
      },
      {
        dayNumber: 3,
        date: '2026-09-12',
        title: 'Vatican Museums & Sistine Chapel',
        activities: [
          { id: 't1-5', title: 'Vatican Museums & Sistine Chapel Pass', type: 'activity', time: '09:30 AM', location: 'Vatican City, Rome', price: 4600, lat: 41.9065, lng: 12.4536 },
          { id: 't1-6', title: 'St. Peter Basilica Dome Climb', type: 'activity', time: '03:00 PM', location: 'Piazza San Pietro, Rome', price: 1800, lat: 41.9022, lng: 12.4539 }
        ]
      }
    ]
  },
  {
    id: 'tmpl-2',
    title: '5 Days Rajasthan Royal Forts',
    destination: 'Rajasthan, India',
    vibe: 'Heritage & Desert Safari',
    daysCount: 5,
    price: '₹42,000',
    image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=800&q=80',
    days: [
      {
        dayNumber: 1,
        date: '2026-10-05',
        title: 'Jaipur Pink City Arrival & Palace Tour',
        activities: [
          { id: 't2-1', title: 'Amber Fort Elephant Ride & Palace Tour', type: 'activity', time: '09:00 AM', location: 'Amer, Jaipur, Rajasthan', price: 2800, lat: 26.9855, lng: 75.8513 },
          { id: 't2-2', title: 'Hawa Mahal Photo & Bazaar Walk', type: 'activity', time: '03:00 PM', location: 'Hawa Mahal Rd, Jaipur', price: 1200, lat: 26.9239, lng: 75.8267 }
        ]
      },
      {
        dayNumber: 2,
        date: '2026-10-06',
        title: 'City Palace & Jantar Mantar Observatory',
        activities: [
          { id: 't2-3', title: 'Jaipur City Palace Museum Access', type: 'activity', time: '10:00 AM', location: 'Tulsi Marg, Jaipur', price: 2100, lat: 26.9258, lng: 75.8237 },
          { id: 't2-4', title: 'Chokhi Dhani Heritage Cultural Dinner', type: 'food', time: '07:00 PM', location: 'Tonk Rd, Jaipur', price: 2500, lat: 26.7692, lng: 75.8341 }
        ]
      },
      {
        dayNumber: 3,
        date: '2026-10-07',
        title: 'Jodhpur Blue City & Mehrangarh Fort',
        activities: [
          { id: 't2-5', title: 'Mehrangarh Fort Zipline & Audio Tour', type: 'activity', time: '10:00 AM', location: 'Jodhpur, Rajasthan', price: 3800, lat: 26.2978, lng: 73.0184 },
          { id: 't2-6', title: 'Jaswant Thada Royal Cenotaphs', type: 'activity', time: '03:30 PM', location: 'Jodhpur', price: 1200, lat: 26.3045, lng: 73.0234 }
        ]
      },
      {
        dayNumber: 4,
        date: '2026-10-08',
        title: 'Jaisalmer Golden Fort & Desert Dunes',
        activities: [
          { id: 't2-7', title: 'Jaisalmer Fort Living Heritage Walk', type: 'activity', time: '11:00 AM', location: 'Fort Rd, Jaisalmer', price: 1600, lat: 26.9124, lng: 70.9127 },
          { id: 't2-8', title: 'Sam Sand Dunes Camel Safari & Camp Night', type: 'hotel', time: '05:00 PM', location: 'Sam Sand Dunes, Jaisalmer', price: 7200, lat: 26.8312, lng: 70.5234 }
        ]
      },
      {
        dayNumber: 5,
        date: '2026-10-09',
        title: 'Thar Desert Sunrise & Departure',
        activities: [
          { id: 't2-9', title: 'Desert Sunrise Quad Biking', type: 'activity', time: '06:00 AM', location: 'Thar Desert, Jaisalmer', price: 3400, lat: 26.8300, lng: 70.5200 },
          { id: 't2-10', title: 'Rajasthani Souvenir Shopping & Departure', type: 'activity', time: '01:00 PM', location: 'Jaisalmer City', price: 1600, lat: 26.9150, lng: 70.9150 }
        ]
      }
    ]
  },
  {
    id: 'tmpl-3',
    title: '4 Days Romantic Paris & Versailles',
    destination: 'Paris, France',
    vibe: 'Romance & Museums',
    daysCount: 4,
    price: '₹75,000',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    days: [
      {
        dayNumber: 1,
        date: '2026-09-20',
        title: 'Eiffel Tower Sunset & Seine Cruise',
        activities: [
          { id: 't3-1', title: 'Eiffel Tower Summit Access', type: 'activity', time: '04:00 PM', location: 'Champ de Mars, Paris', price: 3800, lat: 48.8584, lng: 2.2945 },
          { id: 't3-2', title: 'Seine River Cruise & 3-Course Dinner', type: 'food', time: '08:00 PM', location: 'Port de la Bourdonnais, Paris', price: 8000, lat: 48.8606, lng: 2.2976 }
        ]
      },
      {
        dayNumber: 2,
        date: '2026-09-21',
        title: 'Louvre Art Museum & Tuileries Garden',
        activities: [
          { id: 't3-3', title: 'Louvre Museum Mona Lisa Timed Entry', type: 'activity', time: '10:00 AM', location: '75001 Paris, France', price: 2500, lat: 48.8606, lng: 2.3376 },
          { id: 't3-4', title: 'Tuileries Garden Coffee & Pastry Break', type: 'food', time: '03:00 PM', location: 'Place de la Concorde, Paris', price: 1600, lat: 48.8635, lng: 2.3275 }
        ]
      },
      {
        dayNumber: 3,
        date: '2026-09-22',
        title: 'Palace of Versailles Day Tour',
        activities: [
          { id: 't3-5', title: 'Palace of Versailles Passport & Gardens Access', type: 'activity', time: '09:00 AM', location: 'Place d Armes, Versailles', price: 5100, lat: 48.8049, lng: 2.1204 },
          { id: 't3-6', title: 'Hall of Mirrors Guided Walk', type: 'activity', time: '02:00 PM', location: 'Versailles Palace', price: 2900, lat: 48.8045, lng: 2.1210 }
        ]
      },
      {
        dayNumber: 4,
        date: '2026-09-23',
        title: 'Montmartre & Sacré-Cœur Artist Walk',
        activities: [
          { id: 't3-7', title: 'Montmartre Artist Square Walking Tour', type: 'activity', time: '11:00 AM', location: 'Place du Tertre, Paris', price: 2100, lat: 48.8865, lng: 2.3408 },
          { id: 't3-8', title: 'Sacré-Cœur Basilica Sunset Panoramic View', type: 'activity', time: '05:00 PM', location: '35 Rue du Chevalier de la Barre', price: 1200, lat: 48.8867, lng: 2.3431 }
        ]
      }
    ]
  },
  {
    id: 'tmpl-4',
    title: '7 Days Tropical Bali Beach & Villas',
    destination: 'Bali, Indonesia',
    vibe: 'Relaxation & Nature',
    daysCount: 7,
    price: '₹62,000',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    days: [
      {
        dayNumber: 1,
        date: '2026-10-12',
        title: 'Ubud Monkey Forest & Rice Terraces',
        activities: [
          { id: 't4-1', title: 'Sacred Monkey Forest Sanctuary', type: 'activity', time: '09:00 AM', location: 'Ubud, Gianyar, Bali', price: 1200, lat: -8.5194, lng: 115.2631 },
          { id: 't4-2', title: 'Tegallalang Rice Terrace Swing & Coffee Tasting', type: 'activity', time: '02:00 PM', location: 'Tegallalang, Gianyar', price: 2100, lat: -8.4312, lng: 115.2798 }
        ]
      },
      {
        dayNumber: 2,
        date: '2026-10-13',
        title: 'Mount Batur Sunrise Volcano Trek',
        activities: [
          { id: 't4-3', title: 'Mount Batur 4x4 Jeep Sunrise Tour', type: 'activity', time: '04:00 AM', location: 'Kintamani, Bangli', price: 5500, lat: -8.2422, lng: 115.3754 },
          { id: 't4-4', title: 'Toya Devasya Hot Spring Thermal Bath', type: 'activity', time: '11:00 AM', location: 'Lake Batur, Kintamani', price: 2500, lat: -8.2612, lng: 115.3890 }
        ]
      },
      {
        dayNumber: 3,
        date: '2026-10-14',
        title: 'Seminyak Beach Club & Sunset Lounge',
        activities: [
          { id: 't4-5', title: 'Seminyak Beach Day Beds & Surfing Lesson', type: 'activity', time: '11:00 AM', location: 'Seminyak Beach, Kuta', price: 3400, lat: -8.6913, lng: 115.1578 },
          { id: 't4-6', title: 'Potato Head Beach Club Sunset Dinner', type: 'food', time: '06:00 PM', location: 'Petitenget St, Seminyak', price: 4200, lat: -8.6798, lng: 115.1523 }
        ]
      },
      {
        dayNumber: 4,
        date: '2026-10-15',
        title: 'Nusa Penida Island Fast Boat Day Trip',
        activities: [
          { id: 't4-7', title: 'Kelingking Secret T-Rex Beach Viewpoint', type: 'activity', time: '09:30 AM', location: 'Nusa Penida, Klungkung', price: 4600, lat: -8.7506, lng: 115.4745 },
          { id: 't4-8', title: 'Broken Beach & Angel Billabong Snorkel', type: 'activity', time: '02:00 PM', location: 'Nusa Penida Island', price: 2900, lat: -8.7334, lng: 115.4498 }
        ]
      },
      {
        dayNumber: 5,
        date: '2026-10-16',
        title: 'Uluwatu Cliff Temple & Kecak Fire Dance',
        activities: [
          { id: 't4-9', title: 'Uluwatu Temple Cliff Walk', type: 'activity', time: '03:00 PM', location: 'Pecatu, South Kuta', price: 1600, lat: -8.8291, lng: 115.0849 },
          { id: 't4-10', title: 'Traditional Kecak Fire Dance at Sunset', type: 'activity', time: '06:00 PM', location: 'Uluwatu Amphitheatre', price: 2100, lat: -8.8295, lng: 115.0852 }
        ]
      },
      {
        dayNumber: 6,
        date: '2026-10-17',
        title: 'Balinese Herbal Spa & Cooking Masterclass',
        activities: [
          { id: 't4-11', title: '2-Hour Luxury Balinese Massage & Floral Bath', type: 'activity', time: '10:00 AM', location: 'Ubud Spa Sanctuary', price: 5100, lat: -8.5069, lng: 115.2625 },
          { id: 't4-12', title: 'Authentic Organic Farm Cooking Class', type: 'food', time: '03:00 PM', location: 'Payangan, Ubud', price: 3400, lat: -8.4500, lng: 115.2500 }
        ]
      },
      {
        dayNumber: 7,
        date: '2026-10-18',
        title: 'Canggu Organic Cafe & Souvenir Shopping',
        activities: [
          { id: 't4-13', title: 'Love Anchor Canggu Souvenir Bazaar', type: 'activity', time: '11:00 AM', location: 'Batu Bolong St, Canggu', price: 1600, lat: -8.6534, lng: 115.1325 },
          { id: 't4-14', title: 'Airport VIP Lounge & Departure Transfer', type: 'activity', time: '04:00 PM', location: 'Ngurah Rai Intl Airport', price: 2900, lat: -8.7482, lng: 115.1672 }
        ]
      }
    ]
  }
];

function CuratedTemplates() {
  const { cloneTemplate } = useTrip();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleClone = (tmpl) => {
    cloneTemplate({
      title: tmpl.title,
      destination: tmpl.destination,
      coverImage: tmpl.image,
      days: tmpl.days
    });
    showToast('Template Imported!', `Loaded ${tmpl.daysCount}-Day "${tmpl.title}" with all activities into your Trip Planner.`, 'success', 'bi-journal-plus');
    navigate('/planner');
  };

  return (
    <div className="curated-templates mt-5 text-start">
      <h3 className="fw-bold text-dark mb-1">
        <i className="bi bi-bank me-2 text-coral"></i>Curated Itinerary Guides & Templates
      </h3>
      <p className="text-muted mb-4">
        Clone pre-built expert guides directly into your itinerary planner with one click.
      </p>

      <div className="row g-4">
        {templatesList.map((tmpl) => (
          <div key={tmpl.id} className="col-md-6 col-lg-3">
            <Card className="card-trippoo h-100 shadow-sm border-0 rounded-4 overflow-hidden text-start">
              <div className="position-relative">
                <Card.Img variant="top" src={tmpl.image} loading="lazy" decoding="async" style={{ height: '170px', objectFit: 'cover' }} />
                <Badge bg="dark" className="position-absolute top-0 end-0 m-2 px-2 py-1">
                  <i className="bi bi-clock me-1"></i>{tmpl.daysCount} Days
                </Badge>
              </div>
              <Card.Body className="p-3.5 d-flex flex-column justify-content-between">
                <div>
                  <Badge bg="coral" className="btn-coral mb-2">{tmpl.vibe}</Badge>
                  <Card.Title className="fw-bold fs-6 mb-2">{tmpl.title}</Card.Title>
                  <p className="small text-muted mb-2">
                    <i className="bi bi-geo-alt-fill me-1 text-danger"></i>{tmpl.destination}
                  </p>
                </div>
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="small text-muted">Estimated:</span>
                    <span className="fw-bold text-coral">{tmpl.price}</span>
                  </div>
                  <Button variant="outline-coral" className="btn-outline-coral w-100 fw-bold" onClick={() => handleClone(tmpl)}>
                    <i className="bi bi-journal-plus me-1"></i>Clone Template
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CuratedTemplates;
