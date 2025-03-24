"use client";

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import "./register.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const startCamera = async () => {
    try {
      console.log("Starting camera...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        console.log("Camera started successfully.");
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Camera access denied. Please allow camera permissions.");
      setCameraActive(false);
    }
  };

  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const captureImage = () => {
    if (!videoRef.current) {
      setError("Video element is not ready.");
      return null;
    }

    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(videoRef.current, 0, 0);

    return canvas.toDataURL("image/jpeg");
  };

  const dataURLtoBlob = (dataurl) => {
    const [meta, base64] = dataurl.split(",");
    const mime = meta.match(/:(.*?);/)[1];
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
    return new Blob([array], { type: mime });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setError(""); // Clear any previous error
    setCameraActive(true);

    try {
      await startCamera();
      setTimeout(async () => {
        console.log("Capturing image...");
        const imageData = captureImage();
        
        if (!imageData) {
          setError("Failed to capture image.");
          stopVideo();
          return;
        }

        stopVideo();

        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("image", dataURLtoBlob(imageData));

        console.log("Sending register request to backend...");
        const response = await fetch("http://localhost:5000/register", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();
        console.log("Backend response:", result);
        if (result.status === "success") {
          navigate("/");
        } else {
          setError(result.message);
        }
      }, 2000); // Reduced delay for better user experience
    } catch (err) {
      setError("Registration failed: " + err.message);
      console.error("Registration request failed:", err);
      stopVideo();
    }
  };

  return (
    <div className="welcome-container" role="main">
      <div className="decorative-top-right"></div>
      <div className="decorative-bottom-left"></div>

      <div className="content-wrapper">
        <div className="text-section">
          <h1 className="welcome-title">Welcome to InVision</h1>
          <p className="welcome-text">
            Please add your email ID and password before registering your face.
          </p>
          <form className="register-form" onSubmit={handleRegister}>
            <input
              type="email"
              placeholder="Email ID"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="verify-button" disabled={cameraActive}>
              {cameraActive ? "Registering..." : "Register"}
            </button>
          </form>
          {error && <p className="error-text">{error}</p>}
        </div>

        <div className="card-section">
          <div className="card">
            <div className="video-wrapper">
              {cameraActive ? (
                <video ref={videoRef} className="video" autoPlay playsInline muted />
              ) : (
                <div className="video-placeholder">
                  <User className="user-icon" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default Register;
