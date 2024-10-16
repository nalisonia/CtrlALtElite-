const pool = require('../db'); // Assuming you have a db.js file for database connection

const getClients = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clients');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving clients');
  }
};

const getClientById = async (req, res) => {
  const clientId = req.params.id;

  try {
    const result = await pool.query('SELECT * FROM clients WHERE id = $1', [clientId]);
    if (result.rows.length === 0) {
      return res.status(404).send('Client not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving client');
  }
};

const updateClient = async (req, res) => {
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
};

const deleteClient = async (req, res) => {
  const clientId = req.params.id;

  try {
    const query = 'DELETE FROM clients WHERE id = $1';
    await pool.query(query, [clientId]);
    res.status(200).send('Client deleted successfully');
  } catch (err) {
    console.error('Error deleting client:', err);
    res.status(500).send('Error deleting client');
  }
};

module.exports = {
  getClients,
  getClientById,
  updateClient,
  deleteClient,
};