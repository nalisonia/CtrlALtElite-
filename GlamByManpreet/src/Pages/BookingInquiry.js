import React, { useState } from 'react';
import '../Styles/BookingInquiry.css'; // Import CSS file for styling 

function BookingInquiry() {
  const [formData, setFormData] = useState({
    clientsHairAndMakeup: '',
    clientsHairOnly: '',
    clientsMakeupOnly: '',
    locationAddress: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here, e.g., send data to server
    console.log(formData);
    // Reset form fields if needed
    setFormData({
      clientsHairAndMakeup: '',
      clientsHairOnly: '',
      clientsMakeupOnly: '',
      locationAddress: ''
    });
  };

  return (
    <div className='bookinginquiry-container'>
      <h2 className='bookinginquiry-header'>BOOKING INQUIRY</h2>
      <div className='booking-form'>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="clientsHairAndMakeup">Number of clients requiring both hair and makeup:</label>
            <input type="number" id="clientsHairAndMakeup" name="clientsHairAndMakeup" value={formData.clientsHairAndMakeup} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="clientsHairOnly">Number of clients requiring only hair:</label>
            <input type="number" id="clientsHairOnly" name="clientsHairOnly" value={formData.clientsHairOnly} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="clientsMakeupOnly">Number of clients requiring only makeup:</label>
            <input type="number" id="clientsMakeupOnly" name="clientsMakeupOnly" value={formData.clientsMakeupOnly} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="locationAddress">Location/Address you'd like me to commute to:</label>
            <input type="text" id="locationAddress" name="locationAddress" value={formData.locationAddress} onChange={handleChange} />
          </div>
          <div style={{ marginTop: '10px' }}>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingInquiry;
