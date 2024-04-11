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
import supabase from '../config/supabaseClient';
import { useState, useEffect } from 'react';

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
const navItems = ['About Me', 'Services', 'Booking Inqury', 'Contact Me', 'Gallery'];

function DrawerAppBar(props) {
  const [session, setSession] = useState(null)

  const { window } = props;

  //console.log(props.session) retrieved session form App.js
  useEffect(() => {
    if (props?.session) {
      setSession(props.session);
    }
  }, [props.session]);
   // Sets session state to null or metadata (valid data = true)
  //console.log(props.session)

  //variable intialized named mobileopen using usestate. This var will be used if the website is not in desktop mode
  const [mobileOpen, setMobileOpen] = React.useState(false);

  //set mobile open chagnes the state of the variable named setmobileopen
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  async function handleSignIn() { // A user clicking on Login button calls this function to handle OAuth Sign In
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })

    console.log(data, error);
  }

  const handleSignOut = async () => { // A user clicking on Logout button calls this function to handle Sign Out
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error.message);
    } else {
      console.log('User signed out successfully');
      // Reload the current page
      //window.location.reload(false); // Reloads the page for user data security
      // Optionally, redirect or update state after sign out
    }
  };

  //this code deals with the hamburger button, whhen you cick outside of the dropdown button
  //handDrawerToggle is called and sets the state of mobileopen to the oppisiote state
  //closing or opeing the menu 
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>

      
      {/*This handles the title of the drop down menu*/}
      <Typography variant="h6" sx={{ my: 2, justifyContent:'center' }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'black'}}>Home</Link>
      </Typography> 

      <Divider />{/*Draws a line under the title of drop down menu*/}

      {/*List Componenet used to list stuff*/}
      <List>

        {/*Itterates over the array which holds the names of the pages*/}
        {navItems.map((item) => (
          
          //creates the list of About Me, Services, Booking Inqury ...etc
          <ListItem key={item} disablePadding>

            {/*styling for each button*/}
            <ListItemButton sx={{ textAlign: 'center' }}>

            {/*Goes through item which holds the array of names that correspond to the javascript pages and
            replaces an empty space with a _ so they match the routes defined in app.js so they can be linked 
            properly*/}
             <Link to={`/${item.toLowerCase().replace(/\s+/g, '_')}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <ListItemText primary={item} />
            </Link>


            </ListItemButton>
          </ListItem>
          
        ))}
      </List>


      <Box sx={{ padding: '10px' }}> {/* Adjust padding as needed */}
      {/* Move Login and Register buttons here, inside the drawer */}

      {/*
            <Button component={Link} to="/LogIn" variant="contained" color="primary" sx={{ marginBottom: '10px', width: '80%' }}>Login</Button>
      <Button component={Link} to="/Register" variant="contained" color="secondary" sx={{ width: '80%' }}>Register</Button>
      */}
      { // Login or Logout button renders whether user is signed in or not.
            session ? (
              <Button component={Link} variant="contained" color="primary" sx={{ marginBottom: '10px', width: '80%' }} onClick={() => handleSignOut()}>
                Log out
              </Button>
            ) : (
              <Button component={Link} variant="contained" color="secondary" sx={{ width: '80%' }} onClick={() => handleSignIn()}>
                Log In
              </Button>
            )
          }
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
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/*title of the web page and links to / which correpsonds to home in app.js . So when you click the title it takes you home*/}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'flex', sm: 'block'}, justifyContent: 'center'}}> {/*To center title*/}
            <Link to="/" style={{ textDecoration: 'none', color: 'black'}}>GLAM<br></br>By Manpreet</Link>
          </Typography>

          {/* Buttons to login and register for the desktop version*/}
          <Box sx={{ display: { xs: 'none', sm: 'flex' },flexDirection: 'column', alignItems: 'center' }}>
          {
            session ? (
              <Button component={Link} variant="contained" color="secondary" style={{ margin: '5px' }} onClick={() => handleSignOut()}>
                Log out
              </Button>
            ) : (
              <Button component={Link} variant="contained" color="primary" style={{ margin: '5px' }} onClick={() => handleSignIn()}>
                Log In
              </Button>
            )
          }
          {/*
                    <Button component={Link} variant="contained" color="primary" style={{ margin: '5px' }} onClick={() => handleSignIn()}>Login</Button>
                    <Button component={Link} to="/Register" variant="contained" color="secondary" style={{ margin: '5px' }}>Registffer</Button>
          */}


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


        {/*this handlse the links in the app bar under the title of the webpage and when the screen is extra small
        it wont display it*/}
        <Box sx={{flexGrow: 1, display: { xs: 'none', sm: 'flex' }, justifyContent: 'center'}}>
            {/*itterates throug the array nav items and stored in items*/} 
            {navItems.map((item) => (
              //makes a button for each item in navitems
              <Button
              key={item}


              component={Link}
              to={`/${item.toLowerCase().replace(/\s+/g, '_')}`} // Replace spaces with underscore to match the routes in app.js
              sx={{ color: 'black', textTransform: 'none' }} // You can adjust the style as needed
            >
              {item}
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