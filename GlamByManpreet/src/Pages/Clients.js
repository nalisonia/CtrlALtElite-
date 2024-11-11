import React, { useState, useEffect } from 'react';
import '../Styles/Clients.css'; // Import the CSS file
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
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
  Typography,
} from '@mui/material';

function Clients() {
  // State variables
  const [clients, setClients] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [clientIdToDelete, setClientIdToDelete] = useState(null);
  const [error, setError] = useState('');  


  // Use theme and media query to detect mobile devices
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch clients data
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(
          'https://d8hx0arzv5ybf.cloudfront.net/clients'
        );
        setClients(response.data);
      } catch (error) {
        setError('Error fetching clients');  
        console.error('Error fetching clients:', error);
      }
    };
    fetchClients();
  }, []);

  // Handlers for edit and delete dialogs
  const handleEditClient = (client) => {
    setSelectedClient(client);
    setEditName(client.name);
    setEditEmail(client.email);
    setEditPhone(client.phone);
    setOpenEditDialog(true);
  };

  const handleDeleteClient = (clientId) => {
    setClientIdToDelete(clientId);
    setOpenDeleteDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedClient(null);
    setEditName('');
    setEditEmail('');
    setEditPhone('');
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setClientIdToDelete(null);
  };

  // Handlers for saving edits and confirming deletion
  const handleSaveEdit = async () => {
    try {
      await axios.put(
        `https://d8hx0arzv5ybf.cloudfront.net/clients/${selectedClient.id}`,
        {
          name: editName,
          email: editEmail,
          phone: editPhone,
        }
      );
      setClients((prevClients) =>
        prevClients.map((client) =>
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

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `https://d8hx0arzv5ybf.cloudfront.net/clients/${clientIdToDelete}`
      );
      setClients((prevClients) =>
        prevClients.filter((client) => client.id !== clientIdToDelete)
      );
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  // Handlers for approving and declining clients
  const handleApprove = async (clientId) => {
    try {
      await axios.put(
        `https://d8hx0arzv5ybf.cloudfront.net/clients/approve/${clientId}`
      );
      setClients((prevClients) =>
        prevClients.map((client) =>
          client.id === clientId ? { ...client, status: 'approved' } : client
        )
      );
    } catch (error) {
      console.error('Error approving client:', error);
    }
  };

  const handleDecline = async (clientId) => {
    try {
      await axios.put(
        `https://d8hx0arzv5ybf.cloudfront.net/clients/decline/${clientId}`
      );
      setClients((prevClients) =>
        prevClients.map((client) =>
          client.id === clientId ? { ...client, status: 'declined' } : client
        )
      );
    } catch (error) {
      console.error('Error declining client:', error);
    }
  };

  // Define columns with adjustments for mobile
  const columns = [
    { field: 'id', headerName: 'ID', width: isMobile ? 50 : 70 },
    { field: 'name', headerName: 'Name', width: isMobile ? 150 : 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: isMobile ? 100 : 250,
      renderCell: (params) => {
        const handleEdit = () => handleEditClient(params.row);
        const handleDelete = () => handleDeleteClient(params.row.id);
        const handleApproveClick = () => handleApprove(params.row.id);
        const handleDeclineClick = () => handleDecline(params.row.id);

        return (
          <div className="actions-container">
            <IconButton onClick={handleEdit} size="small">
              <EditIcon fontSize="inherit" />
            </IconButton>
            <IconButton onClick={handleDelete} size="small">
              <DeleteIcon fontSize="inherit" />
            </IconButton>
            {/* Approve and Decline buttons for non-mobile devices */}
            {!isMobile && (
              <>
                <Button
                  onClick={handleApproveClick}
                  color="success"
                  variant="contained"
                  size="small"
                  sx={{ ml: 1 }}
                >
                  Approve
                </Button>
                <Button
                  onClick={handleDeclineClick}
                  color="error"
                  variant="contained"
                  size="small"
                  sx={{ ml: 1 }}
                >
                  Decline
                </Button>
              </>
            )}
          </div>
        );
      },
    },
    // Include additional columns for non-mobile devices
    !isMobile && { field: 'email', headerName: 'Email', width: 200 },
    !isMobile && { field: 'phone', headerName: 'Phone', width: 130 },
    !isMobile && { field: 'status', headerName: 'Status', width: 100 },
  ].filter(Boolean);

  return (
    <div className="clients-container">
       {/* Display error message if there's an error */}
       {error && <Typography color="error">{error}</Typography>} 

      <Typography
        variant="h4"
        gutterBottom
        sx={{ textAlign: 'center', width: '100%' }}
      >
        Clients
      </Typography>
      <div className="clients-grid-container">
        <DataGrid
          rows={clients}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection={false}
          disableSelectionOnClick
          autoHeight
        />

        {/* Edit Client Dialog */}
        <Dialog
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          fullWidth
          maxWidth={isMobile ? 'xs' : 'sm'}
        >
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
        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          fullWidth
          maxWidth="xs"
        >
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
