import React, { useState, useEffect } from 'react';
import '../Styles/Bookings.css'; // Import the CSS file
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  MenuItem,
  Typography,
} from '@mui/material';
import BookingModal from './BookingModal';

function Bookings() {
  // State to store booking data fetched from the server
  const [bookings, setBookings] = useState([]);

  // State to store client data fetched from the server (for dropdown in Edit dialog)
  const [clients, setClients] = useState([]);

  // State to control the visibility of the View Booking Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State to control the visibility of the Edit and Delete Booking dialog boxes
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // State to store the currently selected booking for viewing or editing
  const [selectedBooking, setSelectedBooking] = useState(null);

  // State variables to store the edited values of a booking in the Edit Booking Dialog
  const [editClientId, setEditClientId] = useState('');
  const [editEventDate, setEditEventDate] = useState('');
  const [editEventTime, setEditEventTime] = useState('');
  const [editEventType, setEditEventType] = useState('');
  const [editEventName, setEditEventName] = useState('');
  const [editHairAndMakeup, setEditHairAndMakeup] = useState('');
  const [editHairOnly, setEditHairOnly] = useState('');
  const [editMakeupOnly, setEditMakeupOnly] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editAdditionalNotes, setEditAdditionalNotes] = useState('');

  // State to store the ID of the booking to be deleted
  const [bookingIdToDelete, setBookingIdToDelete] = useState(null);

  // State to store the name of the client associated with the selected booking
  const [clientName, setClientName] = useState('');

  // Options for the "Type of Service" and "Name of the event(s)" dropdowns in the Edit Booking dialog box
  const serviceTypeOptions = ['Bridal', 'Non-Bridal'];
  const eventNameOptions = [
    'Wedding Engagement',
    'Rokha',
    'Laggo',
    'Mehndi',
    'Photoshoot',
  ];

  // Use theme and media query to detect mobile devices
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // useEffect hook to fetch bookings and clients data when the component mounts
  useEffect(() => {
    // Async function to fetch bookings data from the server
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          'https://d8hx0arzv5ybf.cloudfront.net/bookings'
        );
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    // Async function to fetch clients data from the server
    const fetchClients = async () => {
      try {
        const response = await axios.get(
          'https://d8hx0arzv5ybf.cloudfront.net/clients'
        );
        setClients(response.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    // Call the fetchBookings and fetchClients functions to fetch data
    fetchBookings();
    fetchClients();
  }, []); // The empty dependency array ensures this effect runs only once on mount

  // Function to handle viewing a booking
  const handleViewBooking = (booking) => {
    setSelectedBooking(booking); // Set the selected booking for viewing
    setIsModalOpen(true); // Open the View Booking Modal
  };

  // Function to handle editing a booking
  const handleEditBooking = (booking) => {
    setSelectedBooking(booking); // Set the selected booking in state for editing
    setEditClientId(booking.client_id); // Set the client ID for editing

    // Format the event date to YYYY-MM-DD for the date input field
    const formattedDate = new Date(booking.event_date).toISOString().split('T')[0];
    setEditEventDate(formattedDate);

    // Set the event time, event type, event name for editing
    setEditEventTime(booking.event_time);
    setEditEventType(booking.event_type);
    setEditEventName(booking.event_name);

    // Set the hair & makeup, hair only, makeup only values for editing
    setEditHairAndMakeup(booking.hair_and_makeup);
    setEditHairOnly(booking.hair_only);
    setEditMakeupOnly(booking.makeup_only);

    // Set the location and additional notes for editing
    setEditLocation(booking.location);
    setEditAdditionalNotes(booking.additional_notes);

    // Find the client name from the clients array/table based on the client ID
    const client = clients.find((c) => c.id === booking.client_id);
    if (client) {
      setClientName(client.name); // Set the client name for display in the Edit dialog
    }
    setOpenEditDialog(true); // Open the Edit Booking Dialog
  };

  // Function to handle deleting a booking
  const handleDeleteBooking = (bookingId) => {
    setBookingIdToDelete(bookingId); // Set the ID of the booking to be deleted
    setOpenDeleteDialog(true); // Open the Delete Booking Dialog for confirmation
  };

  // Function to handle closing the Edit Booking Dialog
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false); // Close the Edit Booking Dialog
    setSelectedBooking(null); // Clear the selected booking

    // Reset all edit state variables to their default values
    setEditClientId('');
    setEditEventDate('');
    setEditEventTime('');
    setEditEventType('');
    setEditEventName('');
    setEditHairAndMakeup('');
    setEditHairOnly('');
    setEditMakeupOnly('');
    setEditLocation('');
    setEditAdditionalNotes('');
    setClientName('');
  };

  // Function to handle closing the Delete Booking Dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false); // Close the Delete Booking Dialog
    setBookingIdToDelete(null); // Clear the ID of the booking to be deleted
  };

  // Function to handle saving the edited booking
  const handleSaveEdit = async () => {
    try {
      // Send a PUT request to the server to update the booking with the edited values
      await axios.put(
        `https://d8hx0arzv5ybf.cloudfront.net/bookings/${selectedBooking.id}`,
        {
          clientId: editClientId,
          eventDate: editEventDate,
          eventTime: editEventTime,
          eventType: editEventType,
          eventName: editEventName,
          clientsHairAndMakeup: editHairAndMakeup,
          clientsHairOnly: editHairOnly,
          clientsMakeupOnly: editMakeupOnly,
          locationAddress: editLocation,
          additionalNotes: editAdditionalNotes,
        }
      );

      // Update the bookings state after successful edit
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          // If the booking ID matches the selected booking ID, update the booking with the edited values
          booking.id === selectedBooking.id
            ? {
                ...booking,
                client_id: editClientId,
                event_date: editEventDate,
                event_time: editEventTime,
                event_type: editEventType,
                event_name: editEventName,
                hair_and_makeup: editHairAndMakeup,
                hair_only: editHairOnly,
                makeup_only: editMakeupOnly,
                location: editLocation,
                additional_notes: editAdditionalNotes,
              }
            : booking // Otherwise, return the original booking
        )
      );
      handleCloseEditDialog(); // Close the Edit Booking Dialog
    } catch (error) {
      console.error('Error updating booking:', error); // Log any errors to the console
    }
  };

  // Function to handle confirming the deletion of a booking
  const handleConfirmDelete = async () => {
    try {
      // Send a DELETE request to the server to delete the booking with the given ID
      await axios.delete(
        `https://d8hx0arzv5ybf.cloudfront.net/bookings/${bookingIdToDelete}`
      );
      // Update the bookings state after successful delete
      setBookings((prevBookings) =>
        // Filter the bookings array to remove the booking with the deleted ID
        prevBookings.filter((booking) => booking.id !== bookingIdToDelete)
      );
      handleCloseDeleteDialog(); // Close the Delete Booking Dialog
    } catch (error) {
      console.error('Error deleting booking:', error); // Log any errors to the console
    }
  };

  // Define the columns for the DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: isMobile ? 50 : 70 },
    { field: 'client_name', headerName: 'Client Name', width: isMobile ? 120 : 150 },
    { field: 'event_date', headerName: 'Event Date', width: isMobile ? 90 : 100 },
    {
      field: 'actions', // Column for actions (View, Edit, Delete)
      headerName: 'Actions',
      width: isMobile ? 100 : 150,
      // Function to render the cell content for the actions column
      renderCell: (params) => {
        // Define functions to handle the actions for each row
        const handleEdit = () => handleEditBooking(params.row); // Edit
        const handleDelete = () => handleDeleteBooking(params.row.id); // Delete
        const handleView = () => handleViewBooking(params.row); // View

        // Return the JSX for the action buttons
        return (
          <>
            <IconButton onClick={handleView}>
              <VisibilityIcon />
            </IconButton>
            <IconButton aria-label="edit" onClick={handleEdit}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
    // Conditionally include additional columns for non-mobile devices
    !isMobile && { field: 'client_id', headerName: 'Client ID', width: 90 },
    !isMobile && { field: 'event_time', headerName: 'Event Time', width: 100 },
    !isMobile && { field: 'event_type', headerName: 'Event Type', width: 120 },
    !isMobile && { field: 'event_name', headerName: 'Event Name', width: 150 },
    !isMobile && { field: 'hair_and_makeup', headerName: 'Hair & Makeup', width: 120 },
    !isMobile && { field: 'hair_only', headerName: 'Hair Only', width: 100 },
    !isMobile && { field: 'makeup_only', headerName: 'Makeup Only', width: 100 },
    !isMobile && { field: 'location', headerName: 'Location', width: 200 },
    !isMobile && { field: 'additional_notes', headerName: 'Notes', width: 200 },
  ].filter(Boolean); // Remove any false entries from the array

  return (
    // Main container for the Bookings component
    <div className="bookings-container">
      {/* Header for the Bookings section */}
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', width: '100%' }}>
        Bookings
      </Typography>
      {/* Container for the DataGrid and dialogs */}
      <div className="bookings-grid-container">
        {/* DataGrid to display booking data */}
        <DataGrid
          rows={bookings} // Data to be displayed in the grid
          columns={columns} // Column definitions for the grid
          pageSize={5} // Number of rows to display per page
          rowsPerPageOptions={[5]} // Options for rows per page selection
          checkboxSelection={false}
          disableSelectionOnClick
          autoHeight // Automatically adjust height to fit content
          onRowClick={(params) => handleViewBooking(params.row)} // Handle row click to view booking details
        />

        {/* View Booking Modal */}
        <BookingModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          booking={selectedBooking}
        />

        {/* Edit Booking Dialog */}
        <Dialog
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          fullWidth
          maxWidth={isMobile ? 'xs' : 'sm'} // Adjust dialog width based on screen size
        >
          <DialogTitle>Edit Booking</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Client"
              fullWidth
              value={clientName}
              InputProps={{
                readOnly: true,
                disabled: true,
              }}
            />
            <TextField
              autoFocus
              margin="dense"
              label="Event Date"
              type="date"
              fullWidth
              value={editEventDate}
              onChange={(e) => setEditEventDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              margin="dense"
              label="Event Time"
              type="time"
              fullWidth
              value={editEventTime}
              onChange={(e) => setEditEventTime(e.target.value)}
              sx={{ marginBottom: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField // Type of Service dropdown
              select
              label="Type of Service"
              fullWidth
              value={editEventType}
              onChange={(e) => setEditEventType(e.target.value)}
              sx={{ marginBottom: 2 }}
            >
              {serviceTypeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <TextField // Name of the event(s) dropdown
              select
              label="Name of the event(s)"
              fullWidth
              value={editEventName}
              onChange={(e) => setEditEventName(e.target.value)}
              sx={{ marginBottom: 1 }}
            >
              {eventNameOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              margin="dense"
              label="Hair & Makeup"
              fullWidth
              value={editHairAndMakeup}
              onChange={(e) => setEditHairAndMakeup(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Hair Only"
              fullWidth
              value={editHairOnly}
              onChange={(e) => setEditHairOnly(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Makeup Only"
              fullWidth
              value={editMakeupOnly}
              onChange={(e) => setEditMakeupOnly(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Location"
              fullWidth
              multiline
              rows={4}
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Additional Notes"
              fullWidth
              multiline
              rows={4}
              value={editAdditionalNotes}
              onChange={(e) => setEditAdditionalNotes(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save</Button>
          </DialogActions>
        </Dialog>

        {/* Delete Booking Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle>Delete Booking</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this booking?
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

export default Bookings;
