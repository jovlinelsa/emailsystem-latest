import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    navigate("/faceid", { state: { email, password } }); // Pass email/password to FaceId
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="login-container" role="main">
      <div className="logo">
        <h1>
          <span aria-label="InVision">InVision</span>
        </h1>
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email ID"
          className="input-field"
          value={email}
          autoComplete="on"
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email ID"
        />
        <input
          type="password"
          placeholder="Password"
          className="input-field"
          value={password}
          autoComplete="on"
          onChange={(e) => setPassword(e.target.value)}
          aria-label="Password"
        />
        <button type="submit" className="login-button" aria-label="Login">
          LOGIN
        </button>
      </form>
      {error && (
        <p className="error-text" aria-live="polite">
          {error}
        </p>
      )}
      <p className="register-text">
        Don't have an account?{" "}
        <a href="/register" aria-label="Register Now">
          REGISTER NOW
        </a>
      </p>
    </div>
  );
};

export default LoginPage;