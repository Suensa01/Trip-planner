import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useTrip } from '../../Context/TripContext';
import { useToast } from '../../Context/ToastContext';

const mockForecast = [
  { day: 'Thu 10', temp: '26°C', icon: 'bi-sun-fill text-warning', condition: 'Sunny & Clear', humidity: '45%' },
  { day: 'Fri 11', temp: '27°C', icon: 'bi-cloud-sun-fill text-warning', condition: 'Partly Cloudy', humidity: '50%' },
  { day: 'Sat 12', temp: '24°C', icon: 'bi-cloud-rain-fill text-primary', condition: 'Light Showers', humidity: '68%' },
  { day: 'Sun 13', temp: '25°C', icon: 'bi-sun-fill text-warning', condition: 'Clear Sky', humidity: '42%' },
  { day: 'Mon 14', temp: '28°C', icon: 'bi-sun-fill text-warning', condition: 'Sunny Day', humidity: '40%' }
];

function WeatherChecklist() {
  const { activeTrip, togglePackingItem, addPackingItem } = useTrip();
  const { showToast } = useToast();
  const [newItemText, setNewItemText] = useState('');
  const [newCategory, setNewCategory] = useState('Essentials');

  const items = activeTrip?.packingList || [];
  const completedCount = items.filter(i => i.completed).length;
  const progressPercent = items.length ? Math.round((completedCount / items.length) * 100) : 0;

  const handleAddChecklist = (e) => {
    e.preventDefault();
    if (!activeTrip) {
      showToast('No Active Trip', 'Please create or select an active trip first.', 'warning', 'bi-exclamation-circle');
      return;
    }

    if (newItemText.trim()) {
      addPackingItem(newItemText.trim(), newCategory);
      showToast('Item Added!', `Added "${newItemText.trim()}" to packing checklist.`, 'info', 'bi-check2-square');
      setNewItemText('');
    }
  };

  return (
    <div className="weather-checklist-section row g-4 mb-4">
      {/* Destination Weather Forecast Widget */}
      <div className="col-lg-5">
        <Card className="card-trippoo shadow-sm border-0 rounded-4 text-start h-100">
          <Card.Header className="bg-dark text-white p-3">
            <h5 className="fw-bold mb-0">
              <i className="bi bi-cloud-sun-fill text-warning me-2"></i>Destination Weather Forecast
            </h5>
            <small className="text-secondary">{activeTrip?.destination || 'Your Selected Destination'}</small>
          </Card.Header>
          <Card.Body className="p-4 d-flex flex-column justify-content-between">
            <div className="d-flex align-items-center justify-content-between mb-4 bg-light p-3 rounded-4">
              <div>
                <i className="bi bi-sun-fill text-warning fs-1"></i>
                <span className="display-5 fw-bold text-dark ms-2">26°C</span>
              </div>
              <div className="text-end">
                <h6 className="fw-bold text-dark mb-0">Sunny & Clear</h6>
                <small className="text-muted">Humidity: 45% • Wind: 12 km/h</small>
              </div>
            </div>

            <div>
              <h6 className="fw-bold text-dark mb-2">5-Day Travel Outlook</h6>
              <div className="d-flex justify-content-between text-center gap-1">
                {mockForecast.map((f, i) => (
                  <div key={i} className="bg-light p-2 rounded-4 flex-fill border">
                    <small className="fw-bold text-muted d-block mb-1">{f.day}</small>
                    <div className="fs-5 mb-1"><i className={`bi ${f.icon}`}></i></div>
                    <strong className="d-block small text-dark">{f.temp}</strong>
                  </div>
                ))}
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Interactive Packing List & Pre-Trip Checklist */}
      <div className="col-lg-7">
        <Card className="card-trippoo shadow-sm border-0 rounded-4 text-start h-100">
          <Card.Header className="bg-dark text-white p-3 d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0">
              <i className="bi bi-check2-square text-coral me-2"></i>Packing List & Pre-Trip To-Dos
            </h5>
            <Badge bg="coral" className="btn-coral fs-6">{completedCount}/{items.length} Done</Badge>
          </Card.Header>
          <Card.Body className="p-4">
            <div className="mb-3">
              <div className="d-flex justify-content-between small fw-bold mb-1">
                <span>Checklist Completion</span>
                <span>{progressPercent}%</span>
              </div>
              <ProgressBar now={progressPercent} variant="danger" style={{ height: '8px' }} />
            </div>

            <Form onSubmit={handleAddChecklist} className="row g-2 mb-3">
              <div className="col-md-7">
                <Form.Control 
                  type="text" 
                  placeholder="Add item (e.g. Travel adapter, Passport)..." 
                  value={newItemText} 
                  onChange={(e) => setNewItemText(e.target.value)} 
                />
              </div>
              <div className="col-md-3">
                <Form.Select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                  <option value="Essentials">Essentials</option>
                  <option value="Documents">Documents</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Health">Health</option>
                </Form.Select>
              </div>
              <div className="col-md-2">
                <Button variant="coral" type="submit" className="btn-coral w-100 fw-bold">+</Button>
              </div>
            </Form>

            {items.length === 0 ? (
              <div className="text-center py-4 bg-light rounded-3 text-muted">
                <i className="bi bi-check2-square fs-3 opacity-50 d-block mb-1"></i>
                <span className="small">Your packing list is empty. Add your essential travel items above!</span>
              </div>
            ) : (
              <ul className="list-group max-h-240 overflow-auto border rounded-4">
                {items.map((item) => (
                  <li 
                    key={item.id} 
                    className={`list-group-item d-flex justify-content-between align-items-center ${item.completed ? 'bg-light text-muted' : ''}`}
                    onClick={() => togglePackingItem(item.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <Form.Check 
                        type="checkbox" 
                        checked={item.completed} 
                        onChange={() => {}} 
                      />
                      <span className={item.completed ? 'text-decoration-line-through' : 'fw-medium'}>
                        {item.text}
                      </span>
                    </div>
                    <Badge bg="secondary">{item.category}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default WeatherChecklist;
