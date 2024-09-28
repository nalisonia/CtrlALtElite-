import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component"; 
import differenceBy from "lodash/differenceBy";
import Modal from 'react-modal';
import "../Styles/DashBoard.css";

const columns = [
  { name: 'Name', selector: row => row.firstnameandlastname, sortable: true },
  { name: 'Phone#', selector: row => row.phonenumber, sortable: true },
  //{ name: 'Email Address', selector: row => row.emailaddress, sortable: true },
  { name: 'Event Date', selector: row => row.eventdate, sortable: true },
  //{ name: 'Event Time', selector: row => row.eventtime, sortable: true },
  { name: 'Event Type', selector: row => row.eventtype, sortable: true },
  //{ name: 'Event Name', selector: row => row.eventname, sortable: true },
  //{ name: 'Clients Hair and Makeup', selector: row => row.clientshairandmakeup, sortable: true },
  //{ name: 'Clients Hair Only', selector: row => row.clientshaironly, sortable: true },
  //{ name: 'Clients Makeup Only', selector: row => row.clientsmakeuponly, sortable: true },
  //{ name: 'Location Address', selector: row => row.locationaddress, sortable: true },
  //{ name: 'Additional Notes', selector: row => row.additionalnotes, sortable: true, wrap: true },
];

Modal.setAppElement('#root');

function DashBoard() {
  const [users, setUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

   //used to populate the users state var
   useEffect(() => {
    const fetchUsers = async () => {
      try {
        //sends a get request to the route we defined in the backend
        const response = await fetch("http://localhost:3000/users");
        //parse the json file the backend returned
        const result = await response.json();
        //use the fucntion to setUsers to fill the users state variable with all the users from the db
        setUsers(result);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Handle row selection
  const handleRowSelected = React.useCallback(state => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handleRowClicked = (row) => {
    setSelectedUser(row); // Set the clicked row's data to the state
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null); // Clear the selected user on modal close
  };

  
   //used to delete db entries based on their ID
   const handleDeleteSelected = React.useCallback(async () => {
      if (window.confirm(`Are you sure you want to delete:\r ${selectedRows.map(r => r.firstnameandlastname)}?`)) {
      try {
        //sends a delte request to ther server
        const response = await fetch("http://localhost:3000/users", {
          //its going to be a delete request
          method: "DELETE",
          //of type json
          headers: {
            "Content-Type": "application/json",
          },
          //the body of the request will be the selected users state variable
          body: JSON.stringify({ ids: selectedRows.map(row => row.id) }),
        });

        if (response.ok) {
          setUsers(differenceBy(users, selectedRows, 'id'));
          setToggleCleared(!toggleCleared);
        } else {
          console.error("Failed to delete users");
        }
      } catch (error) {
        console.error("Error deleting users:", error);
      }
    }
  }, [selectedRows, users, toggleCleared]);

  const contextActions = React.useMemo(() => {
    return (
      <button 
        key="delete" 
        onClick={handleDeleteSelected} 
        className="delete-button"> 
        Delete Selected
      </button>
    );
  }, [handleDeleteSelected]);

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

      {/* This modal shows extended customer inquiry information */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="User Information"
        className="modal"
        overlayClassName="modal-overlay"
      >
        {selectedUser && (
          <div>
            <h2>{selectedUser.firstnameandlastname}'s Info</h2>
            <p><strong>Phone Number:</strong> {selectedUser.phonenumber}</p>
            <p><strong>Email Address:</strong> {selectedUser.emailaddress}</p>
            <p><strong>Event Date:</strong> {selectedUser.eventdate}</p>
            <p><strong>Event Type:</strong> {selectedUser.eventtype}</p>
            <p><strong>Event Time:</strong> {selectedUser.eventtime}</p>
            <p><strong>Event Name:</strong> {selectedUser.eventname}</p>
            <p><strong>Clients Hair and Makeup:</strong> {selectedUser.clientshairandmakeup}</p>
            <p><strong>Clients Hair Only:</strong> {selectedUser.clientshaironly}</p>
            <p><strong>Clients Makeup Only:</strong> {selectedUser.clientsmakeuponly}</p>
            <p><strong>Location Address:</strong> {selectedUser.locationaddress}</p>
            <p><strong>Additional Notes:</strong> {selectedUser.additionalnotes}</p>
            <button onClick={closeModal} className="modal-close-button">
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default DashBoard;
