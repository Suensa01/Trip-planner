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
    price: '$650 est.',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    days: [
      {
        dayNumber: 1,
        date: '2026-09-10',
        title: 'Historic Center Stroll',
        activities: [
          { id: 't1-1', title: 'Piazza Navona & Pantheon', type: 'activity', time: '10:00 AM', location: 'Rome Center', price: 15 },
          { id: 't1-2', title: 'Trevi Fountain Evening Gelato', type: 'food', time: '06:00 PM', location: 'Trevi Fountain', price: 10 }
        ]
      },
      {
        dayNumber: 2,
        date: '2026-09-11',
        title: 'Colosseum Wonders',
        activities: [
          { id: 't1-3', title: 'Colosseum Skip-the-Line Tour', type: 'activity', time: '09:00 AM', location: 'Piazza del Colosseo', price: 65 }
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
    price: '$520 est.',
    image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=800&q=80',
    days: [
      {
        dayNumber: 1,
        date: '2026-10-05',
        title: 'Jaipur Pink City Palace Tour',
        activities: [
          { id: 't2-1', title: 'Amber Fort Elephant Ride', type: 'activity', time: '09:00 AM', location: 'Amer, Jaipur', price: 30 },
          { id: 't2-2', title: 'Hawa Mahal Photo Pass', type: 'activity', time: '03:00 PM', location: 'Jaipur', price: 10 }
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
    price: '$890 est.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    days: [
      {
        dayNumber: 1,
        date: '2026-09-20',
        title: 'Eiffel Tower Sunset & Seine Cruise',
        activities: [
          { id: 't3-1', title: 'Eiffel Tower Summit Access', type: 'activity', time: '04:00 PM', location: 'Champ de Mars', price: 40 },
          { id: 't3-2', title: 'Seine River Cruise & Dinner', type: 'food', time: '08:00 PM', location: 'Port de la Bourdonnais', price: 95 }
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
    price: '$740 est.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    days: [
      {
        dayNumber: 1,
        date: '2026-10-12',
        title: 'Ubud Monkey Forest & Rice Terraces',
        activities: [
          { id: 't4-1', title: 'Tegallalang Rice Terrace Trek', type: 'activity', time: '09:00 AM', location: 'Ubud', price: 15 }
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
    showToast('Template Imported!', `Loaded "${tmpl.title}" into your Trip Planner.`, 'success', 'bi-journal-plus');
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
                <Card.Img variant="top" src={tmpl.image} style={{ height: '170px', objectFit: 'cover' }} />
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
