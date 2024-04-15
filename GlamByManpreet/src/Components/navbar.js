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
import '../Styles/NavBar.css'; // Import CSS file for styling 
import '../Styles/App.css'; // Import CSS file for styling
import '../Styles/Home.css'; // Import CSS file for styling

/*
'xs': Extra small devices (phones) - width less than 600px
'sm': Small devices (tablets) - width equal to or greater than 600px
'md': Medium devices (small laptops) - width equal to or greater than 960px
'lg': Large devices (desktops) - width equal to or greater than 1280px
'xl': Extra large devices (large desktops) - width equal to or greater than 1920px
*/

const drawerWidth = 300;
//array of text that corresponds to the routes in the App.js page, will be used for the buttons
//in deskotp and mobile modes
const navItems = ["Home",'About Me', 'Services', 'Booking Inquiry', 'Contact Me', 'Gallery'];

function DrawerAppBar(props) {
  const { window } = props;
  //variable intialized named mobileopen using usestate. This var will be used if the website is not in desktop mode
  const [mobileOpen, setMobileOpen] = React.useState(false);

  //set mobile open chagnes the state of the variable named setmobileopen
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  //this code deals with the hamburger button, when you cick outside of the dropdown button
  //handDrawerToggle is called and sets the state of mobileopen to the oppisiote state
  //closing or opeing the menu 
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>

      {/*This handles the title of the drop down menu*/}
      <Typography variant="h6" sx={{ my: 2, justifyContent:'center' }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'black'}}>GLAM</Link>
      </Typography> 
      <Divider />{/*Draws a line under the title of drop down menu*/}
      {/*List Componenet used to list stuff*/}
      <List>

        {/*Itterates over the array which holds the names of the pages*/}
        {navItems.map((item) => (
          
          //creates the list of About Me, Services, Booking Inquiry ...etc
          <ListItem key={item} disablePadding>

            {/*styling for each button inside the list*/}
            <ListItemButton sx={{ textAlign: 'center' }}>

            {/*Goes through item which holds the array of names that correspond to the javascript pages and
            replaces an empty space with a _ so they match the routes defined in app.js so they can be linked 
            properly*/}
             <Link to={`/${item.toLowerCase().replace(/\s+/g, '_')}`} style={{ textDecoration: 'none', color: 'black' }}>
                <ListItemText primary={item} />
            </Link>
            </ListItemButton>
          </ListItem> 
        ))}
      </List>

      {/*Box used to hold the buttons in the drawer*/}
      <Box sx={{ padding: '10px' }}> {/* Adjust padding as needed */}
      {/* Move Login and Register buttons here, inside the drawer */}
      <Button component={Link} to="/LogIn" variant="contained" color="primary" sx={{ margin: '1vh', backgroundColor: "#FDF7F8",color: "black",width: '80%' }}>Login</Button>
      <Button component={Link} to="/Register" variant="contained" color="secondary" sx={{ margin: '1vh', backgroundColor: "#FDF7F8",color: "black",width: '80%' }}>Register</Button>
    </Box>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;
  //handles the nav bar
  return ( 
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> {/* Centering the content */}
      <CssBaseline />
      <AppBar component="nav" sx={{ backgroundColor: 'white', width: '100%', maxWidth: '100vw' }}> {/* Ensuring full width */}
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', width: '100%' }}>
          <div></div> {/* Empty div for spacing */}

          {/*Button for the hamburger menut only showing on mobile since its hidden when the screen is sm: or bigger*/}
          <IconButton
            color="black"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            // makes the button hidden when the button is in sm or bigger refer to top of page
            sx={{ ml: 1, display: { xs: 'block', sm: 'none' } }} // Updated styling for the hamburger button
            >
            <MenuIcon />
          </IconButton>

          {/*title of the web page and links to / which correpsonds to home in app.js . So when you click the title it takes you home*/}
          <Typography variant="h6" component="div" 
           sx={{ 
            display: { xs: 'flex', sm: 'flex' },
            flexDirection: 'column', 
            alignItems: 'center', // Center items horizontally
            marginLeft: 'auto',   // Pushes content to the center
            marginRight: 'auto',  // Pushes content to the center
            fontFamily: 'Playfair Display, serif',
            fontSize:30
          }}>
              {/*To center title*/}
            <Link to="/" style={{ textDecoration: 'none', color: 'black'}}>GLAM<br></br>By Manpreet</Link>
          </Typography>

          {/* Buttons to login and register for the desktop version*/}
          <Box sx={{ display: { xs: 'none', sm: 'flex' },flexDirection: 'column', alignItems: 'center'}}>
          <Button component={Link} to="/LogIn" variant="contained" style={{ margin: '.5vh', backgroundColor: "#FDF7F8",color: "black"}}>Login</Button>
          <Button component={Link} to="/Register" variant="contained" color="primary" style={{ margin: ".5vh",backgroundColor: "#FDF7F8",color: "black"}}>Register</Button>
          </Box>

             {/*Buttons for the tiktok and IG, they link you to the website using href and the link*/}
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '10px' }}>
                  <a href="https://www.tiktok.com/@glambymanpreet?_t=8lKt0ltppzX&_r=1" target="_blank" rel="noopener noreferrer">
                <img src={ticktokLogo} alt="TikTok" style={{ width: '30px', height: 'auto', paddingBottom: '10px' }} />
              </a>
                  <a href="https://www.instagram.com/glambymanpreet?igsh=MzRlODBiNWFlZA==" target="_blank" rel="noopener noreferrer">
                <img src={IGlogo} alt="Instagram" style={{ width: '30px', height: 'auto' }} />
              </a>
            </div>
        </Toolbar>

        {/*draws a line under the tile to look fancy*/}
        <Box sx={{ backgroundColor: 'black', height: '1.5vh' }} /> 

        {/*this handlse the links in the app bar under the title of the webpage and when the screen is extra small
        it wont display it*/}
        <Box sx={{flexGrow: 1, display: { xs: 'none', sm: 'flex' }, justifyContent: 'center',backgroundColor: '#FDF7F8'}}>
            {/*itterates throug the array nav items and stored in items*/} 

            {navItems.map((item) => (
              //makes a button for each item in navitems 
              <Button
              key={item}
              component={Link}
              to={item==='Home'?"/":`/${item.toLowerCase().replace(/\s+/g, '_')}`} // Replace spaces with underscore to match the routes in app.js
              sx={{
                color: 'black',
                textTransform: 'none',
                fontSize: 15, // Responsive fontSize for different breakpoints
                flexGrow: 1, // Ensure equal spacing between links
                minWidth: 'auto', // Set minimum width for each link
                border: '2px solid #E8E8E8', // Add border styling
                borderRadius: '5px', // Add border radius for rounded corners
                padding: '6px 12px', // Add padding for spacing inside the button
                margin: '0 4px', // Add margin for spacing between buttons
                backgroundColor: '#FDF7F8', // Set background color of the button
                '&:hover': { // Hover effect
                  color: 'black', // Change text color on hover
                  border: '2px solid #E8E8E8', // Add border
                  backgroundColor: '#FDF7F8', //
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Adding a shadow effect
               },
                '&:focus': { // Focus effect
                  backgroundColor: '#E8E8E8', // Light gray background color on hover
                  color: 'black', // Change text color on hover
                },
              }}>
              {item } 
            </Button>
            ))}
          </Box>
      </AppBar>
      <nav>
        <Drawer //handles the drawer that comes in from the side when the hamburger button is pressed
          container={container}
          variant="temporary"

          open={mobileOpen}//open if mobileopen is true
          onClose={handleDrawerToggle}//toggles mobile state so swiches between it being true or false
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          //styling
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {/*Renders the drawer componet from const drawer function */}
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
  window: PropTypes.func,
};

export default DrawerAppBar;