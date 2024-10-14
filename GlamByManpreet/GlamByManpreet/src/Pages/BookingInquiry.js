import React, { useState } from "react";
import "../Styles/BookingInquiry.css";

//psql -U postgres -d glam_by_manpreet -p 5432

// Connect to a PostgreSQL database
// \c database_name

// List all databases
// \l

// List all tables in the current database
// \dt

// Describe the structure of a specific table
// \d table_name

// Display the schema of the table (columns, types, constraints, etc.)
// \d+ table_name

//state vraible named formDara that holds the feilds listed below
//setFormData is used to assign values to the feilds listed below
function BookingInquiry() {
  const [formData, setFormData] = useState({
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

  //user clicks on the sumbit button this function will execute
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    try {
      //sends the inquiry data to the route we defined in the backend folder named server.js must be running for it to work
      //also local db instance also has tp be running
      const response = await fetch("http://localhost:3000/submit", {
        //post means were sending data as a json file
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        //then sends the data as the request body or just as req as seen in the backend
        body: JSON.stringify(formData),
      });
      // if everyhting was chill we clear the fields
      if (response.ok) {
        alert("Form submitted successfully!");
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
      } else {
        alert("Failed to submit form");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Function to handle changes in form input fields
  const handleChange = (e) => {
    // Destructure 'name' and 'value' from the event target
    const { name, value } = e.target;

    // Update the form data state
    setFormData((prevState) => ({
      // Spread the previous state to retain existing field values
      ...prevState,
      // Update the specific field with the new value
      [name]: value,
    }));
  };

  return (
    <div className="booking-inquiry">
      <h1>BOOKING INQUIRY</h1>
      <p className="response-time">
        Thank you for inquiring with Glam By Manpreet for your hair and makeup
        services!
        <br />
        <br />
        Non-Bridal and Bridal bookings are open for 2024/2025.
        <br />
        <br />
        To inquire about availability, please complete the form below and I will
        reach out within 3-5 days regarding availability.
        <br />
        <br />
        All inquiries will be responded to via text or email.{" "}
      </p>
      <div className="form-container">
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
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default BookingInquiry;
