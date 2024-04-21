import React, { useState } from 'react';
import '../Styles/BookingInquiry.css';

function BookingInquiry() {
  const [formData, setFormData] = useState({
    eventName: '',
    clientsHairAndMakeup: '',
    clientsHairOnly: '',
    clientsMakeupOnly: '',
    locationAddress: '',
    additionalNotes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({
      eventName: '',
      clientsHairAndMakeup: '',
      clientsHairOnly: '',
      clientsMakeupOnly: '',
      locationAddress: '',
      additionalNotes: ''
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
      <p className="response-time"> 
Thank you for inquiring with Glam By Manpreet for your hair and makeup services! 

Non-Bridal and Bridal bookings are open for 2024/2025.  

To inquire about availability please complete the form below and I will reach out within 3-5 days regarding availability. 

All inquiries will be responded to via text or email. </p>
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
          <label htmlFor="additionalNotes">Additional Notes:</label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              rows="4"
              placeholder="Please add any additional information Manpreet should know..."
            />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default BookingInquiry;
