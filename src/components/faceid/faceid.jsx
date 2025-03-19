"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom"; // Added Link
import { Scan, User, ShieldCheck } from "lucide-react";
import "./faceid.css";

export default function FaceId() {
  const [scanning, setScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, password } = location.state || {};

  // Start the camera once the video element is available
  useEffect(() => {
    if (cameraActive && videoRef.current) {
      console.log("Starting camera...");
      navigator.mediaDevices
        .getUserMedia({ video: { width: 640, height: 480 } })
        .then((stream) => {
          console.log("Camera stream obtained:", stream);
          setVideoStream(stream);
          videoRef.current.srcObject = stream;
          setScanning(true);
          speak("Please face the camera for recognition");

          const playVideo = () => {
            console.log("Attempting to play video...");
            videoRef.current.play().then(() => {
              console.log("Video is playing successfully.");
            }).catch((err) => {
              console.error("Error playing video:", err);
              setError("Error playing video: " + err.message);
              speak("Error playing video. Please try again.");
            });
          };

          videoRef.current.onloadedmetadata = () => {
            console.log("Video metadata loaded. Video dimensions:", {
              width: videoRef.current.videoWidth,
              height: videoRef.current.videoHeight,
            });
            if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
              console.error("Video dimensions are zero. Stream may not be valid.");
              setError("Video stream is not valid. Please check camera permissions or try again.");
              speak("Video stream is not valid. Please check camera permissions or try again.");
              stopVideo();
              return;
            }
            playVideo();

            setTimeout(() => {
              if (videoRef.current.paused) {
                console.warn("Video is not playing after play() call.");
                setError("Video failed to play. Please try again.");
                speak("Video failed to play. Please try again.");
                stopVideo();
                return;
              }
            }, 1000);

            setTimeout(async () => {
              console.log("Capturing image...");
              const imageData = captureImage();
              if (!imageData) {
                setError("Failed to capture image. Please try again.");
                speak("Failed to capture image. Please try again.");
                console.error("Image capture failed.");
                setScanning(false);
                stopVideo();
                return;
              }

              setScanning(false);
              stopVideo();

              const formData = new FormData();
              formData.append("email", email);
              formData.append("password", password);
              formData.append("image", dataURLtoBlob(imageData));

              try {
                console.log("Sending login request to backend...");
                const response = await fetch("http://localhost:5000/login", {
                  method: "POST",
                  body: formData,
                });
                const result = await response.json();
                console.log("Backend response:", result);

                if (result.status === "success") {
                  setError("");
                  speak(`Login successful. Welcome, ${result.email}`);
                  navigate("/menu");
                } else {
                  setError(result.message);
                  speak(result.message);
                }
              } catch (err) {
                setError("Login failed: " + err.message);
                speak("Login failed. Please try again.");
                console.error("Login request failed:", err);
              }
            }, 7000);
          };

          videoRef.current.oncanplay = () => {
            console.log("Video can play. Ensuring playback...");
            playVideo();
          };

          videoRef.current.onerror = (e) => {
            console.error("Video element error:", e);
            setError("Error with video playback: " + e.message);
            speak("Error with video playback. Please try again.");
          };
        })
        .catch((err) => {
          setError("Error accessing camera: " + err.message);
          speak("Error accessing camera. Please try again.");
          console.error("Camera error:", err);
          setCameraActive(false);
          setScanning(false);
        });
    }
  }, [cameraActive, email, password, navigate]);

  useEffect(() => {
    console.log("Video ref after render:", videoRef.current);
    if (videoRef.current) {
      console.log("Video element dimensions (computed):", {
        width: videoRef.current.offsetWidth,
        height: videoRef.current.offsetHeight,
      });
    }
  }, [cameraActive]);

  const activateCamera = () => {
    if (!email || !password) {
      setError("Missing email or password");
      speak("Missing email or password");
      return;
    }

    setCameraActive(true);
  };

  const captureImage = () => {
    if (!videoRef.current || !videoRef.current.videoWidth || !videoRef.current.videoHeight) {
      console.error("Video element is not ready or not found. Dimensions:", {
        width: videoRef.current?.videoWidth,
        height: videoRef.current?.videoHeight,
      });
      return null;
    }

    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(videoRef.current, 0, 0);
    const imageData = canvas.toDataURL("image/jpeg");
    console.log("Image captured successfully:", imageData.substring(0, 50) + "...");
    return imageData;
  };

  const stopVideo = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
    }
    setCameraActive(false);
    setVideoStream(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  };

  useEffect(() => {
    return () => stopVideo();
  }, [videoStream]);

  return (
    <div className="welcome-container" role="main">
      <div className="decorative-top-right"></div>
      <div className="decorative-bottom-left"></div>

      <div className="content-wrapper">
        <div className="text-section">
          <h1 className="welcome-title" aria-label="Welcome Back">
            Welcome Back!
          </h1>
          <p className="welcome-text" aria-label="Verify your identity">
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
            aria-label={cameraActive ? "Scanning" : "Verify Identity"}
          >
            {cameraActive ? "Scanning..." : "Verify Identity"}
          </button>
          <p className="register-link" aria-live="polite">
            Don't have an account?{" "}
            <Link to="/register" className="register-link-text">
              Register now
            </Link>
          </p>
          {error && (
            <p className="error-text" aria-live="polite">
              {error}
            </p>
          )}
        </div>

        <div className="card-section">
          <div className="card">
            <div className="video-wrapper">
              {cameraActive ? (
                <video
                  ref={videoRef}
                  className="video"
                  autoPlay
                  playsInline
                  muted
                  aria-hidden="true"
                  style={{ width: "100%", height: "100%" }}
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
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>
        </div>
      </div>
    </div>
  );
}