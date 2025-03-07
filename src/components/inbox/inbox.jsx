// import React, { useState, useEffect } from "react";
// import { Mail, Star } from "lucide-react";
// import "./inbox.css";

// const Inbox = () => {
//   const [emails, setEmails] = useState([
//     {
//       id: 1,
//       from: "John Doe",
//       subject: "Project Update",
//       preview: "I wanted to share the latest updates on our project...",
//       date: "10:30 AM",
//       read: false,
//       starred: true,
//       important: true,
//       content: `Hi there,\nI wanted to share the latest updates on our project. We've made significant progress on the frontend implementation and are now ready to move to the next phase.\n\nThe team has completed all the required components and they're now fully accessible. We've also addressed all the feedback from the last review.\n\nLet me know if you have any questions or concerns.\nBest regards,`,
//     },
//     {
//       id: 2,
//       from: "Jane Smith",
//       subject: "Meeting Reminder",
//       preview: "Just a reminder about our meeting tomorrow at 2 PM...",
//       date: "Yesterday",
//       read: true,
//       starred: false,
//       important: true,
//       content: `Hello,\nJust a reminder about our meeting tomorrow at 2 PM...`,
//     },
//     {
//       id: 3,
//       from: "Alex Johnson",
//       subject: "Design Feedback",
//       preview: "I've reviewed the latest designs and have some feedback...",
//       date: "Jul 15",
//       read: true,
//       starred: false,
//       important: false,
//       content: `Hi,\nI've reviewed the latest designs and have some feedback...`,
//     },
//     {
//       id: 4,
//       from: "Sarah Williams",
//       subject: "New Feature Request",
//       preview: "I wanted to discuss a new feature request...",
//       date: "Jul 14",
//       read: true,
//       starred: false,
//       important: false,
//       content: `Hi,\nI wanted to discuss a new feature request...`,
//     },
//   ]);

//   const [activeFilter, setActiveFilter] = useState("inbox");
//   const [selectedEmail, setSelectedEmail] = useState(emails[0]);

//   const filteredEmails = () => {
//     if (activeFilter === "starred") return emails.filter((email) => email.starred);
//     if (activeFilter === "important") return emails.filter((email) => email.important);
//     if (activeFilter === "sent") return emails.filter((email) => email.sent); // Add sent filter logic if needed
//     return emails;
//   };

//   const getInitial = (name) => name.charAt(0).toUpperCase();

//   return (
//     <div className="inbox-app">
//       <div className="navbar">
//         <span className="logo">InVision</span>
//         <button className="logout-btn">Logout</button>
//       </div>
//       <div className="main-content">
//         <div className="sidebar">
//           <button
//             className={`nav-btn ${activeFilter === "inbox" ? "active" : ""}`}
//             onClick={() => setActiveFilter("inbox")}
//           >
//             <Mail size={16} /> Inbox
//           </button>
//           <button
//             className={`nav-btn ${activeFilter === "starred" ? "active" : ""}`}
//             onClick={() => setActiveFilter("starred")}
//           >
//             <Star size={16} /> Starred
//           </button>
//           <button
//             className={`nav-btn ${activeFilter === "important" ? "active" : ""}`}
//             onClick={() => setActiveFilter("important")}
//           >
//             <Star size={16} /> Important
//           </button>
//           <button
//             className={`nav-btn ${activeFilter === "sent" ? "active" : ""}`}
//             onClick={() => setActiveFilter("sent")}
//           >
//             <Mail size={16} /> Sent
//           </button>
//         </div>
//         <div className="email-list">
//           <ul>
//             {filteredEmails().map((email) => (
//               <li
//                 key={email.id}
//                 className={`email-item ${email.read ? "read" : "unread"} ${
//                   selectedEmail?.id === email.id ? "selected" : ""
//                 }`}
//                 onClick={() => setSelectedEmail(email)}
//               >
//                 <div className="email-header">
//                   <div className="email-sender-wrapper">
//                     <span className="email-initial">{getInitial(email.from)}</span>
//                     <span className="email-sender">{email.from}</span>
//                   </div>
//                   <span className="email-date">{email.date}</span>
//                 </div>
//                 <div className="email-subject">{email.subject}</div>
//                 <div className="email-preview">{email.preview}</div>
//               </li>
//             ))}
//           </ul>
//         </div>
//         <div className="email-content">
//           <h2>{selectedEmail?.subject || "Project Update"}</h2>
//           <p><strong>From:</strong> {selectedEmail?.from || "John Doe"}</p>
//           <p>{selectedEmail?.content || "Select an email to view its contents"}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Inbox;


import React, { useState, useEffect } from "react";
import { Mail, Star } from "lucide-react";
import "./inbox.css";

const Inbox = () => {
  const [emails, setEmails] = useState([
    {
      id: 1,
      from: "John Doe",
      subject: "Project Update",
      preview: "I wanted to share the latest updates on our project...",
      date: "10:30 AM",
      read: false,
      starred: true,
      important: true,
      content: `Hi there,\nI wanted to share the latest updates on our project. We've made significant progress on the frontend implementation and are now ready to move to the next phase.\n\nThe team has completed all the required components and they're now fully accessible. We've also addressed all the feedback from the last review.\n\nLet me know if you have any questions or concerns.\nBest regards,`,
    },
    {
      id: 2,
      from: "Jane Smith",
      subject: "Meeting Reminder",
      preview: "Just a reminder about our meeting tomorrow at 2 PM...",
      date: "Yesterday",
      read: true,
      starred: false,
      important: true,
      content: `Hello,\nJust a reminder about our meeting tomorrow at 2 PM...`,
    },
    {
      id: 3,
      from: "Alex Johnson",
      subject: "Design Feedback",
      preview: "I've reviewed the latest designs and have some feedback...",
      date: "Jul 15",
      read: true,
      starred: false,
      important: false,
      content: `Hi,\nI've reviewed the latest designs and have some feedback...`,
    },
    {
      id: 4,
      from: "Sarah Williams",
      subject: "New Feature Request",
      preview: "I wanted to discuss a new feature request...",
      date: "Jul 14",
      read: true,
      starred: false,
      important: false,
      content: `Hi,\nI wanted to discuss a new feature request...`,
    },
  ]);

  const [activeFilter, setActiveFilter] = useState("inbox");
  const [selectedEmail, setSelectedEmail] = useState(emails[0]);

  const filteredEmails = () => {
    if (activeFilter === "starred") return emails.filter((email) => email.starred);
    if (activeFilter === "important") return emails.filter((email) => email.important);
    if (activeFilter === "sent") return emails.filter((email) => email.sent);
    return emails;
  };

  const getInitial = (name) => name.charAt(0).toUpperCase();

  return (
    <div className="inbox-app">
      <div className="navbar">
        <span className="logo">InVision</span>
        <button className="logout-btn">Logout</button>
      </div>
      <div className="main-content">
        <div className="sidebar">
          <button
            className={`nav-btn ${activeFilter === "inbox" ? "active" : ""}`}
            onClick={() => setActiveFilter("inbox")}
          >
            <Mail size={16} /> Inbox
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
        </div>
        <div className="email-list">
          <ul>
            {filteredEmails().map((email) => (
              <li
                key={email.id}
                className={`email-item ${email.read ? "read" : "unread"} ${
                  selectedEmail?.id === email.id ? "selected" : ""
                }`}
                onClick={() => setSelectedEmail(email)}
              >
                <div className="email-header">
                  <div className="email-sender-wrapper">
                    <span className="email-initial">{getInitial(email.from)}</span>
                    <span className="email-sender">{email.from}</span>
                  </div>
                  <span className="email-date">{email.date}</span>
                </div>
                <div className="email-subject">{email.subject}</div>
                <div className="email-preview">{email.preview}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="email-content">
          {selectedEmail ? (
            <div className="email-detail">
              <div className="email-detail-header">
                <h2 className="email-detail-subject">{selectedEmail.subject}</h2>
                <span className="email-detail-date">{selectedEmail.date}</span>
              </div>
              <p>
                <strong>From:</strong> {selectedEmail.from}
              </p>
              <div className="email-detail-content">
                {selectedEmail.content.split("\n").map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
          ) : (
            <p className="empty-state">Select an email to view its contents</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inbox;