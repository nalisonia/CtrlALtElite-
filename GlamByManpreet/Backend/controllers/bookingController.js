// CRUD stuff in here

const pool = require('../db'); // Assuming you have a db.js file for database connection
const { sendEmail } = require('../utils/email'); // Import email utility
const { sendSMS } = require('../utils/sms'); // Import SMS utility

const submitInquiry = async (req, res) => {
  const {
    firstNameAndLastName,
    phoneNumber,
    emailAddress,
    eventDate,
    eventTime,
    eventType,
    eventName,
    clientsHairAndMakeup,
    clientsHairOnly,
    clientsMakeupOnly,
    locationAddress,
    additionalNotes,
  } = req.body;

  try {
    // 1. Insert into Users table
    const userResult = await pool.query(
      'INSERT INTO Users (firstnameandlastname, phonenumber, emailaddress, eventdate, eventtime, eventtype, eventname, clientshairandmakeup, clientshaironly, clientsmakeuponly, locationaddress, additionalnotes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id',
      [firstNameAndLastName, phoneNumber, emailAddress, eventDate, eventTime, eventType, eventName, clientsHairAndMakeup, clientsHairOnly, clientsMakeupOnly, locationAddress, additionalNotes]
    );

    const userId = userResult.rows[0].id;

    // 2. Insert into Clients table
    const clientResult = await pool.query(
      'INSERT INTO Clients (name, email, phone) VALUES ($1, $2, $3) RETURNING id',
      [firstNameAndLastName, emailAddress, phoneNumber]
    );

    const clientId = clientResult.rows[0].id;

    // 3. Insert into Bookings table
    await pool.query(
      'INSERT INTO Bookings (client_id, event_date, event_time, event_type, event_name, hair_and_makeup, hair_only, makeup_only, location, additional_notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [clientId, eventDate, eventTime, eventType, eventName, clientsHairAndMakeup, clientsHairOnly, clientsMakeupOnly, locationAddress, additionalNotes]
    );

    // Send SMS and email notifications
    sendSMS(phoneNumber, 'Your request has been submitted successfully!');
    await sendEmail(emailAddress, 'Request Submitted', `Dear ${firstNameAndLastName}, your request for ${eventName} has been submitted successfully.`);

    res.status(201).send('Data inserted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error inserting data');
  }
};

const getBookings = async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          b.id, 
          b.client_id,
          c.name AS client_name, 
          TO_CHAR(b.event_date, 'MM/DD/YYYY') AS event_date, 
          b.event_time, 
          b.event_type, 
          b.event_name, 
          b.hair_and_makeup, 
          b.hair_only, 
          b.makeup_only, 
          b.location, 
          b.additional_notes
        FROM 
          bookings b
        JOIN 
          clients c ON b.client_id = c.id;
      `);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving bookings');
    }
  };
  
  const updateBooking = async (req, res) => {
    const bookingId = req.params.id;
    const {
      clientId,
      eventDate,
      eventTime,
      eventType,
      eventName,
      clientsHairAndMakeup,
      clientsHairOnly,
      clientsMakeupOnly,
      locationAddress,
      additionalNotes,
    } = req.body;
  
    try {
      const query = `
        UPDATE bookings
        SET 
          client_id = $1,
          event_date = $2,
          event_time = $3,
          event_type = $4,
          event_name = $5,
          hair_and_makeup = $6,
          hair_only = $7,
          makeup_only = $8,
          location = $9,
          additional_notes = $10
        WHERE id = $11;
      `;
  
      const values = [
        clientId,
        eventDate,
        eventTime,
        eventType,
        eventName,
        clientsHairAndMakeup,
        clientsHairOnly,
        clientsMakeupOnly,
        locationAddress,
        additionalNotes,
        bookingId,
      ];
  
      await pool.query(query, values);
      res.status(200).send('Booking updated successfully');
    } catch (err) {
      console.error('Error updating booking:', err);
      res.status(500).send('Error updating booking');
    }
  };
  
  const deleteBooking = async (req, res) => {
    const bookingId = req.params.id;
  
    try {
      const query = 'DELETE FROM bookings WHERE id = $1';
      await pool.query(query, [bookingId]);
      res.status(200).send('Booking deleted successfully');
    } catch (err) {
      console.error('Error deleting booking:', err);
      res.status(500).send('Error deleting booking');
    }
  };
  
  module.exports = { 
    submitInquiry, 
    getBookings, 
    updateBooking, 
    deleteBooking 
  };