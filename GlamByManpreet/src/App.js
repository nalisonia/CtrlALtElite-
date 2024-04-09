import React from 'react';
import HomePage from './Pages/Home.js';
import Header from './Components/navbar.js';
import Footer from './Components/Footer.js';
import AboutMe from './Pages/AboutMe.js'; // Import the AboutMe component
import Services from './Pages/Services.js';
import BookingInqury from './Pages/BookingInquiry.js';
import ContactMe from './Pages/ContactMe.js';
import Gallery from './Pages/Gallery.js';
import LogIn from './Pages/LogIn.js';
import Register from './Pages/Register.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Routes and BrowserRouter


function App() {
    return (
        <Router> 
            <div className="App">
                <Header />
                <Routes> {/* Wrap your routes with Routes */}
                    <Route path="/" element={<HomePage />} /> {/* Use element prop */}
                    <Route path="/About_Me" element={<AboutMe />} /> {/* Use element prop */}
                    <Route path="/Services" element={<Services/>} /> {/* Use element prop */}
                    <Route path="/Booking_Inqury" element={<BookingInqury/>} /> {/* Use element prop */}
                    <Route path="/Contact_Me" element={<ContactMe/>} /> {/* Use element prop */}
                    <Route path="/Gallery" element={<Gallery/>} /> {/* Use element prop */}
                    <Route path="/LogIn" element={<LogIn/>} />
                    <Route path="/Register" element={<Register/>} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;