import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import ticktokLogo from '../assets/images/tictokicon.png';
import IGlogo from '../assets/images/Instagram_icon.png';


const drawerWidth = 240;
const navItems = ['About', 'Services', 'Booking Inquiry', 'Contact', 'Gallery'];

function DrawerAppBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, justifyContent:'center' }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'black'}}>Home</Link>
      </Typography> 
      <Divider /> 
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}>
              {/*<ListItemText primary={item} />*/}
             <Link to={`/${item.toLowerCase()}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <ListItemText primary={item} />
            </Link>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return ( 
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> {/* Centering the content */}
      <CssBaseline />
      <AppBar component="nav" sx={{ backgroundColor: 'white', width: '100%', maxWidth: '100vw' }}> {/* Ensuring full width */}
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', width: '100%' }}>
          <div></div> {/* Empty div for spacing */}
          <Typography variant="h6" component="div" sx={{ marginLeft: '250px' }}> {/*To center title*/}
            <Link to="/" style={{ textDecoration: 'none', color: 'black'}}>GlamByManpreet111</Link>
          </Typography>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button component={Link} to="/LogIn" variant="contained" color="primary" style={{ margin: '5px' }}>Login</Button>
            <Button component={Link} to="/Register" variant="contained" color="secondary" style={{ margin: '5px' }}>Register</Button>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '10px' }}>
              <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer">
                <img src={ticktokLogo} alt="TikTok" style={{ width: '30px', height: 'auto', paddingBottom: '10px' }} />
              </a>
              <a href="https://www.instagram.com/glambymanpreet?igsh=MzRlODBiNWFlZA==" target="_blank" rel="noopener noreferrer">
                <img src={IGlogo} alt="Instagram" style={{ width: '30px', height: 'auto' }} />
              </a>
            </div>
          </div>
        </Toolbar>
        <Box sx={{flexGrow: 1, display: { xs: 'none', sm: 'flex' }, justifyContent: 'center'}}>
            {navItems.map((item) => (
              <Button
              key={item}
              component={Link}
              to={`/${item.toLowerCase().replace(/\s+/g, '-')}`} // Replace spaces with hyphens for URLs
              sx={{ color: 'black', textTransform: 'none' }} // You can adjust the style as needed
            >
              {item}
            </Button>
            ))}
          </Box>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
      </Box>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default DrawerAppBar;