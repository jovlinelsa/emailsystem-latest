// import React, { useEffect, useState } from "react";

// const SpeechAssistant = () => {
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const synth = window.speechSynthesis;

//   useEffect(() => {
//     const loadVoices = () => {
//       const voices = synth.getVoices();
//       if (voices.length > 0) {
//         readPageContent(voices);
//       } else {
//         setTimeout(loadVoices, 100); // Retry voice loading
//       }
//     };

//     const readPageContent = (voices) => {
//       if (synth.speaking) {
//         synth.cancel();
//         setIsSpeaking(false);
//         return;
//       }

//       const text = document.body.innerText.trim(); // Get page content
//       if (!text) return; // Avoid reading empty content

//       const utterance = new SpeechSynthesisUtterance(text);
//       utterance.voice = voices.find(v => v.lang.includes("en")) || voices[0];

//       synth.speak(utterance);
//       setIsSpeaking(true);

//       utterance.onend = () => setIsSpeaking(false);
//     };

//     if (synth.onvoiceschanged !== undefined) {
//       synth.onvoiceschanged = loadVoices;
//     } else {
//       loadVoices();
//     }
//   }, []); // Runs once when the component mounts

//   return null; // No button, no UI
// };

// export default SpeechAssistant;
