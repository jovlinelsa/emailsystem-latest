import React from "react";
import { Mail, Bell, LogOut } from "lucide-react";
import "./navbar.css";

export default function Navbar({ handleLogout }) {
  return (
    <header className="app-navbar">
      <div className="navbar-content">
        <div className="brand-wrapper">
          <Mail className="brand-icon" />
          <span className="brand-name">InVision</span>
        </div>
        <div className="navbar-controls">
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
  );
}