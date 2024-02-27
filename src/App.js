import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';

function Navigation() {

  const convertTextToSpeech = async (text) => {
    const apiKey = "SBYDJQTG"; // Replace with your actual API key
    const apiUrl = `https://api.responsivevoice.org/responsivevoice?key=${apiKey}&src=${text}&hl=en_US`;

    try {
      const response = await axios.get(apiUrl);
      
      console.log('API Response:', response); // Log the API response
      const audioUrl = response.data;

      // Play the audio or do whatever you want with it
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error('Error converting text to speech:', error);
    }
  };

  const handleButtonClick = () => {
    const textToConvert = "Hello, this is a sample text."; // Replace with your text
    convertTextToSpeech(textToConvert);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <div
              className='banner-inner h1'
              style={{
                backgroundColor: '',
                display: 'inline-block',
                paddingTop: 0,
                animation: 'moveLeftToRight 10s linear infinite',
              }}
            >
              please choose your page
            </div>
          </nav>
          <div>
          <button onClick={handleButtonClick}>Convert to Speech</button>
        </div>
        </header>

       
      </div>
    </Router>
  );
}

export default Navigation;
