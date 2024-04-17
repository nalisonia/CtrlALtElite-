import React from 'react';
import HomePage from './Pages/Home.js';
import NavBar from './Components/navbar.js';
import Footer from './Components/Footer.js';
import AboutMe from './Pages/AboutMe.js'; // Import the AboutMe component
import Services from './Pages/Services.js';
import BookingInquiry from './Pages/BookingInquiry.js';
import ContactMe from './Pages/ContactMe.js';
import Gallery from './Pages/Gallery.js';
import LogIn from './Pages/LogIn.js';
import Register from './Pages/Register.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Routes and BrowserRouter

//app.js serves as the main entry point and central configuration file for the application. 
//It is where you define the overall structure of our application, including routing, layout, and any global state management.

//we can make routes to Link us to the page we want to go to in our website. First we import the page we want to link to.
//Example we can import AboutMe by giving the path where its located './Pages/AboutMe.js'; and giving it a name such as AboutMe
//then we can put it inisdes the routes tag and give it a route. <Route path="/About_Me" element={<AboutMe />} /> 
//path will be the name we refernece when we want to go to that page. Element is the variable name we gave to where the page is located
//example in the nav bar we made clicking the title take us to the home page by clicking it. We used the link tag and we want to go to the 
//home page which corresponds to "/" as see in the first Route
//<Link to="/" style={{ textDecoration: 'none', color: 'black'}}>GLAM<br></br>By Manpreet</Link>

//NavBar and the footer are rendered at the top level of the app componentn so they will always be rendered.
//We Import navbar and header as so from './Components/navbar.js'; then give it a name such as NavBar
//then we place the navbar tag above routes and footer below routes. If we were to delete those tags
//we would notice that the website would not have the nav bar or header


function App() {
    return (
        <Router> 
            <div className="App">
                <NavBar />
                <Routes> 
                <Route path="/home" element={<HomePage />} />

                    <Route path="/About_Me" element={<AboutMe />} /> 
                    <Route path="/Services" element={<Services/>} /> 
                    <Route path="/Booking_Inquiry" element={<BookingInquiry/>} /> 
                    <Route path="/Contact_Me" element={<ContactMe/>} /> 
                    <Route path="/Gallery" element={<Gallery/>} /> 
                    <Route path="/LogIn" element={<LogIn/>} />
                    <Route path="/Register" element={<Register/>} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;