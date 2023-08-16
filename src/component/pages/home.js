import * as React from 'react';
import Sidebar from '../sideBar/sideBar.js'
import "../css/home.css"
import "../css/back.css"
import "../css/main.css"
import { useNavigate } from "react-router-dom";
import { useState } from 'react';



function Home() {
    const [selectedFile, setSelectedFile] = useState();
    const [isSelected, setIsFilePicked] = useState(false);
    const [chunk, setchunk] = useState("");
    const [selectedChunks, setSelectedChunks] = useState([]);
    var _validFileExtensions = [".pdf", ".txt"];

    let fileReader;
    const navigate = useNavigate();

    const onChange = e => {
        let file = e.target.files;
        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(file[0]);
    };

    const createChunks = string => {
        string = string.replace(/^\s*[\r\n]/gm, "");
        // if last line is empty, remove it
        if (string[string.length - 1] === "\n") {
            string = string.slice(0, -1);
        }
        
        let array = string.split(new RegExp(/[\r\n]/gm));
        // console.log(array);
        return array;
    };

    const handleFileRead = e => {
        let content = fileReader.result;
        content = createChunks(content);
        console.log(content);
        // … do something with the 'content' …
        setchunk(content);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log("Chunks are 1",chunk);
        navigate("/chunks", {state:{ chunks: chunk , fileName: selectedFile.name }});
        setSelectedFile(null);
        setIsFilePicked(false);
        setSelectedChunks([]);
    };

    const ValidateSingleInput = (oInput) => {
        let Input_file = oInput;
        oInput = oInput.target;
        if (oInput.type === "file") {
            var sFileName = oInput.value;
            if (sFileName.length > 0) {
                var blnValid = false;
                for (var j = 0; j < _validFileExtensions.length; j++) {
                    var sCurExtension = _validFileExtensions[j];
                    if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() === sCurExtension.toLowerCase()) {
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
                onChange(Input_file);
            }
        }
        return true;
    };
    return (
        <div style={{display:'flex',flexDirection:'row',background:'white'}}>
            <Sidebar />
            <div style={{display:'flex',flexDirection:'column',background:' rgb(239, 236, 236)',justifyContent:'center',alignItems:'center',width:'100%', }}>
                <div >
                    <div className='home_card'>
                        <br />

                        {/* <input type="file" name="file" onChange={changeHandler} /> */}
                        <input type="file" name="file" onChange={ValidateSingleInput} />

                        {isSelected ? (
                            //display error msg if the file uploaded is not .txt/.pdf
                            // if (selectedFile.type)

                            <div>
                                <br />
                                <p> Filename: {selectedFile.name}</p>
                                <p>Filetype: {selectedFile.type}</p>
                                <p>Size in bytes: {selectedFile.size}</p>
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

            </div>

        </div>

    )
};

export default Home;