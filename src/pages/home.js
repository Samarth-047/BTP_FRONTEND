import * as React from 'react';
import axios from 'axios';
import { useState } from 'react';
import "./back.css";
import "./home.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
// import { useHistory } from "react-router-dom";

function FIleupload() {
    // const history = useHistory();
    const [selectedFile, setSelectedFile] = useState();
    const [isSelected, setIsFilePicked] = useState(false);
    const [choose_upload, setupload] = useState("0");
    const [chunk, setchunk] = useState("");   
    const [selectedChunks, setSelectedChunks] = useState([]);
    // const [showDialog, setShowDialog] = useState(false);
    var _validFileExtensions = [".pdf", ".txt"];


    const navigate = useNavigate();

    function createChunks(chunkSize,text) {
        const chunks = [];

        const words = text.split('\n');

        for (let i = 0; i < words.length; i ++) {
            chunks.push(words[i]);
        }
        
        return chunks;
    };

    function handleFileLoad(event) {
        const content = event.target.result;
        const contentString = String.fromCharCode.apply(null, new Uint8Array(content));
        
        const chunks = createChunks(70, contentString);
        // console.log(chunks);
        setchunk(chunks);
        console.log("Updated Chunks:", chunks);
        // console.log("Chunks are 2",chunks);

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // setShowDialog(true);
        console.log("Chunks are 1",chunk);
        navigate("/chunks", {state:{ chunks: chunk, submitFunction: SubmitFile }});
        setSelectedFile(null);
        setIsFilePicked(false);
        setupload("0");
        setSelectedChunks([]);
    };

    async function PushChunks(chunk,i,filename){
        axios.post('http://localhost:3001/user/addText', {
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

    async function submitRecordingData(){
        let k=0;
        for(let i=0;i<selectedChunks.length;i++){
            let v =selectedChunks[i];
            // remove .txt from filename
            let filename = selectedFile.name;
            filename = filename.replace('.txt', '');
            await PushChunks(v,i,filename);
        }
        return k;
    };

    async function AlertHandler(k,l){
        
        navigate("/main");
        
    }

    async function SubmitFile () {
        // loop throgh chunks and send to server
        let k = await submitRecordingData();
        await AlertHandler(k,chunk.length);
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
                // setShowDialog(true);
                const file= oInput.files[0];
                const reader = new FileReader();
                reader.onload = handleFileLoad;
                reader.readAsArrayBuffer(file);
            }
        }
        return true;
    };

    return (
        <div className='background'>
            {choose_upload === "0" &&
                <>
                    <div className='home_card1'>
                        <button className='button-style' onClick={() => setupload("1")}>Upload File</button>
                        <button className='button-style' onClick={() => navigate("/main")}>Recording Page<br /></button>
                    </div>
                </>
            }
            {choose_upload === "1" &&
                <div >
                    <div className='home_card' >
                        <br />
                        <input type="file"  name="file" onChange={ValidateSingleInput} />

                        {isSelected ? (
                            //display error msg if the file uploaded is not .txt/.pdf
                            // if (selectedFile.type)

                            <div>
                                <br />
                                <p> Filename: {selectedFile.name}</p>
                                <p> Filetype: {selectedFile.type}</p>
                                <p> Size in bytes: {selectedFile.size}</p>
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
                            <button className='button-style' onClick={handleSubmit}>Submit</button>
                        </div> 
                        <br />
                    </div>

                </div>
            }
        </div>
    )
};

export default FIleupload;


