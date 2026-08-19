import React, { useState } from 'react';
import './SearchForm.css';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function SearchForm({ onSearchSubmit }) {
    const [activeSearchTab, setActiveSearchTab] = useState('tour');
    const [place, setPlace] = useState('Zurich, Switzerland');
    const [checkIn, setCheckIn] = useState('2026-12-04');
    const [checkOut, setCheckOut] = useState('2026-12-04');
    const [travelers, setTravelers] = useState('2 Couples');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearchSubmit) {
            onSearchSubmit({ place, travelers, checkIn, checkOut, type: activeSearchTab });
        }
    };

    return (
        <div className='floating-search-container'>
            <Container>
                <div className='floating-search-card'>
                    {/* Top Tab Row */}
                    <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom overflow-auto">
                        <div 
                            className={`search-tab-item ${activeSearchTab === 'tour' ? 'active' : ''}`}
                            onClick={() => setActiveSearchTab('tour')}
                        >
                            <i className="bi bi-compass-fill me-2"></i>Tour & Guides
                        </div>
                        <div 
                            className={`search-tab-item ${activeSearchTab === 'flight' ? 'active' : ''}`}
                            onClick={() => setActiveSearchTab('flight')}
                        >
                            <i className="bi bi-airplane-fill me-2"></i>Flight
                        </div>
                        <div 
                            className={`search-tab-item ${activeSearchTab === 'restaurant' ? 'active' : ''}`}
                            onClick={() => setActiveSearchTab('restaurant')}
                        >
                            <i className="bi bi-cup-hot-fill me-2"></i>Restaurant
                        </div>
                        <div 
                            className={`search-tab-item ${activeSearchTab === 'hotel' ? 'active' : ''}`}
                            onClick={() => setActiveSearchTab('hotel')}
                        >
                            <i className="bi bi-building-fill me-2"></i>Hotel
                        </div>
                    </div>

                    {/* Search Form Fields Row */}
                    <Form onSubmit={handleSubmit} className="row g-3 align-items-center text-start">
                        <div className="col-lg-3 col-md-6">
                            <div className="search-input-box">
                                <label><i className="bi bi-geo-alt-fill text-danger me-1"></i>Location</label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Where to go?" 
                                    value={place} 
                                    onChange={(e) => setPlace(e.target.value)} 
                                />
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6">
                            <div className="search-input-box">
                                <label><i className="bi bi-calendar-event me-1"></i>Check in</label>
                                <Form.Control 
                                    type="date" 
                                    value={checkIn} 
                                    onChange={(e) => setCheckIn(e.target.value)} 
                                />
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6">
                            <div className="search-input-box">
                                <label><i className="bi bi-calendar-check me-1"></i>Check out</label>
                                <Form.Control 
                                    type="date" 
                                    value={checkOut} 
                                    onChange={(e) => setCheckOut(e.target.value)} 
                                />
                            </div>
                        </div>

                        <div className="col-lg-2 col-md-6">
                            <div className="search-input-box">
                                <label><i className="bi bi-people-fill me-1"></i>Travelers</label>
                                <Form.Select value={travelers} onChange={(e) => setTravelers(e.target.value)}>
                                    <option value="1 Solo">1 Solo Explorer</option>
                                    <option value="2 Couples">2 Couples / Guests</option>
                                    <option value="4 Family">4 Family Members</option>
                                    <option value="6+ Group">6+ Group Travelers</option>
                                </Form.Select>
                            </div>
                        </div>

                        <div className="col-lg-1 col-md-12 text-center text-lg-end">
                            <Button variant="coral" type="submit" className="btn-coral search-btn-pill w-100 d-flex align-items-center justify-content-center">
                                <i className="bi bi-search fs-5"></i>
                            </Button>
                        </div>
                    </Form>
                </div>
            </Container>
        </div>
    );
}

export default SearchForm;