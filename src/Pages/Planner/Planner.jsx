import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import { useTrip } from '../../Context/TripContext';
import PlannerTimeline from '../../Components/Planner/PlannerTimeline';
import InteractiveMap from '../../Components/Planner/InteractiveMap';
import CollaborationModal from '../../Components/Planner/CollaborationModal';
import './Planner.css';

function Planner() {
  const { activeTrip, loading, createCustomTrip } = useTrip();
  const [selectedDay, setSelectedDay] = useState(1);
  const [showCollabModal, setShowCollabModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Trip Form State
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budgetLimit, setBudgetLimit] = useState(3000);
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80');

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    await createCustomTrip({
      title: title || `${destination || 'Travel'} Getaway`,
      destination: destination || 'Paris, France',
      startDate: startDate || '2026-10-01',
      endDate: endDate || '2026-10-06',
      budgetLimit: Number(budgetLimit) || 3000,
      coverImage
    });
    setShowCreateModal(false);
  };

  if (loading) {
    return (
      <div className="planner-page py-5 text-center" style={{ paddingTop: '120px' }}>
        <Spinner animation="border" variant="coral" />
        <p className="text-muted small mt-2">Loading your trip from Supabase database...</p>
      </div>
    );
  }

  // If user has no active trip yet, show "Create Your First Custom Travel Plan" Empty State
  if (!activeTrip) {
    return (
      <div className="planner-page pb-5 text-start" style={{ paddingTop: '100px', backgroundColor: '#f8fafc', minHeight: '80vh' }}>
        <Container>
          <Card className="shadow border-0 rounded-4 p-4 p-md-5 text-center bg-white my-4">
            <div className="mx-auto bg-light rounded-circle p-4 mb-3" style={{ width: '90px', height: '90px' }}>
              <i className="bi bi-compass-fill text-coral display-5"></i>
            </div>
            <h2 className="fw-bold text-dark mb-2">No Active Travel Plan Yet!</h2>
            <p className="text-muted mx-auto mb-4" style={{ maxWidth: '540px' }}>
              Welcome to your personal trip planner! Start from a blank slate by adding your own customized destination, dates, budget limit, and daily activities.
            </p>
            
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Button 
                variant="coral" 
                size="lg" 
                className="btn-coral px-4 py-2 fw-bold shadow-sm"
                onClick={() => setShowCreateModal(true)}
              >
                <i className="bi bi-plus-circle-fill me-2"></i>Create New Travel Plan
              </Button>
              <Button 
                variant="outline-secondary" 
                size="lg" 
                className="px-4 py-2 fw-semibold"
                href="/explore"
              >
                <i className="bi bi-magic me-2"></i>Generate with Discovery AI
              </Button>
            </div>
          </Card>

          {/* Create New Trip Modal */}
          <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered size="lg">
            <Modal.Header closeButton className="border-0 pb-0">
              <Modal.Title className="fw-bold">
                <i className="bi bi-map-fill text-coral me-2"></i>Design Your Customized Travel Plan
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-3">
              <Form onSubmit={handleCreateSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-bold">Trip Title</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="e.g., Summer in Amalfi & Rome"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-bold">Destination</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="e.g., Tokyo, Japan"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="small fw-bold">Start Date</Form.Label>
                      <Form.Control 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="small fw-bold">End Date</Form.Label>
                      <Form.Control 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="small fw-bold">Budget Limit ($)</Form.Label>
                      <Form.Control 
                        type="number" 
                        placeholder="3000"
                        value={budgetLimit}
                        onChange={(e) => setBudgetLimit(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="small fw-bold">Cover Photo Preset</Form.Label>
                      <div className="d-flex gap-2 flex-wrap">
                        {[
                          { name: 'Paris', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80' },
                          { name: 'Tokyo', url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80' },
                          { name: 'Rome', url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80' },
                          { name: 'Beach', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' }
                        ].map((preset) => (
                          <Button 
                            key={preset.name}
                            variant={coverImage === preset.url ? 'coral' : 'outline-secondary'}
                            size="sm"
                            onClick={() => setCoverImage(preset.url)}
                          >
                            {preset.name}
                          </Button>
                        ))}
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="mt-4 text-end">
                  <Button variant="light" className="me-2" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                  <Button variant="coral" type="submit" className="btn-coral fw-bold px-4">Create Trip Plan</Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>
        </Container>
      </div>
    );
  }

  const daysList = activeTrip.days || [];
  const activeDayObj = daysList.find((d) => d.dayNumber === selectedDay) || daysList[0] || { dayNumber: 1, title: 'Day 1', activities: [] };
  const dayActivities = activeDayObj?.activities || [];

  const totalCost = daysList.reduce(
    (sum, day) => sum + (day.activities || []).reduce((dSum, act) => dSum + (act.price || 0), 0),
    0
  );

  return (
    <div className="planner-page pb-5 text-start">
      <Container>
        {/* Trip Banner Header */}
        <div 
          className="planner-hero-header shadow-sm mb-4 p-4 text-white" 
          style={{ backgroundImage: `url(${activeTrip.coverImage})` }}
        >
          <div className="planner-hero-overlay"></div>
          <div className="position-relative z-2 w-100 d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3">
            <div>
              <Badge bg="coral" className="btn-coral mb-2 px-3 py-2 text-uppercase">
                <i className="bi bi-calendar-event me-1"></i>{activeTrip.startDate} – {activeTrip.endDate}
              </Badge>
              <h2 className="fw-bold mb-1 display-6">{activeTrip.title}</h2>
              <p className="mb-0 text-light opacity-90 small">
                <i className="bi bi-geo-alt-fill text-coral me-1"></i>Destination: <strong>{activeTrip.destination}</strong>
              </p>
            </div>
            
            <div className="d-flex gap-2">
              <Button 
                variant="light" 
                className="fw-bold text-nowrap shadow-sm btn-pill-light"
                onClick={() => setShowCollabModal(true)}
              >
                <i className="bi bi-people-fill text-coral me-1"></i>Collaborate
              </Button>
              <Button 
                variant="coral" 
                className="btn-coral fw-bold text-nowrap"
                onClick={() => window.print()}
              >
                <i className="bi bi-printer-fill me-1"></i>Export PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <Row className="mb-4 g-3">
          <Col md={3} sm={6}>
            <div className="bg-white p-3 rounded-4 shadow-sm border text-start">
              <span className="text-muted small">Total Days</span>
              <h4 className="fw-bold text-dark mb-0">{daysList.length} Days</h4>
            </div>
          </Col>
          <Col md={3} sm={6}>
            <div className="bg-white p-3 rounded-4 shadow-sm border text-start">
              <span className="text-muted small">Planned Events</span>
              <h4 className="fw-bold text-dark mb-0">
                {daysList.reduce((acc, d) => acc + (d.activities ? d.activities.length : 0), 0)} Items
              </h4>
            </div>
          </Col>
          <Col md={3} sm={6}>
            <div className="bg-white p-3 rounded-4 shadow-sm border text-start">
              <span className="text-muted small">Total Estimated Cost</span>
              <h4 className="fw-bold text-coral mb-0">${totalCost}</h4>
            </div>
          </Col>
          <Col md={3} sm={6}>
            <div className="bg-white p-3 rounded-4 shadow-sm border text-start">
              <span className="text-muted small">Budget Status</span>
              <h4 className={`fw-bold mb-0 ${totalCost > activeTrip.budgetLimit ? 'text-danger' : 'text-primary'}`}>
                ${(activeTrip.budgetLimit || 2500) - totalCost} Left
              </h4>
            </div>
          </Col>
        </Row>

        {/* Main Studio View: Timeline + Route Map */}
        <Row className="g-4">
          <Col lg={7}>
            <div className="bg-white p-4 rounded-4 shadow-sm border text-start">
              <PlannerTimeline selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
            </div>
          </Col>
          
          <Col lg={5}>
            <div className="sticky-top" style={{ top: '100px' }}>
              <InteractiveMap activities={dayActivities} activeDayTitle={`Day ${selectedDay}: ${activeDayObj?.title}`} />
            </div>
          </Col>
        </Row>
      </Container>

      {/* Real-Time Collaboration Modal */}
      <CollaborationModal show={showCollabModal} onHide={() => setShowCollabModal(false)} />
    </div>
  );
}

export default Planner;
