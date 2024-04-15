import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactAudioPlayer from 'react-audio-player';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';



import '../App.css';

import Monster from "./APImonster";

function TextToSpeechComponent() {


    const [rate, setRate] = useState(1); // Initial speed rate

    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [textInput, setTextInput] = useState("");
    const [Btn, setBtn] = useState(false);


    useEffect(() => {
        const handleVoicesChanged = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);

            // Set a default voice (you can choose a specific one)
            setSelectedVoice(availableVoices.find(voice => voice.lang === 'en-US'));
        };

        // Add event listener for the 'voiceschanged' event
        window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);

        // Initial fetch of voices
        handleVoicesChanged();

        // Clean up the event listener on component unmount
        return () => {
            window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        };
    }, []);


    const handleButtonClick = () => {

        const textToConvert = textInput; // Replace with your text

        const value = new SpeechSynthesisUtterance(textToConvert);

        if (selectedVoice) {
            value.voice = selectedVoice;
        }

        value.rate = rate; // Set the speed rate
        window.speechSynthesis.speak(value);
    };
    const handlestaticBtn = (btn) => {

        const textToConvert = btn; // Replace with your text

        const value = new SpeechSynthesisUtterance(textToConvert);

        if (selectedVoice) {
            value.voice = selectedVoice;
        }

        value.rate = rate; // Set the speed rate
        window.speechSynthesis.speak(value);
    };

    const handleRateChange = (newRate) => {
        setRate(newRate);
    };

    const handleVoiceChange = (newVoice) => {
        setSelectedVoice(newVoice);
    };


   
    return (

        <div className="App">
           
            <header className="App-header">



                <div>
                    <div>
                        <div className='constantBtn' style={{ width: '100%' }}>
                            <div className='col-md-12' style={{ padding: 5, borderRadius: 20 }}>
                                <button style={{ borderRadius: 7 }} onClick={() => handlestaticBtn("I am ahmad cbeılı")}>I am ahmad cbeılı</button>
                            </div>
                            <div className='col-md-12' style={{ padding: 5, borderRadius: 20 }}>
                                <button style={{ borderRadius: 7 }} onClick={() => handlestaticBtn("Türkçeyi daha iyi anlamak için lütfen türkçe dilini seçin")}>Türkçeyi daha iyi anlamak için lütfen türkçe dilini seçin</button>
                            </div>
                            <div className='col-md-12' style={{ padding: 5, borderRadius: 20 }}>
                                <button style={{ borderRadius: 7 }} onClick={() => handlestaticBtn("For more understanding of English, please select English language")}>For more understanding of English, please select English language</button>
                            </div>
                            <div className='col-md-12' style={{ padding: 5, borderRadius: 20 }}>
                                <button style={{ borderRadius: 7 }} onClick={() => handlestaticBtn("Bir şeyler yazmayı deneyin, Bu butonlara da tıklayabilirsiniz")}>Bir şeyler yazmayı deneyin, bu butonlara da tıklayabilirsiniz</button>
                            </div>
                        </div>


                        <div style={{ paddingTop: 20 }}>
                            <label>
                                Metni Girin:
                                <textarea
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                    style={{ width: '100%', height: '150px', resize: 'none' }}
                                    placeholder="Metninizi buraya yazın"
                                />
                            </label>
                        </div>


                        <div style={{ backgroundColor: '', paddingBottom: 30, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{ paddingRight: 15 }}>Hız:</div>
                            <label>

                                <div>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="3"
                                        step="0.1"
                                        value={rate}
                                        onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                                        style={{ width: '100%' }}
                                    />

                                </div>

                            </label>
                            <div>{rate.toFixed(1)}</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: "center", alignItems: "center", width: '100%', paddingLeft: 10 }}>
                            <div style={{ marginRight: -20 }}> Dil:</div>
                            <div>
                                <label>
                                    <select
                                        value={selectedVoice ? selectedVoice.name : ''}
                                        onChange={(e) => {
                                            const selectedVoiceName = e.target.value;
                                            const newSelectedVoice = voices.find(voice => voice.name === selectedVoiceName);
                                            handleVoiceChange(newSelectedVoice);
                                        }}
                                        style={{ width: '85%' }}
                                    >
                                        {voices.map((voice) => (
                                            <option key={voice.name} value={voice.name}>
                                                {voice.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: "center", alignItems: "center", paddingTop: 50 }}>
                            <button
                                style={{ color: '', backgroundColor: 'greenyellow', borderRadius: 10 }}
                                onClick={handleButtonClick}>Konuşmaya Dönüştür</button>

                        </div>


                    </div>
                </div>
            </header>
        </div>


    );
}


export default TextToSpeechComponent;
