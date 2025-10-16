import React, { useState, useEffect } from "react";
import "@fontsource/press-start-2p"; // Arcade-style font

export default function TerminalLoading({ onFinish }) {
  const messages = [
    "🖊️ Pen & Paper Round done",
    "✅ Task Round done",
    "🎤 Interview Round done",
    "📢 Many participated, but due to limited seats, we have to select the best candidates",
    "💔 To those not selected: You all gave your best! Keep pushing forward!",
    "🎉 Final Result: Selected Candidates"
  ];

  const [typedMessages, setTypedMessages] = useState([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");

  // Auto-type effect for each message
  useEffect(() => {
    if (currentMessageIndex >= messages.length) {
      if (onFinish) onFinish();
      return;
    }

    const timeout = setTimeout(() => {
      setCurrentText((prev) => prev + messages[currentMessageIndex][charIndex]);
      if (charIndex < messages[currentMessageIndex].length - 1) {
        setCharIndex(charIndex + 1);
      } else {
        setTypedMessages((prev) => [...prev, messages[currentMessageIndex]]);
        setCurrentText("");
        setCharIndex(0);
        setCurrentMessageIndex(currentMessageIndex + 1);
      }
    }, 50);

    return () => clearTimeout(timeout);
  }, [charIndex, currentMessageIndex]);

  return (
    <div className="w-full min-h-screen bg-black flex flex-col items-center p-6 relative overflow-hidden">
      {/* Fixed arcade title */}
      <h1 className="fixed top-16 left-1/2 transform -translate-x-1/2 z-20 text-4xl md:text-5xl text-red-500 font-['Press_Start_2P'] text-center">
        FLUX TERMINAL
      </h1>

      {/* Typed messages container */}
      <div className="mt-48 flex flex-col items-center space-y-4 z-10 text-center max-w-3xl">
        {typedMessages.map((msg, idx) => (
          <p
            key={idx}
            className="text-white font-['Press_Start_2P'] text-lg md:text-xl"
          >
            {msg}
          </p>
        ))}

        {currentMessageIndex < messages.length && (
          <p className="text-red-400 font-['Press_Start_2P'] text-lg md:text-xl">
            {currentText}
            <span className="blinking-cursor">█</span>
          </p>
        )}
      </div>

      <style jsx>{`
        .blinking-cursor {
          display: inline-block;
          width: 1ch;
          color: #ff0000;
          animation: blink 0.7s steps(1) infinite;
          margin-left: 2px;
        }
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
