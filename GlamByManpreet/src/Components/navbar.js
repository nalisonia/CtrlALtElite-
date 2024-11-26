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
// Array of text that corresponds to the routes in the App.js page, used for the buttons in desktop and mobile modes
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
  const [isAdmin, setIsAdmin] = useState(null); // Track if the user is an admin; null indicates pending check

  useEffect(() => {
    const fetchSessionAndCheckAdmin = async () => {
      // Fetch the current session
      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      // If there's a session, check if the user is an admin
      if (data.session) {
        const { user } = data.session;
        const { data: adminData } = await supabase
          .from("admin")
          .select("email")
          .eq("email", user.email);

        setIsAdmin(adminData && adminData.length > 0); // Set isAdmin based on the admin check
      } else {
        setIsAdmin(false); // Reset if no session
      }
    };

    fetchSessionAndCheckAdmin();

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
      if (session) {
        supabase
          .from("admin")
          .select("email")
          .eq("email", session.user.email)
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
  const navItems = session
    ? [
        ...baseNavItems,
        isAdmin === true ? "ADMIN" : isAdmin === false ? "PROFILE" : null,
      ].filter(Boolean) // Filter out null if isAdmin is still null
    : baseNavItems;

  const handleSignIn = () => {
    navigate("/LogIn");
  };

  // Uses Supabase to sign out
  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      // Optionally fetch session again to ensure it's cleared
      const { data } = await supabase.auth.getSession();
      console.log("Session after logout:", data.session); // Should be null
      setSession(null);
      setIsAdmin(false); // Reset admin state
      navigate("/");
    }
  }

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2, justifyContent: "center" }}>
        <Link class="Drawer_Nav_Bar_Title" to="/">
          GLAM
        </Link>
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <Link
                to={
                  item === "HOME"
                    ? "/"
                    : item === "ADMIN"
                    ? "/admin"
                    : item === "PROFILE"
                    ? "/userview"
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
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
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
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            textAlign: "center",
            width: "100%",
          }}
        >
          <IconButton
            color="black"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ ml: 1, display: { xs: "block", sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "center" }}>
            <Link to="/" className="Nav_Bar_Title">
              GLAM <br />
              <span style={{ display: "block", marginTop: "-15px" }}>by manpreet</span>
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  window: PropTypes.func,
};

export default DrawerAppBar;
