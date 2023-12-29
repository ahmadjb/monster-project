import React from 'react';
import './App.css';
import logo from './logo2.png';
import logo2 from './icon02.png';

import logo3 from './access-img45.png';


function isDeviceWithScreen() {
    return window.matchMedia('(any-pointer: fine)').matches;
  }
  
  // Example usage
  const isDeviceWithScreenResult = isDeviceWithScreen();
  console.log('Is device with screen:', isDeviceWithScreenResult);
  
function App() {
    // Move the navigateToDiv function inside the component
    const navigateToDiv = (divId) => {
        const element = document.getElementById(divId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="App main-page">
            <div className="row">
                <div className="col-md-5 text-center" style={{ backgroundColor: '' }}>
                    <img src={logo} alt="Your Photo" style={{ maxWidth: '100%', height: 'auto' }} />
                </div>

                <div className="col-md-7 text-center" style={{ backgroundColor: '', display: isDeviceWithScreenResult? 'flex':'', justifyContent: 'space-between', paddingTop: 20 }}>
                    <div className='header-text' onClick={() => navigateToDiv('section1')} style={{ cursor: 'pointer' }}>Demo Video</div>
                    <div className='header-text'>Features</div>
                    <div className='header-text'>Login</div>
                    <div className='header-text'>Blog</div>
                    <div className='header-text'>Support</div>

                    <div style={{ display: 'flex', justifyContent: 'center',alignItems:'center',marginTop:-30  }}>
                        <button className="cool-button" style={{ width: 100, height: 50}} >
                            start
                        </button>

                    </div>
                </div>

                <div className='banner-inner h1' style={{ color: '#F8B200', paddingTop: 40 }}>To watch the demo video, click on the the demo video text</div>
                <div className='banner-inner h1' style={{ color: '#fff' }}>with World’s First AI Powered Lead Finder</div>
                <div className='banner-inner2' style={{ color: '#F8B200', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ paddingRight: 20 }}>
                        <div style={{ backgroundColor: '', display: 'flex', paddingTop: 5 }}>
                            <img src={logo2} alt="Your Photo" style={{ maxWidth: '100%', height: 'auto' }} />
                        </div>
                    </div>
                    <div>IN UNDER 60 SECONDS</div>
                </div>
            </div>

            <div className="row d-flex" style={{ backgroundColor: '' }}>
                <div className='col-md-6 d-flex justify-content-end banner-inner3'>
                    <div style={{ backgroundColor: '', display: 'flex', paddingTop: 5 }}>
                        <img src={logo2} alt="Your Photo" style={{ maxWidth: '100%', height: 'auto' }} />
                    </div>
                    <div style={{ paddingLeft: 15, paddingTop: 10 }}>
                        No Cold Calling Necessary
                    </div>
                </div>
                <div className='col-md-6 d-flex justify-content-start banner-inner3'>
                    <div style={{ backgroundColor: '', display: 'flex', paddingTop: 5 }}>
                        <img src={logo2} alt="Your Photo" style={{ maxWidth: '100%', height: 'auto' }} />
                    </div>
                    <div style={{ paddingLeft: 15, paddingTop: 10 }}>
                        Full Edition, Everything Included
                    </div>
                </div>
            </div>

            <div className="col-md-12 text-center" style={{ backgroundColor: '' }}>
                <div className='col-md-12 d-flex justify-content-center banner-inner3'>
                    <div style={{ backgroundColor: '', display: 'flex', paddingTop: 5 }}>
                        <img src={logo2} alt="Your Photo" style={{ maxWidth: '100%', height: 'auto' }} />
                    </div>
                    <div style={{ paddingLeft: 15, paddingTop: 10 }}>
                        No Technical Skills or Marketing Experience Needed
                    </div>
                </div>
            </div>

          
            <div className='banner-inner h1'
                style={{
                    backgroundColor: '',
                    display: 'inline-block',
                    paddingTop: 100,
                    animation: 'moveLeftToRight 10s linear infinite',
                }}
            >
                Bu bölüm Ahmad Cbeili tarafından yapılmıştır.
            </div>

            <div style={{ backgroundColor: '', display: '', paddingTop: 100 }}>
                <img src={logo3} alt="Your Photo" style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
            <div>
                <section id="section1">
                    <div className="row d-flex" style={{ backgroundColor: '' }}>
                        <div className='col-md-12 d-flex justify-content-center' style={{ paddingTop: 60 }}>
                            {/* YouTube Video - Using iframe */}
                            <iframe
                                width="80%"
                                height="300%"
                                src="https://www.youtube.com/embed/fwhjCw-IUu0"
                                title="YouTube Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>

                    </div>

                </section>


            </div>

            <div className='banner-inner h1' style={{ paddingTop: 400 }} > The end</div>

        </div>

    );
}

export default App;
