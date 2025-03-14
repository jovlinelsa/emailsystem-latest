"use client";

import { useState, useRef, useEffect } from "react";
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

  useEffect(() => {
    if (cameraActive && videoRef.current) {
      console.log("Starting camera...");
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          console.log("Camera stream obtained:", stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;

            // Wait for the video to be ready before playing
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
              playVideo(); // Play the video once metadata is loaded

              // Check if the video is actually playing
              if (videoRef.current.paused) {
                console.warn("Video is not playing after play() call.");
                setError("Video failed to play. Please try again.");
                speak("Video failed to play. Please try again.");
                return;
              }

              speak("Please face the camera to register your face");
              setTimeout(async () => {
                console.log("Capturing image...");
                const imageData = captureImage();
                if (!imageData) {
                  setError("Failed to capture image.");
                  speak("Failed to capture image.");
                  console.error("Image capture failed.");
                  stopVideo();
                  return;
                }
                stopVideo();

                const formData = new FormData();
                formData.append("email", email);
                formData.append("password", password);
                formData.append("image", dataURLtoBlob(imageData));

                try {
                  console.log("Sending register request to backend...");
                  const response = await fetch("http://localhost:5000/register", {
                    method: "POST",
                    body: formData,
                  });
                  const result = await response.json();
                  console.log("Backend response:", result);
                  setError(result.message);
                  speak(result.message);
                  if (result.status === "success") {
                    navigate("/");
                  }
                } catch (err) {
                  setError("Registration failed: " + err.message);
                  speak("Registration failed. Please try again.");
                  console.error("Registration request failed:", err);
                }
              }, 5000); // Timeout for capturing image
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
          }
        })
        .catch((err) => {
          setError("Error accessing camera: " + err.message);
          speak("Error accessing camera. Please try again.");
          console.error(err);
          setCameraActive(false);
        });
    }
  }, [cameraActive, email, password, navigate]);

  // Debug videoRef after render
  useEffect(() => {
    console.log("Video ref after render:", videoRef.current);
    if (videoRef.current) {
      console.log("Video element dimensions (computed):", {
        width: videoRef.current.offsetWidth,
        height: videoRef.current.offsetHeight,
      });
    }
  }, [cameraActive]);

  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
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
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    const imageData = canvas.toDataURL("image/jpeg");
    console.log("Image captured successfully:", imageData);
    return imageData;
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      speak("Please enter both email and password.");
      return;
    }

    setError("Capturing face...");
    setCameraActive(true);
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
  }, []);

  return (
    <div className="welcome-container" role="main">
      <div className="decorative-top-right"></div>
      <div className="decorative-bottom-left"></div>

      <div className="content-wrapper">
        <div className="text-section">
          <h1 className="welcome-title" aria-label="Welcome to InVision">
            Welcome to InVision
          </h1>
          <p className="welcome-text" aria-label="Please add your email ID and password then registering of face">
            Please add your email ID and password then registering of face
          </p>
          <form className="register-form" onSubmit={handleRegister}>
            <input
              type="email"
              placeholder="Email ID"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email ID"
            />
            <input
              type="password"
              placeholder="Password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password"
            />
            <button
              type="submit"
              className="verify-button"
              aria-label="Register"
              disabled={cameraActive}
            >
              {cameraActive ? "Registering..." : "Register"}
            </button>
          </form>
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
                  muted // Add muted to ensure autoplay works in some browsers
                  aria-hidden="true"
                />
              ) : (
                <div className="video-placeholder">
                  <User className="user-icon" />
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
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default Register;