import React from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

function ToastNotification({ toast, onClose }) {
  if (!toast || !toast.show) return null;

  return (
    <ToastContainer position="bottom-end" className="p-3 position-fixed z-3" style={{ bottom: '20px', right: '20px', zIndex: 9999 }}>
      <Toast 
        onClose={onClose} 
        show={toast.show} 
        delay={4000} 
        autohide 
        bg={toast.variant || 'success'}
        className="text-white shadow-lg rounded-3 border-0"
      >
        <Toast.Header closeButton className={`bg-${toast.variant || 'success'} text-white border-0`}>
          <strong className="me-auto fs-6">
            <i className={`bi ${toast.icon || 'bi-check-circle-fill'} me-2`}></i>
            {toast.title || 'Quest Travel'}
          </strong>
          <small className="text-white opacity-75">Just now</small>
        </Toast.Header>
        <Toast.Body className="fw-medium">
          {toast.message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default ToastNotification;
