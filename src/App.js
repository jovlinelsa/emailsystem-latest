import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Import components
import Login from "./components/login/login";    // LoginPage
import Faceid from "./components/faceid/faceid"; // FaceId
import Register from "./components/register/register";               // Registration page
import Menu from "./components/menu/menu";       // Menu page
import Inbox from "./components/inbox/inbox";    // Inbox page
import Spam from "./components/spam/spam";       // Spam page
import Trash from "./components/trash/trash";
import Compose from "./compose";                 // Compose page
import Sent from "./components/sent/sent";
import SpeechAssistant from "./components/speech/speechassist"; // Speech assistant

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Login />} /> */}
        <Route path="/faceid" element={<Faceid />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/compose" element={<Compose />} />
        <Route path="/trash" element={<Trash />} />
        <Route path="/spam" element={<Spam />} />
        <Route path="/sent" element={<Sent />} />
        {/* Optional: Add SpeechAssistant as a route or integrate it differently */}
        {/* <Route path="/speech" element={<SpeechAssistant />} /> */}
      </Routes>
    </Router>
  );
}

export default App;