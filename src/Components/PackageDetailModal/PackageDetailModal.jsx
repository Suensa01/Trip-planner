import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import Alert from 'react-bootstrap/Alert';
import './PackageDetailModal.css';
import { useWishlist } from '../../Context/WishlistContext';
import { useTrip } from '../../Context/TripContext';
import { useToast } from '../../Context/ToastContext';

function PackageDetailModal({ show, onHide, packageData }) {
  const [guests, setGuests] = useState(2);
  const [nights, setNights] = useState(packageData?.itemNights ? parseInt(packageData.itemNights) || 4 : 4);
  const [startDate, setStartDate] = useState('');
  const [booked, setBooked] = useState(false);
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addActivity, addExpense, addDocument } = useTrip();
  const { showToast } = useToast();

  if (!packageData) return null;

  const basePrice = packageData.itemPrice 
    ? parseInt(packageData.itemPrice.toString().replace(/[^0-9]/g, '')) || 499 
    : 499;

  const totalPrice = basePrice * guests;
  const isSaved = isWishlisted(packageData);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBooked(true);

    const title = packageData.itemTitle || packageData.title || 'Travel Package Booking';
    const bookingCode = `QT-PKG-${Math.floor(10000 + Math.random() * 90000)}`;

    // Add activity to Day 1
    addActivity(1, {
      title: `Package Check-in: ${title}`,
      type: 'hotel',
      time: '02:00 PM',
      location: packageData.itemSubtitle || 'Main Resort & Suites',
      price: totalPrice,
      notes: `Confirmed reservation for ${guests} guests • Code: ${bookingCode}`
    });

    // Add financial expense record
    addExpense({
      title: `${title} (${guests} Guests)`,
      amount: totalPrice,
      payer: 'You (Alex)',
      category: 'Lodging',
      date: startDate || new Date().toISOString().split('T')[0]
    });

    // Add confirmation ticket document
    addDocument({
      name: `${title.replace(/[^a-zA-Z0-9]/g, '_')}_Voucher.pdf`,
      type: 'pdf',
      size: '1.8 MB',
      category: 'Hotels',
      code: bookingCode
    });

    showToast(
      'Reservation Placed!',
      `Booked ${title} for $${totalPrice}. Ticket voucher added to Document Vault!`,
      'success'
    );

    setTimeout(() => {
      setBooked(false);
      onHide();
    }, 2200);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="package-detail-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold text-uppercase d-flex align-items-center gap-2">
          {packageData.itemTitle || packageData.title || 'Travel Package'}
          <Badge bg="success" className="fs-6">
            <i className="bi bi-shield-check me-1"></i>Verified Quest
          </Badge>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-2">
        {booked ? (
          <Alert variant="success" className="text-center py-4 my-3">
            <h4 className="alert-heading fw-bold">
              <i className="bi bi-check-circle-fill text-success me-2"></i>Booking Confirmed!
            </h4>
            <p className="mb-0">
              Your reservation for <strong>{packageData.itemTitle}</strong> ({guests} Guest{guests > 1 ? 's' : ''}) has been successfully placed.
              Check your email confirmation!
            </p>
          </Alert>
        ) : (
          <div className="row g-4">
            <div className="col-md-6">
              <div className="position-relative overflow-hidden rounded shadow-sm mb-3">
                <img
                  src={packageData.itemImage || packageData.image || '/logo192.png'}
                  alt={packageData.itemTitle}
                  className="img-fluid w-100 object-fit-cover modal-pkg-img"
                />
                <button
                  type="button"
                  className={`btn btn-light position-absolute top-0 end-0 m-2 rounded-circle wishlist-btn ${isSaved ? 'text-danger' : ''}`}
                  onClick={() => toggleWishlist(packageData)}
                  title={isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <i className={`bi ${isSaved ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                </button>
              </div>

              <div className="pkg-highlights bg-light p-3 rounded text-start">
                <h6 className="fw-bold text-dark mb-2">Package Inclusions:</h6>
                <ul className="list-unstyled mb-0 small text-secondary">
                  <li><i className="bi bi-check2-circle text-success me-1"></i>4-Star Luxury Hotel Accommodation</li>
                  <li><i className="bi bi-check2-circle text-success me-1"></i>Daily Breakfast & Complimentary WiFi</li>
                  <li><i className="bi bi-check2-circle text-success me-1"></i>Guided City Tour & Entry Tickets</li>
                  <li><i className="bi bi-check2-circle text-success me-1"></i>Airport Transfers Included</li>
                </ul>
              </div>
            </div>

            <div className="col-md-6 text-start">
              <p className="text-muted small mb-2">
                {packageData.itemDescription || packageData.itemSubTitle || 'Explore stunning landscapes, historical landmarks, and rich cultural heritage with our top-rated curated travel experiences.'}
              </p>

              <div className="d-flex align-items-center justify-content-between my-3 p-2 border-top border-bottom">
                <div>
                  <span className="text-muted small">Duration:</span>
                  <div className="fw-bold">{nights} Nights / {nights + 1} Days</div>
                </div>
                <div className="text-end">
                  <span className="text-muted small">Starting Price:</span>
                  <div className="fs-5 fw-bold text-success">
                    {packageData.itemPrice || `$${basePrice}`} <small className="fs-6 text-muted">/ person</small>
                  </div>
                </div>
              </div>

              <Form onSubmit={handleBookingSubmit}>
                <div className="mb-3">
                  <Form.Label className="small fw-bold">Departure Date</Form.Label>
                  <Form.Control
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <Form.Label className="small fw-bold">Number of Guests</Form.Label>
                    <Form.Select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} Guest{num > 1 ? 's' : ''}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                  <div className="col-6">
                    <Form.Label className="small fw-bold">Trip Nights</Form.Label>
                    <Form.Select value={nights} onChange={(e) => setNights(Number(e.target.value))}>
                      {[3, 4, 5, 7, 10, 14].map((num) => (
                        <option key={num} value={num}>
                          {num} Nights
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between bg-light p-3 rounded mb-3">
                  <span className="fw-bold">Total Estimated Cost:</span>
                  <span className="fs-4 fw-bold text-success">${totalPrice}</span>
                </div>

                <Button variant="coral" type="submit" className="btn-coral w-100 py-2 fw-bold text-uppercase">
                  Confirm & Reserve Now
                </Button>
              </Form>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default PackageDetailModal;
