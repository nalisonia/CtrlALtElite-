// Load environment variables
require("dotenv").config({ path: "../.env" });

const express = require("express");
const cors = require("cors");
const twilio = require("twilio");
const mailgun = require("mailgun-js");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const supabase = require("../src/config/supabaseClient.js");

const app = express();
const port = process.env.PORT || 3000;

// Twilio Configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

// Mailgun Configuration
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

// Middleware Configuration
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser()); // Parse cookies
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-eval'"],
    },
  })
);

async function createSession(sessionId, userId) {
  const sessionData = {
    userId, // Store user ID in the session
    createdAt: new Date().toISOString(), // Store session creation time
  };

  const { error } = await supabase.from("sessions").insert([
    {
      sid: sessionId, // Store the session ID in the 'sid' column
      sess: sessionData, // Store session data (including userId)
      expire: new Date(Date.now() + 30 * 60 * 1000), // 30 min expiration
    },
  ]);

  if (error) throw new Error(`Error creating session: ${error.message}`);
}



async function getSession(sessionId) {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("sid", sessionId)
    .single();
  if (error || !data) return null;
  return data;
}

async function deleteSession(sessionId) {
  const { error } = await supabase.from("sessions").delete().eq("sid", sessionId);
  if (error) throw new Error(`Error deleting session: ${error.message}`);
}

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data: user, error } = await supabase
      .from("accounts_dev")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) return res.status(401).send("Invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send("Invalid email or password");

    const sessionId = crypto.randomBytes(16).toString("hex");
    await createSession(sessionId, user.id); // Store session in Supabase

    res.cookie("sessionId", sessionId, { httpOnly: true, maxAge: 30 * 60 * 1000 });
    res.status(200).json({ message: "Login successful", userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error during login");
  }
});

// Middleware to Authenticate Using Session from Supabase
const isAuthenticated = async (req, res, next) => {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) return res.status(401).send("Unauthorized");

  try {
    const session = await getSession(sessionId);
    if (!session) return res.status(401).send("Session expired or not found");

    req.userId = session.user_id; // Attach user ID to request
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error checking session");
  }
};



// Logout Route
app.post("/logout", async (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) return res.status(400).send("No session found");

  try {
    await deleteSession(sessionId); // Remove session from Supabase
    res.clearCookie("sessionId");
    res.status(200).send("Logged out successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error during logout");
  }
});

// Example Protected Route
app.get("/dashboard", isAuthenticated, (req, res) => {
  res.send(`Welcome to your dashboard, user ${req.userId}`);
});

// Forgot Password Route
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const { data: user } = await supabase
      .from("accounts_dev")
      .select("*")
      .eq("email", email)
      .single();

    if (!user) return res.status(404).send("No user found with that email");

    const token = crypto.randomBytes(20).toString("hex");
    const tokenExpiration = new Date(Date.now() + 3600000); // 1-hour expiration

    await supabase
      .from("accounts_dev")
      .update({ reset_token: token, reset_token_expiration: tokenExpiration })
      .eq("email", email);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      text: `Click the link to reset your password: http://localhost:3000/reset-password?token=${token}`,
    };

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail(mailOptions);
    res.status(200).send("Password reset link sent to your email");
  } catch (err) {
    console.error("Error in forgot-password:", err);
    res.status(500).send("Error sending password reset email");
  }
});

// Route to Submit Inquiry
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
    const { data: clientData, error: clientError } = await supabase
      .from("clients_dev")
      .insert([
        {
          name: firstNameAndLastName,
          email: emailAddress,
          phone: phoneNumber,
        },
      ])
      .select("id");

    if (clientError || !clientData) throw new Error("Error inserting client");

    const clientId = clientData[0].id;

    const { error: bookingError } = await supabase.from("bookings_dev").insert([
      {
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
      },
    ]);

    if (bookingError) throw new Error("Error inserting booking");

    res.status(201).send("Inquiry submitted successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error inserting data");
  }
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
