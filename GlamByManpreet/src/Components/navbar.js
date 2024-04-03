// Filename - Header.js

import * as React from "react";

// importing material UI components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ticktokLogo from '../assets/images/tictokicon.png';
import IGlogo from '../assets/images/Instagram_icon.png';
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import '../Styles/NavBar.css'; // Import CSS file for styling 




export default function Header() {
	return (
		<div className="header-container">
<AppBar position="static" sx={{ backgroundColor: 'white' }}>
	
    <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '10px', paddingBottom: '10px' }}>
        {/* Container for IconButton components */}

		<Typography variant="h6" component="div" sx={{ color: 'black', fontWeight: 'bold', marginRight: 'auto', marginLeft: 'auto' }}>
    		<Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>GlamByManpreet</Link>
		</Typography>
	


        <div style={{ display: 'flex', flexDirection: 'column' }}>


			<a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer">
        		<img src={ticktokLogo} alt="TikTok" style={{ width: '30px', height: 'auto',paddingBottom: '10px' }} />
      		</a>

			<a href="https://www.instagram.com/glambymanpreet?igsh=MzRlODBiNWFlZA==" target="_blank" rel="noopener noreferrer">
        		<img src={IGlogo} alt="Instagram" style={{ width: '30px', height: 'auto' }} />
      		</a>
            

        </div>


    </Toolbar>
	<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px' }}>
    <Link to="/AboutMe" style={{ textDecoration: 'none', color: 'black', marginRight: '10px' }}>About</Link>
    <Link to="/Services" style={{ textDecoration: 'none', color: 'black', marginRight: '10px' }}>Services</Link>
	<Link to="/BookingInqury" style={{ textDecoration: 'none', color: 'black', marginRight: '10px' }}>BookingInqury</Link>
	<Link to="ContactMe" style={{ textDecoration: 'none', color: 'black', marginRight: '10px' }}>ContactMe</Link>
	<Link to="/Gallery" style={{ textDecoration: 'none', color: 'black', marginRight: '10px' }}>Gallery</Link>
	

</div>

</AppBar>

</div>
	);
}
