import * as React from 'react';
import Sidebar from '../sideBar/sideBar.js'
import "../css/home.css"
import "../css/back.css"
import "../css/main.css"
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import axios from 'axios';




function Home() {
    const [selectedFile, setSelectedFile] = useState();
    const [isSelected, setIsFilePicked] = useState(false);
    const [choose_upload, setupload] = useState("0");
    const [chunk, setchunk] = useState("");
    var _validFileExtensions = [".pdf", ".txt"];

    const [text, setText] = useState();

    let fileReader;

    const onChange = e => {
        let file = e.target.files;
        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(file[0]);
        console.log(text);
    };

    const cleanContent = string => {
        string = string.replace(/^\s*[\r\n]/gm, "");
        let array = string.split(new RegExp(/[\r\n]/gm));
        console.log(array);
        array.splice(0, 3);
        array.splice(-3);
        return array.join("\n");
    };

    const handleFileRead = e => {
        let content = fileReader.result;
        // let text = deleteLines(content, 3);
        content = cleanContent(content);
        // … do something with the 'content' …
        setText(content);
    };


    const navigate = useNavigate();

    function createChunks(chunkSize, text) {
        const chunks = [];

        const words = text.split('\n');

        for (let i = 0; i < words.length; i++) {
            chunks.push(words[i]);
        }



        // for (let i = 0; i < text.length; i += chunkSize) {
        //     chunks.push(text.substring(i, i + chunkSize));
        // }
        return chunks;
    };

    function handleFileLoad(event) {
        const content = event.target.result;
        const contentString = String.fromCharCode.apply(null, new Uint8Array(content));

        const chunks = createChunks(70, contentString);
        console.log(chunks)
        setchunk(chunks);
    }

    async function PushChunks(chunk, i, filename) {
        axios.post('https://datacollection-qrgp.onrender.com/user/addText', {
            chunks: chunk,
            filename: filename,
            index: i
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    async function submitRecordingData() {
        let k = 0;
        for (let i = 0; i < chunk.length; i++) {
            let v = chunk[i];
            // remove .txt from filename
            let filename = selectedFile.name;
            filename = filename.replace('.txt', '');
            await PushChunks(v, i, filename);
        }
        return k;
    };

    async function AlertHandler(k, l) {
        navigate("/list");
    }

    async function SubmitFile() {
        // loop throgh chunks and send to server
        let k = await submitRecordingData();
        await AlertHandler(k, chunk.length);
    };
    const ValidateSingleInput = (oInput) => {
        oInput = oInput.target;
        if (oInput.type == "file") {
            var sFileName = oInput.value;
            if (sFileName.length > 0) {
                var blnValid = false;
                for (var j = 0; j < _validFileExtensions.length; j++) {
                    var sCurExtension = _validFileExtensions[j];
                    if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                        blnValid = true;
                        break;
                    }
                }
                if (!blnValid) {
                    alert("Sorry, " + sFileName + " is invalid, allowed extensions are: " + _validFileExtensions.join(", "));
                    oInput.value = "";
                    return false;
                }
                setSelectedFile(oInput.files[0]);
                setIsFilePicked(true);
                const file = oInput.files[0];
                const reader = new FileReader();
                reader.onload = handleFileLoad;
                reader.readAsArrayBuffer(file);
            }
        }
        return true;
    };
    return (
        <div style={{ display: 'flex', flexDirection: 'row', background: 'white' }}>
            <Sidebar />
            <div style={{ display: 'flex', flexDirection: 'column', background: ' rgb(239, 236, 236)', justifyContent: 'center', alignItems: 'center', width: '100%', }}>
                <div >
                    <div className='home_card'>
                        <br />

                        {/* <input type="file" name="file" onChange={changeHandler} /> */}
                        {/* <input type="file" name="file" onChange={ValidateSingleInput} /> */}
                        <input type="file" name="myfile" onChange={onChange} />

                        {isSelected ? (
                            //display error msg if the file uploaded is not .txt/.pdf
                            // if (selectedFile.type)

                            <div>
                                <br />
                                <p> Filename: {selectedFile.name}</p>
                                <p><t></t>Filetype: {selectedFile.type}</p>
                                <p><t></t>Size in bytes: {selectedFile.size}</p>
                                <p>
                                    last Modified Date:{' '}
                                    {selectedFile.lastModifiedDate.toLocaleDateString()}
                                </p>
                                <br />
                            </div>
                        ) : (
                            <p>Select a file to show details</p>
                        )}
                        <div>
                            <button className='button-style' onClick={SubmitFile}>Submit</button>
                        </div>
                        <br />
                    </div>

                </div>

            </div>

        </div>

    )
};

export default Home;