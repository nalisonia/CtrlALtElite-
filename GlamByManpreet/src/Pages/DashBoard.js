import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import differenceBy from "lodash/differenceBy";
import Modal from 'react-modal';
import "../Styles/DashBoard.css";
import supabase from '../config/supabaseClient.js'; // Import your Supabase client

// Define columns for the DataTable
const columns = [
  { name: 'Name', selector: row => row.name, sortable: true },
  { name: 'Phone#', selector: row => row.phone, sortable: true },
  { name: 'Event Date', selector: row => row.bookings[0]?.event_date || 'N/A', sortable: true },
  { name: 'Event Type', selector: row => row.bookings[0]?.event_type || 'N/A', sortable: true },
];

// Set the root element for modal accessibility
Modal.setAppElement('#root');

function DashBoard() {
  const [users, setUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  // Fetch clients and their bookings from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('clients_dev')
          .select(`
            *,
            bookings_dev (
              id, event_date, event_time, event_type, event_name,
              hair_and_makeup, hair_only, makeup_only, location, additional_notes, status
            )
          `);

        if (error) throw error;

        const transformedData = data.map(client => ({
          id: client.id,
          name: client.name,
          email: client.email,
          phone: client.phone,
          bookings: client.bookings_dev || [],
        }));

        setUsers(transformedData);
      } catch (err) {
        console.error('Error fetching users:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRowSelected = React.useCallback(state => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handleRowClicked = (row) => {
    setSelectedUser(row);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteSelected = React.useCallback(async () => {
    if (window.confirm(`Are you sure you want to delete:\r ${selectedRows.map(r => r.name)}?`)) {
      try {
        const clientIds = selectedRows.map((row) => row.id);

        const { error: bookingError } = await supabase
          .from('bookings_dev')
          .delete()
          .in('client_id', clientIds);

        if (bookingError) throw bookingError;

        const { error: clientError } = await supabase
          .from('clients_dev')
          .delete()
          .in('id', clientIds);

        if (clientError) throw clientError;

        alert('Clients and their bookings deleted successfully!');

        const { data: updatedUsers, error: fetchError } = await supabase
          .from('clients_dev')
          .select(`
            *,
            bookings_dev (
              id, event_date, event_time, event_type, event_name,
              hair_and_makeup, hair_only, makeup_only, location, additional_notes, status
            )
          `);

        if (fetchError) throw fetchError;

        setUsers(updatedUsers);
        setToggleCleared((prev) => !prev);
      } catch (error) {
        console.error('Error deleting clients and bookings:', error.message);
      }
    }
  }, [selectedRows, toggleCleared]);

  const contextActions = React.useMemo(() => (
    <button key="delete" onClick={handleDeleteSelected} className="delete-button">
      Delete Selected
    </button>
  ), [handleDeleteSelected]);

  const handleApprove = async (clientId) => {
    try {
      const { error } = await supabase
        .from('bookings_dev') 
        .update({ status: 'approved' }) 
        .eq('client_id', clientId); 
      if (error) throw error;
  
      alert('Inquiry approved successfully!');
  
      // Update the state to reflect the approved status for the related bookings
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === clientId
            ? {
                ...user,
                bookings: user.bookings.map((booking) => ({
                  ...booking,
                  status: 'approved',
                })),
              }
            : user
        )
      );
    } catch (error) {
      console.error('Error approving inquiry:', error.message);
    }
  };
  
  const handleDecline = async (clientId) => {
    try {
      const { error } = await supabase
        .from('bookings_dev') 
        .update({ status: 'declined' }) 
        .eq('client_id', clientId); 
  
      if (error) throw error;
  
      alert('Inquiry declined successfully!');
  
      // Update the state to reflect the declined status for the related bookings
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === clientId
            ? {
                ...user,
                bookings: user.bookings.map((booking) => ({
                  ...booking,
                  status: 'declined',
                })),
              }
            : user
        )
      );
    } catch (error) {
      console.error('Error declining inquiry:', error.message);
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-header">Inquiry Dashboard</h2>
      <DataTable
        title="Users"
        columns={columns}
        data={users}
        selectableRows
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleCleared}
        onRowClicked={handleRowClicked}
        contextActions={contextActions}
        pagination
      />

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="User Information"
        className="modal"
        overlayClassName="modal-overlay"
      >
        {selectedUser && (
          <div>
            <h2>{selectedUser.name}'s Info</h2>
            <p><strong>Phone Number:</strong> {selectedUser.phone}</p>
            <p><strong>Email Address:</strong> {selectedUser.email}</p>
            {selectedUser.bookings.length > 0 ? (
              selectedUser.bookings.map(booking => (
                <div key={booking.id}>
                  <p><strong>Event Date:</strong> {booking.event_date}</p>
                  <p><strong>Event Type:</strong> {booking.event_type}</p>
                  <p><strong>Event Time:</strong> {booking.event_time}</p>
                  <p><strong>Event Name:</strong> {booking.event_name}</p>
                  <p><strong>Hair and Makeup:</strong> {booking.hair_and_makeup}</p>
                  <p><strong>Hair Only:</strong> {booking.hair_only}</p>
                  <p><strong>Makeup Only:</strong> {booking.makeup_only}</p>
                  <p><strong>Location:</strong> {booking.location}</p>
                  <p><strong>Additional Notes:</strong> {booking.additional_notes}</p>
                </div>
              ))
            ) : <p>No bookings available</p>}
            <div className="inquiry-buttons">
              <button onClick={() => handleApprove(selectedUser.id)} className="approve-button">Approve</button>
              <button onClick={() => handleDecline(selectedUser.id)} className="decline-button">Decline</button>
            </div>
            <button onClick={closeModal} className="modal-close-button">Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default DashBoard;
