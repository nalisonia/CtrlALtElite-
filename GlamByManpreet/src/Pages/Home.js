// home.js
import React from 'react';
import catImage from '../assets/images/catSideEye.jpeg';
import supabase from '../config/supabaseClient';
import '../Styles/Home.css'; // Import CSS file for styling

function HomePage() {
    console.log(supabase);

    return (
        <div className="home-container">
            <h1>Welcome to the Home Page!</h1>
            <p>This is the content of the home page. Congratulations you have your environment set up</p>
            <p>Ruben LOVES the 49ers!!!</p>

            <div className='picture-container'>

            <div class="card">
            <img src={catImage} alt="Cat" className="cat-image" />
            <p>

Transform your furry friend into a glamorous diva with our purr-fect makeup collection! Enhance those whiskers with our shimmering eyeshadows, 
add a touch of sparkle to those ears with our glittery highlights, and don't forget to contour those cheekbones for a fierce feline look. Whether 
it's for a special occasion or just a day of pampering, our makeup will make your cat the center of attention wherever they go. Meow-velous beauty awaits!
</p>
            </div>

            <div class="card">
            <img src={catImage} alt="Cat" className="cat-image" />
            <p>Transform your furry friend into a glamorous diva with our purr-fect makeup collection! Enhance those whiskers with our shimmering eyeshadows, 
add a touch of sparkle to those ears with our glittery highlights, and don't forget to contour those cheekbones for a fierce feline look. Whether 
it's for a special occasion or just a day of pampering, our makeup will make your cat the center of attention wherever they go. Meow-velous beauty awaits!</p>
            </div>
            


            
            </div>
            

            <div>
                <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley" target="_blank" rel="noopener noreferrer">
                    Watch the video 
                </a>
                <p>{supabase.supabaseUrl ? "Supabase Connected: " + supabase.supabaseUrl : "Supabase is not connected"}</p>
            </div>
        </div>
    );
}

export default HomePage;
