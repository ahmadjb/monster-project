import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import logo from './logo.svg';
import './App.css';
import FirstPage from './firstPage';
import SecondPage from './secondPage';
import { useNavigate } from 'react-router-dom';

function Navigation() {
  const navigate = useNavigate();

  const handleButtonClick = (path) => {
    navigate(path);
    window.scrollTo(0, 750);
  };

  return (
    <nav>
     <div className='banner-inner h1'
                style={{
                    backgroundColor: '',
                    display: 'inline-block',
                    paddingTop: 0,
                    animation: 'moveLeftToRight 10s linear infinite',
                }}
            >
                please choose your page
            </div>
      <div>
      
        <button className="cool-button" onClick={() => handleButtonClick('/first')}>
          First Page
        </button>
      </div>

      <div style={{ paddingTop: 20, paddingBottom: 20 }}>
        <button className="cool-button" onClick={() => handleButtonClick('/second')}>
          Second Page
        </button>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Navigation />
        </header>
        {/* Define Routes */}
        <Routes>
          <Route path="/first" element={<FirstPage />} />
          <Route path="/second" element={<SecondPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
