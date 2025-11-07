import React from 'react';

// --- Simple styling for the modal ---
const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000, // Make sure it's on top
};

const modalContentStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  width: '90%',
  maxWidth: '500px',
  position: 'relative',
};

const closeButtonStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  border: 'none',
  background: 'transparent',
  fontSize: '1.5rem',
  cursor: 'pointer',
};

// --- Main Component ---
const Modal = ({ show, onClose, title, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div style={modalStyle} onClick={onClose}> {/* Click outside to close */}
      <div style={modalContentStyle} onClick={e => e.stopPropagation()}> {/* Stop click from closing modal */}
        <button style={closeButtonStyle} onClick={onClose}>&times;</button>
        <h2>{title}</h2>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;