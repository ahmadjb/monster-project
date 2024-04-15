import React, { useEffect, useState } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import '../App.css';
import S3FileUpload from 'react-s3';
import AWS from 'aws-sdk';
import { PutObjectCommand, S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const mongoose = require('mongoose');



function TextToSpeechComponent() {



    const [processId, setProcessId] = useState('');
    const [statusUrl, setStatusUrl] = useState('');
    const [status, setStatus] = useState('');
    const [resultUrls, setResultUrls] = useState([]);
    const [monsterapi, setMonsterapi] = useState([]);
    const [voiceUrl, setVoiceUrl] = useState(""); //https://processed-model-result.s3.us-east-2.amazonaws.com/7395e0ac-03de-450a-91e6-daad5bb235ed_0.wav
    const [spinner, setSpinner] = useState(false);
    const [oudio, setOudio] = useState(false);
    const [audioData, setAudioData] = useState(null);

    const [allVoices, setAllVoices] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showList, setShowList] = useState(false);
    const [readyPresignedURL, setReadyPresignedURL] = useState("");




    const [selectedFile, setSelectedFile] = useState(null);

    const [fileName, setFileName] = useState(null);
    const [fileType, setFileType] = useState(null);
    const [image, setImage] = useState(null);
    const [filteredPosts, setFilteredPosts] = useState("");
    const [objectUrl, setobjectURL] = useState(null);





    let intervalId; // Declaring intervalId outside the useEffect hook


    useEffect(() => {
        if (statusUrl) {
            intervalId = setInterval(checkStatus, 5000); // Check status every 5 seconds
            return () => clearInterval(intervalId); // Cleanup on component unmount or when status is "COMPLETED"
        }
    }, [statusUrl]);

    const fetchData = () => {
        setSpinner(true);

        const form = new FormData();
        form.append('voice_clone', 'false');
        form.append('prompt', monsterapi);

        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IjZjYzkxNWQwODYxNmMwYTg1OGU2Y2Q5YTQ3NjJjNjBiIiwiY3JlYXRlZF9hdCI6IjIwMjQtMDItMDdUMTg6MDM6NTYuMTIzMjI0In0.HdEuxhoVbK40qvpRoGicCs0VX42qr4iKdpjKzPPGBMQ'
            },
            body: form
        };

        fetch('https://api.monsterapi.ai/v1/generate/sunoai-bark', options)
            .then(response => response.json())
            .then(response => {
                setProcessId(response.process_id);
                setStatusUrl(response.status_url);
            })
            .catch(err => console.error(err));
    };

    const checkStatus = () => {
        fetch(statusUrl, {
            headers: {
                'authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IjZjYzkxNWQwODYxNmMwYTg1OGU2Y2Q5YTQ3NjJjNjBiIiwiY3JlYXRlZF9hdCI6IjIwMjQtMDItMDdUMTg6MDM6NTYuMTIzMjI0In0.HdEuxhoVbK40qvpRoGicCs0VX42qr4iKdpjKzPPGBMQ',
                'accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then(response => {
                setStatus(response.status);
                console.log(response);
                if (response.status === 'COMPLETED') {
                    // Process completed successfully
                    console.log('Process completed successfully');
                    clearInterval(intervalId); // Stop checking the status
                    setSpinner(false);
                    setOudio(true);
                    fetchResultUrls(response.result.output);
                    setVoiceUrl(response.result.output);
                    // uploadMp3ToS3(response.result.output[0]);
                    //  console.log("response", response);
                    //  console.log("result", response.result);
                    //  console.log(response.result.output[0]);
                    fetchAudioData(response.result.output[0]);

                } else if (response.status === 'FAILED') {
                    // Process failed
                    console.log('Process failed');
                } else {
                    // Process still in progress or queued
                    console.log('Process still in progress or queued');
                }
            })
            .catch(err => console.error(err));
    };

    const fetchResultUrls = (outputUrls) => {
        setResultUrls(outputUrls);
    };



    const retrieveFileUrl = (key) => {
        const fileUrl = `https://monsterapifile.s3.amazonaws.com/${key}`;
        setobjectURL(fileUrl);
        postObjectToDB(fileUrl);
        console.log(fileUrl);

    };




    const fetchAudioData = async (voiceUrl) => {  // fetching the MP3 file into a buffer to upload it later to the S3
        try {
            const response = await axios.get(voiceUrl, {
                responseType: 'arraybuffer' // Important for fetching binary data like audio
            });
            // Once data is fetched, you can use it accordingly
            setAudioData(response.data);
            // console.log(response);
            // console.log("response");
        } catch (error) {
            console.error('Error fetching audio data:', error);
        }
    };



    useEffect(() => {
        if (audioData) {
            uploadAudioToS3();
        }
    }, [audioData]);


    const uploadAudioToS3 = async () => {
        if (!audioData) {
            console.error("No audio data fetched.");
            return;
        }

        const client = new S3Client({
            // Configure with your AWS credentials and region
            region: "us-east-1",
            credentials: {
                accessKeyId: 'AKIAU6KJJN4CLSVULJ6Y',
                secretAccessKey: 'JFlyKV/zmms3ALXWCowwATv9o93Vi4tcSRT+ge9D'
            }
        });
        const urlString = String(voiceUrl);
        const parts = urlString.split("/");
        const audioFileName = parts[parts.length - 1]; // Specify the desired file name for the audio file in S3
        //console.log("audioFileName :", audioFileName);

        const command = new PutObjectCommand({
            Bucket: "monsterapifile",
            Key: audioFileName, // Specify the key (path) where you want to upload the audio
            Body: audioData, // Provide the audio data fetched from the URL
            ContentType: 'audio/wav' // Set the content type accordingly
        });

        try {
            const response = await client.send(command);
            console.log("Audio uploaded successfully:", response);
            // const presignedUrl = await getPresignedUrl(audioFileName);
            // console.log("Presigned URL:", presignedUrl);

            retrieveFileUrl(audioFileName);
        } catch (err) {
            console.error("Error uploading audio:", err);
            // Handle error as needed
        }
    };




    const getPresignedUrl = async (key) => {
        const client = new S3Client({
            // Configure with your AWS credentials and region
            region: "us-east-1",
            credentials: {
                accessKeyId: 'AKIAU6KJJN4CLSVULJ6Y',
                secretAccessKey: 'JFlyKV/zmms3ALXWCowwATv9o93Vi4tcSRT+ge9D'
            }
        });

        const command = new GetObjectCommand({
            Bucket: "monsterapifile",
            Key: key
        });

        try {
            const url = await getSignedUrl(client, command, { expiresIn: 20 }); // Expiry time in seconds
            // console.log("Presigned URL:", url);
            return url;
        } catch (err) {
            console.error("Error generating presigned URL:", err);
            return null;
        }
    };


    const getFromdbThenGeneratePresignedURL = async (filteredPosts) => {


        const urlString = String(filteredPosts);
        const parts = urlString.split("/");
        const audioFileName = parts[parts.length - 1];

        fetch('http://localhost:5000/v1/post/presigned-url?key=' + audioFileName)   // generate the Presigned Url as a server side   // example of the "audioFileName" == 559c8b23-d793-4a1b-a963-ebaeb58b3190_0.wav
            .then(response => {
                if (response.ok) {
                    //  console.log("response");
                    console.log(response);
                    return response.text();
                } else {
                    throw new Error('Failed to generate presigned URL');
                }
            })
            .then(url => {
                console.log('Presigned URL:', url);
                setReadyPresignedURL(url);
                // Use the generated presigned URL to access the object in S3
            })
            .catch(error => {
                console.error('Error:', error);
            });

        {/* const presignedUrl = await getPresignedUrl(audioFileName);    // generate the Presigned Url as a clinet side
        console.log("Presigned URL newwwwwww:", presignedUrl);
       setReadyPresignedURL(presignedUrl);*/}
    }


    /////////////////////////////////////
    const postObjectToDB = async (objectUrl) => {

        if (objectUrl) {

            //console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
            // console.log(objectUrl);
            const postData = {
                url: objectUrl
            };

            axios.post('http://localhost:5000/v1/post', postData)
                .then(response => {
                    console.log('Post created successfully to mongoDB:', response.data);
                })
                .catch(error => {
                    console.error('Error creating post:', error);
                });
        }
    }

    //console.log("sssssssssssssss", allVoices[0]?.url);

    useEffect(() => {

        getObjectFromDB();

    }, []);


    const getObjectFromDB = async () => {

        axios.get('http://localhost:5000/v1/post')
            .then(response => {
                console.log('Posts retrieved successfully:', response.data);
                setAllVoices(response.data);

                // Filter the array to get objects with a specific URL
                const specificUrl = selectedItem;
                const filteredPosts = response.data.filter(post => post.url === specificUrl);


                // Log the filtered posts
                console.log('Filtered Posts:', filteredPosts[0].url);
                setFilteredPosts(filteredPosts[0].url);

                getFromdbThenGeneratePresignedURL(filteredPosts[0]?.url);

                // You can perform any further actions with the filtered posts here
            })
            .catch(error => {
                // console.error('Error retrieving posts:', error);
            });

    };




    const handleClick = (item) => {
        setSelectedItem(item);
        getFromdbThenGeneratePresignedURL(item);
    };
    const handleButtonClick = () => {
        window.location.href = readyPresignedURL;
    };


    const navigate = useNavigate();

    const handleSignInClick = () => {
        navigate('/signin');
    };


    return (

        <div className="App">

            <div style={{ display: 'flex', justifyContent: 'flex-end', backgroundColor: '' }}>

                <div style={{ padding: 20 }}>
                    <button style={{ backgroundColor: 'greenyellow' }} onClick={handleSignInClick}>Sign In</button>
                </div>
            </div>
            <header className="App-header">
                <div style={{ paddingTop: 30 }}>

                    <div style={{ fontSize: 30 }}>
                        Bu kısım, metnin bir sesini MONSTER API tarafından oluşturmak içindir.
                    </div>

                    <div style={{ paddingTop: 20 }}>
                        <label>
                            Metni Girin:
                            <textarea
                                value={monsterapi}
                                onChange={(e) => setMonsterapi(e.target.value)}
                                style={{ width: '100%', height: '150px', resize: 'none' }}
                                placeholder="Lütfen MONSTER API'si ile sese dönüştürmek için bir metin girin"
                            />
                        </label>
                        <div style={{ display: 'flex', justifyContent: "center", alignItems: "center", paddingTop: 50 }}>
                            <button
                                style={{ color: '', backgroundColor: 'greenyellow', borderRadius: 10 }}
                                onClick={fetchData}>Sesi oluştur</button>
                        </div>

                        {spinner ? (
                            <Spin style={{ fontSize: 40 }} indicator={<LoadingOutlined />} />
                        ) : (
                            ""
                        )}

                    </div>

                    <div>
                        {audioData && (
                            <audio controls>
                                <source src={URL.createObjectURL(new Blob([audioData]))} type="audio/wav" />
                                Your browser does not support the audio element.
                            </audio>
                        )}
                    </div>

                    <div>
                        <button onClick={() => setShowList(!showList)}>Voices List</button>
                        {showList && (
                            <div style={{ width: '100%', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
                                {allVoices?.map((item, index) => (
                                    <div key={index} style={{ margin: '5px', cursor: 'pointer' }} onClick={() => handleClick(allVoices[index]?.url)}>
                                        <div style={{ fontSize: 12, color: 'black' }}>
                                            {index + 1}{"-"}{allVoices[index]?.url}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <p>Selected object: {readyPresignedURL}</p>
                    </div>

                    <div>
                        <button onClick={handleButtonClick}>Go to URL</button>
                    </div>



                </div>
            </header>
        </div>


    );
}


export default TextToSpeechComponent;
