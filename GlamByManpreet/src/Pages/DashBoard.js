import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component"; 
import differenceBy from "lodash/differenceBy";
import "../Styles/DashBoard.css";

const columns = [
  { name: 'First Name and Last Name', selector: row => row.firstnameandlastname, sortable: true },
  { name: 'Phone Number', selector: row => row.phonenumber, sortable: true },
  { name: 'Email Address', selector: row => row.emailaddress, sortable: true },
  { name: 'Event Date', selector: row => row.eventdate, sortable: true },
  { name: 'Event Time', selector: row => row.eventtime, sortable: true },
  { name: 'Event Type', selector: row => row.eventtype, sortable: true },
  { name: 'Event Name', selector: row => row.eventname, sortable: true },
  { name: 'Clients Hair and Makeup', selector: row => row.clientshairandmakeup, sortable: true },
  { name: 'Clients Hair Only', selector: row => row.clientshaironly, sortable: true },
  { name: 'Clients Makeup Only', selector: row => row.clientsmakeuponly, sortable: true },
  { name: 'Location Address', selector: row => row.locationaddress, sortable: true },
  { name: 'Additional Notes', selector: row => row.additionalnotes, sortable: true, wrap: true },
];

function DashBoard() {
  const [users, setUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);

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
        style={{ backgroundColor: 'red', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer' }}>
        Delete Selected
      </button>
    );
  }, [handleDeleteSelected]);

  return (
    <div>
      <h2>Inquiries Dashboard</h2>
      <DataTable
        title="Users"
        columns={columns}
        data={users}
        selectableRows
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleCleared}
        contextActions={contextActions}
        pagination
      />
    </div>
  );
}

export default DashBoard;
