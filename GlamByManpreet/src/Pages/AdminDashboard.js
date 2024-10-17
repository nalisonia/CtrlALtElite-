import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookIcon from '@mui/icons-material/Book';
import PeopleIcon from '@mui/icons-material/People';
import Clients from './Clients';
import Feed from './Feed';
import GalleryManager from './GalleryManager';
import DashBoard from './DashBoard';
import { Card, CardContent, CardHeader, Avatar, IconButton, Button } from '@mui/material';

import MoreVertIcon from '@mui/icons-material/MoreVert';

const drawerWidth = 240;

function AdminDashboard() {
  const [selectedItem, setSelectedItem] = useState('Overview'); 
  const [feedData, setFeedData] = useState([]);
  const [inquiries, setInquiries] = useState([]); // State for inquiries

  const handleListItemClick = (item) => {
    setSelectedItem(item);
  };

  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/feed');
        setFeedData(response.data);
      } catch (error) {
        console.error('Error fetching feed data:', error.response ? error.response.data : error.message);
      }
    };

    const fetchInquiries = async () => {
      try {
        const response = await axios.get('http://localhost:3000/inquiries');
        setInquiries(response.data);
      } catch (error) {
        console.error('Error fetching inquiries:', error);
      }
    };

    fetchFeedData();
    fetchInquiries();
  }, []);

  // Handle approve inquiry
  const handleApproveInquiry = async (inquiryId) => {
    try {
      await axios.put(`http://localhost:3000/inquiries/approve/${inquiryId}`);
      setInquiries(prevInquiries => prevInquiries.map(inquiry =>
        inquiry.id === inquiryId ? { ...inquiry, status: 'approved' } : inquiry
      ));
    } catch (error) {
      console.error('Error approving inquiry:', error);
    }
  };

  // Handle decline inquiry
  const handleDeclineInquiry = async (inquiryId) => {
    try {
      await axios.put(`http://localhost:3000/inquiries/decline/${inquiryId}`);
      setInquiries(prevInquiries => prevInquiries.map(inquiry =>
        inquiry.id === inquiryId ? { ...inquiry, status: 'declined' } : inquiry
      ));
    } catch (error) {
      console.error('Error declining inquiry:', error);
    }
  };

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
        <List sx={{ mt: 14 }}>
          {['Overview', 'Bookings', 'Clients', 'Store', 'Feed', 'Gallery Manager'].map((text, index) => (
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
            <h2>Inquiries</h2>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {inquiries.map(inquiry => (
                <Card key={inquiry.id} sx={{ mb: 2, width: '40%', border: '1px solid #ccc' }}>
                  <CardHeader
                    avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>I</Avatar>}
                    action={<IconButton aria-label="settings"><MoreVertIcon /></IconButton>}
                    title={inquiry.name}
                    subheader={new Date(inquiry.created_at).toLocaleString()}
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {inquiry.details}
                    </Typography>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleApproveInquiry(inquiry.id)}
                      disabled={inquiry.status === 'approved'}
                      sx={{ mr: 2 }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeclineInquiry(inquiry.id)}
                      disabled={inquiry.status === 'declined'}
                    >
                      Decline
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </div>
        )}
        {selectedItem === 'Bookings' && <DashBoard />}
        {selectedItem === 'Clients' && <Clients />}
        {selectedItem === 'Gallery Manager' && <GalleryManager />}
      </Box>
    </Box>
  );
}

export default AdminDashboard;
