import React, { useEffect, useState } from "react";
import "../Styles/DashBoard.css";

function DashBoard() {
  //state variable named users which holds the users fetched from the db and setUsers which sets the users
  const [users, setUsers] = useState([]);
  //sstate variable that holds the users that have been slected and setSelectedUsers sets the selected users
  const [selectedUsers, setSelectedUsers] = useState([]);

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

  //when a checkbox is checked it calls this fucntion which is passes the userID of the db entry
  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prevSelected) => {
      // Create a new array based on the current state
      const newSelected = [...prevSelected];

      // Check if the userId is already in the selectedUsers array
      if (newSelected.includes(userId)) {
        // If userId is already selected, remove it
        const index = newSelected.indexOf(userId);
        if (index > -1) {
          newSelected.splice(index, 1); // Remove userId from the array
        }
      } else {
        // If userId is not selected, add it
        newSelected.push(userId); // Add userId to the array
      }

      // Return the updated array
      return newSelected;
    });
  };

  //used to delete db entries based on their ID
  const handleDeleteSelected = async () => {
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
        body: JSON.stringify({ ids: selectedUsers }),
      });

      if (response.ok) {
        setUsers(users.filter((user) => !selectedUsers.includes(user.id)));
        setSelectedUsers([]); // Clear selected users
      } else {
        console.error("Failed to delete users");
      }
    } catch (error) {
      console.error("Error deleting users:", error);
    }
  };

  return (
    <div>
      <h2>Users Dashboard</h2>
      <button
        onClick={handleDeleteSelected}
        disabled={selectedUsers.length === 0}
      >
        Delete Selected
      </button>
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>First Name and Last Name</th>
            <th>Phone Number</th>
            <th>Email Address</th>
            <th>Event Date</th>
            <th>Event Time</th>
            <th>Event Type</th>
            <th>Event Name</th>
            <th>Clients Hair and Makeup</th>
            <th>Clients Hair Only</th>
            <th>Clients Makeup Only</th>
            <th>Location Address</th>
            <th>Additional Notes</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleCheckboxChange(user.id)}
                />
              </td>
              <td>{user.firstnameandlastname}</td>
              <td>{user.phonenumber}</td>
              <td>{user.emailaddress}</td>
              <td>{user.eventdate}</td>
              <td>{user.eventtime}</td>
              <td>{user.eventtype}</td>
              <td>{user.eventname}</td>
              <td>{user.clientshairandmakeup}</td>
              <td>{user.clientshaironly}</td>
              <td>{user.clientsmakeuponly}</td>
              <td>{user.locationaddress}</td>
              <td>{user.additionalnotes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DashBoard;
