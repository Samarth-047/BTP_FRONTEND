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



function convertMP3ToWAV(mp3URL) {
    return new Promise((resolve, reject) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const xhr = new XMLHttpRequest();
        xhr.open('GET', mp3URL, true);
        xhr.responseType = 'arraybuffer';
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

function Home() {
    const [Audio, setAudio] = useState(null);
    const [text_to_be_read, settext_to_be_read] = useState("");
    const recorderControls = useAudioRecorder()
    const [recording, setRecording] = useState(false)
    const [visible, setVisible] = useState(false);
    const [type, settype] = useState("0");
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
        fetch("https://datacollection-qrgp.onrender.com/user/getText")
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                settext_to_be_read(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const refreshPage = () => {
        window.location.reload("/main");
    }

    const ButtonHide = () => {
        if (type === "0") {
            settype("1");
        }
        else if(type === "1") {
            settype("0");
        }
    }



    async function handleConvertToWAV() {
        const url = await convertMP3ToWAV(Audio);
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
    }
    // create async submitRecording function
    const downloadAudio = () => {
        const textUrl = URL.createObjectURL(new Blob([text_to_be_read.text], { type: "text/plain" }));
        const textLink = document.createElement("a");
        textLink.href = textUrl;
        textLink.download = `${text_to_be_read.filename}.txt`;
        document.body.appendChild(textLink);
        textLink.click();
        document.body.removeChild(textLink);

        const link = document.createElement("a");
        link.href = Audio;
        link.download = `${text_to_be_read.filename}.wav`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };


    const footerContent = (
        <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
            <button onClick={downloadAudio} disabled={Audio === null}> Download Recorded Audio </button>
            <br/>
            <div styles={{marginLeft:"100vw"}}>
                <Button label="No" icon="pi pi-times" onClick={() => setVisible(false)} autoFocus />
                <Button label="Yes" icon="pi pi-check" onClick={submitRecording} autoFocus />
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirgitection: 'row', background: 'white' }}>
            <Sidebar />
            <div style={{ display: 'flex', flexDirection: 'column', background: ' rgb(239, 236, 236)', justifyContent: 'center', alignItems: 'center', width: '100%', }}>
                {recording === false &&
                    <div className='main_card'>
                        <div className='text_box'>{text_to_be_read.text}</div>
                        <br />
                        <div className='button-style' style={{ display: "flex", flesDirection: "column", justifyContent: "center", alignContent: "center" }} onClick={ButtonHide}><AudioRecorder
                            onRecordingComplete={(blob) => addAudioElement(blob)}
                            recorderControls={recorderControls}
                        />{type === "0" && <div style={{ marginTop: "auto", marginBottom: "auto", marginLeft: ".7vw" }} onClick={ButtonHide}>Start Recording</div>}</div>
                        {type === "1" && <div>
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
                }
            </div>

        </div>

    )
};

export default Home;