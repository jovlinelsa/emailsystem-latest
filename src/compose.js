import { useState } from "react";
import { Mail, Star } from "lucide-react"; // Importing icons from lucide-react
import "./compose.css";

const Compose = () => {
  const [emailData, setEmailData] = useState({
    description: "",
    to: "",
    subject: "",
    body: "",
  });

  const [file, setFile] = useState(null);
  const [activeFilter, setActiveFilter] = useState("compose"); // Default to "compose" view

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmailData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email Data:", emailData);
    console.log("Attached File:", file);
  };

  const handleDiscard = () => {
    setEmailData({
      description: "",
      to: "",
      subject: "",
      body: "",
    });
    setFile(null);
  };

  return (
    <div className="email-container">
      {/* Navbar */}
      <nav className="navbar">
        <span className="logo">InVision</span>
        <button className="logout-btn">Logout</button>
      </nav>

      <div className="main-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <button
            className={`nav-btn ${activeFilter === "compose" ? "active" : ""}`}
            onClick={() => setActiveFilter("compose")}
          >
            <Mail size={16} /> Compose
          </button>
          <button
            className={`nav-btn ${activeFilter === "starred" ? "active" : ""}`}
            onClick={() => setActiveFilter("starred")}
          >
            <Star size={16} /> Starred
          </button>
          <button
            className={`nav-btn ${activeFilter === "important" ? "active" : ""}`}
            onClick={() => setActiveFilter("important")}
          >
            <Star size={16} /> Important
          </button>
          <button
            className={`nav-btn ${activeFilter === "sent" ? "active" : ""}`}
            onClick={() => setActiveFilter("sent")}
          >
            <Mail size={16} /> Sent
          </button>
        </aside>

        {/* Email Form (shown only when activeFilter is "compose") */}
        {activeFilter === "compose" && (
          <main className="email-form-container">
            <h1 className="form-title">Compose Email</h1>
            <form onSubmit={handleSubmit} className="email-form">
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={emailData.description}
                  onChange={handleChange}
                  placeholder="Describe what you want to say in this email..."
                  className="description-input"
                />
              </div>

              <div className="form-group">
                <label>To:</label>
                <input
                  type="email"
                  name="to"
                  value={emailData.to}
                  onChange={handleChange}
                  placeholder="recipient@example.com"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Subject:</label>
                <input
                  type="text"
                  name="subject"
                  value={emailData.subject}
                  onChange={handleChange}
                  placeholder="Email subject"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Body:</label>
                <textarea
                  name="body"
                  value={emailData.body}
                  readOnly
                  placeholder="Email body will be generated from your description..."
                  className="body-input"
                />
              </div>

              <div className="form-group">
                <label>Attachments:</label>
                <label className="file-label">
                  <input type="file" onChange={handleFileChange} className="file-input" />
                  <span className="file-button">Add Attachment</span>
                </label>
                {file && <div className="file-name">{file.name}</div>}
              </div>

              <div className="button-group">
                <button type="submit" className="send-btn">Send</button>
                <button type="button" className="discard-btn" onClick={handleDiscard}>
                  <span className="icon">🗑</span> Discard
                </button>
              </div>
            </form>
          </main>
        )}
      </div>
    </div>
  );
};

export default Compose;