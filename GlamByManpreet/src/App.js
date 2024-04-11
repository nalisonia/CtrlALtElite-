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
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Routes and BrowserRouter
import supabase from './config/supabaseClient.js';


function App() {
    // useState() are like variables, defautl value is null until you set the state to a value somewhere in the code.
    const [session, setSession] = useState(null)
    const [email, setEmail] = useState(null) 

    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
        setEmail(session?.user?.email); // use ?. operator to prevent "cannto read properties of null" error

        console.log(session);
        if (session){
            console.log("Welcome!");
        } else {
            console.log("User is not signed in")
        }
      })
  
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })
    }, []) // use useEffect() to prevents infinite re-rendering.

    return (
        <Router> 
            <div className="App">
                {/*<Header />*/}
                
                <Header session={session} /> {/* Pass valid user's metadata to navbar component to render login/logout button correctly */}
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