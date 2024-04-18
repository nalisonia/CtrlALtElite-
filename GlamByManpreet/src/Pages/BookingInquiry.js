import React, { useState } from 'react';
import '../Styles/BookingInquiry.css';

function BookingInquiry() {
  const [formData, setFormData] = useState({
    eventName: '',
    clientsHairAndMakeup: '',
    clientsHairOnly: '',
    clientsMakeupOnly: '',
    locationAddress: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({
      eventName: '',
      clientsHairAndMakeup: '',
      clientsHairOnly: '',
      clientsMakeupOnly: '',
      locationAddress: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="booking-inquiry">
      <h1>BOOKING INQUIRY</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="eventName">Name of the event(s):</label>
            <select id="eventName" name="eventName" value={formData.eventName} onChange={handleChange}>
              <option value="">Select an event</option>
              <option value="Wedding Engagement">Wedding Engagement</option>
              <option value="Rokha">Rokha</option>
              <option value="Laggo">Laggo</option>
              <option value="Mehndi">Mehndi</option>
              <option value="Photoshoot">Photoshoot</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="clientsHairAndMakeup">Number of clients requiring both hair and makeup:</label>
            <input type="number" id="clientsHairAndMakeup" name="clientsHairAndMakeup" value={formData.clientsHairAndMakeup} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="clientsHairOnly">Number of clients requiring only hair:</label>
            <input type="number" id="clientsHairOnly" name="clientsHairOnly" value={formData.clientsHairOnly} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="clientsMakeupOnly">Number of clients requiring only makeup:</label>
            <input type="number" id="clientsMakeupOnly" name="clientsMakeupOnly" value={formData.clientsMakeupOnly} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="locationAddress">Location/Address you’d like me to commute to:</label>
            <input type="text" id="locationAddress" name="locationAddress" value={formData.locationAddress} onChange={handleChange} />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default BookingInquiry;
