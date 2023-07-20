import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./App.css";

import Home from "./pages/home";
import Main from "./pages/main";
import ChunksPage from "./pages/chunks";

const Layout = () => {
  return (
    <div>
      {/* <Navbar /> */}
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/main" element={<Main />} />
          <Route path="/chunks" element={<ChunksPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
