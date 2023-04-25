import React from 'react';
import './Modal.css';

const Modal = ({ content, onClose }) => {
  return (
    <div className="modal-background">
      <div className="modal">
        <button className="modal-close-button" onClick={onClose}>
          X
        </button>
        <h2>{content['Package name']}</h2>
        <p>Date of collection: {content['Date of collection']}</p>
        <p>Installed version: {content['Installed version']}</p>
        <p>Latest version: {content['Latest version']}</p>
        <p>CVEs: {content.CVEs}</p> {/* Update this line */}
        <p>Release notes: {content['Release notes']}</p>
      </div>
    </div>
  );
};

export default Modal;
