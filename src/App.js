import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import './App.css';
import Home from "./component/pages/home.js";
import List from "./component/pages/list.js";
import Chunks from "./component/pages/chunks.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/list" element={<List />} />
          <Route path="/chunks" element={<Chunks />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
