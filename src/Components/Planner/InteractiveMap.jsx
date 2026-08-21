import React, { useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import './InteractiveMap.css';

function InteractiveMap({ activities = [], activeDayTitle }) {
  const [selectedPin, setSelectedPin] = useState(null);

  const pins = activities.filter(a => a.lat && a.lng);

  return (
    <Card className="shadow-sm border-0 overflow-hidden interactive-map-card card-trippoo">
      <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center py-3">
        <div>
          <h6 className="fw-bold mb-0">
            <i className="bi bi-map-fill text-coral me-2"></i>Route Map & Transit Estimator
          </h6>
          <small className="text-secondary">{activeDayTitle || 'Day View'}</small>
        </div>
        <Badge bg="coral" className="btn-coral px-3 py-2">
          {pins.length} Locations Pinned
        </Badge>
      </Card.Header>
      <Card.Body className="p-0 position-relative map-viewport">
        {/* Interactive Simulated Map Tile Workspace */}
        <div className="simulated-map-canvas d-flex flex-column align-items-center justify-content-center">
          <div className="map-grid-overlay"></div>
          
          {/* Connecting Route Paths */}
          <svg className="route-lines-svg position-absolute w-100 h-100" style={{ pointerEvents: 'none' }}>
            {pins.map((pin, idx) => {
              if (idx === pins.length - 1) return null;
              const x1 = 15 + (idx * 28) % 70;
              const y1 = 25 + (idx * 22) % 60;
              const x2 = 15 + ((idx + 1) * 28) % 70;
              const y2 = 25 + ((idx + 1) * 22) % 60;

              return (
                <g key={`path-${idx}`}>
                  <line 
                    x1={`${x1}%`} 
                    y1={`${y1}%`} 
                    x2={`${x2}%`} 
                    y2={`${y2}%`} 
                    stroke="#ff385c" 
                    strokeWidth="3" 
                    strokeDasharray="6,6"
                  />
                  <text 
                    x={`${(x1 + x2) / 2}%`} 
                    y={`${(y1 + y2) / 2 - 2}%`} 
                    fill="#0f172a" 
                    fontSize="11" 
                    fontWeight="bold"
                    textAnchor="middle"
                    className="bg-white px-1"
                  >
                    ~18 min (4.2 km)
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Location Pins */}
          {pins.map((pin, idx) => {
            const posX = 15 + (idx * 28) % 70;
            const posY = 25 + (idx * 22) % 60;
            const isSelected = selectedPin?.id === pin.id;

            return (
              <div
                key={pin.id}
                className={`map-pin-marker position-absolute ${isSelected ? 'active-pin' : ''}`}
                style={{ left: `${posX}%`, top: `${posY}%` }}
                onClick={() => setSelectedPin(pin)}
              >
                <div className="pin-bubble shadow">
                  <span className="pin-number">{idx + 1}</span>
                  <span className="pin-title text-truncate">{pin.title}</span>
                </div>
                <div className="pin-icon text-danger">
                  <i className="bi bi-geo-alt-fill fs-5"></i>
                </div>
              </div>
            );
          })}

          {!pins.length && (
            <div className="text-muted text-center p-4">
              <h6>No location pins for this day yet</h6>
              <p className="small mb-0">Add activities with addresses to see distance & smart route suggestions.</p>
            </div>
          )}
        </div>

        {/* Selected Pin Details Overlay */}
        {selectedPin && (
          <div className="selected-pin-modal bg-white shadow p-3 rounded-4 border position-absolute bottom-0 start-0 m-3 max-w-300 text-start">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h6 className="fw-bold mb-0 text-truncate me-2">{selectedPin.title}</h6>
              <Button variant="link" className="p-0 text-muted fs-6" onClick={() => setSelectedPin(null)}>
                <i className="bi bi-x-lg"></i>
              </Button>
            </div>
            <p className="small text-muted mb-2">
              <i className="bi bi-geo-alt-fill text-danger me-1"></i>{selectedPin.location}
            </p>
            <div className="d-flex justify-content-between align-items-center small">
              <Badge bg="light" text="dark" className="border">
                <i className="bi bi-clock me-1"></i>{selectedPin.time}
              </Badge>
              <span className="fw-bold text-coral">${selectedPin.price}</span>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default InteractiveMap;
