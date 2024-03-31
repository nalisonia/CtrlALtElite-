// home.js
import catImage from '../assets/images/catSideEye.jpeg';


function HomePage() {
    return (
        <div>
            <h1>Welcome to the Home Page!</h1>
            <p>This is the content of the home page. Congratulations you have your environment set up</p>
            <p>Ruben LOVES the 49ers!!!!</p>
            <img src={catImage} alt="Logo" />

            <div>
        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley" target="_blank" rel="noopener noreferrer">
          Watch the video
        </a>
      </div>
        </div>
        
    );
}

export default HomePage;