import React, { useState } from "react";
import "./compose.css";

const Compose = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
        
  const handleGenerateEmail = async () => {
    // Simulate API call to generate email
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt }),
      });
      const data = await response.json();
      setGeneratedEmail(data.email || "Error: Unable to generate email.");
    } catch (error) {
      console.error("Error generating email:", error);
      setGeneratedEmail("Error: Unable to generate email.");
    }
    finally {
      setLoading(false); // Stop loading
    }
  };

  // const handleSendEmail = () => {
  //   alert("Email Sent Successfully!");
  // };

  const handleSendEmail = async () => {
    const emailData = {
      receiverEmail: to,
      subject: subject,
      content: generatedEmail,
      ccEmails: [], // Add CC functionality if needed
    };

    try {
      const response = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert(data.message || "Email Sent Successfully!");
      } else {
        alert(data.error || "Failed to send email.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Error: Unable to send email.");
    }
  };

  return (
    <div className="compose-container">
  {/* Header Section */}
  <header className="header">
    <h1 className="header-title">Email Composer</h1>
    <div className="header-actions">
      <button className="logout-button">Logout</button>
    </div>
  </header>
 <div className="container">
 <div className="sidebar">
    <button className="compose-button">Compose</button>
    <ul className="menu">
      <li className="menu-item active">Inbox</li>
      <li className="menu-item">Spam</li>
      <li className="menu-item">Sent</li>
      <li className="menu-item">Important</li>
      <li className="menu-item">Draft</li>
      <li className="menu-item">Trash</li>
    </ul>
  </div>
  <div className="content">
    {/* Describe the Email Section */}
    <div className="email-description">
      <label htmlFor="userPrompt" className="section-label">
        Describe the Email:
      </label>
      <textarea
        id="userPrompt"
        className="email-textarea"
        rows="4"
        placeholder="Enter a description of the email..."
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
      ></textarea>
      <button className="generate-button" onClick={handleGenerateEmail}>
        Generate Email
      </button>
    </div>

    {/* Display Generated Email Section */}
    {generatedEmail && (
      <div className="generated-content">
        <label htmlFor="generatedEmail" className="section-label">
          Generated Email:
        </label>
        <textarea
          id="generatedEmail"
          className="email-textarea"
          rows="6"
          readOnly
          value={generatedEmail}
        ></textarea>
      </div>
    )}

    {/* Email Compose Section */}
    <div className="email-compose">
      <input
        type="text"
        placeholder="To:"
        className="email-input"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />
      <input
        type="text"
        placeholder="Subject:"
        className="email-input"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <textarea
        placeholder="Enter text ..."
        className="email-textarea"
        value={generatedEmail}
        onChange={(e) => setGeneratedEmail(e.target.value)}
      ></textarea>
      <div className="attachment" >Drop files here to upload</div>
      <div className="action-buttons">
        <button className="send-button" onClick={handleSendEmail}>
          Send
        </button>
        <button className="discard-button">Discard</button>
      </div>
    </div>
  </div>
 </div>
</div>

  );
};

export default Compose;