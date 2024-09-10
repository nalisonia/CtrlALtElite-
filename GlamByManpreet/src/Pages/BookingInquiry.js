import React, { useState, useEffect } from 'react';
import '../Styles/BookingInquiry.css';
import supabase from '../config/supabaseClient.js';

function BookingInquiry() {
  const [inquires, setInquires] = useState([]);
  const [formData, setFormData] = useState({
    firstNameAndLastName: '',
    phoneNumber: '',
    emailAddress: '',
    eventDate: '',
    eventTime: '',
    eventType: '',
    eventName: '',
    clientsHairAndMakeup: '',
    clientsHairOnly: '',
    clientsMakeupOnly: '',
    locationAddress: '',
    additionalNotes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchInquires();
  }, []);

  async function fetchInquires() {
    const { data, error } = await supabase
      .from('customer_inqury') 
      .select();
    
    if (error) {
      console.error('Error fetching inquiries:', error);
      return;
    }
    setInquires(data);
  }

  async function createInquiry() {
    const { error } = await supabase
      .from('customer_inqury')
      .insert([{
        FnameLname: formData.firstNameAndLastName,
        Phone_Number: formData.phoneNumber,
        Email_Address: formData.emailAddress,
        Event_Date: formData.eventDate,
        Event_Time: formData.eventTime,
        Event_Type: formData.eventType,
        Event_Name: formData.eventName,
        Clients_Hair_And_Makeup: formData.clientsHairAndMakeup,
        Clients_Hair_Only: formData.clientsHairOnly,
        Clients_Makeup_Only: formData.clientsMakeupOnly,
        Location_Address: formData.locationAddress,
        Additional_Notes: formData.additionalNotes,
      }]);
  
    if (error) {
      console.error('Error creating inquiry:', error);
      return;
    }
  
    setFormData({
      firstNameAndLastName: '',
      phoneNumber: '',
      emailAddress: '',
      eventDate: '',
      eventTime: '',
      eventType: '',
      eventName: '',
      clientsHairAndMakeup: '',
      clientsHairOnly: '',
      clientsMakeupOnly: '',
      locationAddress: '',
      additionalNotes: ''
    });
  
    fetchInquires();
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};
    const phonePattern = /^\d{3}-\d{3}-\d{4}$/;

    if (!phonePattern.test(formData.phoneNumber)) {
      validationErrors.phoneNumber = "Phone number must be in the format XXX-XXX-XXXX."; // Tests if phonenumber is in XXX-XXX-XXXX format. If not,
    }                                                                                    // text is shown to the user to tell them the correct format
    if (phonePattern.test(formData.phoneNumber)) {
      validationErrors.phoneNumber = "";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    await createInquiry();
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
            <label htmlFor="firstNameAndLastName">First Name and Last Name:<span className="required">*</span></label>
            <input type="text" id="firstNameAndLastName" name="firstNameAndLastName" value={formData.firstNameAndLastName} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number:<span className="required">*</span></label>
            <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} placeholder="XXX-XXX-XXXX" onChange={handleChange} />
            {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="emailAddress">Email Address:<span className="required">*</span></label>
            <input type="email" id="emailAddress" name="emailAddress" value={formData.emailAddress} placeholder="your@email.com" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="eventDate">Date of Event:<span className="required">*</span></label>
            <input type="date" id="eventDate" name="eventDate" value={formData.eventDate} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="eventTime">Ready By Time:<span className="required">*</span></label>
            <input type="time" id="eventTime" name="eventTime" value={formData.eventTime} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="eventType">Type of Service:<span className="required">*</span></label>
            <select id="eventType" name="eventType" value={formData.eventType} onChange={handleChange}>
              <option value="">Select a service</option>
              <option value="bridal">Bridal</option>
              <option value="non-bridal">Non-Bridal</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="eventName">Name of the event(s):<span className="required">*</span></label>
            <select id="eventName" name="eventName" value={formData.eventName} onChange={handleChange}>
              <option value="">Select an event</option>
              <option value="Wedding Engagement">Wedding Engagement</option>
              <option value="Rokha">Rokha</option>
              <option value="Laggo">Laggo</option>
              <option value="Mehndi">Mehndi</option>
              <option value="Photoshoot">Photoshoot</option>
            </select>
          </div>
          {/* Other form fields */}
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default BookingInquiry;
