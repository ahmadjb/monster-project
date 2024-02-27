import React, { useEffect } from 'react';
import Logo from './logose.png';
import Logo3 from './new3.png';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

function PageD() {
    useEffect(() => {
        // Initialize the map when the component is mounted
        const map = L.map('map').setView([39.9334, 35.2433], 6);

        // Add a tile layer from OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        // Cleanup function to remove the map when the component is unmounted
        return () => {
            map.remove();
        };
    }, []); // Empty dependency array to run the effect once after the initial render

    function isDeviceWithScreen() {
        return window.matchMedia('(any-pointer: fine)').matches;
    }

    const isDeviceWithScreenResult = isDeviceWithScreen();
    console.log('Is device with screen:', isDeviceWithScreenResult);
    const columnStyle = {
        background: '#FFD700',
        borderRadius: '5px',
        padding: '20px', // Increased padding for better spacing
        margin: '10px',
        color: 'white', // Text color
        fontSize: '18px', // Increased font size
    };

    return (
        <div className="App second-main-page">
            <div className="row" style={{ paddingLeft: 130, paddingTop: 20 }}>
                <div className="col-md-3 text-center">
                    <img
                        src={Logo}
                        alt="Your Photo"
                        className="img-fluid"
                    />
                </div>


                <div className="col-md-6 text-center">
                    <div className="your-class-name header-links d-flex justify-content-between py-20" style={{ paddingLeft: 100 }}>
                        <div className="header-text cursor-pointer " style={{ color: '#023f87', marginTop: 40 }}>
                            ÇÖZÜMLERİMİZ
                            <div className="options-list">
                                <p>Option 1</p>
                                <p>Option 2</p>
                            </div>
                        </div>
                        <div className="header-text" style={{ color: '#023f87', marginTop: 40 }}>
                            <div className="options-list">
                                <p>Option 1</p>
                                <p>Option 2</p>
                            </div>VERİ TABANI
                        </div>
                        <div className="header-text" style={{ color: '#023f87', marginTop: 40 }}>
                            <div className="options-list">
                                <p>Option 1</p>
                                <p>Option 2</p>
                            </div>FİYATLANDIRMA
                        </div>
                        <div className="header-text" style={{ color: '#023f87', marginTop: 40 }}>
                            <div className="options-list">
                                <p>Option 1</p>
                                <p>Option 2</p>
                            </div>İLETEŞİM
                        </div>
                    </div>
                </div>

                <div className="col-md-3 d-flex align-items-center justify-content-center" style={{ paddingTop: 30 }}>
                    <button className="cool-button2 align-items-center justify-content-center" style={{ paddingLeft: 50 }}>
                        Start
                    </button>
                </div>
            </div>

            {/* Map container */}


            <img
                src={Logo3}
                alt="Your Photo"
                className="img-fluid"
                style={{ paddingTop: 30 }}
                width="100%"
                height="20%"
            />
            <div style={{ position: 'absolute', marginTop: -90, color: 'white', fontSize: 30, marginLeft: 300 }}>We have integrated the Leaflet map</div>
            <div id="map" style={{ width: '100%', height: '500px' }}></div>

            <div className="App second-main-page">
                <div className="row" style={{ padding: 90 }}>
                    <div className="col-md-3">
                        <div className="text-center" style={columnStyle}>
                            Avrupa & BDT
                            <br />
                            Ülkeleri
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="text-center" style={{ ...columnStyle, background: '#00FFFF' }}>
                            Amerika
                            <br />
                            Ülkeleri
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="text-center" style={{ ...columnStyle, background: '#FF6347' }}>
                            Afrika & Orta Doğu
                            <br />
                            Ülkeleri
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="text-center" style={{ ...columnStyle, background: '#98FB98' }}>
                            Asya Pasifik
                            <br />
                            Ülkeleri
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default PageD;
