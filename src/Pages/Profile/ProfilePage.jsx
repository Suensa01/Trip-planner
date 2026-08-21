import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import Alert from 'react-bootstrap/Alert';
import { useAuth } from '../../Context/AuthContext';
import { useTrip } from '../../Context/TripContext';
import { useToast } from '../../Context/ToastContext';

function ProfilePage() {
  const { user } = useAuth();
  const { activeTrip } = useTrip();
  const { showToast } = useToast();

  const [dietary, setDietary] = useState('Vegetarian');
  const [seat, setSeat] = useState('Window');
  const [currency, setCurrency] = useState('USD ($)');
  const [savedSuccess, setSavedSuccess] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);

  const handleSavePref = (e) => {
    e.preventDefault();
    setSavedSuccess('Travel preferences updated successfully!');
    showToast('Preferences Saved!', 'Updated dietary, seating, and currency preferences.', 'success', 'bi-gear-fill');
    setTimeout(() => setSavedSuccess(''), 3000);
  };

  const shareText = `Check out my trip itinerary to ${activeTrip.destination}: ${activeTrip.title} on Quest Travel! https://quest-travel.app/trip/${activeTrip.id}`;

  const handleWhatsAppShare = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleEmailShare = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(activeTrip.title)}&body=${encodeURIComponent(shareText)}`;
  };

  const handleCopyShare = () => {
    navigator.clipboard.writeText(shareText);
    setCopiedShare(true);
    showToast('Link Copied!', 'Trip itinerary share link copied to clipboard.', 'info', 'bi-link-45deg');
    setTimeout(() => setCopiedShare(false), 3000);
  };

  return (
    <div className="profile-page pb-5 text-start" style={{ paddingTop: '90px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Container>
        {/* User Banner Header */}
        <Card className="shadow-sm border-0 rounded-4 overflow-hidden mb-4 bg-dark text-white p-4">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3">
              <img 
                src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=28a745&color=fff'} 
                alt="Avatar" 
                className="rounded-circle border border-3 border-success" 
                style={{ width: '72px', height: '72px' }}
              />
              <div>
                <h3 className="fw-bold mb-1">{user?.name || 'Alex Traveler'}</h3>
                <p className="mb-0 text-light opacity-75 small">{user?.email || 'alex@example.com'} • Quest Frequent Explorer</p>
              </div>
            </div>
            <div className="d-flex gap-2">
              <Badge bg="success" className="px-3 py-2 fs-6">Pro Explorer</Badge>
            </div>
          </div>
        </Card>

        <Row className="g-4">
          {/* Travel Preferences Form */}
          <Col lg={6}>
            <Card className="shadow-sm border-0 rounded-4 p-3 h-100">
              <Card.Body>
                <h5 className="fw-bold text-dark mb-3">⚙️ Travel Preferences & Settings</h5>
                {savedSuccess && <Alert variant="success" className="py-2 small">{savedSuccess}</Alert>}

                <Form onSubmit={handleSavePref}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Dietary Restrictions</Form.Label>
                    <Form.Select value={dietary} onChange={(e) => setDietary(e.target.value)}>
                      <option value="None">No Dietary Restrictions</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Vegan">Vegan</option>
                      <option value="Gluten-Free">Gluten-Free</option>
                      <option value="Halal">Halal</option>
                      <option value="Kosher">Kosher</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Preferred Flight Seat</Form.Label>
                    <Form.Select value={seat} onChange={(e) => setSeat(e.target.value)}>
                      <option value="Window">Window Seat</option>
                      <option value="Aisle">Aisle Seat</option>
                      <option value="Extra Legroom">Extra Legroom</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="small fw-bold">Home Display Currency</Form.Label>
                    <Form.Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                      <option value="USD ($)">USD ($) - US Dollar</option>
                      <option value="EUR (€)">EUR (€) - Euro</option>
                      <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                      <option value="GBP (£)">GBP (£) - British Pound</option>
                    </Form.Select>
                  </Form.Group>

                  <Button variant="success" type="submit" className="w-100 fw-bold">
                    Save Preferences
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Social Sharing & Public Export */}
          <Col lg={6}>
            <Card className="shadow-sm border-0 rounded-4 p-3 h-100">
              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <h5 className="fw-bold text-dark mb-3">📲 Social Sharing & Public Export</h5>
                  <p className="small text-muted mb-4">
                    Share your completed trip itinerary with friends, family, or social followers instantly.
                  </p>

                  <div className="bg-light p-3 rounded mb-4 border">
                    <label className="fw-bold small mb-1">Public Shareable Link</label>
                    <div className="d-flex gap-2">
                      <Form.Control type="text" readOnly value={`https://quest-travel.app/trip/${activeTrip.id}`} />
                      <Button variant={copiedShare ? 'success' : 'dark'} onClick={handleCopyShare} className="fw-bold text-nowrap">
                        {copiedShare ? '✓ Copied' : 'Copy'}
                      </Button>
                    </div>
                  </div>

                  <div className="d-flex flex-column gap-2 mb-4">
                    <Button variant="outline-success" className="fw-bold text-start py-2" onClick={handleWhatsAppShare}>
                      💬 Share via WhatsApp
                    </Button>
                    <Button variant="outline-primary" className="fw-bold text-start py-2" onClick={handleEmailShare}>
                      ✉️ Share via Email
                    </Button>
                    <Button variant="outline-dark" className="fw-bold text-start py-2" onClick={() => window.print()}>
                      📱 Export Offline PDF / Ticket Summary
                    </Button>
                  </div>
                </div>

                <div className="pt-3 border-top">
                  <h6 className="fw-bold text-dark mb-2">Public Trip Reviews & Ratings</h6>
                  <p className="small text-muted mb-0">
                    Your active trip is set to <strong>Public</strong>. Other travelers can view and rate your curated itinerary.
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ProfilePage;
