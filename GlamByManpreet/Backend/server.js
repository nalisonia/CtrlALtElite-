const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

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
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Route that listens for get requests from the front end
app.get('/users', async (req, res) => {
  try {
    // The sql query that the route runs is selecting all from the table users
    const result = await pool.query('SELECT * FROM users');
    // Converts to json and sends it to the front end
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving users');
  }
});


// Route to handle writing to the database
//req has the data from the front end and in this case the data from the customer inquiry page
app.post('/submit', async (req, res) => {
    //assigns the field in the req to the variable that matches the db name that we will be passing
    //into the insert statement 
    const firstNameAndLastName = req.body.firstNameAndLastName;
    const phoneNumber = req.body.phoneNumber;
    const emailAddress = req.body.emailAddress;
    const eventDate = req.body.eventDate;
    const eventTime = req.body.eventTime;
    const eventType = req.body.eventType;
    const eventName = req.body.eventName;
    const clientsHairAndMakeup = req.body.clientsHairAndMakeup;
    const clientsHairOnly = req.body.clientsHairOnly;
    const clientsMakeupOnly = req.body.clientsMakeupOnly;
    const locationAddress = req.body.locationAddress;
    const additionalNotes = req.body.additionalNotes;
    


  try {
      // Define the SQL query to insert new data into the users table.
      // The query includes placeholders ($1, $2, etc.) for the values to be inserted.
    const query = `
    INSERT INTO users (
      firstnameandlastname, phonenumber, emailaddress, eventdate, eventtime, eventtype, eventname,
      clientshairandmakeup, clientshaironly, clientsmakeuponly, locationaddress, additionalnotes
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
    )
  `;
  
  // Array of values that hold the data that will be inserted into the database
  const values = [
    firstNameAndLastName, phoneNumber, emailAddress, eventDate, eventTime, eventType, eventName,
    clientsHairAndMakeup, clientsHairOnly, clientsMakeupOnly, locationAddress, additionalNotes
  ];

    //inserts the data into the dbs
    await pool.query(query, values);
    res.status(201).send('Data inserted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error inserting data');
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

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
