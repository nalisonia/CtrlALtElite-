// BookingModal.js
import React from 'react';
import Modal from 'react-modal';
import "../Styles/DashBoard.css";

Modal.setAppElement('#root');

function BookingModal({ isOpen, onRequestClose, booking }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Booking Information"
      className="modal"
      overlayClassName="modal-overlay"
      style={{ // Add inline styles for width
        content: {
          width: '60%', // Adjust the width percentage as needed
          maxWidth: '600px', // Set a maximum width if desired
          margin: 'auto', // Center the modal horizontally
        }
      }}
    >
      {booking && (
        <div>
          <h2>{booking.client_name}'s Booking</h2>
          <p><strong>Event Date:</strong> {booking.event_date}</p>
          <p><strong>Event Time:</strong> {booking.event_time}</p>
          <p><strong>Event Type:</strong> {booking.event_type}</p>
          <p><strong>Event Name:</strong> {booking.event_name}</p>
          <p><strong>Hair & Makeup:</strong> {booking.hair_and_makeup}</p>
          <p><strong>Hair Only:</strong> {booking.hair_only}</p>
          <p><strong>Makeup Only:</strong> {booking.makeup_only}</p>
          <p><strong>Location:</strong> {booking.location}</p>
          <p><strong>Additional Notes:</strong> {booking.additional_notes}</p>

          <button onClick={onRequestClose} className="modal-close-button">
            Close
          </button>
        </div>
      )}
    </Modal>
  );
}

export default BookingModal;