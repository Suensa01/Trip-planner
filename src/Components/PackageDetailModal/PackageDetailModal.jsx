import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import Alert from 'react-bootstrap/Alert';
import './PackageDetailModal.css';
import { useWishlist } from '../../Context/WishlistContext';
import { useTrip } from '../../Context/TripContext';
import { useToast } from '../../Context/ToastContext';
import { calculateDynamicPrice, formatCurrency } from '../../utils/pricing';

function PackageDetailModal({ show, onHide, packageData }) {
  const [guests, setGuests] = useState(2);
  const [nights, setNights] = useState(4);
  const [vibe, setVibe] = useState('Couples');
  const [startDate, setStartDate] = useState('');
  const [booked, setBooked] = useState(false);

  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addActivity, addExpense, addDocument } = useTrip();
  const { showToast } = useToast();

  useEffect(() => {
    if (packageData) {
      const parsedNights = packageData.itemNights ? parseInt(packageData.itemNights) : 4;
      setNights(parsedNights || 4);
      setVibe(packageData.category || packageData.vibe || 'Couples');
    }
  }, [packageData]);

  if (!packageData) return null;

  const rawBase = packageData.itemPrice 
    ? parseInt(packageData.itemPrice.toString().replace(/[^0-9]/g, '')) || 120 
    : 120;
  
  // Normalize rawBase to a per-night base rate if package price came in as high initial total
  const perNightBase = rawBase > 300 ? Math.round(rawBase / 4) : rawBase;

  const priceObj = calculateDynamicPrice(perNightBase, nights, guests, vibe);
  const totalPrice = priceObj.total;
  const isSaved = isWishlisted(packageData);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBooked(true);

    const title = packageData.itemTitle || packageData.title || 'Travel Package Booking';
    const bookingCode = `QT-PKG-${Math.floor(10000 + Math.random() * 90000)}`;

    addActivity(1, {
      title: `Package Check-in: ${title}`,
      type: 'hotel',
      time: '02:00 PM',
      location: packageData.itemSubtitle || 'Main Resort & Suites',
      price: totalPrice,
      notes: `Confirmed for ${guests} guests • ${nights} Nights (${vibe} Vibe) • Code: ${bookingCode}`
    });

    addExpense({
      title: `${title} (${guests} Guests, ${nights} Nights)`,
      amount: totalPrice,
      payer: 'You (Alex)',
      category: 'Lodging',
      date: startDate || new Date().toISOString().split('T')[0]
    });

    addDocument({
      name: `${title.replace(/[^a-zA-Z0-9]/g, '_')}_Voucher.pdf`,
      type: 'pdf',
      size: '1.8 MB',
      category: 'Hotels',
      code: bookingCode
    });

    showToast(
      'Reservation Placed!',
      `Booked ${title} for ${formatCurrency(totalPrice, true)}. Voucher added to Document Vault!`,
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
              Your reservation for <strong>{packageData.itemTitle}</strong> ({guests} Guest{guests > 1 ? 's' : ''}, {nights} Nights) has been placed for <strong>{formatCurrency(totalPrice, true)}</strong>.
            </p>
          </Alert>
        ) : (
          <div className="row g-4">
            <div className="col-md-6 text-start">
              <div className="position-relative overflow-hidden rounded shadow-sm mb-3">
                <img
                  src={packageData.itemImage || packageData.image || '/logo192.png'}
                  alt={packageData.itemTitle}
                  className="img-fluid w-100 object-fit-cover modal-pkg-img"
                  loading="lazy"
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

              <div className="pkg-highlights bg-light p-3 rounded text-start border mb-3">
                <h6 className="fw-bold text-dark mb-2">Package Inclusions:</h6>
                <ul className="list-unstyled mb-0 small text-secondary">
                  <li><i className="bi bi-check2-circle text-success me-1"></i>4-Star Luxury Hotel Accommodation</li>
                  <li><i className="bi bi-check2-circle text-success me-1"></i>Daily Breakfast & Complimentary WiFi</li>
                  <li><i className="bi bi-check2-circle text-success me-1"></i>Guided City Tour & Entry Passes</li>
                  <li><i className="bi bi-check2-circle text-success me-1"></i>Airport Transfers Included</li>
                </ul>
              </div>

              <div className="bg-light p-3 rounded text-start border">
                <span className="small text-muted fw-bold d-block mb-1">Dynamic Pricing Formula:</span>
                <small className="text-muted">
                  ₹{perNightBase.toLocaleString('en-IN')} base/night × {nights} Nights × {guests} Guests × {priceObj.vibeMultiplier}x ({vibe} Vibe)
                </small>
              </div>
            </div>

            <div className="col-md-6 text-start">
              <p className="text-muted small mb-2">
                {packageData.itemDescription || packageData.itemSubTitle || 'Explore stunning landscapes, historical landmarks, and rich cultural heritage with our top-rated curated travel experiences.'}
              </p>

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
                    <Form.Label className="small fw-bold">Members / Guests</Form.Label>
                    <Form.Select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
                      {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} Guest{num > 1 ? 's' : ''}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                  <div className="col-6">
                    <Form.Label className="small fw-bold">Trip Days & Nights</Form.Label>
                    <Form.Select value={nights} onChange={(e) => setNights(Number(e.target.value))}>
                      {[2, 3, 4, 5, 7, 10, 14].map((num) => (
                        <option key={num} value={num}>
                          {num} Nights ({num + 1} Days)
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </div>

                <div className="mb-3">
                  <Form.Label className="small fw-bold">Travel Vibe / Experience</Form.Label>
                  <Form.Select value={vibe} onChange={(e) => setVibe(e.target.value)}>
                    <option value="Luxury">✨ Luxury Experience (1.5x)</option>
                    <option value="Romance">💖 Romance / Honeymoon (1.4x)</option>
                    <option value="Couples">👩‍❤️‍👨 Couples Getaway (1.3x)</option>
                    <option value="Heritage">🏰 Heritage & Culture (1.25x)</option>
                    <option value="Adventure">🧗‍♂️ Adventure & Trekking (1.2x)</option>
                    <option value="Family">👨‍👩‍👧‍👦 Family Vacation (1.1x)</option>
                    <option value="Solo">🎒 Solo Explorer (0.85x)</option>
                    <option value="Budget">🏷️ Budget Saver (0.8x)</option>
                  </Form.Select>
                </div>

                <div className="d-flex align-items-center justify-content-between bg-light p-3 rounded mb-3 border">
                  <div>
                    <span className="fw-bold d-block text-dark">Total Dynamic Price:</span>
                    <small className="text-muted">Unified INR Currency</small>
                  </div>
                  <span className="fs-3 fw-bold text-success">{formatCurrency(totalPrice, true)}</span>
                </div>

                <Button variant="coral" type="submit" className="btn-coral w-100 py-2 fw-bold text-uppercase">
                  Confirm & Reserve Now ({formatCurrency(totalPrice)})
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
