import React from "react";
import "../Styles/UserView.css"; // Import CSS file for styling
import { Button, List, ListItemText, Typography, ListItem } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HistoryIcon from '@mui/icons-material/History';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import { Link } from "react-router-dom";

function UserView() {
    
    return (
        <div className="userview-container">
            <h2 className="welcome-text">Welcome</h2>
            <div className="userview-content-container">
                <div className="content-box">
                    <AccountCircleIcon sx={{ fontSize: 80, color: '#ffc5fc' }} />
                    <Typography variant="h4" sx={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold" }}>Account Settings</Typography>
                    <List>
                        <ListItem><ListItemText primary="Update your personal details" /></ListItem>
                        <ListItem><ListItemText primary="Change your password" /></ListItem>
                        <ListItem><ListItemText primary="Control your notification preferences" /></ListItem>
                    </List>
                    <Button
                        sx={{
                            color: "black",
                            backgroundColor: "#ffc5fc",
                            margin: "1.6vh",
                            width: "70%",
                            border: "1px solid black",
                            borderRadius: "8px",  // Smooth rounded corners
                            padding: "10px 20px",  // Better padding for clickable area
                            marginTop: 'auto',
                            transition: "background-color 0.3s, transform 0.2s", // Smooth transition for hover effect
                            "&:hover": {
                                backgroundColor: "#ff99ff", // Lighter shade on hover
                                transform: "scale(1.05)", // Slight scale effect for hover
                            },
                        }}
                        component={Link} 
                        to="/profileedit"
                    >
                        Edit Profile
                    </Button>
                </div>

                <div className="content-box">
                    <HistoryIcon sx={{ fontSize: 80, color: '#ffc5fc' }} />
                    <Typography variant="h4" sx={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold" }}>Inquiry History</Typography>
                    <List>
                        <ListItem><ListItemText primary="See the current status of your past inquiries." /></ListItem>
                        <ListItem><ListItemText primary="Access detailed information, including dates and responses" /></ListItem>
                    </List>
                    <Button
                        sx={{
                            color: "black",
                            backgroundColor: "#ffc5fc",
                            margin: "1.6vh",
                            width: "70%",
                            border: "1px solid black",
                            borderRadius: "8px",
                            padding: "10px 20px",
                            marginTop: 'auto',
                            transition: "background-color 0.3s, transform 0.2s",
                            "&:hover": {
                                backgroundColor: "#ff99ff",
                                transform: "scale(1.05)",
                            },
                        }}
                        component={Link} 
                        to="/inquiryhistory"
                    >
                        Review Past Inquiries
                    </Button>
                </div>

                <div className="content-box">
                    <NewReleasesIcon sx={{ fontSize: 80, color: '#ffc5fc' }} />
                    <Typography variant="h4" sx={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold" }}>Exclusive Updates</Typography>
                    <List>
                        <ListItem><ListItemText primary="View a feed of pictures with product updates" /></ListItem>
                        <ListItem><ListItemText primary="New product endorsements featured regularly" /></ListItem>
                    </List>
                    <Button
                        sx={{
                            color: "black",
                            backgroundColor: "#ffc5fc",
                            margin: "1.6vh",
                            width: "70%",
                            border: "1px solid black",
                            borderRadius: "8px",
                            padding: "10px 20px",
                            marginTop: 'auto',
                            transition: "background-color 0.3s, transform 0.2s",
                            "&:hover": {
                                backgroundColor: "#ff99ff",
                                transform: "scale(1.05)",
                            },
                        }}
                        component={Link} 
                        to="/userfeed"
                    >
                        Get Exclusive Updates
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default UserView;
