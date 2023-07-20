import React from "react";
// import { useLocation, useHistory } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

function ChunksPage() {
  const location = useLocation();
//   const history = useHistory();
  const navigate = useNavigate();
  console.log('location : ', location);
//   const chunks = location.state?.chunks || [];
  const submitFunction = location.state?.submitFunction;
  const [selectedChunks, setSelectedChunks] = useState([]);

//   console.log("Chunks are", location.state);
const chunks = [
    "The quick brown fox jumps over the lazy dog.",
    "A journey of a thousand miles begins with a single step.",
    "In the middle of difficulty lies opportunity.",
    "Where there is love there is life.",
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "Believe you can and you're halfway there.",
    "The best way to predict the future is to create it.",
    "Dream big and dare to fail.",
    "The only way to do great work is to love what you do.",
    "Happiness is not something ready-made. It comes from your own actions.",
    "The harder I work, the luckier I get.",
    "Do what you can, with what you have, where you are.",
];  
  
  const handleCheckboxChange = (event, index) => {
    if (event.target.checked) {
      setSelectedChunks([...selectedChunks, chunks[index]]);
    } else {
      setSelectedChunks(selectedChunks.filter((_, i) => i !== index));
    }
  };

  const handleConfirm = () => {
    // Call the function in this main file
    if (submitFunction) {
        submitFunction(selectedChunks);
    }

    // Go back to the previous page
    // history.goBack();
    navigate("/");
  };

  const handleCancel = () => {
    // Clear the selected chunks
    setSelectedChunks([]);

    // Go back to the previous page
    // history.goBack();
    navigate("/");
  };

  return (
   
        <div>
        <h1>Choose Chunks</h1>
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
