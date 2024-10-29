import React, { useState } from "react";
import "../Styles/BookingInquiry.css";

// Component for handling booking inquiries
function BookingInquiry() {
  // State variable to store form data
  const [formData, setFormData] = useState({
    firstNameAndLastName: "",
    phoneNumber: "",
    emailAddress: "",
    eventDate: "",
    eventTime: "",
    eventType: "",
    eventName: "",
    clientsHairAndMakeup: 0,
    clientsHairOnly: 0,
    clientsMakeupOnly: 0,
    locationAddress: "",
    additionalNotes: "",
  });

  // State variable to store form validation errors
  const [formErrors, setFormErrors] = useState({});

  // Function to handle changes in form input fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for phone number formatting
    if (name === "phoneNumber") {
      // Remove non-digit characters from phone number
      const cleanedValue = value.replace(/[^0-9]/g, "");
      let formattedValue = "";

      // Format phone number with dashes (XXX-XXX-XXXX)
      if (cleanedValue.length > 0) {
        formattedValue += cleanedValue.slice(0, 3);
      }
      if (cleanedValue.length > 3) {
        formattedValue += "-" + cleanedValue.slice(3, 6);
      }
      if (cleanedValue.length > 6) {
        formattedValue += "-" + cleanedValue.slice(6, 10);
      }

      setFormData((prevState) => ({ ...prevState, [name]: formattedValue }));
      validateField(name, formattedValue);
    // Special handling for client count fields (limit to 2 digits)
    } else if (["clientsHairAndMakeup", "clientsHairOnly", "clientsMakeupOnly"].includes(name)) {
        const limitedValue = value.slice(0, 2);
        setFormData((prevState) => ({ ...prevState, [name]: limitedValue }));
        validateField(name, limitedValue);
    // Handling for all other input fields
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
      validateField(name, value);
    }
  };

  // Function to perform real-time validation of individual fields
  const validateField = (name, value) => {
    const errors = { ...formErrors };
    // Regular expressions for validation
    const nameRegex = /^[a-zA-Z]{2,} [a-zA-Z]{2,}$/; // At least two letters for each name part
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/; // Basic phone number format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format


    switch (name) {
      case "firstNameAndLastName":
        // Validate first and last name (required and format)
        if (!value.trim() || !nameRegex.test(value.trim())) {
          errors.firstNameAndLastName = "Valid First and Last Name required (at least two letters each, e.g., John Smith)";
        } else {
          delete errors.firstNameAndLastName; // Clear error if valid
        }
        break;
      case "phoneNumber":
        // Validate phone number (10 digits, and other basic checks)
        const cleanedPhoneNumber = value.replace(/[^0-9]/g, "");
        if (cleanedPhoneNumber.length !== 10 || !/^[2-9]\d{2}[2-9]\d{2}\d{4}$/.test(cleanedPhoneNumber)) {
          errors.phoneNumber = "Please enter a valid 10-digit phone number (e.g., 123-456-7890).";
        } else {
          delete errors.phoneNumber; // Clear error if valid
        }
        break;
      case "emailAddress":
        // Validate email address format
        if (!value.trim() || !emailRegex.test(value.trim())) {
          errors.emailAddress = "Valid email address required";
        } else {
          delete errors.emailAddress; // Clear error if valid
        }
        break;

        case "eventDate":
          // Validate event date (within the next 60 days)
          const maxDate = new Date();
          maxDate.setDate(maxDate.getDate() + 60); // Calculate the maximum date (60 days from today)
          const selectedDate = new Date(value); // Convert the selected date string to a Date object
  
          if (selectedDate < new Date() || selectedDate > maxDate) {
            // Set error if the selected date is before today or after the maximum date
            errors.eventDate = "Please select a date within the next 60 days.";
          } else {
            delete errors.eventDate; // Clear error if valid
          }
          break;
        case "eventTime":
          if (!value) {
            // Validate event time (required)
            errors.eventTime = "Required";
          } else {
            delete errors.eventTime; // Clear error if valid
          }
          break;
        case "eventType":
          // Validate event type (required)
          if (!value) {
            errors.eventType = "Required";
          } else {
            delete errors.eventType; // Clear error if valid
          }
          break;
        case "eventName":
          // Validate event name (required)
          if (!value) {
            errors.eventName = "Required";
          } else {
            delete errors.eventName; // Clear error if valid
          }
          break;
        case "clientsHairAndMakeup":
        case "clientsHairOnly":
        case "clientsMakeupOnly":
          // Validate client counts (must be a number between 0 and 10)
          const numClients = parseInt(value, 10);
          if (isNaN(numClients) || numClients < 0 || numClients > 10) {
            errors[name] = "Please enter a number between 0 and 10.";
          } else {
            delete errors[name]; // Clear error if valid
          }
          break;
        case "locationAddress":
          // Validate location address (required)
          if (!value.trim()) {
            errors.locationAddress = "Required";
          } else {
            delete errors.locationAddress; // Clear error if valid
          }
          break;
      default:
        break;
    }
  
    setFormErrors(errors);
  };
  
  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
  
    // Perform full form validation before submission
    if (!validateForm()) {
      return;
    }
  
    // Capitalize first and last name, and lowercase email before submission
    const capitalizedName = capitalizeName(formData.firstNameAndLastName);
    const lowercaseEmail = formData.emailAddress.toLowerCase();
    const updatedFormData = { ...formData, firstNameAndLastName: capitalizedName, emailAddress: lowercaseEmail };
  
    try {
      // Send form data to the backend API endpoint
      const response = await fetch("http://glambymanpreet-env.eba-dnhqtbpj.us-east-2.elasticbeanstalk.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData), // Convert form data to JSON
      });
  
      // Handle successful form submission
      if (response.ok) {
        alert("Form submitted successfully!");
        // Reset form fields and clear errors
        setFormData({
          firstNameAndLastName: "",
          phoneNumber: "",
          emailAddress: "",
          eventDate: "",
          eventTime: "",
          eventType: "",
          eventName: "",
          clientsHairAndMakeup: 0,
          clientsHairOnly: 0,
          clientsMakeupOnly: 0,
          locationAddress: "",
          additionalNotes: "",
        });
        setFormErrors({});
      } else {
        // Handle form submission error
        alert("Failed to submit form. Please try again later.");
      }
    } catch (error) {
      // Handle network or other errors during submission
      console.error("Error:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  // Helper function to capitalize the first letter of each word in a string
  const capitalizeName = (name) => {
    if (!name) return ""; // Return empty string if input is empty or null

    // Split the name into words, capitalize the first letter of each word,
    // convert the rest to lowercase, and join the words back into a string
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Function to perform full form validation
  const validateForm = () => {
    const errors = {}; // Object to store validation errors

    // Regular expressions for validation
    const nameRegex = /^[a-zA-Z]{2,} [a-zA-Z]{2,}$/; // First and Last Name (at least 2 letters each)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/; // Phone number format (XXX-XXX-XXXX)

    // Calculate maximum date for eventDate (60 days from today)
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 60);
    const selectedDate = new Date(formData.eventDate);

    // Array of client count fields for validation
    const clientFields = ["clientsHairAndMakeup", "clientsHairOnly", "clientsMakeupOnly"];

    // Validate First and Last Name (required and format)
    if (!formData.firstNameAndLastName.trim() || !nameRegex.test(formData.firstNameAndLastName.trim())) {
      errors.firstNameAndLastName = "First and Last Name Required";
    }
    // Validate Phone Number (required and format)
    if (!formData.phoneNumber.trim() || !phoneRegex.test(formData.phoneNumber)) {
      errors.phoneNumber = "Valid phone number required (XXX-XXX-XXXX)";
    }
    // Validate Email Address (required and format)
    if (!formData.emailAddress.trim() || !emailRegex.test(formData.emailAddress.trim())) {
      errors.emailAddress = "Valid email address required";
    }
    // Validate Event Date (within the next 60 days)
    if (selectedDate < new Date() || selectedDate > maxDate) {
      errors.eventDate = "Please select a date within the next 60 days.";
    }
    // Validate Event Time (required)
    if (!formData.eventTime) {
      errors.eventTime = "Required";
    }
    // Validate Event Type (required)
    if (!formData.eventType) {
      errors.eventType = "Required";
    }
    // Validate Event Name (required)
    if (!formData.eventName) {
      errors.eventName = "Required";
    }
    // Validate Client Count fields (must be a number between 0 and 10)
    clientFields.forEach((field) => {
      const numClients = parseInt(formData[field], 10);
      if (isNaN(numClients) || numClients < 0 || numClients > 10) {
        errors[field] = "Please enter a number between 0 and 10.";
      }
    });
    // Validate Location Address (required)
    if (!formData.locationAddress.trim()) {
      errors.locationAddress = "Required";
    }

    // Update form errors state and return validation result
    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors, false otherwise
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
            {formErrors.firstNameAndLastName && (
              <span className="error">{formErrors.firstNameAndLastName}</span>
            )}
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
              onBlur={handleChange}
            />
            {formErrors.phoneNumber && (
              <span className="error">{formErrors.phoneNumber}</span>
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
              onBlur={handleChange}
            />
            {formErrors.emailAddress && (
              <span className="error">{formErrors.emailAddress}</span>
            )}
          </div>
          <div className="form-group">
          <label htmlFor="eventDate">
            Date of Event (must be within 60 days): <span className="required">*</span>
            </label>
            <input
              type="date"
              id="eventDate"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              onBlur={handleChange} // Validate on blur as well
              min={new Date().toISOString().split("T")[0]} // Set min to today
              max={new Date(new Date().setDate(new Date().getDate() + 60)).toISOString().split("T")[0]} // Set max to 60 days from today
            />
            {formErrors.eventDate && (
            <span className="error">{formErrors.eventDate}</span>
            )}
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
            {formErrors.eventTime && (
              <span className="error">{formErrors.eventTime}</span>
            )}
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
              <option value="Bridal">Bridal</option>
              <option value="Non-Bridal">Non-Bridal</option>
            </select>
            {formErrors.eventType && (
              <span className="error">{formErrors.eventType}</span>
            )}
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
              <option value="Other">Other</option>
            </select>
            {formErrors.eventName && (
              <span className="error">{formErrors.eventName}</span>
            )}
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
              onBlur={handleChange}
              min="0"
              max="10"
            />
            {formErrors.clientsHairAndMakeup && (
              <span className="error">{formErrors.clientsHairAndMakeup}</span>
            )}
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
              onBlur={handleChange}
              min="0"
              max="10"
            />
            {formErrors.clientsHairOnly && (
              <span className="error">{formErrors.clientsHairOnly}</span>
            )}
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
              onBlur={handleChange}
              min="0"
              max="10"
            />
            {formErrors.clientsMakeupOnly && (
              <span className="error">{formErrors.clientsMakeupOnly}</span>
            )}
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
            {formErrors.locationAddress && (
              <span className="error">{formErrors.locationAddress}</span>
            )}
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