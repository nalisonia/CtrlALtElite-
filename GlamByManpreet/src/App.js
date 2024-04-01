import React from 'react';
import HomePage from './Pages/Home.js';
import Header from './Components/header.js';
import supabase from './config/supabaseClient.js';


function App() {
    return (
        <div className="App">
            <Header/>
            <HomePage />
            
        </div>
    );
}

export default App;
