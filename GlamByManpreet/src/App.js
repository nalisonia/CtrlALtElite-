import React from 'react';
import HomePage from './Pages/Home.js';
import Header from './Components/header.js';
import AboutMe from './Pages/AboutMe.js'; // Import the AboutMe component
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Routes and BrowserRouter

function App() {
    return (
        <Router> {/* Wrap everything with Router */}
            <div className="App">
                <Header />
                <Routes> {/* Wrap your routes with Routes */}
                    <Route path="/" element={<HomePage />} /> {/* Use element prop */}
                    <Route path="/AboutMe" element={<AboutMe />} /> {/* Use element prop */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
