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
import TermsOfService from './Pages/TermsOfService.js';
import PrivacyPolicy from './Pages/PrivacyPolicy.js';
import CopyRightPolicy from './Pages/CopyRightPolicy.js';
import CookiePolicy from './Pages/CookiePolicy.js';
import DoNotSell from './Pages/DoNotSell.js';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import {useState, useEffect} from 'react';
import supabase from './config/supabaseClient.js';
 

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
    const [session, setSession] = useState(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session);
          console.log(session);
        });
    
        supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
        });      
    }, []);

    return (
        <Router> 
            <div className="App">
                <NavBar session={session}/>
                <Routes>
                    {/*
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/home" element={<HomePage />} />
                    */}
                    <Route path="/" element={<HomePage/>} />
                    <Route path="/about_me" element={<AboutMe />} /> 
                    <Route path="/services" element={<Services/>} /> 
                    <Route path="/booking_inquiry" element={<BookingInquiry/>} /> 
                    <Route path="/contact_me" element={<ContactMe/>} /> 
                    <Route path="/gallery" element={<Gallery/>} /> 
                    <Route path="/login" element={<LogIn/>} />
                    <Route path="/register" element={<Register/>} />
                    <Route path="/terms_of_service" element={<TermsOfService/>} />
                    <Route path="/privacy_policy" element={<PrivacyPolicy/>} />
                    <Route path="/copy_right_policy" element={<CopyRightPolicy/>} />
                    <Route path="/cookie_policy" element={<CookiePolicy/>} />
                    <Route path="/do_not_sell" element={<DoNotSell/>} />



                    

                </Routes>
                <Footer />
            </div>
        </Router>
    );
}


export default App;