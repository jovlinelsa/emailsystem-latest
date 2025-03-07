import React, { useState, useEffect } from "react";
import { ArrowLeft, Star, Trash, X } from "lucide-react";
import "./spam.css"; // Reuse the same CSS file

function EmailModal({ email, onClose }) {
  if (!email) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{email.subject}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-content">
          <div className="email-details">
            <p>
              <strong>From:</strong> {email.from}
            </p>
            <p>
              <strong>Date:</strong> {email.date}
            </p>
          </div>
          <div className="email-body">
            <p>{email.snippet}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailItem({ id, from, subject, snippet, date, onClick }) {
  return (
    <div className="email-item" onClick={onClick}>
      <div className="email-content">
        <div className="email-header">
          <h3 className="sender">{from}</h3>
          <span className="date">{date}</span>
        </div>
        <div className="subject">{subject}</div>
        <p className="preview">{snippet}</p>
      </div>
      <div className="email-actions">
        <button
          className="action-button star-button"
          onClick={(e) => {
            e.stopPropagation();
            // Star functionality would go here
          }}
        >
          <Star size={20} />
        </button>
        <button
          className="action-button trash-button"
          onClick={(e) => {
            e.stopPropagation();
            // Delete functionality would go here
          }}
        >
          <Trash size={20} />
        </button>
      </div>
    </div>
  );
}

function SpamPage() {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch emails from the Spam folder
    fetch("http://localhost:5001/get-spam-emails") // Updated endpoint for Spam emails
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setEmails(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="inbox-page">
      <header>
        <div className="header-content">
          <div className="header-left">
            <button className="back-button">
              <ArrowLeft size={24} />
            </button>
            <h1 className="header-title">Spam</h1> {/* Updated title */}
          </div>
          <button className="logout-button">Logout</button>
        </div>
      </header>

      <main>
        <div className="inbox-container">
          <h2 className="page-title">Spam Messages</h2> {/* Updated title */}
          {isLoading ? (
            <p>Loading emails...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : emails.length === 0 ? (
            <p>No mail</p>  /* Display message when no emails are found */
          ) : (
            <div className="email-list">
              {emails.map((email) => (
                <EmailItem
                  key={email.id}
                  {...email}
                  onClick={() => setSelectedEmail(email)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <EmailModal email={selectedEmail} onClose={() => setSelectedEmail(null)} />
    </div>
  );
}

export default SpamPage;
