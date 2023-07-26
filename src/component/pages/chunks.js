import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

function ChunksPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const chunks = location.state?.chunks || [];
  const [selectedChunks, setSelectedChunks] = useState([]);

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
    navigate("/");
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
