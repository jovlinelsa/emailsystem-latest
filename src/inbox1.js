// import React, { useState, useEffect } from "react";
// import "./inbox1.css";
// import axios from "axios";

// function Inbox() {
//   const [emails, setEmails] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Fetch emails from the backend
//     axios.get("http://localhost:5001/get-emails") // Replace localhost with your backend's URL if deployed
//       .then((response) => {
//         setEmails(response.data); // Save emails to state
//         setLoading(false); // Set loading to false
//       })
//       .catch((error) => {
//         console.error("Error fetching emails:", error);
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <div className="inbox-container">
//       <div className="sidebarinbox">
//         <h2>Inbox</h2>
//         <button className="send-email">Compose</button>
//         <ul className="folder-list">
//           <li className="folder">Inbox</li>
//           <li className="folder">Read</li>
//           <li className="folder">Unread</li>
//           <li className="folder">Drafts</li>
//         </ul>
//         <button className="add-folder">+ Add new folder</button>
//       </div>
//       <div className="main-content">
//         <div className="header">
//           <input
//             className="search-bar"
//             type="text"
//             placeholder="Search your inbox"
//           />
//         </div>
//         <div className="email-list">
//           {loading ? (
//             <p>Loading emails...</p>
//           ) : (
//             emails.map((email) => (
//               <div key={email.id} className="email-item">
//                 {/* <input type="checkbox" className="email-checkbox" /> */}
//                 <div className="email-info">
//                   <h3 className="email-sender">{email.from}</h3>
//                   <p className="email-subject">{email.subject}</p>
//                 </div>
//                 <p className="email-time">{email.date}</p>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Inbox;
