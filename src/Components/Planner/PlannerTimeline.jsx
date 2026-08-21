import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Badge from 'react-bootstrap/Badge';
import { useTrip } from '../../Context/TripContext';
import { useToast } from '../../Context/ToastContext';
import './PlannerTimeline.css';

function PlannerTimeline({ selectedDay, setSelectedDay }) {
  const { activeTrip, addActivity, removeActivity, addDay } = useTrip();
  const { showToast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);

  const [title, setTitle] = useState('');
  const [type, setType] = useState('activity');
  const [time, setTime] = useState('10:00 AM');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');

  const currentDayObj = activeTrip.days.find((d) => d.dayNumber === selectedDay) || activeTrip.days[0];

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (title && location) {
      addActivity(selectedDay, {
        title,
        type,
        time,
        location,
        price: Number(price) || 0,
        notes,
        lat: 41.89 + (Math.random() * 0.05 - 0.025),
        lng: 12.48 + (Math.random() * 0.05 - 0.025)
      });
      showToast('Activity Added!', `Added "${title}" to Day ${selectedDay} itinerary.`, 'success', 'bi-plus-circle-fill');
      setTitle('');
      setLocation('');
      setPrice('');
      setNotes('');
      setShowAddModal(false);
    }
  };

  const handleRemove = (actId, actTitle) => {
    removeActivity(selectedDay, actId);
    showToast('Activity Removed', `Removed "${actTitle || 'Item'}" from Day ${selectedDay}.`, 'danger', 'bi-trash-fill');
  };

  const handleAddNewDay = () => {
    addDay();
    const newDayNum = activeTrip.days.length + 1;
    setSelectedDay(newDayNum);
    showToast('New Day Added!', `Day ${newDayNum} added to trip itinerary.`, 'info', 'bi-calendar-plus');
  };

  const renderTypeIcon = (actType) => {
    switch (actType) {
      case 'flight': return <i className="bi bi-airplane-fill text-info"></i>;
      case 'hotel': return <i className="bi bi-building-fill text-primary"></i>;
      case 'food': return <i className="bi bi-cup-hot-fill text-warning"></i>;
      default: return <i className="bi bi-compass-fill text-coral"></i>;
    }
  };

  return (
    <div className="planner-timeline">
      {/* Day Selector Navigation Tabs */}
      <div className="d-flex align-items-center gap-2 overflow-auto pb-3 mb-3 border-bottom">
        {activeTrip.days.map((day) => (
          <Button
            key={day.dayNumber}
            variant={selectedDay === day.dayNumber ? 'coral' : 'outline-secondary'}
            className={`fw-bold px-3 py-2 text-nowrap rounded-pill ${selectedDay === day.dayNumber ? 'btn-coral' : ''}`}
            onClick={() => setSelectedDay(day.dayNumber)}
          >
            Day {day.dayNumber} <small className="fw-normal opacity-75">({day.date})</small>
          </Button>
        ))}
        <Button variant="outline-coral" className="btn-outline-coral fw-bold rounded-pill text-nowrap" onClick={handleAddNewDay}>
          + Add Day
        </Button>
      </div>

      {/* Current Day Title Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">
            Day {currentDayObj?.dayNumber}: {currentDayObj?.title}
          </h4>
          <span className="text-muted small">
            {currentDayObj?.activities?.length || 0} scheduled events for this day
          </span>
        </div>
        <Button variant="coral" className="btn-coral px-4 fw-bold" onClick={() => setShowAddModal(true)}>
          + Add Activity
        </Button>
      </div>

      {/* Timeline Items List */}
      <div className="timeline-items-container ps-3">
        {currentDayObj?.activities?.map((item, idx) => (
          <div key={item.id} className="timeline-item position-relative mb-4">
            <div className="timeline-node shadow-sm">
              <span>{renderTypeIcon(item.type)}</span>
            </div>
            
            <Card className="card-trippoo timeline-card shadow-sm border-0 border-start border-4 border-danger ms-4">
              <Card.Body className="p-3 text-start">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <span className="badge bg-light text-dark border me-2">
                      <i className="bi bi-clock me-1"></i>{item.time}
                    </span>
                    <Badge bg={item.type === 'flight' ? 'info' : item.type === 'hotel' ? 'primary' : 'danger'}>
                      {item.type.toUpperCase()}
                    </Badge>
                  </div>
                  <Button 
                    variant="link" 
                    className="text-danger p-0 text-decoration-none small"
                    onClick={() => handleRemove(item.id, item.title)}
                    title="Remove Activity"
                  >
                    <i className="bi bi-trash-fill"></i>
                  </Button>
                </div>

                <h5 className="fw-bold text-dark mb-1">{item.title}</h5>
                <p className="small text-muted mb-2">
                  <i className="bi bi-geo-alt-fill text-danger me-1"></i>{item.location}
                </p>

                {item.notes && (
                  <p className="bg-light p-2 rounded small text-secondary mb-2">
                    <i className="bi bi-info-circle me-1 text-primary"></i><em>{item.notes}</em>
                  </p>
                )}

                <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                  <span className="small text-muted">Estimated Cost:</span>
                  <span className="fw-bold text-coral fs-6">${item.price}</span>
                </div>
              </Card.Body>
            </Card>

            {/* Smart Transit Suggestion between items */}
            {idx < currentDayObj.activities.length - 1 && (
              <div className="transit-indicator ms-5 my-2 ps-3 py-1 border-start border-2 border-dashed border-secondary small text-muted text-start">
                <i className="bi bi-car-front-fill me-1 text-secondary"></i>Smart Transit: ~15 mins via taxi / metro (2.8 km)
              </div>
            )}
          </div>
        ))}

        {!currentDayObj?.activities?.length && (
          <div className="text-center py-5 bg-light rounded border border-dashed">
            <h5 className="text-muted">No activities added for Day {selectedDay} yet</h5>
            <p className="small text-secondary mb-3">Start building your itinerary by clicking below.</p>
            <Button variant="coral" className="btn-coral fw-bold" onClick={() => setShowAddModal(true)}>
              + Add First Activity
            </Button>
          </div>
        )}
      </div>

      {/* Add Activity Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Add Activity to Day {selectedDay}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-start">
          <Form onSubmit={handleAddSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Activity Title</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="e.g. Colosseum Tour or Lunch at Trastevere" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
            </Form.Group>

            <div className="row g-2 mb-3">
              <div className="col-6">
                <Form.Label className="small fw-bold">Type</Form.Label>
                <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="activity">Tour / Sightseeing</option>
                  <option value="flight">Flight / Transit</option>
                  <option value="hotel">Hotel / Lodging</option>
                  <option value="food">Restaurant / Food</option>
                </Form.Select>
              </div>
              <div className="col-6">
                <Form.Label className="small fw-bold">Scheduled Time</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="e.g. 10:30 AM" 
                  value={time} 
                  onChange={(e) => setTime(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Location / Address</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="e.g. Piazza del Colosseo, Rome" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Estimated Cost ($ per person)</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="e.g. 45" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Notes / Booking Codes</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={2} 
                placeholder="Ticket confirmation number or notes" 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
              />
            </Form.Group>

            <Button variant="coral" type="submit" className="btn-coral w-100 py-2 fw-bold text-uppercase">
              Add To Itinerary
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default PlannerTimeline;
