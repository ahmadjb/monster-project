    import React, { useEffect, useState } from 'react';
    import ReactAudioPlayer from 'react-audio-player';
    import { Spin } from 'antd';
    import { LoadingOutlined } from '@ant-design/icons';
    import axios from 'axios';

    import './App.css';
    import S3FileUpload from 'react-s3';
    import AWS from 'aws-sdk';
    import { PutObjectCommand, S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
    import { getSignedUrl } from "@aws-sdk/s3-request-presigner";




    function TextToSpeechComponent() {
        const [processId, setProcessId] = useState('');
        const [statusUrl, setStatusUrl] = useState('');
        const [status, setStatus] = useState('');
        const [resultUrls, setResultUrls] = useState([]);
        const [monsterapi, setMonsterapi] = useState([]);
        const [voiceUrl, setVoiceUrl] = useState(""); //https://processed-model-result.s3.us-east-2.amazonaws.com/7395e0ac-03de-450a-91e6-daad5bb235ed_0.wav
        const [spinner, setSpinner] = useState(false);
        const [oudio, setOudio] = useState(false);


        const [selectedFile, setSelectedFile] = useState(null);

        const [fileName, setFileName] = useState(null);
        const [fileType, setFileType] = useState(null);
        const [image, setImage] = useState(null);
        const [mp3, setMp3] = useState(null);
        const [imageUrl, setImageURL] = useState(null);





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
            setImageURL(fileUrl);
            console.log(fileUrl);

        };


        const [audioData, setAudioData] = useState(null);


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

            const command = new PutObjectCommand({
                Bucket: "monsterapifile",
                Key: audioFileName, // Specify the key (path) where you want to upload the audio
                Body: audioData, // Provide the audio data fetched from the URL
                ContentType: 'audio/wav' // Set the content type accordingly
            });

            try {
                const response = await client.send(command);
                console.log("Audio uploaded successfully:", response);
                const presignedUrl = await getPresignedUrl(audioFileName);
                console.log("Presigned URL:",presignedUrl);
              //  retrieveFileUrl(audioFileName);
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
                const url = await getSignedUrl(client, command, { expiresIn: 30 }); // Expiry time in seconds
               // console.log("Presigned URL:", url);
                return url;
            } catch (err) {
                console.error("Error generating presigned URL:", err);
                return null;
            }
        };


        return (

            <div className="App">
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


                    </div>
                </header>
            </div>


        );
    }


    export default TextToSpeechComponent;
