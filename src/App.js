import React from "react";
import Login from "./components/login/login";
import Menu from "./components/menu/menu";
import Inbox from "./components/inbox/inbox";
import Spam from "./components/spam/spam";
import Compose from "./compose";
import SpeechAssistant from "./components/speech/speechassist";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/compose" element={<Compose />} />
        <Route path="/spam" element={<Spam />} />
      </Routes>
    </Router>
  );
}

export default App;
