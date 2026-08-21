import React from 'react';
import './NavigationBar.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { useWishlist } from '../../Context/WishlistContext';

function NavigationBar() {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const { count } = useWishlist();

    return (
        <Navbar expand='xl' className='position-absolute w-100 z-3 trippoo-navbar'>
            <Container>
                <Navbar.Brand>
                    <Link to='/' className='text-decoration-none trippoo-brand me-4'>
                        Quest<span className="brand-dot">.</span>
                    </Link>
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls='basic-navbar-nav' className='border-dark' />
                <Navbar.Collapse id='basic-navbar-nav'>
                    <Nav className='me-auto w-100 justify-content-center gap-xl-2'>
                        <Nav.Link as={Link} to='/' className='nav-link active'>Home</Nav.Link>
                        <Nav.Link as={Link} to='/destinations' className='nav-link'>Destinations</Nav.Link>
                        <Nav.Link as={Link} to='/holidays' className='nav-link'>Holidays</Nav.Link>
                        <Nav.Link as={Link} to='/planner' className='nav-link fw-semibold'>
                            <i className="bi bi-calendar-event me-1"></i>Trips
                        </Nav.Link>
                        <Nav.Link as={Link} to='/explore' className='nav-link'>
                            <i className="bi bi-compass me-1"></i>Discovery AI
                        </Nav.Link>
                        <Nav.Link as={Link} to='/booking' className='nav-link'>Bookings</Nav.Link>
                        <Nav.Link as={Link} to='/tools' className='nav-link'>Tools</Nav.Link>
                        {isAdmin && (
                            <Nav.Link as={Link} to='/admin' className='nav-link text-danger fw-bold'>
                                <i className="bi bi-shield-fill-check me-1"></i>Admin Portal
                            </Nav.Link>
                        )}
                    </Nav>

                    <div className="d-flex align-items-center gap-3">
                        <Link to="/explore" className="text-dark position-relative text-decoration-none me-1" title="Saved Wishlist">
                            <i className="bi bi-heart-fill fs-5 text-danger"></i>
                            {count > 0 && (
                                <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                                    {count}
                                </Badge>
                            )}
                        </Link>

                        <Button className="btn-nav-outline text-nowrap">
                            <Link to='/holidays' className='text-decoration-none'>Book Now</Link>
                        </Button>

                        {isAuthenticated ? (
                            <Dropdown align="end">
                                <Dropdown.Toggle variant="link" id="dropdown-user" className="p-0 border-0 text-decoration-none">
                                    <div className="profile-circle-btn-light position-relative">
                                        <img src={user.avatar} alt={user.name} className="rounded-circle w-100 h-100" />
                                        {isAdmin && (
                                            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" title="Admin User"></span>
                                        )}
                                    </div>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="shadow border-0 mt-2">
                                    {isAdmin && (
                                        <>
                                            <Dropdown.Item as={Link} to="/admin" className="fw-bold text-danger">
                                                <i className="bi bi-shield-fill-check me-2"></i>Admin Management
                                            </Dropdown.Item>
                                            <Dropdown.Divider />
                                        </>
                                    )}
                                    <Dropdown.Item as={Link} to="/profile" className="fw-bold">
                                        <i className="bi bi-person me-2"></i>My Profile & Settings
                                    </Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/planner">
                                        <i className="bi bi-map me-2"></i>My Active Trips
                                    </Dropdown.Item>
                                    <Dropdown.Item disabled className="small text-muted">{user.email} ({user.role || 'TRAVELER'})</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={logout} className="text-danger">
                                        <i className="bi bi-box-arrow-right me-2"></i>Sign Out
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <Link to="/login" className="profile-circle-btn-light text-decoration-none" title="User Profile">
                                <i className="bi bi-person"></i>
                            </Link>
                        )}
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;