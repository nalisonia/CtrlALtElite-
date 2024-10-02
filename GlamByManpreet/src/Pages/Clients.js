import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
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

  // useEffect hook to fetch client data when the component mounts
  useEffect(() => {
    // Async function to fetch client data from the server
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:3000/clients');
        setClients(response.data); // Update the clients state with the fetched data
      } catch (error) {
        console.error('Error fetching clients:', error); // Log any errors to the console
      }
    };

    // Call the fetchClients function to fetch data on component mount
    fetchClients();
  }, []); // The empty dependency array ensures this effect runs only once on mount

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
      // Send a PUT request to the server to update the client with the edited values
      await axios.put(`http://localhost:3000/clients/${selectedClient.id}`, {
        name: editName,
        email: editEmail,
        phone: editPhone,
      });
      // Update the clients state after successful edit
      setClients((prevClients) =>
        prevClients.map((client) =>
          // If the client ID matches the selected client ID, update the client with the edited values
          client.id === selectedClient.id
            ? { ...client, name: editName, email: editEmail, phone: editPhone }
            : client
        )
      );
      handleCloseEditDialog();
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  // Function to handle confirming the deletion of a client
  const handleConfirmDelete = async () => {
    try {
      // Send a DELETE request to the server to delete the client with the given ID
      await axios.delete(`http://localhost:3000/clients/${clientIdToDelete}`);
      // Update the clients state after successful delete
      setClients((prevClients) =>
        // Filter the clients array to remove the client with the deleted ID
        prevClients.filter((client) => client.id !== clientIdToDelete)
      );
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting client:', error);
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

        return (
          <>
            <IconButton onClick={handleEdit}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
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