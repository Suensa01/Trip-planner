import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import { useTrip } from '../../Context/TripContext';
import PlannerTimeline from '../../Components/Planner/PlannerTimeline';
import InteractiveMap from '../../Components/Planner/InteractiveMap';
import CollaborationModal from '../../Components/Planner/CollaborationModal';
import './Planner.css';

function Planner() {
  const { activeTrip } = useTrip();
  const [selectedDay, setSelectedDay] = useState(1);
  const [showCollabModal, setShowCollabModal] = useState(false);

  const activeDayObj = activeTrip.days.find((d) => d.dayNumber === selectedDay) || activeTrip.days[0];
  const dayActivities = activeDayObj?.activities || [];

  const totalCost = activeTrip.days.reduce(
    (sum, day) => sum + day.activities.reduce((dSum, act) => dSum + (act.price || 0), 0),
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
                <i className="bi bi-geo-alt-fill text-coral me-1"></i>Destination: <strong>{activeTrip.destination}</strong> • {activeTrip.travelers.length} Travelers
              </p>
            </div>
            
            <div className="d-flex gap-2">
              <Button 
                variant="light" 
                className="fw-bold text-nowrap shadow-sm btn-pill-light"
                onClick={() => setShowCollabModal(true)}
              >
                <i className="bi bi-people-fill text-coral me-1"></i>Collaborate ({activeTrip.collaborators?.length + 1 || 1})
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
              <h4 className="fw-bold text-dark mb-0">{activeTrip.days.length} Days</h4>
            </div>
          </Col>
          <Col md={3} sm={6}>
            <div className="bg-white p-3 rounded-4 shadow-sm border text-start">
              <span className="text-muted small">Planned Events</span>
              <h4 className="fw-bold text-dark mb-0">
                {activeTrip.days.reduce((acc, d) => acc + d.activities.length, 0)} Items
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
                ${activeTrip.budgetLimit - totalCost} Left
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
