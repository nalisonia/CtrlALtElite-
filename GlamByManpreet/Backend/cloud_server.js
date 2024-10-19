// server.js
//gets and loads the env variables
require("dotenv").config({ path: "../.env" });
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const twilio = require("twilio");
const mailgun = require("mailgun-js");
const helmet = require("helmet");
const supabase = require("../src/config/supabaseClient.js");

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

// Mailgun configuration
const mg = mailgun({
  apiKey: "a7a6805240942f8ece3c39ca4d0aef00-3724298e-3111ceaa",
  domain: "sandbox58b702121f8041d0a7569abb241c2572.mailgun.org",
});
const bcrypt = require("bcrypt");
const session = require("express-session"); // Import session middleware
const crypto = require("crypto"); // Import crypto module
const nodemailer = require("nodemailer");
require("dotenv").config(); // Load environment variables from .env file
const app = express();
const port = process.env.PORT || 3000;

// /  / PostgreSQL connection configuration using environment variables from .env file and .env.example file
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// Session middleware setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-default-secret-key",
    resave: false,
    saveUninitialized: true,
    //cookie: { secure: process.env.NODE_ENV === 'production' ? true : false },
    cookie: { secure: false }, // Ensure secure is false during development
  })
);

// PostgreSQL connection configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
//Test to see if .env loads(remove later)
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASSWORD);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PORT:", process.env.DB_PORT);

// CORS configuration
app.use(
  cors({
    origin: "*", // Allow access from all origins
    credentials: true, // Allow cookies, auth headers
  })
);

app.use(express.json());

// Set Content Security Policy
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-eval'"],
    },
  })
);

// Your other middleware and route handlers go here...

//const PORT = process.env.PORT || 3000;
//app.listen(PORT, () => {
//console.log(`Server is running on port ${PORT}`);
//});
// Route to handle password reset


// ********************************************
// These routes are tested and hosted
// ********************************************


// ********************************************
// Function to send SMS
// ********************************************
function sendSMS(phoneNumber, message) {
  client.messages
    .create({
      body: message,
      from: "+19165709722",
      to: phoneNumber,
    })
    .then((message) => console.log(`SMS sent: ${message.sid}`))
    .catch((err) => console.error(`Error sending SMS: ${err}`));
}



async function sendEmail(email, subject, message) {
  const data = {
    from: "glambymanpreetinquiries@gmail.com", // Ensure this is an authorized sender email
    to: email,
    subject: subject,
    text: message,
  };

  try {
    const body = await mg.messages().send(data);
    console.log("Email sent:", body);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}



// ********************************************
// Route to handle inquiry submission
// ********************************************

app.post("/submit", async (req, res) => {
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
    // Insert into 'clients_dev' table
    const { data: clientData, error: clientError } = await supabase
      .from("clients_dev")
      .insert([
        {
          name: firstNameAndLastName,
          email: emailAddress,
          phone: phoneNumber,
        },
      ])
      .select("id"); // Retrieve the inserted client ID

    if (clientError || !clientData || clientData.length === 0) {
      throw new Error(`Error inserting client: ${clientError?.message || 'No client data returned'}`);
    }

    // Insert into 'bookings_dev' table
    const { error: bookingError } = await supabase.from("bookings_dev").insert([
      {
        client_id: clientData[0].id, // Use the inserted client ID
        event_date: eventDate,
        event_time: eventTime,
        event_type: eventType,
        event_name: eventName,
        hair_and_makeup: clientsHairAndMakeup,
        hair_only: clientsHairOnly,
        makeup_only: clientsMakeupOnly,
        location: locationAddress,
        additional_notes: additionalNotes,
      },
    ]);

    if (bookingError) {
      throw new Error(`Error inserting booking: ${bookingError.message}`);
    }

    // Send SMS notification after successful submission
    sendSMS(phoneNumber, "Your request has been submitted successfully!");
    await sendEmail(
      emailAddress,
      "Request Submitted",
      `Dear ${firstNameAndLastName}, your request for ${eventName} has been submitted successfully.`
    );

    res.status(201).send("Data inserted successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error inserting data");
  }
});


// ********************************************
// Route to approve or decline inquiry
// ********************************************


app.post("/inquiry-status", async (req, res) => {
  const { clientId, status } = req.body; // Status: 'approved' or 'declined'

  try {
    // Step 1: Retrieve client info from 'clients_dev' using the provided clientId
    const { data: clientData, error: clientError } = await supabase
      .from("clients_dev")
      .select("email, name, phone")
      .eq("id", clientId)
      .single(); // Ensure a single result

    if (clientError || !clientData) {
      return res.status(404).send(`Client not found with id ${clientId}`);
    }

    const { email, name, phone } = clientData;

    // Step 2: Retrieve the booking using the clientId from 'bookings_dev'
    const { data: bookingData, error: fetchError } = await supabase
      .from("bookings_dev")
      .select("id") // We only need the booking ID to update status
      .eq("client_id", clientId)
      .single(); // Ensure a single result

    if (fetchError || !bookingData) {
      return res.status(404).send(`Booking not found for client id ${clientId}`);
    }

    const bookingId = bookingData.id;

    // Step 3: Update the booking status in 'bookings_dev'
    const { error: bookingError } = await supabase
      .from("bookings_dev")
      .update({ booking_status: status })
      .eq("id", bookingId); // Update based on the booking ID

    if (bookingError) throw new Error(bookingError.message);

    // Step 4: Send email and SMS notifications
    const subject = `Inquiry ${status === "approved" ? "Approved" : "Declined"}`;
    const message = `Dear ${name}, your inquiry has been ${status}.`;

    sendSMS(phone, message);
    await sendEmail(email, subject, message);

    res.status(200).send(`Inquiry ${status} notification sent successfully`);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).send("Error updating inquiry status.");
  }
});


// ********************************************
// Route - Read clients from the Clients Table
// ********************************************
app.get("/clients", async (req, res) => {
  try {
    // Query the 'clients_dev' table in Supabase
    const { data, error } = await supabase
      .from("clients_dev")
      .select("*");

    // Check for any errors in the query
    if (error) {
      console.error("Error fetching clients:", error.message);
      return res.status(500).send("Error retrieving clients from Supabase.");
    }

    // Send the data back as a JSON response
    res.json(data);
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).send("Unexpected error retrieving clients.");
  }
});



// *************************************************
// Route - Edit/Update clients in the Clients Table
// *************************************************
app.put("/clients/:id", async (req, res) => {
  const clientId = req.params.id;
  const { name, email, phone } = req.body;

  try {
    // Step 1: Update the client in 'clients_dev' table
    const { error: updateError } = await supabase
      .from("clients_dev")
      .update({
        name: name,
        email: email,
        phone: phone,
      })
      .eq("id", clientId); // Ensure we update the correct client by ID

    // Handle any errors during update
    if (updateError) {
      throw new Error(updateError.message);
    }
    res.status(200).send("Client updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating client");
  }
});



// ***********************************************
// Route - Delete clients from the Clients Table
// ***********************************************
app.delete("/clients/:id", async (req, res) => {
  const clientId = req.params.id;
  try {
    // Delete the client from the 'clients_dev' table
    const { error } = await supabase
      .from("clients_dev")
      .delete()
      .eq("id", clientId); // Match by client ID

    if (error) throw new Error(error.message);

    res.status(200).send("Client deleted successfully");
  } catch (err) {
    console.error("Error deleting client:", err);
    res.status(500).send("Error deleting client");
  }
});

// **************************************************
// Route - Read booking info from the Bookings Table
// **************************************************
app.get("/bookings", async (req, res) => {
  try {
    // Step 1: Get all clients from 'clients_dev'
    const { data: clients, error: clientError } = await supabase
      .from("clients_dev")
      .select("id, name");

    if (clientError) {
      console.error("Error fetching clients:", clientError.message);
      return res.status(500).send("Error retrieving clients.");
    }

    // Step 2: Get all bookings from 'bookings_dev' using client_id as FK
    const { data: bookings, error: bookingError } = await supabase
      .from("bookings_dev")
      .select(
        "id, client_id, event_date, event_time, event_type, event_name, hair_and_makeup, hair_only, makeup_only, location, additional_notes"
      );

    if (bookingError) {
      console.error("Error fetching bookings:", bookingError.message);
      return res.status(500).send("Error retrieving bookings.");
    }

    // Step 3: Join bookings with corresponding clients by client_id
    const combinedData = bookings.map((booking) => {
      const client = clients.find((c) => c.id === booking.client_id) || {};
      return {
        ...booking,
        client_name: client.name || "Unknown",
      };
    });

    // Step 4: Send the joined data as JSON response
    res.json(combinedData);
    console.log(combinedData);
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).send("Unexpected error retrieving bookings.");
  }
});


// ***************************************************
// Route - Edit/Update bookings in the Bookings Table
// ***************************************************
app.put("/bookings/:id", async (req, res) => {
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
    // Step 1: Update the booking in 'bookings_dev'
    const { error: updateError } = await supabase
      .from("bookings_dev")
      .update({
        client_id: clientId,
        event_date: eventDate,
        event_time: eventTime,
        event_type: eventType,
        event_name: eventName,
        hair_and_makeup: clientsHairAndMakeup,
        hair_only: clientsHairOnly,
        makeup_only: clientsMakeupOnly,
        location: locationAddress,
        additional_notes: additionalNotes,
      })
      .eq("id", bookingId); // Match by booking ID

    if (updateError) throw new Error(updateError.message);

    res.status(200).send("Booking updated successfully");
  } catch (err) {
    console.error("Error updating booking:", err);
    res.status(500).send("Error updating booking");
  }
});



// *************************************************
// Route - Delete bookings from the Bookings Table
// *************************************************
app.delete("/bookings/:id", async (req, res) => {
  const bookingId = req.params.id;

  try {
    // Step 1: Retrieve the client ID from the booking
    const { data: bookingData, error: bookingError } = await supabase
      .from("bookings_dev")
      .select("client_id")
      .eq("id", bookingId)
      .single(); // Ensure only one result

    if (bookingError || !bookingData) {
      return res.status(404).send(`Booking not found with id ${bookingId}`);
    }

    const clientId = bookingData.client_id;

    // Step 2: Delete the booking from 'bookings_dev'
    const { error: deleteBookingError } = await supabase
      .from("bookings_dev")
      .delete()
      .eq("id", bookingId);

    if (deleteBookingError) throw new Error(deleteBookingError.message);

    // Step 3: Delete the client from 'clients_dev'
    const { error: deleteClientError } = await supabase
      .from("clients_dev")
      .delete()
      .eq("id", clientId);

    if (deleteClientError) throw new Error(deleteClientError.message);

    res.status(200).send("Booking and associated client deleted successfully");
  } catch (err) {
    console.error("Error deleting booking or client:", err);
    res.status(500).send("Error deleting booking or client");
  }
});


// ********************************
// Route - Insert feed submissions
// ********************************

app.post("/feed", async (req, res) => {
  const { content } = req.body;

  try {
    // Step 1: Insert into local 'feed' table
    const query = "INSERT INTO feed (content) VALUES ($1)";
    await pool.query(query, [content]);

    // Step 2: Insert into Supabase 'feed_dev' table
    const { error: supabaseError } = await supabase
      .from("feed_dev")
      .insert([{ content }]);

    if (supabaseError) {
      console.error(
        "Error adding feed item to Supabase:",
        supabaseError.message
      );
      return res.status(500).send("Error adding feed item to Supabase");
    }

    res
      .status(201)
      .send("Feed item added successfully to both local and Supabase");
  } catch (error) {
    console.error("Error adding feed item:", error.message);
    res.status(500).send("Error adding feed item");
  }
});



// ****************************************
// Login route
// ****************************************

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Query Supabase for the user with the provided email
    const { data: users, error } = await supabase
      .from("accounts_dev")
      .select("*")
      .eq("email", email)
      .single(); // Ensure only one result is returned

    if (error || !users) {
      return res.status(401).send("Invalid email or password"); // Handle invalid email
    }

    const user = users;
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send("Invalid email or password");
    }

    // Store user ID in session
    req.session.userId = user.id;

    res.status(200).json({
      message: "Login successful",
      userId: user.id,
      firstName: user.firstname,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error during login");
  }
});


// *****************************
// Route - Get feed submissions
// *****************************
app.get("/feed", async (req, res) => {
  try {
    // Fetch all feed items from the 'feed_dev' table in Supabase
    const { data, error } = await supabase
      .from("feed_dev")
      .select("*")
      .order("created_at", { ascending: false }); // Assuming you have a 'created_at' column

    if (error) {
      console.error("Error fetching feed data from Supabase:", error.message);
      return res.status(500).send("Error fetching feed data from Supabase");
    }

    res.json(data); // Send the fetched data as JSON response
  } catch (error) {
    console.error("Unexpected error fetching feed data:", error.message);
    res.status(500).send("Unexpected error fetching feed data");
  }
});





// ****************************************
// Register route
// ****************************************

app.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into the `accounts_dev` table
    const { data, error } = await supabase
      .from("accounts_dev")
      .insert([
        {
          firstname: firstName,
          lastname: lastName,
          email: email,
          password: hashedPassword,
        },
      ])
      .select("id"); // Retrieve the inserted account ID

    if (error) {
      if (error.code === "23505") {
        return res.status(409).send("Email already registered"); // Handle duplicate email
      }
      throw error; // Handle other errors
    }

    // Respond with success message and the new account ID
    res.status(201).json({
      message: "User registered successfully",
      accountId: data[0].id,
    });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).send("Error registering user");
  }
});


// ****************************************
// These Routes are not working or not used
// ****************************************


app.post("/api/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const query =
      "SELECT * FROM accounts WHERE reset_token = $1 AND reset_token_expiration > NOW()";
    const result = await pool.query(query, [token]);

    if (result.rows.length === 0) {
      return res.status(400).send("Invalid or expired token");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updateQuery = `
      UPDATE accounts 
      SET password = $1, reset_token = NULL, reset_token_expiration = NULL 
      WHERE id = $2
    `;
    await pool.query(updateQuery, [hashedPassword, result.rows[0].id]);

    res.status(200).send("Password has been reset successfully");
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).send("Error resetting password. Please try again.");
  }
});

// Test the database connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log(
      "Database connection successful, current time:",
      res.rows[0].now
    );
  }
});








// **********************************
// Route - Get upcoming appointments
// **********************************
app.get("/upcomingAppointments", async (req, res) => {
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

    const values = [
      format(today, "yyyy-MM-dd"),
      format(nextFewDays, "yyyy-MM-dd"),
    ];

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching upcoming appointments:", err);
    res.status(500).send("Error retrieving upcoming appointments");
  }
});










// Load environment variables from .env file
require("dotenv").config();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).send("Unauthorized");
  }
  next();
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).send("Unauthorized");
  }
  const query = "SELECT role FROM accounts WHERE id = $1";
  const values = [req.session.userId];
  pool.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error checking user role");
    }
    if (result.rows[0].role !== "admin") {
      return res.status(403).send("Unauthorized");
    }
    next();
  });
};

// Middleware to check if user is a manager
const isManager = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).send("Unauthorized");
  }
  const query = "SELECT role FROM accounts WHERE id = $1";
  const values = [req.session.userId];
  pool.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error checking user role");
    }
    if (result.rows[0].role !== "manager") {
      return res.status(403).send("Unauthorized");
    }
    next();
  });
};

// Middleware to check if user is a client
const isClient = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).send("Unauthorized");
  }
  const query = "SELECT role FROM accounts WHERE id = $1";
  const values = [req.session.userId];
  pool.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error checking user role");
    }
    if (result.rows[0].role !== "client") {
      return res.status(403).send("Unauthorized");
    }
    next();
  });
};
// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).send("Unauthorized");
  }
  next();
};

// Route for requesting a password reset link
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const query = "SELECT * FROM accounts WHERE email = $1";
    const result = await pool.query(query, [email]);
    if (result.rows.length === 0) {
      return res.status(404).send("No user found with that email address");
    }

    const token = crypto.randomBytes(20).toString("hex"); // Generate a random token
    const tokenExpiration = new Date(Date.now() + 3600000); // Token valid for 1 hour

    // Store the token and expiration in the database
    const updateQuery = `
      UPDATE accounts 
      SET reset_token = $1, reset_token_expiration = $2 
      WHERE email = $3
    `;
    await pool.query(updateQuery, [token, tokenExpiration, email]);

    // Send the email with the reset link (Nodemailer configuration)
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      text: `Click the link to reset your password: http://localhost:3000/reset-password?token=${token}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send("Password reset link sent to your email");
  } catch (err) {
    console.error("Error in forgot-password:", err);
    res.status(500).send("Error sending password reset email");
  }
});

// Start the server
//app.listen(port, () => {
//  console.log(`Server is running on http://localhost:${port}`);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
