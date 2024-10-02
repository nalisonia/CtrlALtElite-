const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const twilio = require('twilio');
const mailgun = require('mailgun-js');

// Twilio configuration
const accountSid = 'ACb8d0a7506b082cc14d5a44626529e90f';
const authToken = '269657f1d2e1585fe7c8632bfa4ee18d';
const client = new twilio(accountSid, authToken);

// Mailgun configuration
const mg = mailgun({
  apiKey: 'a7a6805240942f8ece3c39ca4d0aef00-3724298e-3111ceaa',
  domain: 'sandbox58b702121f8041d0a7569abb241c2572.mailgun.org'
});

const app = express();
const port = 3000;

// PostgreSQL connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5432,
});

// Use CORS middleware to allow the frontend to communicate with the backend since they are using different ports
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:3001' 
}));

// Middleware to parse JSON
app.use(express.json());

// Function to send SMS
function sendSMS(phoneNumber, message) {
  client.messages.create({
    body: message,
    from: '+19162327485',
    to: phoneNumber
  })
  .then(message => console.log(`SMS sent: ${message.sid}`))
  .catch(err => console.error(`Error sending SMS: ${err}`));
}

// Function to send email using Mailgun (using async/await for consistency)
async function sendEmail(email, subject, message) {
  const data = {
    from: 'glambymanpreetinquiries@gmail.com', // Ensure this is an authorized sender email
    to: email,
    subject: subject,
    text: message
  };

  try {
    const body = await mg.messages().send(data);
    console.log('Email sent:', body);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Route to fetch all users
app.get('/users', async (req, res) => {
  try {
    // Fetch all users from the database
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving users');
  }
});

// Route to handle inquiry submission
app.post('/submit', async (req, res) => {
  const firstNameAndLastName = req.body.firstNameAndLastName;
  const phoneNumber = req.body.phoneNumber;
  const emailAddress = req.body.emailAddress;
  const eventDate = req.body.eventDate;
  const eventTime = req.body.eventTime;
  const eventType = req.body.eventType;
  const eventName = req.body.eventName;

  // If the fields are empty or not provided, set them to null instead of empty strings
  const clientsHairAndMakeup = req.body.clientsHairAndMakeup || null;
  const clientsHairOnly = req.body.clientsHairOnly || null;
  const clientsMakeupOnly = req.body.clientsMakeupOnly || null;

  const locationAddress = req.body.locationAddress;
  const additionalNotes = req.body.additionalNotes;

  try {
    const query = `
      INSERT INTO users (
        firstnameandlastname, phonenumber, emailaddress, eventdate, eventtime, eventtype, eventname,
        clientshairandmakeup, clientshaironly, clientsmakeuponly, locationaddress, additionalnotes
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
      )
    `;
    
    const values = [
      firstNameAndLastName, phoneNumber, emailAddress, eventDate, eventTime, eventType, eventName,
      clientsHairAndMakeup, clientsHairOnly, clientsMakeupOnly, locationAddress, additionalNotes
    ];

  
    await pool.query(query, values);

     // Send SMS notification after successful submission
    sendSMS(phoneNumber, 'Your request has been submitted successfully!');
    await sendEmail(emailAddress, 'Request Submitted', `Dear ${firstNameAndLastName}, your request for ${eventName} has been submitted successfully.`);
    res.status(201).send('Data inserted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error inserting data');
  }
});

// Route to handle approval or decline of an inquiry
app.post('/inquiry-status', async (req, res) => {
  const { userId, status } = req.body; // Status should be either 'approved' or 'declined'

  try {
    // Insert or update the user's inquiry status in the new inquiry_status table
    const query = `
      INSERT INTO inquiry_status (user_id, status, updated_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id)
      DO UPDATE SET status = $2, updated_at = CURRENT_TIMESTAMP
    `;
    await pool.query(query, [userId, status]);

    // Retrieve user details for notification
    const userResult = await pool.query('SELECT emailaddress, firstnameandlastname FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Send email to notify the user of the status
    const subject = `Inquiry ${status === 'approved' ? 'Approved' : 'Declined'}`;
    const message = `Dear ${user.firstnameandlastname}, your inquiry has been ${status}.`;

    await sendEmail(user.emailaddress, subject, message);

    res.status(200).send(`Inquiry ${status} notification sent successfully`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating inquiry status');
  }
});

// Route to delete users
app.delete('/users', async (req, res) => {
   //req will contain the ids of the entries to delete in the db
  // here we are creating an array named id and we are getting the ids being passed in from the front end
  const { ids } = req.body;
  
  // Make sure the array is not empty if so send an error
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).send('Invalid IDs');
  }

  try {
     //sql statmenet to delete from the users table using the id and we are not limited to deleting one at a time
    const query = 'DELETE FROM users WHERE id = ANY($1::int[])';
    //executes query
    await pool.query(query, [ids]);
    res.status(200).send('Users deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting users');
  }
});

// ****************************************************************************
// Route - Add clients into the Clients table after Booking Inquiry submission
// ****************************************************************************
app.post('/addClient', async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    const query = `
      INSERT INTO clients (name, email, phone)
      VALUES ($1, $2, $3)
      RETURNING id;
    `;

    const values = [name, email, phone];

    const result = await pool.query(query, values);
    const clientId = result.rows[0].id;

    res.status(201).json({ clientId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error inserting client data');
  }
});

// ********************************************
// Route - Read clients from the Clients Table
// ********************************************
app.get('/clients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clients');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving clients');
  }
});

// *************************************************
// Route - Edit/Update clients in the Clients Table
// *************************************************
app.put('/clients/:id', async (req, res) => {
  const clientId = req.params.id;
  const { name, email, phone } = req.body;

  try {
    const query = `
      UPDATE clients 
      SET name = $1, email = $2, phone = $3 
      WHERE id = $4;
    `;
    const values = [name, email, phone, clientId];
    await pool.query(query, values);
    res.status(200).send('Client updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating client');
  }
});

// ***********************************************
// Route - Delete clients from the Clients Table
// ***********************************************
app.delete('/clients/:id', async (req, res) => {
  const clientId = req.params.id;

  try {
    const query = 'DELETE FROM clients WHERE id = $1';
    await pool.query(query, [clientId]);
    res.status(200).send('Client deleted successfully');
  } catch (err) {
    console.error('Error deleting client:', err);
    res.status(500).send('Error deleting client');
  }
});

// **********************************************************************************
// Route - Add booking info into the Bookings table after Booking Inquiry submission
// **********************************************************************************
app.post('/addBooking', async (req, res) => {
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
    additionalNotes 
  } = req.body;

  try {
    const query = `
      INSERT INTO bookings (
        client_id, event_date, event_time, event_type, event_name, 
        hair_and_makeup, hair_only, makeup_only, location, additional_notes
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      )
      RETURNING id;
    `;

    const values = [
      clientId, eventDate, eventTime, eventType, eventName, 
      clientsHairAndMakeup, clientsHairOnly, clientsMakeupOnly, locationAddress, additionalNotes
    ];

    const result = await pool.query(query, values);
    const bookingId = result.rows[0].id;

    res.status(201).json({ bookingId });
  } catch (err) {
    console.error("Error inserting booking data: ", err);
    res.status(500).send('Error inserting booking data');
  }
});

// **************************************************
// Route - Read booking info from the Bookings Table
// **************************************************
app.get('/bookings', async (req, res) => {
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
    console.log(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving bookings');
  }
});

// ***************************************************
// Route - Edit/Update bookings in the Bookings Table
// ***************************************************
app.put('/bookings/:id', async (req, res) => {
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
});

// *************************************************
// Route - Delete bookings from the Bookings Table
// *************************************************
app.delete('/bookings/:id', async (req, res) => {
  const bookingId = req.params.id;

  try {
    const query = 'DELETE FROM bookings WHERE id = $1';
    await pool.query(query, [bookingId]);
    res.status(200).send('Booking deleted successfully');
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).send('Error deleting booking');
  }
});

// **********************************
// Route - Get upcoming appointments 
// **********************************
app.get('/upcomingAppointments', async (req, res) => {
  try {
    const today = new Date();
    const nextFewDays = new Date();
    nextFewDays.setDate(today.getDate() + 3); // Fetch appointments for the next 3 days (you can adjust this)

    const query = `
      SELECT 
        b.id, 
        b.client_id,
        c.name AS client_name, 
        TO_CHAR(b.event_date, 'MM/DD/YYYY') AS event_date, 
        b.event_time, 
        b.event_type, 
        b.event_name
      FROM 
        bookings b
      JOIN 
        clients c ON b.client_id = c.id
      WHERE 
        b.event_date >= $1 AND b.event_date <= $2;
    `;

    const values = [format(today, 'yyyy-MM-dd'), format(nextFewDays, 'yyyy-MM-dd')];

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching upcoming appointments:', err);
    res.status(500).send('Error retrieving upcoming appointments');
  }
});

// ********************************
// Route - Insert feed submissions 
// ********************************

app.post('/feed', async (req, res) => {
  const { content } = req.body;

  try {
    const query = 'INSERT INTO feed (content) VALUES ($1)';
    await pool.query(query, [content]);
    res.status(201).send('Feed item added successfully');
  } catch (error) {
    console.error('Error adding feed item:', error);
    res.status(500).send('Error adding feed item');
  }
});

// *****************************
// Route - Get feed submissions 
// *****************************
app.get('/feed', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM feed ORDER BY created_at DESC'); // Assuming you have a created_at column
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching feed data:', error);
    res.status(500).send('Error fetching feed data');
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
