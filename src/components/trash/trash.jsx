import React, { useState, useEffect, useRef } from "react";
import { Trash2 } from "lucide-react"; // Changed icon to Trash2 for Trash page
import { useNavigate } from "react-router-dom";
import "./trash.css";

const Trash = () => {
  const navigate = useNavigate();
  const [trashEmails, setTrashEmails] = useState(null);
  const [selectedTrashEmail, setSelectedTrashEmail] = useState(null);
  const [currentTrashEmailIndex, setCurrentTrashEmailIndex] = useState(0);
  const recognitionRef = useRef(null);
  const abortControllerRef = useRef(null);
  const phaseRef = useRef("main");

  const formatDate = (rawDate) => {
    if (!rawDate) return "Unknown Date";
    const parts = rawDate.split(" ");
    if (parts.length > 5) {
      parts.pop();
    }
    return parts.join(" ");
  };

  const speak = (text, onEnd) => {
    stopSpeech();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    if (onEnd) utterance.onend = onEnd;
    window.speechSynthesis.speak(utterance);
    return utterance;
  };

  const speakLongContent = (text, onEnd) => {
    stopSpeech();
    const maxLength = 200;
    const chunks = [];
    for (let i = 0; i < text.length; i += maxLength) {
      chunks.push(text.slice(i, i + maxLength));
    }
    console.log(`Speaking ${chunks.length} chunks for content length ${text.length}`);

    let currentChunk = 0;
    const speakNextChunk = () => {
      if (currentChunk >= chunks.length) {
        console.log("All chunks spoken, calling onEnd");
        if (onEnd) onEnd();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunks[currentChunk]);
      utterance.lang = "en-US";
      utterance.onend = () => {
        console.log(`Chunk ${currentChunk + 1}/${chunks.length} completed`);
        currentChunk++;
        speakNextChunk();
      };
      utterance.onerror = (event) => {
        console.error(`Speech error on chunk ${currentChunk}:`, event.error);
        if (event.error === "interrupted" || event.error === "canceled") {
          speakNextChunk();
        }
      };
      console.log(`Speaking chunk ${currentChunk + 1}/${chunks.length}: ${chunks[currentChunk].substring(0, 30)}...`);
      window.speechSynthesis.speak(utterance);
    };

    speakNextChunk();
  };

  const startRecognition = (onResult) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported.");
      speak("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .trim();
      console.log(`Recognized in ${phaseRef.current} phase: ${transcript}`);
      onResult(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      speak("Sorry, I couldn't understand. Please try again.", () => startRecognition(onResult));
    };

    recognition.onend = () => {
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
  };

  const fetchTrashEmails = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      const endpoint = "get-trash-emails"; // Changed to trash endpoint
      console.log(`Starting fetch from ${endpoint}`);
      setTrashEmails(null);
      setSelectedTrashEmail(null);
      setCurrentTrashEmailIndex(0);

      const response = await fetch(`http://localhost:5001/${endpoint}`, { signal });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      console.log(`Fetched ${data.length} emails:`, data);

      const mappedEmails = data.map((email) => ({
        id: email.id,
        from: email.from, // Changed from 'to' to 'from' for Trash (received emails)
        subject: email.subject || "No Subject",
        preview: email.content || "No preview available",
        content: email.content || "No content available",
        date: formatDate(email.date),
        read: true,
      }));

      if (abortControllerRef.current.signal.aborted) return;
      setTrashEmails(mappedEmails);
      return mappedEmails;
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted");
        return;
      }
      console.error("Error fetching emails:", error);
      setTrashEmails([]);
      setSelectedTrashEmail(null);
      throw error;
    }
  };

  const handleTrashEmailCommands = (command, emailList, index) => {
    switch (command) {
      case "read":
        phaseRef.current = "content";
        setSelectedTrashEmail(emailList[index]);
        speakLongContent(emailList[index].content, () => {
          speak("Say 'next' for the next email, 'back' to return to the email list, or 'repeat' to hear this again.", () =>
            startRecognition((cmd) => handleTrashContentCommands(cmd, emailList[index], emailList, index))
          );
        });
        break;
      case "next":
        readTrashEmail(emailList, index + 1);
        break;
      case "stop":
        phaseRef.current = "main";
        speak("Returning to main menu.", () => startRecognition(handleMainTrashCommands));
        break;
      default:
        speak("Command not recognized. Say 'read', 'next', or 'stop'.", () =>
          startRecognition((cmd) => handleTrashEmailCommands(cmd, emailList, index))
        );
    }
  };

  const handleTrashContentCommands = (command, email, emailList, index) => {
    switch (command) {
      case "next":
        phaseRef.current = "reading";
        readTrashEmail(emailList, index + 1);
        break;
      case "back":
        phaseRef.current = "reading";
        readTrashEmail(emailList, index);
        break;
      case "repeat":
        speakLongContent(email.content, () => {
          speak("Say 'next' for the next email, 'back' to return to the email list, or 'repeat' to hear this again.", () =>
            startRecognition((cmd) => handleTrashContentCommands(cmd, email, emailList, index))
          );
        });
        break;
      default:
        speak("Command not recognized. Say 'next', 'back', or 'repeat'.", () =>
          startRecognition((cmd) => handleTrashContentCommands(cmd, email, emailList, index))
        );
    }
  };

  const readTrashEmail = (emailList, index) => {
    if (index >= emailList.length) {
      speak("No more emails to read. Returning to main menu.", () => {
        phaseRef.current = "main";
        startRecognition(handleMainTrashCommands);
      });
      return;
    }

    const email = emailList[index];
    setCurrentTrashEmailIndex(index);
    const text = `Subject: ${email.subject}. From: ${email.from}. Say 'read' to hear the full content, 'next' for the next email, or 'stop' to return to main commands.`;
    speak(text, () => startRecognition((command) => handleTrashEmailCommands(command, emailList, index)));
  };

  useEffect(() => {
    const initialize = () => {
      const welcomeMessage = "Welcome to InVision Trash Emails. Available commands: 'go to trash', 'menu', 'logout', or 'help' for command list.";
      speak(welcomeMessage, () => {
        phaseRef.current = "main";
        startRecognition(handleMainTrashCommands);
      });
    };
    initialize();

    return () => stopSpeech();
  }, []);

  const handleMainTrashCommands = (command) => {
    const normalizedCommand = command.toLowerCase().trim();
    const includesAny = (str, terms) => terms.some((term) => str.includes(term));

    switch (true) {
      case normalizedCommand === "go to trash":
        phaseRef.current = "reading";
        fetchTrashEmails()
          .then((fetchedEmails) => {
            if (fetchedEmails && fetchedEmails.length > 0) {
              readTrashEmail(fetchedEmails, 0);
            } else {
              speak("No emails found in trash. Returning to main menu.", () => {
                phaseRef.current = "main";
                startRecognition(handleMainTrashCommands);
              });
            }
          })
          .catch(() => {
            speak("Error fetching trash emails. Returning to main menu.", () => {
              phaseRef.current = "main";
              startRecognition(handleMainTrashCommands);
            });
          });
        break;
      case normalizedCommand === "menu":
        stopSpeech();
        speak("Navigating to menu.", () => navigate("/menu"));
        break;
      case includesAny(normalizedCommand, ["logout", "log out", "sign out", "signout"]):
        stopSpeech();
        speak("Logging out.", () => {
          localStorage.removeItem("authToken");
          navigate("/");
        });
        break;
      case normalizedCommand === "help":
        speak(
          "Available commands: 'go to trash', 'menu', 'logout'",
          () => startRecognition(handleMainTrashCommands)
        );
        break;
      default:
        speak("Command not recognized. Say 'help' for options.", () => startRecognition(handleMainTrashCommands));
    }
  };

  const getInitial = (name) => {
    const namePart = name.split("<")[0].trim();
    return namePart.charAt(0).toUpperCase();
  };

  return (
    <div className="trash-app">
      <div className="trash-navbar">
        <span className="trash-logo">InVision</span>
        <button className="trash-logout-btn" onClick={() => navigate("/")}>
          Logout
        </button>
      </div>
      <div className="trash-main-content">
        <div className="trash-sidebar">
          <button className="trash-nav-btn active" onClick={() => fetchTrashEmails()}>
            <Trash2 size={16} /> Trash
          </button>
        </div>
        <div className="trash-email-list">
          <ul>
            {trashEmails && trashEmails.length > 0 ? (
              trashEmails.map((email) => (
                <li
                  key={email.id}
                  className={`trash-email-item ${email.read ? "read" : "unread"} ${
                    selectedTrashEmail?.id === email.id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedTrashEmail(email)}
                >
                  <div className="trash-email-header">
                    <div className="trash-email-recipient-wrapper">
                      <span className="trash-email-initial">{getInitial(email.from)}</span>
                      <span className="trash-email-recipient">{email.from}</span>
                    </div>
                    <span className="trash-email-date">{email.date}</span>
                  </div>
                  <div className="trash-email-subject">{email.subject}</div>
                  <div className="trash-email-preview">{email.preview}</div>
                </li>
              ))
            ) : (
              <li className="trash-email-item">No emails loaded yet</li>
            )}
          </ul>
        </div>
        <div className="trash-email-content">
          {selectedTrashEmail ? (
            <div className="trash-email-detail">
              <div className="trash-email-detail-header">
                <h2 className="trash-email-detail-subject">{selectedTrashEmail.subject}</h2>
                <span className="trash-email-detail-date">{selectedTrashEmail.date}</span>
              </div>
              <p>
                <strong>From:</strong> {selectedTrashEmail.from}
              </p>
              <div className="trash-email-detail-content">
                {selectedTrashEmail.content.split("\n").map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
          ) : (
            <p className="trash-empty-state">Select an email to view its contents</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trash;