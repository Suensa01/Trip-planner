import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import { useWishlist } from '../../Context/WishlistContext';

function WishlistModal({ show, onHide, onSelectPackage }) {
  const { wishlist, toggleWishlist, count } = useWishlist();

  const handleBookPackage = (item) => {
    onHide();
    if (onSelectPackage) {
      onSelectPackage(item);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="wishlist-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold d-flex align-items-center gap-2 text-start">
          <i className="bi bi-heart-fill text-danger"></i>Your Saved Travel Wishlist
          <Badge bg="danger" pill className="fs-6 ms-1">{count} Saved</Badge>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-3 text-start">
        {wishlist.length === 0 ? (
          <div className="text-center py-5 bg-light rounded-4 my-2 p-4">
            <div className="mx-auto bg-white rounded-circle p-3 mb-3 shadow-sm" style={{ width: '70px', height: '70px' }}>
              <i className="bi bi-heartbreak text-coral display-6"></i>
            </div>
            <h5 className="fw-bold text-dark mb-2">Your Wishlist is Empty!</h5>
            <p className="text-muted small mx-auto mb-4" style={{ maxWidth: '420px' }}>
              You haven't saved any travel packages or destination cards yet. Click the ❤️ icon on any package across Quest Travel to save it to your personal wishlist!
            </p>
            <Button variant="coral" className="btn-coral fw-bold px-4" onClick={onHide}>
              Browse Travel Destinations
            </Button>
          </div>
        ) : (
          <div className="row g-3">
            {wishlist.map((item, idx) => (
              <div key={item.id || idx} className="col-md-6">
                <Card className="card-trippoo shadow-sm border-0 rounded-4 overflow-hidden h-100">
                  <div className="position-relative">
                    <img 
                      src={item.itemImage || item.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'} 
                      alt={item.itemTitle || item.title} 
                      className="w-100 object-fit-cover" 
                      style={{ height: '160px' }} 
                      loading="lazy"
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-light position-absolute top-0 end-0 m-2 rounded-circle shadow-sm text-danger"
                      onClick={() => toggleWishlist(item)}
                      title="Remove from Wishlist"
                    >
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </div>

                  <Card.Body className="p-3 d-flex flex-column justify-content-between text-start">
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <Badge bg="coral" className="btn-coral">{item.category || item.country || 'Saved Package'}</Badge>
                        {item.itemNights && <small className="text-muted"><i className="bi bi-clock me-1"></i>{item.itemNights}</small>}
                      </div>
                      <h6 className="fw-bold text-dark mb-1">{item.itemTitle || item.title}</h6>
                      <p className="small text-muted mb-2 text-truncate">{item.itemDescription || item.itemSubTitle || item.country || 'Curated travel experience'}</p>
                    </div>

                    <div>
                      <div className="d-flex justify-content-between align-items-center pt-2 border-top mb-2">
                        <span className="small text-muted">Package Cost:</span>
                        <strong className="text-success fs-6">{item.itemPrice || item.price || '₹14,999'}</strong>
                      </div>
                      <div className="d-flex gap-2">
                        <Button 
                          variant="coral" 
                          size="sm" 
                          className="btn-coral w-100 fw-bold"
                          onClick={() => handleBookPackage(item)}
                        >
                          Book Package
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={() => toggleWishlist(item)}
                          title="Remove from Wishlist"
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default WishlistModal;
