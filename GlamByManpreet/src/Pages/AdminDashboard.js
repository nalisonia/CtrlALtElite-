import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookIcon from '@mui/icons-material/Book';
import PeopleIcon from '@mui/icons-material/People';
import Bookings from './Bookings'; // Import the Bookings component
import Clients from './Clients'; // Import the Clients component
import Feed from './Feed'; // Import the Feed component
import GalleryManager from './GalleryManager';
import { Card, CardContent, CardHeader, Avatar, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';


const drawerWidth = 240;

function AdminDashboard() {
  const [selectedItem, setSelectedItem] = useState('Overview'); 
  const [feedData, setFeedData] = useState([]);

  const handleListItemClick = (item) => {
    setSelectedItem(item);
  };

  useEffect(() => {
   const fetchFeedData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/feed');
      setFeedData(response.data);
    } catch (error) {
      console.error('Error fetching feed data:', error.response ? error.response.data : error.message);    }
  };

  fetchFeedData();

  }, []);

 /*// Handle approve client
 const handleApprove = async (clientId) => {
  try {
    await axios.put(`http://localhost:3000/clients/approve/${clientId}`);
    // Update UI after approving
    setClients((prevClients) => prevClients.map((client) => client.id === clientId ? { ...client, status: 'approved' } : client));
  } catch (error) {
    console.error('Error approving client:', error);
  }
};

// Handle decline client
const handleDecline = async (clientId) => {
  try {
    await axios.put(`http://localhost:3000/clients/decline/${clientId}`);
    // Update UI after declining
    setClients((prevClients) => prevClients.map((client) => client.id === clientId ? { ...client, status: 'declined' } : client));
  } catch (error) {
    console.error('Error declining client:', error);
  }
};*/

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <List sx={{mt: 14}}>
          {['Overview', 'Bookings', 'Clients', 'Store', 'Feed','Gallery Manager', ].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton selected={selectedItem === text} onClick={() => handleListItemClick(text)}> 
                <ListItemIcon>
                  {index === 0 ? <DashboardIcon /> : index === 1 ? <BookIcon /> : <PeopleIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, justifyContent: 'center' }}>
        <Toolbar />
        {selectedItem === 'Feed' && <Feed />}
        {selectedItem === 'Overview' && (
          <div>
            {/* 
          <Typography paragraph>
            This is the Overview section.
          </Typography>
          */}

          <h2>Activity Feed</h2>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> 
            {feedData.map((item) => (
            <Card key={item.id} sx={{ mb: 2, width: '40%', border: '1px solid #ccc' }}> {/* Adjust width as needed */} 
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: 'primary.main' }}> 
                      {/* Avatar/profile icon customization done here */}
                      A 
                    </Avatar>
                  }
                  action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title="Admin" // Hardcoded Admin in here (person who posted the feed)
                  subheader={new Date(item.created_at).toLocaleString()}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {item.content}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </div>
        )}
        {selectedItem === 'Bookings' && <Bookings />} 
        {selectedItem === 'Clients' && <Clients />} 
        {selectedItem === 'Gallery Manager' && <GalleryManager />}  
      </Box>
    </Box>
  );
}

export default AdminDashboard;