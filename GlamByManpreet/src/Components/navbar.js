import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import ticktokLogo from "../assets/images/tictokicon.png";
import IGlogo from "../assets/images/Instagram_icon.png";
import "../Styles/NavBar.css"; // Import CSS file for styling
import "../Styles/App.css"; // Import CSS file for styling
import "../Styles/Home.css"; // Import CSS file for styling
import supabase from "../config/supabaseClient";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
const baseNavItems = [
  "HOME",
  "ABOUT ME",
  "SERVICES",
  "BOOKING INQUIRY",
  "CONTACT ME",
  "GALLERY",
];

function DrawerAppBar(props) {
  const { window } = props;
  const navigate = useNavigate();
  const [session, setSession] = useState(null); // Initialize session state
  const [isAdmin, setIsAdmin] = useState(false); // Track if the user is an admin


  useEffect(() => {
    const fetchSessionAndCheckAdmin = async () => {
      // Fetch the current session
      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      // If there's a session, check if the user is an admin
      if (data.session) {
        const { user } = data.session;
        const { data: adminData } = await supabase
          .from('admin')
          .select('email')
          .eq('email', user.email);

        setIsAdmin(adminData && adminData.length > 0); // Set isAdmin based on the admin check
      }
    };

    fetchSessionAndCheckAdmin();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
      if (session) {
        supabase
          .from('admin')
          .select('email')
          .eq('email', session.user.email)
          .then(({ data: adminData }) => setIsAdmin(adminData && adminData.length > 0));
      } else {
        setIsAdmin(false); // Reset if no session
      }
    });

    return () => {
      subscription.unsubscribe(); // Clean up subscription on unmount
    };
  }, []);

  // Conditionally add "PROFILE" or "ADMIN" based on admin status
  const navItems = session ? [...baseNavItems, isAdmin ? "ADMIN" : "PROFILE"] : baseNavItems;

  const handleSignIn = () => {
    navigate("/LogIn");
  };


  //uses supabase to sign out
  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      // Optionally fetch session again to ensure it's cleared
      const { data } = await supabase.auth.getSession();
      console.log("Session after logout:", data.session); // Should be null
      setSession(null);
      navigate("/");
    }
  }
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
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      {/*This handles the title of the drop down menu*/}
      <Typography variant="h6" sx={{ my: 2, justifyContent: "center" }}>
        <Link class="Drawer_Nav_Bar_Title" to="/">
          GLAM
        </Link>
      </Typography>
      <Divider />
      {/*Draws a line under the title of drop down menu*/}
      {/*List Componenet used to list stuff*/}

      <List>
        
        {/*Itterates over the array which holds the names of the pages*/}
        {navItems.map((item) => (
          
          //creates the list of About Me, Services, Booking Inquiry ...etc
          <ListItem key={item} disablePadding>
            {/*styling for each button inside the list*/}
            <ListItemButton sx={{ textAlign: "center" }}>
              {/*Goes through item which holds the array of names that correspond to the javascript pages and
            replaces an empty space with a _ so they match the routes defined in app.js so they can be linked 
            properly*/}
              <Link
              to={
                item === "HOME"
                  ? "/"
                  : item === "PROFILE"
                  ? "/userview"
                  : item === "ADMIN"
                  ? "/admin"
                  : `/${item.toLowerCase().replace(/\s+/g, "_")}`
              }
                style={{ textDecoration: "none", color: "black" }}
              >
                <ListItemText primary={item} />
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      

      {/*Box used to hold the buttons in the drawer*/}
      <Box sx={{ padding: "10px" }}>
        {session ? (
          <Button
            variant="contained"
            sx={{
              color: "black",
              backgroundColor: "#FDF7F8",
              marginBottom: "10px",
              width: "80%",
              "&:hover": {
                color: "black",
                border: "2px solid #E8E8E8",
                backgroundColor: "#ec98e8",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              },
            }}
            onClick={handleSignOut}
          >
            Log out
          </Button>
        ) : (
          <Button
            variant="contained"
            sx={{
              color: "black",
              backgroundColor: "#FDF7F8",
              marginBottom: "10px",
              width: "80%",
              "&:hover": {
                color: "black",
                border: "2px solid #E8E8E8",
                backgroundColor: "#ec98e8",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              },
            }}
            onClick={handleSignIn}
          >
            Log In
          </Button>
        )}
      </Box>

      <Button
        sx={{
          color: "black",
          backgroundColor: "#FDF7F8",
          marginBottom: "10px",
          width: "75%",
          "&:hover": {
            // Hover effect
            color: "black", // Change text color on hover
            border: "2px solid #E8E8E8", // Add border
            backgroundColor: "#ec98e8", //
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Adding a shadow effect
          },
        }}
        component={Link}
        to="/Register"
        variant="contained"
      >
        Register
      </Button>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;
  //handles the nav bar
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      {" "}
      {/* Centering the content */}
      <CssBaseline />
      <AppBar
        component="nav"
        sx={{
          backgroundColor: "white",
          width: "100%",
          maxWidth: "100vw",
          position: "relative",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        {" "}
        {/* Ensuring full width */}
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            textAlign: "center",
            width: "100%",
          }}
        >
          <div></div> {/* Empty div for spacing */}
          {/*Button for the hamburger menut only showing on mobile since its hidden when the screen is sm: or bigger*/}
          <IconButton
            color="black"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            // makes the button hidden when the button is in sm or bigger refer to top of page
            sx={{ ml: 1, display: { xs: "block", sm: "none" } }} // Updated styling for the hamburger button
          >
            <MenuIcon />
          </IconButton>
          {/*title of the web page and links to / which correpsonds to home in app.js . So when you click the title it takes you home*/}
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: "flex", sm: "block" },
              justifyContent: "center",
              paddingTop: "15px",
              marginLeft: "40px",
              textAlign: "center",
              fontWeight: "200" ,
            }}
          >
            {/*To center title*/}
            <Link to="/" className="Nav_Bar_Title">
              GLAM 
              <br />
              <span style={{ display: "block", marginTop: "-15px", marginLeft: "-12px", fontSize: "2.5rem", fontWeight: "100"  }}>
                by manpreet</span>
            </Link>
          </Typography>
          {/* Buttons to login and register for the desktop version*/}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {
              // Login or Logout button renders whether user is signed in or not.
              session ? (
                <Button
                  variant="contained"
                  sx={{
                    color: "black",
                    backgroundColor: "#FDF7F8",
                    margin: "0.5vh",
                    width: "100%",
                    marginBottom: "10px",
                    "&:hover": {
                      color: "black",
                      border: "2px solid #E8E8E8",
                      backgroundColor: "#ec98e8",
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    },
                    "&:focus": {
                      outline: "none",
                      backgroundColor: "#ec98e8",
                    },
                    "&:visited": {
                      color: "black",
                      backgroundColor: "#FDF7F8",
                    },
                  }}
                  onClick={handleSignOut} // Call handleSignOut directly
                >
                  Log out
                </Button>
              ) : (
                <Button
                  variant="contained"
                  sx={{
                    color: "black",
                    backgroundColor: "#FDF7F8",
                    marginBottom: "10px",
                    width: "100%",
                    "&:hover": {
                      color: "black",
                      border: "2px solid #E8E8E8",
                      backgroundColor: "#ec98e8",
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    },
                    "&:focus": {
                      outline: "none",
                      backgroundColor: "#ec98e8",
                    },
                    "&:visited": {
                      color: "black",
                      backgroundColor: "#FDF7F8",
                    },
                  }}
                  onClick={handleSignIn}
                >
                  Log In
                </Button>
              )
            }
            <Button
              sx={{
                color: "black",
                backgroundColor: "#FDF7F8",
                "&:hover": {
                  color: "black",
                  border: "2px solid #E8E8E8",
                  backgroundColor: "#ec98e8",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                },
              }}
              component={Link}
              to="/Register"
              variant="contained"
            >
              Register
            </Button>
          </Box>
          {/*Buttons for the tiktok and IG, they link you to the website using href and the link*/}
          <div class="Social_Media_Icons">
            <a
              href="https://www.tiktok.com/@glambymanpreet?_t=8lKt0ltppzX&_r=1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img id="TikTokIcon" src={ticktokLogo} alt="TikTok" />
            </a>
            <a
              href="https://www.instagram.com/glambymanpreet?igsh=MzRlODBiNWFlZA=="
              target="_blank"
              rel="noopener noreferrer"
            >
              <img id="InstagramIcon" src={IGlogo} alt="Instagram" />
            </a>
          </div>
        </Toolbar>
        {/*draws a line under the tile to look fancy*/}
        <Box sx={{ backgroundColor: "white", height: "1.0vh" }} />
        {/*this handlse the links in the app bar under the title of the webpage and when the screen is extra small
        it wont display it*/}
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: "none", sm: "flex" },
            justifyContent: "center",
            backgroundColor: "#FDF7F8",
          }}
        >
          {/*itterates throug the array nav items and stored in items*/}

          {navItems.map((item) => (
            //makes a button for each item in navitems
            <Button
              key={item}
              component={Link}
              to={
                item === "HOME"
                  ? "/"
                  : item === "PROFILE"
                  ? "/userview"
                  : item === "ADMIN"
                  ? "/admin"
                  : `/${item.toLowerCase().replace(/\s+/g, "_")}`
              } // Replace spaces with underscore to match the routes in app.js
              sx={{
                color: "black",
                textTransform: "none",
                fontSize: 15, // Responsive fontSize for different breakpoints
                flexGrow: 1, // Ensure equal spacing between links
                minWidth: "auto", // Set minimum width for each link
                border: "2px solid #E8E8E8", // Add border styling
                borderRadius: "5px", // Add border radius for rounded corners
                padding: "6px 12px", // Add padding for spacing inside the button
                margin: "0 4px", // Add margin for spacing between buttons
                backgroundColor: "#FDF7F8", // Set background color of the button
                "&:hover": {
                  // Hover effect
                  color: "black", // Change text color on hover
                  border: "2px solid #E8E8E8", // Add border
                  backgroundColor: "#ec98e8", //
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Adding a shadow effect
                },
                "&:visited": {
                  // Visited effect
                  color: "black", // Change text color on hover
                  border: "2px solid #E8E8E8", // Add border
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Adding a shadow effect
                },

                "&:focus": {
                  // Focus effect
                  backgroundColor: "#E8E8E8", // Light gray background color on hover
                  color: "black", // Change text color on hover
                },
              }}
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
          open={mobileOpen} //open if mobileopen is true
          onClose={handleDrawerToggle} //toggles mobile state so swiches between it being true or false
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          //styling
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {/*Renders the drawer componet from const drawer function */}
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 0, height: "0px" }}>
        <Toolbar />
      </Box>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  window: PropTypes.func,
};

export default DrawerAppBar;
