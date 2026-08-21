import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import Alert from 'react-bootstrap/Alert';
import { useTrip } from '../../Context/TripContext';

function CollaborationModal({ show, onHide }) {
  const { activeTrip, addComment } = useTrip();
  const [inviteEmail, setInviteEmail] = useState('');
  const [role, setRole] = useState('Editor');
  const [invitedSuccess, setInvitedSuccess] = useState('');
  const [newComment, setNewComment] = useState('');
  const [copied, setCopied] = useState(false);

  const shareUrl = `https://quest-travel.app/trip/${activeTrip.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleInvite = (e) => {
    e.preventDefault();
    if (inviteEmail) {
      setInvitedSuccess(`Invitation sent to ${inviteEmail} as ${role}!`);
      setInviteEmail('');
      setTimeout(() => setInvitedSuccess(''), 4000);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(newComment.trim());
      setNewComment('');
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold d-flex align-items-center gap-2 text-start">
          <i className="bi bi-people-fill text-coral"></i>Real-Time Trip Collaboration
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-start">
        {/* Share Link Section */}
        <div className="bg-light p-3 rounded mb-4">
          <label className="fw-bold small mb-1 text-dark">Shareable Trip Link</label>
          <div className="d-flex gap-2">
            <Form.Control type="text" readOnly value={shareUrl} className="bg-white border" />
            <Button variant={copied ? 'coral' : 'outline-dark'} onClick={handleCopyLink} className={`fw-bold text-nowrap ${copied ? 'btn-coral' : ''}`}>
              {copied ? <><i className="bi bi-check-lg me-1"></i>Copied!</> : 'Copy Link'}
            </Button>
          </div>
          <small className="text-muted mt-1 d-block">Anyone with this link can view the itinerary details.</small>
        </div>

        {/* Invite Member Form */}
        <div className="mb-4">
          <h6 className="fw-bold text-dark mb-3">Invite Friends or Family</h6>
          {invitedSuccess && <Alert variant="success" className="py-2 small">{invitedSuccess}</Alert>}
          <Form onSubmit={handleInvite} className="row g-2">
            <div className="col-md-7">
              <Form.Control 
                type="email" 
                placeholder="Enter collaborator email" 
                value={inviteEmail} 
                onChange={(e) => setInviteEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="col-md-3">
              <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="Editor">Can Edit & Plan</option>
                <option value="Viewer">Can View Only</option>
              </Form.Select>
            </div>
            <div className="col-md-2">
              <Button variant="coral" type="submit" className="btn-coral w-100 fw-bold">Invite</Button>
            </div>
          </Form>
        </div>

        {/* Collaborators List */}
        <div className="mb-4">
          <h6 className="fw-bold text-dark mb-2">Trip Members ({activeTrip.collaborators?.length + 1 || 1})</h6>
          <ul className="list-group list-group-flush border rounded">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong className="d-block">You (Alex) - Trip Owner</strong>
                <small className="text-muted">alex@example.com</small>
              </div>
              <Badge bg="coral" className="btn-coral">Owner</Badge>
            </li>
            {activeTrip.collaborators?.map((c, i) => (
              <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong className="d-block">{c.name}</strong>
                  <small className="text-muted">{c.email}</small>
                </div>
                <div className="d-flex gap-2">
                  <Badge bg="secondary">{c.role}</Badge>
                  <Badge bg={c.status === 'Active' ? 'success' : 'warning'}>{c.status}</Badge>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Live Discussion & Comments Feed */}
        <div>
          <h6 className="fw-bold text-dark mb-2">Live Trip Discussion</h6>
          <div className="bg-light p-3 rounded mb-3 max-h-200 overflow-auto">
            {activeTrip.comments?.map((comment) => (
              <div key={comment.id} className="bg-white p-2.5 rounded shadow-sm mb-2 border">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <strong className="small text-dark">{comment.author}</strong>
                  <small className="text-muted">{comment.time}</small>
                </div>
                <p className="mb-0 small text-secondary">{comment.text}</p>
              </div>
            ))}
          </div>

          <Form onSubmit={handleCommentSubmit} className="d-flex gap-2">
            <Form.Control 
              type="text" 
              placeholder="Write a comment or suggestion..." 
              value={newComment} 
              onChange={(e) => setNewComment(e.target.value)} 
            />
            <Button variant="dark" type="submit" className="fw-bold">Post</Button>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default CollaborationModal;
