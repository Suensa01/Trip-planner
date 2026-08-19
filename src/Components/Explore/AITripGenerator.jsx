import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { useTrip } from '../../Context/TripContext';
import { useToast } from '../../Context/ToastContext';
import { useNavigate } from 'react-router-dom';
import './AITripGenerator.css';

function AITripGenerator() {
  const [destination, setDestination] = useState('Rome');
  const [vibe, setVibe] = useState('Romantic');
  const [days, setDays] = useState('3');
  const [loading, setLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);
  const { cloneTemplate } = useTrip();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleGenerate = (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedResult(null);

    const generatedDays = Array.from({ length: Number(days) }, (_, i) => ({
      dayNumber: i + 1,
      date: `2026-10-0${i + 1}`,
      title: i === 0 ? `Arrival & ${vibe} Stroll` : i === 1 ? 'Cultural Highlights' : `Scenic ${destination} Tour`,
      activities: [
        { id: `gen-${i}-1`, title: `${vibe} Morning Experience in ${destination}`, type: 'activity', time: '10:00 AM', location: `${destination} Landmark`, price: 40 + i * 15, notes: `Curated for ${vibe.toLowerCase()} vibes` },
        { id: `gen-${i}-2`, title: `Local Lunch & Dining Stop`, type: 'food', time: '01:30 PM', location: `${destination} Central Square`, price: 25 + i * 10, notes: 'Highly recommended local spot' }
      ]
    }));

    setTimeout(() => {
      setLoading(false);
      setGeneratedResult({
        title: `${days}-Day ${vibe} Escape to ${destination}`,
        destination,
        coverImage: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=1200&q=80',
        days: generatedDays
      });
      showToast('AI Plan Created!', `Generated a ${days}-day ${vibe} itinerary for ${destination}.`, 'success', 'bi-stars');
    }, 1200);
  };

  const handleClone = () => {
    if (generatedResult) {
      cloneTemplate(generatedResult);
      showToast('Itinerary Cloned!', `Loaded "${generatedResult.title}" into your Planner!`, 'success', 'bi-journal-check');
      navigate('/planner');
    }
  };

  return (
    <Card className="shadow border-0 rounded-4 overflow-hidden ai-generator-card">
      <Card.Header className="bg-gradient-coral text-white p-4">
        <h4 className="fw-bold mb-1">
          <i className="bi bi-robot me-2"></i>AI Trip Recommendation Generator
        </h4>
        <p className="mb-0 small text-light opacity-90">
          Tell us your ideal vibe and destination — our Quest AI algorithm will generate a custom day-by-day itinerary instantly.
        </p>
      </Card.Header>
      <Card.Body className="p-4 text-start">
        <Form onSubmit={handleGenerate} className="row g-3">
          <div className="col-md-4">
            <Form.Label className="fw-bold small">Destination</Form.Label>
            <Form.Select value={destination} onChange={(e) => setDestination(e.target.value)}>
              <option value="Rome">Rome, Italy</option>
              <option value="Paris">Paris, France</option>
              <option value="Rajasthan">Rajasthan, India</option>
              <option value="Bali">Bali, Indonesia</option>
              <option value="London">London, UK</option>
              <option value="Tokyo">Tokyo, Japan</option>
            </Form.Select>
          </div>

          <div className="col-md-4">
            <Form.Label className="fw-bold small">Travel Vibe</Form.Label>
            <Form.Select value={vibe} onChange={(e) => setVibe(e.target.value)}>
              <option value="Romantic">Romantic & Honeymoon</option>
              <option value="Adventure">Outdoor & Adventure</option>
              <option value="Budget-Friendly">Budget-Friendly Explorer</option>
              <option value="Family">Family Vacation</option>
              <option value="Luxury">High-End Luxury</option>
            </Form.Select>
          </div>

          <div className="col-md-4">
            <Form.Label className="fw-bold small">Trip Duration</Form.Label>
            <Form.Select value={days} onChange={(e) => setDays(e.target.value)}>
              <option value="3">3 Days Getaway</option>
              <option value="5">5 Days Full Tour</option>
              <option value="7">7 Days Deep Experience</option>
            </Form.Select>
          </div>

          <div className="col-12 mt-4">
            <Button variant="coral" type="submit" disabled={loading} className="btn-coral w-100 py-3 fw-bold text-uppercase">
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" /> Quest AI Generating Itinerary...
                </>
              ) : (
                <><i className="bi bi-stars me-2"></i>Generate Quest AI Itinerary</>
              )}
            </Button>
          </div>
        </Form>

        {generatedResult && (
          <div className="mt-4 pt-4 border-top">
            <Alert variant="danger" className="bg-danger bg-opacity-10 text-dark border-0 d-flex justify-content-between align-items-center">
              <div>
                <h5 className="alert-heading fw-bold mb-1">
                  <i className="bi bi-check-circle-fill text-danger me-2"></i>AI Plan Generated!
                </h5>
                <p className="mb-0 small">{generatedResult.title} ({generatedResult.days.length} Days)</p>
              </div>
              <Button variant="coral" onClick={handleClone} className="btn-coral fw-bold px-4">
                <i className="bi bi-journal-plus me-1"></i>Clone To My Planner
              </Button>
            </Alert>

            <div className="row g-3 mt-2">
              {generatedResult.days.map((day) => (
                <div key={day.dayNumber} className="col-md-4">
                  <div className="bg-light p-3 rounded-4 border">
                    <h6 className="fw-bold text-dark">Day {day.dayNumber}: {day.title}</h6>
                    <ul className="list-unstyled small text-muted mb-0">
                      {day.activities.map((act) => (
                        <li key={act.id} className="mb-1">
                          • <strong>{act.time}</strong>: {act.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default AITripGenerator;
