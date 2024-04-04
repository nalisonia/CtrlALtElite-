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
import { Link,useLocation } from "react-router-dom"; // Import Link from react-router-dom
import '../Styles/NavBar.css'; // Import CSS file for styling 




export default function Header() {
	const location = useLocation();
	const currentPath = location.pathname;
  
	const AboutText = currentPath === "/AboutMe" ? "Home" : "About";
	const AboutLink = currentPath === "/AboutMe" ? "/" : "/AboutMe";

	const ServicesText = currentPath === "/Services" ? "Home" : "Services";
	const ServicesLink = currentPath === "/Services" ? "/" : "/Services";
  

	const BookingInquryText = currentPath === "/BookingInqury" ? "Home" : "Booking Inqury";
	const BookingInquryLink = currentPath === "/BookingInqury" ? "/" : "/BookingInqury";

	const ContactMeText = currentPath === "/ContactMe" ? "Home" : "Contact Me";
	const ContactMeLink = currentPath === "/ContactMe" ? "/" : "/ContactMe";

	const GalleryText = currentPath === "/Gallery" ? "Home" : "Gallery";
	const GalleryLink = currentPath === "/Gallery" ? "/" : "/Gallery";



	return (
		<div className="header-container">
<AppBar position="fixed" sx={{ backgroundColor: 'white' }}>
	
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
	<Link to={AboutLink} style={{ textDecoration: 'none', color: 'black' }}>
	{AboutText}</Link>    
	<Link to={ServicesLink} style={{ textDecoration: 'none', color: 'black', marginRight: '10px' }}>{ServicesText}</Link>
	<Link to={BookingInquryLink} style={{ textDecoration: 'none', color: 'black', marginRight: '10px' }}>{BookingInquryText}</Link>
	<Link to={ContactMeLink} style={{ textDecoration: 'none', color: 'black', marginRight: '10px' }}>{ContactMeText}</Link>
	<Link to={GalleryLink} style={{ textDecoration: 'none', color: 'black', marginRight: '10px' }}>{GalleryText}</Link>
	

</div>

</AppBar>

</div>
	);
}
