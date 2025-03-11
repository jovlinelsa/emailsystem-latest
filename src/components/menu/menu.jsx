import { useEffect } from 'react';
import { Inbox, Send, AlertOctagon, Trash, Mail, Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./menu.css";

export default function MenuPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove token as an example
    navigate("/"); // Redirect to login page
  };

  useEffect(() => {
    // Check for browser support and speak the available options once the page loads
    if ('speechSynthesis' in window) {
      const message = "Welcome to InVision Mail. Your available options are Inbox, Compose, Spam, and Trash. Please choose one.";
      const utterance = new SpeechSynthesisUtterance(message);
      // Optional: adjust utterance properties like rate, pitch, and language
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Speech synthesis is not supported on this browser.");
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="menu-container">
      <header className="app-header">
        <div className="header-content">
          <div className="brand-wrapper">
            <Mail className="brand-icon" />
            <span className="brand-name">InVision</span>
          </div>
          <div className="header-controls">
            <Bell className="notifications-icon" />
            <button 
              onClick={handleLogout}
              className="logout-button"
              aria-label="Log out of account"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="content-wrapper">
          <h1 className="main-title">Welcome to InVision Mail</h1>
          <p className="menu-subtitle">What would you like to do?</p>

          <div className="menu-grid">
            <Link to="/inbox" className="menu-card-link">
              <div className="menu-card">
                <div className="card-header">
                  <div className="icon-wrapper">
                    <Inbox className="menu-icon" />
                  </div>
                  <h2 className="card-title">Inbox</h2>
                </div>
                <p className="card-description">View and manage your incoming messages</p>
              </div>
            </Link>

            <Link to="/compose" className="menu-card-link">
              <div className="menu-card">
                <div className="card-header">
                  <div className="icon-wrapper">
                    <Send className="menu-icon" />
                  </div>
                  <h2 className="card-title">Compose</h2>
                </div>
                <p className="card-description">Create and send new messages</p>
              </div>
            </Link>

            <Link to="/spam" className="menu-card-link">
              <div className="menu-card">
                <div className="card-header">
                  <div className="icon-wrapper">
                    <AlertOctagon className="menu-icon" />
                  </div>
                  <h2 className="card-title">Spam</h2>
                </div>
                <p className="card-description">Review filtered spam messages</p>
              </div>
            </Link>

            <Link to="/trash" className="menu-card-link">
              <div className="menu-card">
                <div className="card-header">
                  <div className="icon-wrapper">
                    <Trash className="menu-icon" />
                  </div>
                  <h2 className="card-title">Trash</h2>
                </div>
                <p className="card-description">Manage deleted messages</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
