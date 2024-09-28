import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import supabase from './config/supabaseClient.js';
import NavBar from './Components/navbar.js';
import Footer from './Components/Footer.js';
import HomePage from './Pages/Home.js';
import AboutMe from './Pages/AboutMe.js'; 
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
import DashBoard from './Pages/DashBoard.js';

function App() {
    const [session, setSession] = useState(null);

    useEffect(() => {
        // Get the current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            console.log(session);
        });

        // Subscribe to auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        // Cleanup subscription on unmount
        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, []);

    return (
        <Router> 
            <div className="App">
                <NavBar session={session}/>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about_me" element={<AboutMe />} /> 
                    <Route path="/services" element={<Services />} /> 
                    <Route path="/booking_inquiry" element={<BookingInquiry />} /> 
                    <Route path="/contact_me" element={<ContactMe />} /> 
                    <Route path="/gallery" element={<Gallery />} /> 
                    <Route path="/login" element={<LogIn />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/terms_of_service" element={<TermsOfService />} />
                    <Route path="/privacy_policy" element={<PrivacyPolicy />} />
                    <Route path="/copy_right_policy" element={<CopyRightPolicy />} />
                    <Route path="/cookie_policy" element={<CookiePolicy />} />
                    <Route path="/do_not_sell" element={<DoNotSell />} />
                    <Route path="/dashboard" element={<DashBoard />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
