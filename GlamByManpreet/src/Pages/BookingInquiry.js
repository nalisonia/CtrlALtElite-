import React, { useState, useEffect } from "react";
import "../Styles/BookingInquiry.css";
import supabase from "../config/supabaseClient.js";

function BookingInquiry() {
  const [inquires, setInquires] = useState([]);
  const [formData, setFormData] = useState({
    firstNameAndLastName: "",
    phoneNumber: "",
    emailAddress: "",
    eventDate: "",
    eventTime: "",
    eventType: "",
    eventName: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchInquires();
  }, []);

  async function fetchInquires() {
    const { data, error } = await supabase.from("customer_inqury").select();

    if (error) {
      console.error("Error fetching inquiries:", error);
      return;
    }
    setInquires(data);
  }

  async function createInquiry() {
    const { error } = await supabase.from("customer_inqury").insert([
      {
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
      },
    ]);

    if (error) {
      console.error("Error creating inquiry:", error);
      return;
    }

    setFormData({
      firstNameAndLastName: "",
      phoneNumber: "",
      emailAddress: "",
      eventDate: "",
      eventTime: "",
      eventType: "",
      eventName: "",
      clientsHairAndMakeup: "",
      clientsHairOnly: "",
      clientsMakeupOnly: "",
      locationAddress: "",
      additionalNotes: "",
    });

    fetchInquires();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    let validationErrors = {};
    const phonePattern = /^\d{3}-\d{3}-\d{4}$/;

    // Phone number validation
    if (!phonePattern.test(formData.phoneNumber)) {
      validationErrors.phoneNumber =
        "Phone number must be in the format XXX-XXX-XXXX.";
    }

    // Check if there are any validation errors
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Stop form submission if there are validation errors
    }

    // Clear errors if validation passes
    setErrors({});
    await createInquiry();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="booking-inquiry">
      <h1>BOOKING INQUIRY</h1>
      <div className="form-container">
        {/*user clicks submit the handle submit function is called*/}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstNameAndLastName">
              First Name and Last Name:<span className="required">*</span>
            </label>
            <input
              type="text"
              id="firstNameAndLastName"
              name="firstNameAndLastName"
              value={formData.firstNameAndLastName}
              //user enters something in the text feild the handle change function is called
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">
              Phone Number:<span className="required">*</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              placeholder="XXX-XXX-XXXX"
              onChange={handleChange}
            />
            {errors.phoneNumber && (
              <p className="error">{errors.phoneNumber}</p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="emailAddress">
              Email Address:<span className="required">*</span>
            </label>
            <input
              type="email"
              id="emailAddress"
              name="emailAddress"
              value={formData.emailAddress}
              placeholder="your@email.com"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="eventDate">
              Date of Event:<span className="required">*</span>
            </label>
            <input
              type="date"
              id="eventDate"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="eventTime">
              Ready By Time:<span className="required">*</span>
            </label>
            <input
              type="time"
              id="eventTime"
              name="eventTime"
              value={formData.eventTime}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="eventType">
              Type of Service:<span className="required">*</span>
            </label>
            <select
              id="eventType"
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
            >
              <option value="">Select a service</option>
              <option value="bridal">Bridal</option>
              <option value="non-bridal">Non-Bridal</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="eventName">
              Name of the event(s):<span className="required">*</span>
            </label>
            <select
              id="eventName"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
            >
              <option value="">Select an event</option>
              <option value="Wedding Engagement">Wedding Engagement</option>
              <option value="Rokha">Rokha</option>
              <option value="Laggo">Laggo</option>
              <option value="Mehndi">Mehndi</option>
              <option value="Photoshoot">Photoshoot</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="clientsHairAndMakeup">
              Number of clients requiring both hair and makeup:
              <span className="required">*</span>
            </label>
            <input
              type="number"
              id="clientsHairAndMakeup"
              name="clientsHairAndMakeup"
              value={formData.clientsHairAndMakeup}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="clientsHairOnly">
              Number of clients requiring only hair:
              <span className="required">*</span>
            </label>
            <input
              type="number"
              id="clientsHairOnly"
              name="clientsHairOnly"
              value={formData.clientsHairOnly}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="clientsMakeupOnly">
              Number of clients requiring only makeup:
              <span className="required">*</span>
            </label>
            <input
              type="number"
              id="clientsMakeupOnly"
              name="clientsMakeupOnly"
              value={formData.clientsMakeupOnly}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="locationAddress">
              Location/Address you’d like me to commute to:
              <span className="required">*</span>
            </label>
            <input
              type="text"
              id="locationAddress"
              name="locationAddress"
              value={formData.locationAddress}
              onChange={handleChange}
            />
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
          {/* Other form fields */}
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default BookingInquiry;
