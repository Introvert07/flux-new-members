import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import mojs from "@mojs/core";

export default function Final() {
  const members = Array.from({ length: 30 }).map((_, i) => `Player ${i + 1}`);
  const sparkColors = ["#f50707", "#ff4500", "#ffdd00", "#00ffff", "#ff00ff", "#ff99cc"];
  const [typedText, setTypedText] = useState("");

  const directions = ["left", "bottom", "right"]; // left -> bottom -> right pattern

  // Typing effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText("RECRUITMENT DRIVE — 2025".slice(0, index + 1));
      index++;
      if (index === 25) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Continuous bursts
  useEffect(() => {
    const interval = setInterval(() => {
      const burstsCount = 3;
      for (let j = 0; j < burstsCount; j++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * document.body.scrollHeight;

        const burst = new mojs.Burst({
          left: 0,
          top: 0,
          x,
          y,
          radius: { 0: 60 + Math.random() * 50 },
          count: 15 + Math.floor(Math.random() * 15),
          children: {
            shape: ["circle", "cross", "rect"],
            fill: sparkColors[Math.floor(Math.random() * sparkColors.length)],
            radius: 3 + Math.random() * 5,
            duration: 1100 + Math.random() * 800,
            easing: "cubic.out",
          },
        });
        burst.play();
      }
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // Sparkle effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e) => {
      const coords = { x: e.pageX, y: e.pageY };
      const burst = new mojs.Burst({
        left: 0,
        top: 0,
        x: coords.x,
        y: coords.y,
        radius: { 0: 30 },
        count: 8,
        children: {
          shape: "circle",
          fill: sparkColors[Math.floor(Math.random() * sparkColors.length)],
          radius: 3 + Math.random() * 4,
          duration: 500,
          easing: "cubic.out",
        },
      });
      burst.play();
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Hover effect
  const handleHover = (e, i) => {
    const box = document.getElementById(`member-${i}`);
    if (!box) return;
    const rect = box.getBoundingClientRect();
    const x = e.clientX - rect.left;

    let direction = "bottom";
    if (x < rect.width * 0.33) direction = "left";
    else if (x > rect.width * 0.66) direction = "right";

    const fill = document.createElement("div");
    fill.className = "absolute z-0";
    fill.style.background = "rgba(255, 0, 0, 0.5)"; // pure red with transparency
    box.appendChild(fill);

    switch (direction) {
      case "left":
        fill.style.top = "0";
        fill.style.left = "0";
        fill.style.width = "0%";
        fill.style.height = "100%";
        fill.animate([{ width: "0%" }, { width: "100%" }], { duration: 800, fill: "forwards" });
        break;
      case "right":
        fill.style.top = "0";
        fill.style.right = "0";
        fill.style.width = "0%";
        fill.style.height = "100%";
        fill.animate([{ width: "0%" }, { width: "100%" }], { duration: 800, fill: "forwards" });
        break;
      case "bottom":
      default:
        fill.style.bottom = "0";
        fill.style.left = "0";
        fill.style.width = "100%";
        fill.style.height = "0%";
        fill.animate([{ height: "0%" }, { height: "100%" }], { duration: 800, fill: "forwards" });
        break;
    }

    setTimeout(() => {
      box.removeChild(fill);
    }, 1000);
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-start font-['Press_Start_2P'] pt-20 bg-black text-red-400 overflow-x-hidden">
      <motion.h1
        initial={{ opacity: 0, y: -80, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-4xl sm:text-5xl md:text-6xl text-center mb-14 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 drop-shadow-[0_0_25px_#ff0000]"
      >
        WELCOME TO FLUX
        <div className="text-base sm:text-lg md:text-xl mt-3 text-red-300 h-6">
          {typedText}<span className="blinking-cursor">|</span>
        </div>
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl px-4 mb-8">
        {members.map((name, i) => {
          const dir = directions[i % directions.length];
          const initial = {
            opacity: 0,
            x: dir === "left" ? -100 : dir === "right" ? 100 : 0,
            y: dir === "bottom" ? 100 : 0,
          };
          const animate = { opacity: 1, x: 0, y: 0, transition: { duration: 1, ease: "easeOut" } };

          return (
            <motion.div
              id={`member-${i}`}
              key={i}
              initial={initial}
              whileInView={animate}
              viewport={{ once: true, amount: 0.2 }}
              onMouseEnter={(e) => handleHover(e, i)}
              className="relative text-center py-6 px-4 border border-red-500 bg-black/0 rounded-lg backdrop-blur-md shadow-lg cursor-pointer overflow-hidden"
            >
              <motion.div
                className="relative z-10"
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <div className="text-sm sm:text-base tracking-tight text-red-100">{name}</div>
                <div className="text-[10px] mt-1 text-red-200"># {i + 1}</div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <footer className="text-[10px] text-red-500/70 font-mono z-10 text-center pb-4">
        🎆 Developed by <span className="text-red-400">Introvert</span> 
      </footer>

      <style>{`
        html, body { margin: 0; padding: 0; overflow-x: hidden; }
        .blinking-cursor { display:inline-block; width:1ch; animation: blink 1s steps(2, start) infinite; }
        @keyframes blink { 0%, 100% {opacity:1;} 50% {opacity:0;} }
      `}</style>
    </div>
  );
}
