import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import ReactAudioPlayer from 'react-audio-player';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';


import './App.css';

import Monster from "./APImonster";
import Nconverter from "./APInormal"

function TextToSpeechComponent() {



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
                            <div className='myname'>
                                Ahmad Cbeili tarafından geliştirilmekte
                            </div>
                        </div>
                    </nav>

                    <div className='row'>
                        <div className='col-md-6 col-12 h-line'>
                           <Monster />
                        </div>
                        <div className='col-md-6 col-12 v-line' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                            <Nconverter />
                        </div>
                    </div>

                </header>
            </div>

        </Router>
    );
}


export default TextToSpeechComponent;
