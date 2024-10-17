import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import supabase from '../config/supabaseClient.js'; // Import your Supabase client
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import Typography from '@mui/material/Typography';

function Clients() {
  // State to store client data fetched from the server
  const [clients, setClients] = useState([]);

  // State to control the visibility of the Edit and Delete Client dialog box
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // State to store the currently selected client for editing
  const [selectedClient, setSelectedClient] = useState(null);

  // State variables to store the edited values of a client in the Edit Client Dialog
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');

  // State to store the ID of the client to be deleted
  const [clientIdToDelete, setClientIdToDelete] = useState(null);

 // Fetch clients from Supabase on component mount
 useEffect(() => {
  const fetchClients = async () => {
    try {
      const { data, error } = await supabase.from('clients_dev').select('*');
      if (error) throw error;
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error.message);
    }
  };

  fetchClients(); // Fetch clients when component mounts
}, []);

  // Function to handle editing a client
  const handleEditClient = (client) => {
    setSelectedClient(client);
    setEditName(client.name);
    setEditEmail(client.email);
    setEditPhone(client.phone);
    setOpenEditDialog(true);
  };

  // Function to handle deleting a client
  const handleDeleteClient = (clientId) => {
    setClientIdToDelete(clientId);
    setOpenDeleteDialog(true);
  };

  // Function to handle closing the Edit Client Dialog
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedClient(null);
    // Reset the edit state variables to their default values
    setEditName('');
    setEditEmail('');
    setEditPhone('');
  };

  // Function to handle closing the Delete Client Dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setClientIdToDelete(null);
  };

// Function to handle saving the edited client data
const handleSaveEdit = async () => {
  try {
    // Use Supabase to update the client with the edited values
    const { error } = await supabase
      .from('clients_dev') // Target the 'clients_dev' table
      .update({
        name: editName,
        email: editEmail,
        phone: editPhone,
      })
      .eq('id', selectedClient.id); // Update the client where 'id' matches

    if (error) throw error; // Handle any errors

    // Update the clients state after successful edit
    setClients((prevClients) =>
      prevClients.map((client) =>
        client.id === selectedClient.id
          ? { ...client, name: editName, email: editEmail, phone: editPhone }
          : client
      )
    );

    handleCloseEditDialog(); // Close the edit dialog
  } catch (error) {
    console.error('Error updating client:', error.message);
  }
};

// Function to handle confirming the deletion of a client
const handleConfirmDelete = async () => {
  try {
    // Step 1: Delete all bookings associated with the client
    const { error: bookingsError } = await supabase
      .from('bookings_dev') // Target the 'bookings_dev' table
      .delete()
      .eq('client_id', clientIdToDelete); // Delete bookings where 'client_id' matches

    if (bookingsError) throw bookingsError; // Handle any errors from bookings deletion

    // Step 2: Delete the client from the 'clients_dev' table
    const { error: clientError } = await supabase
      .from('clients_dev') // Target the 'clients_dev' table
      .delete()
      .eq('id', clientIdToDelete); // Delete the client where 'id' matches

    if (clientError) throw clientError; // Handle any errors from client deletion

    // Step 3: Update the clients state after successful delete
    setClients((prevClients) =>
      prevClients.filter((client) => client.id !== clientIdToDelete)
    );

    handleCloseDeleteDialog(); // Close the delete dialog

    alert('Client and associated bookings deleted successfully!');
  } catch (error) {
    console.error('Error deleting client and bookings:', error.message);
  }
};


    // Handle approve client
  const handleApprove = async (clientId) => {
    try {
      await axios.put(`http://localhost:3000/clients/approve/${clientId}`);
      // Optionally refresh client list or update the client's status in the UI
      setClients((prevClients) => prevClients.map((client) => client.id === clientId ? { ...client, status: 'approved' } : client));
    } catch (error) {
      console.error('Error approving client:', error);
    }
  };

  // Handle decline client
  const handleDecline = async (clientId) => {
    try {
      await axios.put(`http://localhost:3000/clients/decline/${clientId}`);
      // Optionally refresh client list or update the client's status in the UI
      setClients((prevClients) => prevClients.map((client) => client.id === clientId ? { ...client, status: 'declined' } : client));
    } catch (error) {
      console.error('Error declining client:', error);
    }
  };
  
  // Define the columns for the DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 130 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      // Function to render the cell content for the actions column
      renderCell: (params) => {
        // Define functions to handle the actions for each row
        const handleEdit = () => handleEditClient(params.row);
        const handleDelete = () => handleDeleteClient(params.row.id);
        const handleApproveClick = () => handleApprove(params.row.id);
        const handleDeclineClick = () => handleDecline(params.row.id);

        return (
          <>
            <IconButton onClick={handleEdit}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
            {/* Approve and Decline buttons */}
            <Button onClick={handleApproveClick} color="success" variant="contained" size="small">
              Approve
            </Button>
            <Button onClick={handleDeclineClick} color="error" variant="contained" size="small" sx={{ ml: 1 }}>
              Decline
            </Button>
          </>
        );
      },
    },
  ];

  // Too lazy to comment everything down below - just look at return() in Bookings.js lol
  return (
    <div style={{ height: 600, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}> 
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', width: '100%' }}>  
        Clients
      </Typography>
      <div style={{ width: '35%' }} className='center-pagination'>
        <DataGrid
          rows={clients}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection={false}
          disableSelectionOnClick
        />

        {/* Edit Client Dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit Client</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Email"
              fullWidth
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Phone"
              fullWidth
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save</Button>
          </DialogActions>
        </Dialog>

        {/* Delete Client Dialog */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Delete Client</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this client?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button onClick={handleConfirmDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default Clients;