import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  AppBar,
  IconButton,
  CssBaseline,
  useTheme,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookIcon from '@mui/icons-material/Book';
import PeopleIcon from '@mui/icons-material/People';
import MenuIcon from '@mui/icons-material/Menu';
import Bookings from './Bookings';
import Clients from './Clients';
import Feed from './Feed';
import GalleryManager from './GalleryManager';
import { Card, CardContent, CardHeader, Avatar, Button } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const drawerWidth = 240;

function AdminDashboard() {
  const [selectedItem, setSelectedItem] = useState('Overview'); 
  const [feedData, setFeedData] = useState([]);
  const [inquiries, setInquiries] = useState([]); // State for inquiries
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleListItemClick = (item) => {
    setSelectedItem(item);
    if (isMobile) {
      setMobileOpen(false); 
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
        const response = await axios.get('http://glambymanpreet-env.eba-dnhqtbpj.us-east-2.elasticbeanstalk.com/clients');
        setInquiries(response.data);
      } catch (error) {
        console.error('Error fetching inquiries:', error);
      }
    };

    fetchFeedData();
    fetchInquiries();
  }, []);

  const handleApproveInquiry = async (clientId) => {
    console.log('Approving inquiry with clientId:', clientId);
    try {
      await axios.post(`http://glambymanpreet-env.eba-dnhqtbpj.us-east-2.elasticbeanstalk.com/inquiry-status`, {
        clientId,
        status: 'approved',
      });
  
      setInquiries((prevInquiries) =>
        prevInquiries.map((inquiry) =>
          inquiry.id === clientId ? { ...inquiry, booking_status: 'approved' } : inquiry
        )
      );
    } catch (error) {
      console.error('Error approving inquiry:', error);
    }
  };
  
  const handleDeclineInquiry = async (clientId) => {
    console.log('Declining inquiry with clientId:', clientId);
    try {
      await axios.post(`http://glambymanpreet-env.eba-dnhqtbpj.us-east-2.elasticbeanstalk.com/inquiry-status`, {
        clientId,
        status: 'declined',
      });
  
      setInquiries((prevInquiries) =>
        prevInquiries.map((inquiry) =>
          inquiry.id === clientId ? { ...inquiry, booking_status: 'declined' } : inquiry
        )
      );
    } catch (error) {
      console.error('Error declining inquiry:', error);
    }
  };

  const drawer = (
    <div>
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
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* AppBar with Menu Icon */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'white'
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="black"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" color={ 'black'}>
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      {/* Drawer Component */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="navigation folders"
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }} // Better open performance on mobile.
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {/* Render Content Based on Selected Item */}
        {selectedItem === 'Feed' && <Feed />}
        {selectedItem === 'Overview' && (
          <div>
            <h2>Inquiries</h2>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {inquiries.map((inquiry) => (
                <Card key={inquiry.id} sx={{ mb: 2, width: '100%', maxWidth: 600, border: '1px solid #ccc' }}>
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
                      disabled={inquiry.booking_status === 'approved'}
                      sx={{ mr: 2 }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeclineInquiry(inquiry.id)}
                      disabled={inquiry.booking_status === 'declined'}
                    >
                      Decline
                    </Button>
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
