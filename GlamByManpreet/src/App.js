import React, { useState, useEffect } from 'react';
//import React from 'react';
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
import UserView from './Pages/UserView.js';
import UserFeed from './Pages/UserFeed.js';
import ProfileEdit from './Pages/ProfileEdit.js';
import InquiryHistory from './Pages/InquiryHistory.js';
import AdminDashboard from './Pages/AdminDashboard.js';
import ResetPassword from './Pages/ResetPassword.js';
import ProtectedRoute from './Pages/ProtectedRoute'; // Import ProtectedRoute
 


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
    const [session, setSession] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);


    useEffect(() => {
        const fetchSessionAndCheckAdmin = async () => {
          const { data: { session } } = await supabase.auth.getSession();
          setSession(session);
    
          if (session) {
            // Check if user is an admin
            const { data: adminData } = await supabase
              .from("admin")
              .select("email")
              .eq("email", session.user.email);
    
            setIsAdmin(adminData && adminData.length > 0);
          } else {
            setIsAdmin(false);
          }
        };
    
        fetchSessionAndCheckAdmin();
    
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
          if (session) {
            supabase
              .from("admin")
              .select("email")
              .eq("email", session.user.email)
              .then(({ data: adminData }) => setIsAdmin(adminData && adminData.length > 0));
          } else {
            setIsAdmin(false);
          }
        });
    
        return () => {
          subscription.unsubscribe();
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
                    <Route path="/userfeed" element={<UserFeed/>} />
                    <Route path="/profileedit" element={<ProfileEdit/>} />
]                    <Route path="*" element={<Navigate to="/" />} />
                    <Route path="/inquiryhistory" element={<InquiryHistory />} />
                    <Route path="/ResetPassword" element={<ResetPassword />} />

                     {/* Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                element={AdminDashboard}
                session={session}
                isAllowed={session && isAdmin}
                redirectTo="/login"
              />
            }
          />

          <Route
            path="/userview"
            element={
              <ProtectedRoute
                element={UserView}
                session={session}
                isAllowed={session && !isAdmin} // Allow only if not admin
                redirectTo="/login"
              />
            }
          />

                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
