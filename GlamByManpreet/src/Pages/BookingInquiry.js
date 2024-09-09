import React, { useState,useEffect } from 'react';
import '../Styles/BookingInquiry.css';
import supabase from '../config/supabaseClient.js';

function BookingInquiry() {
  // inquires' contains all the inquiries, and setInquires is used to update this state.
  const [inquires, setInquires] = useState([]);
  // 'formData' contains all the fields of the form with initial empty values.
  // 'setFormData' is used to update this state as the user enters information.
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

  useEffect(() => {
    fetchInquires();
  }, []);

  // Fetches the list of inquiries from the database and updates the inquires state.
  async function fetchInquires() {
    const { data, error } = await supabase
      .from('customer_inqury') 
      .select();
    
    if (error) {
      console.error('Error fetching inquiries:', error);
      return;
    }
    setInquires(data);
    console.log('data: ', data);
  }

  //assigns the local variable value that the user enters to the field I created in supabase
  //this fucntion is called from the handle submit function after the user clicks the submit button
  async function createInquiry() {
    const { error } = await supabase
      //this is the supabase tablename
      .from('customer_inqury') 
      .insert([
        {
          //the left side is the variable name in the table in supabase
          //the right side is the local variable name 
          FnameLname: formData.firstNameAndLastName,
          Phone_Number: formData.phoneNumber,
          Email_Address: formData.emailAddress,
          Event_Date: formData.eventDate, 
          Event_Time: formData.eventTime,
          //nick make a new column for the remaining fields in the inqury page in the supabase
          //then make the columnname: formData.inquryname
        }
      ]);
  
    if (error) {
      console.error('Error creating inquiry:', error);
      return;
    }
  
    // Clear form fields after submission
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
  
    // Fetch the updated list of inquiries
    fetchInquires();
  }
  
  //once the user clicks the submit button this function is called and it call createInquiry()
  //which inserts the values into the db
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    await createInquiry();
  };

  // this fucntion makes it so the form data is updated when the user enters a vlaue for a feild such as ruben ortega for firstNameAndLastName
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
        <br /><br />
        Non-Bridal and Bridal bookings are open for 2024/2025.
        <br /><br />
        To inquire about availability, please complete the form below and I will reach out within 3-5 days regarding availability.
        <br /><br />
        All inquiries will be responded to via text or email.
      </p>
      <div className="form-container">
        {/*user clicks submit the handle submit function is called*/}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstNameAndLastName">First Name and Last Name:<span className="required">*</span></label>
              {/*user enters something in the text feild the handle change function is called*/}
            <input type="text" id="firstNameAndLastName" name="firstNameAndLastName" value={formData.firstNameAndLastName} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number:<span className="required">*</span></label>
            <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} placeholder="XXX-XXX-XXXX" onChange={handleChange} />
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
          <div className="form-group">
            <label htmlFor="clientsHairAndMakeup">Number of clients requiring both hair and makeup:<span className="required">*</span></label>
            <input type="number" id="clientsHairAndMakeup" name="clientsHairAndMakeup" value={formData.clientsHairAndMakeup} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="clientsHairOnly">Number of clients requiring only hair:<span className="required">*</span></label>
            <input type="number" id="clientsHairOnly" name="clientsHairOnly" value={formData.clientsHairOnly} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="clientsMakeupOnly">Number of clients requiring only makeup:<span className="required">*</span></label>
            <input type="number" id="clientsMakeupOnly" name="clientsMakeupOnly" value={formData.clientsMakeupOnly} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="locationAddress">Location/Address you’d like me to commute to:<span className="required">*</span></label>
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