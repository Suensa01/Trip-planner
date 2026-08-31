import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import Alert from 'react-bootstrap/Alert';
import { useTrip } from '../../Context/TripContext';
import { useAuth } from '../../Context/AuthContext';

function CollaborationModal({ show, onHide }) {
  const { activeTrip, addComment, addCollaborator } = useTrip();
  const { user } = useAuth();
  const [inviteEmail, setInviteEmail] = useState('');
  const [role, setRole] = useState('Editor');
  const [invitedSuccess, setInvitedSuccess] = useState('');
  const [newComment, setNewComment] = useState('');
  const [copied, setCopied] = useState(false);

  if (!activeTrip) return null;

  const shareUrl = `https://quest-travel.app/trip/${activeTrip.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleInvite = (e) => {
    e.preventDefault();
    if (inviteEmail) {
      addCollaborator(inviteEmail, role);
      setInvitedSuccess(`Added ${inviteEmail} as ${role}! Collaborator saved to trip members.`);
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

  const ownerName = user?.name || user?.email?.split('@')[0] || 'Traveler';
  const ownerEmail = user?.email || 'traveler@quest.com';
  const collaboratorsList = activeTrip.collaborators || [];
  const totalMembers = collaboratorsList.length + 1;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold d-flex align-items-center gap-2 text-start">
          <i className="bi bi-people-fill text-coral"></i>Real-Time Trip Collaboration Studio
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-start">
        {/* Share Link Section */}
        <div className="bg-light p-3 rounded mb-4 border">
          <label className="fw-bold small mb-1 text-dark">Shareable Trip Link</label>
          <div className="d-flex gap-2">
            <Form.Control type="text" readOnly value={shareUrl} className="bg-white border" />
            <Button variant={copied ? 'coral' : 'outline-dark'} onClick={handleCopyLink} className={`fw-bold text-nowrap ${copied ? 'btn-coral' : ''}`}>
              {copied ? <><i className="bi bi-check-lg me-1"></i>Copied!</> : 'Copy Link'}
            </Button>
          </div>
          <small className="text-muted mt-1 d-block">Anyone with this link can view the live itinerary details.</small>
        </div>

        {/* Invite Member Form */}
        <div className="mb-4">
          <h6 className="fw-bold text-dark mb-3">Invite Collaborators & Group Travelers</h6>
          {invitedSuccess && <Alert variant="success" className="py-2 small">{invitedSuccess}</Alert>}
          <Form onSubmit={handleInvite} className="row g-2">
            <div className="col-md-7">
              <Form.Control 
                type="email" 
                placeholder="Enter collaborator email (e.g. friend@example.com)" 
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
          <h6 className="fw-bold text-dark mb-2">Active Trip Members ({totalMembers})</h6>
          <ul className="list-group list-group-flush border rounded overflow-hidden">
            {/* Authenticated Logged-In User as Owner */}
            <li className="list-group-item d-flex justify-content-between align-items-center bg-white p-3">
              <div className="d-flex align-items-center gap-3">
                <img 
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(ownerName)}&background=28a745&color=fff`} 
                  alt="Owner Avatar" 
                  className="rounded-circle"
                  style={{ width: '40px', height: '40px' }}
                />
                <div>
                  <strong className="d-block text-dark">{ownerName} (You)</strong>
                  <small className="text-muted">{ownerEmail}</small>
                </div>
              </div>
              <Badge bg="coral" className="btn-coral px-3 py-2">Trip Owner</Badge>
            </li>

            {/* Dynamically Added Real Collaborators */}
            {collaboratorsList.map((c, i) => (
              <li key={c.id || i} className="list-group-item d-flex justify-content-between align-items-center p-3">
                <div className="d-flex align-items-center gap-3">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(c.name || 'User')}&background=0d6efd&color=fff`} 
                    alt="Collaborator Avatar" 
                    className="rounded-circle"
                    style={{ width: '36px', height: '36px' }}
                  />
                  <div>
                    <strong className="d-block text-dark">{c.name}</strong>
                    <small className="text-muted">{c.email}</small>
                  </div>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <Badge bg="secondary" className="px-2 py-1">{c.role}</Badge>
                  <Badge bg={c.status === 'Active' ? 'success' : 'warning'} className="px-2 py-1">{c.status || 'Active'}</Badge>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Live Discussion & Comments Feed */}
        <div>
          <h6 className="fw-bold text-dark mb-2">Live Group Discussion</h6>
          <div className="bg-light p-3 rounded mb-3 max-h-200 overflow-auto border">
            {(!activeTrip.comments || activeTrip.comments.length === 0) ? (
              <p className="text-muted small text-center my-2">No comments posted yet. Start the group discussion below!</p>
            ) : (
              activeTrip.comments.map((comment) => (
                <div key={comment.id} className="bg-white p-2.5 rounded shadow-sm mb-2 border text-start">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <strong className="small text-dark">{comment.author}</strong>
                    <small className="text-muted">{comment.time}</small>
                  </div>
                  <p className="mb-0 small text-secondary">{comment.text}</p>
                </div>
              ))
            )}
          </div>

          <Form onSubmit={handleCommentSubmit} className="d-flex gap-2">
            <Form.Control 
              type="text" 
              placeholder="Write a comment or suggestion..." 
              value={newComment} 
              onChange={(e) => setNewComment(e.target.value)} 
            />
            <Button variant="dark" type="submit" className="fw-bold">Post Comment</Button>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default CollaborationModal;
