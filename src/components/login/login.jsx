import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate for routing

  const hardcodedEmail = "draaft001@gmail.com";
  const hardcodedPassword = "hxrvnhczikjuwlva";

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate credentials
    if (email === hardcodedEmail && password === hardcodedPassword) {
      setError("");
      navigate("/menu"); // Redirect to the menu page
    } else {
      setError("Invalid Email ID or Password. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="logo">
        <h1>
          <span>InVision</span>
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
        />
        <input
          type="password"
          placeholder="Password"
          className="input-field"
          value={password}
          autoComplete="on"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="login-button">
          LOGIN
        </button>
      </form>
      {error && <p className="error-text">{error}</p>}
      <p className="register-text">
        Don't have an account? <a href="#register">REGISTER NOW</a>
      </p>
    </div>
  );
};

export default LoginPage;
