import * as React from 'react';
import Sidebar from '../sideBar/sideBar.js'
import "../css/home.css"
import "../css/back.css"
import "../css/main.css"
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { FFmpeg } from 'react-ffmpeg';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { useAudioRecorder, AudioRecorder } from 'react-audio-voice-recorder';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';


function convertMP3ToWAV(mp3URL) {
    return new Promise((resolve, reject) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const xhr = new XMLHttpRequest();
        xhr.open('GET', mp3URL, true);
        xhr.responseType = 'arraybuffer';
        // console.log("Sampling frequency is ", audioContext.sampleRate);
        xhr.onload = () => {
            audioContext.decodeAudioData(xhr.response, (buffer) => {
                const wavBuffer = audioContext.createBuffer(
                    1, buffer.length, audioContext.sampleRate
                );
                wavBuffer.copyToChannel(buffer.getChannelData(0), 0);
                const wavData = wavBuffer.getChannelData(0);
                const wavBlob = new Blob([wavData], { type: 'audio/wav' });
                const wavURL = URL.createObjectURL(wavBlob);
                resolve(wavURL);
            });
        };
        xhr.onerror = (e) => reject(e);
        xhr.send();
    });
}

// function convertMP3ToWAV(mp3URL, targetSampleRate) {
//     return new Promise((resolve, reject) => {
//         const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//         const xhr = new XMLHttpRequest();
//         xhr.open('GET', mp3URL, true);
//         xhr.responseType = 'arraybuffer';
//         xhr.onload = () => {
//             audioContext.decodeAudioData(xhr.response, (buffer) => {
//                 // Convert the audio data to PCM format
//                 const pcmData = buffer.getChannelData(0);
                
//                 // Create a new buffer with the PCM data
//                 const pcmBuffer = audioContext.createBuffer(
//                     1, pcmData.length, targetSampleRate
//                 );
//                 pcmBuffer.copyToChannel(pcmData, 0);
                
//                 // Create a WAV buffer from the PCM buffer
//                 const wavBuffer = audioContext.createBuffer(
//                     1, pcmBuffer.length, targetSampleRate
//                 );
//                 wavBuffer.copyToChannel(pcmBuffer.getChannelData(0), 0);
                
//                 // Create a Blob and URL for the WAV data
//                 const wavData = wavBuffer.getChannelData(0);
//                 const wavBlob = new Blob([new DataView(wavData.buffer)], {
//                     type: 'audio/wav',
//                 });
//                 const wavURL = URL.createObjectURL(wavBlob);
                
//                 resolve(wavURL);
//             });
//         };
//         xhr.onerror = (e) => reject(e);
//         xhr.send();
//     });
// }

function Home() {
    const [Audio, setAudio] = useState(null);
    const [text_to_be_read, settext_to_be_read] = useState("");
    const recorderControls = useAudioRecorder()
    const [recording, setRecording] = useState(false)
    const [visible, setVisible] = useState(false);
    const [type, settype] = useState("0");
    const [age, setAge] = React.useState(localStorage.getItem("age") || '');
    const [nativeLanguage, setNativeLanguage] = React.useState(localStorage.getItem("nativeLanguage") || '');
    const [gender, setGender] = React.useState(localStorage.getItem("gender") || '');
    const [phoneNumber, setPhoneNumber] = React.useState(localStorage.getItem("phoneNumber") || '');
    const {
        startRecording,
        stopRecording,
        togglePauseResume,
        recordingBlob,
        isRecording,
        isPaused,
        recordingTime,
    } = useAudioRecorder();
    const addAudioElement = (blob) => {
        const url = URL.createObjectURL(blob);
        const audio = document.createElement("audio");
        audio.src = url;
        audio.controls = true;
        setAudio(audio.src);
    };

    React.useEffect(() => {
        axios.get('http://localhost:3001/user/getText')
            .then(function (response) {
                settext_to_be_read(response.data);
                console.log(text_to_be_read);
            }
            )
            .catch(function (error) {
                console.log(error);
            }
            );
    }, []);

    const refreshPage = () => {
        window.location.reload("/main");
    }

    const ButtonHide = () => {
        if (type === "0") {
            settype("1");
        }
        else if (type === "1") {
            settype("0");
        }
    }



    async function handleConvertToWAV() {
        const url = await convertMP3ToWAV(Audio, 16000);
        setAudio(url);
    }

    const submitRecording = () => {
        setVisible(false);
        console.log("Submitted");
        handleConvertToWAV();

        axios.post('http://localhost:3001/user/add', {
            file: Audio,
            text: text_to_be_read.text,
            index: text_to_be_read.index,
            filename: text_to_be_read.filename,
            age: age,
            nativeLanguage: nativeLanguage,
            gender:gender,
            phoneNumber:phoneNumber
        })
        
            .then(function (response) {
                alert("Audio Uploaded successfully");
                window.location.reload("/main");
            })
            .catch(function (error) {
                alert("error occured")
                console.log(error);
            }
            );
        const textUrl = URL.createObjectURL(new Blob([text_to_be_read.text], { type: "text/plain" }));
        const textLink = document.createElement("a");
        textLink.href = textUrl;
        textLink.download = `${text_to_be_read.id}.txt`;
        document.body.appendChild(textLink);
        textLink.click();
        document.body.removeChild(textLink);

        const link = document.createElement("a");
        link.href = Audio;
        link.download = `${text_to_be_read.id}.wav`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    // create async submitRecording function

    const setUserData = () => {
        // set age in local storage
        localStorage.setItem("age", age);
        localStorage.setItem("nativeLanguage", nativeLanguage);
        localStorage.setItem("gender",gender);
        localStorage.setItem("phoneNumber",phoneNumber);
    };
    
    const cleanData = () => {
        localStorage.clear();
        setAge("");
        setNativeLanguage("");
        setGender("");
        setPhoneNumber("");
    };

    const footerContent = (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div styles={{ marginLeft: "100vw" }}>
                <Button label="No" icon="pi pi-times" onClick={() => setVisible(false)} autoFocus />
                <Button label="Yes" icon="pi pi-check" onClick={submitRecording} autoFocus />
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirgitection: 'row', background: 'white' }}>
            <Sidebar />
            <div style={{ display: 'flex', flexDirection: 'column', background: ' rgb(239, 236, 236)', justifyContent: 'center', alignItems: 'center', width: '100%', }}>
                <div className='main_card' >
                    <div style={{ flex: "50%", display: "flex", flexDirection: "column", alignContent: "center", justifyContent: "center", paddingLeft: "1vw", paddingRight: "3vw" }}>
                        <br/>
                        <TextField
                            required
                            id="outlined-required"
                            label="Phone Number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <br/>
                        <TextField
                            required
                            id="outlined-required"
                            label="Age"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                        />
                        <br/>
                        <TextField
                            required
                            id="outlined-required"
                            label="Gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        />
                        <br/>
                        <TextField
                            required
                            id="outlined-required"
                            label="Mother Tongue"
                            value={nativeLanguage}
                            onChange={(e) => setNativeLanguage(e.target.value)}
                        />
                        <br/>
                        <Button label="Clear Form" icon="pi pi-external-link" onClick={cleanData} />
                        <br/>
                        <Button label="Set User" icon="pi pi-external-link" onClick={setUserData} />
                        <br/>
                    </div>
                    <div style={{ flex: "50%" }}>
                        <div className='text_box'>{text_to_be_read.text}</div>
                        <br />
                        <div className='button-style' style={{ display: "flex", flesDirection: "column", justifyContent: "center", alignContent: "center" }} onClick={ButtonHide}><AudioRecorder
                            onRecordingComplete={(blob) => addAudioElement(blob)}
                            recorderControls={recorderControls}
                        />{type === "0" && <div style={{ marginTop: "auto", marginBottom: "auto", marginLeft: ".7vw" }} onClick={ButtonHide}>Start Recording</div>}</div>
                        {type === "1" && <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignContent: "center", marginLeft: "10vw", marginRight: "10vw" }}>
                            <button className='button-style' onClick={recorderControls.stopRecording}>Stop recording</button>
                            <button className='button-style' onClick={refreshPage}>Restart recording</button>
                        </div>}
                        <div className="card flex justify-content-center">
                            <Button label="Submit" icon="pi pi-external-link" onClick={() => setVisible(true)} />
                            <Dialog header="Confirm" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)} footer={footerContent}>
                                <audio controls src={Audio}></audio>
                                <p className="m-0">
                                    <b>Are you sure that you want to submit this recording?</b>
                                </p>
                            </Dialog>
                        </div>
                    </div>
                </div>

            </div>

        </div>

    )
};

export default Home;