// import React from "react";
// import { Link } from "react-router-dom";
// import { Inbox, Send, AlertOctagon, Trash } from "lucide-react";
// import "./menu.css";

// export default function MenuPage() {
//   return (
//     <div className="menu-container">
//       {/* Header */}
//       <header className="menu-header">
//         <span className="menu-logo">InVision</span>
//         <Link to="/logout" className="menu-logout">Logout</Link>
//       </header>

//       {/* Main Content */}
//       <main className="menu-main">
//         <h1 className="menu-title">MENU PAGE</h1>
//         <p className="menu-subtitle">What would you like to do?</p>

//         {/* Buttons */}
//         <div className="menu-buttons">
//           <Link to="/inbox" className="menu-btn">
//             <Inbox className="icon" /> Inbox
//           </Link>
//           <Link to="/compose" className="menu-btn">
//             <Send className="icon" /> Compose
//           </Link>
//           <Link to="/spam" className="menu-btn">
//             <AlertOctagon className="icon" /> Spam
//           </Link>
//           <Link to="/trash" className="menu-btn">
//             <Trash className="icon" /> Trash
//           </Link>
//         </div>
//       </main>
//     </div>
//   );
// }




// old working code 

  // import React from "react";
  // import { Link, useNavigate } from "react-router-dom";
  // import { Inbox, Send, AlertOctagon, Trash } from "lucide-react";
  // import "./menu.css";

  // export default function MenuPage() {
  //   const navigate = useNavigate(); // Initialize useNavigate for routing

  //   const handleLogout = () => {
  //     // Perform any necessary logout logic here, such as clearing session or authentication data
  //     navigate("/"); // Redirect to login page
  //   };

  //   return (
  //     <div className="menu-container">
  //       {/* Header */}
  //       <header className="menu-header">
  //         <span className="menu-logo">InVision</span>
  //         <button onClick={handleLogout} className="menu-logout">
  //           Logout
  //         </button>
  //       </header>

  //       {/* Main Content */}
  //       <main className="menu-main">
  //         <h1 className="menu-title">MENU PAGE</h1>
  //         <p className="menu-subtitle">What would you like to do?</p>

  //         {/* Buttons */}
  //         <div className="menu-buttons">
  //           <Link to="/inbox" className="menu-btn">
  //             <Inbox className="icon" /> Inbox
  //           </Link>
  //           <Link to="/compose" className="menu-btn">
  //             <Send className="icon" /> Compose
  //           </Link>
  //           <Link to="/spam" className="menu-btn">
  //             <AlertOctagon className="icon" /> Spam
  //           </Link>
  //           <Link to="/trash" className="menu-btn">
  //             <Trash className="icon" /> Trash
  //           </Link>
  //         </div>
  //       </main>
  //     </div>
  //   );
  // } 


//latest code before integrating voice

// import { Inbox, Send, AlertOctagon, Trash, Mail, Bell } from "lucide-react"
// import { Link, useNavigate } from "react-router-dom";
// import "./menu.css"

// export default function MenuPage() {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     // Add actual logout logic here (e.g., clear tokens, session)
//     localStorage.removeItem('authToken') // Example token removal
//     navigate("/"); // Redirect to login page
//   }

//   return (
//     <div className="menu-container">
//       <header className="app-header">
//         <div className="header-content">
//           <div className="brand-wrapper">
//             <Mail className="brand-icon" />
//             <span className="brand-name">InVision</span>
//           </div>
//           <div className="header-controls">
//             <Bell className="notifications-icon" />
//             <button 
//               onClick={handleLogout}
//               className="logout-button"
//               aria-label="Log out of account"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="main-content">
//         <div className="content-wrapper">
//           <h1 className="main-title">Welcome to InVision Mail</h1>
//           <p className="menu-subtitle">What would you like to do?</p>

//           <div className="menu-grid">
//             <Link to="/inbox" className="menu-card-link">
//               <div className="menu-card">
//                 <div className="card-header">
//                   <div className="icon-wrapper">
//                     <Inbox className="menu-icon" />
//                   </div>
//                   <h2 className="card-title">Inbox</h2>
//                 </div>
//                 <p className="card-description">View and manage your incoming messages</p>
//               </div>
//             </Link>

//             <Link to="/compose" className="menu-card-link">
//               <div className="menu-card">
//                 <div className="card-header">
//                   <div className="icon-wrapper">
//                     <Send className="menu-icon" />
//                   </div>
//                   <h2 className="card-title">Compose</h2>
//                 </div>
//                 <p className="card-description">Create and send new messages</p>
//               </div>
//             </Link>

//             <Link to="/spam" className="menu-card-link">
//               <div className="menu-card">
//                 <div className="card-header">
//                   <div className="icon-wrapper">
//                     <AlertOctagon className="menu-icon" />
//                   </div>
//                   <h2 className="card-title">Spam</h2>
//                 </div>
//                 <p className="card-description">Review filtered spam messages</p>
//               </div>
//             </Link>

//             <Link to="/trash" className="menu-card-link">
//               <div className="menu-card">
//                 <div className="card-header">
//                   <div className="icon-wrapper">
//                     <Trash className="menu-icon" />
//                   </div>
//                   <h2 className="card-title">Trash</h2>
//                 </div>
//                 <p className="card-description">Manage deleted messages</p>
//               </div>
//             </Link>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

import { useEffect } from 'react';
import { Inbox, Send, AlertOctagon, Trash, Mail, Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./menu.css";

export default function MenuPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove token as an example
    navigate("/"); // Redirect to login page
  };

  useEffect(() => {
    // Check for browser support and speak the available options once the page loads
    if ('speechSynthesis' in window) {
      const message = "Welcome to InVision Mail. Your available options are Inbox, Compose, Spam, and Trash. Please choose one.";
      const utterance = new SpeechSynthesisUtterance(message);
      // Optional: adjust utterance properties like rate, pitch, and language
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Speech synthesis is not supported on this browser.");
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="menu-container">
      <header className="app-header">
        <div className="header-content">
          <div className="brand-wrapper">
            <Mail className="brand-icon" />
            <span className="brand-name">InVision</span>
          </div>
          <div className="header-controls">
            <Bell className="notifications-icon" />
            <button 
              onClick={handleLogout}
              className="logout-button"
              aria-label="Log out of account"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="content-wrapper">
          <h1 className="main-title">Welcome to InVision Mail</h1>
          <p className="menu-subtitle">What would you like to do?</p>

          <div className="menu-grid">
            <Link to="/inbox" className="menu-card-link">
              <div className="menu-card">
                <div className="card-header">
                  <div className="icon-wrapper">
                    <Inbox className="menu-icon" />
                  </div>
                  <h2 className="card-title">Inbox</h2>
                </div>
                <p className="card-description">View and manage your incoming messages</p>
              </div>
            </Link>

            <Link to="/compose" className="menu-card-link">
              <div className="menu-card">
                <div className="card-header">
                  <div className="icon-wrapper">
                    <Send className="menu-icon" />
                  </div>
                  <h2 className="card-title">Compose</h2>
                </div>
                <p className="card-description">Create and send new messages</p>
              </div>
            </Link>

            <Link to="/spam" className="menu-card-link">
              <div className="menu-card">
                <div className="card-header">
                  <div className="icon-wrapper">
                    <AlertOctagon className="menu-icon" />
                  </div>
                  <h2 className="card-title">Spam</h2>
                </div>
                <p className="card-description">Review filtered spam messages</p>
              </div>
            </Link>

            <Link to="/trash" className="menu-card-link">
              <div className="menu-card">
                <div className="card-header">
                  <div className="icon-wrapper">
                    <Trash className="menu-icon" />
                  </div>
                  <h2 className="card-title">Trash</h2>
                </div>
                <p className="card-description">Manage deleted messages</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
