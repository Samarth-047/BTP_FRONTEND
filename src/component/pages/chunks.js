import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import axios from 'axios';


function ChunksPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const chunks = location.state?.chunks || [];
  const fileName = location.state?.fileName || null;
  const [selectedChunks, setSelectedChunks] = useState([]);

  console.log( location );

  async function PushChunks(chunk, i, filename) {
    await axios.post('https://datacollection-qrgp.onrender.com/user/addText', {
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
    for (let i = 0; i < selectedChunks.length; i++) {
        let v = selectedChunks[i];
        // remove .txt from filename
        let filename = fileName;
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
    await AlertHandler(k, selectedChunks.length);
};

  const handleCheckboxChange = (event, index) => {
    if (event.target.checked) {
      setSelectedChunks([...selectedChunks, chunks[index]]);
    } else {
      setSelectedChunks(selectedChunks.filter((_, i) => i !== index));
    }
  };

  const handleSelectAll = () => {
    if (selectedChunks.length === chunks.length) {
      setSelectedChunks([]);
    } else {
      setSelectedChunks([...chunks]);
    }
  };

  const handleConfirm = () => {
    SubmitFile();
    // navigate("/");
  };

  const handleCancel = () => {
    setSelectedChunks([]);
    navigate("/");
  };

  return (
        <div>
        <h1>Choose Chunks</h1>
        <label>
        <input type="checkbox" checked={selectedChunks.length === chunks.length} onChange={handleSelectAll} />
        Select All Chunks
      </label>
        <ul>
        {chunks.map((chunk, index) => (
            <li key={index}>
            <label>
                <input
                type="checkbox"
                checked={selectedChunks.includes(chunk)}
                onChange={(event) => handleCheckboxChange(event, index)}
                />
                {chunk}
            </label>
            </li>
        ))}
        </ul>
        <button onClick={handleConfirm}>Confirm</button>
        <button onClick={handleCancel}>Cancel</button>
        </div>
                           
  );
}

export default ChunksPage;
