require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const helmet = require("helmet");
const supabase = require("./src/config/supabaseClient.js");

const twilio = require("twilio"); // Import Twilio SDK

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken); // Corrected initialization

const app = express();
const port = process.env.PORT || 8080;

// PostgreSQL connection configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-eval'"],
    },
  })
);

// Test database connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Database connected:", res.rows[0].now);
  }
});


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


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;