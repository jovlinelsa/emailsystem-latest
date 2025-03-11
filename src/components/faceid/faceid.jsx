"use client";

import { useState, useEffect } from "react";
import { Scan, User, ShieldCheck } from "lucide-react";
import "./faceid.css";
export default function FaceId() {
  const [scanning, setScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const [error, setError] = useState(null);

  // Handle camera activation
  const activateCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream);
      setCameraActive(true);
      setScanning(true);

      // Simulate scan completion after 3 seconds
      setTimeout(() => {
        setScanning(false);
        if (stream) stream.getTracks().forEach((track) => track.stop());
        setCameraActive(false);
        setVideoStream(null);
      }, 3000);
    } catch (err) {
      setError("Error accessing camera: " + err.message);
      console.error("Camera error:", err);
    }
  };

  // Clean up video stream when component unmounts
  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [videoStream]);

  return (
    <div className="welcome-container">
      {/* Decorative elements */}
      <div className="decorative-top-right"></div>
      <div className="decorative-bottom-left"></div>

      <div className="content-wrapper">
        <div className="text-section">
          <h1 className="welcome-title">Welcome Back!</h1>
          <p className="welcome-text">
            We've been expecting you. Please verify your identity to continue.
          </p>
          <div className="verify-info">
            <ShieldCheck className="shield-icon" />
            <span className="verify-text">Secure Face Recognition</span>
          </div>
          <button
            onClick={activateCamera}
            disabled={cameraActive}
            className="verify-button"
          >
            {cameraActive ? "Scanning..." : "Verify Identity"}
          </button>
          {error && <p className="error-text">{error}</p>}
        </div>

        <div className="card-section">
          <div className="card">
            <div className="video-wrapper">
              {cameraActive && videoStream ? (
                <video
                  ref={(videoElement) => {
                    if (videoElement && videoStream) {
                      videoElement.srcObject = videoStream;
                      videoElement.play().catch((err) =>
                        console.error("Video play error:", err)
                      );
                    }
                  }}
                  className="video"
                />
              ) : (
                <div className="video-placeholder">
                  <User className="user-icon" />
                </div>
              )}

              {scanning && (
                <div className="scanning-overlay">
                  <div className="scanning-line"></div>
                  <div className="scanning-text">
                    <Scan className="scan-icon" />
                    <span>Scanning...</span>
                  </div>
                </div>
              )}

              

              <div className="corner-accent top-left"></div>
              <div className="corner-accent top-right"></div>
              <div className="corner-accent bottom-left"></div>
              <div className="corner-accent bottom-right"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



