import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import Modal from 'react-bootstrap/Modal';
import { useTrip } from '../../Context/TripContext';
import { useToast } from '../../Context/ToastContext';

function DocumentVault() {
  const { activeTrip, addDocument } = useTrip();
  const { showToast } = useToast();
  const [docName, setDocName] = useState('');
  const [category, setCategory] = useState('Tickets');
  const [code, setCode] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);

  const handleUpload = (e) => {
    e.preventDefault();
    if (docName) {
      const formattedName = docName.endsWith('.pdf') || docName.endsWith('.png') ? docName : `${docName}.pdf`;
      const docCode = code || `QT-DOC-${Math.floor(1000 + Math.random() * 9000)}`;
      addDocument({
        name: formattedName,
        type: 'pdf',
        size: '1.4 MB',
        category,
        code: docCode
      });
      showToast('Document Saved!', `Uploaded "${formattedName}" to Document Vault.`, 'success', 'bi-file-earmark-check-fill');
      setDocName('');
      setCode('');
    }
  };

  return (
    <Card className="shadow-sm border-0 rounded-4 text-start">
      <Card.Header className="bg-dark text-white p-3 d-flex justify-content-between align-items-center">
        <h5 className="fw-bold mb-0">📂 Centralized Document & Ticket Vault</h5>
        <Badge bg="info" className="px-3 py-2">{activeTrip.documents?.length || 0} Files Stored</Badge>
      </Card.Header>
      <Card.Body className="p-4">
        <div className="row g-4">
          {/* Upload Document Form */}
          <div className="col-md-4">
            <div className="bg-light p-3 rounded border">
              <h6 className="fw-bold text-dark mb-3">Upload Tickets & Confirmation PDFs</h6>
              <Form onSubmit={handleUpload}>
                <Form.Group className="mb-2">
                  <Form.Label className="small fw-bold">Document Title / File Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="e.g. Flight_Ticket_Emirates.pdf" 
                    value={docName} 
                    onChange={(e) => setDocName(e.target.value)} 
                    required 
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label className="small fw-bold">Category</Form.Label>
                  <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Flights">✈️ Flight Confirmation</option>
                    <option value="Hotels">🏨 Hotel Voucher</option>
                    <option value="Tickets">🎟️ Museum / Tour Pass</option>
                    <option value="Identity">🪪 Passport / ID</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">PNR / Reference Code</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="e.g. PNR-99812" 
                    value={code} 
                    onChange={(e) => setCode(e.target.value)} 
                  />
                </Form.Group>

                <Button variant="success" type="submit" className="w-100 fw-bold">
                  📤 Upload Document
                </Button>
              </Form>
            </div>
          </div>

          {/* Stored Documents Grid */}
          <div className="col-md-8">
            <h6 className="fw-bold text-dark mb-3">Stored Travel Credentials & Tickets</h6>
            <div className="row g-3">
              {activeTrip.documents?.map((doc) => (
                <div key={doc.id} className="col-md-6">
                  <Card className="border shadow-sm rounded-3 p-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="fs-1 text-danger">📄</div>
                      <div className="flex-fill overflow-hidden">
                        <Badge bg="secondary" className="mb-1">{doc.category}</Badge>
                        <h6 className="fw-bold text-dark text-truncate mb-0">{doc.name}</h6>
                        <small className="text-muted d-block">Code: <strong>{doc.code}</strong> • {doc.size}</small>
                      </div>
                    </div>
                    <Button 
                      variant="outline-dark" 
                      size="sm" 
                      className="w-100 mt-3 fw-bold"
                      onClick={() => setPreviewDoc(doc)}
                    >
                      👁️ View Document & QR
                    </Button>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card.Body>

      {/* Ticket Preview Modal */}
      <Modal show={!!previewDoc} onHide={() => setPreviewDoc(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">{previewDoc?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <Badge bg="success" className="mb-3 fs-6">{previewDoc?.category} Verified Pass</Badge>
          <div className="bg-light p-4 rounded border d-inline-block mb-3">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(previewDoc?.code || 'QUEST-TICKET')}`} 
              alt="QR Code Ticket" 
              className="img-fluid"
            />
          </div>
          <h5 className="fw-bold text-dark mb-1">Reference Code: {previewDoc?.code}</h5>
          <p className="small text-muted mb-0">Show this QR code at airport check-in or venue entrance.</p>
        </Modal.Body>
      </Modal>
    </Card>
  );
}

export default DocumentVault;
