const pool = require('../db'); 

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users'); 
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Error fetching users');
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).send('User not found');
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Error fetching user');
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { firstName, lastName, email } = req.body; // Update fields as needed

  try {
    const query = 'UPDATE users SET firstname = $1, lastname = $2, email = $3 WHERE id = $4';
    await pool.query(query, [firstName, lastName, email, userId]);
    res.status(200).send('User updated successfully');
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Error updating user');
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const query = 'DELETE FROM users WHERE id = $1';
    await pool.query(query, [userId]);
    res.status(200).send('User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Error deleting user');
  }
};

const getAllBookings = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bookings'); 
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).send('Error fetching bookings');
  }
};

const updateBookingStatus = async (req, res) => {
  const bookingId = req.params.id;
  const { status } = req.body; // Assuming 'status' is a field in your bookings table

  try {
    const query = 'UPDATE bookings SET status = $1 WHERE id = $2';
    await pool.query(query, [status, bookingId]);
    res.status(200).send('Booking status updated successfully');
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).send('Error updating booking status');
  }
};

const updateInquiryStatus = async (req, res) => {
  const { userId, status } = req.body;

  try {
    const query = `
      INSERT INTO inquiry_status (user_id, status, updated_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id)
      DO UPDATE SET status = $2, updated_at = CURRENT_TIMESTAMP
    `;
    await pool.query(query, [userId, status]);

    const userResult = await pool.query('SELECT emailaddress, firstnameandlastname, phonenumber FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).send('User not found');
    }

    const subject = `Inquiry ${status === 'approved' ? 'Approved' : 'Declined'}`;
    const message = `Dear ${user.firstnameandlastname}, your inquiry has been ${status}.`;

    await sendEmail(user.emailaddress, subject, message);
    await sendSMS(user.phonenumber, message);

    res.status(200).send(`Inquiry ${status} notification sent successfully`);
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    res.status(500).send('Error updating inquiry status');
  }
};

const approveClient = async (req, res) => {
  const clientId = req.params.id;

  try {
    await pool.query('UPDATE clients SET status = $1 WHERE id = $2', ['approved', clientId]);

    const clientInfo = await pool.query('SELECT phone FROM clients WHERE id = $1', [clientId]);
    const phoneNumber = clientInfo.rows[0].phone;

    await sendSMS(phoneNumber, 'Your inquiry has been approved.');

    res.status(200).send('Client approved and SMS sent.');
  } catch (error) {
    console.error('Error approving client:', error);
    res.status(500).send('Error approving client');
  }
};

const declineClient = async (req, res) => {
  const clientId = req.params.id;

  try {
    await pool.query('UPDATE clients SET status = $1 WHERE id = $2', ['declined', clientId]);

    const clientInfo = await pool.query('SELECT phone FROM clients WHERE id = $1', [clientId]);
    const phoneNumber = clientInfo.rows[0].phone;

    await sendSMS(phoneNumber, 'Your inquiry has been declined.');

    res.status(200).send('Client declined and SMS sent.');
  } catch (error) {
    console.error('Error declining client:', error);
    res.status(500).send('Error declining client');
  }
};

const deleteUsers = async (req, res) => {
  const { userIds } = req.body;

  if (!Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).send('Invalid user IDs');
  }

  try {
    const query = 'DELETE FROM users WHERE id = ANY($1::int[])';
    await pool.query(query, [userIds]);

    res.status(200).send('Users deleted successfully');
  } catch (error) {
    console.error('Error deleting users:', error);
    res.status(500).send('Error deleting users');
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllBookings,
  updateBookingStatus,
  updateInquiryStatus,
  approveClient,
  declineClient,
  deleteUsers,
};